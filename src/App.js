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
import Reportes from "./components/Reportes";
import AccesoAutoridades from "./components/AccesoAutoridades";

function App() {
  return (
    <Router>
      <div className="App">

        <Routes>

          {/* INICIO */}
          <Route
            path="/"
            element={<MenuPrincipal />}
          />

          {/* REGISTRO DE SITUACIÓN */}
          <Route
            path="/registro"
            element={<RegistroTienda />}
          />

          {/* PERSONAS NO LOCALIZADAS */}
          <Route
            path="/desaparecidos"
            element={<Desaparecidos />}
          />

          {/* PERSONAS A SALVO */}
          <Route
            path="/salvos"
            element={<Salvos />}
          />

          {/* DASHBOARD / REPORTES */}
          <Route
            path="/reportes"
            element={<Reportes />}
          />

          {/* CATEGORÍAS */}
          <Route
            path="/categoria/:categoria"
            element={<CategoriaView />}
          />

          {/* DETALLE */}
          <Route
            path="/tienda/:id"
            element={<DetallesTienda />}
          />
<Route
  path="/centro-control"
  element={<AccesoAutoridades />}
/>
        </Routes>

      </div>
    </Router>
  );
}

export default App;
