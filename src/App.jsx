import { Outlet, Link } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div className="app">
      {/* <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            ArdMarket
          </Link>
          <ul className="nav-menu">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Accueil
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/connexion" className="nav-link">
                Connexion
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/inscription" className="nav-link">
                Inscription
              </Link>
            </li>
          </ul>
        </div>
      </nav> */}

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
