import { Router } from "express";
import { db } from "../db.js";

const router = Router();

// GET /api/notaries — liste les notaires (boostés en premier)
router.get("/notaries", (req, res) => {
  const { region } = req.query;
  const where = ["role = 'notaire'"];
  const params = [];
  if (region) {
    where.push("region = ?");
    params.push(region);
  }
  const rows = db
    .prepare(
      `SELECT id, nom, email, phone, whatsapp, region, plan, boost_expires_at, created_at
       FROM users
       WHERE ${where.join(" AND ")}
       ORDER BY (boost_expires_at IS NOT NULL AND boost_expires_at > datetime('now')) DESC, created_at DESC`
    )
    .all(...params);
  res.json({ items: rows });
});

export default router;
