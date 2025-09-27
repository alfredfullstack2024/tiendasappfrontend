import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Componentes
import MenuPrincipal from "./components/MenuPrincipal";
import RegistroTienda from "./components/RegistroTienda";
import CategoriaView from "./components/CategoriaView";
import DetallesTienda from "./components/DetallesTienda";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MenuPrincipal />} />
          <Route path="/registro" element={<RegistroTienda />} />
          <Route path="/categoria/:categoria" element={<CategoriaView />} />
          <Route path="/tienda/:id" element={<DetallesTienda />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
