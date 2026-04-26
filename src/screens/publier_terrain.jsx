// PublierTerrain.jsx - Formulaire 3 étapes (Location → Détails → Review)
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const REGIONS = [
  "Taroudant",
  "Souss",
  "Meknès",
  "Gharb",
  "Haouz",
  "Beni Mellal",
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Fès",
  "Oujda",
  "Agadir",
  "Tanger",
  "Tétouan",
  "Khouribga",
  "Errachidia",
];

const CROPS = [
  { value: "agrumes", label: "Agrumes (orangers, citronniers)" },
  { value: "oliviers", label: "Oliviers" },
  { value: "céréales", label: "Céréales (blé, orge)" },
  { value: "fraise", label: "Fraises" },
  { value: "maraîchage", label: "Maraîchage" },
  { value: "arboriculture", label: "Arboriculture" },
  { value: "vigne", label: "Vigne" },
  { value: "cactus", label: "Cactus / Figuiers de Barbarie" },
  { value: "autre", label: "Autre" },
];

const SOIL_TYPES = [
  "Limono-argileux",
  "Argileux",
  "Sablo-limoneux",
  "Limoneux",
  "Sableux",
  "Caillouteux",
];

const LEGAL_STATUS = [
  "Titré (Melkia)",
  "Moulkia",
  "Habous",
  "Domaine privé de l'État",
  "Collectif",
];

const DOCUMENT_TYPES = [
  { value: "titre", label: "Titre foncier" },
  { value: "note_renseignement", label: "Note de renseignement" },
  { value: "plan_amenagement", label: "Plan d'aménagement" },
  { value: "moulkia", label: "Moulkia" },
  { value: "autre", label: "Autre" },
];

const C = {
  primary: "#1D9E75",
  primaryDark: "#00694c",
  bg: "#f5fbf5",
  text: "#171d1a",
  textSoft: "#3d4943",
  border: "#dee4de",
  borderActive: "#1D9E75",
  card: "#fff",
  danger: "#dc2626",
};

