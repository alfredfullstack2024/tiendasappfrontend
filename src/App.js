import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import "./App.css";

// Componentes
import MenuPrincipal from "./components/MenuPrincipal";
import RegistroTienda from "./components/RegistroTienda";
import CategoriaView from "./components/CategoriaView";
import DetallesTienda from "./components/DetallesTienda";
import Desaparecidos from "./components/Desaparecidos";
import Salvos from "./components/Salvos";

function App() {
  return (
    <Router>
      <div className="App">

        <Routes>

          {/* Página principal */}
          <Route
            path="/"
            element={<MenuPrincipal />}
          />

          {/* Registro de situación */}
          <Route
            path="/registro"
            element={<RegistroTienda />}
          />

          {/* Personas no localizadas */}
          <Route
            path="/desaparecidos"
            element={<Desaparecidos />}
          />

          {/* Personas a salvo */}
          <Route
            path="/salvos"
            element={<Salvos />}
          />

          {/* Categorías */}
          <Route
            path="/categoria/:categoria"
            element={<CategoriaView />}
          />

          {/* Detalle */}
          <Route
            path="/tienda/:id"
            element={<DetallesTienda />}
          />

        </Routes>

      </div>
    </Router>
  );
}

export default App;
