import { Router } from "express";
import { z } from "zod";
import { db } from "../db.js";
import { authRequired, authOptional, requireRole } from "../middleware/auth.js";
import { upload, publicUrl } from "../lib/upload.js";
import { analyzeDocument, computeLegalScore, rankLandsForInvestor, simulateYield } from "../ai/service.js";

const router = Router();

function attachComputed(land, req) {
  if (!land) return land;
  const images = db.prepare("SELECT id, url FROM land_images WHERE land_id = ?").all(land.id);
  const documents = db.prepare("SELECT id, type, url, extracted_json FROM land_documents WHERE land_id = ?").all(land.id);
  const owner = db.prepare("SELECT id, nom, region, plan, boost_expires_at FROM users WHERE id = ?").get(land.owner_id);

  // Contact masqué par défaut
  let owner_contact = { masked: true };
  const viewerId = req?.user?.id;
  if (viewerId && viewerId === land.owner_id) {
    owner_contact = { masked: false, phone: owner?.phone, whatsapp: owner?.whatsapp };
  } else if (viewerId) {
    const unlocked = db
      .prepare("SELECT id FROM contact_unlocks WHERE investor_id = ? AND land_id = ?")
      .get(viewerId, land.id);
    if (unlocked) {
      const full = db.prepare("SELECT phone, whatsapp FROM users WHERE id = ?").get(land.owner_id);
      owner_contact = { masked: false, phone: full?.phone, whatsapp: full?.whatsapp };
    }
  }

  return {
    ...land,
    has_water: !!land.has_water,
    images,
    documents: documents.map((d) => ({ ...d, extracted_json: safeParse(d.extracted_json) })),
    owner,
    owner_contact,
  };
}

function safeParse(json) {
  if (!json) return null;
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// GET /api/lands — recherche + filtres (public)
router.get("/", authOptional, (req, res) => {
  const {
    q,
    region,
    crop_type,
    mode,
    has_water,
    surface_min,
    surface_max,
    price_min,
    price_max,
    status,
    sort,
  } = req.query;

  const where = [];
  const params = [];

  // Par défaut on ne montre que les terres validées au public (sauf si owner/admin)
  if (status) {
    where.push("status = ?");
    params.push(status);
  } else {
    where.push("status IN ('validated','pending')");
  }
  if (q) {
    where.push("(title LIKE ? OR description LIKE ? OR commune LIKE ?)");
    const like = `%${q}%`;
    params.push(like, like, like);
  }
  if (region) {
    where.push("region = ?");
    params.push(region);
  }
  if (crop_type) {
    where.push("crop_type = ?");
    params.push(crop_type);
  }
  if (mode) {
    where.push("mode = ?");
    params.push(mode);
  }
  if (has_water !== undefined) {
    where.push("has_water = ?");
    params.push(has_water === "true" || has_water === "1" ? 1 : 0);
  }
  if (surface_min) {
    where.push("surface_ha >= ?");
    params.push(Number(surface_min));
  }
  if (surface_max) {
    where.push("surface_ha <= ?");
    params.push(Number(surface_max));
  }
  if (price_min) {
    where.push("COALESCE(price_per_year, price_sale) >= ?");
    params.push(Number(price_min));
  }
  if (price_max) {
    where.push("COALESCE(price_per_year, price_sale) <= ?");
    params.push(Number(price_max));
  }

  // Tri: boost en priorité, puis par date
  const orderBy =
    sort === "price_asc"
      ? "COALESCE(price_per_year, price_sale) ASC"
      : sort === "price_desc"
      ? "COALESCE(price_per_year, price_sale) DESC"
      : sort === "surface_desc"
      ? "surface_ha DESC"
      : "(boost_expires_at IS NOT NULL AND boost_expires_at > datetime('now')) DESC, created_at DESC";

  const sql = `SELECT * FROM lands WHERE ${where.join(" AND ")} ORDER BY ${orderBy} LIMIT 100`;
  const rows = db.prepare(sql).all(...params);
  res.json({ count: rows.length, items: rows.map((l) => attachComputed(l, req)) });
});

// GET /api/lands/recommendations — matching IA pour investisseur connecté
router.get("/recommendations", authRequired, requireRole("investisseur", "admin"), (req, res) => {
  const { region, crop_type, budget_max, surface_min } = req.query;
  const lands = db
    .prepare("SELECT * FROM lands WHERE status IN ('validated','pending') LIMIT 200")
    .all();
  const preferences = {
    region: region || req.user.region,
    crop_type,
    budget_max: budget_max ? Number(budget_max) : undefined,
    surface_min: surface_min ? Number(surface_min) : undefined,
  };
  const ranked = rankLandsForInvestor(lands, preferences).slice(0, 12);
  res.json({ preferences, items: ranked.map((l) => attachComputed(l, req)) });
});

// GET /api/lands/:id — détail
router.get("/:id", authOptional, (req, res) => {
  const land = db.prepare("SELECT * FROM lands WHERE id = ?").get(req.params.id);
  if (!land) return res.status(404).json({ error: "Terre introuvable" });
  res.json(attachComputed(land, req));
});

// POST /api/lands — agriculteur crée une terre
const landSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  region: z.string().min(2),
  commune: z.string().optional(),
  surface_ha: z.number().positive(),
  price_per_year: z.number().optional(),
  price_sale: z.number().optional(),
  mode: z.enum(["location", "vente", "location_vente"]),
  crop_type: z.string().optional(),
  has_water: z.boolean().optional(),
  water_flow: z.string().optional(),
  soil_type: z.string().optional(),
  legal_status: z.string().optional(),
  distance_road_km: z.number().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  cover_image: z.string().optional(),
});

