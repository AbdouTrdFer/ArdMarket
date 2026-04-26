import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const C = {
  primary: "#1D9E75",
  primaryDark: "#00694c",
  bg: "#f5fbf5",
  text: "#171d1a",
  tg: "#0088cc",
  tgBg: "#e7f6ff",
  user: "#dcf8c6",
  bot: "#ffffff",
};

// Conversation darija réelle (prise de Firestore: collection sessions / history)
const CONVERSATION = [
  {
    role: "assistant",
    text: "السلام عليكم! أنا بوت ArdMarket. واش بغيتي تكري ولا تبيع شي أرض؟",
    note: "Salutation + intent recognition (lease/sale)",
  },
  {
    role: "user",
    text: "بغيت نكري الأرض ديالي",
    voice: true,
    note: "Vocal darija — NLP extrait deal_type=lease",
  },
  {
    role: "assistant",
    text: "فين موقع الأرض ديالك؟",
    note: "Demande la localisation",
  },
  {
    role: "user",
    text: "انظروا الى ارضي في وجدة المساحة هي 500 متر ونريد ان نقرئها ب 1000 درهم في الشهر",
    voice: true,
    note: "Vocal — bot extrait: location=Oujda, surface=500m², rent=1000 DH/mois",
  },
  {
    role: "assistant",
    text: "كيفاش غادي تقرا الأرض ديالك، بالشهر ولا بالسنة؟",
    note: "Confirme la durée",
  },
  {
    role: "user",
    text: "3 شهور",
    voice: false,
    note: "Durée extraite: 3 months",
  },
  {
    role: "assistant",
    text: "شكرا! دابا أرسل ليا التصاوير ديال الأرض و الوثائق ديال الملكية.",
    note: "Demande images + titre foncier",
  },
  {
    role: "user",
    photo: true,
    text: "[Photo terrain envoyée]",
    note: "Image téléversée → Telegram CDN",
  },
  {
    role: "user",
    photo: true,
    text: "[Titre foncier envoyé]",
    note: "Doc téléversé → IA Vision extrait parcel_number, owner_name",
  },
  {
    role: "assistant",
    text: "تماااام! تمت إضافة ارضك في ArdMarket — المستثمرين دابا غايقدرو يشوفوها.",
    note: "Confirmation finale → push vers ArdMarket",
  },
];

