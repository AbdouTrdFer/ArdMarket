import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

const dbPath = process.env.DATABASE_PATH || "./data/ardmarket.sqlite";
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

export const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

export function migrate() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role TEXT NOT NULL CHECK(role IN ('agriculteur','investisseur','notaire','fournisseur','admin')),
      nom TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      phone TEXT,
      whatsapp TEXT,
      region TEXT,
      plan TEXT NOT NULL DEFAULT 'free' CHECK(plan IN ('free','premium','enterprise')),
      credits INTEGER NOT NULL DEFAULT 0,
      boost_expires_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS lands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      region TEXT NOT NULL,
      commune TEXT,
      surface_ha REAL NOT NULL,
      price_per_year REAL,
      price_sale REAL,
      mode TEXT NOT NULL CHECK(mode IN ('location','vente','location_vente')),
      crop_type TEXT,
      has_water INTEGER DEFAULT 0,
      water_flow TEXT,
      soil_type TEXT,
      legal_status TEXT,
      distance_road_km REAL,
      latitude REAL,
      longitude REAL,
      cover_image TEXT,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('draft','pending','validated','rented','sold')),
      legal_score INTEGER,
      estimated_yield REAL,
      boost_expires_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS land_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      land_id INTEGER NOT NULL REFERENCES lands(id) ON DELETE CASCADE,
      url TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS land_documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      land_id INTEGER NOT NULL REFERENCES lands(id) ON DELETE CASCADE,
      type TEXT NOT NULL CHECK(type IN ('titre','note_renseignement','plan_amenagement','moulkia','autre')),
      url TEXT NOT NULL,
      extracted_json TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS offers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      land_id INTEGER NOT NULL REFERENCES lands(id) ON DELETE CASCADE,
      investor_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      price REAL NOT NULL,
      duration_years INTEGER,
      message TEXT,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','accepted','rejected','withdrawn')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS contact_unlocks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      investor_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      land_id INTEGER NOT NULL REFERENCES lands(id) ON DELETE CASCADE,
      credits_spent INTEGER NOT NULL,
      unlocked_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(investor_id, land_id)
    );

    CREATE TABLE IF NOT EXISTS ads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      advertiser_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      category TEXT NOT NULL CHECK(category IN ('intrants','machines','engrais','semences','notaire','autre')),
      title TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      target_url TEXT,
      active INTEGER DEFAULT 1,
      boost_level INTEGER DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL CHECK(type IN ('subscription','credits','boost','escrow','unlock')),
      amount REAL NOT NULL,
      metadata TEXT,
      status TEXT NOT NULL DEFAULT 'completed',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS whatsapp_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_whatsapp TEXT NOT NULL,
      audio_url TEXT,
      transcript TEXT,
      parsed_json TEXT,
      land_id INTEGER REFERENCES lands(id) ON DELETE SET NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS notary_profiles (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      photo_url TEXT,
      bio TEXT,
      address TEXT,
      city TEXT,
      years_experience INTEGER DEFAULT 0,
      contracts_count INTEGER DEFAULT 0,
      specialties TEXT,
      languages TEXT,
      hourly_rate REAL,
      rating_avg REAL DEFAULT 0,
      rating_count INTEGER DEFAULT 0,
      verified INTEGER DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS notary_reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      notary_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      author_name TEXT,
      rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
      comment TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_lands_region ON lands(region);
    CREATE INDEX IF NOT EXISTS idx_lands_status ON lands(status);
    CREATE INDEX IF NOT EXISTS idx_lands_crop ON lands(crop_type);
    CREATE INDEX IF NOT EXISTS idx_offers_land ON offers(land_id);
    CREATE INDEX IF NOT EXISTS idx_offers_investor ON offers(investor_id);
    CREATE INDEX IF NOT EXISTS idx_notary_reviews ON notary_reviews(notary_id);
  `);
}

migrate();

// Migrations additives idempotentes (pour ne pas casser les données existantes)
function safeAddColumn(table, col, def) {
  try {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${col} ${def}`);
  } catch {
    // colonne déjà présente, ignore
  }
}

safeAddColumn("users", "telegram_id", "TEXT");
safeAddColumn("lands", "source", "TEXT DEFAULT 'manual'");
safeAddColumn("lands", "firebase_listing_id", "TEXT");
safeAddColumn("lands", "tf_number", "TEXT");
safeAddColumn("lands", "owner_claimed_name", "TEXT");
safeAddColumn("lands", "duration_months", "INTEGER");
safeAddColumn("land_documents", "external_url", "TEXT");

try {
  db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_telegram ON users(telegram_id) WHERE telegram_id IS NOT NULL");
  db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_lands_firebase ON lands(firebase_listing_id) WHERE firebase_listing_id IS NOT NULL");
  db.exec("CREATE INDEX IF NOT EXISTS idx_lands_source ON lands(source)");
} catch {
  // ignore
}
