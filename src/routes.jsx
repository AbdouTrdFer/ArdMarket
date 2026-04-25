import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import LandingPage from "./screens/landing";
import Connexion from "./screens/connexion";
import Inscription from "./screens/inscription";
import DashboardAgriculteur from "./screens/dashboard_agriculteur";
import DashboardInvestisseur from "./screens/dashboard_investisseur";
import DetailTerrain from "./screens/detail_terrain";
import ConnexionDarija from "./screens/connexionDarija";
import InscriptionDarija from "./screens/inscriptionDarija";
import DashboardAgriculteurDarija from "./screens/dashboard_agriculteurDarija";
import DashboardInvestisseurDarija from "./screens/dashboard_investisseurDarija";
import DetailTerrainDarija from "./screens/detail_terrainDarija";
import LandingPageDarija from "./screens/landingDarija";
const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },

      {
        path: "/connexion-darija",
        element: <ConnexionDarija />,
      },

      {
        path: "/connexion",
        element: <Connexion />,
      },
      {
        path: "/inscription",
        element: <Inscription />,
      },
      {
        path: "/inscription-darija",
        element: <InscriptionDarija />,
      },
      {
        path: "/dashboard-agriculteur",
        element: <DashboardAgriculteur />,
      },
      {
        path: "/dashboard-investisseur",
        element: <DashboardInvestisseur />,
      },
      {
        path: "/terrain/:id",
        element: <DetailTerrain />,
      },
      {
        path: "/dashboard-agriculteur-darija",
        element: <DashboardAgriculteurDarija />,
      },
      {
        path: "/dashboard-investisseur-darija",
        element: <DashboardInvestisseurDarija />,
      },

      {
        path: "/terrain-darija/:id",
        element: <DetailTerrainDarija />,
      },
      {
        path: "/landing-darija",
        element: <LandingPageDarija />,
      },
    ],
  },
]);

export default routes;
