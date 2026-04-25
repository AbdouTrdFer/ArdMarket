import { Router } from "express";
import { z } from "zod";
import { db } from "../db.js";
import { authRequired, requireRole } from "../middleware/auth.js";

const router = Router();

const offerSchema = z.object({
  price: z.number().positive(),
  duration_years: z.number().int().positive().optional(),
  message: z.string().optional(),
});

// POST /api/lands/:id/offers — investisseur fait une offre
router.post("/lands/:id/offers", authRequired, requireRole("investisseur", "admin"), (req, res) => {
  const land = db.prepare("SELECT * FROM lands WHERE id = ?").get(req.params.id);
  if (!land) return res.status(404).json({ error: "Terre introuvable" });
  const parsed = offerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { price, duration_years, message } = parsed.data;
  const r = db
    .prepare(
      "INSERT INTO offers (land_id, investor_id, price, duration_years, message) VALUES (?, ?, ?, ?, ?)"
    )
    .run(land.id, req.user.id, price, duration_years ?? null, message ?? null);
  const offer = db.prepare("SELECT * FROM offers WHERE id = ?").get(r.lastInsertRowid);
  res.status(201).json(offer);
});

// GET /api/offers/mine — offres de l'utilisateur (investisseur: siennes; agriculteur: sur ses terres)
router.get("/offers/mine", authRequired, (req, res) => {
  let rows;
  if (req.user.role === "investisseur") {
    rows = db
      .prepare(
        `SELECT o.*, l.title as land_title, l.region as land_region
         FROM offers o JOIN lands l ON l.id = o.land_id
         WHERE o.investor_id = ? ORDER BY o.created_at DESC`
      )
      .all(req.user.id);
  } else if (req.user.role === "agriculteur") {
    rows = db
      .prepare(
        `SELECT o.*, l.title as land_title, u.nom as investor_nom
         FROM offers o
         JOIN lands l ON l.id = o.land_id
         JOIN users u ON u.id = o.investor_id
         WHERE l.owner_id = ? ORDER BY o.created_at DESC`
      )
      .all(req.user.id);
  } else {
    rows = [];
  }
  res.json({ items: rows });
});

// PATCH /api/offers/:id/status — agriculteur accepte/refuse
router.patch("/offers/:id/status", authRequired, requireRole("agriculteur", "admin"), (req, res) => {
  const offer = db.prepare("SELECT * FROM offers WHERE id = ?").get(req.params.id);
  if (!offer) return res.status(404).json({ error: "Offre introuvable" });
  const land = db.prepare("SELECT * FROM lands WHERE id = ?").get(offer.land_id);
  if (!land) return res.status(404).json({ error: "Terre introuvable" });
  if (land.owner_id !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ error: "Non autorisé" });
  }
  const status = req.body.status;
  if (!["accepted", "rejected", "pending"].includes(status)) {
    return res.status(400).json({ error: "Statut invalide" });
  }
  db.prepare("UPDATE offers SET status = ? WHERE id = ?").run(status, offer.id);
  if (status === "accepted") {
    db.prepare("UPDATE lands SET status = 'rented' WHERE id = ?").run(land.id);
  }
  const updated = db.prepare("SELECT * FROM offers WHERE id = ?").get(offer.id);
  res.json(updated);
});

export default router;
