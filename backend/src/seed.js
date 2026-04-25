import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "./db.js";
import { computeLegalScore } from "./ai/service.js";

// Reset tables (idempotent)
db.exec(`
  DELETE FROM whatsapp_messages;
  DELETE FROM transactions;
  DELETE FROM ads;
  DELETE FROM contact_unlocks;
  DELETE FROM offers;
  DELETE FROM land_documents;
  DELETE FROM land_images;
  DELETE FROM lands;
  DELETE FROM users;
  DELETE FROM sqlite_sequence;
`);

function hash(pw) {
  return bcrypt.hashSync(pw, 10);
}

// --- USERS ---------------------------------------------------------------
const users = [
  {
    role: "admin",
    nom: "Admin ArdMarket",
    email: "admin@ardmarket.ma",
    password: "admin123",
    phone: "+212600000000",
    region: "Casablanca",
    plan: "enterprise",
    credits: 1000,
  },
  {
    role: "agriculteur",
    nom: "Ahmed Mansouri",
    email: "ahmed@ardmarket.ma",
    password: "password123",
    phone: "+212661234567",
    whatsapp: "+212661234567",
    region: "Taroudant",
  },
  {
    role: "agriculteur",
    nom: "Fatima El Ouazzani",
    email: "fatima@ardmarket.ma",
    password: "password123",
    phone: "+212662345678",
    whatsapp: "+212662345678",
    region: "Meknès",
  },
  {
    role: "agriculteur",
    nom: "Mohamed Bensaid",
    email: "mohamed@ardmarket.ma",
    password: "password123",
    phone: "+212663456789",
    whatsapp: "+212663456789",
    region: "Gharb",
  },
  {
    role: "investisseur",
    nom: "Karim Benali",
    email: "karim@ardmarket.ma",
    password: "password123",
    phone: "+212670123456",
    region: "Casablanca",
    plan: "premium",
    credits: 50,
  },
  {
    role: "investisseur",
    nom: "Sara Benchekroun",
    email: "sara@ardmarket.ma",
    password: "password123",
    phone: "+212671234567",
    region: "Rabat",
    plan: "free",
    credits: 0,
  },
  {
    role: "notaire",
    nom: "Me. Hassan Alaoui",
    email: "hassan.notaire@ardmarket.ma",
    password: "password123",
    phone: "+212680123456",
    region: "Marrakech",
    plan: "premium",
  },
  {
    role: "notaire",
    nom: "Me. Nadia Idrissi",
    email: "nadia.notaire@ardmarket.ma",
    password: "password123",
    phone: "+212681234567",
    region: "Meknès",
  },
  {
    role: "fournisseur",
    nom: "AgriSupply Maroc",
    email: "agrisupply@ardmarket.ma",
    password: "password123",
    phone: "+212522334455",
    region: "Casablanca",
  },
];

const insertUser = db.prepare(
  `INSERT INTO users (role, nom, email, password_hash, phone, whatsapp, region, plan, credits, boost_expires_at)
   VALUES (@role, @nom, @email, @password_hash, @phone, @whatsapp, @region, @plan, @credits, @boost_expires_at)`,
);

const userIds = {};
for (const u of users) {
  const r = insertUser.run({
    role: u.role,
    nom: u.nom,
    email: u.email,
    password_hash: hash(u.password),
    phone: u.phone ?? null,
    whatsapp: u.whatsapp ?? null,
    region: u.region ?? null,
    plan: u.plan ?? "free",
    credits: u.credits ?? 0,
    boost_expires_at:
      u.email === "hassan.notaire@ardmarket.ma"
        ? new Date(Date.now() + 30 * 86400 * 1000).toISOString()
        : null,
  });
  userIds[u.email] = r.lastInsertRowid;
}

