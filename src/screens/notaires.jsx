import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import { api } from "../services/api";

const REGIONS = [
  "Toutes",
  "Marrakech",
  "Meknès",
  "Taroudant",
  "Gharb",
  "Beni Mellal",
  "Souss",
  "Casablanca",
];

const SPECIALTIES = [
  { id: "", label: "Toutes spécialités" },
  { id: "foncier_agricole", label: "Foncier agricole" },
  { id: "baux_ruraux", label: "Baux ruraux" },
  { id: "vente_terrains", label: "Vente terrains" },
  { id: "successions", label: "Successions" },
  { id: "cooperatives", label: "Coopératives" },
  { id: "melkia", label: "Melkia / titres" },
  { id: "export", label: "Export" },
];

const SPEC_LABEL = {
  foncier_agricole: "Foncier agricole",
  baux_ruraux: "Baux ruraux",
  location_longue_duree: "Location longue durée",
  vente_terrains: "Vente terrains",
  successions: "Successions",
  cooperatives: "Coopératives",
  proprietes_collectives: "Propriétés collectives",
  melkia: "Melkia",
  export: "Export",
};

const FALLBACK_PHOTO =
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400";

function Stars({ value = 0, size = 16 }) {
  const full = Math.round(value);
  return (
    <span className="am-stars" style={{ fontSize: size }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= full ? "" : "am-stars-empty"}>
          ★
        </span>
      ))}
    </span>
  );
}

export function NotaryCard({ n, onClick }) {
  return (
    <article
      className="am-card am-card-hover am-fade-in"
      onClick={onClick}
      style={{
        padding: 18,
        display: "flex",
        gap: 16,
        cursor: "pointer",
        position: "relative",
      }}
    >
      {n.boosted && (
        <span
          className="am-badge am-badge-boost"
          style={{ position: "absolute", top: 12, right: 12 }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
            workspace_premium
          </span>
          Premium
        </span>
      )}
      <div
        style={{
          width: 72,
          height: 72,
          flexShrink: 0,
          borderRadius: "50%",
          background: `url(${n.photo_url || FALLBACK_PHOTO}) center/cover`,
          border: "3px solid var(--am-primary-light)",
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{n.nom}</h3>
          {n.verified && (
            <span className="am-badge am-badge-verified">
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                verified
              </span>
              Vérifié
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
          <Stars value={n.rating_avg} size={14} />
          <span style={{ fontSize: 12, color: "var(--am-text-muted)" }}>
            {n.rating_avg ? n.rating_avg.toFixed(1) : "—"} ({n.rating_count} avis)
          </span>
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            fontSize: 13,
            color: "var(--am-text-muted)",
            marginTop: 6,
            flexWrap: "wrap",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              place
            </span>
            {n.city || n.region}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              schedule
            </span>
            {n.years_experience} ans
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              description
            </span>
            {n.contracts_count} contrats
          </span>
        </div>
        {n.specialties?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
            {n.specialties.slice(0, 3).map((s) => (
              <span key={s} className="am-pill">
                {SPEC_LABEL[s] || s}
              </span>
            ))}
            {n.specialties.length > 3 && (
              <span className="am-pill">+{n.specialties.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default function NotairesPage() {
  const navigate = useNavigate();
  const [region, setRegion] = useState("Toutes");
  const [specialty, setSpecialty] = useState("");
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const params = {};
      if (region && region !== "Toutes") params.region = region;
      if (specialty) params.specialty = specialty;
      if (q) params.q = q;
      try {
        const res = await api.listNotaries(params);
        if (!cancelled) {
          setItems(res.items || []);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError(e.message || "Erreur de chargement");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [region, specialty, q]);

  const counts = useMemo(() => {
    const boosted = items.filter((n) => n.boosted).length;
    return { total: items.length, boosted };
  }, [items]);

  return (
    <AppShell>
      <section className="am-page-header">
        <div className="am-container">
          <h1>Notaires partenaires</h1>
          <p>
            Trouvez le notaire idéal pour sécuriser votre contrat de location ou de vente foncière
            agricole.
          </p>
        </div>
      </section>

      <section className="am-container" style={{ marginTop: -28, paddingBottom: 48 }}>
        <div
          className="am-card am-fade-in"
          style={{
            padding: 16,
            display: "grid",
            gridTemplateColumns: "1fr 200px 220px",
            gap: 12,
          }}
        >
          <div style={{ position: "relative" }}>
            <span
              className="material-symbols-outlined"
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--am-text-muted)",
                fontSize: 20,
              }}
            >
              search
            </span>
            <input
              className="am-input"
              style={{ paddingLeft: 38 }}
              placeholder="Rechercher par nom, ville, expertise..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <select
            className="am-select"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <select
            className="am-select"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
          >
            {SPECIALTIES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 20,
            marginBottom: 12,
          }}
        >
          <span style={{ color: "var(--am-text-muted)", fontSize: 14 }}>
            {counts.total} notaire{counts.total > 1 ? "s" : ""}
            {counts.boosted > 0 && (
              <span style={{ marginLeft: 8 }}>
                — <strong>{counts.boosted}</strong> Premium en tête
              </span>
            )}
          </span>
        </div>

        {loading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
              gap: 16,
            }}
          >
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="am-skeleton"
                style={{ height: 140, borderRadius: "var(--am-radius)" }}
              />
            ))}
          </div>
        ) : error ? (
          <div className="am-empty">
            <span className="material-symbols-outlined">error</span>
            <p>{error}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="am-empty">
            <span className="material-symbols-outlined">gavel</span>
            <h3>Aucun notaire trouvé</h3>
            <p>Essayez une autre région ou réinitialisez les filtres.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
              gap: 16,
            }}
          >
            {items.map((n) => (
              <NotaryCard key={n.id} n={n} onClick={() => navigate(`/notaire/${n.id}`)} />
            ))}
          </div>
        )}

        <div
          className="am-card"
          style={{
            marginTop: 40,
            padding: 28,
            background: "linear-gradient(135deg, var(--am-primary-dark), var(--am-primary))",
            color: "#fff",
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1, minWidth: 280 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800 }}>Vous êtes notaire ?</h2>
            <p style={{ opacity: 0.9, marginTop: 6 }}>
              Rejoignez ArdMarket et accédez à des centaines de transactions foncières agricoles.
              Avec le pack Premium, votre profil apparaît en tête des recherches.
            </p>
          </div>
          <button
            className="am-btn"
            style={{ background: "#fff", color: "var(--am-primary-dark)", padding: "12px 24px" }}
            onClick={() => alert("Contact: contact@ardmarket.ma — pack Notaire Premium")}
          >
            Devenir Notaire Premium
          </button>
        </div>
      </section>
    </AppShell>
  );
}
