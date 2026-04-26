// LandingPage.jsx - landing professionnelle avec sections complètes et CTA fonctionnels
import { useNavigate } from "react-router-dom";

const C = {
  primary: "#1D9E75",
  primaryDark: "#00694c",
  bg: "#f5fbf5",
  text: "#171d1a",
  textSoft: "#3d4943",
  border: "#dee4de",
  accent: "#f8f1e7",
};

const HERO_IMG =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&h=900&fit=crop";
const FARMER_IMG =
  "https://images.unsplash.com/photo-1592982634222-ddd5e3b73b40?w=900&h=900&fit=crop";
const INVESTOR_IMG =
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&h=900&fit=crop";

const FEATURES = [
  {
    icon: "smart_toy",
    title: "Score Légal IA",
    text: "Notre IA analyse automatiquement les documents (Titre, Note de Renseignement, Plan d'Aménagement) et calcule un score légal pour rassurer les investisseurs.",
    color: "#1D9E75",
  },
  {
    icon: "record_voice_over",
    title: "Bot WhatsApp Darija",
    text: "Les paysans peuvent publier leur terre en envoyant un simple vocal en Darija. L'IA transcrit, extrait les infos et crée la fiche automatiquement.",
    color: "#28a745",
  },
  {
    icon: "lock_open",
    title: "Contacts à crédits",
    text: "Modèle freemium : les contacts propriétaires sont masqués. Les investisseurs payent par crédit pour débloquer (10 cr / contact).",
    color: "#0066cc",
  },
  {
    icon: "monitoring",
    title: "Simulateur ROI",
    text: "Pour chaque terrain, simulez le rendement, le revenu annuel et le retour sur investissement avant de prendre une décision.",
    color: "#704200",
  },
  {
    icon: "place",
    title: "Localisation précise",
    text: "Carte interactive avec coordonnées GPS exactes, distance route, accès à l'eau, type de sol — tout pour évaluer un terrain à distance.",
    color: "#9b1c1c",
  },
  {
    icon: "groups",
    title: "Mode Coopérative ESS",
    text: "Co-investissement citoyen : plusieurs investisseurs peuvent se regrouper sur un même terrain. Aligné sur les valeurs de l'Économie Sociale et Solidaire.",
    color: "#6d28d9",
  },
];

const HOW = [
  {
    step: "01",
    title: "Le paysan publie sa terre",
    text: "Via le site ou un simple vocal WhatsApp en Darija. Il joint ses documents légaux.",
    icon: "agriculture",
  },
  {
    step: "02",
    title: "Validation IA + équipe",
    text: "Score légal calculé, infos extraites, terrain visible sur la marketplace.",
    icon: "fact_check",
  },
  {
    step: "03",
    title: "L'investisseur cherche & filtre",
    text: "Région, culture, surface, prix, score légal, eau. Il consulte les terrains adaptés à son projet.",
    icon: "search",
  },
  {
    step: "04",
    title: "Déblocage du contact",
    text: "Paiement par crédits (premium). L'investisseur obtient le numéro WhatsApp du paysan.",
    icon: "key",
  },
  {
    step: "05",
    title: "Mise en relation & notaire",
    text: "Contrat de location/vente. Possibilité de référer un notaire partenaire de la région.",
    icon: "handshake",
  },
];

const TESTIMONIALS = [
  {
    name: "Ahmed Mansouri",
    role: "Agriculteur, Taroudant",
    img: "https://randomuser.me/api/portraits/men/43.jpg",
    text: "J'ai publié mon terrain via WhatsApp en Darija. En 3 jours j'avais 4 demandes d'investisseurs sérieux. C'est révolutionnaire pour nous, paysans.",
  },
  {
    name: "Karim Benali",
    role: "Investisseur agricole, Casablanca",
    img: "https://randomuser.me/api/portraits/men/22.jpg",
    text: "Le score légal et la simulation ROI me font gagner un temps fou. J'ai investi sur 2 oliveraies à Meknès en 1 mois.",
  },
  {
    name: "Sara Benchekroun",
    role: "Coopérative ESS, Rabat",
    img: "https://randomuser.me/api/portraits/women/45.jpg",
    text: "Le mode coopérative nous permet de regrouper 12 investisseurs sur un domaine de 65 ha. Inclusion totale.",
  },
];