// --- LANDS ---------------------------------------------------------------
const lands = [
  {
    owner: "ahmed@ardmarket.ma",
    title: "Domaine d'Agrumes - Taroudant",
    description:
      "Superbe domaine de 12 hectares planté d'orangers et de citronniers matures. Irrigation par goutte-à-goutte. Situé à 25km de Taroudant.",
    region: "Taroudant",
    commune: "Ouled Teima",
    surface_ha: 12,
    price_per_year: 180000,
    price_sale: 2400000,
    mode: "location_vente",
    crop_type: "agrumes",
    has_water: 1,
    water_flow: "12L/s",
    soil_type: "Limono-argileux",
    legal_status: "Titré (Melkia)",
    distance_road_km: 1.5,
    latitude: 30.47,
    longitude: -8.88,
    cover_image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
    status: "validated",
    docs: ["titre", "note_renseignement", "plan_amenagement"],
  },
  {
    owner: "ahmed@ardmarket.ma",
    title: "Terres Arables - Beni Mellal",
    description:
      "25 hectares de terres fertiles idéales pour céréales. Forage existant. À 5 km de la route nationale.",
    region: "Beni Mellal",
    commune: "Kasba Tadla",
    surface_ha: 25,
    price_per_year: 125000,
    mode: "location",
    crop_type: "céréales",
    has_water: 1,
    water_flow: "8L/s",
    soil_type: "Argileux",
    legal_status: "Titré (Melkia)",
    distance_road_km: 5,
    status: "pending",
    docs: ["titre"],
  },
  {
    owner: "fatima@ardmarket.ma",
    title: "Domaine de l'Olivier - Meknès",
    description:
      "Magnifique oliveraie de 65 hectares sur les contreforts du Moyen Atlas. 8000 oliviers de la variété Picholine marocaine en production. Moulin à huile sur place.",
    region: "Meknès",
    commune: "El Hajeb",
    surface_ha: 65,
    price_per_year: 520000,
    price_sale: 7800000,
    mode: "location_vente",
    crop_type: "oliviers",
    has_water: 1,
    water_flow: "18L/s",
    soil_type: "Limono-argileux",
    legal_status: "Titré (Melkia)",
    distance_road_km: 2.3,
    latitude: 33.68,
    longitude: -5.37,
    cover_image:
      "https://images.unsplash.com/photo-1445264718234-a623be589d37?w=800",
    status: "validated",
    docs: ["titre", "note_renseignement", "plan_amenagement"],
    boost_days: 14,
  },
  {
    owner: "fatima@ardmarket.ma",
    title: "Ferme Fraisiers - Souss",
    description:
      "Exploitation de fraisiers sous serres sur 8 hectares. Contrat export déjà en place.",
    region: "Souss",
    commune: "Belfaa",
    surface_ha: 8,
    price_per_year: 640000,
    mode: "location",
    crop_type: "fraise",
    has_water: 1,
    water_flow: "20L/s",
    soil_type: "Sablo-limoneux",
    legal_status: "Titré (Melkia)",
    distance_road_km: 0.8,
    status: "validated",
    docs: ["titre", "note_renseignement"],
  },
  {
    owner: "mohamed@ardmarket.ma",
    title: "Plaine du Gharb - Grande parcelle",
    description:
      "150 hectares de terres plates idéales pour céréales intensives ou maraîchage de plein champ.",
    region: "Gharb",
    commune: "Sidi Slimane",
    surface_ha: 150,
    price_per_year: 900000,
    mode: "location",
    crop_type: "céréales",
    has_water: 1,
    water_flow: "25L/s",
    soil_type: "Limoneux",
    legal_status: "Titré (Melkia)",
    distance_road_km: 3.2,
    status: "validated",
    docs: ["titre", "plan_amenagement"],
  },
  {
    owner: "mohamed@ardmarket.ma",
    title: "Terrain nu - Haouz",
    description:
      "35 hectares de terrain nu, potentiel pour arboriculture ou maraîchage. Eau à creuser.",
    region: "Haouz",
    commune: "Tameslouht",
    surface_ha: 35,
    price_per_year: 140000,
    mode: "location",
    crop_type: "maraîchage",
    has_water: 0,
    soil_type: "Sablo-limoneux",
    legal_status: "Moulkia",
    distance_road_km: 8,
    status: "pending",
    docs: ["moulkia"],
  },
];

const insertLand = db.prepare(
  `INSERT INTO lands (owner_id, title, description, region, commune, surface_ha, price_per_year, price_sale, mode, crop_type, has_water, water_flow, soil_type, legal_status, distance_road_km, latitude, longitude, cover_image, status, legal_score, boost_expires_at)
   VALUES (@owner_id, @title, @description, @region, @commune, @surface_ha, @price_per_year, @price_sale, @mode, @crop_type, @has_water, @water_flow, @soil_type, @legal_status, @distance_road_km, @latitude, @longitude, @cover_image, @status, @legal_score, @boost_expires_at)`,
);
const insertDoc = db.prepare(
  `INSERT INTO land_documents (land_id, type, url, extracted_json) VALUES (?, ?, ?, ?)`,
);

