import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Store, Eye, MapPin, Search } from "lucide-react";
import axios from "axios";

const CategoriaView = () => {
  const { categoria } = useParams();
  const [tiendas, setTiendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState(""); // 🔹 Nuevo estado

  useEffect(() => {
    cargarTiendas();
  }, [categoria]);

  const cargarTiendas = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://tiendasappbackend.onrender.com/api/tiendas/categoria/${encodeURIComponent(
          categoria
        )}`
      );

      if (Array.isArray(response.data)) {
        setTiendas(response.data);
      } else {
        console.error("Respuesta inesperada:", response.data);
        setError("La respuesta del servidor no es válida.");
      }
    } catch (err) {
      console.error("Error cargando tiendas:", err);
      setError("Error cargando las tiendas. Intenta nuevamente.");
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

  const truncarTexto = (texto, limite = 100) =>
    texto.length <= limite ? texto : texto.substring(0, limite) + "...";

  // 🔹 Filtro de búsqueda en tiempo real
  const tiendasFiltradas = tiendas.filter((tienda) => {
    const termino = busqueda.toLowerCase();
    return (
      tienda.nombreEstablecimiento?.toLowerCase().includes(termino) ||
      tienda.descripcionVentas?.toLowerCase().includes(termino)
    );
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando tiendas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="categoria-view">
        <div className="categoria-header">
          <div className="categoria-header-content">
            <Link to="/" className="back-button">
              <ArrowLeft size={20} />
              Volver al menú
            </Link>
            <div className="categoria-title">
              <span>{iconoCategoria(categoria)}</span>
              {categoria}
            </div>
          </div>
        </div>
        <div className="container">
          <div className="empty-state">
            <h3>Error cargando las tiendas</h3>
            <p>{error}</p>
            <button onClick={cargarTiendas} className="btn btn-primary">
              Intentar nuevamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="categoria-view">
      <div className="categoria-header">
        <div className="categoria-header-content">
          <Link to="/" className="back-button">
            <ArrowLeft size={20} />
            Volver al menú
          </Link>
          <div className="categoria-title">
            <span>{iconoCategoria(categoria)}</span>
            {categoria}
          </div>
          <p className="categoria-subtitle">
            {tiendas.length}{" "}
            {tiendas.length === 1 ? "negocio encontrado" : "negocios encontrados"}
          </p>
        </div>
      </div>

      {/* 🔹 Input de búsqueda */}
      <div className="buscador-container">
        <div className="buscador">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar negocios en esta categoría..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      <div className="container">
        {tiendasFiltradas.length === 0 ? (
          <div className="empty-state">
            <Store size={64} color="#94a3b8" />
            <h3>No hay coincidencias</h3>
            <p>Intenta con otro término de búsqueda</p>
          </div>
        ) : (
          <div className="tiendas-grid">
            {tiendasFiltradas.map((tienda) => (
              <div key={tienda._id} className="tienda-card">
                <div className="tienda-card-image">
                  {tienda.fotos && tienda.fotos.length > 0 ? (
                    <img
                      src={tienda.fotos[0].url}
                      alt={tienda.nombreEstablecimiento}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:3rem;">${iconoCategoria(
                          categoria
                        )}</div>`;
                      }}
                    />
                  ) : (
                    <span>{iconoCategoria(categoria)}</span>
                  )}
                </div>

                <div className="tienda-card-content">
                  <h3 className="tienda-nombre">
                    {tienda.nombreEstablecimiento}
                  </h3>
                  <p className="tienda-descripcion">
                    {truncarTexto(tienda.descripcionVentas)}
                  </p>

                  <div className="tienda-info-adicional">
                    <div className="info-item">
                      <MapPin size={16} />
                      <span>{truncarTexto(tienda.direccion, 50)}</span>
                    </div>
                  </div>

                  <div className="tienda-acciones">
                    <Link
                      to={`/tienda/${tienda._id}`}
                      className="btn-tienda btn-primary"
                    >
                      <Eye size={16} />
                      Ver detalles
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {tiendas.length > 0 && (
        <div
          style={{
            background: "#f8fafc",
            padding: "3rem 0",
            textAlign: "center",
          }}
        >
          <div className="container">
            <h3 style={{ marginBottom: "1rem", color: "#374151" }}>
              ¿Tienes un negocio en {categoria}?
            </h3>
            <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
              Únete a nuestra comunidad de negocios locales
            </p>
            <Link to="/registro" className="btn-registro">
              Registra tu negocio gratis
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriaView;
