import { Router } from "express";
import { z } from "zod";
import { db } from "../db.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

function rowToNotary(row) {
  if (!row) return null;
  let specialties = [];
  let languages = [];
  try { specialties = row.specialties ? JSON.parse(row.specialties) : []; } catch { /* ignore */ }
  try { languages = row.languages ? JSON.parse(row.languages) : []; } catch { /* ignore */ }
  const boosted =
    !!row.boost_expires_at && new Date(row.boost_expires_at) > new Date();
  return {
    id: row.id,
    nom: row.nom,
    email: row.email,
    phone: row.phone,
    whatsapp: row.whatsapp,
    region: row.region,
    plan: row.plan,
    boosted,
    boost_expires_at: row.boost_expires_at,
    photo_url: row.photo_url,
    bio: row.bio,
    address: row.address,
    city: row.city,
    years_experience: row.years_experience ?? 0,
    contracts_count: row.contracts_count ?? 0,
    specialties,
    languages,
    hourly_rate: row.hourly_rate,
    rating_avg: row.rating_avg ?? 0,
    rating_count: row.rating_count ?? 0,
    verified: !!row.verified,
    created_at: row.created_at,
  };
}

// GET /api/notaries — liste les notaires (boostés en premier, filtres optionnels)
router.get("/notaries", (req, res) => {
  const { region, specialty, q } = req.query;
  const where = ["u.role = 'notaire'"];
  const params = [];
  if (region) {
    where.push("u.region = ?");
    params.push(region);
  }
  if (specialty) {
    where.push("p.specialties LIKE ?");
    params.push(`%${specialty}%`);
  }
  if (q) {
    where.push("(u.nom LIKE ? OR u.region LIKE ? OR p.city LIKE ? OR p.bio LIKE ?)");
    const like = `%${q}%`;
    params.push(like, like, like, like);
  }
  const rows = db
    .prepare(
      `SELECT u.id, u.nom, u.email, u.phone, u.whatsapp, u.region, u.plan, u.boost_expires_at, u.created_at,
              p.photo_url, p.bio, p.address, p.city, p.years_experience, p.contracts_count,
              p.specialties, p.languages, p.hourly_rate, p.rating_avg, p.rating_count, p.verified
       FROM users u
       LEFT JOIN notary_profiles p ON p.user_id = u.id
       WHERE ${where.join(" AND ")}
       ORDER BY (u.boost_expires_at IS NOT NULL AND u.boost_expires_at > datetime('now')) DESC,
                p.rating_avg DESC,
                p.contracts_count DESC,
                u.created_at DESC`,
    )
    .all(...params);
  res.json({ items: rows.map(rowToNotary) });
});

// GET /api/notaries/:id — profil détaillé avec reviews
router.get("/notaries/:id", (req, res) => {
  const id = Number(req.params.id);
  const row = db
    .prepare(
      `SELECT u.id, u.nom, u.email, u.phone, u.whatsapp, u.region, u.plan, u.boost_expires_at, u.created_at,
              p.photo_url, p.bio, p.address, p.city, p.years_experience, p.contracts_count,
              p.specialties, p.languages, p.hourly_rate, p.rating_avg, p.rating_count, p.verified
       FROM users u
       LEFT JOIN notary_profiles p ON p.user_id = u.id
       WHERE u.id = ? AND u.role = 'notaire'`,
    )
    .get(id);
  if (!row) return res.status(404).json({ error: "notary_not_found" });
  const reviews = db
    .prepare(
      `SELECT id, author_id, author_name, rating, comment, created_at
       FROM notary_reviews WHERE notary_id = ? ORDER BY created_at DESC LIMIT 50`,
    )
    .all(id);
  res.json({ ...rowToNotary(row), reviews });
});

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

// POST /api/notaries/:id/reviews — laisser un avis (auth requis)
router.post("/notaries/:id/reviews", authRequired, (req, res) => {
  const id = Number(req.params.id);
  const parsed = reviewSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const target = db.prepare("SELECT id FROM users WHERE id = ? AND role = 'notaire'").get(id);
  if (!target) return res.status(404).json({ error: "notary_not_found" });
  if (req.user.id === id) return res.status(400).json({ error: "cannot_review_self" });

  const author = db.prepare("SELECT nom FROM users WHERE id = ?").get(req.user.id);
  const { rating, comment } = parsed.data;
  const r = db
    .prepare(
      `INSERT INTO notary_reviews (notary_id, author_id, author_name, rating, comment) VALUES (?, ?, ?, ?, ?)`,
    )
    .run(id, req.user.id, author?.nom ?? null, rating, comment ?? null);

  // Recalculate aggregate rating
  const agg = db
    .prepare(`SELECT AVG(rating) as avg, COUNT(*) as cnt FROM notary_reviews WHERE notary_id = ?`)
    .get(id);
  db.prepare(
    `INSERT INTO notary_profiles (user_id, rating_avg, rating_count)
     VALUES (?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET rating_avg = excluded.rating_avg, rating_count = excluded.rating_count`,
  ).run(id, agg.avg ?? 0, agg.cnt ?? 0);

  const review = db.prepare("SELECT * FROM notary_reviews WHERE id = ?").get(r.lastInsertRowid);
  res.status(201).json(review);
});

export default router;
