// src/components/DetallesTienda.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { MapPin, Phone, Globe, Calendar, ArrowLeft, MessageCircle } from "lucide-react";

const DetallesTienda = () => {
  const { id } = useParams();
  const [tienda, setTienda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTienda = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/tiendas/${id}`
        );
        setTienda(response.data);
      } catch (err) {
        setError("Error cargando los detalles de la tienda");
      } finally {
        setLoading(false);
      }
    };
    fetchTienda();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Cargando...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!tienda) return <p className="text-center mt-10">No se encontró la tienda</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Botón volver */}
      <div className="mb-4">
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:underline"
        >
          <ArrowLeft className="mr-2" size={18} />
          Volver al inicio
        </Link>
      </div>

      {/* Encabezado */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {tienda.nombre}
        </h1>
        <p className="text-gray-600">{tienda.descripcion}</p>
      </div>

      {/* Información */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Información de contacto
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center">
              <MapPin className="mr-3 text-gray-500" size={20} />
              {tienda.direccion}
            </li>
            <li className="flex items-center">
              <Phone className="mr-3 text-gray-500" size={20} />
              {tienda.telefono}
            </li>
            {tienda.whatsapp && (
              <li className="flex items-center">
                <MessageCircle className="mr-3 text-green-500" size={20} />
                <a
                  href={`https://wa.me/${tienda.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline"
                >
                  {tienda.whatsapp}
                </a>
              </li>
            )}
            {tienda.sitioWeb && (
              <li className="flex items-center">
                <Globe className="mr-3 text-gray-500" size={20} />
                <a
                  href={tienda.sitioWeb}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {tienda.sitioWeb}
                </a>
              </li>
            )}
            <li className="flex items-center">
              <Calendar className="mr-3 text-gray-500" size={20} />
              Registrado:{" "}
              {tienda.createdAt
                ? new Date(tienda.createdAt).toLocaleDateString()
                : "No disponible"}
            </li>
          </ul>
        </div>

        {/* Mapa */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Ubicación
          </h2>
          {tienda.lat && tienda.lng ? (
            <iframe
              title="Mapa de ubicación"
              src={`https://www.google.com/maps?q=${tienda.lat},${tienda.lng}&hl=es;&output=embed`}
              width="100%"
              height="300"
              allowFullScreen=""
              loading="lazy"
              className="rounded-lg"
            ></iframe>
          ) : (
            <p className="text-gray-500">Ubicación no disponible</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetallesTienda;
