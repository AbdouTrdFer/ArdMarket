// Profil.jsx - Gestion du profil (agriculteur + investisseur)
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
];

const PLANS = [
  {
    key: "free",
    name: "Free",
    color: "#94a3b8",
    price: "0 DH",
    perks: ["Voir les annonces", "Contacts masqués", "1 publication"],
  },
  {
    key: "premium",
    name: "Premium",
    color: "#1D9E75",
    price: "299 DH / mois",
    perks: [
      "50 crédits / mois",
      "Voir contacts (10 cr / déblocage)",
      "Recommandations IA",
      "Score légal détaillé",
    ],
  },
  {
    key: "enterprise",
    name: "Enterprise",
    color: "#885200",
    price: "Sur devis",
    perks: [
      "Crédits illimités",
      "API et exports",
      "Support dédié",
      "Boost prioritaire",
    ],
  },
];

const C = {
  primary: "#1D9E75",
  primaryDark: "#00694c",
  bg: "#f5fbf5",
  text: "#171d1a",
  textSoft: "#3d4943",
  border: "#dee4de",
  card: "#fff",
};

export default function Profil() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    api
      .me()
      .then((r) => {
        setUser(r.user || r);
        setLoading(false);
      })
      .catch((err) => {
        if (err.status === 401) navigate("/connexion");
        else setError(err.message);
        setLoading(false);
      });
  }, [navigate]);

  const handleSubscribe = async (plan) => {
    if (user.plan === plan && plan !== "free") return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await api.subscribe(plan);
      setUser((u) => ({ ...u, plan: res.plan, credits: res.credits }));
      setSuccess(
        plan === "free"
          ? "Abonnement résilié"
          : `Abonnement ${plan} activé ! ${res.credits ?? 0} crédits ajoutés.`,
      );
    } catch (err) {
      setError(err.message || "Erreur abonnement");
    } finally {
      setSaving(false);
    }
  };

  const handleBuyCredits = async (pack) => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await api.purchaseCredits(pack);
      setUser((u) => ({ ...u, credits: res.credits }));
      setSuccess(`Pack ${pack} achat\u00e9. Solde : ${res.credits} cr\u00e9dits.`);
    } catch (err) {
      setError(err.message || "Erreur achat");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    navigate("/connexion");
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: C.bg,
        }}
      >
        <p>Chargement...</p>
      </div>
    );
  }

  if (!user) return null;

  const isInvestisseur = user.role === "investisseur";
  const dashboardPath = isInvestisseur
    ? "/dashboard-investisseur"
    : "/dashboard-agriculteur";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        * { font-family: 'Inter', sans-serif; box-sizing: border-box; margin: 0; padding: 0; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; }
        .profil-card { background: #fff; border-radius: 16px; border: 1px solid ${C.border}; padding: 28px; box-shadow: 0 4px 12px rgba(0,0,0,.03); }
        .profil-input { width: 100%; padding: 12px 14px; border-radius: 8px; border: 1px solid ${C.border}; background: #fff; font-size: 14px; color: ${C.text}; outline: none; }
        .profil-input:focus { border-color: ${C.primary}; }
        .profil-label { font-size: 11px; font-weight: 600; color: ${C.textSoft}; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 6px; display: block; }
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
            onClick={() => navigate(dashboardPath)}
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
            onClick={handleLogout}
            style={{
              background: "none",
              border: "1px solid #fecaca",
              color: "#dc2626",
              padding: "8px 16px",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              logout
            </span>
            Déconnexion
          </button>
        </header>

        <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Mon Profil</h1>
          <p style={{ color: C.textSoft, marginBottom: 32 }}>
            Gérez vos informations, votre abonnement et vos crédits.
          </p>

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
          {success && (
            <div
              style={{
                padding: 12,
                marginBottom: 16,
                backgroundColor: "#dcfce7",
                color: "#14532d",
                borderRadius: 8,
                fontSize: 14,
              }}
            >
              {success}
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.3fr",
              gap: 24,
              alignItems: "flex-start",
            }}
          >
            {/* Left column — User info */}
            <div className="profil-card">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 24,
                  paddingBottom: 24,
                  borderBottom: `1px solid ${C.border}`,
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    backgroundColor: "rgba(29,158,117,.12)",
                    color: C.primaryDark,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 32 }}>
                    person
                  </span>
                </div>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700 }}>{user.nom}</h2>
                  <p
                    style={{
                      fontSize: 12,
                      color: C.textSoft,
                      textTransform: "uppercase",
                      letterSpacing: ".05em",
                      fontWeight: 600,
                    }}
                  >
                    {user.role}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Field label="Email" value={user.email} icon="mail" />
                <Field label="Téléphone" value={user.phone || "—"} icon="phone" />
                <Field label="WhatsApp" value={user.whatsapp || "—"} icon="chat" />
                <Field label="Région" value={user.region || "—"} icon="location_on" />
                <Field
                  label="Membre depuis"
                  value={
                    user.created_at
                      ? new Date(user.created_at).toLocaleDateString("fr-FR")
                      : "—"
                  }
                  icon="calendar_today"
                />
              </div>

              <button
                onClick={() => navigate(dashboardPath)}
                style={{
                  width: "100%",
                  marginTop: 24,
                  padding: 12,
                  background: C.primaryDark,
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                Aller au tableau de bord
              </button>
            </div>

            {/* Right column — Plan + Credits */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Current plan */}
              <div className="profil-card">
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
                  Mon abonnement
                </h2>
                <div
                  style={{
                    backgroundColor: "rgba(29,158,117,.08)",
                    borderRadius: 12,
                    padding: 20,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p style={{ fontSize: 12, color: C.textSoft, fontWeight: 600 }}>
                      Plan actuel
                    </p>
                    <h3
                      style={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: C.primaryDark,
                        textTransform: "capitalize",
                      }}
                    >
                      {user.plan}
                    </h3>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 12, color: C.textSoft, fontWeight: 600 }}>
                      Crédits
                    </p>
                    <h3 style={{ fontSize: 28, fontWeight: 700, color: C.primaryDark }}>
                      {user.credits ?? 0}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Plans */}
              {(isInvestisseur || user.role === "agriculteur") && (
                <div className="profil-card">
                  <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
                    Changer de plan
                  </h2>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: 16,
                    }}
                  >
                    {PLANS.map((p) => {
                      const active = user.plan === p.key;
                      return (
                        <div
                          key={p.key}
                          style={{
                            border: `2px solid ${active ? p.color : C.border}`,
                            borderRadius: 12,
                            padding: 16,
                            display: "flex",
                            flexDirection: "column",
                            gap: 10,
                            backgroundColor: active ? "rgba(29,158,117,.04)" : "#fff",
                          }}
                        >
                          <h3 style={{ fontSize: 16, fontWeight: 700, color: p.color }}>
                            {p.name}
                          </h3>
                          <p style={{ fontSize: 14, fontWeight: 600 }}>{p.price}</p>
                          <ul
                            style={{
                              listStyle: "none",
                              padding: 0,
                              margin: 0,
                              display: "flex",
                              flexDirection: "column",
                              gap: 6,
                              fontSize: 12,
                              color: C.textSoft,
                            }}
                          >
                            {p.perks.map((perk) => (
                              <li
                                key={perk}
                                style={{ display: "flex", alignItems: "center", gap: 6 }}
                              >
                                <span
                                  className="material-symbols-outlined"
                                  style={{ fontSize: 14, color: p.color }}
                                >
                                  check
                                </span>
                                {perk}
                              </li>
                            ))}
                          </ul>
                          <button
                            onClick={() => handleSubscribe(p.key)}
                            disabled={active || saving}
                            style={{
                              marginTop: "auto",
                              padding: 10,
                              background: active ? "#e2e8f0" : p.color,
                              color: active ? C.textSoft : "#fff",
                              border: "none",
                              borderRadius: 8,
                              fontWeight: 600,
                              cursor: active ? "default" : "pointer",
                              fontSize: 13,
                            }}
                          >
                            {active ? "Plan actuel" : `Choisir ${p.name}`}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Credits packs (investisseurs only) */}
              {isInvestisseur && (
                <div className="profil-card">
                  <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
                    Acheter des crédits
                  </h2>
                  <p style={{ fontSize: 13, color: C.textSoft, marginBottom: 16 }}>
                    Chaque déblocage de contact propriétaire coûte <strong>10 crédits</strong>.
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: 12,
                    }}
                  >
                    {[
                      { pack: "starter", credits: 20, price: "100 DH" },
                      { pack: "growth", credits: 100, price: "400 DH" },
                      { pack: "scale", credits: 500, price: "1500 DH" },
                    ].map((p) => (
                      <button
                        key={p.pack}
                        onClick={() => handleBuyCredits(p.pack)}
                        disabled={saving}
                        style={{
                          background: "#fff",
                          border: `1px solid ${C.border}`,
                          borderRadius: 12,
                          padding: 16,
                          textAlign: "left",
                          cursor: "pointer",
                          transition: "all .2s",
                        }}
                      >
                        <p
                          style={{
                            fontSize: 11,
                            color: C.textSoft,
                            fontWeight: 600,
                            textTransform: "uppercase",
                          }}
                        >
                          {p.pack}
                        </p>
                        <h3 style={{ fontSize: 22, fontWeight: 700, color: C.primaryDark }}>
                          +{p.credits}
                        </h3>
                        <p style={{ fontSize: 13, color: C.textSoft }}>{p.price}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

function Field({ label, value, icon }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span
        className="material-symbols-outlined"
        style={{ color: C.primary, fontSize: 22 }}
      >
        {icon}
      </span>
      <div>
        <p
          style={{
            fontSize: 11,
            color: C.textSoft,
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          {label}
        </p>
        <p style={{ fontSize: 14, fontWeight: 500 }}>{value}</p>
      </div>
    </div>
  );
}
