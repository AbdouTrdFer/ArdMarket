// DashboardAgriculteur.jsx - Version avec intégration API
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

export default function DashboardAgriculteur() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [userLands, setUserLands] = useState([]);
  const [userOffers, setUserOffers] = useState([]);
  const [stats, setStats] = useState({
    totalLands: 0,
    pendingOffers: 0,
    totalRevenue: 0,
  });

  const navLinks = [
    { icon: "dashboard", label: "Tableau de bord", to: "/dashboard-agriculteur" },
    { icon: "add_circle", label: "Publier un terrain", to: "/publier-terrain" },
    { icon: "storefront", label: "Marketplace", to: "/marketplace" },
    { icon: "gavel", label: "Notaires", to: "/notaires" },
    { icon: "person", label: "Mon profil", to: "/profil" },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");

    try {
      // Récupérer les infos utilisateur
      const userData = await api.me();
      const me = userData.user || userData;
      setUser(me);

      // Récupérer les terrains de l'utilisateur (filter côté client par owner_id)
      const landsRes = await api.listLands();
      const allLands = landsRes.items || landsRes.lands || landsRes || [];
      const myLands = allLands.filter((l) => l.owner_id === me.id);
      setUserLands(myLands);

      // Récupérer les offres reçues (le backend retourne { items: [...] })
      const offersRes = await api.myOffers();
      const offers = offersRes.items || offersRes.offers || offersRes || [];
      setUserOffers(offers);

      // Calculer les statistiques
      const pendingOffers = offers.filter(
        (o) => o.status === "pending" || o.status === "en_attente",
      ).length;

      const totalRevenue = offers
        .filter((o) => o.status === "accepted" || o.status === "accepte")
        .reduce(
          (sum, o) => sum + (parseFloat(o.price || o.amount) || 0),
          0,
        );

      setStats({
        totalLands: myLands.length,
        pendingOffers,
        totalRevenue,
      });
    } catch (err) {
      console.error("Erreur chargement dashboard:", err);
      setError(
        err.status === 401
          ? "Vous devez être connecté"
          : err.message || "Erreur lors du chargement des données",
      );
      if (err.status === 401) {
        setTimeout(() => navigate("/connexion"), 1500);
      }
    } finally {
      setLoading(false);
    }
  };

  // Données de démonstration (uniquement utilisées si l'utilisateur n'a pas encore de terrain)
  const demoLands = [
    {
      id: 1,
      title: "Domaine d'Agrumes",
      location: "Taroudant, Maroc",
      superficie: "12 Hectares",
      status: "validé",
      statusBg: "#E8F5F1",
      statusColor: "#1D9E75",
      img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop",
      price: 450000,
    },
    {
      id: 2,
      title: "Terres Arables",
      location: "Beni Mellal, Maroc",
      superficie: "25 Hectares",
      status: "en_attente",
      statusBg: "#F8F1E7",
      statusColor: "#BA7517",
      img: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=300&fit=crop",
      price: 820000,
    },
  ];

  const demoOffers = [
    {
      id: 1,
      name: "Karim Benali",
      role: "Investisseur Privé",
      time: "Il y a 2h",
      property: "Domaine d'Agrumes",
      amount: 450000,
      price: "450,000 DH",
      status: "pending",
      img: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: 2,
      name: "Sara Benchekroun",
      role: "AgriCorp Solutions",
      time: "Hier",
      property: "Terres Arables",
      amount: 820000,
      price: "820,000 DH",
      status: "pending",
      img: "https://randomuser.me/api/portraits/women/2.jpg",
    },
  ];

  const getStatusText = (status) => {
    const statusMap = {
      validé: "Validé",
      validated: "Validé",
      en_attente: "En attente",
      pending: "En attente",
      refusé: "Refusé",
      rejected: "Refusé",
    };
    return statusMap[status?.toLowerCase()] || status || "En attente";
  };

  const getStatusStyle = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "validé" || statusLower === "validated") {
      return { bg: "#E8F5F1", color: "#1D9E75" };
    }
    return { bg: "#F8F1E7", color: "#BA7517" };
  };

  const handleAcceptOffer = async (offerId) => {
    try {
      await api.updateOfferStatus(offerId, "accepted");
      // Recharger les données
      fetchDashboardData();
      alert("Offre acceptée avec succès !");
    } catch (err) {
      console.error("Erreur acceptation offre:", err);
      alert("Erreur lors de l'acceptation de l'offre");
    }
  };

  const handleDeclineOffer = async (offerId) => {
    try {
      await api.updateOfferStatus(offerId, "rejected");
      fetchDashboardData();
      alert("Offre déclinée");
    } catch (err) {
      console.error("Erreur déclin offre:", err);
      alert("Erreur lors du refus de l'offre");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f5fbf5",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 50,
              height: 50,
              border: "4px solid #e4eae4",
              borderTop: "4px solid #00694c",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              marginBottom: 16,
            }}
          />
          <p>Chargement de votre tableau de bord...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        * { font-family: 'Inter', sans-serif; box-sizing: border-box; margin: 0; padding: 0; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .zellige-pattern { background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 0L20 10L10 20L0 10L10 0ZM10 2L2 10L10 18L18 10L10 2Z' fill='%2300694c' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E"); }
        .kpi-card:hover { transform: translateY(-4px); transition: all 0.3s; box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
        .terrain-card:hover img { transform: scale(1.05); transition: transform 0.5s; }
        .offer-card:hover { transform: translateX(4px); transition: all 0.3s; box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
      `}</style>
      <div
        style={{
          backgroundColor: "#f5fbf5",
          color: "#171d1a",
          minHeight: "100vh",
        }}
      >
        {/* Top Bar */}
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
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  color: "#1D9E75",
                  letterSpacing: "-0.05em",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/")}
              >
                ArdMarket
              </div>
              <nav style={{ display: "flex", gap: 4, alignItems: "center", marginLeft: 16 }}>
                {[
                  { label: "Mon dashboard", to: "/dashboard-agriculteur", icon: "dashboard" },
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
                      background:
                        location.pathname === n.to ? "rgba(29,158,117,.12)" : "transparent",
                      color: location.pathname === n.to ? "#00694c" : "#171d1a",
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                      {n.icon}
                    </span>
                    {n.label}
                  </span>
                ))}
              </nav>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "50%",
                  padding: 8,
                  position: "relative",
                }}
              >
                <span className="material-symbols-outlined">notifications</span>
                {stats.pendingOffers > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      width: 8,
                      height: 8,
                      backgroundColor: "#fdad4e",
                      borderRadius: "50%",
                      border: "2px solid #fff",
                    }}
                  />
                )}
              </button>
              <button
                onClick={() => {
                  api.logout();
                  navigate("/connexion");
                }}
                title="Déconnexion"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 8,
                  color: "#dc2626",
                  transition: "background-color 0.2s",
                  borderRadius: "50%",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fef2f2")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <span className="material-symbols-outlined">logout</span>
              </button>
            </div>
          </div>
        </header>

        <div
          style={{
            display: "flex",
            maxWidth: 1440,
            margin: "0 auto",
            minHeight: "calc(100vh - 73px)",
          }}
        >
          {/* Sidebar */}
          <aside
            style={{
              width: 280,
              borderRight: "1px solid #f1f5f9",
              backgroundColor: "#fff",
              position: "sticky",
              top: 73,
              height: "calc(100vh - 73px)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Profile */}
            <div
              style={{
                padding: 24,
                paddingBottom: 32,
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <img
                src={
                  user?.avatar ||
                  "https://randomuser.me/api/portraits/men/32.jpg"
                }
                alt="Profile"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #e4eae4",
                }}
              />
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1D9E75" }}>
                  {user?.nom || user?.name || "Agriculteur"}
                </h3>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color: "#3d4943",
                    marginTop: 4,
                  }}
                >
                  {user?.role === "agriculteur"
                    ? "Agriculteur Vérifié"
                    : "Profil Agriculteur"}
                </p>
                <p style={{ fontSize: 10, color: "#00694c", marginTop: 2 }}>
                  Score Légal: 98/100
                </p>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div
                style={{
                  margin: "0 16px 16px",
                  padding: 12,
                  backgroundColor: "#fee2e2",
                  color: "#dc2626",
                  borderRadius: 8,
                  fontSize: 12,
                  textAlign: "center",
                }}
              >
                {error}
              </div>
            )}

            {/* Nav */}
            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                padding: 16,
                gap: 8,
                flex: 1,
              }}
            >
              {navLinks.map(({ icon, label, to }) => {
                const active = location.pathname === to;
                return (
                  <button
                    key={label}
                    onClick={() => navigate(to)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 16px",
                      borderRadius: 8,
                      backgroundColor: active ? "#E8F5F1" : "transparent",
                      color: active ? "#1D9E75" : "#475569",
                      fontWeight: active ? 600 : 400,
                      fontSize: 14,
                      borderRight: active
                        ? "4px solid #1D9E75"
                        : "4px solid transparent",
                      border: "none",
                      borderRightWidth: 4,
                      borderRightStyle: "solid",
                      borderRightColor: active ? "#1D9E75" : "transparent",
                      textDecoration: "none",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) e.currentTarget.style.backgroundColor = "#f1f5f4";
                    }}
                    onMouseLeave={(e) => {
                      if (!active) e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <span className="material-symbols-outlined">{icon}</span>
                    {label}
                  </button>
                );
              })}
              <div
                style={{
                  marginTop: "auto",
                  paddingTop: 16,
                  borderTop: "1px solid #f1f5f9",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <button
                  onClick={() => {
                    api.logout();
                    navigate("/connexion");
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    borderRadius: 8,
                    color: "#dc2626",
                    fontSize: 14,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fef2f2")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <span className="material-symbols-outlined">logout</span>
                  Déconnexion
                </button>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main
            style={{ flex: 1, padding: "40px 40px 64px", overflowY: "auto" }}
          >
            {/* Header */}
            <div
              style={{
                marginBottom: 40,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <div>
                <h1
                  style={{
                    fontSize: 32,
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Bonjour,{" "}
                  {user?.nom?.split(" ")[0] ||
                    user?.name?.split(" ")[0] ||
                    "Karim"}
                </h1>
                <p style={{ fontSize: 14, color: "#3d4943", marginTop: 8 }}>
                  Voici un aperçu de vos activités agricoles et offres en cours.
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#3d4943",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "#00694c",
                    display: "inline-block",
                  }}
                />
                Marché Actif
              </div>
            </div>

            {/* KPIs */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 24,
                marginBottom: 64,
              }}
            >
              {[
                {
                  label: "Mes terrains",
                  value: stats.totalLands,
                  sub: "actifs",
                  path: "M0 15 L20 12 L40 18 L60 8 L80 10 L100 2",
                  stroke: "#00694c",
                },
                {
                  label: "Offres reçues",
                  value: stats.pendingOffers,
                  sub: "en attente",
                  subColor: "#fdad4e",
                  path: "M0 18 L20 15 L40 16 L60 10 L80 12 L100 4",
                  stroke: "#fdad4e",
                },
                {
                  label: "Revenus (Total)",
                  value: `${(stats.totalRevenue / 1000).toFixed(0)}k`,
                  sub: "DH",
                  path: "M0 10 L20 14 L40 8 L60 12 L80 4 L100 6",
                  stroke: "#00694c",
                },
              ].map(({ label, value, sub, subColor, path, stroke }) => (
                <div
                  key={label}
                  className="kpi-card"
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 12,
                    padding: 24,
                    border: "1px solid rgba(188,202,193,0.3)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 16,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#3d4943",
                      }}
                    >
                      {label}
                    </span>
                    <div
                      style={{
                        padding: 8,
                        backgroundColor: "#eaefea",
                        borderRadius: 8,
                        color: "#00694c",
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 20 }}
                      >
                        {label === "Mes terrains"
                          ? "landscape"
                          : label === "Offres reçues"
                            ? "handshake"
                            : "attach_money"}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "baseline", gap: 8 }}
                  >
                    <h2
                      style={{
                        fontSize: 32,
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {value}
                    </h2>
                    <span
                      style={{
                        fontSize: 14,
                        color: subColor || "#3d4943",
                        fontWeight: subColor ? 500 : 400,
                      }}
                    >
                      {sub}
                    </span>
                  </div>
                  <div style={{ marginTop: 16, height: 32, width: "100%" }}>
                    <svg
                      viewBox="0 0 100 20"
                      style={{
                        width: "100%",
                        height: "100%",
                        fill: "none",
                        stroke: stroke,
                        strokeWidth: 2,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                      }}
                      preserveAspectRatio="none"
                    >
                      <path d={path} />
                      <path
                        d={`${path} L100 20 L0 20 Z`}
                        fill={`${stroke}1a`}
                        stroke="none"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            {/* Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "7fr 5fr",
                gap: 24,
              }}
            >
              {/* Terrains */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 24 }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid rgba(188,202,193,0.2)",
                    paddingBottom: 16,
                  }}
                >
                  <h3
                    style={{
                      fontSize: 24,
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Mes Terrains
                  </h3>
                  <button
                    onClick={() => navigate("/publier-terrain")}
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      color: "#00694c",
                      textTransform: "uppercase",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Publier un nouveau{" "}
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 16 }}
                    >
                      arrow_forward
                    </span>
                  </button>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                  }}
                >
                  {(userLands.length > 0 ? userLands : demoLands)
                    .slice(0, 2)
                    .map((land) => {
                        const id = land.id;
                        const title = land.title;
                        const location = land.location || [land.commune, land.region].filter(Boolean).join(", ") || "Maroc";
                        const superficie = land.superficie || (land.surface_ha ? `${land.surface_ha} Hectares` : null);
                        const surface = land.surface;
                        const status = land.status;
                        const img = land.img || (land.images && land.images[0]?.url) || land.cover_image;
                        const statusStyle = getStatusStyle(status);
                        return (
                          <div
                            key={id}
                            className="terrain-card"
                            style={{
                              backgroundColor: "#fff",
                              borderRadius: 12,
                              border: "1px solid rgba(188,202,193,0.3)",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                              overflow: "hidden",
                              cursor: "pointer",
                            }}
                            onClick={() => navigate(`/terrain/${id}`)}
                          >
                            <div
                              style={{
                                height: 160,
                                overflow: "hidden",
                                position: "relative",
                              }}
                            >
                              <img
                                src={
                                  img ||
                                  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop"
                                }
                                alt={title}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  transition: "transform 0.5s",
                                }}
                              />
                              <div
                                style={{
                                  position: "absolute",
                                  top: 12,
                                  right: 12,
                                  backgroundColor: statusStyle.bg,
                                  color: statusStyle.color,
                                  fontSize: 12,
                                  fontWeight: 600,
                                  letterSpacing: "0.05em",
                                  padding: "6px 12px",
                                  borderRadius: 9999,
                                  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                                }}
                              >
                                {getStatusText(status)}
                              </div>
                            </div>
                            <div style={{ padding: 20 }}>
                              <h4
                                style={{
                                  fontSize: 20,
                                  fontWeight: 600,
                                  marginBottom: 4,
                                }}
                              >
                                {title}
                              </h4>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                  color: "#3d4943",
                                  fontSize: 14,
                                  marginBottom: 16,
                                }}
                              >
                                <span
                                  className="material-symbols-outlined"
                                  style={{ fontSize: 18 }}
                                >
                                  location_on
                                </span>
                                {location || "Maroc"}
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  paddingTop: 16,
                                  borderTop: "1px solid rgba(188,202,193,0.2)",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    textTransform: "uppercase",
                                    color: "#3d4943",
                                    letterSpacing: "0.05em",
                                  }}
                                >
                                  Superficie
                                </span>
                                <span style={{ fontSize: 16, fontWeight: 600 }}>
                                  {superficie || surface || "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                </div>
              </div>

              {/* Offers */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 24 }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid rgba(188,202,193,0.2)",
                    paddingBottom: 16,
                  }}
                >
                  <h3
                    style={{
                      fontSize: 24,
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Offres Reçues
                  </h3>
                  {stats.pendingOffers > 0 && (
                    <span
                      style={{
                        backgroundColor: "rgba(0,105,76,0.1)",
                        color: "#00694c",
                        fontSize: 12,
                        fontWeight: 600,
                        padding: "4px 8px",
                        borderRadius: 6,
                      }}
                    >
                      {stats.pendingOffers} Nouvelle
                      {stats.pendingOffers > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  {(userOffers.length > 0 ? userOffers : demoOffers)
                    .slice(0, 4)
                    .map((rawOffer) => {
                      const offer = {
                        id: rawOffer.id,
                        name: rawOffer.name || rawOffer.investor_nom || "Investisseur",
                        role: rawOffer.role,
                        property: rawOffer.property || rawOffer.land_title || "Terrain",
                        amount: rawOffer.amount || rawOffer.price,
                        price: rawOffer.price && typeof rawOffer.price === "string" ? rawOffer.price : null,
                        time: rawOffer.time || (rawOffer.created_at ? new Date(rawOffer.created_at).toLocaleDateString("fr-FR") : "Récemment"),
                        status: rawOffer.status,
                        img: rawOffer.img,
                      };
                      return (
                      <div
                        key={offer.id}
                        className="offer-card"
                        style={{
                          backgroundColor: "#fff",
                          borderRadius: 12,
                          padding: 20,
                          border: "1px solid rgba(188,202,193,0.3)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                          display: "flex",
                          flexDirection: "column",
                          gap: 16,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                            }}
                          >
                            <img
                              src={
                                offer.img ||
                                "https://randomuser.me/api/portraits/men/1.jpg"
                              }
                              alt={offer.name}
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                objectFit: "cover",
                              }}
                            />
                            <div>
                              <p
                                style={{
                                  fontWeight: 600,
                                  fontSize: 16,
                                  lineHeight: 1.2,
                                }}
                              >
                                {offer.name}
                              </p>
                              <p
                                style={{
                                  fontSize: 12,
                                  fontWeight: 600,
                                  letterSpacing: "0.05em",
                                  textTransform: "uppercase",
                                  color: "#3d4943",
                                  marginTop: 4,
                                }}
                              >
                                {offer.role || "Investisseur"}
                              </p>
                            </div>
                          </div>
                          <span
                            style={{
                              fontSize: 10,
                              color: "#3d4943",
                              backgroundColor: "#eaefea",
                              padding: "4px 8px",
                              borderRadius: 4,
                            }}
                          >
                            {offer.time || "Récemment"}
                          </span>
                        </div>
                        <div
                          style={{
                            backgroundColor: "rgba(234,239,234,0.5)",
                            borderRadius: 8,
                            padding: 12,
                          }}
                        >
                          <p
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                              color: "#3d4943",
                              marginBottom: 4,
                            }}
                          >
                            Pour : {offer.property}
                          </p>
                          <p
                            style={{
                              fontSize: 20,
                              fontWeight: 600,
                              color: "#00694c",
                            }}
                          >
                            {offer.price ||
                              `${Number(offer.amount || 0).toLocaleString()} DH`}
                          </p>
                        </div>
                        <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                          <button
                            onClick={() => handleDeclineOffer(offer.id)}
                            style={{
                              flex: 1,
                              backgroundColor: "#fff",
                              border: "1px solid #E8F5F1",
                              color: "#171d1a",
                              fontSize: 12,
                              fontWeight: 600,
                              letterSpacing: "0.05em",
                              textTransform: "uppercase",
                              padding: "10px",
                              borderRadius: 8,
                              cursor: "pointer",
                            }}
                          >
                            Décliner
                          </button>
                          <button
                            onClick={() => handleAcceptOffer(offer.id)}
                            style={{
                              flex: 1,
                              backgroundColor: "#00694c",
                              color: "#fff",
                              fontSize: 12,
                              fontWeight: 600,
                              letterSpacing: "0.05em",
                              textTransform: "uppercase",
                              padding: "10px",
                              borderRadius: 8,
                              cursor: "pointer",
                              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                            }}
                          >
                            Accepter
                          </button>
                        </div>
                      </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* FAB */}
        <button
          onClick={() => navigate("/publier-terrain")}
          style={{
            position: "fixed",
            bottom: 32,
            right: 24,
            zIndex: 40,
            display: "flex",
            alignItems: "center",
            gap: 8,
            backgroundColor: "#00694c",
            color: "#fff",
            padding: "16px 24px",
            borderRadius: 9999,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            border: "none",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <span className="material-symbols-outlined">add</span>
          Publier un terrain
        </button>
      </div>
    </>
  );
}
