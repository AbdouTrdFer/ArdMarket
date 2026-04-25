export default function DashboardAgriculteurDarija() {
  const navLinks = [
    { icon: "dashboard", label: "لوحة القيادة", active: true },
    { icon: "landscape", label: "أراضي" },
    { icon: "description", label: "العقود" },
    { icon: "account_balance", label: "التمويل" },
  ];

  const terrains = [
    {
      title: "ضيعة الحوامض",
      location: "تارودانت, المغرب",
      superficie: "12 هكتار",
      status: "موثق",
      statusBg: "#E8F5F1",
      statusColor: "#1D9E75",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeAwO_hzSwMovOZqHaqrPabwR0Bu5fPlCw7uWap79BEiZBjSkU20ZMlAiVn-YQWTSGskKawpiZ1zB36h2WH3pNFO5ak15umo0-rnJngBugug6VmCJ9_rRVkLjbVe83rWBY0RrfvS9Ri7PpcMT2Z3aNEZMchkIq1oYS21JAb_1iyX8tWym1ivuTGaWZ3Yk2yVsUHtpQWU3-5sBs1wPIXHNQfsOUo5iDEEzXNrMi0FkUPyX1Te2DH7uQ3D-dF7wSzz3ju2PSp0Cg5A",
    },
    {
      title: "أراضي صالحة للزراعة",
      location: "بني ملال, المغرب",
      superficie: "25 هكتار",
      status: "فانتظار",
      statusBg: "#F8F1E7",
      statusColor: "#BA7517",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPIW72I13h1HNfk0ikk9vQVZkYtomGZJv5u9I0Pv4PLAOqidG5hUN5jxzNqz3g_COzv1KqcA2EcgA4zaWb1FVjAwjt3-v-A6cjL8fA3TNP9ZRtY8gPflufeOjiKYAUVjSn8WMZJaLHmXRenxnEKp-KoRvdyyCxFd4T4YJz27fBdAOvH-dZaojtcnQASigk4Oe0i2y6loHwI1iRB7ZG3ZBRnplekzJIBhFWb2NOpGT4B01sLmP0gXvgqr24JcKZDqsDXyTHr6OQ4Q",
    },
  ];

  const offers = [
    {
      name: "كريم بنعلي",
      role: "مستثمر خاص",
      time: "منذ 2 ساعات",
      property: "ضيعة الحوامض",
      price: "450,000 درهم",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjGXUVCB5sZo2YsWcjNWO08LZw_YXb-ImKoTRlz2OyqP73qDwWKyIxJiAajDGlWm_i0Q6iW24VEgXpqsRTltP_tk-NERqEC-lGNgGLe8s6nIMxbuJV5pQiFANuTRYHvc-Yfdb3X7-KaKOiiqc08CI1mUiPHyk9_UZw262FsWnT9GvaaLE6wIrdKjJIWjBDXYZSDHK2HeEJtWz7gtxC3Cu5kls53fdfPbAckb6klGiPJQ45NaQ_TznLqV9ERIrNlP_mdKRZdY0t6A",
    },
    {
      name: "سارة بنشقرون",
      role: "AgriCorp Solutions",
      time: "البارح",
      property: "أراضي صالحة للزراعة",
      price: "820,000 درهم",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBEOqlxSMHKwdKfiJ3jXJ_uOUVWlDg6wE4cgiNj1GYrb8fq0dRqXCX9-61I47qZqzqmYJ1M5KZiic5bXG9ZYYfLSryxTxO9b8ox5C2RMUVynkyqRO5FGn5GplWvWqVcQiBCbAZxuMbcNYOhIy_YzQhaxaGVrUpqnQ3qZCCurxqBvQNVb7pKAXDy3CbbIBhyDFFmwyuOQtS7EX_-enZ5tGAUomxD8Paiq2l7weHLFz9YaxlAxz1HGMNbdRfjvTaBGYj-biQdJqtNvg",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        * { font-family: 'Inter', sans-serif; box-sizing: border-box; margin: 0; padding: 0; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .zellige-pattern { background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 0L20 10L10 20L0 10L10 0ZM10 2L2 10L10 18L18 10L10 2Z' fill='%2300694c' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E"); }
        .kpi-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
        .terrain-card:hover img { transform: scale(1.05); }
        .offer-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
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
                }}
              >
                ArdMarket
              </div>
            </div>
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
            </button>
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
              width: 320,
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
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIpJ26ccWiJRRknA1UdQljcilWAALZTZLDA-NVf8TyKqtowxzLEgqG8KpvcxZS1k3_d6CjouY_FIzFlhr7qt2v_lah1KTPU2xJ8wvpB66WdWJgkS23fyJ3orbaUkiW7KN3fqVHXHiyzNZvGQP14frwntT2PMbEADG9QCSW2GgtosTXLd59aicLLYhal650VN4fgeTfF2P9ObhSmT-tqOrTJaecvZDjZWxL8WfAGtCQkN0PFRcIVRzOzfATIufiLPhufqADhEfhOA"
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
                  ArdMarket Pro
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
                  موثق بالجملة
                </p>
                <p style={{ fontSize: 10, color: "#00694c", marginTop: 2 }}>
                  النقاط القانونية: 98/100
                </p>
              </div>
            </div>
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
              {navLinks.map(({ icon, label, active }) => (
                <a
                  key={label}
                  href="#"
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
                    textDecoration: "none",
                    transition: "all 0.3s",
                  }}
                >
                  <span className="material-symbols-outlined">{icon}</span>
                  {label}
                </a>
              ))}
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
                {[
                  { icon: "settings", label: "الإعدادات" },
                  { icon: "help_outline", label: "مساعدة" },
                ].map(({ icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 16px",
                      borderRadius: 8,
                      color: "#475569",
                      fontSize: 14,
                      textDecoration: "none",
                    }}
                  >
                    <span className="material-symbols-outlined">{icon}</span>
                    {label}
                  </a>
                ))}
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
                  السلام عليكم, كريم
                </h1>
                <p style={{ fontSize: 14, color: "#3d4943", marginTop: 8 }}>
                  هاد نظرة عامة على نشاطك الفلاحي والعروض الجارية.
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
                السوق نشط
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
                  label: "أراضي",
                  value: "3",
                  sub: "نشطة",
                  path: "M0 15 L20 12 L40 18 L60 8 L80 10 L100 2",
                  stroke: "#00694c",
                },
                {
                  label: "عروض وصلات",
                  value: "5",
                  sub: "+2 هاد الأسبوع",
                  subColor: "#fdad4e",
                  path: "M0 18 L20 15 L40 16 L60 10 L80 12 L100 4",
                  stroke: "#fdad4e",
                },
                {
                  label: "الدخل (شهري)",
                  value: "120k",
                  sub: "درهم",
                  path: "M0 10 L20 14 L40 8 L60 12 L80 4 L100 6",
                  stroke: "#00694c",
                },
              ].map(({ label, value, sub, subColor, path, stroke }) => (
                <div
                  key={label}
                  className="kpi-card zellige-pattern"
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 12,
                    padding: 24,
                    border: "1px solid rgba(188,202,193,0.3)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                    transition: "all 0.3s",
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
                        landscape
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
                    أراضي
                  </h3>
                  <a
                    href="#"
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
                    }}
                  >
                    شوف الكل{" "}
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 16 }}
                    >
                      arrow_forward
                    </span>
                  </a>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                  }}
                >
                  {terrains.map(
                    ({
                      title,
                      location,
                      superficie,
                      status,
                      statusBg,
                      statusColor,
                      img,
                    }) => (
                      <div
                        key={title}
                        className="terrain-card"
                        style={{
                          backgroundColor: "#fff",
                          borderRadius: 12,
                          border: "1px solid rgba(188,202,193,0.3)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: 160,
                            overflow: "hidden",
                            position: "relative",
                          }}
                        >
                          <img
                            src={img}
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
                              backgroundColor: statusBg,
                              color: statusColor,
                              fontSize: 12,
                              fontWeight: 600,
                              letterSpacing: "0.05em",
                              padding: "6px 12px",
                              borderRadius: 9999,
                              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                            }}
                          >
                            {status}
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
                            {location}
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
                              المساحة
                            </span>
                            <span style={{ fontSize: 16, fontWeight: 600 }}>
                              {superficie}
                            </span>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
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
                    العروض الواصلة
                  </h3>
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
                    جديد
                  </span>
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  {offers.map(({ name, role, time, property, price, img }) => (
                    <div
                      key={name}
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
                        transition: "all 0.3s",
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
                            src={img}
                            alt={name}
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
                              {name}
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
                              {role}
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
                          {time}
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
                          على: {property}
                        </p>
                        <p
                          style={{
                            fontSize: 20,
                            fontWeight: 600,
                            color: "#00694c",
                          }}
                        >
                          {price}
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                        <button
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
                          رفض
                        </button>
                        <button
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
                          قبول
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* FAB */}
        <button
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
          }}
        >
          <span className="material-symbols-outlined">add</span>
          انشر أرض
        </button>
      </div>
    </>
  );
}
