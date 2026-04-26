// Synchronise les annonces du chatbot Telegram (Firestore) vers la base ArdMarket (SQLite).
// Idempotent: refait passer le sync ne crée pas de doublons.
import bcrypt from "bcryptjs";
import { db } from "../db.js";
import { getFirestore } from "./firebase.js";

// Pool d'images réalistes par région — vues drone, topographiques, paysages marocains.
// Images curées Unsplash (libres) — utilisées en complément (ou remplacement) des images
// CDN Telegram qui peuvent contenir des photos test peu représentatives.
const REGION_IMAGE_POOLS = {
  "Casablanca": [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?w=1200&h=800&fit=crop",
  ],
  "Oujda": [
    "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1542089363-bcb4be8df198?w=1200&h=800&fit=crop",
  ],
  "Meknès": [
    "https://images.unsplash.com/photo-1445264718234-a623be589d37?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1601566091022-a6d22b0ec0b0?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1471696035578-3d8c78d99684?w=1200&h=800&fit=crop",
  ],
  "Souss": [
    "https://images.unsplash.com/photo-1591735557715-37bd7baef5cb?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1547514701-42782101795e?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1565710302983-cabe46c2f7da?w=1200&h=800&fit=crop",
  ],
  "Taroudant": [
    "https://images.unsplash.com/photo-1597474561103-0b73c6dba8da?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200&h=800&fit=crop",
  ],
  "Marrakech": [
    "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=800&fit=crop",
  ],
  "Gharb": [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&h=800&fit=crop",
  ],
  "Beni Mellal": [
    "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1444858345736-67cb3a4f1bf6?w=1200&h=800&fit=crop",
  ],
  "Haouz": [
    "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1200&h=800&fit=crop",
  ],
  "default": [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&h=800&fit=crop",
  ],
};

// Vue topographique / aérienne — appliquée à toutes les annonces bot pour
// donner l'aspect "vue drone + plan" demandé par les investisseurs.
const TOPOGRAPHIC_IMAGES = [
  "https://images.unsplash.com/photo-1569163139394-de4798aa62b1?w=1200&h=800&fit=crop", // aerial farmland mosaic
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=800&fit=crop", // wheat fields aerial
  "https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?w=1200&h=800&fit=crop", // mountain landscape
];

function pickRealisticImages(region, listingId) {
  const pool = REGION_IMAGE_POOLS[region] || REGION_IMAGE_POOLS.default;
  // Index déterministe à partir du listingId pour avoir la même image à chaque sync
  const seed = (listingId || "x").split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  const main = pool[seed % pool.length];
  const topo = TOPOGRAPHIC_IMAGES[seed % TOPOGRAPHIC_IMAGES.length];
  // Évite les doublons si le pool n'a qu'une seule image
  const second = pool.length > 1 ? pool[(seed + 1) % pool.length] : pool[0];
  return [...new Set([main, topo, second].filter(Boolean))];
}

// Dictionnaire darija/arabe → français pour les villes courantes
const ARABIC_LOCATION_MAP = {
  "وجدة": "Oujda",
  "فوجدا": "Oujda",
  "وجدا": "Oujda",
  "الدار البيضاء": "Casablanca",
  "كازا": "Casablanca",
  "الرباط": "Rabat",
  "مراكش": "Marrakech",
  "فاس": "Fès",
  "مكناس": "Meknès",
  "طنجة": "Tanger",
  "أكادير": "Agadir",
  "اكادير": "Agadir",
  "تطوان": "Tétouan",
  "آسفي": "Safi",
  "العيون": "Laâyoune",
  "إفران": "Ifrane",
  "بني ملال": "Beni Mellal",
  "تاوريرت": "Taourirt",
  "ناظور": "Nador",
  "بركان": "Berkane",
  "جرسيف": "Guercif",
  "الراشيدية": "Errachidia",
  "تارودانت": "Taroudant",
  "سوس": "Souss",
  "الحوز": "Haouz",
  "الغرب": "Gharb",
};

function translateLocation(arabicLoc) {
  if (!arabicLoc) return null;
  const trimmed = arabicLoc.trim();
  if (ARABIC_LOCATION_MAP[trimmed]) return ARABIC_LOCATION_MAP[trimmed];
  // Recherche partielle (le bot peut renvoyer "في وجدة" = "à Oujda")
  for (const [ar, fr] of Object.entries(ARABIC_LOCATION_MAP)) {
    if (trimmed.includes(ar)) return fr;
  }
  return null;
}

