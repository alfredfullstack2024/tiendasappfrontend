import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Store, Eye, MapPin, Search } from "lucide-react";
import axios from "axios";

const CategoriaView = () => {
  const { categoria } = useParams();
  const [tiendas, setTiendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");

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
        setError("La respuesta del servidor no es válida.");
      }
    } catch (err) {
      setError("Error cargando las tiendas. Intenta nuevamente.");
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
    return iconos[categoria] || "🏪";
  };

  const truncarTexto = (texto, limite = 100) =>
    texto?.length <= limite ? texto : texto?.substring(0, limite) + "...";

  const tiendasFiltradas = tiendas.filter((tienda) => {
    const termino = busqueda.toLowerCase();
    return (
      tienda.nombreEstablecimiento?.toLowerCase().includes(termino) ||
      tienda.descripcionVentas?.toLowerCase().includes(termino) ||
      tienda.direccion?.toLowerCase().includes(termino) ||
      tienda.ciudad?.toLowerCase().includes(termino)
    );
  });

  if (loading) return <div className="loading-container"><p>Cargando...</p></div>;

  return (
    <div className="categoria-view">
      <div className="categoria-header">
        <Link to="/" className="back-button"><ArrowLeft size={20} /> Volver</Link>
        <div className="categoria-title"><span>{iconoCategoria(categoria)}</span> {categoria}</div>
      </div>

      <div className="buscador-container">
        <input type="text" placeholder="Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
      </div>

      <div className="container">
        {tiendasFiltradas.length === 0 ? (
          <div className="empty-state"><p>No hay coincidencias</p></div>
        ) : (
          <div className="tiendas-grid">
            {tiendasFiltradas.map((tienda) => (
              <div key={tienda._id} className="tienda-card">
                <div className="tienda-card-image">
                  {tienda.fotos && tienda.fotos.length > 0 ? (
                    <img src={tienda.fotos[0].url} alt={tienda.nombreEstablecimiento} />
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "200px", fontSize: "3rem", backgroundColor: "#f3f4f6" }}>
                      {iconoCategoria(tienda.categoria)}
                    </div>
                  )}
                </div>
                <div className="tienda-card-content">
                  <h3>{tienda.nombreEstablecimiento}</h3>
                  <p>{iconoCategoria(tienda.categoria)} {tienda.categoria}</p>
                  <Link to={`/tienda/${tienda._id}`}>Ver detalles</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriaView;
