// src/components/RegistroTienda.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Store,
  ArrowLeft,
  Upload,
  Check,
  X,
  MapPin,
  Phone,
  MessageCircle,
  Star,
} from "lucide-react";
import axios from "axios";

const RegistroTienda = () => {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  // Campos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    categoria: "",
    telefono: "",
    direccion: "",
    ubicacion: { lat: null, lng: null },
    calificacion: 0,
  });

  // Obtener categorías al cargar
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/categorias");
        setCategorias(response.data);
      } catch (err) {
        console.error("Error cargando categorías:", err);
      }
    };
    fetchCategorias();
  }, []);

  // Manejo de cambio en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Manejo de imagen
  const handleImagen = (e) => {
    const file = e.target.files[0];
    setImagen(file);
    setPreview(URL.createObjectURL(file));
  };

  // Obtener ubicación GPS
  const obtenerUbicacion = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setFormData({
            ...formData,
            ubicacion: { lat, lng },
          });
        },
        (err) => {
          console.error("Error obteniendo ubicación:", err);
          setError("No se pudo obtener la ubicación.");
        }
      );
    } else {
      setError("El navegador no soporta geolocalización.");
    }
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);
    setError(null);

    try {
      const data = new FormData();
      data.append("nombre", formData.nombre);
      data.append("descripcion", formData.descripcion);
      data.append("categoria", formData.categoria);
      data.append("telefono", formData.telefono);
      data.append("direccion", formData.direccion);
      data.append("lat", formData.ubicacion.lat);
      data.append("lng", formData.ubicacion.lng);
      data.append("calificacion", formData.calificacion);
      if (imagen) data.append("imagen", imagen);

      await axios.post("http://localhost:5000/api/tiendas", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMensaje("Tienda registrada exitosamente.");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error("Error registrando tienda:", err);
      setError("Hubo un problema al registrar la tienda.");
    } finally {
      setLoading(false);
    }
  };

  // Calificación por estrellas
  const handleRating = (valor) => {
    setFormData({
      ...formData,
      calificacion: valor,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6">
        {/* Encabezado */}
        <div className="flex items-center mb-6">
          <Link
            to="/"
            className="flex items-center text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </Link>
        </div>

        <div className="flex items-center justify-center mb-6">
          <Store className="w-10 h-10 text-orange-500 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">
            Registro de Tienda
          </h1>
        </div>

        {/* Mensajes */}
        {mensaje && (
          <div className="flex items-center bg-green-100 text-green-700 px-4 py-2 rounded mb-4">
            <Check className="w-5 h-5 mr-2" />
            {mensaje}
          </div>
        )}
        {error && (
          <div className="flex items-center bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            <X className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre de la tienda
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              required
            ></textarea>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Categoría
            </label>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              required
            >
              <option value="">Seleccione una categoría</option>
              {categorias.map((cat) => (
                <option key={cat._id} value={cat.nombre}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Teléfono / WhatsApp
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              required
            />
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Dirección
            </label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              required
            />
          </div>

          {/* Ubicación */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={obtenerUbicacion}
              className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Obtener Ubicación
            </button>
            {formData.ubicacion.lat && (
              <span className="ml-4 text-sm text-gray-600">
                Lat: {formData.ubicacion.lat}, Lng: {formData.ubicacion.lng}
              </span>
            )}
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Imagen de la tienda
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImagen}
              className="mt-1"
            />
            {preview && (
              <img
                src={preview}
                alt="Vista previa"
                className="mt-2 w-48 h-48 object-cover rounded-lg border"
              />
            )}
          </div>

          {/* Calificación */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Calificación
            </label>
            <div className="flex items-center space-x-2 mt-1">
              {[1, 2, 3, 4, 5].map((valor) => (
                <Star
                  key={valor}
                  onClick={() => handleRating(valor)}
                  className={`w-6 h-6 cursor-pointer ${
                    valor <= formData.calificacion
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Botón */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center px-4 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600"
            >
              {loading ? "Registrando..." : "Registrar Tienda"}
            </button>
          </div>
        </form>

        {/* Vista Previa */}
        <div className="mt-10 border-t pt-6">
          <h2 className="text-lg font-bold text-gray-700 mb-4">
            Vista Previa de la Tienda
          </h2>
          <div className="p-4 border rounded-lg bg-gray-50">
            {preview && (
              <img
                src={preview}
                alt="Vista previa"
                className="w-32 h-32 object-cover rounded-lg mb-3"
              />
            )}
            <h3 className="text-xl font-semibold">{formData.nombre}</h3>
            <p className="text-gray-600">{formData.descripcion}</p>
            <p className="text-gray-800 font-medium mt-2">
              Categoría: {formData.categoria}
            </p>
            <p className="text-gray-800 mt-1 flex items-center">
              <Phone className="w-4 h-4 mr-2" /> {formData.telefono}
            </p>
            <p className="text-gray-800 mt-1">{formData.direccion}</p>
            {formData.ubicacion.lat && (
              <p className="text-sm text-gray-500">
                Ubicación GPS: {formData.ubicacion.lat}, {formData.ubicacion.lng}
              </p>
            )}
            {/* WhatsApp */}
            {formData.telefono && (
              <a
                href={`https://wa.me/${formData.telefono}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chatear por WhatsApp
              </a>
            )}
            {/* Calificación */}
            <div className="mt-3 flex items-center">
              {[1, 2, 3, 4, 5].map((valor) => (
                <Star
                  key={valor}
                  className={`w-5 h-5 ${
                    valor <= formData.calificacion
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 text-gray-600">
                {formData.calificacion} / 5
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistroTienda;
