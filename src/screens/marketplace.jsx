import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import { api } from "../services/api";

const CATEGORIES = [
  { id: "all", label: "Toutes", icon: "apps" },
  { id: "engrais", label: "Engrais", icon: "compost" },
  { id: "semences", label: "Semences", icon: "grass" },
  { id: "machines", label: "Machines", icon: "agriculture" },
  { id: "intrants", label: "Intrants", icon: "inventory_2" },
  { id: "notaire", label: "Notaires", icon: "gavel" },
];

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800";

function AdCard({ ad }) {
  const isBoosted = (ad.boost_level ?? 0) > 0;
  return (
    <article
      className="am-card am-card-hover am-fade-in"
      style={{
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        cursor: ad.target_url ? "pointer" : "default",
      }}
      onClick={() => {
        if (!ad.target_url) return;
        if (ad.target_url.startsWith("http")) window.open(ad.target_url, "_blank");
      }}
    >
      <div
        style={{
          position: "relative",
          aspectRatio: "16 / 10",
          backgroundColor: "#eef3ef",
          backgroundImage: `url(${ad.image_url || FALLBACK_IMG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {isBoosted && (
          <span
            className="am-badge am-badge-boost"
            style={{ position: "absolute", top: 12, left: 12 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
              bolt
            </span>
            Sponsorisé
          </span>
        )}
        <span
          className="am-pill"
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "rgba(255,255,255,0.95)",
          }}
        >
          {ad.category}
        </span>
      </div>
      <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.3 }}>{ad.title}</h3>
        {ad.description && (
          <p style={{ fontSize: 13, color: "var(--am-text-muted)", lineHeight: 1.5 }}>
            {ad.description}
          </p>
        )}
        <div
          style={{
            marginTop: "auto",
            paddingTop: 12,
            borderTop: "1px solid var(--am-border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 12, color: "var(--am-text-muted)" }}>
            {new Date(ad.created_at).toLocaleDateString("fr-FR")}
          </span>
          <button
            className="am-btn am-btn-primary"
            style={{ padding: "6px 14px", fontSize: 13 }}
            onClick={(e) => {
              e.stopPropagation();
              if (ad.target_url?.startsWith("http")) window.open(ad.target_url, "_blank");
            }}
          >
            Voir l'offre
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Marketplace() {
  const [category, setCategory] = useState("all");
  const [q, setQ] = useState("");
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await api.listAds(category === "all" ? {} : { category });
        if (!cancelled) {
          setAds(res.items || []);
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
  }, [category]);

  const filtered = q
    ? ads.filter(
        (a) =>
          a.title?.toLowerCase().includes(q.toLowerCase()) ||
          a.description?.toLowerCase().includes(q.toLowerCase()),
      )
    : ads;

  return (
    <AppShell>
      <section className="am-page-header">
        <div className="am-container">
          <h1>Marketplace fournisseurs</h1>
          <p>
            Engrais, semences, machines, irrigation — les meilleures offres pour vos terres louées
            et exploitations.
          </p>
        </div>
      </section>

      <section className="am-container" style={{ marginTop: -28, paddingBottom: 48 }}>
        <div
          className="am-card am-fade-in"
          style={{
            padding: 16,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ flex: 1, minWidth: 240, position: "relative" }}>
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
              placeholder="Rechercher engrais, machines, irrigation..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className="am-btn"
                style={{
                  background: category === c.id ? "var(--am-primary)" : "#fff",
                  color: category === c.id ? "#fff" : "var(--am-text)",
                  border:
                    category === c.id
                      ? "1px solid var(--am-primary)"
                      : "1px solid var(--am-border)",
                  padding: "8px 14px",
                  fontSize: 13,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                  {c.icon}
                </span>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 18,
              marginTop: 24,
            }}
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="am-skeleton"
                style={{ height: 320, borderRadius: "var(--am-radius)" }}
              />
            ))}
          </div>
        ) : error ? (
          <div className="am-empty">
            <span className="material-symbols-outlined">error</span>
            <p>{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="am-empty">
            <span className="material-symbols-outlined">storefront</span>
            <h3>Aucune offre pour ces filtres</h3>
            <p>Essayez une autre catégorie ou réinitialisez la recherche.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 18,
              marginTop: 24,
            }}
          >
            {filtered.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        )}

        <div
          className="am-card"
          style={{
            marginTop: 40,
            padding: 32,
            background: "linear-gradient(135deg, var(--am-primary-light), #fff)",
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1, minWidth: 280 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800 }}>Vous êtes fournisseur ?</h2>
            <p style={{ color: "var(--am-text-muted)", marginTop: 6 }}>
              Atteignez les paysans et investisseurs marocains. Boostez votre annonce pour apparaître
              en tête des résultats.
            </p>
          </div>
          <button
            className="am-btn am-btn-primary"
            style={{ padding: "12px 24px", fontSize: 15 }}
            onClick={() => alert("Contact: contact@ardmarket.ma")}
          >
            Publier une annonce
          </button>
        </div>
      </section>
    </AppShell>
  );
}
