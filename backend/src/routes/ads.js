import { Router } from "express";
import { z } from "zod";
import { db } from "../db.js";
import { authRequired, requireRole } from "../middleware/auth.js";

const router = Router();

// GET /api/ads — liste les ads actives (publique)
router.get("/ads", (req, res) => {
  const { category } = req.query;
  const where = ["active = 1"];
  const params = [];
  if (category) {
    where.push("category = ?");
    params.push(category);
  }
  const rows = db
    .prepare(
      `SELECT * FROM ads WHERE ${where.join(" AND ")} ORDER BY boost_level DESC, created_at DESC LIMIT 50`
    )
    .all(...params);
  res.json({ items: rows });
});

const adSchema = z.object({
  category: z.enum(["intrants", "machines", "engrais", "semences", "notaire", "autre"]),
  title: z.string().min(3),
  description: z.string().optional(),
  image_url: z.string().url().optional(),
  target_url: z.string().url().optional(),
  boost_level: z.number().int().min(0).max(10).optional(),
});

// POST /api/ads — fournisseur ou notaire crée une pub
router.post("/ads", authRequired, requireRole("fournisseur", "notaire", "admin"), (req, res) => {
  const parsed = adSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const d = parsed.data;
  const r = db
    .prepare(
      `INSERT INTO ads (advertiser_id, category, title, description, image_url, target_url, boost_level)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(req.user.id, d.category, d.title, d.description ?? null, d.image_url ?? null, d.target_url ?? null, d.boost_level ?? 0);
  const ad = db.prepare("SELECT * FROM ads WHERE id = ?").get(r.lastInsertRowid);
  res.status(201).json(ad);
});

export default router;
