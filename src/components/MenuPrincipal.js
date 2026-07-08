import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, Plus, Search, Download } from 'lucide-react';
import axios from 'axios';


const MenuPrincipal = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
const navigate = useNavigate();

const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      // URL de su backend en Render
      const apiUrl = 'https://tiendasappbackend.onrender.com';
      const response = await axios.get(`${apiUrl}/api/categorias`);

      if (Array.isArray(response.data)) {
        setCategorias(response.data);
        console.log('Categorías cargadas:', response.data);
      } else {
        console.error('Respuesta no es un array:', response.data);
        setCategorias([]);
      }
    } catch (error) {
      console.error('Error cargando categorías:', error);
      // Categorías por defecto si el backend falla
     setCategorias([
  "Agricultura y Campo",
  "Almacenes y Supermercados",
  "Automotriz",
  "Cafeterías",
  "Clínicas",
  "Comidas y Restaurantes",
  "Consultorías",
  "Educación y Capacitación",
  "Electrodomésticos",
  "Ferreterías",
  "Floristerías",
  "Gimnasios",
  "Hoteles y Alojamiento",
  "Inmobiliarias",
  "Joyería y Accesorios",
  "Jurídico",
  "Laboratorios Clínicos",
  "Mascotas",
  "Odontología",
  "Ópticas",
  "Papelería y Librerías",
  "Pastelerías",
  "Pizzerías",
  "Ropa de Hombres",
  "Ropa de Mujeres",
  "Ropa de Niños",
  "Ropa Deportiva",
  "Salones de Belleza",
  "SPA",
  "Seguridad",
  "Tecnología y Desarrollo",
  "Tiendas Deportivas",
  "Talleres de Mecánica",
  "Veterinarias",
  "Vidrierías"
]);
    } finally {
      setLoading(false);
    }
  };

  const iconoCategoria = (categoria) => {
    const iconos = {
  "Agricultura y Campo": "🌾",
  "Almacenes y Supermercados": "🛒",
  Automotriz: "🚗",
  Cafeterías: "☕",
  Clínicas: "🏥",
  "Comidas y Restaurantes": "🍽️",
  Consultorías: "📊",
  "Educación y Capacitación": "🎓",
  Electrodomésticos: "📺",
  Ferreterías: "🛠️",
  Floristerías: "💐",
  Gimnasios: "🏋️",
  "Hoteles y Alojamiento": "🏨",
  Inmobiliarias: "🏠",
  "Joyería y Accesorios": "💍",
  Jurídico: "⚖️",
  "Laboratorios Clínicos": "🧪",
  Mascotas: "🐶",
  Odontología: "🦷",
  Ópticas: "👓",
  "Papelería y Librerías": "📚",
  Pastelerías: "🎂",
  Pizzerías: "🍕",
  "Ropa de Hombres": "👔",
  "Ropa de Mujeres": "👗",
  "Ropa de Niños": "👶",
  "Ropa Deportiva": "👟",
  "Salones de Belleza": "💅",
  SPA: "🧘",
  Seguridad: "🛡️",
  "Tecnología y Desarrollo": "💻",
  "Tiendas Deportivas": "🏆",
  "Talleres de Mecánica": "🔧",
  Veterinarias: "🦴",
  Vidrierías: "🪟",
};
    return iconos[categoria] || '🏪';
  };
const buscarCategoria = () => {
  if (!categoriaSeleccionada) return;

  navigate(`/categoria/${encodeURIComponent(categoriaSeleccionada)}`);
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

    <header
  style={{
    width: "100%",
    background: "#fff",
  }}
>
  <img
    src="https://raw.githubusercontent.com/alfredfullstack2024/tiendasappfrontend/main/src/superior.png"
    alt="TiendasApp"
    style={{
      width: "100%",
      height: "100%",
      objectFit: "contain",
      objectPosition: "center",
      display: "block",
    }}
  />
</header>
      <section className="hero">
        <div className="hero-content">
                <div
    style={{
        background:"#eff6ff",
        padding:"15px",
        borderRadius:"12px",
        marginTop:"30px",
        textAlign:"center"
    }}
>
    <strong>📍 Ciudades disponibles:</strong>

    <br/><br/>

    Zipaquirá • Chía • Cajicá • Cota
</div>
         <h2>Encuentra los mejores negocios locales</h2>
<p>Descubre tiendas, restaurantes y servicios cerca de ti</p>

<div
  style={{
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: "25px",
    marginBottom: "25px",
  }}
>
  <select
    value={categoriaSeleccionada}
    onChange={(e) => setCategoriaSeleccionada(e.target.value)}
    style={{
      padding: "12px",
      borderRadius: "8px",
      minWidth: "320px",
      fontSize: "16px",
    }}
  >
    <option value="">Selecciona una categoría</option>

    {categorias.map((categoria) => (
      <option key={categoria} value={categoria}>
        {iconoCategoria(categoria)} {categoria}
      </option>
    ))}
  </select>

  <button
    onClick={buscarCategoria}
    style={{
      background: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: "8px",
      padding: "12px 24px",
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    Buscar
  </button>
</div>

<div
  className="hero-actions"
  style={{
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    flexWrap: "wrap",
    marginTop: "20px",
  }}
>
  <Link to="/registro" className="btn-registro">
    <Plus size={20} />
    Registra tu tienda aquí
  </Link>

  <a
    href="https://www.appcreator24.com/app4111620-h57lx9"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      background: "#16a34a",
      color: "#fff",
      textDecoration: "none",
      padding: "14px 24px",
      borderRadius: "10px",
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,.2)",
    }}
  >
    <Download size={20} />
    📲 Descarga aquí la App para Android
  </a>
</div>
    
    <p
  style={{
    marginTop: "18px",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "500",
  }}
>
  Disponible para teléfonos Android. Instálala gratis y encuentra negocios cerca de ti.
</p>
    </div>
      </section>

      <section className="categorias-section">
        <div className="container">
          <h2 className="section-title">
            <Search size={24} />
            Explora por categorías
          </h2>
          <div className="categorias-grid">
            {Array.isArray(categorias) && categorias.length > 0 ? (
              categorias.map((categoria, index) => (
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
              ))
            ) : (
              <div className="empty-state">
                <h3>No se pudieron cargar las categorías</h3>
                <p>Intenta recargar la página</p>
              </div>
            )}
          </div>
        </div>
      </section>

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
              <li><Link to="/registro">Registrar mi negocio</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Ayuda</h4>
            <ul>
              <li><a href="#contacto">Contacto</a></li>
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
