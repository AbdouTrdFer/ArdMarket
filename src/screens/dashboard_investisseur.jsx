// DashboardInvestisseur.jsx - branché sur l'API backend
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

const REGIONS = ["Meknès", "Souss", "Gharb", "Haouz", "Taroudant", "Beni Mellal"];
const CROPS = [
  { value: "agrumes", label: "Agrumes" },
  { value: "oliviers", label: "Oliviers" },
  { value: "céréales", label: "Céréales" },
  { value: "fraise", label: "Fraises" },
  { value: "maraîchage", label: "Maraîchage" },
];

const C = {
  primary: "#1D9E75",
  primaryDark: "#00694c",
  bg: "#f5fbf5",
  text: "#171d1a",
  textSoft: "#3d4943",
  border: "#dee4de",
};

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop";

export default function DashboardInvestisseur() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedCrops, setSelectedCrops] = useState([]);
  const [surfaceMin, setSurfaceMin] = useState("");
  const [surfaceMax, setSurfaceMax] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [hasWaterFilter, setHasWaterFilter] = useState("any");

  useEffect(() => {
    api.me().then((r) => setUser(r.user || r)).catch(() => {});
    fetchLands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLands = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.listLands();
      setLands(res.items || res.lands || []);
    } catch (err) {
      setError(err.message || "Erreur de chargement");
      setLands([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return lands.filter((l) => {
      if (search) {
        const s = search.toLowerCase();
        const hay = `${l.title} ${l.region} ${l.commune || ""} ${l.crop_type || ""} ${l.description || ""}`.toLowerCase();
        if (!hay.includes(s)) return false;
      }
      if (selectedRegions.length && !selectedRegions.includes(l.region)) return false;
      if (selectedCrops.length && !selectedCrops.includes(l.crop_type)) return false;
      if (surfaceMin && l.surface_ha < Number(surfaceMin)) return false;
      if (surfaceMax && l.surface_ha > Number(surfaceMax)) return false;
      const price = l.price_per_year || l.price_sale || 0;
      if (priceMin && price < Number(priceMin)) return false;
      if (priceMax && price > Number(priceMax)) return false;
      if (hasWaterFilter === "yes" && !l.has_water) return false;
      if (hasWaterFilter === "no" && l.has_water) return false;
      return true;
    });
  }, [lands, search, selectedRegions, selectedCrops, surfaceMin, surfaceMax, priceMin, priceMax, hasWaterFilter]);

  const toggleRegion = (r) => {
    setSelectedRegions((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));
  };

  const toggleCrop = (c) => {
    setSelectedCrops((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  };

  const handleLogout = () => {
    api.logout();
    navigate("/connexion");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        * { font-family: 'Inter', sans-serif; box-sizing: border-box; margin: 0; padding: 0; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; }
        .land-card { transition: all .2s; }
        .land-card:hover { box-shadow: 0 12px 28px rgba(0,0,0,.08); transform: translateY(-2px); }
        .di-input { width: 100%; padding: 8px 12px; border-radius: 6px; border: 1px solid ${C.border}; background: #fff; font-size: 13px; outline: none; }
        .di-input:focus { border-color: ${C.primary}; }
      `}</style>
      <div style={{ minHeight: "100vh", backgroundColor: C.bg, color: C.text }}>
        {/* Header */}
        <header
          style={{
            backgroundColor: "rgba(255,255,255,.95)",
            backdropFilter: "blur(12px)",
            position: "sticky",
            top: 0,
            zIndex: 50,
            borderBottom: `1px solid ${C.border}`,
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div
            onClick={() => navigate("/")}
            style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
          >
            <span className="material-symbols-outlined" style={{ color: C.primary, fontSize: 26 }}>
              landscape
            </span>
            <span style={{ fontSize: 20, fontWeight: 800, color: C.primary, letterSpacing: "-.05em" }}>
              ArdMarket
            </span>
          </div>
          <nav style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {[
              { label: "Terres", to: "/dashboard-investisseur", icon: "landscape" },
              { label: "Marketplace", to: "/marketplace", icon: "storefront" },
              { label: "Notaires", to: "/notaires", icon: "gavel" },
            ].map((n) => (
              <span
                key={n.to}
                onClick={() => navigate(n.to)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "8px 12px",
                  borderRadius: 999,
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "background-color 0.2s, color 0.2s",
                  background: location.pathname === n.to ? "rgba(29,158,117,.12)" : "transparent",
                  color: location.pathname === n.to ? C.primaryDark : C.text,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  {n.icon}
                </span>
                {n.label}
              </span>
            ))}
          </nav>
          <div style={{ flex: 1, maxWidth: 360, position: "relative" }}>
            <span
              className="material-symbols-outlined"
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: C.textSoft,
                fontSize: 20,
              }}
            >
              search
            </span>
            <input
              className="di-input"
              style={{ paddingLeft: 40, padding: "10px 12px 10px 40px" }}
              placeholder="Rechercher région, culture, commune..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {user && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 12px",
                  backgroundColor: "rgba(29,158,117,.08)",
                  borderRadius: 999,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: C.primaryDark }}>
                  toll
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.primaryDark }}>
                  {user.credits ?? 0} crédits
                </span>
              </div>
            )}
            <button
              onClick={() => navigate("/profil")}
              style={{
                background: "none",
                border: `1px solid ${C.border}`,
                padding: "8px 14px",
                borderRadius: 999,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person</span>
              {user?.nom?.split(" ")[0] || "Mon Compte"}
            </button>
            <button
              onClick={handleLogout}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#dc2626",
                padding: 6,
              }}
              title="Déconnexion"
            >
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            gap: 0,
            maxWidth: 1440,
            margin: "0 auto",
          }}
        >
          {/* Sidebar Filters */}
          <aside
            style={{
              borderRight: `1px solid ${C.border}`,
              backgroundColor: "#fff",
              minHeight: "calc(100vh - 60px)",
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 28,
              position: "sticky",
              top: 60,
              alignSelf: "flex-start",
              maxHeight: "calc(100vh - 60px)",
              overflowY: "auto",
            }}
          >
            <h2 style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em" }}>
              Filtres
            </h2>

            <FilterGroup label="Région">
              {REGIONS.map((r) => (
                <label key={r} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={selectedRegions.includes(r)}
                    onChange={() => toggleRegion(r)}
                    style={{ accentColor: C.primaryDark, width: 16, height: 16 }}
                  />
                  <span style={{ fontSize: 13 }}>{r}</span>
                </label>
              ))}
            </FilterGroup>

            <FilterGroup label="Type de culture">
              {CROPS.map((c) => (
                <label key={c.value} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={selectedCrops.includes(c.value)}
                    onChange={() => toggleCrop(c.value)}
                    style={{ accentColor: C.primaryDark, width: 16, height: 16 }}
                  />
                  <span style={{ fontSize: 13 }}>{c.label}</span>
                </label>
              ))}
            </FilterGroup>

            <FilterGroup label="Superficie (ha)">
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  className="di-input"
                  type="number"
                  placeholder="Min"
                  value={surfaceMin}
                  onChange={(e) => setSurfaceMin(e.target.value)}
                />
                <span style={{ color: C.textSoft }}>—</span>
                <input
                  className="di-input"
                  type="number"
                  placeholder="Max"
                  value={surfaceMax}
                  onChange={(e) => setSurfaceMax(e.target.value)}
                />
              </div>
            </FilterGroup>

            <FilterGroup label="Prix (DH)">
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  className="di-input"
                  type="number"
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                />
                <span style={{ color: C.textSoft }}>—</span>
                <input
                  className="di-input"
                  type="number"
                  placeholder="Max"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                />
              </div>
            </FilterGroup>

            <FilterGroup label="Accès à l'eau">
              <select
                className="di-input"
                value={hasWaterFilter}
                onChange={(e) => setHasWaterFilter(e.target.value)}
              >
                <option value="any">Peu importe</option>
                <option value="yes">Avec eau</option>
                <option value="no">Sans eau</option>
              </select>
            </FilterGroup>

            <button
              onClick={() => {
                setSelectedRegions([]);
                setSelectedCrops([]);
                setSurfaceMin("");
                setSurfaceMax("");
                setPriceMin("");
                setPriceMax("");
                setHasWaterFilter("any");
                setSearch("");
              }}
              style={{
                background: "none",
                border: `1px solid ${C.border}`,
                padding: "10px",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                color: C.textSoft,
              }}
            >
              Réinitialiser
            </button>
          </aside>

          {/* Main */}
          <main style={{ padding: 32 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: 24,
              }}
            >
              <div>
                <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-.02em" }}>
                  Bonjour {user?.nom?.split(" ")[0] || "Investisseur"}
                </h1>
                <p style={{ fontSize: 14, color: C.textSoft, marginTop: 4 }}>
                  {filtered.length} terrain{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {error && (
              <div
                style={{
                  padding: 12,
                  marginBottom: 16,
                  backgroundColor: "#fee2e2",
                  color: "#7f1d1d",
                  borderRadius: 8,
                  fontSize: 14,
                }}
              >
                {error}
              </div>
            )}

            {loading ? (
              <p style={{ textAlign: "center", padding: 48, color: C.textSoft }}>
                Chargement des terrains...
              </p>
            ) : filtered.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: 64,
                  background: "#fff",
                  borderRadius: 12,
                  border: `1px dashed ${C.border}`,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 48, color: C.textSoft }}>
                  search_off
                </span>
                <p style={{ marginTop: 12, fontSize: 16, fontWeight: 600 }}>
                  Aucun terrain ne correspond à vos critères
                </p>
                <p style={{ fontSize: 13, color: C.textSoft, marginTop: 4 }}>
                  Essayez d'élargir vos filtres
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                  gap: 20,
                }}
              >
                {filtered.map((land) => (
                  <LandCard key={land.id} land={land} onClick={() => navigate(`/terrain/${land.id}`)} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

function FilterGroup({ label, children }) {
  return (
    <div>
      <h3
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: ".1em",
          textTransform: "uppercase",
          color: C.textSoft,
          marginBottom: 12,
        }}
      >
        {label}
      </h3>
      {children}
    </div>
  );
}

function LandCard({ land, onClick }) {
  const img = land.cover_image || (land.images && land.images[0]?.url) || FALLBACK_IMG;
  const score = land.legal_score ?? 70;
  const scoreColor = score >= 85 ? C.primaryDark : score >= 65 ? "#704200" : "#9b1c1c";
  const status = land.status;
  const validated = status === "validated";
  const price = land.price_per_year || land.price_sale;
  const priceLabel = land.mode === "vente" ? "Prix de vente" : "Loyer / an";
  return (
    <div
      onClick={onClick}
      className="land-card"
      style={{
        backgroundColor: "#fff",
        borderRadius: 12,
        border: `1px solid ${C.border}`,
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(0,0,0,.03)",
      }}
    >
      <div style={{ height: 180, position: "relative", overflow: "hidden" }}>
        <img
          src={img}
          alt={land.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMG;
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            backgroundColor: validated ? "rgba(232,245,241,.95)" : "rgba(248,241,231,.95)",
            color: validated ? C.primary : "#BA7517",
            padding: "4px 10px",
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
            {validated ? "verified" : "pending"}
          </span>
          {validated ? "Validé" : "En attente"}
        </div>
        {land.boost_expires_at && new Date(land.boost_expires_at) > new Date() && (
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              backgroundColor: "#fef3c7",
              color: "#92400e",
              padding: "4px 10px",
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>star</span>
            BOOST
          </div>
        )}
        {land.source === "telegram_bot" && (
          <div
            title="Annonce soumise par le paysan via le bot Telegram en darija"
            style={{
              position: "absolute",
              bottom: 12,
              left: 12,
              backgroundColor: "rgba(255,255,255,.95)",
              color: "#0088cc",
              padding: "4px 10px",
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 4,
              boxShadow: "0 2px 8px rgba(0,0,0,.08)",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>smart_toy</span>
            Bot Telegram (Darija)
          </div>
        )}
      </div>
      <div style={{ padding: 18 }}>
        <h3
          style={{
            fontSize: 17,
            fontWeight: 700,
            marginBottom: 6,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {land.title}
        </h3>
        <p
          style={{
            fontSize: 13,
            color: C.textSoft,
            display: "flex",
            alignItems: "center",
            gap: 4,
            marginBottom: 12,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            location_on
          </span>
          {[land.commune, land.region].filter(Boolean).join(", ")}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <Stat label="Superficie" value={`${land.surface_ha} ha`} />
          <Stat label="Culture" value={land.crop_type || "—"} />
        </div>

        <div
          style={{
            backgroundColor: C.bg,
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            padding: 10,
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 11, color: C.textSoft, fontWeight: 600, textTransform: "uppercase" }}>
            Score Légal IA
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 80, height: 6, backgroundColor: C.border, borderRadius: 999, overflow: "hidden" }}>
              <div
                style={{
                  width: `${score}%`,
                  height: "100%",
                  backgroundColor: scoreColor,
                  borderRadius: 999,
                }}
              />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: scoreColor }}>{score}/100</span>
          </div>
        </div>

        {price && (
          <div
            style={{
              borderTop: `1px solid ${C.border}`,
              paddingTop: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <p style={{ fontSize: 11, color: C.textSoft, fontWeight: 600 }}>{priceLabel}</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: C.primaryDark }}>
                {Number(price).toLocaleString("fr-FR")} DH
              </p>
            </div>
            <button
              style={{
                backgroundColor: C.primaryDark,
                color: "#fff",
                border: "none",
                padding: "10px 14px",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              Détails
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                arrow_forward
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p style={{ fontSize: 10, color: C.textSoft, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em" }}>
        {label}
      </p>
      <p style={{ fontSize: 14, fontWeight: 600, marginTop: 2, textTransform: "capitalize" }}>{value}</p>
    </div>
  );
}