for (const l of lands) {
  const docs = (l.docs || []).map((t) => ({ type: t }));
  const legal_score = computeLegalScore(docs);
  const boost = l.boost_days
    ? new Date(Date.now() + l.boost_days * 86400 * 1000).toISOString()
    : null;
  const r = insertLand.run({
    owner_id: userIds[l.owner],
    title: l.title,
    description: l.description,
    region: l.region,
    commune: l.commune ?? null,
    surface_ha: l.surface_ha,
    price_per_year: l.price_per_year ?? null,
    price_sale: l.price_sale ?? null,
    mode: l.mode,
    crop_type: l.crop_type ?? null,
    has_water: l.has_water ?? 0,
    water_flow: l.water_flow ?? null,
    soil_type: l.soil_type ?? null,
    legal_status: l.legal_status ?? null,
    distance_road_km: l.distance_road_km ?? null,
    latitude: l.latitude ?? null,
    longitude: l.longitude ?? null,
    cover_image: l.cover_image ?? null,
    status: l.status,
    legal_score,
    boost_expires_at: boost,
  });
  const landId = r.lastInsertRowid;
  for (const t of l.docs || []) {
    insertDoc.run(
      landId,
      t,
      `https://example.ardmarket.ma/docs/seed/${t}.pdf`,
      JSON.stringify({
        provider: "seed",
        extracted: {
          type: t,
          region: l.region,
          surface_detectee_ha: l.surface_ha,
          culture_suggeree: l.crop_type,
          has_water: !!l.has_water,
          soil_type: l.soil_type,
          legal_status: l.legal_status,
        },
      }),
    );
  }
}

// --- OFFERS --------------------------------------------------------------
const insertOffer = db.prepare(
  `INSERT INTO offers (land_id, investor_id, price, duration_years, message, status) VALUES (?, ?, ?, ?, ?, ?)`,
);
const sampleLand = db
  .prepare("SELECT id FROM lands WHERE title LIKE 'Domaine d''Agrumes%'")
  .get();
if (sampleLand) {
  insertOffer.run(
    sampleLand.id,
    userIds["karim@ardmarket.ma"],
    450000,
    5,
    "Je propose une location longue durée de 5 ans, bonne gestion garantie.",
    "pending",
  );
}

// --- ADS -----------------------------------------------------------------
const insertAd = db.prepare(
  `INSERT INTO ads (advertiser_id, category, title, description, image_url, target_url, active, boost_level)
   VALUES (?, ?, ?, ?, ?, ?, 1, ?)`,
);
const adv = userIds["agrisupply@ardmarket.ma"];
insertAd.run(
  adv,
  "intrants",
  "Semences certifiées -20%",
  "Offre exclusive ArdMarket sur nos semences bio.",
  null,
  "https://agrisupply.ma",
  3,
);
insertAd.run(
  adv,
  "machines",
  "Location moissonneuse batteuse",
  "Tarifs préférentiels pour la récolte 2025.",
  null,
  "https://agrisupply.ma",
  1,
);
insertAd.run(
  adv,
  "engrais",
  "Engrais NPK - promo été",
  "Livraison offerte dès 500kg.",
  null,
  "https://agrisupply.ma",
  2,
);

console.log("✓ Seed terminé:");
console.log("   Users:", db.prepare("SELECT COUNT(*) as c FROM users").get().c);
console.log("   Lands:", db.prepare("SELECT COUNT(*) as c FROM lands").get().c);
console.log("   Ads:", db.prepare("SELECT COUNT(*) as c FROM ads").get().c);
console.log("\nComptes de test (mot de passe: password123):");
console.log("  admin@ardmarket.ma           admin / plan enterprise");
console.log("  ahmed@ardmarket.ma           agriculteur Taroudant");
console.log("  fatima@ardmarket.ma          agriculteur Meknès");
console.log("  mohamed@ardmarket.ma         agriculteur Gharb");
console.log("  karim@ardmarket.ma           investisseur premium (50 crédits)");
console.log("  sara@ardmarket.ma            investisseur free (0 crédits)");
console.log("  hassan.notaire@ardmarket.ma  notaire boosté");
console.log("  nadia.notaire@ardmarket.ma   notaire standard");
console.log("  agrisupply@ardmarket.ma      fournisseur");
