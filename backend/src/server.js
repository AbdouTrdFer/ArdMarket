import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "node:path";
import { db } from "./db.js";
import authRoutes from "./routes/auth.js";
import landRoutes from "./routes/lands.js";
import offerRoutes from "./routes/offers.js";
import planRoutes from "./routes/plans.js";
import adsRoutes from "./routes/ads.js";
import notariesRoutes from "./routes/notaries.js";
import aiRoutes from "./routes/ai.js";
import syncRoutes from "./routes/sync.js";
import { isFirebaseConfigured } from "./services/firebase.js";
import { startAutoSync } from "./services/firebaseSync.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: "2mb" }));

// static uploads
const uploadsDir = path.resolve(process.env.UPLOADS_DIR || "./uploads");
app.use("/uploads", express.static(uploadsDir));

app.get("/api/health", (_req, res) => {
  const { version } = { version: "0.1.0" };
  const userCount = db.prepare("SELECT COUNT(*) as c FROM users").get().c;
  const landCount = db.prepare("SELECT COUNT(*) as c FROM lands").get().c;
  res.json({ ok: true, version, users: userCount, lands: landCount });
});

app.use("/api/auth", authRoutes);
app.use("/api/lands", landRoutes);
app.use("/api", offerRoutes);
app.use("/api", planRoutes);
app.use("/api", adsRoutes);
app.use("/api", notariesRoutes);
app.use("/api/ai", aiRoutes);
// Alias pratique pour le webhook
app.use("/api", aiRoutes);
app.use("/api", syncRoutes);

// index des routes pour debug
app.get("/api", (_req, res) => {
  res.json({
    name: "ArdMarket API",
    version: "0.1.0",
    routes: [
      "POST /api/auth/register",
      "POST /api/auth/login",
      "GET  /api/auth/me",
      "GET  /api/lands",
      "GET  /api/lands/:id",
      "GET  /api/lands/recommendations",
      "POST /api/lands",
      "PATCH /api/lands/:id",
      "DELETE /api/lands/:id",
      "POST /api/lands/:id/images",
      "POST /api/lands/:id/documents",
      "GET  /api/lands/:id/score",
      "POST /api/lands/:id/simulate",
      "POST /api/lands/:id/unlock-contact",
      "POST /api/lands/:id/offers",
      "GET  /api/offers/mine",
      "PATCH /api/offers/:id/status",
      "GET  /api/plans",
      "POST /api/me/subscribe",
      "GET  /api/me/credits",
      "POST /api/me/credits/purchase",
      "POST /api/me/boost",
      "GET  /api/ads",
      "POST /api/ads",
      "GET  /api/notaries",
      "POST /api/ai/simulate-yield",
      "POST /api/ai/analyze-document",
      "POST /api/ai/voice-to-land",
      "POST /api/whatsapp/webhook",
      "POST /api/sync/firebase",
      "GET  /api/sync/status",
    ],
  });
});

app.use((err, _req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Erreur serveur" });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[ArdMarket] API prête sur http://localhost:${PORT}`);

  // Démarre la synchro automatique Firebase si configurée
  if (isFirebaseConfigured()) {
    const intervalMin = Number(process.env.FIREBASE_AUTOSYNC_INTERVAL_MIN || 5);
    if (intervalMin > 0) {
      // eslint-disable-next-line no-console
      console.log(`[ArdMarket] Auto-sync Firebase activé (toutes les ${intervalMin} min)`);
      startAutoSync({ intervalMs: intervalMin * 60 * 1000 });
    }
  } else {
    // eslint-disable-next-line no-console
    console.log("[ArdMarket] Firebase non configuré (sync désactivée)");
  }
});
