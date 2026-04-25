export default function DetailTerrainDarija() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        * { font-family: 'Inter', sans-serif; box-sizing: border-box; margin: 0; padding: 0; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .fill-icon { font-variation-settings: 'FILL' 1 !important; }
      `}</style>

      <div style={{ backgroundColor: "#f5fbf5", minHeight: "100vh" }}>
        {/* Header */}
        <header
          style={{
            backgroundColor: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(8px)",
            position: "sticky",
            top: 0,
            zIndex: 50,
            borderBottom: "1px solid #f3f4f6",
            boxShadow: "0 2px 15px -3px rgba(0,0,0,0.07)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 32px",
              maxWidth: 1280,
              margin: "0 auto",
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
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 8,
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ color: "#4b5563" }}
                >
                  arrow_back
                </span>
              </button>
              <span style={{ fontSize: 14, fontWeight: 500, color: "#4b5563" }}>
                رجوع للعقارات
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main
          style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 32 }}
          >
            {/* Left Column - Images & Info */}
            <div>
              {/* Main Image */}
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  marginBottom: 24,
                }}
              >
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuATE6DYgyRWd1mVuyD124xW3WiuP4JCF2itS6vQRfDREq2NZhLuvmSjLtx_6bw_s3mbWI5MM7U6VfOAWZ_T8T1V5PA9GUoXg0SlW6Ydy642xopQCzxsMWFRv2dtWgpyCIFfL3ymLdTXF7qG-TgZdJZTi1YbQ4IIt-PbF9BncFbLmzheIepXURptLogqvupUcWBAfEjwXkpcYuC5IiFXbYaNCVya-8i7kmDEsWOZwZSHaLF65ykaBd9ZZ-Q7LGBXPRs5N7t4v_Zaag"
                  alt="Domaine de l'Olivier"
                  style={{ width: "100%", height: 400, objectFit: "cover" }}
                />
              </div>

              {/* Title & Price */}
              <div style={{ marginBottom: 24 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <h1
                      style={{
                        fontSize: 32,
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        marginBottom: 8,
                      }}
                    >
                      ضيعة الزيتون
                    </h1>
                    <p
                      style={{
                        fontSize: 16,
                        color: "#3d4943",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 18 }}
                      >
                        location_on
                      </span>
                      مكناس, المغرب
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p
                      style={{
                        fontSize: 14,
                        color: "#3d4943",
                        marginBottom: 4,
                      }}
                    >
                      السعر المقترح
                    </p>
                    <p
                      style={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: "#00694c",
                      }}
                    >
                      2,450,000 درهم
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <span
                    style={{
                      backgroundColor: "#E8F5F1",
                      color: "#1D9E75",
                      padding: "4px 12px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 14, verticalAlign: "middle" }}
                    >
                      verified
                    </span>{" "}
                    موثق
                  </span>
                  <span
                    style={{
                      backgroundColor: "#f0fdf4",
                      color: "#166534",
                      padding: "4px 12px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    نقاط قانونية: 95/100
                  </span>
                </div>
              </div>

              {/* Description */}
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  padding: 24,
                  marginBottom: 24,
                  border: "1px solid #dee4de",
                }}
              >
                <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
                  وصف الضيعة
                </h2>
                <p style={{ fontSize: 14, color: "#3d4943", lineHeight: 1.6 }}>
                  ضيعة الزيتون فمدينة مكناس، أرض فلاحية خصبة كتنتج زيت الزيتون
                  البكر الممتاز. فيها 65 هكتار، مزودة بنظام الري بالتنقيط،
                  وعندها إمكانية الوصول للطرق الرئيسية. الضيعة فمنطقة استراتيجية
                  قريبة من الأسواق الكبرى ومراكز التحويل. خاضعة للعقد الفلاحي،
                  وكل الوثائق القانونية فمحلها.
                </p>
              </div>

              {/* Features Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 16,
                  marginBottom: 24,
                }}
              >
                {[
                  { icon: "crop", label: "المساحة", value: "65 هكتار" },
                  {
                    icon: "water_drop",
                    label: "نظام الري",
                    value: "ري بالتنقيط",
                  },
                  { icon: "grass", label: "نوع الزراعة", value: "زيتون" },
                  {
                    icon: "bar_chart",
                    label: "المردودية",
                    value: "75,000 درهم/سنة",
                  },
                  {
                    icon: "description",
                    label: "الوضعية القانونية",
                    value: "عقد فلاحي",
                  },
                  { icon: "handshake", label: "نوع البيع", value: "بيع كامل" },
                ].map(({ icon, label, value }) => (
                  <div
                    key={label}
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: 12,
                      padding: 16,
                      border: "1px solid #dee4de",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#eaefea",
                        borderRadius: 10,
                        padding: 10,
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ color: "#00694c" }}
                      >
                        {icon}
                      </span>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                          color: "#3d4943",
                        }}
                      >
                        {label}
                      </p>
                      <p
                        style={{ fontSize: 15, fontWeight: 500, marginTop: 2 }}
                      >
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Documents */}
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  padding: 24,
                  border: "1px solid #dee4de",
                  marginBottom: 24,
                }}
              >
                <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
                  الوثائق القانونية
                </h2>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {[
                    { name: "عقد الملكية", type: "PDF" },
                    { name: "شهادة المساحة", type: "PDF" },
                    { name: "تقرير الجودة", type: "PDF" },
                  ].map((doc) => (
                    <div
                      key={doc.name}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: 12,
                        backgroundColor: "#f5fbf5",
                        borderRadius: 8,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{ color: "#00694c" }}
                        >
                          description
                        </span>
                        <span style={{ fontSize: 14, fontWeight: 500 }}>
                          {doc.name}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            color: "#3d4943",
                            backgroundColor: "#dee4de",
                            padding: "2px 6px",
                            borderRadius: 4,
                          }}
                        >
                          {doc.type}
                        </span>
                      </div>
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#00694c",
                        }}
                      >
                        <span className="material-symbols-outlined">
                          download
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Contact & Actions */}
            <div>
              {/* Owner Card */}
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  padding: 24,
                  border: "1px solid #dee4de",
                  marginBottom: 24,
                  position: "sticky",
                  top: 96,
                }}
              >
                <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>
                  معلومات المالك
                </h2>

                {/* Owner Info */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    marginBottom: 24,
                  }}
                >
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIpJ26ccWiJRRknA1UdQljcilWAALZTZLDA-NVf8TyKqtowxzLEgqG8KpvcxZS1k3_d6CjouY_FIzFlhr7qt2v_lah1KTPU2xJ8wvpB66WdWJgkS23fyJ3orbaUkiW7KN3fqVHXHiyzNZvGQP14frwntT2PMbEADG9QCSW2GgtosTXLd59aicLLYhal650VN4fgeTfF2P9ObhSmT-tqOrTJaecvZDjZWxL8WfAGtCQkN0PFRcIVRzOzfATIufiLPhufqADhEfhOA"
                    alt="Owner"
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 600 }}>
                      كريم بنعلي
                    </h3>
                    <p style={{ fontSize: 12, color: "#3d4943", marginTop: 2 }}>
                      فلاح معتمد
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        marginTop: 4,
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 14, color: "#fdad4e" }}
                      >
                        star
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 500 }}>
                        4.8 (24 تقييم)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div style={{ marginBottom: 24 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 12,
                      fontSize: 14,
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ color: "#00694c" }}
                    >
                      phone
                    </span>
                    <span>06 12 34 56 78</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      fontSize: 14,
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ color: "#00694c" }}
                    >
                      email
                    </span>
                    <span>karim.benali@ArdMarket.ma</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  <button
                    style={{
                      backgroundColor: "#00694c",
                      color: "#fff",
                      padding: "14px",
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    <span className="material-symbols-outlined">chat</span>
                    تواصل مع المالك
                  </button>
                  <button
                    style={{
                      backgroundColor: "#fff",
                      color: "#00694c",
                      padding: "14px",
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      border: "1px solid #00694c",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    <span className="material-symbols-outlined">schedule</span>
                    طلب زيارة ميدانية
                  </button>
                  <button
                    style={{
                      backgroundColor: "#fff",
                      color: "#3d4943",
                      padding: "14px",
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 500,
                      border: "1px solid #dee4de",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    <span className="material-symbols-outlined">
                      bookmark_border
                    </span>
                    حفظ للماوعد
                  </button>
                </div>

                {/* Divider */}
                <div
                  style={{ margin: "24px 0", borderTop: "1px solid #dee4de" }}
                />

                {/* Similar Properties */}
                <div>
                  <h3
                    style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}
                  >
                    عقارات مشابهة
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    {[
                      {
                        name: "فيرم الحوامض",
                        location: "سوس",
                        price: "1,890,000 درهم",
                      },
                      {
                        name: "أراضي الغرب",
                        location: "الغرب",
                        price: "3,200,000 درهم",
                      },
                    ].map((item) => (
                      <div
                        key={item.name}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: 12,
                          backgroundColor: "#f5fbf5",
                          borderRadius: 8,
                          cursor: "pointer",
                        }}
                      >
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 600 }}>
                            {item.name}
                          </p>
                          <p style={{ fontSize: 12, color: "#3d4943" }}>
                            {item.location}
                          </p>
                        </div>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#00694c",
                          }}
                        >
                          {item.price}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
