export default function LandingPageDarija() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        * { font-family: 'Inter', sans-serif; box-sizing: border-box; margin: 0; padding: 0; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .fill-icon { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24 !important; }
        .trust-card:hover .trust-icon { background: #1D9E75; color: #fff; transform: translateY(-4px); }
        .stat-card:hover { box-shadow: 0 12px 32px rgba(0,0,0,0.08); }
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
              padding: "20px 32px",
              maxWidth: 1440,
              margin: "0 auto",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 48 }}>
              <h1
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontWeight: 600,
                  fontSize: 24,
                  color: "#1D9E75",
                  letterSpacing: "-0.05em",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 28 }}
                >
                  landscape
                </span>
                ArdMarket
              </h1>
              <nav style={{ display: "flex", gap: 32, alignItems: "center" }}>
                {[
                  { label: "السوق", active: true },
                  { label: "التحاليل" },
                  { label: "المعاملات" },
                ].map(({ label, active }) => (
                  <a
                    key={label}
                    href="#"
                    style={{
                      color: active ? "#1D9E75" : "#475569",
                      fontWeight: active ? 700 : 500,
                      fontSize: 14,
                      textDecoration: "none",
                      borderBottom: active ? "2px solid #1D9E75" : "none",
                      paddingBottom: active ? 4 : 0,
                    }}
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <div
                style={{
                  backgroundColor: "#f5fbf5",
                  border: "1px solid #dee4de",
                  borderRadius: 9999,
                  padding: 4,
                  display: "flex",
                  alignItems: "center",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                }}
              >
                <button
                  style={{
                    padding: "8px 20px",
                    borderRadius: 9999,
                    backgroundColor: "#1D9E75",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  }}
                >
                  فلاح
                </button>
                <button
                  style={{
                    padding: "8px 20px",
                    borderRadius: 9999,
                    color: "#3d4943",
                    fontSize: 14,
                    fontWeight: 500,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  مستثمر
                </button>
              </div>
              <button
                style={{
                  color: "#94a3b8",
                  background: "none",
                  border: "1px solid transparent",
                  borderRadius: 9999,
                  padding: 8,
                  cursor: "pointer",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 24 }}
                >
                  notifications
                </span>
              </button>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#171d1a",
                  fontWeight: 500,
                  background: "none",
                  border: "1px solid #e2e8f0",
                  borderRadius: 9999,
                  padding: "8px 16px 8px 8px",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: "rgba(0,105,76,0.1)",
                    color: "#00694c",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 20 }}
                  >
                    person
                  </span>
                </div>
                <span>حسابي</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main */}
        <main
          style={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            maxWidth: 1440,
            margin: "0 auto",
            padding: "48px 64px 96px",
            gap: 64,
          }}
        >
          {/* Hero */}
          <section
            style={{
              width: "100%",
              position: "relative",
              borderRadius: 40,
              overflow: "hidden",
              backgroundColor: "#eff5ef",
              border: "1px solid #dee4de",
              boxShadow: "0 12px 40px rgba(0,0,0,0.06)",
              display: "flex",
              minHeight: 720,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.03,
                pointerEvents: "none",
                zIndex: 0,
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300694c' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              }}
            />
            {/* Text Side */}
            <div
              style={{
                flex: "0 0 42%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "80px",
                position: "relative",
                zIndex: 10,
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 16px",
                  borderRadius: 9999,
                  backgroundColor: "rgba(0,105,76,0.1)",
                  border: "1px solid rgba(0,105,76,0.2)",
                  width: "fit-content",
                  marginBottom: 32,
                }}
              >
                <span
                  className="material-symbols-outlined fill-icon"
                  style={{ fontSize: 16, color: "#00694c" }}
                >
                  landscape
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#00694c",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  أول سوق عقاري فلاحي
                </span>
              </div>
              <h1
                style={{
                  fontSize: 48,
                  fontWeight: 700,
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  color: "#171d1a",
                  marginBottom: 32,
                }}
              >
                أول سوق عقاري فلاحي فالمغرب
              </h1>
              <p
                style={{
                  fontSize: 18,
                  color: "#3d4943",
                  marginBottom: 48,
                  lineHeight: 1.6,
                  maxWidth: 480,
                }}
              >
                تواصل مباشر مع الملاك والمستثمرين الموثقين. أمّن معاملاتك مع
                شبكة العدول والموثقين الشركاء ديالنا.
              </p>
              <div style={{ display: "flex", gap: 24 }}>
                <button
                  style={{
                    background: "linear-gradient(to bottom, #1D9E75, #178562)",
                    color: "#fff",
                    padding: "20px 32px",
                    borderRadius: 16,
                    fontSize: 22,
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    boxShadow: "0 8px 24px rgba(29,158,117,0.3)",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 24 }}
                  >
                    agriculture
                  </span>
                  أنا فلاح
                </button>
                <button
                  style={{
                    backgroundColor: "#fff",
                    color: "#171d1a",
                    padding: "20px 32px",
                    borderRadius: 16,
                    fontSize: 22,
                    fontWeight: 600,
                    border: "2px solid #E8F5F1",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 24 }}
                  >
                    account_balance
                  </span>
                  أنا مستثمر
                </button>
              </div>
            </div>
            {/* Image Side */}
            <div
              style={{ flex: "0 0 58%", position: "relative", minHeight: 400 }}
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGCZErndaxHb6LpIXIVCjErjRm7ukfMaMd0hyRTluAgUFOw8-1GBJGHBbbSpvy2PXCzhgQT4p_wL2E5AeejHazNqbk4ZEm5wL_RAHzuXNaYBGtPQh9hobdGt9DCGiHL-ZBHb_CDL80a7DluAgl1lEbM8lE2L4YBilHTJxG4FMnOsHbb56E_URtpkXCIcaRPuIRf4iU5OVOsGawfNq7zMehTJg5gnYNPnDmAnJSsulyqq4bg5ZAePe9eRTiqUkyNSPXBSEjYlPmdA"
                alt="أرض فلاحية مغربية"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to right, #eff5ef, rgba(239,245,239,0.5), transparent)",
                  width: "33%",
                }}
              />
            </div>
          </section>

          {/* Stats */}
          <section
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 32,
            }}
          >
            {[
              {
                label: "العقارات المتاحة",
                value: "24",
                badge: "+12%",
                icon: "trending_up",
                badgeStyle: {
                  backgroundColor: "rgba(0,133,96,0.1)",
                  color: "#008560",
                },
                valueColor: "#1D9E75",
                iconMs: "landscape",
              },
              {
                label: "مستثمرين نشيطين",
                value: "12",
                badge: "موثقين",
                badgeStyle: { backgroundColor: "#dee4de", color: "#3d4943" },
                valueColor: "#885200",
                iconMs: "groups",
              },
              {
                label: "معاملات حديثة",
                value: "3",
                badge: "مأمنة",
                badgeStyle: {
                  backgroundColor: "rgba(29,158,117,0.1)",
                  color: "#1D9E75",
                },
                valueColor: "#171d1a",
                iconMs: "handshake",
              },
            ].map(({ label, value, badge, badgeStyle, valueColor, iconMs }) => (
              <div
                key={label}
                className="stat-card"
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  padding: 32,
                  border: "1px solid #dee4de",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.3s",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    padding: 24,
                    opacity: 0.03,
                    pointerEvents: "none",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 96 }}
                  >
                    {iconMs}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#3d4943",
                  }}
                >
                  {label}
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 16,
                    marginTop: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 64,
                      lineHeight: 1,
                      color: valueColor,
                      fontWeight: 900,
                    }}
                  >
                    {value}
                  </span>
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      marginBottom: 8,
                      padding: "4px 12px",
                      borderRadius: 9999,
                      ...badgeStyle,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {badge}
                  </span>
                </div>
              </div>
            ))}
          </section>

          {/* Trust */}
          <section
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "64px 0",
              borderTop: "2px solid #dee4de",
            }}
          >
            <h2
              style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#3d4943",
                marginBottom: 48,
                textAlign: "center",
              }}
            >
              نظام بيئي موثوق
            </h2>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 96,
              }}
            >
              {[
                {
                  icon: "verified",
                  label: "وثائق موثقة",
                  bg: "rgba(0,105,76,0.1)",
                  color: "#00694c",
                },
                {
                  icon: "lock",
                  label: "دفع آمن",
                  bg: "rgba(253,173,78,0.2)",
                  color: "#885200",
                },
                {
                  icon: "gavel",
                  label: "عدول وموثقين شركاء",
                  bg: "rgba(184,87,81,0.1)",
                  color: "#993f3a",
                },
              ].map(({ icon, label, bg, color }) => (
                <div
                  key={label}
                  className="trust-card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 20,
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  <div
                    className="trust-icon"
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 16,
                      backgroundColor: bg,
                      color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                      transition: "all 0.3s",
                    }}
                  >
                    <span
                      className="material-symbols-outlined fill-icon"
                      style={{ fontSize: 36, color: "inherit" }}
                    >
                      {icon}
                    </span>
                  </div>
                  <span
                    style={{ fontSize: 21, fontWeight: 700, color: "#171d1a" }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