router.post("/", authRequired, requireRole("agriculteur", "admin"), (req, res) => {
  const parsed = landSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const d = parsed.data;
  const result = db
    .prepare(
      `INSERT INTO lands (owner_id, title, description, region, commune, surface_ha, price_per_year, price_sale, mode, crop_type, has_water, water_flow, soil_type, legal_status, distance_road_km, latitude, longitude, cover_image, status, legal_score)
       VALUES (@owner_id, @title, @description, @region, @commune, @surface_ha, @price_per_year, @price_sale, @mode, @crop_type, @has_water, @water_flow, @soil_type, @legal_status, @distance_road_km, @latitude, @longitude, @cover_image, 'pending', @legal_score)`
    )
    .run({
      owner_id: req.user.id,
      title: d.title,
      description: d.description ?? null,
      region: d.region,
      commune: d.commune ?? null,
      surface_ha: d.surface_ha,
      price_per_year: d.price_per_year ?? null,
      price_sale: d.price_sale ?? null,
      mode: d.mode,
      crop_type: d.crop_type ?? null,
      has_water: d.has_water ? 1 : 0,
      water_flow: d.water_flow ?? null,
      soil_type: d.soil_type ?? null,
      legal_status: d.legal_status ?? null,
      distance_road_km: d.distance_road_km ?? null,
      latitude: d.latitude ?? null,
      longitude: d.longitude ?? null,
      cover_image: d.cover_image ?? null,
      legal_score: computeLegalScore([]),
    });
  const land = db.prepare("SELECT * FROM lands WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(attachComputed(land, req));
});

// PATCH /api/lands/:id
router.patch("/:id", authRequired, (req, res) => {
  const land = db.prepare("SELECT * FROM lands WHERE id = ?").get(req.params.id);
  if (!land) return res.status(404).json({ error: "Introuvable" });
  if (land.owner_id !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ error: "Non autorisé" });
  }
  const fields = [
    "title",
    "description",
    "region",
    "commune",
    "surface_ha",
    "price_per_year",
    "price_sale",
    "mode",
    "crop_type",
    "water_flow",
    "soil_type",
    "legal_status",
    "distance_road_km",
    "latitude",
    "longitude",
    "cover_image",
    "status",
  ];
  const sets = [];
  const vals = [];
  for (const f of fields) {
    if (req.body[f] !== undefined) {
      sets.push(`${f} = ?`);
      vals.push(req.body[f]);
    }
  }
  if (req.body.has_water !== undefined) {
    sets.push("has_water = ?");
    vals.push(req.body.has_water ? 1 : 0);
  }
  if (!sets.length) return res.json(attachComputed(land, req));
  vals.push(land.id);
  db.prepare(`UPDATE lands SET ${sets.join(", ")} WHERE id = ?`).run(...vals);
  const updated = db.prepare("SELECT * FROM lands WHERE id = ?").get(land.id);
  res.json(attachComputed(updated, req));
});

// DELETE /api/lands/:id
router.delete("/:id", authRequired, (req, res) => {
  const land = db.prepare("SELECT * FROM lands WHERE id = ?").get(req.params.id);
  if (!land) return res.status(404).json({ error: "Introuvable" });
  if (land.owner_id !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ error: "Non autorisé" });
  }
  db.prepare("DELETE FROM lands WHERE id = ?").run(land.id);
  res.json({ ok: true });
});

// POST /api/lands/:id/images
router.post("/:id/images", authRequired, upload.array("images", 10), (req, res) => {
  const land = db.prepare("SELECT * FROM lands WHERE id = ?").get(req.params.id);
  if (!land) return res.status(404).json({ error: "Introuvable" });
  if (land.owner_id !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ error: "Non autorisé" });
  }
  const inserted = [];
  for (const file of req.files || []) {
    const url = publicUrl(req, file.filename);
    const r = db.prepare("INSERT INTO land_images (land_id, url) VALUES (?, ?)").run(land.id, url);
    inserted.push({ id: r.lastInsertRowid, url });
  }
  // définit la 1re comme cover si pas encore
  if (inserted.length && !land.cover_image) {
    db.prepare("UPDATE lands SET cover_image = ? WHERE id = ?").run(inserted[0].url, land.id);
  }
  res.status(201).json({ images: inserted });
});

