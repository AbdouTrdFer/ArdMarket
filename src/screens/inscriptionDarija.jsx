// InscriptionDarija.jsx - Version complète avec API et debug
import { useState } from "react";
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

export default function InscriptionDarija() {
  const [selectedRole, setSelectedRole] = useState("agriculteur");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [debugData, setDebugData] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    phone: "",
    whatsapp: "",
    region: "",
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
      setError("يرجى قبول الشروط العامة");
      return;
    }

    if (!formData.nom || !formData.email || !formData.password) {
      setError("يرجى ملء جميع الحقول الإلزامية");
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("يرجى إدخال بريد إلكتروني صالح");
      return;
    }

    // Validation téléphone (optionnel)
    if (formData.phone) {
      const phoneRegex = /^(06|07|05|0)[0-9]{8}$/;
      if (!phoneRegex.test(formData.phone)) {
        setError("يرجى إدخال رقم هاتف صالح (06XXXXXXXX)");
        return;
      }
    }

    // Validation mot de passe
    if (formData.password.length < 6) {
      setError("كلمة السر يجب أن تحتوي على 6 أحرف على الأقل");
      return;
    }

    setLoading(true);

    // Préparer les données
    const userData = {
      nom: formData.nom,
      email: formData.email,
      password: formData.password,
      role: selectedRole,
      phone: formData.phone || undefined,
      whatsapp: formData.whatsapp || undefined,
      region: formData.region || undefined,
    };

    // Afficher dans la console
    console.log("=== بداية التسجيل ===");
    console.log("📤 البيانات المرسلة:", userData);

    // Afficher dans l'interface
    setDebugData({
      sent: userData,
      timestamp: new Date().toLocaleString(),
      status: "loading",
    });

    try {
      const response = await api.register(userData);

      console.log("✅ الرد المستلم:", response);

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
        window.location.href = `/connexion?registered=true&email=${encodeURIComponent(formData.email)}`;
      }, 2000);
    } catch (err) {
      console.error("❌ خطأ مفصل:", err);

      setDebugData((prev) => ({
        ...prev,
        error: {
          message: err.message,
          data: err.data,
          status: err.status,
        },
        status: "error",
      }));

      let errorMessage = "خطأ في التسجيل";
      if (err.data?.error) {
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
      title: "فلاح",
      desc: "بغيت نبيع أراضي، نلقى تمويل ولا كري ماتيريو.",
      img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop",
    },
    {
      id: "investisseur",
      icon: "analytics",
      title: "مستثمر",
      desc: "كنقلب على فرص عقارية مربحة ومشاريع فلاحية مستدامة.",
      img: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
    },
  ];

  const regions = [
    { value: "", label: "ختار المنطقة" },
    { value: "Casablanca-Settat", label: "الدار البيضاء - سطات" },
    { value: "Rabat-Salé-Kénitra", label: "الرباط - سلا - القنيطرة" },
    { value: "Tanger-Tétouan-Al Hoceïma", label: "طنجة - تطوان - الحسيمة" },
    { value: "Marrakech-Safi", label: "مراكش - آسفي" },
    { value: "Fès-Meknès", label: "فاس - مكناس" },
    { value: "Souss-Massa", label: "سوس - ماسة" },
    { value: "Oriental", label: "الجهة الشرقية" },
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
        input:focus, button:focus, select:focus { outline: none; }
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
            onClick={() => (window.location.href = "/")}
          >
            ArdMarket
          </div>
          <nav style={{ display: "flex", gap: 40, alignItems: "center" }}>
            {[
              { label: "استكشف", href: "/" },
              { label: "كيفاش خدامة", href: "/how-it-works" },
              { label: "الدعم", href: "/support" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#4b5563",
                  textDecoration: "none",
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <button
              onClick={() => (window.location.href = "/connexion")}
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "#4b5563",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              تسجيل الدخول
            </button>
            <button
              onClick={() => (window.location.href = "/publier")}
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
              نشر إعلان
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
                  onClick={() => (window.location.href = "/")}
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
                  تسجيل
                </h2>
                <div style={{ width: 32 }} />
              </div>

              <div style={{ padding: 40 }}>
                {/* Progress Bar */}
                <div
                  style={{
                    width: "100%",
                    height: 4,
                    backgroundColor: "#e4eae4",
                    borderRadius: 9999,
                    marginBottom: 40,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: "50%",
                      height: "100%",
                      backgroundColor: "#00694c",
                      borderRadius: 9999,
                    }}
                  />
                </div>

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
                    ✅ تم التسجيل بنجاح! جاري التحويل إلى صفحة الدخول...
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
                          ? "✅ نجاح"
                          : debugData.status === "error"
                            ? "❌ خطأ"
                            : "⏳ جاري الإرسال..."}
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
                        📤 البيانات المرسلة:
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
                          ✅ الرد المستلم:
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
                          ❌ تفاصيل الخطأ:
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
                    مرحبا بيك فـ ArdMarket
                  </h1>
                  <p
                    style={{ fontSize: 16, color: "#3d4943", marginBottom: 24 }}
                  >
                    ختار البروفيل لي كيناسب أهدافك الفلاحية.
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
                  {/* Nom */}
                  <div>
                    <label
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                        color: "#3d4943",
                      }}
                    >
                      الاسم الكامل *
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      placeholder="مثال: أحمد المنصوري"
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

                  {/* Email et Téléphone */}
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
                        البريد الإلكتروني *
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
                        رقم الهاتف
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

                  {/* WhatsApp et Région */}
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
                        واتساب
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
                        المنطقة
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
                        {regions.map((region) => (
                          <option key={region.value} value={region.value}>
                            {region.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Mot de passe */}
                  <div>
                    <label
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                        color: "#3d4943",
                      }}
                    >
                      كلمة السر *
                    </label>
                    <div style={{ position: "relative", marginTop: 8 }}>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="•••••••• (6 أحرف على الأقل)"
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
                      قبلت{" "}
                      <a
                        href="/conditions"
                        style={{ color: "#00694c", textDecoration: "none" }}
                      >
                        الشروط العامة
                      </a>{" "}
                      و{" "}
                      <a
                        href="/confidentialite"
                        style={{ color: "#00694c", textDecoration: "none" }}
                      >
                        سياسة السرية
                      </a>{" "}
                      د ArdMarket.
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
                    {loading ? "جاري التسجيل..." : "أنشئ حسابي"}
                  </button>
                </form>

                {/* Footer */}
                <div
                  style={{
                    marginTop: 32,
                    paddingTop: 32,
                    borderTop: "1px solid #f3f4f6",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 20,
                  }}
                >
                  <p style={{ fontSize: 14, color: "#3d4943" }}>
                    عندك حساب قبل؟{" "}
                    <a
                      href="/connexion"
                      style={{
                        fontWeight: 600,
                        color: "#00694c",
                        textDecoration: "none",
                      }}
                    >
                      سجل الدخول
                    </a>
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      gap: 16,
                    }}
                  >
                    <div
                      style={{
                        height: 1,
                        backgroundColor: "#e4eae4",
                        flexGrow: 1,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                        color: "#3d4943",
                      }}
                    >
                      ولا تابع ب
                    </span>
                    <div
                      style={{
                        height: 1,
                        backgroundColor: "#e4eae4",
                        flexGrow: 1,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 16,
                      width: "100%",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => console.log("Google login")}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        padding: "12px 16px",
                        border: "1px solid #e4eae4",
                        borderRadius: 8,
                        backgroundColor: "#fff",
                        cursor: "pointer",
                        fontSize: 14,
                        fontWeight: 500,
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        style={{ width: 20, height: 20 }}
                      >
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-5.38z"
                          fill="#EA4335"
                        />
                      </svg>
                      Google
                    </button>
                    <button
                      type="button"
                      onClick={() => console.log("LinkedIn login")}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        padding: "12px 16px",
                        border: "1px solid #e4eae4",
                        borderRadius: 8,
                        backgroundColor: "#fff",
                        cursor: "pointer",
                        fontSize: 14,
                        fontWeight: 500,
                      }}
                    >
                      <MaterialIcon
                        name="business_center"
                        style={{ color: "#2563eb", fontSize: 20 }}
                      />
                      LinkedIn
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div
              style={{
                marginTop: 32,
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 32,
                opacity: 0.6,
              }}
            >
              {[
                ["verified_user", "دفع آمن"],
                ["gavel", "عقود قانونية"],
                ["support_agent", "دعم 24/7"],
              ].map(([icon, label]) => (
                <div
                  key={label}
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <MaterialIcon
                    name={icon}
                    style={{ color: "#00694c", fontSize: 16 }}
                  />
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      color: "#3d4943",
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
            padding: "48px 48px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 20,
            borderTop: "1px solid #e5e7eb",
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
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#6b7280",
                marginTop: 8,
              }}
            >
              © 2024 ArdMarket. التميز فالعقار الفلاحي.
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 32 }}>
            {["السرية", "الشروط العامة", "اتصل بنا", "خريطة الموقع"].map(
              (l) => (
                <a
                  key={l}
                  href="#"
                  style={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#6b7280",
                    textDecoration: "underline",
                  }}
                >
                  {l}
                </a>
              ),
            )}
          </div>
        </footer>
      </div>
    </>
  );
}
