import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api, getStoredUser, getToken } from "../services/api";

const NAV = [
  { label: "Terres", to: "/dashboard-investisseur", icon: "landscape" },
  { label: "Marketplace", to: "/marketplace", icon: "storefront" },
  { label: "Notaires", to: "/notaires", icon: "gavel" },
];

export default function AppShell({ children, footer = true }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(getStoredUser());

  useEffect(() => {
    if (getToken() && !user) {
      api.me().then((u) => setUser(u)).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isActive = (to) => location.pathname === to || location.pathname.startsWith(to + "/");

  return (
    <div className="am-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; }
        .am-nav-link { color: var(--am-text); text-decoration: none; padding: 8px 14px; border-radius: 999px; font-weight: 600; font-size: 14px; display: inline-flex; align-items: center; gap: 6px; transition: background 0.15s ease, color 0.15s ease; cursor: pointer; }
        .am-nav-link:hover { background: var(--am-primary-light); color: var(--am-primary-dark); }
        .am-nav-link.active { background: var(--am-primary-light); color: var(--am-primary-dark); }
      `}</style>
      <header
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--am-border)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          className="am-container"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "12px 24px",
            justifyContent: "space-between",
          }}
        >
          <div
            onClick={() => navigate("/")}
            style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
          >
            <span
              className="material-symbols-outlined"
              style={{ color: "var(--am-primary)", fontSize: 28 }}
            >
              landscape
            </span>
            <span
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "var(--am-primary-dark)",
                letterSpacing: "-0.04em",
              }}
            >
              ArdMarket
            </span>
          </div>

          <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {NAV.map((n) => (
              <span
                key={n.to}
                className={`am-nav-link ${isActive(n.to) ? "active" : ""}`}
                onClick={() => navigate(n.to)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  {n.icon}
                </span>
                {n.label}
              </span>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {user ? (
              <>
                {user.role === "investisseur" && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 12px",
                      background: "var(--am-primary-light)",
                      color: "var(--am-primary-dark)",
                      borderRadius: 999,
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                      toll
                    </span>
                    {user.credits ?? 0} cr
                  </div>
                )}
                <button
                  className="am-btn am-btn-secondary"
                  onClick={() => navigate("/profil")}
                  style={{ padding: "8px 14px" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    person
                  </span>
                  {user.nom?.split(" ")[0] || "Mon compte"}
                </button>
              </>
            ) : (
              <>
                <button className="am-btn am-btn-ghost" onClick={() => navigate("/connexion")}>
                  Connexion
                </button>
                <button className="am-btn am-btn-primary" onClick={() => navigate("/inscription")}>
                  S'inscrire
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main style={{ flex: 1 }}>{children}</main>

      {footer && (
        <footer
          style={{
            background: "var(--am-primary-dark)",
            color: "rgba(255,255,255,0.9)",
            padding: "32px 24px",
            marginTop: 48,
          }}
        >
          <div
            className="am-container"
            style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 16 }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, color: "#fff" }}>ArdMarket</div>
              <div style={{ fontSize: 13, opacity: 0.8 }}>
                Plateforme foncière agricole — Maroc 🇲🇦
              </div>
            </div>
            <div style={{ display: "flex", gap: 24, fontSize: 13 }}>
              <span
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/dashboard-investisseur")}
              >
                Terres
              </span>
              <span style={{ cursor: "pointer" }} onClick={() => navigate("/marketplace")}>
                Marketplace
              </span>
              <span style={{ cursor: "pointer" }} onClick={() => navigate("/notaires")}>
                Notaires
              </span>
              <span style={{ cursor: "pointer" }} onClick={() => navigate("/profil")}>
                Mon compte
              </span>
            </div>
          </div>
          <div
            style={{
              textAlign: "center",
              marginTop: 24,
              fontSize: 12,
              opacity: 0.7,
              borderTop: "1px solid rgba(255,255,255,0.15)",
              paddingTop: 16,
            }}
          >
            © {new Date().getFullYear()} ArdMarket — Oriental Hack 2e édition
          </div>
        </footer>
      )}
    </div>
  );
}