export default function DemoTelegram() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [synced, setSynced] = useState(null);
  const [syncStatus, setSyncStatus] = useState(null);

  // Auto-progress through conversation
  useEffect(() => {
    if (step < CONVERSATION.length) {
      const t = setTimeout(() => setStep(step + 1), 1400);
      return () => clearTimeout(t);
    }
  }, [step]);

  async function runSync() {
    setSyncStatus("syncing");
    try {
      const res = await api.triggerSync();
      setSynced(res);
      setSyncStatus("done");
    } catch (e) {
      setSyncStatus("error");
      console.error(e);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, padding: "32px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "white", border: `1px solid ${C.primaryDark}33`,
              padding: "8px 14px", borderRadius: 8, cursor: "pointer",
              color: C.text, fontWeight: 600,
            }}
          >
            ← Retour
          </button>
          <h1 style={{ margin: 0, color: C.primaryDark, fontSize: 24 }}>
            Démo : Bot Telegram Darija → ArdMarket (live)
          </h1>
          <div style={{ width: 100 }} />
        </div>

        <div style={{ background: "white", borderRadius: 16, padding: 20, marginBottom: 24, border: `1px solid ${C.primaryDark}22` }}>
          <p style={{ margin: 0, color: "#444", lineHeight: 1.6 }}>
            <strong style={{ color: C.primary }}>Innovation cœur d'ArdMarket :</strong> le paysan parle <strong>darija</strong> sur Telegram.
            Le bot (NLP + Vision IA développé par notre équipe) <strong>comprend la voix</strong>, extrait les infos
            (localisation, surface, prix, durée), demande les documents légaux, lit le titre foncier par OCR,
            et publie l'annonce sur ArdMarket — <strong>sans que le paysan touche un site web</strong>.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* COL 1 : Telegram chat */}
          <div style={{ background: "white", borderRadius: 16, overflow: "hidden", border: `1px solid #e0e0e0` }}>
            <div style={{ background: C.tg, color: "white", padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", color: C.tg, fontWeight: 700 }}>
                🤖
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>ArdMarket Bot</div>
                <div style={{ fontSize: 12, opacity: 0.85 }}>en ligne • parle darija</div>
              </div>
              <span style={{ fontSize: 12, opacity: 0.85 }}>Telegram</span>
            </div>
            <div style={{ padding: 16, height: 580, overflowY: "auto", background: C.tgBg }}>
              {CONVERSATION.slice(0, step).map((m, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      maxWidth: "78%",
                      background: m.role === "user" ? C.user : C.bot,
                      padding: "10px 14px",
                      borderRadius: 14,
                      borderBottomRightRadius: m.role === "user" ? 2 : 14,
                      borderBottomLeftRadius: m.role === "assistant" ? 2 : 14,
                      boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                      fontSize: 15,
                      direction: "rtl",
                      textAlign: "right",
                    }}
                  >
                    {m.voice && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, color: C.tg, direction: "ltr" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>graphic_eq</span>
                        <span style={{ fontSize: 12, fontWeight: 600 }}>Message vocal · 0:0{(i % 7) + 2}</span>
                      </div>
                    )}
                    {m.photo && (
                      <div style={{ marginBottom: 8, direction: "ltr" }}>
                        <div style={{
                          width: 220, height: 140, borderRadius: 8,
                          background: `url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400) center/cover, #ddd`,
                          marginBottom: 4,
                        }} />
                      </div>
                    )}
                    <div>{m.text}</div>
                  </div>
                </div>
              ))}
              {step < CONVERSATION.length && (
                <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 10 }}>
                  <div style={{ background: C.bot, padding: "10px 14px", borderRadius: 14, fontSize: 14, color: "#999" }}>
                    ●●● écrit...
                  </div>
                </div>
              )}
            </div>
            <div style={{ padding: 12, borderTop: "1px solid #e0e0e0", display: "flex", gap: 8, alignItems: "center", background: "#fafafa" }}>
              <span className="material-symbols-outlined" style={{ color: "#999" }}>attach_file</span>
              <input disabled placeholder="Tapez un message..." style={{ flex: 1, border: "none", outline: "none", padding: 8, background: "transparent" }} />
              <span className="material-symbols-outlined" style={{ color: C.tg }}>mic</span>
            </div>
          </div>

          {/* COL 2 : NLP + Firebase + Sync */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "white", borderRadius: 16, padding: 20, border: `1px solid ${C.primaryDark}22` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span className="material-symbols-outlined" style={{ color: C.primary }}>psychology</span>
                <h3 style={{ margin: 0, fontSize: 16 }}>NLP Darija — données extraites en temps réel</h3>
              </div>
              <div style={{ fontSize: 14, color: "#444", lineHeight: 1.8 }}>
                <KV label="deal_type" value={step >= 2 ? "lease" : "—"} />
                <KV label="location" value={step >= 4 ? "وجدة → Oujda" : "—"} />
                <KV label="surface_m2" value={step >= 4 ? "500" : "—"} />
                <KV label="monthly_rent_mad" value={step >= 4 ? "1000" : "—"} />
                <KV label="duration_months" value={step >= 6 ? "3" : "—"} />
                <KV label="images" value={step >= 8 ? "1 image" : "—"} />
                <KV label="documents" value={step >= 9 ? "Titre foncier (OCR)" : "—"} />
                {step >= 9 && (
                  <div style={{ background: "#f0fff4", borderRadius: 8, padding: 10, marginTop: 8, fontSize: 13 }}>
                    ✓ <strong>parcel_number</strong>: 12345/12<br />
                    ✓ <strong>owner_name</strong>: EL HARRAKI MOHAMED<br />
                    ✓ <strong>location_officielle</strong>: Commune de Sidi Bernoussi
                  </div>
                )}
              </div>
            </div>

            <div style={{ background: "white", borderRadius: 16, padding: 20, border: `1px solid ${C.primaryDark}22` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span className="material-symbols-outlined" style={{ color: "#ff9500" }}>cloud_sync</span>
                <h3 style={{ margin: 0, fontSize: 16 }}>Firebase Firestore</h3>
                {step >= 10 && <span style={{ marginLeft: "auto", color: C.primary, fontSize: 12, fontWeight: 600 }}>● document écrit</span>}
              </div>
              <pre style={{ fontSize: 12, background: "#fafafa", padding: 12, borderRadius: 8, overflow: "auto", margin: 0, color: "#333", lineHeight: 1.4 }}>
{`collection: listings
└── ${step >= 10 ? "S4W02jcAjauADikNQ1dN" : "..."}
    ├── deal_type: "lease"
    ├── location: "وجدة"
    ├── surface_m2: 500
    ├── monthly_rent_mad: 1000
    ├── duration_months: 3
    ├── owner_telegram_id: "6084223798"
    ├── images: [Telegram CDN URLs]
    ├── documents:
    │   └── extracted_data:
    │       ├── parcel_number: "12345/12"
    │       └── owner_name: "EL HARRAKI MOHAMED"
    └── status: "pending_verification"`}
              </pre>
            </div>

            <div style={{ background: C.primary, color: "white", borderRadius: 16, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span className="material-symbols-outlined">sync_alt</span>
                <h3 style={{ margin: 0, fontSize: 16 }}>Sync ArdMarket (auto 5min ou manuel)</h3>
              </div>
              <button
                onClick={runSync}
                disabled={step < CONVERSATION.length || syncStatus === "syncing"}
                style={{
                  width: "100%", padding: 12, borderRadius: 8,
                  background: "white", color: C.primaryDark, fontWeight: 700,
                  border: "none", cursor: step >= CONVERSATION.length ? "pointer" : "not-allowed",
                  opacity: step >= CONVERSATION.length ? 1 : 0.6,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                <span className="material-symbols-outlined">cloud_download</span>
                {syncStatus === "syncing" ? "Synchronisation..." :
                 syncStatus === "done" ? `✓ ${synced?.created ?? 0} créées · ${synced?.updated ?? 0} mises à jour` :
                 "Lancer la sync Firebase → ArdMarket"}
              </button>
              {synced && synced.lands && synced.lands.length > 0 && (
                <div style={{ marginTop: 12, fontSize: 13 }}>
                  <strong>Annonces synchronisées :</strong>
                  <ul style={{ margin: "6px 0 0 0", paddingLeft: 18 }}>
                    {synced.lands.slice(0, 3).map((l) => (
                      <li key={l.local_id}>
                        <button
                          onClick={() => navigate(`/terrain/${l.local_id}`)}
                          style={{ background: "none", border: "none", color: "white", textDecoration: "underline", cursor: "pointer", padding: 0 }}
                        >
                          {l.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ background: "white", borderRadius: 16, padding: 20, marginTop: 24, border: `1px solid ${C.primaryDark}22` }}>
          <h3 style={{ margin: "0 0 8px 0", color: C.primaryDark }}>Pourquoi c'est le différenciateur d'ArdMarket</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            <Bullet icon="record_voice_over" title="Inclusion ESS" body="Les paysans parlent darija, pas besoin de site web ni d'app — un message Telegram suffit." />
            <Bullet icon="auto_awesome" title="IA Vision" body="L'OCR lit automatiquement le titre foncier : numéro de parcelle, propriétaire, localisation officielle." />
            <Bullet icon="sync" title="Live Sync" body="Toutes les 5 minutes, ArdMarket récupère les nouvelles annonces. Aucune intervention humaine." />
          </div>
        </div>
      </div>
    </div>
  );
}

function KV({ label, value }) {
  const empty = value === "—" || !value;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px dashed #eee" }}>
      <code style={{ color: "#999", fontSize: 12 }}>{label}</code>
      <strong style={{ color: empty ? "#bbb" : C.primaryDark, fontSize: 13 }}>{value}</strong>
    </div>
  );
}

function Bullet({ icon, title, body }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <span className="material-symbols-outlined" style={{ color: C.primary, fontSize: 20 }}>{icon}</span>
        <strong>{title}</strong>
      </div>
      <p style={{ margin: 0, fontSize: 13, color: "#555", lineHeight: 1.5 }}>{body}</p>
    </div>
  );
}