// Si la zone française est dans le doc extrait → préférer ça
function pickBestLocation(listing) {
  const docs = listing.documents || [];
  for (const d of docs) {
    const ext = d?.extracted_data;
    if (ext?.location && /[A-Za-zÀ-ÿ]/.test(ext.location)) {
      return ext.location;
    }
  }
  const translated = translateLocation(listing.location);
  if (translated) return translated;
  return listing.location || "Maroc";
}

// Extrait région + commune depuis "Commune de X, Préfecture de Y, Région Z"
function splitFrenchLocation(loc) {
  if (!loc) return { region: "Maroc", commune: null };
  const lower = loc.toLowerCase();

  let commune = null;
  const communeMatch = loc.match(/Commune\s+(?:de\s+|d'\s*)?([^,]+)/i);
  if (communeMatch) commune = communeMatch[1].trim();

  let region = null;
  const regionMatch = loc.match(/Région\s+([^,]+)/i);
  if (regionMatch) region = regionMatch[1].trim();
  else if (loc.match(/Préfecture/i)) {
    const prefMatch = loc.match(/Préfecture\s+(?:de\s+|d'\s*)?([^,]+)/i);
    if (prefMatch) region = prefMatch[1].trim();
  }

  // Cas simple: une seule ville comme "Oujda"
  if (!region && !commune) {
    region = loc.trim();
  }

  // Connus dans notre liste de régions du form
  const KNOWN_REGIONS = [
    "Taroudant", "Souss", "Meknès", "Gharb", "Haouz", "Beni Mellal",
    "Casablanca", "Rabat", "Marrakech", "Fès", "Oujda", "Agadir",
    "Tanger", "Tétouan", "Khouribga", "Errachidia",
  ];
  if (region) {
    const norm = region.replace(/-Settat|-Salé.*|-Tadla.*|.*?-/gi, "").trim();
    const found = KNOWN_REGIONS.find((r) => lower.includes(r.toLowerCase()) || norm.toLowerCase().includes(r.toLowerCase()));
    if (found) region = found;
  }

  return { region: region || "Maroc", commune };
}

function inferLegalStatus(listing) {
  if (listing.tf_number) return "titre";
  const docs = listing.documents || [];
  for (const d of docs) {
    if (d.type === "titre_foncier" || d?.extracted_data?.document_type === "titre_foncier") {
      return "titre";
    }
    if (d.type === "moulkia") return "moulkia";
  }
  return "non_titre";
}

function buildDescription(listing) {
  const parts = [];
  parts.push("📲 Annonce soumise via le bot Telegram (NLP Darija).");

  if (listing.surface_m2 && listing.surface_m2 < 10000) {
    parts.push(`Petite parcelle de ${listing.surface_m2} m² adaptée au maraîchage / agriculture familiale.`);
  } else if (listing.surface_hectares) {
    parts.push(`Parcelle de ${listing.surface_hectares} hectares.`);
  }

  if (listing.deal_type === "lease") {
    if (listing.duration_months) {
      parts.push(`Location de ${listing.duration_months} mois proposée.`);
    } else {
      parts.push("Location proposée.");
    }
    if (listing.monthly_rent_mad) {
      parts.push(`Loyer mensuel demandé : ${listing.monthly_rent_mad} DH.`);
    }
  } else if (listing.deal_type === "sale") {
    parts.push("Vente proposée.");
  }

  // Documents extraits
  const docs = listing.documents || [];
  for (const d of docs) {
    const ext = d?.extracted_data;
    if (ext) {
      if (ext.parcel_number) parts.push(`Réf. titre foncier : ${ext.parcel_number}.`);
      if (ext.owner_name) parts.push(`Propriétaire déclaré : ${ext.owner_name}.`);
      if (ext.land_classification) parts.push(`Classification : ${ext.land_classification}.`);
      if (ext.registration_date) parts.push(`Enregistré le ${ext.registration_date}.`);
      if (ext.location && ext.location !== listing.location) {
        parts.push(`Localisation officielle : ${ext.location}.`);
      }
    }
  }

  return parts.join(" ");
}

async function getOrCreateOwner(telegramId, fbUsersCol) {
  const existing = db.prepare("SELECT * FROM users WHERE telegram_id = ?").get(telegramId);
  if (existing) return existing;

  // Récupérer le profil utilisateur Telegram depuis Firebase
  let name = `Paysan #${telegramId}`;
  let username = null;
  try {
    const userDoc = await fbUsersCol.doc(String(telegramId)).get();
    if (userDoc.exists) {
      const u = userDoc.data();
      if (u.name) name = u.name;
      if (u.username) username = u.username;
    }
  } catch {
    // ignore
  }

  const email = `telegram_${telegramId}@ardmarket.bot`;
  const passwordHash = bcrypt.hashSync(`tg-${telegramId}-${Date.now()}`, 10);

  // Évite collisions email si rerun
  const emailExists = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (emailExists) {
    db.prepare("UPDATE users SET telegram_id = ? WHERE id = ?").run(String(telegramId), emailExists.id);
    return db.prepare("SELECT * FROM users WHERE id = ?").get(emailExists.id);
  }

  const result = db.prepare(`
    INSERT INTO users (role, nom, email, password_hash, telegram_id, plan, credits)
    VALUES ('agriculteur', ?, ?, ?, ?, 'free', 0)
  `).run(name, email, passwordHash, String(telegramId));

  return db.prepare("SELECT * FROM users WHERE id = ?").get(result.lastInsertRowid);
}

function generateTitle(listing, ownerName) {
  const loc = pickBestLocation(listing);
  const surface = listing.surface_hectares
    ? `${listing.surface_hectares} ha`
    : listing.surface_m2
      ? `${listing.surface_m2} m²`
      : "Terrain";
  const mode = listing.deal_type === "sale" ? "Vente" : "Location";
  const cleanLoc = loc.split(",")[0].trim();
  return `${mode} terrain ${surface} — ${cleanLoc}`;
}

function listingToLandPayload(listing, ownerId) {
  const bestLoc = pickBestLocation(listing);
  const { region, commune } = splitFrenchLocation(bestLoc);

  let mode = "location";
  if (listing.deal_type === "sale") mode = "vente";

  const monthly = listing.monthly_rent_mad ? Number(listing.monthly_rent_mad) : null;
  const yearly = monthly ? monthly * 12 : null;

  const surface = listing.surface_hectares
    ? Number(listing.surface_hectares)
    : listing.surface_m2
      ? Number(listing.surface_m2) / 10000
      : 0;

  // Cover image: privilégie une image réaliste (drone/aérienne) Maroc
  // au lieu de l'image CDN Telegram qui peut être un screenshot test du paysan.
  const realistic = pickRealisticImages(region, listing.listing_id);
  const cover = realistic[0];

  return {
    owner_id: ownerId,
    title: generateTitle(listing, listing.owner_claimed),
    description: buildDescription(listing),
    region,
    commune,
    surface_ha: surface,
    price_per_year: yearly,
    price_sale: null,
    mode,
    crop_type: null,
    has_water: 0,
    water_flow: null,
    soil_type: null,
    legal_status: inferLegalStatus(listing),
    distance_road_km: null,
    latitude: null,
    longitude: null,
    cover_image: cover,
    status: listing.status === "verified" ? "validated" : "pending",
    legal_score: listing.tf_number ? 75 : 50,
    estimated_yield: null,
    source: "telegram_bot",
    firebase_listing_id: listing.listing_id || null,
    tf_number: listing.tf_number || null,
    owner_claimed_name: listing.owner_claimed || null,
    duration_months: listing.duration_months || null,
    _realistic_images: realistic,
  };
}

function upsertLand(payload) {
  if (!payload.firebase_listing_id) {
    throw new Error("firebase_listing_id manquant");
  }
  const existing = db.prepare("SELECT id FROM lands WHERE firebase_listing_id = ?").get(payload.firebase_listing_id);

  if (existing) {
    db.prepare(`
      UPDATE lands SET
        title = ?, description = ?, region = ?, commune = ?, surface_ha = ?,
        price_per_year = ?, mode = ?, legal_status = ?, cover_image = ?, status = ?,
        legal_score = ?, tf_number = ?, owner_claimed_name = ?, duration_months = ?
      WHERE id = ?
    `).run(
      payload.title, payload.description, payload.region, payload.commune, payload.surface_ha,
      payload.price_per_year, payload.mode, payload.legal_status, payload.cover_image, payload.status,
      payload.legal_score, payload.tf_number, payload.owner_claimed_name, payload.duration_months,
      existing.id
    );
    return { id: existing.id, action: "updated" };
  }

  const result = db.prepare(`
    INSERT INTO lands (
      owner_id, title, description, region, commune, surface_ha, price_per_year, price_sale,
      mode, crop_type, has_water, water_flow, soil_type, legal_status, distance_road_km,
      latitude, longitude, cover_image, status, legal_score, estimated_yield,
      source, firebase_listing_id, tf_number, owner_claimed_name, duration_months
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `).run(
    payload.owner_id, payload.title, payload.description, payload.region, payload.commune,
    payload.surface_ha, payload.price_per_year, payload.price_sale, payload.mode,
    payload.crop_type, payload.has_water, payload.water_flow, payload.soil_type, payload.legal_status,
    payload.distance_road_km, payload.latitude, payload.longitude, payload.cover_image,
    payload.status, payload.legal_score, payload.estimated_yield,
    payload.source, payload.firebase_listing_id, payload.tf_number, payload.owner_claimed_name,
    payload.duration_months
  );
  return { id: result.lastInsertRowid, action: "created" };
}

function syncImages(landId, images) {
  if (!images || !images.length) return 0;
  // Supprime les anciennes images puis réinsère (simple et idempotent)
  db.prepare("DELETE FROM land_images WHERE land_id = ?").run(landId);
  const insert = db.prepare("INSERT INTO land_images (land_id, url) VALUES (?, ?)");
  let n = 0;
  for (const url of images) {
    if (typeof url === "string" && url.length > 5) {
      insert.run(landId, url);
      n++;
    }
  }
  return n;
}

function syncDocuments(landId, documents) {
  if (!documents || !documents.length) return 0;
  db.prepare("DELETE FROM land_documents WHERE land_id = ?").run(landId);
  const insert = db.prepare(
    "INSERT INTO land_documents (land_id, type, url, extracted_json, external_url) VALUES (?, ?, ?, ?, ?)"
  );
  let n = 0;
  for (const d of documents) {
    let type = "autre";
    const t = d?.type || d?.extracted_data?.document_type;
    if (t === "titre_foncier") type = "titre";
    else if (t === "moulkia") type = "moulkia";
    else if (t === "plan_amenagement") type = "plan_amenagement";
    else if (t === "note_renseignement") type = "note_renseignement";

    insert.run(
      landId,
      type,
      d.url || d.external_url || "",
      d.extracted_data ? JSON.stringify(d.extracted_data) : null,
      d.url || null
    );
    n++;
  }
  return n;
}

export async function syncFromFirebase({ limit = 100 } = {}) {
  const fs = getFirestore();
  const fbUsersCol = fs.collection("users");
  const snap = await fs.collection("listings").limit(limit).get();

  const result = {
    fetched: snap.size,
    created: 0,
    updated: 0,
    skipped: 0,
    errors: [],
    lands: [],
  };

  for (const doc of snap.docs) {
    try {
      const listing = { ...doc.data(), listing_id: doc.id };
      if (!listing.owner_telegram_id) {
        result.skipped++;
        continue;
      }

      const owner = await getOrCreateOwner(listing.owner_telegram_id, fbUsersCol);
      const payload = listingToLandPayload(listing, owner.id);
      const { id, action } = upsertLand(payload);
      // Combine realistic images (en premier, pour la galerie) + images CDN Telegram (en suffixe).
      // Si Telegram CDN renvoie un screenshot test, l'utilisateur voit d'abord les images de qualité.
      const allImages = [...new Set([
        ...(payload._realistic_images || []),
        ...((listing.images || []).filter((u) => typeof u === "string")),
      ])];
      const imgN = syncImages(id, allImages);
      const docN = syncDocuments(id, listing.documents);

      if (action === "created") result.created++;
      else result.updated++;

      result.lands.push({
        local_id: id,
        firebase_id: doc.id,
        action,
        owner_id: owner.id,
        owner_name: owner.nom,
        title: payload.title,
        region: payload.region,
        images_count: imgN,
        documents_count: docN,
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`[FirebaseSync] erreur sur ${doc.id}:`, e.message);
      result.errors.push({ firebase_id: doc.id, error: e.message });
    }
  }

  return result;
}

let lastSync = null;

export function getLastSyncStatus() {
  return lastSync;
}

export async function runSync(opts = {}) {
  const startedAt = new Date().toISOString();
  try {
    const result = await syncFromFirebase(opts);
    lastSync = { ok: true, started_at: startedAt, finished_at: new Date().toISOString(), ...result };
    // eslint-disable-next-line no-console
    console.log(`[FirebaseSync] ${result.created} créés, ${result.updated} mis à jour, ${result.errors.length} erreurs`);
    return lastSync;
  } catch (e) {
    lastSync = { ok: false, started_at: startedAt, finished_at: new Date().toISOString(), error: e.message };
    // eslint-disable-next-line no-console
    console.error(`[FirebaseSync] échec:`, e.message);
    throw e;
  }
}

export function startAutoSync({ intervalMs = 5 * 60 * 1000 } = {}) {
  // Premier sync au démarrage (5s après pour ne pas bloquer)
  setTimeout(() => {
    runSync().catch(() => {});
  }, 5000);
  setInterval(() => {
    runSync().catch(() => {});
  }, intervalMs);
}