const PLANS = [
  {
    name: "Free",
    price: "0",
    color: "#94a3b8",
    target: "Découverte",
    features: ["Voir les annonces", "Contacts masqués", "Filtres basiques"],
    cta: "Commencer",
  },
  {
    name: "Premium",
    price: "299",
    color: "#1D9E75",
    target: "Investisseurs sérieux",
    highlight: true,
    features: [
      "50 crédits / mois",
      "Voir contacts (10 cr / déblocage)",
      "Recommandations IA",
      "Simulateur ROI illimité",
      "Score légal détaillé",
      "Boost de 14 jours offert",
    ],
    cta: "S'abonner",
  },
  {
    name: "Enterprise",
    price: "Sur devis",
    color: "#704200",
    target: "Coopératives, banques agricoles",
    features: [
      "Crédits illimités",
      "Mode coopérative",
      "Rapports légaux PDF",
      "API + exports",
      "Support dédié",
    ],
    cta: "Nous contacter",
  },
];

const FAQS = [
  {
    q: "Comment fonctionne le bot WhatsApp Darija ?",
    a: "Le paysan envoie un vocal en Darija sur notre numéro WhatsApp. L'IA transcrit, extrait les infos clés (région, surface, eau, culture) et crée une fiche brouillon que le paysan valide.",
  },
  {
    q: "Pourquoi les contacts sont-ils masqués ?",
    a: "Pour protéger les paysans du démarchage abusif et financer la plateforme. Les investisseurs sérieux paient quelques crédits pour accéder au contact, ce qui filtre naturellement les démarches.",
  },
  {
    q: "Que recouvre le score légal ?",
    a: "Notre IA analyse les documents fournis (Titre Foncier, Moulkia, Note de Renseignement, Plan d'Aménagement) et calcule un score sur 100 indiquant la solidité juridique du terrain.",
  },
  {
    q: "Et les notaires ?",
    a: "Nous référençons des notaires partenaires par région. Optionnel mais recommandé pour sécuriser le contrat. Les notaires peuvent acheter un boost pour apparaître en priorité.",
  },
  {
    q: "Y a-t-il une commission sur les transactions ?",
    a: "Non. Nous sommes 100% freemium : abonnements + achat de crédits + ads ciblées (engrais, semences, machines). Le contrat se signe directement entre paysan et investisseur.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  const goLogin = () => navigate("/connexion");
  const goRegister = () => navigate("/inscription");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        * { font-family: 'Inter', sans-serif; box-sizing: border-box; margin: 0; padding: 0; }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-variation-settings: 'FILL' 0, 'wght' 400; }
        html, body { scroll-behavior: smooth; }
        .lp-btn-primary { background: ${C.primaryDark}; color: #fff; padding: 14px 28px; border-radius: 10px; border: none; font-weight: 700; font-size: 14px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: all .2s; box-shadow: 0 4px 14px rgba(0,105,76,.25); }
        .lp-btn-primary:hover { background: #00553d; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,105,76,.35); }
        .lp-btn-secondary { background: transparent; color: ${C.text}; padding: 14px 28px; border-radius: 10px; border: 1.5px solid ${C.border}; font-weight: 600; font-size: 14px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: all .2s; }
        .lp-btn-secondary:hover { border-color: ${C.primary}; color: ${C.primary}; }
        .feature-card { transition: transform .3s, box-shadow .3s; }
        .feature-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,.06); }
        .pricing-card.featured { transform: scale(1.04); }
        @media (max-width: 768px) {
          .hero-grid, .roles-grid, .features-grid, .testimonials-grid, .pricing-grid { grid-template-columns: 1fr !important; }
          .pricing-card.featured { transform: none; }
        }
      `}</style>
      <div style={{ backgroundColor: C.bg, color: C.text, minHeight: "100vh" }}>
        {/* HEADER */}
        <header
          style={{
            backgroundColor: "rgba(255,255,255,.9)",
            backdropFilter: "blur(10px)",
            position: "sticky",
            top: 0,
            zIndex: 50,
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              padding: "16px 32px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              onClick={() => navigate("/")}
              style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
            >
              <span className="material-symbols-outlined" style={{ color: C.primary, fontSize: 32 }}>
                landscape
              </span>
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: C.primary,
                  letterSpacing: "-.04em",
                }}
              >
                ArdMarket
              </span>
            </div>
            <nav style={{ display: "flex", gap: 24, alignItems: "center" }}>
              {[
                { label: "Comment ça marche", href: "#how" },
                { label: "Fonctionnalités", href: "#features" },
                { label: "Tarifs", href: "#pricing" },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  style={{
                    color: C.textSoft,
                    fontWeight: 500,
                    fontSize: 14,
                    textDecoration: "none",
                  }}
                >
                  {label}
                </a>
              ))}
              <span
                onClick={() => navigate("/marketplace")}
                style={{
                  color: C.textSoft,
                  fontWeight: 500,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Marketplace
              </span>
              <span
                onClick={() => navigate("/notaires")}
                style={{
                  color: C.textSoft,
                  fontWeight: 500,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Notaires
              </span>
            </nav>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="lp-btn-secondary" onClick={goLogin}>
                Connexion
              </button>
              <button className="lp-btn-primary" onClick={goRegister}>
                Inscription
              </button>
            </div>
          </div>
        </header>

        {/* HERO */}
        <section
          style={{
            position: "relative",
            padding: "80px 32px 100px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `linear-gradient(rgba(245,251,245,.85), rgba(245,251,245,.95)), url(${HERO_IMG})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 0,
            }}
          />
          <div
            className="hero-grid"
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: 1280,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr",
              gap: 48,
              alignItems: "center",
            }}
          >
            <div>
              <span
                style={{
                  display: "inline-block",
                  backgroundColor: "rgba(29,158,117,.12)",
                  color: C.primaryDark,
                  padding: "6px 14px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                  marginBottom: 16,
                  letterSpacing: ".05em",
                  textTransform: "uppercase",
                }}
              >
                🇲🇦 Oriental Hack 2026 · IA & ESS
              </span>
              <h1
                style={{
                  fontSize: 56,
                  fontWeight: 800,
                  letterSpacing: "-.03em",
                  lineHeight: 1.05,
                  marginBottom: 20,
                }}
              >
                La marketplace agricole{" "}
                <span style={{ color: C.primary }}>intelligente</span> du Maroc.
              </h1>
              <p
                style={{
                  fontSize: 19,
                  color: C.textSoft,
                  lineHeight: 1.6,
                  marginBottom: 32,
                  maxWidth: 560,
                }}
              >
                ArdMarket connecte les <strong>paysans qui veulent louer leurs terres</strong> avec
                les <strong>investisseurs agricoles</strong>. Un Airbnb des terres, propulsé par
                l'IA, le WhatsApp Darija et l'inclusion ESS.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button className="lp-btn-primary" onClick={goRegister}>
                  Commencer gratuitement
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    arrow_forward
                  </span>
                </button>
                <button
                  className="lp-btn-secondary"
                  onClick={() =>
                    document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    play_circle
                  </span>
                  Comment ça marche ?
                </button>
              </div>

              {/* Stats */}
              <div
                style={{
                  display: "flex",
                  gap: 48,
                  marginTop: 48,
                  paddingTop: 24,
                  borderTop: `1px solid ${C.border}`,
                }}
              >
                {[
                  { v: "1.2M", l: "Hectares de terres au Maroc" },
                  { v: "30%", l: "Terres sous-exploitées" },
                  { v: "2.5x", l: "ROI moyen filière agricole" },
                ].map(({ v, l }) => (
                  <div key={v}>
                    <p style={{ fontSize: 28, fontWeight: 800, color: C.primaryDark }}>{v}</p>
                    <p style={{ fontSize: 12, color: C.textSoft, fontWeight: 500 }}>{l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right card */}
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: 20,
                boxShadow: "0 30px 80px rgba(0,0,0,.08)",
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
                Aperçu d'un terrain
              </h3>
              <img
                src="https://images.unsplash.com/photo-1445264718234-a623be589d37?w=600&h=400&fit=crop"
                alt="Domaine olivier"
                style={{ width: "100%", borderRadius: 12, height: 200, objectFit: "cover" }}
              />
              <div>
                <p style={{ fontSize: 16, fontWeight: 700 }}>Domaine de l'Olivier — Meknès</p>
                <p
                  style={{
                    fontSize: 13,
                    color: C.textSoft,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                    location_on
                  </span>
                  El Hajeb, Meknès · 65 ha
                </p>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                  fontSize: 12,
                }}
              >
                <Pill icon="water_drop" label="Eau 18 L/s" />
                <Pill icon="agriculture" label="8000 oliviers" />
                <Pill icon="verified" label="Score 96/100" color={C.primary} />
                <Pill icon="star" label="Boosté" color="#9c6300" />
              </div>
              <div
                style={{
                  marginTop: 4,
                  padding: 12,
                  borderRadius: 10,
                  backgroundColor: C.bg,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <p style={{ fontSize: 11, color: C.textSoft, fontWeight: 600 }}>Loyer / an</p>
                  <p style={{ fontSize: 22, fontWeight: 800, color: C.primaryDark }}>520 000 DH</p>
                </div>
                <button className="lp-btn-primary" onClick={goRegister}>
                  Voir
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* DEUX TYPES D'UTILISATEURS */}
        <section
          style={{ backgroundColor: "#fff", padding: "80px 32px", borderTop: `1px solid ${C.border}` }}
        >
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-.02em" }}>
                Une plateforme, deux profils
              </h2>
              <p style={{ fontSize: 16, color: C.textSoft, marginTop: 12 }}>
                Que vous soyez paysan ou investisseur, ArdMarket s'adapte à votre projet.
              </p>
            </div>
            <div
              className="roles-grid"
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}
            >
              <RoleCard
                img={FARMER_IMG}
                badge="Paysan / Agriculteur"
                title="Valorisez vos terres sans complexité"
                bullets={[
                  "Publication via le site ou un vocal WhatsApp en Darija",
                  "L'IA extrait les infos de vos documents légaux",
                  "Score légal et boost pour gagner en visibilité",
                  "Recevez des offres directement, en toute transparence",
                ]}
                ctaLabel="Je suis paysan, je m'inscris"
                onClick={goRegister}
              />
              <RoleCard
                img={INVESTOR_IMG}
                badge="Investisseur / Coopérative"
                title="Trouvez le terrain idéal en quelques minutes"
                bullets={[
                  "Filtres avancés (région, culture, prix, eau, score)",
                  "Simulateur ROI sur chaque terrain",
                  "Recommandations IA personnalisées",
                  "Notaires partenaires par région",
                ]}
                ctaLabel="Je cherche un terrain"
                onClick={goRegister}
              />
            </div>
          </div>
        </section>

        {/* COMMENT ÇA MARCHE */}
        <section id="how" style={{ padding: "80px 32px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <p
                style={{
                  fontSize: 12,
                  color: C.primary,
                  fontWeight: 700,
                  letterSpacing: ".15em",
                  textTransform: "uppercase",
                }}
              >
                Comment ça marche
              </p>
              <h2 style={{ fontSize: 40, fontWeight: 800, marginTop: 8, letterSpacing: "-.02em" }}>
                De la terre à l'investissement, en 5 étapes
              </h2>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16,
              }}
            >
              {HOW.map((s) => (
                <div
                  key={s.step}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 14,
                    padding: 24,
                    border: `1px solid ${C.border}`,
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: C.primary,
                      letterSpacing: ".05em",
                    }}
                  >
                    {s.step}
                  </span>
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: 32,
                      color: C.primaryDark,
                      backgroundColor: "rgba(29,158,117,.08)",
                      padding: 10,
                      borderRadius: 10,
                      display: "block",
                      width: "fit-content",
                      marginTop: 10,
                    }}
                  >
                    {s.icon}
                  </span>
                  <h4 style={{ fontSize: 17, fontWeight: 700, marginTop: 16 }}>{s.title}</h4>
                  <p style={{ fontSize: 13, color: C.textSoft, marginTop: 8, lineHeight: 1.5 }}>
                    {s.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section
          id="features"
          style={{ backgroundColor: "#fff", padding: "80px 32px", borderTop: `1px solid ${C.border}` }}
        >
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <p
                style={{
                  fontSize: 12,
                  color: C.primary,
                  fontWeight: 700,
                  letterSpacing: ".15em",
                  textTransform: "uppercase",
                }}
              >
                Fonctionnalités
              </p>
              <h2 style={{ fontSize: 40, fontWeight: 800, marginTop: 8, letterSpacing: "-.02em" }}>
                L'innovation au service de l'agriculture marocaine
              </h2>
            </div>
            <div
              className="features-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: 20,
              }}
            >
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="feature-card"
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 14,
                    padding: 28,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: 28,
                      color: f.color,
                      backgroundColor: `${f.color}15`,
                      padding: 12,
                      borderRadius: 12,
                      display: "block",
                      width: "fit-content",
                    }}
                  >
                    {f.icon}
                  </span>
                  <h4 style={{ fontSize: 18, fontWeight: 700, marginTop: 16 }}>{f.title}</h4>
                  <p style={{ fontSize: 14, color: C.textSoft, marginTop: 8, lineHeight: 1.6 }}>
                    {f.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TÉMOIGNAGES */}
        <section style={{ padding: "80px 32px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <p
                style={{
                  fontSize: 12,
                  color: C.primary,
                  fontWeight: 700,
                  letterSpacing: ".15em",
                  textTransform: "uppercase",
                }}
              >
                Témoignages
              </p>
              <h2 style={{ fontSize: 40, fontWeight: 800, marginTop: 8, letterSpacing: "-.02em" }}>
                Ils valorisent ou investissent avec ArdMarket
              </h2>
            </div>
            <div
              className="testimonials-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 20,
              }}
            >
              {TESTIMONIALS.map((t) => (
                <div
                  key={t.name}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 14,
                    padding: 24,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ color: C.primary, fontSize: 24 }}
                  >
                    format_quote
                  </span>
                  <p
                    style={{
                      fontSize: 14,
                      color: C.text,
                      lineHeight: 1.6,
                      marginTop: 8,
                      marginBottom: 16,
                    }}
                  >
                    "{t.text}"
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <img
                      src={t.img}
                      alt={t.name}
                      style={{ width: 44, height: 44, borderRadius: "50%" }}
                    />
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700 }}>{t.name}</p>
                      <p style={{ fontSize: 12, color: C.textSoft }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section
          id="pricing"
          style={{ backgroundColor: "#fff", padding: "80px 32px", borderTop: `1px solid ${C.border}` }}
        >
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <p
                style={{
                  fontSize: 12,
                  color: C.primary,
                  fontWeight: 700,
                  letterSpacing: ".15em",
                  textTransform: "uppercase",
                }}
              >
                Tarifs
              </p>
              <h2 style={{ fontSize: 40, fontWeight: 800, marginTop: 8, letterSpacing: "-.02em" }}>
                Transparent. Freemium. Aligné ESS.
              </h2>
              <p style={{ fontSize: 15, color: C.textSoft, marginTop: 12 }}>
                Publication gratuite pour les paysans. Les investisseurs ne paient que ce qu'ils
                consomment.
              </p>
            </div>
            <div
              className="pricing-grid"
              style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}
            >
              {PLANS.map((p) => (
                <div
                  key={p.name}
                  className={`pricing-card ${p.highlight ? "featured" : ""}`}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 16,
                    padding: 28,
                    border: `2px solid ${p.highlight ? p.color : C.border}`,
                    boxShadow: p.highlight ? "0 20px 60px rgba(29,158,117,.18)" : "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  <h3 style={{ fontSize: 22, fontWeight: 800, color: p.color }}>{p.name}</h3>
                  <p style={{ fontSize: 12, color: C.textSoft, fontWeight: 600 }}>{p.target}</p>
                  <div>
                    <span style={{ fontSize: 36, fontWeight: 800 }}>
                      {p.price === "Sur devis" ? p.price : `${p.price} DH`}
                    </span>
                    {p.price !== "0" && p.price !== "Sur devis" && (
                      <span style={{ fontSize: 14, color: C.textSoft }}> /mois</span>
                    )}
                  </div>
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      flex: 1,
                    }}
                  >
                    {p.features.map((f) => (
                      <li
                        key={f}
                        style={{
                          fontSize: 13,
                          color: C.text,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: 16, color: p.color }}
                        >
                          check_circle
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={p.highlight ? "lp-btn-primary" : "lp-btn-secondary"}
                    onClick={goRegister}
                  >
                    {p.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" style={{ padding: "80px 32px" }}>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <p
                style={{
                  fontSize: 12,
                  color: C.primary,
                  fontWeight: 700,
                  letterSpacing: ".15em",
                  textTransform: "uppercase",
                }}
              >
                FAQ
              </p>
              <h2 style={{ fontSize: 40, fontWeight: 800, marginTop: 8, letterSpacing: "-.02em" }}>
                Questions fréquentes
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {FAQS.map((f, i) => (
                <details
                  key={i}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 12,
                    padding: 20,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <summary
                    style={{
                      cursor: "pointer",
                      fontWeight: 700,
                      fontSize: 16,
                      listStyle: "none",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {f.q}
                    <span className="material-symbols-outlined" style={{ color: C.primary }}>
                      expand_more
                    </span>
                  </summary>
                  <p
                    style={{
                      fontSize: 14,
                      color: C.textSoft,
                      lineHeight: 1.6,
                      marginTop: 12,
                      paddingTop: 12,
                      borderTop: `1px solid ${C.border}`,
                    }}
                  >
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section
          style={{
            backgroundColor: C.primaryDark,
            padding: "80px 32px",
            color: "#fff",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-.02em" }}>
              Prêt à révolutionner l'agriculture marocaine ?
            </h2>
            <p style={{ fontSize: 17, marginTop: 16, opacity: 0.9 }}>
              Inscription gratuite. Aucune carte requise. Phygital : sensibilisation terrain dans
              les souks + technologie en ligne.
            </p>
            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
                marginTop: 32,
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={goRegister}
                style={{
                  backgroundColor: "#fff",
                  color: C.primaryDark,
                  padding: "14px 28px",
                  borderRadius: 10,
                  border: "none",
                  fontWeight: 800,
                  fontSize: 15,
                  cursor: "pointer",
                }}
              >
                Créer mon compte gratuit
              </button>
              <button
                onClick={goLogin}
                style={{
                  backgroundColor: "transparent",
                  color: "#fff",
                  padding: "14px 28px",
                  borderRadius: 10,
                  border: "1.5px solid rgba(255,255,255,.4)",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: "pointer",
                }}
              >
                J'ai déjà un compte
              </button>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer
          style={{
            backgroundColor: C.text,
            color: "#94a3b8",
            padding: "48px 32px 24px",
          }}
        >
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              gap: 32,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span
                  className="material-symbols-outlined"
                  style={{ color: C.primary, fontSize: 28 }}
                >
                  landscape
                </span>
                <span style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>ArdMarket</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.6, maxWidth: 360 }}>
                La marketplace agricole intelligente du Maroc. Aligné sur les valeurs ESS et la
                vision Génération Green 2030.
              </p>
            </div>
            <FooterCol
              title="Produit"
              links={[
                { l: "Comment ça marche", h: "#how" },
                { l: "Fonctionnalités", h: "#features" },
                { l: "Tarifs", h: "#pricing" },
                { l: "FAQ", h: "#faq" },
              ]}
            />
            <FooterCol
              title="Compte"
              links={[
                { l: "Connexion", h: "/connexion" },
                { l: "Inscription", h: "/inscription" },
                { l: "Espace agriculteur", h: "/dashboard-agriculteur" },
                { l: "Espace investisseur", h: "/dashboard-investisseur" },
              ]}
            />
            <FooterCol
              title="Hackathon"
              links={[
                { l: "Oriental Hack 2026", h: "#" },
                { l: "Thème : IA & ESS", h: "#" },
                { l: "GitHub", h: "https://github.com/AbdouTrdFer/ArdMarket" },
              ]}
            />
          </div>
          <div
            style={{
              borderTop: `1px solid #334155`,
              marginTop: 32,
              paddingTop: 24,
              display: "flex",
              justifyContent: "space-between",
              maxWidth: 1280,
              margin: "32px auto 0",
              fontSize: 12,
            }}
          >
            <span>© {new Date().getFullYear()} ArdMarket. Made for Oriental Hack 🇲🇦</span>
            <span>Économie Sociale et Solidaire · Phygital</span>
          </div>
        </footer>
      </div>
    </>
  );
}

function Pill({ icon, label, color }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "5px 10px",
        backgroundColor: C.bg,
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        color: color || C.text,
        border: `1px solid ${C.border}`,
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
        {icon}
      </span>
      {label}
    </span>
  );
}

function RoleCard({ img, badge, title, bullets, ctaLabel, onClick }) {
  return (
    <div
      style={{
        borderRadius: 18,
        overflow: "hidden",
        border: `1px solid ${C.border}`,
        backgroundColor: "#fff",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
      }}
    >
      <div
        style={{
          backgroundImage: `url(${img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: 320,
        }}
      />
      <div
        style={{
          padding: 28,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            color: C.primary,
          }}
        >
          {badge}
        </span>
        <h3 style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.25 }}>{title}</h3>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {bullets.map((b) => (
            <li
              key={b}
              style={{ fontSize: 13, color: C.textSoft, display: "flex", gap: 8, lineHeight: 1.5 }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 18, color: C.primary, flexShrink: 0 }}
              >
                check_circle
              </span>
              {b}
            </li>
          ))}
        </ul>
        <button className="lp-btn-primary" onClick={onClick} style={{ marginTop: 8 }}>
          {ctaLabel}
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 style={{ color: "#fff", fontSize: 14, marginBottom: 12, fontWeight: 700 }}>{title}</h4>
      <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        {links.map(({ l, h }) => (
          <li key={l}>
            <a
              href={h}
              style={{ color: "#94a3b8", textDecoration: "none", fontSize: 13 }}
            >
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
