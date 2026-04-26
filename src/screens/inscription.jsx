// Inscription.jsx - Version corrigée pour correspondre au backend
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function MaterialIcon({ name, fill = false, className = "" }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontVariationSettings: fill
          ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
          : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
      }}
    >
      {name}
    </span>
  );
}

export default function Inscription() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("agriculteur");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [debugData, setDebugData] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    nom: "", // Changé de fullName à nom
    email: "",
    phone: "",
    whatsapp: "", // Ajouté
    region: "", // Ajouté
    password: "",
    acceptTerms: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (error) setError("");
    if (success) setSuccess(false);
    if (debugData) setDebugData(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (!formData.acceptTerms) {
      setError("Veuillez accepter les conditions générales");
      return;
    }

    if (!formData.nom || !formData.email || !formData.password) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Veuillez entrer un email valide");
      return;
    }

    // Validation téléphone (optionnel mais format marocain si fourni)
    if (formData.phone) {
      const phoneRegex = /^(06|07|05|0)[0-9]{8}$/;
      if (!phoneRegex.test(formData.phone)) {
        setError("Veuillez entrer un numéro de téléphone valide (06XXXXXXXX)");
        return;
      }
    }

    // Validation mot de passe
    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);

    // Préparer les données selon le schéma backend
    const userData = {
      nom: formData.nom, // ⚠️ 'nom' pas 'name'
      email: formData.email,
      password: formData.password,
      role: selectedRole, // 'agriculteur' ou 'investisseur'
      phone: formData.phone || undefined, // optionnel
      whatsapp: formData.whatsapp || undefined, // optionnel
      region: formData.region || undefined, // optionnel
    };

    // Afficher dans la console
    console.log("=== DÉBUT INSCRIPTION ===");
    console.log("📤 Données envoyées:", userData);

    // Afficher dans l'interface
    setDebugData({
      sent: userData,
      timestamp: new Date().toLocaleString(),
      status: "loading",
    });

    try {
      const response = await api.register(userData);

      console.log("✅ Réponse reçue:", response);

      setDebugData((prev) => ({
        ...prev,
        received: response,
        status: "success",
      }));

      // Stocker le token
      if (response.token) {
        localStorage.setItem("ardmarket_token", response.token);
        localStorage.setItem("user_role", selectedRole);
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user));
        }
      }

      setSuccess(true);

      // Redirection après 2 secondes
      setTimeout(() => {
        navigate(`/connexion?registered=true&email=${encodeURIComponent(formData.email)}`);
      }, 2000);
    } catch (err) {
      console.error("❌ Erreur complète:", err);
      console.error("❌ Message d'erreur:", err.message);
      console.error("❌ Données d'erreur:", err.data);

      setDebugData((prev) => ({
        ...prev,
        error: {
          message: err.message,
          data: err.data,
          status: err.status,
        },
        status: "error",
      }));

      let errorMessage = "Erreur lors de l'inscription";
      if (err.data?.error) {
        // Gérer l'erreur de validation Zod
        if (typeof err.data.error === "object") {
          const errors = Object.values(err.data.error).flat().join(", ");
          errorMessage = errors;
        } else {
          errorMessage = err.data.error;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      id: "agriculteur",
      icon: "agriculture",
      title: "Agriculteur",
      desc: "Je souhaite vendre mes terres, trouver des financements ou louer du matériel.",
      img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop",
    },
    {
      id: "investisseur",
      icon: "analytics",
      title: "Investisseur",
      desc: "Je recherche des opportunités foncières rentables et des projets agricoles durables.",
      img: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        * { font-family: 'Inter', sans-serif; box-sizing: border-box; margin: 0; padding: 0; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; font-family: 'Material Symbols Outlined'; }
        .zellige-pattern { 
          background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0l5 15h15l-12 9 5 16-13-10-13 10 5-16-12-9h15z' fill='%231D9E75' fill-opacity='0.03'/%3E%3C/svg%3E");
          background-repeat: repeat;
        }
        input:focus, button:focus { outline: none; }
        .debug-panel {
          animation: slideDown 0.3s ease-out;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: "#f5fbf5", color: "#171d1a" }}
      >
        {/* Header */}
        <header
          style={{
            backgroundColor: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(8px)",
            borderBottom: "1px solid #f3f4f6",
            boxShadow: "0 2px 15px -3px rgba(0,0,0,0.07)",
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
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: "-0.05em",
              color: "#065f46",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            ArdMarket
          </div>
          <nav style={{ display: "flex", gap: 40, alignItems: "center" }}>
            {["Explorer", "Comment ça marche", "Assistance"].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#4b5563",
                  textDecoration: "none",
                }}
              >
                {item}
              </a>
            ))}
          </nav>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <button
              onClick={() => navigate("/connexion")}
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "#4b5563",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Se connecter
            </button>
            <button
              onClick={() => navigate("/publier-terrain")}
              style={{
                backgroundColor: "#00694c",
                color: "#fff",
                padding: "8px 24px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
              }}
            >
              Publier une annonce
            </button>
          </div>
        </header>

        {/* Main */}
        <main
          className="zellige-pattern"
          style={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "96px 24px 24px",
          }}
        >
          <div
            style={{
              maxWidth: 896,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Card */}
            <div
              style={{
                width: "100%",
                maxWidth: 800,
                backgroundColor: "#fff",
                borderRadius: 12,
                boxShadow: "0px 8px 24px rgba(0,0,0,0.08)",
                border: "1px solid #bccac1",
                overflow: "hidden",
              }}
            >
              {/* Card Header */}
              <div
                style={{
                  padding: "24px 40px",
                  borderBottom: "1px solid #f3f4f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <button
                  onClick={() => navigate("/")}
                  style={{
                    padding: 4,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "50%",
                  }}
                >
                  <MaterialIcon name="close" />
                </button>
                <h2
                  style={{
                    fontSize: 24,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    textAlign: "center",
                    flexGrow: 1,
                  }}
                >
                  Inscription
                </h2>
                <div style={{ width: 32 }} />
              </div>

              <div style={{ padding: 40 }}>
                {/* Success Message */}
                {success && (
                  <div
                    style={{
                      backgroundColor: "#d1fae5",
                      color: "#065f46",
                      padding: "12px",
                      borderRadius: 8,
                      fontSize: 14,
                      marginBottom: 24,
                      textAlign: "center",
                      border: "1px solid #a7f3d0",
                    }}
                  >
                    ✅ Inscription réussie ! Redirection vers la page de
                    connexion...
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div
                    style={{
                      backgroundColor: "#fee2e2",
                      color: "#dc2626",
                      padding: "12px",
                      borderRadius: 8,
                      fontSize: 14,
                      marginBottom: 24,
                      textAlign: "center",
                    }}
                  >
                    ❌ {error}
                  </div>
                )}

                {/* DEBUG PANEL */}
                {debugData && (
                  <div
                    className="debug-panel"
                    style={{
                      backgroundColor: "#1e1e2e",
                      borderRadius: 8,
                      padding: 16,
                      marginBottom: 24,
                      fontFamily: "monospace",
                      fontSize: 12,
                      border: `2px solid ${
                        debugData.status === "success"
                          ? "#10b981"
                          : debugData.status === "error"
                            ? "#ef4444"
                            : "#f59e0b"
                      }`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 12,
                      }}
                    >
                      <strong style={{ color: "#fff" }}>
                        {debugData.status === "success"
                          ? "✅ SUCCÈS"
                          : debugData.status === "error"
                            ? "❌ ERREUR"
                            : "⏳ ENVOI EN COURS..."}
                      </strong>
                      <span style={{ fontSize: 10, color: "#94a3b8" }}>
                        {debugData.timestamp}
                      </span>
                    </div>

                    {/* Données envoyées */}
                    <div style={{ marginBottom: 12 }}>
                      <div
                        style={{
                          color: "#60a5fa",
                          fontWeight: 600,
                          marginBottom: 6,
                        }}
                      >
                        📤 DONNÉES ENVOYÉES :
                      </div>
                      <pre
                        style={{
                          backgroundColor: "#0f0f1a",
                          color: "#e2e8f0",
                          padding: 10,
                          borderRadius: 6,
                          overflow: "auto",
                          fontSize: 11,
                          borderLeft: "3px solid #60a5fa",
                        }}
                      >
                        {JSON.stringify(debugData.sent, null, 2)}
                      </pre>
                    </div>

                    {/* Réponse reçue */}
                    {debugData.received && (
                      <div style={{ marginBottom: 12 }}>
                        <div
                          style={{
                            color: "#34d399",
                            fontWeight: 600,
                            marginBottom: 6,
                          }}
                        >
                          ✅ RÉPONSE REÇUE :
                        </div>
                        <pre
                          style={{
                            backgroundColor: "#0f0f1a",
                            color: "#e2e8f0",
                            padding: 10,
                            borderRadius: 6,
                            overflow: "auto",
                            fontSize: 11,
                            borderLeft: "3px solid #34d399",
                          }}
                        >
                          {JSON.stringify(debugData.received, null, 2)}
                        </pre>
                      </div>
                    )}

                    {/* Erreur */}
                    {debugData.error && (
                      <div>
                        <div
                          style={{
                            color: "#f87171",
                            fontWeight: 600,
                            marginBottom: 6,
                          }}
                        >
                          ❌ DÉTAILS DE L'ERREUR :
                        </div>
                        <pre
                          style={{
                            backgroundColor: "#0f0f1a",
                            color: "#fca5a5",
                            padding: 10,
                            borderRadius: 6,
                            overflow: "auto",
                            fontSize: 11,
                            borderLeft: "3px solid #f87171",
                          }}
                        >
                          {JSON.stringify(debugData.error, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 1: Role */}
                <div style={{ marginBottom: 40 }}>
                  <h1
                    style={{
                      fontSize: 32,
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      marginBottom: 8,
                    }}
                  >
                    Bienvenue sur ArdMarket
                  </h1>
                  <p
                    style={{ fontSize: 16, color: "#3d4943", marginBottom: 24 }}
                  >
                    Choisissez le profil qui correspond le mieux à vos objectifs
                    agricoles.
                  </p>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 24,
                    }}
                  >
                    {roles.map((role) => (
                      <label
                        key={role.id}
                        style={{ position: "relative", cursor: "pointer" }}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={role.id}
                          checked={selectedRole === role.id}
                          onChange={() => setSelectedRole(role.id)}
                          style={{
                            position: "absolute",
                            opacity: 0,
                            width: 0,
                            height: 0,
                          }}
                        />
                        <div
                          style={{
                            height: "100%",
                            border: `2px solid ${selectedRole === role.id ? "#00694c" : "#bccac1"}`,
                            borderRadius: 12,
                            padding: 24,
                            transition: "all 0.2s",
                            backgroundColor:
                              selectedRole === role.id
                                ? "rgba(0,133,96,0.03)"
                                : "#fff",
                            cursor: "pointer",
                          }}
                        >
                          <div
                            style={{
                              marginBottom: 24,
                              height: 160,
                              overflow: "hidden",
                              borderRadius: 8,
                            }}
                          >
                            <img
                              src={role.img}
                              alt={role.title}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              marginBottom: 8,
                            }}
                          >
                            <MaterialIcon
                              name={role.icon}
                              style={{ color: "#00694c" }}
                            />
                            <h3 style={{ fontSize: 20, fontWeight: 600 }}>
                              {role.title}
                            </h3>
                          </div>
                          <p style={{ fontSize: 14, color: "#3d4943" }}>
                            {role.desc}
                          </p>
                        </div>
                        {selectedRole === role.id && (
                          <div
                            style={{
                              position: "absolute",
                              top: 16,
                              right: 16,
                              backgroundColor: "#00694c",
                              borderRadius: "50%",
                              padding: 4,
                            }}
                          >
                            <MaterialIcon
                              name="check"
                              fill
                              style={{ color: "#fff", fontSize: 14 }}
                            />
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Form */}
                <form
                  onSubmit={handleSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: 24 }}
                >
                  {/* Ligne 1: Nom complet */}
                  <div>
                    <label
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                        color: "#3d4943",
                      }}
                    >
                      NOM COMPLET *
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      placeholder="ex: Ahmed Mansouri"
                      required
                      style={{
                        width: "100%",
                        padding: "16px 24px",
                        marginTop: 8,
                        border: "1px solid #bccac1",
                        borderRadius: 8,
                        fontSize: 14,
                        outline: "none",
                        backgroundColor: "#fff",
                      }}
                    />
                  </div>

                  {/* Ligne 2: Email et Téléphone */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 24,
                    }}
                  >
                    <div>
                      <label
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          letterSpacing: "0.05em",
                          color: "#3d4943",
                        }}
                      >
                        EMAIL *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="ahmed@exemple.ma"
                        required
                        style={{
                          width: "100%",
                          padding: "16px 24px",
                          marginTop: 8,
                          border: "1px solid #bccac1",
                          borderRadius: 8,
                          fontSize: 14,
                          outline: "none",
                          backgroundColor: "#fff",
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          letterSpacing: "0.05em",
                          color: "#3d4943",
                        }}
                      >
                        TÉLÉPHONE
                      </label>
                      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                        <div
                          style={{
                            backgroundColor: "#e4eae4",
                            padding: "16px 24px",
                            border: "1px solid #bccac1",
                            borderRadius: 8,
                            fontSize: 14,
                            color: "#3d4943",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          +212
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="06XXXXXXXX"
                          style={{
                            flexGrow: 1,
                            padding: "16px 24px",
                            border: "1px solid #bccac1",
                            borderRadius: 8,
                            fontSize: 14,
                            outline: "none",
                            backgroundColor: "#fff",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Ligne 3: WhatsApp et Région */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 24,
                    }}
                  >
                    <div>
                      <label
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          letterSpacing: "0.05em",
                          color: "#3d4943",
                        }}
                      >
                        WHATSAPP
                      </label>
                      <input
                        type="tel"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        placeholder="06XXXXXXXX"
                        style={{
                          width: "100%",
                          padding: "16px 24px",
                          marginTop: 8,
                          border: "1px solid #bccac1",
                          borderRadius: 8,
                          fontSize: 14,
                          outline: "none",
                          backgroundColor: "#fff",
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          letterSpacing: "0.05em",
                          color: "#3d4943",
                        }}
                      >
                        RÉGION
                      </label>
                      <select
                        name="region"
                        value={formData.region}
                        onChange={handleInputChange}
                        style={{
                          width: "100%",
                          padding: "16px 24px",
                          marginTop: 8,
                          border: "1px solid #bccac1",
                          borderRadius: 8,
                          fontSize: 14,
                          outline: "none",
                          backgroundColor: "#fff",
                        }}
                      >
                        <option value="">Sélectionnez une région</option>
                        <option value="Casablanca-Settat">
                          Casablanca-Settat
                        </option>
                        <option value="Rabat-Salé-Kénitra">
                          Rabat-Salé-Kénitra
                        </option>
                        <option value="Tanger-Tétouan-Al Hoceïma">
                          Tanger-Tétouan-Al Hoceïma
                        </option>
                        <option value="Marrakech-Safi">Marrakech-Safi</option>
                        <option value="Fès-Meknès">Fès-Meknès</option>
                      </select>
                    </div>
                  </div>

                  {/* Ligne 4: Mot de passe */}
                  <div>
                    <label
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                        color: "#3d4943",
                      }}
                    >
                      MOT DE PASSE *
                    </label>
                    <div style={{ position: "relative", marginTop: 8 }}>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="•••••••• (minimum 6 caractères)"
                        required
                        style={{
                          width: "100%",
                          padding: "16px 24px",
                          border: "1px solid #bccac1",
                          borderRadius: 8,
                          fontSize: 14,
                          outline: "none",
                          backgroundColor: "#fff",
                          paddingRight: "48px",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          right: 16,
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#3d4943",
                        }}
                      >
                        <MaterialIcon
                          name={showPassword ? "visibility_off" : "visibility"}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Checkbox */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      paddingTop: 16,
                    }}
                  >
                    <input
                      type="checkbox"
                      id="terms"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                      style={{
                        marginTop: 2,
                        width: 18,
                        height: 18,
                        borderRadius: 4,
                        accentColor: "#00694c",
                        cursor: "pointer",
                      }}
                    />
                    <label
                      htmlFor="terms"
                      style={{
                        fontSize: 14,
                        color: "#3d4943",
                        lineHeight: 1.6,
                        cursor: "pointer",
                      }}
                    >
                      J'accepte les{" "}
                      <a
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        style={{ color: "#00694c", textDecoration: "none" }}
                      >
                        Conditions Générales
                      </a>{" "}
                      et la{" "}
                      <a
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        style={{ color: "#00694c", textDecoration: "none" }}
                      >
                        Politique de Confidentialité
                      </a>{" "}
                      d'ArdMarket.
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: "100%",
                      backgroundColor: loading ? "#94a3b8" : "#00694c",
                      color: "#fff",
                      padding: "20px",
                      borderRadius: 12,
                      fontSize: 18,
                      fontWeight: 600,
                      border: "none",
                      cursor: loading ? "not-allowed" : "pointer",
                      transition: "all 0.2s",
                      marginTop: 8,
                    }}
                  >
                    {loading ? "Création en cours..." : "Créer mon compte"}
                  </button>
                </form>

                {/* Footer */}
                <div
                  style={{
                    marginTop: 32,
                    paddingTop: 32,
                    borderTop: "1px solid #f3f4f6",
                    textAlign: "center",
                  }}
                >
                  <p style={{ fontSize: 14, color: "#3d4943" }}>
                    Vous avez déjà un compte ?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/connexion")}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#00694c",
                        textDecoration: "none",
                      }}
                    >
                      Connectez-vous
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
