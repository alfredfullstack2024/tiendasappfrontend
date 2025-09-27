import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Store, Plus, Search } from "lucide-react";
import axios from "axios";

const MenuPrincipal = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const response = await axios.get("/api/categorias");
      setCategorias(response.data);
      console.log("Categorías cargadas:", response.data);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    } finally {
      setLoading(false);
    }
  };

  const iconoCategoria = (categoria) => {
    const iconos = {
      "Comidas y Restaurantes": "🍽️",
      "Tecnología y Desarrollo": "💻",
      Gimnasios: "🏋️",
      "Papelería y Librerías": "📚",
      Mascotas: "🐱",
      Odontología: "🦷",
      Ópticas: "👓",
      Pastelerías: "🎂",
      Pizzerías: "🍕",
      "Ropa de Niños": "👶",
      "Ropa de Mujeres": "👗",
      "Ropa Deportiva": "👟",
      "Salones de Belleza": "💅",
      SPA: "🧘",
      "Talleres de Mecánica": "🚗",
      "Tiendas Deportivas": "🏆",
      Veterinarias: "🦴",
      Vidrierías: "🪟",
    };
    return iconos[categoria] || "🏪";
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando categorías...</p>
      </div>
    );
  }

  return (
    <div className="menu-principal">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <Store size={32} />
            <h1>TiendasApp</h1>
          </div>
          {/* Logo de tu negocio */}
          <div className="logo-negocio">
            <img
              src="https://raw.githubusercontent.com/alfredfullstack2024/alfredfullstack.com/main/images/logo%20fin%2017-05-2016.png"
              alt="Alfred FullStack Logo"
              className="logo-imagen"
              onError={(e) => {
                console.error("Error cargando logo:", e);
                e.target.style.display = "none";
              }}
            />
          </div>
          <p className="subtitle">Directorio Local de Negocios</p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h2>Encuentra los mejores negocios locales</h2>
          <p>Descubre tiendas, restaurantes y servicios cerca de ti</p>

          <div className="hero-actions">
            <Link to="/registro" className="btn-registro">
              <Plus size={20} />
              Registra tu tienda aquí
            </Link>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="categorias-section">
        <div className="container">
          <h2 className="section-title">
            <Search size={24} />
            Explora por categorías
          </h2>

          <div className="categorias-grid">
            {categorias.map((categoria, index) => (
              <Link
                key={index}
                to={`/categoria/${encodeURIComponent(categoria)}`}
                className="categoria-card"
              >
                <div className="categoria-icon">
                  {iconoCategoria(categoria)}
                </div>
                <h3>{categoria}</h3>
                <div className="categoria-arrow">→</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="logo">
              <Store size={24} />
              <span>TiendasApp</span>
            </div>
            <p>Conectando negocios locales con su comunidad</p>
          </div>

          <div className="footer-section">
            <h4>Para Negocios</h4>
            <ul>
              <li>
                <Link to="/registro">Registrar mi negocio</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Ayuda</h4>
            <ul>
              <li>
                <a href="#contacto">Contacto</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 TiendasApp. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default MenuPrincipal;
