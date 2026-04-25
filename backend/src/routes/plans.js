import { Router } from "express";
import { z } from "zod";
import { db } from "../db.js";
import { authRequired } from "../middleware/auth.js";
import { publicUser } from "./auth.js";

const router = Router();

const PLANS = {
  free: { id: "free", name: "Free", price_dh: 0, credits_included: 0, features: ["Recherche", "Voir fiches (contact masqué)"] },
  premium: {
    id: "premium",
    name: "Premium Investisseur",
    price_dh: 299,
    credits_included: 50,
    features: ["50 crédits/mois", "Débloquer contacts", "Score légal détaillé", "Recommandations IA"],
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    price_dh: 999,
    credits_included: 300,
    features: ["300 crédits/mois", "API access", "Boost prioritaire", "Support dédié"],
  },
};

// GET /api/plans
router.get("/plans", (_req, res) => {
  res.json({ plans: Object.values(PLANS) });
});

// POST /api/me/subscribe — mock paiement, upgrade plan + ajoute crédits
const subscribeSchema = z.object({
  plan: z.enum(["free", "premium", "enterprise"]),
});

router.post("/me/subscribe", authRequired, (req, res) => {
  const parsed = subscribeSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const plan = PLANS[parsed.data.plan];

  const tx = db.transaction(() => {
    db.prepare("UPDATE users SET plan = ?, credits = credits + ? WHERE id = ?").run(
      plan.id,
      plan.credits_included,
      req.user.id
    );
    db.prepare(
      "INSERT INTO transactions (user_id, type, amount, metadata) VALUES (?, 'subscription', ?, ?)"
    ).run(req.user.id, plan.price_dh, JSON.stringify({ plan: plan.id }));
  });
  tx();

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id);
  res.json({ user: publicUser(user), plan });
});

// GET /api/me/credits
router.get("/me/credits", authRequired, (req, res) => {
  const user = db.prepare("SELECT credits, plan FROM users WHERE id = ?").get(req.user.id);
  res.json(user);
});

// POST /api/me/credits/purchase — achat crédits (mock)
const purchaseSchema = z.object({
  pack: z.enum(["S", "M", "L", "XL"]),
});

const PACKS = {
  S: { credits: 20, price_dh: 99 },
  M: { credits: 60, price_dh: 249 },
  L: { credits: 150, price_dh: 499 },
  XL: { credits: 400, price_dh: 1199 },
};

router.post("/me/credits/purchase", authRequired, (req, res) => {
  const parsed = purchaseSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const pack = PACKS[parsed.data.pack];

  const tx = db.transaction(() => {
    db.prepare("UPDATE users SET credits = credits + ? WHERE id = ?").run(pack.credits, req.user.id);
    db.prepare(
      "INSERT INTO transactions (user_id, type, amount, metadata) VALUES (?, 'credits', ?, ?)"
    ).run(req.user.id, pack.price_dh, JSON.stringify(pack));
  });
  tx();

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id);
  res.json({ user: publicUser(user), pack });
});

// POST /api/me/boost — boost profil (notaire) ou une terre (agriculteur)
const boostSchema = z.object({
  target: z.enum(["profile", "land"]),
  land_id: z.number().int().positive().optional(),
  days: z.number().int().positive().default(7),
});

router.post("/me/boost", authRequired, (req, res) => {
  const parsed = boostSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { target, land_id, days } = parsed.data;
  const price_dh = days * 15;
  const expires = new Date(Date.now() + days * 86400 * 1000).toISOString();

  if (target === "profile") {
    db.prepare("UPDATE users SET boost_expires_at = ? WHERE id = ?").run(expires, req.user.id);
  } else {
    if (!land_id) return res.status(400).json({ error: "land_id requis" });
    const land = db.prepare("SELECT * FROM lands WHERE id = ?").get(land_id);
    if (!land || (land.owner_id !== req.user.id && req.user.role !== "admin")) {
      return res.status(403).json({ error: "Non autorisé" });
    }
    db.prepare("UPDATE lands SET boost_expires_at = ? WHERE id = ?").run(expires, land_id);
  }

  db.prepare(
    "INSERT INTO transactions (user_id, type, amount, metadata) VALUES (?, 'boost', ?, ?)"
  ).run(req.user.id, price_dh, JSON.stringify({ target, land_id, days }));

  res.json({ ok: true, expires_at: expires, price_dh });
});

export default router;
