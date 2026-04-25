import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "../db.js";
import { authRequired, signToken } from "../middleware/auth.js";

const router = Router();

const registerSchema = z.object({
  role: z.enum(["agriculteur", "investisseur", "notaire", "fournisseur"]),
  nom: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  region: z.string().optional(),
});

router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { role, nom, email, password, phone, whatsapp, region } = parsed.data;

  const exists = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (exists) return res.status(409).json({ error: "Email déjà utilisé" });

  const hash = await bcrypt.hash(password, 10);
  const result = db
    .prepare(
      `INSERT INTO users (role, nom, email, password_hash, phone, whatsapp, region, plan, credits)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'free', 0)`
    )
    .run(role, nom, email, hash, phone ?? null, whatsapp ?? null, region ?? null);

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(result.lastInsertRowid);
  const token = signToken(user);
  return res.status(201).json({ token, user: publicUser(user) });
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { email, password } = parsed.data;

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user) return res.status(401).json({ error: "Identifiants invalides" });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "Identifiants invalides" });

  const token = signToken(user);
  return res.json({ token, user: publicUser(user) });
});

router.get("/me", authRequired, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

export function publicUser(u) {
  if (!u) return null;
  return {
    id: u.id,
    role: u.role,
    nom: u.nom,
    email: u.email,
    phone: u.phone,
    whatsapp: u.whatsapp,
    region: u.region,
    plan: u.plan,
    credits: u.credits,
    boost_expires_at: u.boost_expires_at,
    created_at: u.created_at,
  };
}

export default router;
