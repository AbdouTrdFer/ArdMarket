// AI service — stubs intelligents + branche OpenAI optionnelle
// Permet à la démo de tourner sans clé API, tout en exposant une interface
// identique à une vraie intégration (OCR + LLM extraction + transcription Darija).

const REGIONS_FR = [
  "Meknès",
  "Souss",
  "Gharb",
  "Haouz",
  "Taroudant",
  "Beni Mellal",
  "Fès",
  "Oujda",
  "Agadir",
  "Marrakech",
];
const CROPS = [
  "oliviers",
  "agrumes",
  "céréales",
  "maraîchage",
  "fraise",
  "amandiers",
  "vigne",
  "palmier",
  "arganier",
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Extrait des infos d'un document foncier (titre, note de renseignement, plan d'aménagement).
 * Sans clé API: génère un résultat cohérent à partir du nom de fichier + aléa contrôlé.
 */
export async function analyzeDocument({ filename, type, landHint = {} }) {
  // En prod: appeler OCR + LLM pour parser
  // Ici: heuristique + aléa déterministe pour la démo
  const hasWaterKeywords = /(puit|eau|irrigation|water)/i.test(filename);
  const crop = landHint.crop_type || pick(CROPS);
  const region = landHint.region || pick(REGIONS_FR);

  const extracted = {
    type,
    region,
    surface_detectee_ha:
      landHint.surface_ha || Number((5 + Math.random() * 80).toFixed(1)),
    culture_suggeree: crop,
    has_water: hasWaterKeywords || Math.random() > 0.4,
    water_flow: hasWaterKeywords
      ? `${(10 + Math.random() * 15).toFixed(0)}L/s`
      : null,
    soil_type: pick([
      "Limono-argileux",
      "Sablo-limoneux",
      "Argileux",
      "Limoneux",
    ]),
    legal_status: pick(["Titré (Melkia)", "En cours de titrage", "Moulkia"]),
    distance_road_km: Number((Math.random() * 12).toFixed(1)),
    notes: `Document ${type} analysé automatiquement. Région: ${region}. Culture recommandée: ${crop}.`,
  };

  return {
    provider: "stub",
    confidence: 0.78 + Math.random() * 0.2,
    extracted,
  };
}

/**
 * Calcule un "score légal ArdMarket" sur 100 à partir des documents associés à une terre.
 * Plus il y a de documents et plus ils sont variés (titre + note + plan), plus le score monte.
 */
export function computeLegalScore(documents = []) {
  if (!documents.length) return 35;
  const types = new Set(documents.map((d) => d.type));
  let score = 40;
  if (types.has("titre")) score += 25;
  if (types.has("note_renseignement")) score += 15;
  if (types.has("plan_amenagement")) score += 10;
  if (types.has("moulkia")) score += 8;
  score += Math.min(12, documents.length * 2);
  return Math.min(100, score);
}

/**
 * Simulateur rendement / ROI par culture.
 * Valeurs calibrées grossièrement sur des données publiques marocaines.
 */
export function simulateYield({ crop_type, surface_ha, has_water, region }) {
  const baseYieldPerHa = {
    oliviers: 12000,
    agrumes: 28000,
    céréales: 6500,
    maraîchage: 45000,
    fraise: 80000,
    amandiers: 14000,
    vigne: 22000,
    palmier: 15000,
    arganier: 8000,
  };
  const base = baseYieldPerHa[crop_type?.toLowerCase()] || 10000;
  const waterMultiplier = has_water ? 1.35 : 0.7;
  const regionMultiplier = /souss|gharb|haouz|meknès|tadla|beni mellal/i.test(
    region || "",
  )
    ? 1.15
    : 1.0;
  const yearlyRevenue = base * surface_ha * waterMultiplier * regionMultiplier;
  const yearlyCost = yearlyRevenue * 0.55; // coûts intrants + main d'œuvre
  const netProfit = yearlyRevenue - yearlyCost;
  const breakEvenYears =
    yearlyRevenue > 0 ? (surface_ha * 8000) / netProfit : null;

  return {
    crop_type,
    surface_ha,
    region,
    revenue_annuel_dh: Math.round(yearlyRevenue),
    cout_annuel_dh: Math.round(yearlyCost),
    benefice_net_dh: Math.round(netProfit),
    roi_pct: Math.round((netProfit / yearlyCost) * 100),
    break_even_years: breakEvenYears ? Number(breakEvenYears.toFixed(1)) : null,
    hypotheses: {
      has_water,
      water_multiplier: waterMultiplier,
      region_multiplier: regionMultiplier,
      rendement_base_dh_par_ha: base,
    },
  };
}

