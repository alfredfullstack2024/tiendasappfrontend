// Crear esta estructura de carpetas en tu proyecto React:

// src/
//   components/
//     MenuPrincipal.js
//     RegistroTienda.js
//     CategoriaView.js
//     DetallesTienda.js
//   App.js
//   App.css
//   index.js

// El archivo index.js principal de React debería ser:

import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Y también necesitarás crear un archivo .env en la raíz del proyecto frontend:
// REACT_APP_API_URL=http://localhost:5000
