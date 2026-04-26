// DetailTerrain.jsx - branché sur l'API backend, contact masqué/déblocable
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const C = {
  primary: "#1D9E75",
  primaryDark: "#00694c",
  bg: "#f5fbf5",
  text: "#171d1a",
  textSoft: "#3d4943",
  border: "#dee4de",
};

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=800&fit=crop";

export default function DetailTerrain() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [land, setLand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImg, setActiveImg] = useState(0);
  const [unlocking, setUnlocking] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerPrice, setOfferPrice] = useState("");
  const [offerYears, setOfferYears] = useState("3");
  const [offerMessage, setOfferMessage] = useState("");
  const [offerSubmitting, setOfferSubmitting] = useState(false);
  const [offerSuccess, setOfferSuccess] = useState("");
  const [simulation, setSimulation] = useState(null);

  useEffect(() => {
    api.me().then((r) => setUser(r.user || r)).catch(() => {});
    loadLand();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadLand = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.getLand(id);
      setLand(data);
      // Lance la simulation ROI en parallèle (non bloquant)
      api
        .simulateLand(id, {})
        .then(setSimulation)
        .catch(() => {});
    } catch (err) {
      setError(err.message || "Terrain introuvable");
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async () => {
    if (!user) {
      navigate("/connexion");
      return;
    }
    setUnlocking(true);
    setError("");
    try {
      await api.unlockContact(id);
      // Recharge le terrain pour avoir le contact démasqué
      await loadLand();
      // Recharge aussi user.credits
      const me = await api.me();
      setUser(me.user || me);
    } catch (err) {
      if (err.status === 402 || err.status === 403) {
        if (
          window.confirm(
            "Crédits insuffisants ou plan free. Voulez-vous voir les options d'abonnement ?",
          )
        ) {
          navigate("/profil");
        }
      } else {
        setError(err.message || "Erreur de déblocage");
      }
    } finally {
      setUnlocking(false);
    }
  };

  const submitOffer = async () => {
    if (!user) {
      navigate("/connexion");
      return;
    }
    if (!offerPrice || Number(offerPrice) <= 0) {
      setError("Prix invalide");
      return;
    }
    setOfferSubmitting(true);
    setError("");
    try {
      await api.createOffer(id, {
        price: Number(offerPrice),
        duration_years: Number(offerYears),
        message: offerMessage || undefined,
      });
      setOfferSuccess("Offre envoyée avec succès au propriétaire !");
      setShowOfferModal(false);
      setOfferPrice("");
      setOfferMessage("");
    } catch (err) {
      setError(err.message || "Erreur d'envoi");
    } finally {
      setOfferSubmitting(false);
    }
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
        <p>Chargement du terrain...</p>
      </div>
    );
  }

  if (error && !land) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: C.bg,
          gap: 16,
        }}
      >
        <p>{error}</p>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: C.primaryDark,
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Retour
        </button>
      </div>
    );
  }

  if (!land) return null;

  const images =
    land.images && land.images.length > 0
      ? land.images.map((i) => i.url)
      : land.cover_image
        ? [land.cover_image]
        : [FALLBACK_IMG];

  const score = land.legal_score ?? 70;
  const scoreColor = score >= 85 ? C.primaryDark : score >= 65 ? "#704200" : "#9b1c1c";

  const contact = land.owner_contact;
  const isMasked = !contact || contact.masked;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        * { font-family: 'Inter', sans-serif; box-sizing: border-box; margin: 0; padding: 0; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; }
        .dt-card { background: #fff; border-radius: 12px; border: 1px solid ${C.border}; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,.03); }
        .dt-input { width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid ${C.border}; font-size: 14px; outline: none; }
        .dt-input:focus { border-color: ${C.primary}; }
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
            padding: "14px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
          <button
            onClick={() => navigate(-1)}
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
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
            Retour
          </button>
        </header>

        <main style={{ maxWidth: 1280, margin: "0 auto", padding: "24px" }}>
          {/* Title row */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: C.primary, textTransform: "uppercase", letterSpacing: ".1em" }}>
              {land.region}{land.commune ? ` · ${land.commune}` : ""}
            </p>
            <h1 style={{ fontSize: 36, fontWeight: 700, marginTop: 4, letterSpacing: "-.02em" }}>
              {land.title}
            </h1>
            <p
              style={{
                fontSize: 14,
                color: C.textSoft,
                marginTop: 8,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>location_on</span>
              {[land.commune, land.region].filter(Boolean).join(", ")}
              {land.latitude && land.longitude && (
                <span style={{ marginLeft: 8 }}>
                  · GPS {land.latitude.toFixed(4)}, {land.longitude.toFixed(4)}
                </span>
              )}
            </p>
          </div>

          {/* Gallery */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: images.length > 1 ? "2fr 1fr 1fr" : "1fr",
              gap: 8,
              marginBottom: 24,
              borderRadius: 16,
              overflow: "hidden",
              maxHeight: 480,
            }}
          >
            <div style={{ gridRow: "span 2", height: images.length > 1 ? 480 : 360 }}>
              <img
                src={images[activeImg] || images[0]}
                alt={land.title}
                onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            {images.slice(1, 5).map((url, i) => (
              <div key={i} style={{ height: 236 }}>
                <img
                  src={url}
                  alt={`Vue ${i + 2}`}
                  onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                  onClick={() => setActiveImg(i + 1)}
                  style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "pointer" }}
                />
              </div>
            ))}
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
          {offerSuccess && (
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
              {offerSuccess}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
            {/* LEFT */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Description */}
              <div className="dt-card">
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Description</h2>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: C.textSoft }}>
                  {land.description || "Pas de description disponible."}
                </p>
              </div>

              {/* Caractéristiques */}
              <div className="dt-card">
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>
                  Caractéristiques
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                  <SpecRow icon="straighten" label="Superficie" value={`${land.surface_ha} hectares`} />
                  <SpecRow icon="agriculture" label="Type de culture" value={land.crop_type || "—"} />
                  <SpecRow icon="terrain" label="Type de sol" value={land.soil_type || "—"} />
                  <SpecRow
                    icon="water_drop"
                    label="Eau"
                    value={land.has_water ? `Disponible${land.water_flow ? ` (${land.water_flow})` : ""}` : "Aucune"}
                  />
                  <SpecRow icon="gavel" label="Statut juridique" value={land.legal_status || "—"} />
                  <SpecRow
                    icon="route"
                    label="Distance route"
                    value={land.distance_road_km ? `${land.distance_road_km} km` : "—"}
                  />
                  <SpecRow
                    icon="sell"
                    label="Mode"
                    value={land.mode === "location_vente" ? "Location ou vente" : land.mode}
                  />
                </div>
              </div>

              {/* Localisation */}
              {(land.latitude && land.longitude) && (
                <div className="dt-card">
                  <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Localisation</h2>
                  <p style={{ fontSize: 13, color: C.textSoft, marginBottom: 12 }}>
                    GPS : <strong>{land.latitude.toFixed(5)}, {land.longitude.toFixed(5)}</strong>
                  </p>
                  <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${C.border}` }}>
                    <iframe
                      title="map"
                      width="100%"
                      height="320"
                      frameBorder="0"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${land.longitude - 0.05},${land.latitude - 0.05},${land.longitude + 0.05},${land.latitude + 0.05}&layer=mapnik&marker=${land.latitude},${land.longitude}`}
                    />
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${land.latitude},${land.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      marginTop: 12,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      color: C.primaryDark,
                      fontWeight: 600,
                      fontSize: 13,
                      textDecoration: "none",
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>open_in_new</span>
                    Ouvrir dans Google Maps
                  </a>
                </div>
              )}

              {/* Documents */}
              {land.documents && land.documents.length > 0 && (
                <div className="dt-card">
                  <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
                    Documents légaux
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {land.documents.map((d) => (
                      <div
                        key={d.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          backgroundColor: C.bg,
                          padding: "10px 14px",
                          borderRadius: 8,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span
                            className="material-symbols-outlined"
                            style={{ color: C.primaryDark, fontSize: 20 }}
                          >
                            description
                          </span>
                          <span style={{ fontSize: 14, fontWeight: 600 }}>
                            {d.type.replace(/_/g, " ")}
                          </span>
                          {d.extracted_json && (
                            <span
                              style={{
                                fontSize: 11,
                                color: C.primaryDark,
                                background: "rgba(29,158,117,.1)",
                                padding: "2px 8px",
                                borderRadius: 999,
                                fontWeight: 600,
                              }}
                            >
                              IA analysé
                            </span>
                          )}
                        </div>
                        <a
                          href={d.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: C.primaryDark, fontSize: 13, fontWeight: 600 }}
                        >
                          Ouvrir
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Simulation ROI */}
              {simulation && (
                <div className="dt-card">
                  <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
                    Simulation ROI <span style={{ fontSize: 12, color: C.primary, fontWeight: 600 }}>IA</span>
                  </h2>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: 12,
                    }}
                  >
                    <SimRow
                      label="Rendement estimé"
                      value={
                        simulation.estimated_yield_tons
                          ? `${simulation.estimated_yield_tons} t/an`
                          : "—"
                      }
                    />
                    <SimRow
                      label="Revenu annuel"
                      value={
                        simulation.estimated_revenue_dh
                          ? `${Number(simulation.estimated_revenue_dh).toLocaleString("fr-FR")} DH`
                          : "—"
                      }
                    />
                    <SimRow
                      label="ROI"
                      value={simulation.roi_percent ? `${simulation.roi_percent}%` : "—"}
                    />
                  </div>
                  {simulation.notes && (
                    <p style={{ fontSize: 12, color: C.textSoft, marginTop: 12, fontStyle: "italic" }}>
                      {simulation.notes}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT — Sticky sidebar */}
            <div style={{ position: "sticky", top: 90, alignSelf: "flex-start" }}>
              <div className="dt-card" style={{ marginBottom: 16 }}>
                {(land.price_per_year || land.price_sale) && (
                  <div style={{ marginBottom: 16 }}>
                    {land.price_per_year && (
                      <div style={{ marginBottom: 8 }}>
                        <p style={{ fontSize: 11, color: C.textSoft, fontWeight: 600, textTransform: "uppercase" }}>
                          Loyer / an
                        </p>
                        <p style={{ fontSize: 26, fontWeight: 700, color: C.primaryDark }}>
                          {Number(land.price_per_year).toLocaleString("fr-FR")} DH
                        </p>
                      </div>
                    )}
                    {land.price_sale && (
                      <div>
                        <p style={{ fontSize: 11, color: C.textSoft, fontWeight: 600, textTransform: "uppercase" }}>
                          Prix de vente
                        </p>
                        <p style={{ fontSize: 22, fontWeight: 700, color: C.text }}>
                          {Number(land.price_sale).toLocaleString("fr-FR")} DH
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Score Légal */}
                <div
                  style={{
                    backgroundColor: C.bg,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ fontSize: 11, color: C.textSoft, fontWeight: 700, textTransform: "uppercase" }}>
                      Score Légal IA
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: scoreColor }}>{score}/100</span>
                  </div>
                  <div style={{ width: "100%", height: 6, backgroundColor: C.border, borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ width: `${score}%`, height: "100%", backgroundColor: scoreColor }} />
                  </div>
                </div>

                {/* Contact */}
                <div
                  style={{
                    backgroundColor: "rgba(29,158,117,.06)",
                    border: `1px solid rgba(29,158,117,.2)`,
                    borderRadius: 10,
                    padding: 16,
                    marginBottom: 14,
                  }}
                >
                  <p style={{ fontSize: 12, color: C.textSoft, fontWeight: 600, marginBottom: 8, textTransform: "uppercase" }}>
                    Contact propriétaire
                  </p>
                  {contact && !isMasked ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <ContactRow icon="person" value={land.owner?.nom || "Propriétaire"} />
                      {contact.phone && <ContactRow icon="phone" value={contact.phone} link={`tel:${contact.phone}`} />}
                      {contact.whatsapp && (
                        <ContactRow
                          icon="chat"
                          value={`WhatsApp: ${contact.whatsapp}`}
                          link={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}`}
                        />
                      )}
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          fontSize: 14,
                          color: C.textSoft,
                          fontFamily: "monospace",
                          backgroundColor: "#fff",
                          padding: 10,
                          borderRadius: 6,
                          border: `1px dashed ${C.border}`,
                          marginBottom: 10,
                        }}
                      >
                        +212 6•• ••• •••
                      </div>
                      <p style={{ fontSize: 12, color: C.textSoft, marginBottom: 10 }}>
                        Débloquez le contact pour <strong>10 crédits</strong>
                        {user && ` (solde: ${user.credits ?? 0})`}
                      </p>
                      <button
                        onClick={handleUnlock}
                        disabled={unlocking}
                        style={{
                          width: "100%",
                          padding: 12,
                          backgroundColor: C.primaryDark,
                          color: "#fff",
                          border: "none",
                          borderRadius: 8,
                          fontWeight: 600,
                          fontSize: 14,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>lock_open</span>
                        {unlocking ? "Déblocage..." : "Débloquer (−10 cr)"}
                      </button>
                    </>
                  )}
                </div>

                {/* Faire une offre */}
                <button
                  onClick={() => setShowOfferModal(true)}
                  style={{
                    width: "100%",
                    padding: 14,
                    backgroundColor: "#fff",
                    color: C.primaryDark,
                    border: `2px solid ${C.primaryDark}`,
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>handshake</span>
                  Faire une offre
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Offer modal */}
        {showOfferModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 100,
              padding: 20,
            }}
            onClick={() => setShowOfferModal(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: "#fff",
                borderRadius: 16,
                padding: 28,
                maxWidth: 480,
                width: "100%",
              }}
            >
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Faire une offre</h2>
              <p style={{ fontSize: 13, color: C.textSoft, marginBottom: 20 }}>
                Pour : <strong>{land.title}</strong>
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: C.textSoft,
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Montant proposé (DH)
                  </label>
                  <input
                    className="dt-input"
                    type="number"
                    placeholder="Ex: 450000"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: C.textSoft,
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Durée (années)
                  </label>
                  <input
                    className="dt-input"
                    type="number"
                    min="1"
                    max="20"
                    value={offerYears}
                    onChange={(e) => setOfferYears(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: C.textSoft,
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Message (optionnel)
                  </label>
                  <textarea
                    className="dt-input"
                    rows={3}
                    placeholder="Présentez votre projet..."
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                <button
                  onClick={() => setShowOfferModal(false)}
                  style={{
                    flex: 1,
                    padding: 12,
                    background: "#fff",
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Annuler
                </button>
                <button
                  onClick={submitOffer}
                  disabled={offerSubmitting}
                  style={{
                    flex: 2,
                    padding: 12,
                    backgroundColor: C.primaryDark,
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {offerSubmitting ? "Envoi..." : "Envoyer l'offre"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function SpecRow({ icon, label, value }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
      <span
        className="material-symbols-outlined"
        style={{
          color: C.primary,
          fontSize: 22,
          backgroundColor: "rgba(29,158,117,.08)",
          padding: 8,
          borderRadius: 8,
        }}
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
            letterSpacing: ".05em",
          }}
        >
          {label}
        </p>
        <p
          style={{ fontSize: 14, fontWeight: 600, marginTop: 2, textTransform: "capitalize" }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function SimRow({ label, value }) {
  return (
    <div
      style={{
        backgroundColor: C.bg,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: 12,
      }}
    >
      <p style={{ fontSize: 11, color: C.textSoft, fontWeight: 600, textTransform: "uppercase" }}>
        {label}
      </p>
      <p style={{ fontSize: 16, fontWeight: 700, marginTop: 4, color: C.primaryDark }}>{value}</p>
    </div>
  );
}

function ContactRow({ icon, value, link }) {
  const inner = (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span className="material-symbols-outlined" style={{ fontSize: 18, color: C.primaryDark }}>
        {icon}
      </span>
      <span style={{ fontSize: 14, fontWeight: 500 }}>{value}</span>
    </div>
  );
  return link ? (
    <a href={link} target="_blank" rel="noreferrer" style={{ color: C.text, textDecoration: "none" }}>
      {inner}
    </a>
  ) : (
    inner
  );
}
