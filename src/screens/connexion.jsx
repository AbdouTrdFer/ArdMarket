// Connexion.jsx
import { useState } from "react";
import api from "../services/api";

export default function Connexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Connexion avec l'API
      const response = await api.login(email, password);

      // 2. Récupérer les informations de l'utilisateur (incluant le rôle)
      // Si votre API login retourne déjà le rôle, vous pouvez l'utiliser directement
      const userData = response.user || response;

      // 3. Stocker le rôle dans localStorage pour une utilisation future
      if (userData.role) {
        localStorage.setItem("user_role", userData.role);
      }

      // 4. Rediriger en fonction du rôle
      const role = userData.role?.toLowerCase();

      if (
        role === "agriculteur" ||
        role === "farmer" ||
        role === "agriculteur"
      ) {
        // Rediriger vers le dashboard agriculteur
        window.location.href = "/dashboard-agriculteur";
      } else if (
        role === "investisseur" ||
        role === "investor" ||
        role === "investisseur"
      ) {
        // Rediriger vers le dashboard investisseur
        window.location.href = "/dashboard-investisseur";
      } else {
        // Rôle par défaut ou non spécifié
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError(err.message || "Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        * { font-family: 'Inter', sans-serif; box-sizing: border-box; margin: 0; padding: 0; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .zellige-bg {
          background-color: transparent;
          background-image: radial-gradient(#00694c 0.5px, transparent 0.5px), radial-gradient(#00694c 0.5px, #f5fbf5 0.5px);
          background-size: 20px 20px;
          background-position: 0 0, 10px 10px;
          opacity: 0.03;
        }
      `}</style>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f5fbf5",
          color: "#171d1a",
        }}
      >
        {/* Header */}
        <header
          style={{
            backgroundColor: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(8px)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: 50,
            height: 80,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 32px",
            borderBottom: "1px solid #f3f4f6",
            boxShadow: "0 2px 15px -3px rgba(0,0,0,0.07)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              className="material-symbols-outlined"
              style={{
                color: "#00694c",
                fontSize: 28,
                fontVariationSettings: "'FILL' 1",
              }}
            >
              agriculture
            </span>
            <span
              style={{
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: "-0.05em",
                color: "#065f46",
              }}
            >
              ArdMarket
            </span>
          </div>
          <nav style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {[
              { label: "Explorer", href: "/" },
              { label: "Comment ça marche", href: "/how-it-works" },
              { label: "Assistance", href: "/support" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#4b5563",
                  textDecoration: "none",
                  paddingBottom: 4,
                }}
              >
                {label}
              </a>
            ))}
          </nav>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <button
              onClick={() => (window.location.href = "/connexion")}
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "#00694c",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Se connecter
            </button>
            <button
              onClick={() => (window.location.href = "/publier")}
              style={{
                backgroundColor: "#00694c",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              Publier une annonce
            </button>
          </div>
        </header>

        {/* Main */}
        <main
          style={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 96,
            paddingBottom: 64,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            className="zellige-bg"
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
          />

          <div
            style={{
              width: "100%",
              maxWidth: 560,
              margin: "0 auto",
              padding: "0 24px",
              position: "relative",
              zIndex: 10,
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                border: "1px solid #bccac1",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "40px 40px 24px",
                  borderBottom: "1px solid #dee4de",
                  textAlign: "center",
                }}
              >
                <h1
                  style={{
                    fontSize: 32,
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    color: "#171d1a",
                    marginBottom: 8,
                  }}
                >
                  Bienvenue sur ArdMarket
                </h1>
                <p
                  style={{
                    fontSize: 16,
                    color: "#3d4943",
                    maxWidth: 320,
                    margin: "0 auto",
                  }}
                >
                  La plateforme d'excellence pour le foncier agricole au Maroc.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ padding: 40 }}>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  {error && (
                    <div
                      style={{
                        backgroundColor: "#fee2e2",
                        color: "#dc2626",
                        padding: "12px",
                        borderRadius: 8,
                        fontSize: 14,
                        textAlign: "center",
                      }}
                    >
                      {error}
                    </div>
                  )}

                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 4 }}
                  >
                    <label
                      htmlFor="email"
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                        color: "#3d4943",
                        textTransform: "uppercase",
                      }}
                    >
                      Adresse Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.ma"
                      required
                      style={{
                        width: "100%",
                        padding: "16px",
                        borderRadius: 8,
                        border: "1px solid #bccac1",
                        fontSize: 16,
                        outline: "none",
                        backgroundColor: "#f5fbf5",
                        transition: "all 0.2s",
                      }}
                    />
                  </div>

                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 4 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <label
                        htmlFor="password"
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          letterSpacing: "0.05em",
                          color: "#3d4943",
                          textTransform: "uppercase",
                        }}
                      >
                        Mot de passe
                      </label>
                      <a
                        href="/mot-de-passe-oublie"
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#00694c",
                          textDecoration: "none",
                        }}
                      >
                        Oublié ?
                      </a>
                    </div>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      style={{
                        width: "100%",
                        padding: "16px",
                        borderRadius: 8,
                        border: "1px solid #bccac1",
                        fontSize: 16,
                        outline: "none",
                        backgroundColor: "#f5fbf5",
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: "100%",
                      background: loading
                        ? "#94a3b8"
                        : "linear-gradient(to bottom, #00694c, #185e45)",
                      color: "#fff",
                      padding: "24px",
                      borderRadius: 8,
                      fontSize: 20,
                      fontWeight: 600,
                      border: "none",
                      cursor: loading ? "not-allowed" : "pointer",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                      marginTop: 8,
                      opacity: loading ? 0.7 : 1,
                    }}
                  >
                    {loading ? "Connexion en cours..." : "Se connecter"}
                  </button>
                </div>

                {/* Divider */}
                <div
                  style={{
                    position: "relative",
                    margin: "40px 0",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{ width: "100%", borderTop: "1px solid #bccac1" }}
                    />
                  </div>
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <span
                      style={{
                        padding: "0 16px",
                        backgroundColor: "#fff",
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        color: "#3d4943",
                        textTransform: "uppercase",
                      }}
                    >
                      ou
                    </span>
                  </div>
                </div>

                {/* Social */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                  }}
                >
                  <button
                    type="button"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      width: "100%",
                      padding: "16px",
                      border: "1px solid #bccac1",
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 400,
                      backgroundColor: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ color: "#171d1a" }}
                    >
                      google
                    </span>
                  </button>
                  <button
                    type="button"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      width: "100%",
                      padding: "16px",
                      border: "1px solid #bccac1",
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 400,
                      backgroundColor: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ color: "#171d1a" }}
                    >
                      apple
                    </span>
                  </button>
                </div>

                <div style={{ marginTop: 40, textAlign: "center" }}>
                  <p style={{ fontSize: 14, color: "#3d4943" }}>
                    Pas encore de compte ?{" "}
                    <a
                      href="/inscription"
                      style={{
                        color: "#00694c",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      S'inscrire
                    </a>
                  </p>
                </div>
              </form>
            </div>

            {/* Trust */}
            <div
              style={{
                marginTop: 24,
                display: "flex",
                justifyContent: "center",
                gap: 40,
                opacity: 0.6,
                filter: "grayscale(1)",
              }}
            >
              {[
                ["verified_user", "Sécurisé par SSL"],
                ["policy", "RGPD Maroc"],
              ].map(([icon, label]) => (
                <div
                  key={label}
                  style={{ display: "flex", alignItems: "center", gap: 4 }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 12 }}
                  >
                    {icon}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer
          style={{
            padding: "64px 48px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #f3f4f6",
            backgroundColor: "#f9fafb",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 900,
                color: "#111827",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              ArdMarket
            </div>
            <p
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#6b7280",
                marginTop: 16,
              }}
            >
              © 2024 ArdMarket. Excellence Foncière Agricole.
            </p>
          </div>
          <div style={{ display: "flex", gap: 32 }}>
            {[
              "Confidentialité",
              "Conditions Générales",
              "Contact",
              "Plan du site",
            ].map((l) => (
              <a
                key={l}
                href="#"
                style={{
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#6b7280",
                  textDecoration: "underline",
                }}
              >
                {l}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </>
  );
}
