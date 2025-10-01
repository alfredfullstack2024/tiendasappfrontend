// src/components/DetallesTienda.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";

const DetallesTienda = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tienda, setTienda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reseñas
  const [reseñas, setReseñas] = useState([]);
  const [nuevaReseña, setNuevaReseña] = useState({
    usuario: "",
    comentario: "",
    calificacion: 5,
  });

  useEffect(() => {
    const fetchTienda = async () => {
      try {
        setLoading(true);
        setError(null);

        // Siempre con /api
        const response = await axios.get(
          `https://tiendasappbackend.onrender.com/api/tiendas/${id}`
        );

        setTienda(response.data);

        // Cargar reseñas
        const resReseñas = await axios.get(
          `https://tiendasappbackend.onrender.com/api/tiendas/${id}/reviews`
        );
        setReseñas(resReseñas.data);
      } catch (err) {
        console.error("❌ Error cargando tienda:", err);
        setError("Error al cargar la tienda. Ver consola para más detalles.");
      } finally {
        setLoading(false);
      }
    };

    fetchTienda();
  }, [id]);

  const handleReseñaChange = (e) => {
    const { name, value } = e.target;
    setNuevaReseña((prev) => ({ ...prev, [name]: value }));
  };

  const handleReseñaSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `https://tiendasappbackend.onrender.com/api/tiendas/${id}/reviews`,
        nuevaReseña
      );
      setReseñas([...reseñas, response.data.reseña]);
      setNuevaReseña({ usuario: "", comentario: "", calificacion: 5 });
    } catch (err) {
      console.error("❌ Error agregando reseña:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg font-semibold text-gray-600">Cargando tienda...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg font-semibold text-red-600">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Botón volver */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft size={20} />
        <span>Volver al menú</span>
      </button>

      {/* Info de la tienda */}
      {tienda && (
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {tienda.nombreEstablecimiento}
          </h1>

          {/* Fotos */}
          {tienda.fotos && tienda.fotos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {tienda.fotos.map((foto, index) => (
                <img
                  key={index}
                  src={foto.url}
                  alt={`Foto ${index + 1}`}
                  className="rounded-lg shadow-md object-cover w-full h-56"
                />
              ))}
            </div>
          )}

          {/* Detalles */}
          <p className="text-gray-700 mb-2">
            <strong>Categoría:</strong> {tienda.categoria}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Dirección:</strong> {tienda.direccion}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>WhatsApp:</strong>{" "}
            <a
              href={`https://wa.me/${tienda.telefonoWhatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline"
            >
              {tienda.telefonoWhatsapp}
            </a>
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Descripción:</strong> {tienda.descripcionVentas}
          </p>
          {tienda.paginaWeb && (
            <p className="text-gray-700 mb-2">
              <strong>Página web:</strong>{" "}
              <a
                href={tienda.paginaWeb}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {tienda.paginaWeb}
              </a>
            </p>
          )}
          {tienda.redesSociales && (
            <p className="text-gray-700 mb-2">
              <strong>Redes sociales:</strong>{" "}
              <a
                href={tienda.redesSociales}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {tienda.redesSociales}
              </a>
            </p>
          )}
        </div>
      )}

      {/* Reseñas */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Reseñas</h2>

        {reseñas.length === 0 ? (
          <p className="text-gray-600">Aún no hay reseñas.</p>
        ) : (
          <div className="space-y-4">
            {reseñas.map((reseña, index) => (
              <div
                key={index}
                className="bg-gray-100 p-4 rounded-lg shadow-sm"
              >
                <p className="text-gray-800 font-semibold">{reseña.usuario}</p>
                <p className="text-yellow-500">⭐ {reseña.calificacion}</p>
                <p className="text-gray-700">{reseña.comentario}</p>
              </div>
            ))}
          </div>
        )}

        {/* Formulario nueva reseña */}
        <form onSubmit={handleReseñaSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            name="usuario"
            placeholder="Tu nombre"
            value={nuevaReseña.usuario}
            onChange={handleReseñaChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          />
          <textarea
            name="comentario"
            placeholder="Escribe un comentario"
            value={nuevaReseña.comentario}
            onChange={handleReseñaChange}
            className="w-full border rounded-lg px-4 py-2"
          />
          <select
            name="calificacion"
            value={nuevaReseña.calificacion}
            onChange={handleReseñaChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          >
            <option value={5}>⭐ 5 - Excelente</option>
            <option value={4}>⭐ 4 - Muy buena</option>
            <option value={3}>⭐ 3 - Aceptable</option>
            <option value={2}>⭐ 2 - Mala</option>
            <option value={1}>⭐ 1 - Muy mala</option>
          </select>
          <button
            type="submit"
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
          >
            Enviar reseña
          </button>
        </form>
      </div>
    </div>
  );
};

export default DetallesTienda;
