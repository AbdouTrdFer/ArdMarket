import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import { api, getStoredUser } from "../services/api";

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
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600";

function Stars({ value = 0, size = 18 }) {
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

export default function NotaireDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [n, setN] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const me = getStoredUser();

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.getNotary(id);
      setN(res);
      setError(null);
    } catch (e) {
      setError(e.message || "Notaire introuvable");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        const res = await api.getNotary(id);
        if (!cancelled) {
          setN(res);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError(e.message || "Notaire introuvable");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    init();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!me) {
      navigate("/connexion");
      return;
    }
    setSubmitting(true);
    try {
      await api.reviewNotary(id, reviewForm);
      setReviewForm({ rating: 5, comment: "" });
      load();
    } catch (err) {
      alert(err.message || "Erreur");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="am-container" style={{ padding: 48 }}>
          <div className="am-skeleton" style={{ height: 200, borderRadius: 16 }} />
        </div>
      </AppShell>
    );
  }
  if (error || !n) {
    return (
      <AppShell>
        <div className="am-empty">
          <span className="material-symbols-outlined">error</span>
          <h3>{error || "Notaire introuvable"}</h3>
          <button className="am-btn am-btn-primary" onClick={() => navigate("/notaires")}>
            Retour aux notaires
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className="am-page-header">
        <div className="am-container">
          <button
            className="am-btn am-btn-ghost"
            style={{ color: "#fff", marginBottom: 12, padding: "6px 12px" }}
            onClick={() => navigate("/notaires")}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              arrow_back
            </span>
            Retour aux notaires
          </button>
          <h1>{n.nom}</h1>
          <p>
            {n.city || n.region}
            {n.years_experience > 0 && ` — ${n.years_experience} ans d'expérience`}
          </p>
        </div>
      </section>

      <section
        className="am-container"
        style={{
          marginTop: -28,
          paddingBottom: 48,
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(280px, 1fr)",
          gap: 24,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <article className="am-card am-fade-in" style={{ padding: 24, display: "flex", gap: 20 }}>
            <div
              style={{
                width: 120,
                height: 120,
                flexShrink: 0,
                borderRadius: "50%",
                background: `url(${n.photo_url || FALLBACK_PHOTO}) center/cover`,
                border: "4px solid var(--am-primary-light)",
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>{n.nom}</h2>
                {n.verified && (
                  <span className="am-badge am-badge-verified">
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                      verified
                    </span>
                    Vérifié
                  </span>
                )}
                {n.boosted && (
                  <span className="am-badge am-badge-boost">
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                      workspace_premium
                    </span>
                    Premium
                  </span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                <Stars value={n.rating_avg} size={20} />
                <span style={{ fontSize: 14, color: "var(--am-text-muted)" }}>
                  {n.rating_avg ? n.rating_avg.toFixed(1) : "—"}/5 ({n.rating_count} avis)
                </span>
              </div>
              {n.bio && (
                <p style={{ marginTop: 12, color: "var(--am-text-muted)", lineHeight: 1.6 }}>
                  {n.bio}
                </p>
              )}
            </div>
          </article>

          <article className="am-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>Expertise & spécialités</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
              {n.specialties?.length === 0 && (
                <span style={{ color: "var(--am-text-muted)", fontSize: 14 }}>
                  Aucune spécialité renseignée.
                </span>
              )}
              {n.specialties?.map((s) => (
                <span
                  key={s}
                  className="am-badge"
                  style={{ background: "var(--am-primary-light)" }}
                >
                  {SPEC_LABEL[s] || s}
                </span>
              ))}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: 12,
                marginTop: 20,
              }}
            >
              <div className="am-card" style={{ padding: 14 }}>
                <div style={{ fontSize: 12, color: "var(--am-text-muted)" }}>Expérience</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "var(--am-primary-dark)" }}>
                  {n.years_experience} ans
                </div>
              </div>
              <div className="am-card" style={{ padding: 14 }}>
                <div style={{ fontSize: 12, color: "var(--am-text-muted)" }}>Contrats traités</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "var(--am-primary-dark)" }}>
                  {n.contracts_count}+
                </div>
              </div>
              {n.hourly_rate && (
                <div className="am-card" style={{ padding: 14 }}>
                  <div style={{ fontSize: 12, color: "var(--am-text-muted)" }}>
                    Tarif consultation
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "var(--am-primary-dark)" }}>
                    {n.hourly_rate} DH
                  </div>
                </div>
              )}
              {n.languages?.length > 0 && (
                <div className="am-card" style={{ padding: 14 }}>
                  <div style={{ fontSize: 12, color: "var(--am-text-muted)" }}>Langues</div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>
                    {n.languages.join(", ")}
                  </div>
                </div>
              )}
            </div>
          </article>

          <article className="am-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>
              Avis ({n.reviews?.length || 0})
            </h3>
            {n.reviews?.length === 0 ? (
              <p style={{ color: "var(--am-text-muted)", marginTop: 12 }}>
                Aucun avis pour le moment. Soyez le premier !
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 14 }}>
                {n.reviews.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      padding: 14,
                      borderRadius: "var(--am-radius-sm)",
                      background: "var(--am-bg)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <strong style={{ fontSize: 14 }}>{r.author_name || "Anonyme"}</strong>
                      <Stars value={r.rating} size={14} />
                    </div>
                    {r.comment && (
                      <p
                        style={{
                          fontSize: 13,
                          color: "var(--am-text-muted)",
                          marginTop: 6,
                          lineHeight: 1.5,
                        }}
                      >
                        {r.comment}
                      </p>
                    )}
                    <span style={{ fontSize: 11, color: "var(--am-text-muted)" }}>
                      {new Date(r.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {me && me.id !== n.id && (
              <form
                onSubmit={submitReview}
                style={{
                  marginTop: 20,
                  paddingTop: 16,
                  borderTop: "1px solid var(--am-border)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <strong style={{ fontSize: 14 }}>Laisser un avis</strong>
                <div style={{ display: "flex", gap: 4, fontSize: 24, cursor: "pointer" }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span
                      key={i}
                      onClick={() => setReviewForm((f) => ({ ...f, rating: i }))}
                      style={{ color: i <= reviewForm.rating ? "#f59e0b" : "#e5e7eb" }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <textarea
                  className="am-textarea"
                  rows={3}
                  placeholder="Votre commentaire (optionnel)"
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm((f) => ({ ...f, comment: e.target.value }))
                  }
                />
                <button
                  className="am-btn am-btn-primary"
                  type="submit"
                  disabled={submitting}
                  style={{ alignSelf: "flex-start" }}
                >
                  {submitting ? "Envoi..." : "Publier mon avis"}
                </button>
              </form>
            )}
          </article>
        </div>

        <aside style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <article className="am-card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Contacter</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
              {n.phone && (
                <a
                  href={`tel:${n.phone}`}
                  className="am-btn am-btn-secondary"
                  style={{ textDecoration: "none" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    call
                  </span>
                  {n.phone}
                </a>
              )}
              {n.whatsapp && (
                <a
                  href={`https://wa.me/${n.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="am-btn"
                  style={{
                    background: "#25D366",
                    color: "#fff",
                    textDecoration: "none",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    chat
                  </span>
                  WhatsApp
                </a>
              )}
              {n.email && (
                <a
                  href={`mailto:${n.email}`}
                  className="am-btn am-btn-ghost"
                  style={{ textDecoration: "none" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    mail
                  </span>
                  {n.email}
                </a>
              )}
            </div>
          </article>
          <article className="am-card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Adresse</h3>
            <p
              style={{
                marginTop: 8,
                color: "var(--am-text-muted)",
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              {n.address || "—"}
              <br />
              {n.city || n.region}
            </p>
          </article>
        </aside>
      </section>
    </AppShell>
  );
}
