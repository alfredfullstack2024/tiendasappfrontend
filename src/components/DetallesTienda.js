// src/components/DetallesTienda.js
import React, { useEffect, useState } from "react";
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

/**
 * DetallesTienda.js
 * - Maneja fallback en la API (con o sin /api)
 * - Banner responsive (contain en móvil, cover en escritorio)
 * - Manejo de errores mejorado
 * - Botones de acción: WhatsApp, Maps, Web, Compartir
 */

const DetallesTienda = () => {
  const { id } = useParams();
  const [tienda, setTienda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imagenActiva, setImagenActiva] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // API base configurable
  const API_BASE =
    (process.env.REACT_APP_API_URL &&
      process.env.REACT_APP_API_URL.replace(/\/$/, "")) ||
    "https://tiendasappbackend.onrender.com/api";

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    cargarTienda();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const cargarTienda = async () => {
    try {
      setLoading(true);
      setError("");

      // Primer intento
      let resp;
      try {
        resp = await axios.get(`${API_BASE}/tiendas/${id}`);
      } catch (err1) {
        console.warn("Fallo ruta con /api, probando sin /api...");
        resp = await axios.get(
          `https://tiendasappbackend.onrender.com/tiendas/${id}`
        );
      }

      if (resp.data && resp.data._id) {
        setTienda(resp.data);
        setImagenActiva(0);
      } else {
        setError("Tienda no encontrada");
      }
    } catch (err) {
      console.error(
        "Error cargando tienda:",
        err?.response?.data || err.message || err
      );
      setError("Error cargando la tienda. Ver consola para más detalles.");
    } finally {
      setLoading(false);
    }
  };

  const abrirWhatsApp = () => {
    if (!tienda?.telefonoWhatsapp)
      return alert("Número de WhatsApp no disponible");
    const telefono = tienda.telefonoWhatsapp.replace(/\D/g, "");
    const mensaje = `Hola! Estoy contactando desde TiendasApp. Me interesa ${tienda.nombreEstablecimiento}`;
    window.open(
      `https://wa.me/57${telefono}?text=${encodeURIComponent(mensaje)}`,
      "_blank"
    );
  };

  const abrirMaps = () => {
    const direccion = encodeURIComponent(tienda?.direccion || "");
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${direccion}`,
      "_blank"
    );
  };

  const abrirPaginaWeb = () => {
    if (!tienda?.paginaWeb) return;
    let url = tienda.paginaWeb;
    if (!url.startsWith("http://") && !url.startsWith("https://"))
      url = "https://" + url;
    window.open(url, "_blank");
  };

  const compartirTienda = async () => {
    const url = window.location.href;
    const titulo = `${tienda?.nombreEstablecimiento || "Tienda"} - TiendasApp`;
    const texto = `Descubre ${
      tienda?.nombreEstablecimiento || "esta tienda"
    } en TiendasApp`;
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
      <div style={{ padding: 40, textAlign: "center" }}>
        <div className="loading-spinner" />
        <p>Cargando información...</p>
      </div>
    );
  }

  if (error || !tienda) {
    return (
      <div className="detalle-tienda">
        <div className="detalle-header">
          <div className="container" style={{ padding: "1rem" }}>
            <Link
              to="/"
              className="back-button"
              style={{ textDecoration: "none", color: "#111" }}
            >
              <ArrowLeft size={20} />
              Volver al menú
            </Link>
          </div>
        </div>
        <div className="container" style={{ padding: "1rem" }}>
          <div className="empty-state">
            <h3>{error || "Tienda no encontrada"}</h3>
            <Link to="/" className="btn btn-primary">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Banner dinámico
  const bannerStyle =
    tienda.fotos && tienda.fotos.length > 0
      ? {
          backgroundImage: `url(${tienda.fotos[imagenActiva].url})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: isMobile ? "contain" : "cover",
          width: "100%",
          height: isMobile ? 220 : 320,
          borderRadius: 12,
        }
      : {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: isMobile ? 220 : 320,
          fontSize: isMobile ? "3rem" : "4rem",
          background: "linear-gradient(135deg,#f3f4f6 0%,#e5e7eb 100%)",
          borderRadius: 12,
        };

  return (
    <div
      className="detalle-tienda"
      style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}
    >
      <div className="detalle-header" style={{ marginBottom: 12 }}>
        <div
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <Link
            to={`/categoria/${encodeURIComponent(tienda.categoria)}`}
            className="back-button"
            style={{ textDecoration: "none", color: "#111" }}
          >
            <ArrowLeft size={20} />
            Volver a {tienda.categoria}
          </Link>
          <div>
            <button
              onClick={compartirTienda}
              className="back-button"
              style={{ marginRight: 8 }}
            >
              <Share2 size={20} />
              Compartir
            </button>
          </div>
        </div>
      </div>

      <div
        className="detalle-content"
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
          overflow: "hidden",
        }}
      >
        {/* Banner */}
        <div style={{ padding: isMobile ? 12 : 20 }}>
          <div
            style={bannerStyle}
            aria-hidden={!(tienda.fotos && tienda.fotos.length > 0)}
          />
          {/* Thumbnails */}
          {tienda.fotos && tienda.fotos.length > 1 && (
            <div
              style={{
                marginTop: 12,
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              {tienda.fotos.map((foto, index) => (
                <button
                  key={index}
                  onClick={() => setImagenActiva(index)}
                  style={{
                    border:
                      index === imagenActiva
                        ? "2px solid #2563eb"
                        : "1px solid #e6e6e6",
                    padding: 0,
                    borderRadius: 8,
                    overflow: "hidden",
                    background: "#fff",
                    width: 68,
                    height: 68,
                    cursor: "pointer",
                  }}
                  aria-label={`Ver imagen ${index + 1}`}
                >
                  <img
                    src={foto.url}
                    alt={`${tienda.nombreEstablecimiento} ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: "1.25rem 1.25rem 2rem 1.25rem" }}>
          <h1 style={{ margin: 0, fontSize: 28 }}>
            {tienda.nombreEstablecimiento}
          </h1>
          <p style={{ margin: "6px 0 14px 0", color: "#6b7280" }}>
            {tienda.categoria}
          </p>

          <p style={{ color: "#374151", lineHeight: 1.5, marginBottom: 18 }}>
            {tienda.descripcionVentas}
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 18,
            }}
          >
            <button
              onClick={abrirWhatsApp}
              className="accion-btn whatsapp-btn"
              style={accionBtnStyle("#10b981")}
            >
              <MessageCircle size={18} style={{ marginRight: 8 }} />
              Contactar por WhatsApp
            </button>

            <button
              onClick={abrirMaps}
              className="accion-btn maps-btn"
              style={accionBtnStyle("#3b82f6")}
            >
              <MapPin size={18} style={{ marginRight: 8 }} />
              Ver ubicación en Maps
            </button>

            {tienda.paginaWeb && (
              <button
                onClick={abrirPaginaWeb}
                className="accion-btn web-btn"
                style={accionBtnStyle("#6b7280")}
              >
                <Globe size={18} style={{ marginRight: 8 }} />
                Visitar página web
              </button>
            )}
          </div>

          {/* Datos de contacto */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
            <div style={infoItemStyle()}>
              <MapPin size={18} style={{ marginRight: 10 }} />
              <div>
                <strong>Dirección:</strong>
                <br />
                {tienda.direccion}
              </div>
            </div>

            <div style={infoItemStyle()}>
              <Phone size={18} style={{ marginRight: 10 }} />
              <div>
                <strong>WhatsApp:</strong>
                <br />
                {tienda.telefonoWhatsapp}
              </div>
            </div>

            {tienda.paginaWeb && (
              <div style={infoItemStyle()}>
                <Globe size={18} style={{ marginRight: 10 }} />
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
                      size={12}
                      style={{ marginLeft: 8, verticalAlign: "middle" }}
                    />
                  </a>
                </div>
              </div>
            )}

            {tienda.redesSociales && (
              <div style={infoItemStyle()}>
                <Share2 size={18} style={{ marginRight: 10 }} />
                <div>
                  <strong>Redes sociales:</strong>
                  <br />
                  {tienda.redesSociales}
                </div>
              </div>
            )}

            <div style={infoItemStyle()}>
              <Clock size={18} style={{ marginRight: 10 }} />
              <div>
                <strong>Registrado:</strong>
                <br />
                {tienda.fechaCreacion
                  ? new Date(tienda.fechaCreacion).toLocaleDateString("es-CO", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : tienda.createdAt
                  ? new Date(tienda.createdAt).toLocaleDateString()
                  : "No disponible"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Registro */}
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
          <Link
            to="/registro"
            className="btn-registro"
            style={{
              padding: "0.6rem 1rem",
              background: "#6b21a8",
              color: "#fff",
              borderRadius: 8,
              textDecoration: "none",
            }}
          >
            Registrar mi negocio
          </Link>
        </div>
      </div>
    </div>
  );
};

const accionBtnStyle = (bg) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 16px",
  borderRadius: 8,
  border: "none",
  color: "#fff",
  cursor: "pointer",
  background: bg,
  boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
});

const infoItemStyle = () => ({
  display: "flex",
  alignItems: "flex-start",
  gap: 12,
  background: "#fff",
  padding: 10,
  borderRadius: 8,
  border: "1px solid #f1f5f9",
});

export default DetallesTienda;
