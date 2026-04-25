export default function DashboardInvestisseurDarija() {
  const cards = [
    {
      title: "ضيعة الزيتون",
      location: "مكناس, المغرب",
      surface: "65 هكتار",
      rendement: "75,000 درهم/سنة",
      score: 95,
      scoreColor: "#00694c",
      scoreBar: "95%",
      validated: true,
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuATE6DYgyRWd1mVuyD124xW3WiuP4JCF2itS6vQRfDREq2NZhLuvmSjLtx_6bw_s3mbWI5MM7U6VfOAWZ_T8T1V5PA9GUoXg0SlW6Ydy642xopQCzxsMWFRv2dtWgpyCIFfL3ymLdTXF7qG-TgZdJZTi1YbQ4IIt-PbF9BncFbLmzheIepXURptLogqvupUcWBAfEjwXkpcYuC5IiFXbYaNCVya-8i7kmDEsWOZwZSHaLF65ykaBd9ZZ-Q7LGBXPRs5N7t4v_Zaag",
    },
    {
      title: "ضيعة الحوامض أطلس",
      location: "سوس, المغرب",
      surface: "40 هكتار",
      rendement: "120,000 درهم/سنة",
      score: 78,
      scoreColor: "#704200",
      scoreBar: "78%",
      validated: false,
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_ROVWFOonoNAACaAWN0yS2lgCix2-fzGVbF78A4KzXC2eJ0fc67WhmJ_rDpvQLZ29AcAw8ICv0ETZwxwcbXMlB1jA1T1p-owf3k6OShQQnqf-57sWbm0cEzWGWr8bdTjvz8mi0UL1ZYnbKziGGevK2MT0lHawvWvcABWpgi12wwu13T_jeDr7OrBlqgfN_3wQUsURQM1ghto-MolrUP1-4XlEt7Oo52HGIFNcm3aFggJvmRewzhX0p_u2sK1HjgCtuo4KmdEUdg",
    },
    {
      title: "سهل الغرب",
      location: "الغرب, المغرب",
      surface: "150 هكتار",
      rendement: "85,000 درهم/سنة",
      score: 88,
      scoreColor: "#00694c",
      scoreBar: "88%",
      validated: true,
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAowP_24QQ2Xnu7Wp0KkVZDBPOItQhhmPWLwMBcab2Yejcx-ct4gJOwJOctUjvz-RptEoTpDus8X0V6e_azEiGHitzdPPFsuMWqdjXgUg0WqfMuhtN4QAA2k_at6N5BXFrLDEcMccGIKRGRgzDCR3Ks4ceVycM6NeReVdZHM26LSSxnQkLycCBSMuxcgQoXEmlIP-tH_ea-dM3zZLqCFC90d_xEJMVpN5Y_xTrRGl8B1cfD9K3v07OpdMHL01BF3g_use829X-r3Q",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        * { font-family: 'Inter', sans-serif; box-sizing: border-box; margin: 0; padding: 0; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .fill-icon { font-variation-settings: 'FILL' 1 !important; }
        .land-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
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
              padding: "12px 24px",
              maxWidth: 1440,
              margin: "0 auto",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                width: 256,
              }}
            >
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
            <div style={{ flex: 1, maxWidth: 512, padding: "0 16px" }}>
              <div style={{ position: "relative", width: "100%" }}>
                <span
                  className="material-symbols-outlined"
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#3d4943",
                  }}
                >
                  search
                </span>
                <input
                  type="text"
                  placeholder="بحث على منطقة، نوع الزراعة..."
                  style={{
                    width: "100%",
                    paddingLeft: 40,
                    paddingRight: 16,
                    paddingTop: 8,
                    paddingBottom: 8,
                    borderRadius: 8,
                    border: "1px solid #bccac1",
                    backgroundColor: "#f5fbf5",
                    fontSize: 14,
                    outline: "none",
                  }}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 16,
                width: 256,
              }}
            >
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "50%",
                  padding: 8,
                  color: "#475569",
                }}
              >
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: "#dee4de",
                  overflow: "hidden",
                }}
              >
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCF1_834zu8AfEDqmSEqCoCWWIvdrxkt36NA2oaEJSPavYNM1al7dC4xEG8S1laUXWcgLtmrqQBuqg-FJhLAt78G49bqbhyBGDnOtjXRH7yvNl6md8Iutiz84mzEYIibXl3J5E_gJrbBtsV9XTftfnfjGmnIMPVBw5K_46zX-1QvRzp3lkbli5TPnL2uFGyOKd4vv5Qrg5G6exZkpYv1DsXh3Vk6tDumF9sfoozNGvzRf3oz0nXJ4C1tnfsmhVal8S6Cna9226yAw"
                  alt="Profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </header>

        <div style={{ display: "flex", maxWidth: 1440, margin: "0 auto" }}>
          {/* Sidebar Filters */}
          <aside
            style={{
              width: 320,
              borderRight: "1px solid #dee4de",
              backgroundColor: "#fff",
              position: "sticky",
              top: 65,
              height: "calc(100vh - 65px)",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
            }}
          >
            <div style={{ padding: 24, borderBottom: "1px solid #dee4de" }}>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span className="material-symbols-outlined">filter_alt</span>{" "}
                فلاتر متقدمة
              </h2>
            </div>
            <div
              style={{
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 32,
              }}
            >
              {/* Region */}
              <div>
                <h3
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#3d4943",
                    marginBottom: 12,
                  }}
                >
                  الجهة
                </h3>
                {[
                  { label: "مكناس", checked: true },
                  { label: "سوس" },
                  { label: "الغرب" },
                  { label: "الحوز" },
                ].map(({ label, checked }) => (
                  <label
                    key={label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      cursor: "pointer",
                      marginBottom: 8,
                    }}
                  >
                    <input
                      type="checkbox"
                      defaultChecked={checked}
                      style={{
                        accentColor: "#00694c",
                        width: 16,
                        height: 16,
                        borderRadius: 4,
                      }}
                    />
                    <span style={{ fontSize: 14 }}>{label}</span>
                  </label>
                ))}
              </div>
              {/* Surface */}
              <div>
                <h3
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#3d4943",
                    marginBottom: 12,
                  }}
                >
                  المساحة (هكتار)
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="number"
                    placeholder="الحد الأدنى"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: 4,
                      border: "1px solid #bccac1",
                      fontSize: 14,
                      outline: "none",
                    }}
                  />
                  <span style={{ color: "#3d4943" }}>-</span>
                  <input
                    type="number"
                    placeholder="الحد الأقصى"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: 4,
                      border: "1px solid #bccac1",
                      fontSize: 14,
                      outline: "none",
                    }}
                  />
                </div>
              </div>
              {/* Price */}
              <div>
                <h3
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#3d4943",
                    marginBottom: 12,
                  }}
                >
                  السعر المقدر (درهم)
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="number"
                    placeholder="الحد الأدنى"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: 4,
                      border: "1px solid #bccac1",
                      fontSize: 14,
                      outline: "none",
                    }}
                  />
                  <span style={{ color: "#3d4943" }}>-</span>
                  <input
                    type="number"
                    placeholder="الحد الأقصى"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: 4,
                      border: "1px solid #bccac1",
                      fontSize: 14,
                      outline: "none",
                    }}
                  />
                </div>
              </div>
              {/* Type */}
              <div>
                <h3
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#3d4943",
                    marginBottom: 12,
                  }}
                >
                  نوع الزراعة
                </h3>
                {[
                  { label: "زراعة الأشجار المثمرة", checked: true },
                  { label: "الحبوب", checked: true },
                  { label: "الخضروات" },
                  { label: "أرض خالية" },
                ].map(({ label, checked }) => (
                  <label
                    key={label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      cursor: "pointer",
                      marginBottom: 8,
                    }}
                  >
                    <input
                      type="checkbox"
                      defaultChecked={checked}
                      style={{
                        accentColor: "#00694c",
                        width: 16,
                        height: 16,
                        borderRadius: 4,
                      }}
                    />
                    <span style={{ fontSize: 14 }}>{label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div
              style={{
                padding: 24,
                borderTop: "1px solid #dee4de",
                marginTop: "auto",
                backgroundColor: "#f5fbf5",
              }}
            >
              <button
                style={{
                  width: "100%",
                  backgroundColor: "#00694c",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  padding: "12px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                طبق الفلاتر
              </button>
            </div>
          </aside>

          {/* Main */}
          <main style={{ flex: 1, padding: "24px 40px" }}>
            <div style={{ marginBottom: 16 }}>
              <h1
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  marginBottom: 8,
                }}
              >
                فرص الاستثمار
              </h1>
              <p style={{ fontSize: 14, color: "#3d4943" }}>
                اكتشف ضيعات فلاحية موثوقة وذات مردودية عالية.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 24,
              }}
            >
              {cards.map(
                ({
                  title,
                  location,
                  surface,
                  rendement,
                  score,
                  scoreColor,
                  scoreBar,
                  validated,
                  img,
                }) => (
                  <div
                    key={title}
                    className="land-card"
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: 12,
                      border: "1px solid #dee4de",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                      overflow: "hidden",
                      transition: "box-shadow 0.3s",
                    }}
                  >
                    <div style={{ height: 192, position: "relative" }}>
                      <img
                        src={img}
                        alt={title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <div style={{ position: "absolute", top: 12, right: 12 }}>
                        <span
                          style={{
                            backgroundColor: validated ? "#E8F5F1" : "#F8F1E7",
                            color: validated ? "#1D9E75" : "#BA7517",
                            padding: "4px 8px",
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                          }}
                        >
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: 14 }}
                          >
                            {validated ? "verified" : "pending"}
                          </span>
                          {validated ? "موثق" : "فانتظار"}
                        </span>
                      </div>
                    </div>
                    <div style={{ padding: 20 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: 8,
                        }}
                      >
                        <h3
                          style={{
                            fontSize: 20,
                            fontWeight: 600,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: "80%",
                          }}
                        >
                          {title}
                        </h3>
                        <button
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#3d4943",
                          }}
                        >
                          <span className="material-symbols-outlined">
                            favorite_border
                          </span>
                        </button>
                      </div>
                      <p
                        style={{
                          fontSize: 14,
                          color: "#3d4943",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          marginBottom: 16,
                        }}
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: 16 }}
                        >
                          location_on
                        </span>{" "}
                        {location}
                      </p>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "12px 16px",
                          marginBottom: 16,
                        }}
                      >
                        {[
                          ["المساحة", surface],
                          ["المردودية التقريبية", rendement],
                        ].map(([label, val]) => (
                          <div key={label}>
                            <p
                              style={{
                                fontSize: 12,
                                fontWeight: 600,
                                letterSpacing: "0.05em",
                                textTransform: "uppercase",
                                color: "#3d4943",
                              }}
                            >
                              {label}
                            </p>
                            <p
                              style={{
                                fontSize: 16,
                                fontWeight: 600,
                                marginTop: 2,
                              }}
                            >
                              {val}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div
                        style={{
                          backgroundColor: "#f5fbf5",
                          borderRadius: 8,
                          padding: 12,
                          marginBottom: 20,
                          border: "1px solid #dee4de",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            color: "#3d4943",
                          }}
                        >
                          النقاط القانونية
                        </span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <div
                            style={{
                              width: 128,
                              height: 8,
                              backgroundColor: "#dee4de",
                              borderRadius: 9999,
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                backgroundColor: scoreColor,
                                height: "100%",
                                borderRadius: 9999,
                                width: scoreBar,
                              }}
                            />
                          </div>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: scoreColor,
                            }}
                          >
                            {score}/100
                          </span>
                        </div>
                      </div>
                      <button
                        style={{
                          width: "100%",
                          backgroundColor: validated ? "#00694c" : "#fff",
                          color: validated ? "#fff" : "#171d1a",
                          border: validated ? "none" : "1px solid #E8F5F1",
                          fontSize: 12,
                          fontWeight: 600,
                          letterSpacing: "0.05em",
                          textTransform: "none",
                          padding: "12px",
                          borderRadius: 8,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          transition: "all 0.2s",
                        }}
                      >
                        شوف التفاصيل
                        {validated && (
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: 18 }}
                          >
                            arrow_forward
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                ),
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
