export default function DetailTerrain() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        * { font-family: 'Inter', sans-serif; box-sizing: border-box; margin: 0; padding: 0; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .fill-icon { font-variation-settings: 'FILL' 1 !important; }
        .gallery:hover img { transform: scale(1.05); }
        .bg-zellige { background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2.5L22.5 16 25 13.5V0h2v13.5L29.5 16 32 13.5V0h2v13.5l2.5 2.5L39 13.5V0h1v15.5l-2.5 2.5-2.5-2.5V20h-2v-4.5l-2.5 2.5-2.5-2.5V20h-2v-4.5l-2.5 2.5L20 20.5zM0 22h20v2.5l2.5-2.5 2.5 2.5V22h2v4.5l2.5-2.5 2.5 2.5V22h2v4.5l2.5-2.5 2.5 2.5V22h1v20h-1V26.5l-2.5 2.5-2.5-2.5V31h-2v-4.5l-2.5 2.5-2.5-2.5V31h-2v-4.5l-2.5 2.5L20 23.5V40h-2V22H0v-2z' fill='%2300694c' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E"); }
      `}</style>
      <div
        style={{
          backgroundColor: "#f5fbf5",
          color: "#171d1a",
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <header
          style={{
            backgroundColor: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(12px)",
            position: "sticky",
            top: 0,
            zIndex: 50,
            borderBottom: "1px solid #f1f5f9",
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              padding: "16px 24px",
              maxWidth: 1440,
              margin: "0 auto",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "50%",
                  padding: 8,
                }}
              >
                <span className="material-symbols-outlined">menu</span>
              </button>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  color: "#1D9E75",
                  letterSpacing: "-0.05em",
                }}
              >
                ArdMarket
              </span>
            </div>
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                borderRadius: "50%",
                padding: 8,
              }}
            >
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </header>

        {/* Back Nav */}
        <div style={{ maxWidth: 1440, margin: "0 auto", padding: "16px 24px" }}>
          <a
            href="#"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              color: "#00694c",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 14 }}
            >
              arrow_back
            </span>
            Retour à l'exploration
          </a>
        </div>

        {/* Main */}
        <main
          style={{
            maxWidth: 1440,
            margin: "0 auto",
            padding: "0 24px 64px",
            display: "grid",
            gridTemplateColumns: "3fr 2fr",
            gap: 40,
          }}
        >
          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {/* Gallery */}
            <div
              className="gallery"
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16/9",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                border: "1px solid rgba(188,202,193,0.3)",
                cursor: "pointer",
              }}
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxaPGtP888dUfoP488yRgrJ4lVlXr6FtFT84XK4nhNogP9yHn--RUzQxOuLasXY5AAUcbctbWF_z1-lQSSMWGt728yMgLTuYJLPnPLF6YskjDQDcPyu1OpeH2Cx5HOHyCRsDaLMjAJtp-yGY44XTT5458JBwK8u2Uu5Rgt34Fq8VpIDj2V7PMNdm_5z1lMtOlCEWRVpNJqg4x13s6yQ1xyCYhxET2sZjtYYJoOGhhyYnRh6UlxSU1ASFgBc4ZHjqdkZdg5u5GvLQ"
                alt="Terrain"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.7s",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(23,29,26,0.6), transparent)",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 16,
                  right: 16,
                  backgroundColor: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(4px)",
                  padding: "6px 12px",
                  borderRadius: 9999,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 14 }}
                >
                  photo_library
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                  }}
                >
                  1/8 Photos
                </span>
              </div>
            </div>

            {/* Header Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <span
                  style={{
                    backgroundColor: "#E8F5F1",
                    color: "#1D9E75",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    padding: "4px 12px",
                    borderRadius: 9999,
                    border: "1px solid rgba(29,158,117,0.2)",
                  }}
                >
                  Disponible
                </span>
                <span
                  style={{
                    backgroundColor: "#eaefea",
                    color: "#3d4943",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    padding: "4px 12px",
                    borderRadius: 9999,
                  }}
                >
                  Location Longue Durée
                </span>
              </div>
              <h1
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                Domaine Agricole Al Haouz - 45 Hectares
              </h1>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#3d4943",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ color: "#00694c" }}
                >
                  location_on
                </span>
                <span style={{ fontSize: 16 }}>
                  Région Marrakech-Safi, Commune d'Agafay
                </span>
              </div>
            </div>

            {/* Description */}
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: 12,
                border: "1px solid rgba(188,202,193,0.5)",
                padding: 24,
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              }}
            >
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  marginBottom: 16,
                }}
              >
                Description du bien
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: "#3d4943",
                  lineHeight: 1.5,
                  marginBottom: 16,
                }}
              >
                Exceptionnel domaine agricole de 45 hectares situé au cœur de la
                région d'Al Haouz, offrant un potentiel de rendement élevé pour
                des cultures maraîchères ou l'arboriculture (oliviers, agrumes).
                La terre a bénéficié d'un repos de 2 ans, garantissant une
                régénération optimale des nutriments.
              </p>
              <p style={{ fontSize: 14, color: "#3d4943", lineHeight: 1.5 }}>
                L'accès est facilité par une route goudronnée jusqu'à l'entrée
                principale du domaine, situé à seulement 30 km du marché de gros
                de Marrakech. Idéal pour une exploitation professionnelle
                cherchant à étendre sa production avec des garanties légales et
                infrastructurelles solides.
              </p>
            </div>

            {/* Characteristics */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <h3 style={{ fontSize: 20, fontWeight: 600 }}>
                Caractéristiques Clés
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 16,
                }}
              >
                {[
                  {
                    icon: "water_drop",
                    color: "#00694c",
                    bg: "rgba(0,105,76,0.05)",
                    label: "Ressources en Eau",
                    title: "Puits Déclaré",
                    sub: "Débit: 15L/seconde",
                  },
                  {
                    icon: "landscape",
                    color: "#BA7517",
                    bg: "rgba(186,117,23,0.05)",
                    label: "Type de Sol",
                    title: "Limono-Argileux",
                    sub: "Ph: 7.2 (Idéal)",
                  },
                  {
                    icon: "gavel",
                    color: "#885200",
                    bg: "rgba(136,82,0,0.05)",
                    label: "Statut Foncier",
                    title: "Titré (Melkia)",
                    sub: "Conservation Foncière",
                  },
                ].map(({ icon, color, bg, label, title, sub }) => (
                  <div
                    key={label}
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: 12,
                      border: "1px solid rgba(188,202,193,0.5)",
                      padding: 20,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        right: -16,
                        top: -16,
                        width: 64,
                        height: 64,
                        backgroundColor: bg,
                        borderRadius: "50%",
                      }}
                    />
                    <span
                      className="material-symbols-outlined"
                      style={{ color, marginBottom: 4, display: "block" }}
                    >
                      {icon}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        color: "#3d4943",
                        display: "block",
                      }}
                    >
                      {label}
                    </span>
                    <span
                      style={{
                        fontSize: 20,
                        fontWeight: 600,
                        display: "block",
                        marginTop: 4,
                      }}
                    >
                      {title}
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        color: "#3d4943",
                        display: "block",
                        marginTop: 4,
                      }}
                    >
                      {sub}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 32,
              position: "sticky",
              top: 96,
              alignSelf: "flex-start",
            }}
          >
            {/* Pricing */}
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: 12,
                border: "1px solid rgba(188,202,193,0.5)",
                padding: 24,
                boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#3d4943",
                  }}
                >
                  Prix de location
                </span>
                <div
                  style={{ display: "flex", alignItems: "baseline", gap: 4 }}
                >
                  <span
                    style={{
                      fontSize: 32,
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      color: "#1D9E75",
                    }}
                  >
                    80,000
                  </span>
                  <span style={{ fontSize: 20, fontWeight: 600 }}>DH/an</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color: "#3d4943",
                  }}
                >
                  Durée d'engagement
                </label>
                <select
                  style={{
                    width: "100%",
                    borderRadius: 8,
                    border: "1px solid rgba(188,202,193,0.5)",
                    backgroundColor: "#f5fbf5",
                    padding: "12px 16px",
                    fontSize: 14,
                    outline: "none",
                  }}
                >
                  <option>1 an</option>
                  <option>3 ans</option>
                  <option selected>5 ans</option>
                  <option>10 ans</option>
                </select>
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <button
                  style={{
                    width: "100%",
                    background: "linear-gradient(to bottom, #1D9E75, #15805e)",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: 16,
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: "0 4px 12px rgba(29,158,117,0.2)",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 14 }}
                  >
                    handshake
                  </span>{" "}
                  Faire une offre
                </button>
                <button
                  style={{
                    width: "100%",
                    backgroundColor: "#fff",
                    border: "1px solid #E8F5F1",
                    color: "#171d1a",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: 16,
                    borderRadius: 8,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 14 }}
                  >
                    chat_bubble
                  </span>{" "}
                  Contacter
                </button>
              </div>
            </div>

            {/* Legal Score */}
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: 12,
                border: "1px solid rgba(188,202,193,0.5)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
                overflow: "hidden",
              }}
            >
              <div
                className="bg-zellige"
                style={{
                  padding: 24,
                  borderBottom: "1px solid rgba(188,202,193,0.3)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>
                  Score Légal ArdMarket
                </h3>
                <div
                  style={{
                    position: "relative",
                    width: 128,
                    height: 128,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      transform: "rotate(-90deg)",
                    }}
                    viewBox="0 0 36 36"
                  >
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e4eae4"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#1D9E75"
                      strokeDasharray="98, 100"
                      strokeLinecap="round"
                      strokeWidth="3"
                    />
                  </svg>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 32,
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      98
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#3d4943",
                      }}
                    >
                      /100
                    </span>
                  </div>
                </div>
              </div>
              <div
                style={{
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {[
                  ["Vérification du Titre", "Validé"],
                  ["Droits d'Exploitation", "Validé"],
                  ["Historique des Saisies", "Vierge"],
                ].map(([label, status]) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 14, color: "#1D9E75" }}
                      >
                        check_circle
                      </span>
                      <span style={{ fontSize: 14 }}>{label}</span>
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                        color: "#1D9E75",
                      }}
                    >
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Escrow */}
            <div
              style={{
                backgroundColor: "#F5FBF5",
                borderRadius: 12,
                border: "1px solid rgba(29,158,117,0.2)",
                padding: 20,
                display: "flex",
                gap: 16,
                boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: "#E8F5F1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  className="material-symbols-outlined fill-icon"
                  style={{ color: "#1D9E75" }}
                >
                  shield
                </span>
              </div>
              <div>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  Paiement Sécurisé (Escrow)
                </span>
                <p style={{ fontSize: 14, color: "#3d4943" }}>
                  Vos fonds sont conservés en toute sécurité sur un compte
                  séquestre jusqu'à la signature finale du contrat de bail.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
