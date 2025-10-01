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

  // Estado para reseñas
  const [reseñas, setReseñas] = useState([]);
  const [nuevaReseña, setNuevaReseña] = useState({ calificacion: 0, comentario: "" });
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    cargarTienda();
    cargarReseñas();
  }, [id]);

  const cargarTienda = async () => {
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
  };

  const cargarReseñas = async () => {
    try {
      const response = await axios.get(
        `https://tiendasappbackend.onrender.com/api/tiendas/${id}/reseñas`
      );
      if (Array.isArray(response.data)) {
        setReseñas(response.data);
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
      setEnviando(true);
      await axios.post(
        `https://tiendasappbackend.onrender.com/api/tiendas/${id}/reseñas`,
        nuevaReseña
      );
      setNuevaReseña({ calificacion: 0, comentario: "" });
      cargarReseñas();
    } catch (err) {
      console.error("Error enviando reseña:", err);
      alert("No se pudo enviar la reseña. Intenta nuevamente.");
    } finally {
      setEnviando(false);
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

  return (
    <div className="detalle-tienda">
      {/* ... header y detalles de negocio, igual a tu código original ... */}

      <div className="detalle-content">
        {/* Tarjeta de la tienda, igual a lo que ya tenías */}
        <div className="detalle-card">
          {/* ... tu bloque de imágenes e info ... */}
        </div>
      </div>

      {/* NUEVA SECCIÓN DE RESEÑAS */}
      <div className="reseñas-section container" style={{ marginTop: "3rem" }}>
        <h2>Opiniones de clientes</h2>

        {/* Formulario */}
        <form onSubmit={enviarReseña} className="reseña-form" style={{ marginBottom: "2rem" }}>
          <div className="calificacion-input" style={{ marginBottom: "1rem" }}>
            {[1, 2, 3, 4, 5].map((estrella) => (
              <button
                type="button"
                key={estrella}
                onClick={() => setNuevaReseña((prev) => ({ ...prev, calificacion: estrella }))}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: estrella <= nuevaReseña.calificacion ? "#facc15" : "#d1d5db",
                  fontSize: "1.5rem",
                }}
              >
                <Star />
              </button>
            ))}
          </div>
          <textarea
            placeholder="Escribe tu comentario (opcional)"
            value={nuevaReseña.comentario}
            onChange={(e) => setNuevaReseña((prev) => ({ ...prev, comentario: e.target.value }))}
            style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid #ddd" }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={enviando}
            style={{ marginTop: "1rem" }}
          >
            {enviando ? "Enviando..." : "Enviar reseña"}
          </button>
        </form>

        {/* Lista de reseñas */}
        {reseñas.length === 0 ? (
          <p>No hay reseñas aún. Sé el primero en opinar.</p>
        ) : (
          <ul className="reseñas-list" style={{ listStyle: "none", padding: 0 }}>
            {reseñas.map((r, index) => (
              <li
                key={index}
                style={{
                  borderBottom: "1px solid #e5e7eb",
                  padding: "1rem 0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                  {[1, 2, 3, 4, 5].map((estrella) => (
                    <Star
                      key={estrella}
                      size={16}
                      style={{ marginRight: "2px", color: estrella <= r.calificacion ? "#facc15" : "#d1d5db" }}
                    />
                  ))}
                </div>
                <p style={{ margin: 0 }}>{r.comentario || "Sin comentario"}</p>
                <small style={{ color: "#6b7280" }}>
                  {new Date(r.fecha).toLocaleDateString("es-CO")}
                </small>
              </li>
            ))}
          </ul>
        )}
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
