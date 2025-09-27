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
} from "lucide-react";
import axios from "axios";

const DetallesTienda = () => {
  const { id } = useParams();
  const [tienda, setTienda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imagenActiva, setImagenActiva] = useState(0);

  useEffect(() => {
    cargarTienda();
  }, [id]);

  const cargarTienda = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/tiendas/${id}`);
      setTienda(response.data);
    } catch (error) {
      console.error("Error cargando tienda:", error);
      setError("Tienda no encontrada");
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

  const abrirWhatsApp = () => {
    const telefono = tienda.telefonoWhatsapp.replace(/\D/g, "");
    const mensaje = `Hola! Estás siendo contactado por TIENDASAPP. Me interesa conocer más sobre ${tienda.nombreEstablecimiento}.`;
    const url = `https://wa.me/57${telefono}?text=${encodeURIComponent(
      mensaje
    )}`;
    window.open(url, "_blank");
  };

  const abrirMaps = () => {
    const direccion = encodeURIComponent(tienda.direccion);
    const url = `https://www.google.com/maps/search/?api=1&query=${direccion}`;
    window.open(url, "_blank");
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
        await navigator.share({
          title: titulo,
          text: texto,
          url: url,
        });
      } catch (err) {
        console.log("Error compartiendo:", err);
      }
    } else {
      // Fallback: copiar URL al portapapeles
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
      {/* Header */}
      <div className="detalle-header">
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
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

      {/* Contenido principal */}
      <div className="detalle-content">
        <div className="detalle-card">
          {/* Galería de imágenes */}
          <div className="detalle-imagenes">
            {tienda.fotos && tienda.fotos.length > 0 ? (
              <>
                <img
                  src={tienda.fotos[imagenActiva].url}
                  alt={tienda.nombreEstablecimiento}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; font-size: 4rem; background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);">${iconoCategoria(
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
                        className={`thumbnail ${
                          index === imagenActiva ? "active" : ""
                        }`}
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

          {/* Información de la tienda */}
          <div className="detalle-info">
            <h1 className="detalle-titulo">{tienda.nombreEstablecimiento}</h1>
            <p className="detalle-categoria">{tienda.categoria}</p>

            <p className="detalle-descripcion">{tienda.descripcionVentas}</p>

            {/* Acciones principales */}
            <div className="detalle-acciones">
              <button
                onClick={abrirWhatsApp}
                className="accion-btn whatsapp-btn"
              >
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

            {/* Información adicional */}
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
                      <ExternalLink
                        size={14}
                        style={{ marginLeft: "0.25rem", display: "inline" }}
                      />
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

      {/* Call to action */}
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
