// src/components/DetallesTienda.js
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const DetallesTienda = ({ tiendas }) => {
  const { id } = useParams();
  const tienda = tiendas.find((t) => t.id === parseInt(id));
  const [imagenAmpliada, setImagenAmpliada] = useState(false);

  if (!tienda) {
    return (
      <div className="p-6">
        <p className="text-center text-red-600">Tienda no encontrada</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Botón regresar */}
      <Link
        to="/"
        className="flex items-center text-orange-600 hover:underline mb-4"
      >
        <ArrowLeft className="mr-2" size={18} />
        Regresar
      </Link>

      {/* Nombre */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{tienda.nombre}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Imagen con ampliación */}
        <div className="relative">
          <img
            src={tienda.imagen}
            alt={tienda.nombre}
            className="w-full rounded-lg shadow-md cursor-pointer hover:opacity-90"
            onClick={() => setImagenAmpliada(true)}
          />
        </div>

        {/* Info */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Descripción
          </h2>
          <p className="text-gray-600 mb-4">{tienda.descripcion}</p>

          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Dirección
          </h2>
          <p className="text-gray-600 mb-4">{tienda.direccion}</p>

          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Teléfono
          </h2>
          <p className="text-gray-600">{tienda.telefono}</p>
        </div>
      </div>

      {/* Modal Imagen Ampliada */}
      {imagenAmpliada && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative">
            <button
              className="absolute top-2 right-2 bg-white text-black px-3 py-1 rounded-full shadow hover:bg-gray-200"
              onClick={() => setImagenAmpliada(false)}
            >
              X
            </button>
            <img
              src={tienda.imagen}
              alt={tienda.nombre}
              className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DetallesTienda;
