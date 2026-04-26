// Singleton Firebase Admin SDK pour ArdMarket
// Lit le service account depuis FIREBASE_SERVICE_ACCOUNT_PATH ou ./secrets/firebase-service-account.json
import admin from "firebase-admin";
import fs from "node:fs";
import path from "node:path";

let firestore = null;
let initError = null;

export function getFirestore() {
  if (firestore) return firestore;
  if (initError) throw initError;

  const candidates = [
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
    path.resolve(process.cwd(), "secrets/firebase-service-account.json"),
    path.resolve(process.cwd(), "backend/secrets/firebase-service-account.json"),
  ].filter(Boolean);

  let saPath = null;
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      saPath = p;
      break;
    }
  }

  if (!saPath) {
    initError = new Error(
      "Firebase service account introuvable. Placez le JSON dans backend/secrets/firebase-service-account.json ou définissez FIREBASE_SERVICE_ACCOUNT_PATH"
    );
    throw initError;
  }

  try {
    const sa = JSON.parse(fs.readFileSync(saPath, "utf8"));
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(sa),
        projectId: sa.project_id,
      });
    }
    firestore = admin.firestore();
    // eslint-disable-next-line no-console
    console.log(`[Firebase] connecté au projet ${sa.project_id}`);
    return firestore;
  } catch (e) {
    initError = e;
    throw e;
  }
}

export function isFirebaseConfigured() {
  try {
    getFirestore();
    return true;
  } catch {
    return false;
  }
}