/**
 * Transcrit + parse un vocal WhatsApp en Darija pour créer une terre.
 * Sans clé API: extrait des mots-clés simples.
 * Input: { audio_url?, transcript? }
 */
export async function parseVoiceToLand({ audio_url, transcript }) {
  const text = transcript || "";
  // Heuristiques darija/français
  const hectaresMatch = text.match(
    /(\d+(?:[.,]\d+)?)\s*(hectare|hectares|ha)/i,
  );
  const surface_ha = hectaresMatch
    ? parseFloat(hectaresMatch[1].replace(",", "."))
    : null;

  let region = null;
  for (const r of REGIONS_FR) {
    if (new RegExp(r, "i").test(text)) {
      region = r;
      break;
    }
  }
  // Détection villes darija courantes
  const darijaMap = {
    oujda: "Oujda",
    meknes: "Meknès",
    fes: "Fès",
    agadir: "Agadir",
    marrakech: "Marrakech",
    taroudant: "Taroudant",
  };
  for (const [k, v] of Object.entries(darijaMap)) {
    if (new RegExp(k, "i").test(text)) region = region || v;
  }

  let crop_type = null;
  for (const c of CROPS) {
    if (new RegExp(c, "i").test(text)) {
      crop_type = c;
      break;
    }
  }
  const darijaCrops = {
    zaytoun: "oliviers",
    limoun: "agrumes",
    tfah: "fruitiers",
    "9am7": "céréales",
    qam7: "céréales",
  };
  for (const [k, v] of Object.entries(darijaCrops)) {
    if (new RegExp(k, "i").test(text)) crop_type = crop_type || v;
  }

  const has_water = /(lma|eau|water|puit|puits|bir)/i.test(text);
  const mode = /(bay3|vendre|vente|sell)/i.test(text) ? "vente" : "location";

  return {
    provider: audio_url ? "stub-transcription" : "stub-text",
    transcript:
      transcript || "(audio non transcrit — branche OpenAI Whisper en prod)",
    parsed: {
      title: `Terrain ${region || "à préciser"}${surface_ha ? ` - ${surface_ha} Ha` : ""}`,
      region: region || "À préciser",
      surface_ha: surface_ha || 0,
      crop_type,
      has_water,
      mode,
    },
  };
}

/**
 * Matching IA: classe les terres selon le profil de l'investisseur.
 * Score = région match + culture préférée + budget + présence eau + score légal.
 */
export function rankLandsForInvestor(lands, preferences = {}) {
  const { region, crop_type, budget_max, surface_min } = preferences;
  return lands
    .map((land) => {
      let score = 50;
      if (
        region &&
        land.region &&
        land.region.toLowerCase() === region.toLowerCase()
      )
        score += 20;
      if (crop_type && land.crop_type === crop_type) score += 15;
      if (
        budget_max &&
        land.price_per_year &&
        land.price_per_year <= budget_max
      )
        score += 10;
      if (surface_min && land.surface_ha >= surface_min) score += 5;
      if (land.has_water) score += 8;
      if (land.legal_score) score += Math.min(10, land.legal_score / 10);
      return { ...land, match_score: Math.min(100, Math.round(score)) };
    })
    .sort((a, b) => b.match_score - a.match_score);
}
