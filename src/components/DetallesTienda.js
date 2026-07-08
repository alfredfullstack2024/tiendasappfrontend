import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MessageCircle,
  MapPin,
  Globe,
  Share2,
  Phone,
  Clock,
  ExternalLink,
  X,
} from "lucide-react";
import axios from "axios";

const DetallesTienda = () => {
  const { id } = useParams();
  const [tienda, setTienda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imagenActiva, setImagenActiva] = useState(0);
  const [imagenAmpliada, setImagenAmpliada] = useState(null);

  // 1. Corregido: Envuelta en useCallback para satisfacer a ESLint
  const cargarTienda = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://tiendasappbackend.onrender.com/api/tiendas/${id}`
      );

      if (response.data && response.data._id) {
        setTienda(response.data);
      } else {
        setError("Tienda no encontrada");
      }
    } catch (err) {
      console.error("Error cargando tienda:", err);
      setError("Tienda no encontrada");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // 2. Corregido: Dependencia completa
  useEffect(() => {
    cargarTienda();
  }, [cargarTienda]);

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

  const abrirWhatsApp = () => {
    const telefono = tienda.telefonoWhatsapp.replace(/\D/g, "");
    const mensaje = `Hola 👋\n\nTe encontré en TiendasApp.\n\nEstoy interesado en conocer más sobre ${tienda.nombreEstablecimiento}.`;
    window.open(`https://wa.me/57${telefono}?text=${encodeURIComponent(mensaje)}`, "_blank");
  };

  const abrirMaps = () => {
    const direccion = encodeURIComponent(tienda.direccion);
    window.open(`https://www.google.com/maps/search/?api=1&query=${direccion}`, "_blank");
  };

  const abrirPaginaWeb = () => {
    let url = tienda.paginaWeb;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }
    window.open(url, "_blank");
  };

  const compartirTienda = async () => {
    const url = window.location.href;
    const titulo = `${tienda.nombreEstablecimiento} - TiendasApp`;
    const texto = `Descubre ${tienda.nombreEstablecimiento} en ${tienda.ciudad} mediante TiendasApp`;

    if (navigator.share) {
      try { await navigator.share({ title: titulo, text: texto, url }); }
      catch (err) { console.log("Error compartiendo:", err); }
    } else {
      try { await navigator.clipboard.writeText(url); alert("Enlace copiado al portapapeles"); }
      catch (err) { console.log("Error al copiar:", err); }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando información...</p>
      </div>
    );
  }

  if (error || !tienda) {
    return (
      <div className="detalle-tienda">
        <div className="detalle-header">
          <div className="container">
            <Link to="/" className="back-button"><ArrowLeft size={20} /> Volver al menú</Link>
          </div>
        </div>
        <div className="container"><div className="empty-state"><h3>{error}</h3><Link to="/" className="btn btn-primary">Volver al inicio</Link></div></div>
      </div>
    );
  }

  return (
    <div className="detalle-tienda">
      <div className="detalle-header">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Link to={`/categoria/${encodeURIComponent(tienda.categoria)}`} className="back-button">
              <ArrowLeft size={20} /> Volver a {tienda.categoria}
            </Link>
            <button onClick={compartirTienda} className="back-button"><Share2 size={20} /> Compartir</button>
          </div>
        </div>
      </div>

      <div className="detalle-content">
        <div className="detalle-card">
          <div className="detalle-imagenes">
            {tienda.fotos && tienda.fotos.length > 0 ? (
              <>
                <img src={tienda.fotos[imagenActiva].url} alt={tienda.nombreEstablecimiento} style={{ cursor: "zoom-in" }} onClick={() => setImagenAmpliada(tienda.fotos[imagenActiva].url)} />
                {tienda.fotos.length > 1 && (
                  <div className="imagen-thumbnails">
                    {tienda.fotos.map((foto, index) => (
                      <button key={index} onClick={() => setImagenActiva(index)} className={`thumbnail ${index === imagenActiva ? "active" : ""}`}>
                        <img src={foto.url} alt={`Vista ${index + 1}`} />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (<div style={{ fontSize: "4rem" }}>{iconoCategoria(tienda.categoria)}</div>)}
          </div>

          {/* Modal */}
          {imagenAmpliada && (
            <div className="modal-imagen" style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 }} onClick={() => setImagenAmpliada(null)}>
              <button style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", color: "white", fontSize: "2rem", cursor: "pointer" }} onClick={() => setImagenAmpliada(null)}><X size={32} /></button>
              <img src={imagenAmpliada} alt="Ampliada" style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: "8px" }} />
            </div>
          )}

          <div className="detalle-info">
            <p style={{ color: "#6b7280", fontWeight: "600", marginTop: "8px", marginBottom: "15px" }}>📍 {tienda.ciudad}</p>
            <h3>{tienda.nombreEstablecimiento}</h3>
            <div style={{ display: "inline-block", background: "#2563eb", color: "white", padding: "6px 14px", borderRadius: "20px", fontWeight: "600", marginBottom: "15px" }}>{iconoCategoria(tienda.categoria)} {tienda.categoria}</div>
            <p className="detalle-descripcion">{tienda.descripcionVentas}</p>

            <div className="detalle-acciones">
              <button onClick={abrirWhatsApp} className="accion-btn whatsapp-btn"><MessageCircle size={20} /> Contactar por WhatsApp</button>
              <button onClick={abrirMaps} className="accion-btn maps-btn"><MapPin size={20} /> Ver ubicación en Maps</button>
              {tienda.paginaWeb && <button onClick={abrirPaginaWeb} className="accion-btn web-btn"><Globe size={20} /> Visitar página web</button>}
            </div>

            <div className="detalle-info-adicional">
              <div className="info-item"><MapPin size={20} /><div><strong>Ciudad:</strong><br />{tienda.ciudad}<br /><br /><strong>Dirección:</strong><br />{tienda.direccion}</div></div>
              <div className="info-item"><Phone size={20} /><div><strong>WhatsApp:</strong><br /><a href={`https://wa.me/57${tienda.telefonoWhatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" style={{ color: "#16a34a", textDecoration: "none", fontWeight: "600" }}>{tienda.telefonoWhatsapp}</a></div></div>
              {tienda.paginaWeb && (
                <div className="info-item"><Globe size={20} /><div><strong>Sitio web:</strong><br /><a href={tienda.paginaWeb.startsWith("http") ? tienda.paginaWeb : `https://${tienda.paginaWeb}`} target="_blank" rel="noopener noreferrer" style={{ color: "#3b82f6", textDecoration: "none" }}>{tienda.paginaWeb}<ExternalLink size={14} style={{ marginLeft: "0.25rem", display: "inline" }} /></a></div></div>
              )}
              {tienda.redesSociales && (
                <div className="info-item"><Share2 size={20} /><div><strong>Redes sociales:</strong><br />{tienda.redesSociales}</div></div>
              )}
              <div className="info-item"><Clock size={20} /><div><strong>Registrado:</strong><br />{new Date(tienda.fechaCreacion).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })}</div></div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: "#f8fafc", padding: "3rem 0", textAlign: "center", marginTop: "2rem" }}>
        <div className="container">
          <h3 style={{ marginBottom: "1rem", color: "#374151" }}>¿Tienes un negocio como este?</h3>
          <p style={{ color: "#6b7280", marginBottom: "2rem" }}>Registra tu negocio gratis y conecta con más clientes</p>
          <Link to="/registro" className="btn-registro">Registrar mi negocio</Link>
        </div>
      </div>
    </div>
  );
};

export default DetallesTienda;
