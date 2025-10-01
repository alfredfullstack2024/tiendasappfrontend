// src/components/DetallesTienda.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MapPin, Phone, Globe, Clock, Star } from "lucide-react";

const DetallesTienda = () => {
  const { id } = useParams();
  const [tienda, setTienda] = useState(null);
  const [resenas, setResenas] = useState([]);
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE = "https://tiendasappbackend.onrender.com/api/tiendas";

  // Cargar tienda y reseñas
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tiendaResp = await axios.get(`${API_BASE}/${id}`);
        setTienda(tiendaResp.data);

        const resenasResp = await axios.get(`${API_BASE}/${id}/resenas`);
        setResenas(resenasResp.data);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };
    fetchData();
  }, [id]);

  // Enviar reseña
  const enviarResena = async (e) => {
    e.preventDefault();
    if (!calificacion || !comentario.trim()) {
      alert("Por favor ingrese una calificación y un comentario.");
      return;
    }
    setLoading(true);
    try {
      const nuevaResena = { calificacion, comentario };
      await axios.post(`${API_BASE}/${id}/resenas`, nuevaResena);

      setResenas([...resenas, nuevaResena]);
      setCalificacion(0);
      setComentario("");
    } catch (error) {
      console.error("Error enviando reseña:", error);
      alert("No se pudo enviar la reseña. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!tienda) return <p>Cargando detalles...</p>;

  return (
    <div className="container mt-4">
      <h2>{tienda.nombre}</h2>

      <div className="mb-3">
        <p><MapPin size={16}/> {tienda.direccion}</p>
        <p><Phone size={16}/> {tienda.telefono}</p>

        {tienda.whatsapp && (
          <p>
            <a
              href={`https://wa.me/${tienda.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp: {tienda.whatsapp}
            </a>
          </p>
        )}

        {tienda.sitioWeb && (
          <p>
            <Globe size={16}/> <a href={tienda.sitioWeb} target="_blank" rel="noopener noreferrer">{tienda.sitioWeb}</a>
          </p>
        )}

        <p><Clock size={16}/> Registrado: {new Date(tienda.createdAt).toLocaleDateString()}</p>
        <p>{tienda.descripcion}</p>
      </div>

      {/* GPS si tiene coordenadas */}
      {tienda.ubicacion?.lat && tienda.ubicacion?.lng && (
        <div className="mb-3">
          <iframe
            title="Mapa"
            width="100%"
            height="300"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps/embed/v1/view?key=SU_API_KEY_AQUI&center=${tienda.ubicacion.lat},${tienda.ubicacion.lng}&zoom=15`}
          />
        </div>
      )}

      {/* Opiniones */}
      <div className="mt-4">
        <h4>Opiniones de clientes</h4>
        <form onSubmit={enviarResena}>
          <div className="mb-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <Star
                key={num}
                size={24}
                color={num <= calificacion ? "gold" : "gray"}
                onClick={() => setCalificacion(num)}
                style={{ cursor: "pointer" }}
              />
            ))}
            <span className="ms-2">{calificacion} / 5</span>
          </div>

          <textarea
            className="form-control mb-2"
            placeholder="Escriba su comentario..."
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Enviando..." : "Enviar reseña"}
          </button>
        </form>

        <div className="mt-4">
          {resenas.length === 0 ? (
            <p>No hay reseñas aún. Sé el primero en opinar.</p>
          ) : (
            resenas.map((r, index) => (
              <div key={index} className="border p-2 mb-2 rounded">
                <div className="d-flex align-items-center">
                  {[...Array(r.calificacion)].map((_, i) => (
                    <Star key={i} size={16} color="gold" />
                  ))}
                </div>
                <p className="mb-0">{r.comentario}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DetallesTienda;
