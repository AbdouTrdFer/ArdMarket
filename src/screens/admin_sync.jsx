// AdminSync.jsx - Démo: synchroniser les annonces du chatbot Telegram (Firebase) vers ArdMarket
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const C = {
  primary: "#1D9E75",
  primaryDark: "#00694c",
  bg: "#f5fbf5",
  text: "#171d1a",
  textSoft: "#3d4943",
  border: "#dee4de",
};

export default function AdminSync() {
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStatus();
  }, []);

  async function fetchStatus() {
    try {
      const s = await api.syncStatus();
      setStatus(s);
    } catch (e) {
      setError(e.message || "Erreur");
    }
  }

  async function handleSync() {
    setSyncing(true);
    setError("");
    setResult(null);
    try {
      const r = await api.triggerSync();
      setResult(r);
      fetchStatus();
    } catch (e) {
      setError(e.message || "Erreur sync");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", backgroundColor: C.bg, padding: "32px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "transparent",
            border: "none",
            color: C.primaryDark,
            cursor: "pointer",
            fontSize: 14,
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            marginBottom: 16,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
          Retour
        </button>

        <header style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: C.text, margin: 0 }}>
            Synchronisation Bot Telegram
          </h1>
          <p style={{ fontSize: 16, color: C.textSoft, marginTop: 8, maxWidth: 720 }}>
            Importe les annonces des paysans soumises en darija via le chatbot Telegram (NLP +
            extraction de documents par IA) directement dans ArdMarket. Idempotent : les annonces
            déjà importées sont mises à jour, pas dupliquées.
          </p>
        </header>

        {/* Status card */}
        <section
          style={{
            backgroundColor: "#fff",
            borderRadius: 14,
            border: `1px solid ${C.border}`,
            padding: 24,
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>État Firebase</h2>
            {status && (
              <span
                style={{
                  backgroundColor: status.firebase_configured ? "#e8f5f1" : "#fee2e2",
                  color: status.firebase_configured ? C.primaryDark : "#9b1c1c",
                  padding: "4px 12px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {status.firebase_configured ? "Connecté" : "Non configuré"}
              </span>
            )}
          </div>
          {status?.last_sync && (
            <div style={{ fontSize: 14, color: C.textSoft, lineHeight: 1.7 }}>
              <div>
                <strong>Dernière synchro</strong> : {new Date(status.last_sync.finished_at).toLocaleString("fr-FR")}
              </div>
              {status.last_sync.ok ? (
                <div>
                  <span style={{ color: C.primary, fontWeight: 600 }}>{status.last_sync.created || 0} créées</span>
                  {" · "}
                  <span style={{ color: "#0369a1", fontWeight: 600 }}>{status.last_sync.updated || 0} mises à jour</span>
                  {" · "}
                  <span>{status.last_sync.fetched || 0} listings Firebase scannés</span>
                  {status.last_sync.errors?.length > 0 && (
                    <span style={{ color: "#9b1c1c" }}> · {status.last_sync.errors.length} erreurs</span>
                  )}
                </div>
              ) : (
                <div style={{ color: "#9b1c1c" }}>Erreur : {status.last_sync.error}</div>
              )}
            </div>
          )}
          {!status?.last_sync && status?.firebase_configured && (
            <p style={{ fontSize: 14, color: C.textSoft, margin: 0 }}>Aucune synchro enregistrée. Cliquez sur "Synchroniser" pour démarrer.</p>
          )}
          {!status?.firebase_configured && (
            <p style={{ fontSize: 14, color: "#9b1c1c", margin: 0 }}>
              Firebase non configuré côté serveur. Placez le service account JSON dans
              <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: 4, marginLeft: 6 }}>
                backend/secrets/firebase-service-account.json
              </code>
              {" "}puis redémarrez l'API.
            </p>
          )}
        </section>

        <button
          onClick={handleSync}
          disabled={syncing || !status?.firebase_configured}
          style={{
            backgroundColor: syncing ? "#94a3b8" : C.primary,
            color: "#fff",
            border: "none",
            padding: "14px 28px",
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 700,
            cursor: syncing ? "not-allowed" : "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            transition: "all .2s",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
            {syncing ? "sync" : "cloud_download"}
          </span>
          {syncing ? "Synchronisation en cours..." : "Synchroniser maintenant"}
        </button>

        {error && (
          <div
            style={{
              marginTop: 16,
              padding: 12,
              borderRadius: 8,
              backgroundColor: "#fee2e2",
              color: "#9b1c1c",
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        {result && (
          <section
            style={{
              marginTop: 24,
              backgroundColor: "#fff",
              borderRadius: 14,
              border: `1px solid ${C.border}`,
              padding: 24,
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 16px 0" }}>
              Résultat de la synchronisation
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
              <Stat label="Listings Firebase" value={result.fetched || 0} color={C.text} />
              <Stat label="Créées" value={result.created || 0} color={C.primary} />
              <Stat label="Mises à jour" value={result.updated || 0} color="#0369a1" />
              <Stat label="Erreurs" value={result.errors?.length || 0} color={result.errors?.length ? "#9b1c1c" : C.text} />
            </div>
            {result.lands?.length > 0 && (
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: C.textSoft, marginBottom: 8 }}>Annonces traitées</h3>
                {result.lands.map((l) => (
                  <div
                    key={l.local_id}
                    onClick={() => navigate(`/terrain/${l.local_id}`)}
                    style={{
                      padding: 14,
                      borderRadius: 10,
                      border: `1px solid ${C.border}`,
                      marginBottom: 8,
                      cursor: "pointer",
                      transition: "all .15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{l.title}</div>
                        <div style={{ fontSize: 12, color: C.textSoft, marginTop: 2 }}>
                          Région: {l.region} · Propriétaire: {l.owner_name} · {l.images_count} image(s) · {l.documents_count} doc(s)
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span
                          style={{
                            padding: "2px 8px",
                            borderRadius: 999,
                            fontSize: 11,
                            fontWeight: 700,
                            backgroundColor: l.action === "created" ? "#e8f5f1" : "#e0f2fe",
                            color: l.action === "created" ? C.primaryDark : "#0369a1",
                          }}
                        >
                          {l.action === "created" ? "Créée" : "Mise à jour"}
                        </span>
                        <span className="material-symbols-outlined" style={{ fontSize: 18, color: C.primary }}>arrow_forward</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

function Stat({ label, value, color }) {
  return (
    <div
      style={{
        padding: 16,
        backgroundColor: "#f8fafc",
        borderRadius: 10,
        border: `1px solid ${C.border}`,
      }}
    >
      <div style={{ fontSize: 11, color: C.textSoft, textTransform: "uppercase", letterSpacing: ".05em", fontWeight: 600 }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color, marginTop: 4 }}>{value}</div>
    </div>
  );
}