export default function PublierTerrain() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  // Step 1 — Location
  const [region, setRegion] = useState("");
  const [commune, setCommune] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [distanceRoadKm, setDistanceRoadKm] = useState("");
  const [title, setTitle] = useState("");

  // Step 2 — Details
  const [surfaceHa, setSurfaceHa] = useState("");
  const [cropType, setCropType] = useState("");
  const [soilType, setSoilType] = useState("");
  const [hasWater, setHasWater] = useState(true);
  const [waterFlow, setWaterFlow] = useState("");
  const [legalStatus, setLegalStatus] = useState("Titré (Melkia)");
  const [mode, setMode] = useState("location");
  const [pricePerYear, setPricePerYear] = useState("");
  const [priceSale, setPriceSale] = useState("");
  const [description, setDescription] = useState("");

  // Step 2 — Files
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [docFiles, setDocFiles] = useState([]); // [{file, type}]

  useEffect(() => {
    let cancelled = false;
    api
      .me()
      .then((r) => {
        if (cancelled) return;
        const me = r.user || r;
        setUser(me);
        if (me.role !== "agriculteur" && me.role !== "admin") {
          setError("Cette page est réservée aux agriculteurs.");
        }
      })
      .catch((err) => {
        if (cancelled) return;
        if (err.status === 401) {
          navigate("/connexion");
        } else {
          setError(err.message || "Erreur de connexion");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setImageFiles(files);
    const urls = files.map((f) => URL.createObjectURL(f));
    setImagePreview(urls);
  };

  const handleDocAdd = (file, type) => {
    if (!file) return;
    setDocFiles((prev) => [...prev, { file, type }]);
  };

  const removeDoc = (idx) => {
    setDocFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const validateStep1 = () => {
    if (!title || title.trim().length < 3) return "Titre obligatoire (min 3 caractères)";
    if (!region) return "Région obligatoire";
    return null;
  };

  const validateStep2 = () => {
    if (!surfaceHa || Number(surfaceHa) <= 0) return "Superficie en hectares obligatoire";
    if (!mode) return "Choisissez un mode (location, vente, ou les deux)";
    if (mode !== "vente" && !pricePerYear) return "Prix de location obligatoire";
    if (mode !== "location" && !priceSale) return "Prix de vente obligatoire";
    return null;
  };

  const next = () => {
    setError("");
    if (step === 1) {
      const err = validateStep1();
      if (err) return setError(err);
      setStep(2);
    } else if (step === 2) {
      const err = validateStep2();
      if (err) return setError(err);
      setStep(3);
    }
  };

  const prev = () => {
    setError("");
    if (step > 1) setStep(step - 1);
  };

  const submit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        title: title.trim(),
        description: description?.trim() || undefined,
        region,
        commune: commune?.trim() || undefined,
        surface_ha: Number(surfaceHa),
        mode,
        crop_type: cropType || undefined,
        has_water: !!hasWater,
        water_flow: waterFlow || undefined,
        soil_type: soilType || undefined,
        legal_status: legalStatus || undefined,
        distance_road_km: distanceRoadKm ? Number(distanceRoadKm) : undefined,
        latitude: latitude ? Number(latitude) : undefined,
        longitude: longitude ? Number(longitude) : undefined,
        price_per_year: pricePerYear ? Number(pricePerYear) : undefined,
        price_sale: priceSale ? Number(priceSale) : undefined,
      };

      const land = await api.createLand(payload);
      const landId = land.id;

      // Upload images
      if (imageFiles.length > 0) {
        try {
          await api.uploadLandImages(landId, imageFiles);
        } catch (e) {
          console.warn("Images upload failed:", e);
        }
      }

      // Upload documents
      for (const { file, type } of docFiles) {
        try {
          await api.uploadLandDocument(landId, file, type);
        } catch (e) {
          console.warn("Document upload failed:", e);
        }
      }

      navigate(`/terrain/${landId}`);
    } catch (err) {
      console.error(err);
      let msg = err.message || "Erreur lors de la publication";
      if (err.data?.error && typeof err.data.error === "object") {
        msg = JSON.stringify(err.data.error);
      }
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const isAgriculteur = user?.role === "agriculteur" || user?.role === "admin";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        * { font-family: 'Inter', sans-serif; box-sizing: border-box; margin: 0; padding: 0; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; }
        .pt-input { width: 100%; padding: 12px 14px; border-radius: 8px; border: 1px solid ${C.border}; background: #fff; font-size: 14px; color: ${C.text}; outline: none; transition: border-color .2s, box-shadow .2s; }
        .pt-input:focus { border-color: ${C.primary}; box-shadow: 0 0 0 3px rgba(29,158,117,.15); }
        .pt-label { font-size: 12px; font-weight: 600; color: ${C.textSoft}; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 6px; display: block; }
        .pt-btn-primary { background: ${C.primaryDark}; color: #fff; padding: 14px 28px; border-radius: 10px; border: none; font-weight: 700; font-size: 14px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: all .2s; }
        .pt-btn-primary:hover { background: #00553d; transform: translateY(-1px); }
        .pt-btn-secondary { background: #fff; color: ${C.text}; padding: 14px 28px; border-radius: 10px; border: 1px solid ${C.border}; font-weight: 600; font-size: 14px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; }
        .pt-pill { padding: 8px 14px; border-radius: 999px; border: 1px solid ${C.border}; background: #fff; font-size: 13px; font-weight: 500; color: ${C.text}; cursor: pointer; transition: all .15s; }
        .pt-pill.active { background: ${C.primaryDark}; color: #fff; border-color: ${C.primaryDark}; }
        .pt-card { background: #fff; border-radius: 16px; border: 1px solid ${C.border}; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,.03); }
      `}</style>
      <div style={{ minHeight: "100vh", backgroundColor: C.bg, color: C.text }}>
        {/* Header */}
        <header
          style={{
            backgroundColor: "rgba(255,255,255,.95)",
            backdropFilter: "blur(8px)",
            position: "sticky",
            top: 0,
            zIndex: 50,
            borderBottom: `1px solid ${C.border}`,
            padding: "16px 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            onClick={() => navigate("/dashboard-agriculteur")}
            style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
          >
            <span className="material-symbols-outlined" style={{ color: C.primary, fontSize: 28 }}>
              landscape
            </span>
            <span style={{ fontSize: 20, fontWeight: 800, color: C.primary, letterSpacing: "-.05em" }}>
              ArdMarket
            </span>
          </div>
          <button
            className="pt-btn-secondary"
            onClick={() => navigate("/dashboard-agriculteur")}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
            Annuler
          </button>
        </header>

        <main style={{ maxWidth: 920, margin: "0 auto", padding: "48px 24px 80px" }}>
          {/* Title */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-.02em" }}>
              Publier un nouveau terrain
            </h1>
            <p style={{ fontSize: 15, color: C.textSoft, marginTop: 8 }}>
              Renseignez les informations pour connecter votre terrain aux investisseurs adaptés.
            </p>
          </div>

          {/* Stepper */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              marginBottom: 40,
            }}
          >
            {[
              { n: 1, label: "Localisation" },
              { n: 2, label: "Détails & Documents" },
              { n: 3, label: "Récapitulatif" },
            ].map(({ n, label }, i, arr) => (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      backgroundColor: step >= n ? C.primaryDark : "#fff",
                      color: step >= n ? "#fff" : C.textSoft,
                      border: `2px solid ${step >= n ? C.primaryDark : C.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    {step > n ? (
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                        check
                      </span>
                    ) : (
                      n
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: step >= n ? C.primaryDark : C.textSoft,
                    }}
                  >
                    {label}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <div
                    style={{
                      width: 80,
                      height: 2,
                      backgroundColor: step > n ? C.primaryDark : C.border,
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Error banner */}
          {error && (
            <div
              style={{
                padding: 14,
                marginBottom: 20,
                backgroundColor: "#fee2e2",
                color: "#7f1d1d",
                border: "1px solid #fecaca",
                borderRadius: 10,
                fontSize: 14,
              }}
            >
              <strong>Erreur:</strong> {error}
            </div>
          )}

          {!isAgriculteur && user && (
            <div className="pt-card" style={{ textAlign: "center" }}>
              <p style={{ marginBottom: 16 }}>
                Pour publier un terrain, vous devez avoir un compte agriculteur.
              </p>
              <button className="pt-btn-primary" onClick={() => navigate("/dashboard-investisseur")}>
                Retour
              </button>
            </div>
          )}

          {isAgriculteur && (
            <div className="pt-card">
              {/* Step 1: Location */}
              {step === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <h2 style={{ fontSize: 24, fontWeight: 700 }}>Localisation</h2>
                  <p style={{ color: C.textSoft, fontSize: 14, marginTop: -12 }}>
                    Où se trouve votre terrain ?
                  </p>

                  <div>
                    <label className="pt-label">Titre de l'annonce *</label>
                    <input
                      className="pt-input"
                      placeholder="Ex: Domaine d'oliviers - Meknès, 15 hectares"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label className="pt-label">Région *</label>
                      <select
                        className="pt-input"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                      >
                        <option value="">Choisir une région...</option>
                        {REGIONS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="pt-label">Commune / Douar</label>
                      <input
                        className="pt-input"
                        placeholder="Ex: Ouled Teima"
                        value={commune}
                        onChange={(e) => setCommune(e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                    <div>
                      <label className="pt-label">Latitude (optionnel)</label>
                      <input
                        className="pt-input"
                        type="number"
                        step="0.0001"
                        placeholder="33.68"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="pt-label">Longitude (optionnel)</label>
                      <input
                        className="pt-input"
                        type="number"
                        step="0.0001"
                        placeholder="-5.37"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="pt-label">Distance route (km)</label>
                      <input
                        className="pt-input"
                        type="number"
                        step="0.1"
                        placeholder="2.5"
                        value={distanceRoadKm}
                        onChange={(e) => setDistanceRoadKm(e.target.value)}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: "rgba(29,158,117,.08)",
                      borderRadius: 10,
                      padding: 16,
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ color: C.primaryDark, fontSize: 22 }}
                    >
                      info
                    </span>
                    <p style={{ fontSize: 13, color: C.textSoft, lineHeight: 1.5 }}>
                      Astuce: vous pouvez récupérer les coordonnées GPS depuis Google Maps en
                      faisant un clic droit sur l'emplacement de votre terrain. Plus la
                      localisation est précise, plus votre annonce sera attractive.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Details */}
              {step === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <h2 style={{ fontSize: 24, fontWeight: 700 }}>Détails techniques</h2>
                  <p style={{ color: C.textSoft, fontSize: 14, marginTop: -12 }}>
                    Caractéristiques physiques, prix et documents
                  </p>

                  {/* Mode */}
                  <div>
                    <label className="pt-label">Mode</label>
                    <div style={{ display: "flex", gap: 12 }}>
                      {[
                        { v: "location", l: "Location" },
                        { v: "vente", l: "Vente" },
                        { v: "location_vente", l: "Les deux" },
                      ].map((o) => (
                        <button
                          key={o.v}
                          type="button"
                          className={`pt-pill ${mode === o.v ? "active" : ""}`}
                          onClick={() => setMode(o.v)}
                        >
                          {o.l}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label className="pt-label">Superficie totale (ha) *</label>
                      <input
                        className="pt-input"
                        type="number"
                        step="0.1"
                        placeholder="12.5"
                        value={surfaceHa}
                        onChange={(e) => setSurfaceHa(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="pt-label">Type de culture</label>
                      <select
                        className="pt-input"
                        value={cropType}
                        onChange={(e) => setCropType(e.target.value)}
                      >
                        <option value="">Choisir...</option>
                        {CROPS.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    {mode !== "vente" && (
                      <div>
                        <label className="pt-label">Prix location / an (DH) *</label>
                        <input
                          className="pt-input"
                          type="number"
                          placeholder="180000"
                          value={pricePerYear}
                          onChange={(e) => setPricePerYear(e.target.value)}
                        />
                      </div>
                    )}
                    {mode !== "location" && (
                      <div>
                        <label className="pt-label">Prix de vente (DH) *</label>
                        <input
                          className="pt-input"
                          type="number"
                          placeholder="2400000"
                          value={priceSale}
                          onChange={(e) => setPriceSale(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  {/* Sol & Eau */}
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginTop: 12 }}>Sol & Eau</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label className="pt-label">Type de sol</label>
                      <select
                        className="pt-input"
                        value={soilType}
                        onChange={(e) => setSoilType(e.target.value)}
                      >
                        <option value="">Choisir...</option>
                        {SOIL_TYPES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="pt-label">Statut juridique</label>
                      <select
                        className="pt-input"
                        value={legalStatus}
                        onChange={(e) => setLegalStatus(e.target.value)}
                      >
                        {LEGAL_STATUS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label className="pt-label">Accès à l'eau</label>
                      <div style={{ display: "flex", gap: 12 }}>
                        <button
                          type="button"
                          className={`pt-pill ${hasWater ? "active" : ""}`}
                          onClick={() => setHasWater(true)}
                        >
                          Oui
                        </button>
                        <button
                          type="button"
                          className={`pt-pill ${!hasWater ? "active" : ""}`}
                          onClick={() => setHasWater(false)}
                        >
                          Non
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="pt-label">Débit (si eau)</label>
                      <input
                        className="pt-input"
                        placeholder="Ex: 12L/s"
                        value={waterFlow}
                        onChange={(e) => setWaterFlow(e.target.value)}
                        disabled={!hasWater}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="pt-label">Description</label>
                    <textarea
                      className="pt-input"
                      rows={4}
                      placeholder="Décrivez votre terrain : sa beauté, ses atouts, l'historique d'exploitation..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  {/* Images */}
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginTop: 12 }}>
                    Photos du terrain
                  </h3>
                  <label
                    htmlFor="land-images"
                    style={{
                      border: `2px dashed ${C.border}`,
                      borderRadius: 12,
                      padding: 28,
                      textAlign: "center",
                      cursor: "pointer",
                      backgroundColor: "#fafdfa",
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 36, color: C.primary, display: "block" }}
                    >
                      cloud_upload
                    </span>
                    <p style={{ fontWeight: 600, marginTop: 8, color: C.text }}>
                      Cliquez pour téléverser ou glissez-déposez
                    </p>
                    <p style={{ fontSize: 12, color: C.textSoft, marginTop: 4 }}>
                      PNG, JPG, JPEG (idéalement vues drone, plan, photos terrain)
                    </p>
                    <input
                      id="land-images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImagesChange}
                      style={{ display: "none" }}
                    />
                  </label>
                  {imagePreview.length > 0 && (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                        gap: 12,
                      }}
                    >
                      {imagePreview.map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          alt={`Aperçu ${i + 1}`}
                          style={{
                            width: "100%",
                            height: 100,
                            objectFit: "cover",
                            borderRadius: 8,
                            border: `1px solid ${C.border}`,
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Documents */}
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginTop: 12 }}>
                    Documents légaux (recommandés pour score légal)
                  </h3>
                  <DocumentUploader onAdd={handleDocAdd} />
                  {docFiles.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {docFiles.map((d, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            backgroundColor: "rgba(29,158,117,.08)",
                            padding: "10px 14px",
                            borderRadius: 8,
                            fontSize: 13,
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: 18, color: C.primaryDark }}
                            >
                              description
                            </span>
                            <strong>
                              {DOCUMENT_TYPES.find((t) => t.value === d.type)?.label || d.type}
                            </strong>
                            <span style={{ color: C.textSoft }}>{d.file.name}</span>
                          </div>
                          <button
                            onClick={() => removeDoc(i)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: C.danger,
                            }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                              delete
                            </span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <h2 style={{ fontSize: 24, fontWeight: 700 }}>Récapitulatif</h2>
                  <p style={{ color: C.textSoft, fontSize: 14, marginTop: -12 }}>
                    Vérifiez les informations avant publication. Vous pourrez modifier votre
                    annonce plus tard.
                  </p>

                  <div
                    style={{
                      backgroundColor: "rgba(29,158,117,.06)",
                      border: `1px solid rgba(29,158,117,.2)`,
                      borderRadius: 12,
                      padding: 24,
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: C.text,
                        marginBottom: 4,
                      }}
                    >
                      {title}
                    </h3>
                    <p style={{ color: C.textSoft, fontSize: 14, marginBottom: 16 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: "middle" }}>
                        location_on
                      </span>{" "}
                      {[commune, region].filter(Boolean).join(", ") || region}
                    </p>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: 12,
                      }}
                    >
                      <ReviewRow label="Superficie" value={`${surfaceHa} ha`} />
                      <ReviewRow label="Mode" value={mode === "location_vente" ? "Location ou vente" : mode} />
                      {cropType && <ReviewRow label="Culture" value={cropType} />}
                      {soilType && <ReviewRow label="Sol" value={soilType} />}
                      <ReviewRow label="Eau" value={hasWater ? `Oui ${waterFlow ? `(${waterFlow})` : ""}` : "Non"} />
                      <ReviewRow label="Statut juridique" value={legalStatus} />
                      {pricePerYear && (
                        <ReviewRow
                          label="Loyer / an"
                          value={`${Number(pricePerYear).toLocaleString("fr-FR")} DH`}
                        />
                      )}
                      {priceSale && (
                        <ReviewRow
                          label="Prix vente"
                          value={`${Number(priceSale).toLocaleString("fr-FR")} DH`}
                        />
                      )}
                      {distanceRoadKm && (
                        <ReviewRow label="Distance route" value={`${distanceRoadKm} km`} />
                      )}
                      {(latitude || longitude) && (
                        <ReviewRow label="GPS" value={`${latitude}, ${longitude}`} />
                      )}
                    </div>
                    {description && (
                      <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                        <p style={{ fontSize: 13, color: C.textSoft, lineHeight: 1.6 }}>{description}</p>
                      </div>
                    )}
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                      <p style={{ fontSize: 13, color: C.textSoft }}>
                        <strong>{imageFiles.length}</strong> photo(s) — <strong>{docFiles.length}</strong> document(s)
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: "#fffbea",
                      border: "1px solid #fde68a",
                      padding: 14,
                      borderRadius: 10,
                      fontSize: 13,
                      color: "#7c5c00",
                    }}
                  >
                    <strong>📌 Prochaines étapes :</strong> votre annonce est en attente de
                    validation. Notre équipe la revoit sous 24h. Plus vous fournissez de documents
                    légaux, plus votre <strong>score légal</strong> sera élevé.
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 32,
                  paddingTop: 24,
                  borderTop: `1px solid ${C.border}`,
                }}
              >
                {step > 1 ? (
                  <button className="pt-btn-secondary" onClick={prev} disabled={submitting}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                      arrow_back
                    </span>
                    Précédent
                  </button>
                ) : (
                  <span />
                )}
                {step < 3 ? (
                  <button className="pt-btn-primary" onClick={next}>
                    Suivant
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                      arrow_forward
                    </span>
                  </button>
                ) : (
                  <button className="pt-btn-primary" onClick={submit} disabled={submitting}>
                    {submitting ? (
                      <>Publication...</>
                    ) : (
                      <>
                        Publier mon terrain
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                          check_circle
                        </span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div>
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          color: C.textSoft,
          letterSpacing: ".05em",
        }}
      >
        {label}
      </span>
      <p style={{ fontSize: 14, fontWeight: 600, color: C.text, marginTop: 2 }}>{value}</p>
    </div>
  );
}

function DocumentUploader({ onAdd }) {
  const [type, setType] = useState("titre");
  const inputId = "doc-add-input";
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
      <div style={{ flex: 1 }}>
        <label className="pt-label">Type de document</label>
        <select className="pt-input" value={type} onChange={(e) => setType(e.target.value)}>
          {DOCUMENT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      <label
        htmlFor={inputId}
        className="pt-btn-secondary"
        style={{ marginBottom: 0, cursor: "pointer" }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>upload_file</span>
        Ajouter
        <input
          id={inputId}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              onAdd(f, type);
              e.target.value = "";
            }
          }}
        />
      </label>
    </div>
  );
}
