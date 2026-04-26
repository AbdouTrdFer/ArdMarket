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
  DELETE FROM notary_reviews;
  DELETE FROM notary_profiles;
  DELETE FROM users;
  DELETE FROM sqlite_sequence;
`);

// Pools d'images réalistes (drone, vue plan, vue paysage, sol, irrigation)
// Toutes en provenance d'Unsplash (libres) pour représenter des terrains marocains.
const LAND_IMAGE_POOLS = {
  agrumes: [
    "https://images.unsplash.com/photo-1547514701-42782101795e?w=1200",
    "https://images.unsplash.com/photo-1591735557715-37bd7baef5cb?w=1200",
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200",
    "https://images.unsplash.com/photo-1597474561103-0b73c6dba8da?w=1200",
  ],
  oliviers: [
    "https://images.unsplash.com/photo-1445264718234-a623be589d37?w=1200",
    "https://images.unsplash.com/photo-1601566091022-a6d22b0ec0b0?w=1200",
    "https://images.unsplash.com/photo-1525498128493-380d1990a112?w=1200",
    "https://images.unsplash.com/photo-1471696035578-3d8c78d99684?w=1200",
  ],
  céréales: [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200",
    "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200",
    "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1200",
    "https://images.unsplash.com/photo-1444858345736-67cb3a4f1bf6?w=1200",
  ],
  fraise: [
    "https://images.unsplash.com/photo-1565710302983-cabe46c2f7da?w=1200",
    "https://images.unsplash.com/photo-1518635017498-87f514b751ba?w=1200",
    "https://images.unsplash.com/photo-1543158266-0066955047b1?w=1200",
  ],
  maraîchage: [
    "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1200",
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200",
    "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1200",
  ],
  default: [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200",
    "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1200",
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200",
  ],
};

function imagesFor(crop) {
  return LAND_IMAGE_POOLS[crop] || LAND_IMAGE_POOLS.default;
}

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
    whatsapp: "+212680123456",
    region: "Marrakech",
    plan: "premium",
  },
  {
    role: "notaire",
    nom: "Me. Nadia Idrissi",
    email: "nadia.notaire@ardmarket.ma",
    password: "password123",
    phone: "+212681234567",
    whatsapp: "+212681234567",
    region: "Meknès",
  },
  {
    role: "notaire",
    nom: "Me. Youssef Tahiri",
    email: "youssef.notaire@ardmarket.ma",
    password: "password123",
    phone: "+212682345678",
    whatsapp: "+212682345678",
    region: "Taroudant",
    plan: "premium",
  },
  {
    role: "notaire",
    nom: "Me. Aïcha Benkirane",
    email: "aicha.notaire@ardmarket.ma",
    password: "password123",
    phone: "+212683456789",
    whatsapp: "+212683456789",
    region: "Gharb",
  },
  {
    role: "notaire",
    nom: "Me. Karim Lahlou",
    email: "karim.notaire@ardmarket.ma",
    password: "password123",
    phone: "+212684567890",
    whatsapp: "+212684567890",
    region: "Beni Mellal",
  },
  {
    role: "fournisseur",
    nom: "AgriSupply Maroc",
    email: "agrisupply@ardmarket.ma",
    password: "password123",
    phone: "+212522334455",
    region: "Casablanca",
  },
  {
    role: "fournisseur",
    nom: "Semences du Souss",
    email: "semences-souss@ardmarket.ma",
    password: "password123",
    phone: "+212528998877",
    region: "Souss",
  },
  {
    role: "fournisseur",
    nom: "Hydro-Irrigation MA",
    email: "hydro-irrigation@ardmarket.ma",
    password: "password123",
    phone: "+212523445566",
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
      ["hassan.notaire@ardmarket.ma", "youssef.notaire@ardmarket.ma"].includes(u.email)
        ? new Date(Date.now() + 30 * 86400 * 1000).toISOString()
        : null,
  });
  userIds[u.email] = r.lastInsertRowid;
}

// --- NOTARY PROFILES + REVIEWS ------------------------------------------
const insertNotaryProfile = db.prepare(
  `INSERT INTO notary_profiles (user_id, photo_url, bio, address, city, years_experience, contracts_count, specialties, languages, hourly_rate, rating_avg, rating_count, verified)
   VALUES (@user_id, @photo_url, @bio, @address, @city, @years_experience, @contracts_count, @specialties, @languages, @hourly_rate, @rating_avg, @rating_count, @verified)`,
);

const notaryProfiles = [
  {
    email: "hassan.notaire@ardmarket.ma",
    photo_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400",
    bio: "15 ans d'expérience en droit foncier agricole et contrats de location longue durée. Spécialiste des titres melkia et des successions.",
    address: "45 Avenue Mohammed VI, Guéliz",
    city: "Marrakech",
    years_experience: 15,
    contracts_count: 240,
    specialties: ["foncier_agricole", "location_longue_duree", "successions", "melkia"],
    languages: ["Arabe", "Français", "Anglais", "Tachelhit"],
    hourly_rate: 1200,
    verified: 1,
  },
  {
    email: "nadia.notaire@ardmarket.ma",
    photo_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
    bio: "Notaire à Meknès, experte en transactions foncières et baux ruraux. Accompagnement bilingue arabe/français.",
    address: "12 Rue Antsirabe, Hamria",
    city: "Meknès",
    years_experience: 10,
    contracts_count: 150,
    specialties: ["baux_ruraux", "vente_terrains", "foncier_agricole"],
    languages: ["Arabe", "Français"],
    hourly_rate: 900,
    verified: 1,
  },
  {
    email: "youssef.notaire@ardmarket.ma",
    photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    bio: "Spécialiste agrumiculture et exportation. Cabinet basé à Taroudant, accompagne les exploitants du Souss-Massa.",
    address: "Quartier Erracha",
    city: "Taroudant",
    years_experience: 12,
    contracts_count: 180,
    specialties: ["foncier_agricole", "export", "vente_terrains", "location_longue_duree"],
    languages: ["Arabe", "Français", "Tachelhit"],
    hourly_rate: 1000,
    verified: 1,
  },
  {
    email: "aicha.notaire@ardmarket.ma",
    photo_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
    bio: "Notaire experte en mode coopérative et propriétés collectives dans la région du Gharb.",
    address: "6 Avenue Hassan II",
    city: "Sidi Slimane",
    years_experience: 8,
    contracts_count: 95,
    specialties: ["cooperatives", "proprietes_collectives", "baux_ruraux"],
    languages: ["Arabe", "Français"],
    hourly_rate: 800,
    verified: 0,
  },
  {
    email: "karim.notaire@ardmarket.ma",
    photo_url: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400",
    bio: "Notaire à Beni Mellal, traitement rapide des dossiers, focus sur les céréales et plaines fertiles.",
    address: "Boulevard Mohammed V",
    city: "Beni Mellal",
    years_experience: 6,
    contracts_count: 70,
    specialties: ["foncier_agricole", "successions"],
    languages: ["Arabe", "Français"],
    hourly_rate: 700,
    verified: 0,
  },
];

for (const p of notaryProfiles) {
  insertNotaryProfile.run({
    user_id: userIds[p.email],
    photo_url: p.photo_url,
    bio: p.bio,
    address: p.address,
    city: p.city,
    years_experience: p.years_experience,
    contracts_count: p.contracts_count,
    specialties: JSON.stringify(p.specialties),
    languages: JSON.stringify(p.languages),
    hourly_rate: p.hourly_rate,
    rating_avg: 0,
    rating_count: 0,
    verified: p.verified,
  });
}

// Reviews: generate a few per notary so rating shows up
const insertReview = db.prepare(
  `INSERT INTO notary_reviews (notary_id, author_id, author_name, rating, comment) VALUES (?, ?, ?, ?, ?)`,
);
const reviewsSeed = [
  { email: "hassan.notaire@ardmarket.ma", reviews: [
    { rating: 5, author: "Karim Benali", text: "Très professionnel, contrat finalisé en 8 jours." },
    { rating: 5, author: "Sara Benchekroun", text: "Conseils précieux, recommandé." },
    { rating: 4, author: "Ahmed Mansouri", text: "Bon accompagnement, prix correct." },
  ]},
  { email: "nadia.notaire@ardmarket.ma", reviews: [
    { rating: 5, author: "Fatima El Ouazzani", text: "Très réactive et bilingue, parfait." },
    { rating: 4, author: "Karim Benali", text: "Bonne expérience pour bail rural 10 ans." },
  ]},
  { email: "youssef.notaire@ardmarket.ma", reviews: [
    { rating: 5, author: "Investisseur Casablanca", text: "Connaît parfaitement la zone agrumes Souss." },
    { rating: 5, author: "Ahmed Mansouri", text: "Le meilleur de Taroudant pour le foncier." },
    { rating: 4, author: "Sara Benchekroun", text: "Réponse rapide aux demandes." },
    { rating: 5, author: "Karim Benali", text: "Pro, transparent, recommandé." },
  ]},
  { email: "aicha.notaire@ardmarket.ma", reviews: [
    { rating: 4, author: "Mohamed Bensaid", text: "Très bien pour les coopératives." },
  ]},
  { email: "karim.notaire@ardmarket.ma", reviews: [
    { rating: 4, author: "Fatima El Ouazzani", text: "Disponible et efficace." },
    { rating: 3, author: "Sara Benchekroun", text: "Service correct, à recontacter." },
  ]},
];
for (const r of reviewsSeed) {
  const notaryId = userIds[r.email];
  for (const rev of r.reviews) {
    insertReview.run(notaryId, null, rev.author, rev.rating, rev.text);
  }
  const agg = db
    .prepare(`SELECT AVG(rating) as avg, COUNT(*) as cnt FROM notary_reviews WHERE notary_id = ?`)
    .get(notaryId);
  db.prepare(
    `UPDATE notary_profiles SET rating_avg = ?, rating_count = ? WHERE user_id = ?`,
  ).run(agg.avg ?? 0, agg.cnt ?? 0, notaryId);
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
    latitude: 32.42,
    longitude: -6.18,
    cover_image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200",
    status: "validated",
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
    latitude: 30.18,
    longitude: -9.49,
    cover_image: "https://images.unsplash.com/photo-1565710302983-cabe46c2f7da?w=1200",
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
    latitude: 34.27,
    longitude: -5.93,
    cover_image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200",
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
    latitude: 31.54,
    longitude: -7.99,
    cover_image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1200",
    status: "validated",
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

const insertImage = db.prepare(
  `INSERT INTO land_images (land_id, url) VALUES (?, ?)`,
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

  // Insert plusieurs images par terre (cover_image en premier, puis 2-3 du pool)
  const imgPool = imagesFor(l.crop_type);
  const seen = new Set();
  const imgs = [];
  if (l.cover_image) {
    imgs.push(l.cover_image);
    seen.add(l.cover_image);
  }
  for (const url of imgPool) {
    if (imgs.length >= 4) break;
    if (seen.has(url)) continue;
    imgs.push(url);
    seen.add(url);
  }
  for (const url of imgs) {
    insertImage.run(landId, url);
  }

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
const advSemences = userIds["semences-souss@ardmarket.ma"];
const advHydro = userIds["hydro-irrigation@ardmarket.ma"];
const advNotaire = userIds["hassan.notaire@ardmarket.ma"];

const adsSeed = [
  {
    user: adv,
    category: "semences",
    title: "Semences certifiées -20%",
    description: "Blé, maïs, orge — semences certifiées ONSSA. Offre exclusive ArdMarket sur 500kg+.",
    image_url: "https://images.unsplash.com/photo-1530507629858-e3759c3ce5e8?w=800",
    target_url: "https://agrisupply.ma/semences",
    boost_level: 3,
  },
  {
    user: adv,
    category: "engrais",
    title: "Engrais NPK 15-15-15 — promo été",
    description: "Livraison offerte dès 500kg. Adapté céréales, agrumes, oliviers.",
    image_url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
    target_url: "https://agrisupply.ma/engrais",
    boost_level: 2,
  },
  {
    user: adv,
    category: "machines",
    title: "Location moissonneuse batteuse",
    description: "Tarifs préférentiels pour la récolte 2025. Tracteurs et matériel.",
    image_url: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800",
    target_url: "https://agrisupply.ma/location",
    boost_level: 1,
  },
  {
    user: advSemences,
    category: "semences",
    title: "Plants de fraisiers Camarosa",
    description: "Plants frigo-conservés haute qualité, livrés sous 48h sur Souss et Gharb.",
    image_url: "https://images.unsplash.com/photo-1518635017498-87f514b751ba?w=800",
    target_url: "https://semences-souss.ma",
    boost_level: 2,
  },
  {
    user: advSemences,
    category: "intrants",
    title: "Pack démarrage maraîcher",
    description: "Semences + paillage + filets anti-insectes. Pour 1 hectare.",
    image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
    target_url: "https://semences-souss.ma/pack",
    boost_level: 0,
  },
  {
    user: advHydro,
    category: "machines",
    title: "Système goutte-à-goutte clé-en-main",
    description: "Étude + installation + maintenance. Économie d'eau jusqu'à 60%.",
    image_url: "https://images.unsplash.com/photo-1586339949216-35c2747cc36d?w=800",
    target_url: "https://hydro-irrigation.ma",
    boost_level: 4,
  },
  {
    user: advHydro,
    category: "machines",
    title: "Forage de puits + pompe solaire",
    description: "Devis sous 24h, garantie 5 ans, financement Crédit Agricole disponible.",
    image_url: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800",
    target_url: "https://hydro-irrigation.ma/forage",
    boost_level: 1,
  },
  {
    user: advNotaire,
    category: "notaire",
    title: "Me. Hassan Alaoui — 15 ans d'expérience",
    description: "Spécialiste contrats fonciers agricoles. Cabinet à Marrakech.",
    image_url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800",
    target_url: "/notaire/7",
    boost_level: 5,
  },
];
for (const a of adsSeed) {
  insertAd.run(
    a.user,
    a.category,
    a.title,
    a.description,
    a.image_url,
    a.target_url,
    a.boost_level,
  );
}

console.log("✓ Seed terminé:");
console.log("   Users:", db.prepare("SELECT COUNT(*) as c FROM users").get().c);
console.log("   Lands:", db.prepare("SELECT COUNT(*) as c FROM lands").get().c);
console.log("   Ads:", db.prepare("SELECT COUNT(*) as c FROM ads").get().c);
console.log("   Notaires:", db.prepare("SELECT COUNT(*) as c FROM notary_profiles").get().c);
console.log("\nComptes de test (mot de passe: password123):");
console.log("  admin@ardmarket.ma             admin / plan enterprise");
console.log("  ahmed@ardmarket.ma             agriculteur Taroudant");
console.log("  fatima@ardmarket.ma            agriculteur Meknès");
console.log("  mohamed@ardmarket.ma           agriculteur Gharb");
console.log("  karim@ardmarket.ma             investisseur premium (50 crédits)");
console.log("  sara@ardmarket.ma              investisseur free (0 crédits)");
console.log("  hassan.notaire@ardmarket.ma    notaire boosté Marrakech");
console.log("  nadia.notaire@ardmarket.ma     notaire Meknès");
console.log("  youssef.notaire@ardmarket.ma   notaire boosté Taroudant");
console.log("  aicha.notaire@ardmarket.ma     notaire Gharb");
console.log("  karim.notaire@ardmarket.ma     notaire Beni Mellal");
console.log("  agrisupply@ardmarket.ma        fournisseur intrants/engrais");
console.log("  semences-souss@ardmarket.ma    fournisseur semences");
console.log("  hydro-irrigation@ardmarket.ma  fournisseur irrigation");
