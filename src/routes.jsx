import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import LandingPage from "./screens/landing";
import Connexion from "./screens/connexion";
import Inscription from "./screens/inscription";
import DashboardAgriculteur from "./screens/dashboard_agriculteur";
import DashboardInvestisseur from "./screens/dashboard_investisseur";
import DetailTerrain from "./screens/detail_terrain";
import PublierTerrain from "./screens/publier_terrain";
import Profil from "./screens/profil";
import Marketplace from "./screens/marketplace";
import Notaires from "./screens/notaires";
import NotaireDetail from "./screens/notaire_detail";
import ConnexionDarija from "./screens/connexionDarija";
import InscriptionDarija from "./screens/inscriptionDarija";
import DashboardAgriculteurDarija from "./screens/dashboard_agriculteurDarija";
import DashboardInvestisseurDarija from "./screens/dashboard_investisseurDarija";
import DetailTerrainDarija from "./screens/detail_terrainDarija";
import LandingPageDarija from "./screens/landingDarija";
import AdminSync from "./screens/admin_sync";
import DemoTelegram from "./screens/demo_telegram";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <LandingPage /> },

      // Auth
      { path: "/login", element: <Navigate to="/connexion" replace /> },
      { path: "/connexion", element: <Connexion /> },
      { path: "/connexion-darija", element: <ConnexionDarija /> },
      { path: "/inscription", element: <Inscription /> },
      { path: "/inscription-darija", element: <InscriptionDarija /> },

      // Dashboards
      { path: "/dashboard-agriculteur", element: <DashboardAgriculteur /> },
      { path: "/dashboard-investisseur", element: <DashboardInvestisseur /> },
      {
        path: "/dashboard-agriculteur-darija",
        element: <DashboardAgriculteurDarija />,
      },
      {
        path: "/dashboard-investisseur-darija",
        element: <DashboardInvestisseurDarija />,
      },

      // Terres
      { path: "/terrain/:id", element: <DetailTerrain /> },
      { path: "/terrains/:id", element: <DetailTerrain /> },
      { path: "/terrain-darija/:id", element: <DetailTerrainDarija /> },
      { path: "/publier", element: <PublierTerrain /> },
      { path: "/publier-terrain", element: <PublierTerrain /> },

      // Profil
      { path: "/profil", element: <Profil /> },
      { path: "/mon-compte", element: <Profil /> },

      // Marketplace ads & Notaires
      { path: "/marketplace", element: <Marketplace /> },
      { path: "/fournisseurs", element: <Marketplace /> },
      { path: "/notaires", element: <Notaires /> },
      { path: "/notaire/:id", element: <NotaireDetail /> },

      // Landing Darija
      { path: "/landing-darija", element: <LandingPageDarija /> },

      // Admin / sync Telegram bot (Firebase)
      { path: "/admin/sync", element: <AdminSync /> },
      { path: "/demo/telegram", element: <DemoTelegram /> },
    ],
  },
]);

export default routes;
