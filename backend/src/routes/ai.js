import { Router } from "express";
import { z } from "zod";
import { db } from "../db.js";
import { authRequired, authOptional } from "../middleware/auth.js";
import { analyzeDocument, parseVoiceToLand, simulateYield } from "../ai/service.js";

const router = Router();

const simulateSchema = z.object({
  crop_type: z.string().min(2),
  surface_ha: z.number().positive(),
  has_water: z.boolean().optional(),
  region: z.string().optional(),
});

// POST /api/ai/simulate-yield — simulateur ROI standalone
router.post("/simulate-yield", (req, res) => {
  const parsed = simulateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  res.json(simulateYield(parsed.data));
});

// POST /api/ai/analyze-document — extraction manuelle (ex: front envoie infos déjà)
const analyzeSchema = z.object({
  filename: z.string(),
  type: z.enum(["titre", "note_renseignement", "plan_amenagement", "moulkia", "autre"]),
  landHint: z
    .object({
      region: z.string().optional(),
      crop_type: z.string().optional(),
      surface_ha: z.number().optional(),
    })
    .optional(),
});

router.post("/analyze-document", authOptional, async (req, res) => {
  const parsed = analyzeSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const result = await analyzeDocument(parsed.data);
  res.json(result);
});

// POST /api/ai/voice-to-land — partenaire WhatsApp bot
const voiceSchema = z.object({
  audio_url: z.string().url().optional(),
  transcript: z.string().optional(),
  user_whatsapp: z.string().optional(),
});

router.post("/voice-to-land", async (req, res) => {
  const parsed = voiceSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const result = await parseVoiceToLand(parsed.data);
  res.json(result);
});

// POST /api/whatsapp/webhook — endpoint d'ingestion pour le bot de ton pote
// Payload attendu: { user_whatsapp, audio_url?, transcript?, documents?: [url] }
router.post("/whatsapp/webhook", async (req, res) => {
  const { user_whatsapp, audio_url, transcript, documents = [] } = req.body || {};
  if (!user_whatsapp) return res.status(400).json({ error: "user_whatsapp requis" });

  // Cherche ou crée le paysan par whatsapp
  let user = db.prepare("SELECT * FROM users WHERE whatsapp = ? AND role = 'agriculteur'").get(user_whatsapp);
  if (!user) {
    const r = db
      .prepare(
        `INSERT INTO users (role, nom, email, password_hash, whatsapp, plan)
         VALUES ('agriculteur', ?, ?, '!whatsapp-only', ?, 'free')`
      )
      .run(`Paysan ${user_whatsapp.slice(-4)}`, `wa_${user_whatsapp}@ardmarket.ma`, user_whatsapp);
    user = db.prepare("SELECT * FROM users WHERE id = ?").get(r.lastInsertRowid);
  }

  const parsed = await parseVoiceToLand({ audio_url, transcript });
  const p = parsed.parsed;

  const result = db
    .prepare(
      `INSERT INTO lands (owner_id, title, description, region, surface_ha, mode, crop_type, has_water, status, legal_score)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', 40)`
    )
    .run(
      user.id,
      p.title,
      `Créé automatiquement via WhatsApp. Transcript: "${parsed.transcript}"`,
      p.region,
      p.surface_ha || 1,
      p.mode,
      p.crop_type,
      p.has_water ? 1 : 0
    );

  db.prepare(
    "INSERT INTO whatsapp_messages (user_whatsapp, audio_url, transcript, parsed_json, land_id) VALUES (?, ?, ?, ?, ?)"
  ).run(user_whatsapp, audio_url ?? null, parsed.transcript, JSON.stringify(parsed.parsed), result.lastInsertRowid);

  res.status(201).json({
    ok: true,
    user_id: user.id,
    land_id: result.lastInsertRowid,
    parsed,
    documents_registered: documents.length,
  });
});

export default router;
