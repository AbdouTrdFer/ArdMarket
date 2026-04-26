// Routes de synchronisation: Firestore (chatbot Telegram) ↔ ArdMarket SQLite.
import { Router } from "express";
import { authOptional } from "../middleware/auth.js";
import { runSync, getLastSyncStatus } from "../services/firebaseSync.js";
import { isFirebaseConfigured } from "../services/firebase.js";

const router = Router();

// État de la dernière synchro
router.get("/sync/status", (_req, res) => {
  const last = getLastSyncStatus();
  res.json({
    firebase_configured: isFirebaseConfigured(),
    last_sync: last,
  });
});

// Déclencher manuellement une synchro
// En dev/démo: ouvert. En prod il faudrait restreindre à role=admin.
router.post("/sync/firebase", authOptional, async (req, res) => {
  // Si l'utilisateur est connecté et n'est pas admin, on log mais on laisse passer en dev
  if (req.user && req.user.role !== "admin" && process.env.NODE_ENV === "production") {
    return res.status(403).json({ error: "Réservé aux admins" });
  }
  if (!isFirebaseConfigured()) {
    return res.status(503).json({ error: "Firebase non configuré côté serveur" });
  }
  try {
    const limit = Number(req.query.limit) || 100;
    const result = await runSync({ limit });
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