// POST /api/lands/:id/documents — upload + extraction IA
router.post("/:id/documents", authRequired, upload.single("document"), async (req, res) => {
  const land = db.prepare("SELECT * FROM lands WHERE id = ?").get(req.params.id);
  if (!land) return res.status(404).json({ error: "Introuvable" });
  if (land.owner_id !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ error: "Non autorisé" });
  }
  if (!req.file) return res.status(400).json({ error: "Fichier manquant" });
  const type = req.body.type || "autre";
  const url = publicUrl(req, req.file.filename);

  const extraction = await analyzeDocument({
    filename: req.file.originalname,
    type,
    landHint: { region: land.region, crop_type: land.crop_type, surface_ha: land.surface_ha },
  });

  const r = db
    .prepare("INSERT INTO land_documents (land_id, type, url, extracted_json) VALUES (?, ?, ?, ?)")
    .run(land.id, type, url, JSON.stringify(extraction));

  // Met à jour certains champs de la terre si non renseignés
  const extracted = extraction.extracted || {};
  const updates = {};
  if (!land.crop_type && extracted.culture_suggeree) updates.crop_type = extracted.culture_suggeree;
  if (!land.has_water && extracted.has_water) updates.has_water = 1;
  if (!land.soil_type && extracted.soil_type) updates.soil_type = extracted.soil_type;
  if (!land.legal_status && extracted.legal_status) updates.legal_status = extracted.legal_status;
  if (Object.keys(updates).length) {
    const sets = Object.keys(updates).map((k) => `${k} = ?`).join(", ");
    db.prepare(`UPDATE lands SET ${sets} WHERE id = ?`).run(...Object.values(updates), land.id);
  }

  // Recalcule score légal
  const docs = db.prepare("SELECT type FROM land_documents WHERE land_id = ?").all(land.id);
  const score = computeLegalScore(docs);
  db.prepare("UPDATE lands SET legal_score = ? WHERE id = ?").run(score, land.id);

  const updated = db.prepare("SELECT * FROM lands WHERE id = ?").get(land.id);
  res.status(201).json({
    document: { id: r.lastInsertRowid, type, url, extracted_json: extraction },
    land: attachComputed(updated, req),
  });
});

// GET /api/lands/:id/score — score légal
router.get("/:id/score", (req, res) => {
  const land = db.prepare("SELECT * FROM lands WHERE id = ?").get(req.params.id);
  if (!land) return res.status(404).json({ error: "Introuvable" });
  const docs = db.prepare("SELECT * FROM land_documents WHERE land_id = ?").all(land.id);
  const score = computeLegalScore(docs);
  res.json({
    land_id: land.id,
    legal_score: score,
    breakdown: {
      has_titre: docs.some((d) => d.type === "titre"),
      has_note_renseignement: docs.some((d) => d.type === "note_renseignement"),
      has_plan_amenagement: docs.some((d) => d.type === "plan_amenagement"),
      total_documents: docs.length,
    },
    verdict:
      score >= 90 ? "Excellent"
      : score >= 75 ? "Bon"
      : score >= 55 ? "Acceptable"
      : "À compléter",
  });
});

// POST /api/lands/:id/simulate — simulateur rendement/ROI (public)
router.post("/:id/simulate", (req, res) => {
  const land = db.prepare("SELECT * FROM lands WHERE id = ?").get(req.params.id);
  if (!land) return res.status(404).json({ error: "Introuvable" });
  const crop_type = req.body.crop_type || land.crop_type;
  const result = simulateYield({
    crop_type,
    surface_ha: land.surface_ha,
    has_water: !!land.has_water,
    region: land.region,
  });
  res.json(result);
});

// POST /api/lands/:id/unlock-contact — consomme crédits pour voir contact
router.post("/:id/unlock-contact", authRequired, requireRole("investisseur", "admin"), (req, res) => {
  const land = db.prepare("SELECT * FROM lands WHERE id = ?").get(req.params.id);
  if (!land) return res.status(404).json({ error: "Introuvable" });

  const existing = db
    .prepare("SELECT * FROM contact_unlocks WHERE investor_id = ? AND land_id = ?")
    .get(req.user.id, land.id);
  if (existing) {
    const full = db.prepare("SELECT phone, whatsapp FROM users WHERE id = ?").get(land.owner_id);
    return res.json({ alreadyUnlocked: true, credits: req.user.credits, contact: full });
  }

  const cost = 10; // 10 crédits par unlock
  if ((req.user.credits || 0) < cost) {
    return res.status(402).json({ error: "Crédits insuffisants", required: cost, have: req.user.credits });
  }

  const tx = db.transaction(() => {
    db.prepare("UPDATE users SET credits = credits - ? WHERE id = ?").run(cost, req.user.id);
    db.prepare(
      "INSERT INTO contact_unlocks (investor_id, land_id, credits_spent) VALUES (?, ?, ?)"
    ).run(req.user.id, land.id, cost);
    db.prepare(
      "INSERT INTO transactions (user_id, type, amount, metadata) VALUES (?, 'unlock', ?, ?)"
    ).run(req.user.id, cost, JSON.stringify({ land_id: land.id }));
  });
  tx();

  const updatedUser = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id);
  const full = db.prepare("SELECT phone, whatsapp, nom FROM users WHERE id = ?").get(land.owner_id);
  res.json({ alreadyUnlocked: false, credits: updatedUser.credits, contact: full });
});

export default router;
