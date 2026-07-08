import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Store, Eye, MapPin, Search } from "lucide-react";
import axios from "axios";

const CategoriaView = () => {
  const { categoria } = useParams();
  const [tiendas, setTiendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const cargarTiendas = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(
        `https://tiendasappbackend.onrender.com/api/tiendas/categoria/${encodeURIComponent(categoria)}`
      );

      if (Array.isArray(response.data)) {
        setTiendas(response.data);
      } else {
        setError("La respuesta del servidor no es válida.");
      }
    } catch (err) {
      console.error("Error cargando tiendas:", err);
      setError("Error cargando las tiendas. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }, [categoria]);

  useEffect(() => {
    cargarTiendas();
  }, [cargarTiendas]);

  const iconoCategoria = (cat) => {
    const iconos = {
      "Agricultura y Campo": "🌾", "Almacenes y Supermercados": "🛒", Automotriz: "🚗",
      Cafeterías: "☕", Clínicas: "🏥", "Comidas y Restaurantes": "🍽️", Consultorías: "📊",
      "Educación y Capacitación": "🎓", Electrodomésticos: "📺", Ferreterías: "🛠️",
      Floristerías: "💐", Gimnasios: "🏋️", "Hoteles y Alojamiento": "🏨", Inmobiliarias: "🏠",
      "Joyería y Accesorios": "💍", Jurídico: "⚖️", "Laboratorios Clínicos": "🧪",
      Mascotas: "🐶", Odontología: "🦷", Ópticas: "👓", "Papelería y Librerías": "📚",
      Pastelerías: "🎂", Pizzerías: "🍕", "Ropa de Hombres": "👔", "Ropa de Mujeres": "👗",
      "Ropa de Niños": "👶", "Ropa Deportiva": "👟", "Salones de Belleza": "💅",
      SPA: "🧘", Seguridad: "🛡️", "Tecnología y Desarrollo": "💻", "Tiendas Deportivas": "🏆",
      "Talleres de Mecánica": "🔧", Veterinarias: "🦴", Vidrierías: "🪟",
    };
    return iconos[cat] || "🏪";
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

  if (loading) return <div className="loading-container"><div className="loading-spinner"></div><p>Cargando tiendas...</p></div>;

  return (
    <div className="categoria-view">
      <div className="categoria-header">
        <div className="categoria-header-content">
          <Link to="/" className="back-button"><ArrowLeft size={20} /> Volver al menú</Link>
          <div className="categoria-title"><span>{iconoCategoria(categoria)}</span> {categoria}</div>
        </div>
        <p className="categoria-subtitle">
          {tiendas.length} {tiendas.length === 1 ? "negocio encontrado" : "negocios encontrados"} en esta categoría
        </p>
      </div>

      <div className="buscador-container">
        <div className="buscador-input">
          <Search size={20} color="#6b7280" />
          <input type="text" placeholder="Buscar negocios en esta categoría..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        </div>
      </div>

      <div className="container">
        {error ? (
          <div className="empty-state"><h3>Error</h3><p>{error}</p><button onClick={cargarTiendas} className="btn btn-primary">Intentar nuevamente</button></div>
        ) : tiendasFiltradas.length === 0 ? (
          <div className="empty-state"><Store size={64} color="#94a3b8" /><h3>No hay coincidencias</h3><p>Intenta con otro término</p></div>
        ) : (
          <div className="tiendas-grid">
            {tiendasFiltradas.map((tienda) => (
              <div key={tienda._id} className="tienda-card">
                <div className="tienda-card-image">
                  {tienda.fotos && tienda.fotos.length > 0 ? (
                    <img src={tienda.fotos[0].url} alt={tienda.nombreEstablecimiento} />
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", fontSize: "3rem" }}>{iconoCategoria(tienda.categoria)}</div>
                  )}
                </div>
                <div className="tienda-card-content">
                  <h3 className="tienda-nombre">{tienda.nombreEstablecimiento}</h3>
                  <p style={{ color: "#2563eb", fontWeight: "600", marginBottom: "8px" }}>{iconoCategoria(tienda.categoria)} {tienda.categoria}</p>
                  <p className="tienda-descripcion">{truncarTexto(tienda.descripcionVentas)}</p>
                  <div className="tienda-info-adicional"><div className="info-item"><MapPin size={16} /><span><strong>{tienda.ciudad}</strong><br />{truncarTexto(tienda.direccion, 50)}</span></div></div>
                  <div className="tienda-acciones"><Link to={`/tienda/${tienda._id}`} className="btn-tienda btn-primary"><Eye size={16} /> Ver detalles</Link></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {tiendas.length > 0 && (
        <div style={{ background: "#f8fafc", padding: "3rem 0", textAlign: "center" }}>
          <div className="container">
            <h3 style={{ marginBottom: "1rem", color: "#374151" }}>¿Tienes un negocio de {categoria}?</h3>
            <Link to="/registro" className="btn-registro">Registra tu negocio gratis</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriaView;
