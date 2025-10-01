// src/components/DetallesTienda.js
import React, { useState, useEffect } from "react";
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
  Star,
} from "lucide-react";
import axios from "axios";

const DetallesTienda = () => {
  const { id } = useParams();
  const [tienda, setTienda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imagenActiva, setImagenActiva] = useState(0);

  // Nueva lógica para reseñas
  const [resenas, setResenas] = useState([]);
  const [nuevaReseña, setNuevaReseña] = useState({ calificacion: 0, comentario: "" });
  const [enviandoReseña, setEnviandoReseña] = useState(false);

  useEffect(() => {
    cargarTienda();
    cargarResenas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const cargarTienda = async () => {
    try {
      setLoading(true);
      // 🔹 URL absoluta del backend
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
  };

  // Cargar reseñas desde backend (asegúrate de tener esta ruta en el backend)
  const cargarResenas = async () => {
    try {
      const response = await axios.get(
        `https://tiendasappbackend.onrender.com/api/tiendas/${id}/resenas`
      );
      if (Array.isArray(response.data)) {
        setResenas(response.data);
      }
    } catch (err) {
      console.error("Error cargando reseñas:", err);
    }
  };

  const enviarReseña = async (e) => {
    e.preventDefault();
    if (!nuevaReseña.calificacion || nuevaReseña.calificacion < 1) {
      alert("Debe seleccionar una calificación mínima de 1 estrella");
      return;
    }
    try {
      setEnviandoReseña(true);
      await axios.post(
        `https://tiendasappbackend.onrender.com/api/tiendas/${id}/resenas`,
        nuevaReseña
      );
      setNuevaReseña({ calificacion: 0, comentario: "" });
      cargarResenas();
    } catch (err) {
      console.error("Error enviando reseña:", err);
      alert("No se pudo enviar la reseña. Intenta nuevamente.");
    } finally {
      setEnviandoReseña(false);
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

  const abrirWhatsApp = () => {
    const telefono = tienda.telefonoWhatsapp.replace(/\D/g, "");
    const mensaje = `Hola! Estás siendo contactado por TIENDASAPP. Me interesa conocer más sobre ${tienda.nombreEstablecimiento}.`;
    window.open(
      `https://wa.me/57${telefono}?text=${encodeURIComponent(mensaje)}`,
      "_blank"
    );
  };

  const abrirMaps = () => {
    const direccion = encodeURIComponent(tienda.direccion);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${direccion}`,
      "_blank"
    );
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
    const texto = `Descubre ${tienda.nombreEstablecimiento} en TiendasApp`;

    if (navigator.share) {
      try {
        await navigator.share({ title: titulo, text: texto, url });
      } catch (err) {
        console.log("Error compartiendo:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert("Enlace copiado al portapapeles");
      } catch (err) {
        console.log("Error copiando al portapapeles:", err);
      }
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
            <Link to="/" className="back-button">
              <ArrowLeft size={20} />
              Volver al menú
            </Link>
          </div>
        </div>
        <div className="container">
          <div className="empty-state">
            <h3>{error}</h3>
            <Link to="/" className="btn btn-primary">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // cálculo simple de promedio (por si quiere mostrarse)
  const promedio = resenas.length
    ? (
        resenas.reduce((acc, r) => acc + (r.calificacion ? Number(r.calificacion) : 0), 0) /
        resenas.length
      ).toFixed(1)
    : null;

  return (
    <div className="detalle-tienda">
      <div className="detalle-header">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Link
              to={`/categoria/${encodeURIComponent(tienda.categoria)}`}
              className="back-button"
            >
              <ArrowLeft size={20} />
              Volver a {tienda.categoria}
            </Link>
            <button onClick={compartirTienda} className="back-button">
              <Share2 size={20} />
              Compartir
            </button>
          </div>
        </div>
      </div>

      <div className="detalle-content">
        <div className="detalle-card">
          <div className="detalle-imagenes">
            {tienda.fotos && tienda.fotos.length > 0 ? (
              <>
                <img
                  src={tienda.fotos[imagenActiva].url}
                  alt={tienda.nombreEstablecimiento}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:4rem;background:linear-gradient(135deg,#f3f4f6 0%,#e5e7eb 100%);">${iconoCategoria(
                      tienda.categoria
                    )}</div>`;
                  }}
                />
                {tienda.fotos.length > 1 && (
                  <div className="imagen-thumbnails">
                    {tienda.fotos.map((foto, index) => (
                      <button
                        key={index}
                        onClick={() => setImagenActiva(index)}
                        className={`thumbnail ${index === imagenActiva ? "active" : ""}`}
                      >
                        <img
                          src={foto.url}
                          alt={`${tienda.nombreEstablecimiento} ${index + 1}`}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div style={{ fontSize: "4rem" }}>
                {iconoCategoria(tienda.categoria)}
              </div>
            )}
          </div>

          <div className="detalle-info">
            <h1 className="detalle-titulo">{tienda.nombreEstablecimiento}</h1>
            <p className="detalle-categoria">{tienda.categoria}</p>

            {/* Mostrar promedio si hay reseñas */}
            {promedio && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <div style={{ display: "flex" }}>
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} size={16} style={{ color: s <= Math.round(promedio) ? "#facc15" : "#d1d5db", marginRight: 2 }} />
                  ))}
                </div>
                <small style={{ color: "#6b7280" }}>{promedio} · {resenas.length} {resenas.length === 1 ? "reseña" : "resenas"}</small>
              </div>
            )}

            <p className="detalle-descripcion">{tienda.descripcionVentas}</p>

            <div className="detalle-acciones">
              <button onClick={abrirWhatsApp} className="accion-btn whatsapp-btn">
                <MessageCircle size={20} />
                Contactar por WhatsApp
              </button>

              <button onClick={abrirMaps} className="accion-btn maps-btn">
                <MapPin size={20} />
                Ver ubicación en Maps
              </button>

              {tienda.paginaWeb && (
                <button onClick={abrirPaginaWeb} className="accion-btn web-btn">
                  <Globe size={20} />
                  Visitar página web
                </button>
              )}
            </div>

            <div className="detalle-info-adicional">
              <div className="info-item">
                <MapPin size={20} />
                <div>
                  <strong>Dirección:</strong>
                  <br />
                  {tienda.direccion}
                </div>
              </div>

              <div className="info-item">
                <Phone size={20} />
                <div>
                  <strong>WhatsApp:</strong>
                  <br />
                  {tienda.telefonoWhatsapp}
                </div>
              </div>

              {tienda.paginaWeb && (
                <div className="info-item">
                  <Globe size={20} />
                  <div>
                    <strong>Sitio web:</strong>
                    <br />
                    <a
                      href={
                        tienda.paginaWeb.startsWith("http")
                          ? tienda.paginaWeb
                          : `https://${tienda.paginaWeb}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#3b82f6", textDecoration: "none" }}
                    >
                      {tienda.paginaWeb}
                      <ExternalLink size={14} style={{ marginLeft: "0.25rem", display: "inline" }} />
                    </a>
                  </div>
                </div>
              )}

              {tienda.redesSociales && (
                <div className="info-item">
                  <Share2 size={20} />
                  <div>
                    <strong>Redes sociales:</strong>
                    <br />
                    {tienda.redesSociales}
                  </div>
                </div>
              )}

              <div className="info-item">
                <Clock size={20} />
                <div>
                  <strong>Registrado:</strong>
                  <br />
                  {new Date(tienda.fechaCreacion).toLocaleDateString("es-CO", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === SECCIÓN DE RESEÑAS Y CALIFICACIONES === */}
      <div style={{ padding: "2rem 0" }} className="container">
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ marginBottom: "0.5rem" }}>Opiniones de clientes</h2>
          <p style={{ color: "#6b7280", marginTop: 0 }}>
            Deje su calificación y comentario si ha visitado este negocio.
          </p>

          <form onSubmit={enviarReseña} className="reseña-form" style={{ marginTop: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              {[1, 2, 3, 4, 5].map((estrella) => (
                <button
                  type="button"
                  key={estrella}
                  onClick={() => setNuevaReseña((prev) => ({ ...prev, calificacion: estrella }))}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                  aria-label={`${estrella} estrellas`}
                >
                  <Star
                    size={22}
                    style={{
                      color: estrella <= nuevaReseña.calificacion ? "#facc15" : "#d1d5db",
                    }}
                  />
                </button>
              ))}
              <small style={{ color: "#6b7280" }}>
                {nuevaReseña.calificacion ? `${nuevaReseña.calificacion} / 5` : "Seleccione una calificación"}
              </small>
            </div>

            <textarea
              placeholder="Escribe tu comentario (opcional)"
              value={nuevaReseña.comentario}
              onChange={(e) => setNuevaReseña((prev) => ({ ...prev, comentario: e.target.value }))}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #e5e7eb", minHeight: 96 }}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.75rem" }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={enviandoReseña}
                style={{ padding: "0.5rem 1rem" }}
              >
                {enviandoReseña ? "Enviando..." : "Enviar reseña"}
              </button>
            </div>
          </form>

          <hr style={{ margin: "1.5rem 0", borderColor: "#eef2f7" }} />

          <div className="resenas-list">
            {resenas.length === 0 ? (
              <p style={{ color: "#6b7280" }}>No hay resenas aún. Sé el primero en opinar.</p>
            ) : (
              resenas.map((r, index) => (
                <div key={index} style={{ padding: "1rem 0", borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ display: "flex" }}>
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} size={16} style={{ color: s <= (r.calificacion ? Number(r.calificacion) : 0) ? "#facc15" : "#e6eaf0", marginRight: 2 }} />
                        ))}
                      </div>
                      <strong style={{ fontSize: 14 }}>{r.nombre || "Cliente"}</strong>
                    </div>
                    <small style={{ color: "#94a3b8" }}>{r.fecha ? new Date(r.fecha).toLocaleDateString("es-CO") : ""}</small>
                  </div>
                  <p style={{ margin: 0, color: "#374151" }}>{r.comentario || "Sin comentario"}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          background: "#f8fafc",
          padding: "3rem 0",
          textAlign: "center",
          marginTop: "2rem",
        }}
      >
        <div className="container">
          <h3 style={{ marginBottom: "1rem", color: "#374151" }}>
            ¿Tienes un negocio como este?
          </h3>
          <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
            Registra tu negocio gratis y conecta con más clientes
          </p>
          <Link to="/registro" className="btn-registro">
            Registrar mi negocio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DetallesTienda;

