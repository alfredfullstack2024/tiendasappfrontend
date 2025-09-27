// src/components/RegistroTienda.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Store, ArrowLeft, Upload, Check, X } from "lucide-react";
import axios from "axios";

const RegistroTienda = () => {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");

  const [formData, setFormData] = useState({
    nombreEstablecimiento: "",
    direccion: "",
    categoria: "",
    telefonoWhatsapp: "",
    descripcionVentas: "",
    paginaWeb: "",
    redesSociales: "",
  });

  const [archivos, setArchivos] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const response = await axios.get(
        "https://tiendasappbackend.onrender.com/api/categorias"
      );
      setCategorias(response.data);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setArchivos(files);

    const previews = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previews).then(setPreviewImages);
  };

  const eliminarImagen = (index) => {
    const nuevosArchivos = archivos.filter((_, i) => i !== index);
    const nuevasPreviews = previewImages.filter((_, i) => i !== index);
    setArchivos(nuevosArchivos);
    setPreviewImages(nuevasPreviews);
  };

  const validarFormulario = () => {
    const {
      nombreEstablecimiento,
      direccion,
      categoria,
      telefonoWhatsapp,
      descripcionVentas,
    } = formData;

    if (!nombreEstablecimiento.trim()) {
      mostrarMensaje("El nombre del establecimiento es obligatorio", "error");
      return false;
    }
    if (!direccion.trim()) {
      mostrarMensaje("La dirección es obligatoria", "error");
      return false;
    }
    if (!categoria) {
      mostrarMensaje("Debe seleccionar una categoría", "error");
      return false;
    }
    if (!telefonoWhatsapp.trim()) {
      mostrarMensaje("El teléfono de WhatsApp es obligatorio", "error");
      return false;
    }
    if (!descripcionVentas.trim()) {
      mostrarMensaje("La descripción de ventas es obligatoria", "error");
      return false;
    }

    const telefonoLimpio = telefonoWhatsapp.replace(/\D/g, "");
    if (telefonoLimpio.length < 10) {
      mostrarMensaje("El teléfono debe tener al menos 10 dígitos", "error");
      return false;
    }

    return true;
  };

  const mostrarMensaje = (texto, tipo) => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    setTimeout(() => {
      setMensaje("");
      setTipoMensaje("");
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });
      archivos.forEach((archivo) => {
        formDataToSend.append("fotos", archivo);
      });

      await axios.post(
        "https://tiendasappbackend.onrender.com/api/tiendas",
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      mostrarMensaje("¡Tienda registrada exitosamente!", "success");
      setFormData({
        nombreEstablecimiento: "",
        direccion: "",
        categoria: "",
        telefonoWhatsapp: "",
        descripcionVentas: "",
        paginaWeb: "",
        redesSociales: "",
      });
      setArchivos([]);
      setPreviewImages([]);

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error registrando tienda:", error);
      const mensajeError =
        error.response?.data?.error ||
        "Error registrando la tienda. Intente nuevamente.";
      mostrarMensaje(mensajeError, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registro-tienda">
      <div className="registro-container">
        <div className="registro-header">
          <Link to="/" className="back-button">
            <ArrowLeft size={20} />
            Volver al menú
          </Link>
          <div className="logo">
            <Store size={32} />
            <h1>Registra tu tienda</h1>
          </div>
          <p>Completa la información para agregar tu negocio al directorio</p>
        </div>

        {mensaje && (
          <div className={`mensaje ${tipoMensaje}`}>
            {tipoMensaje === "success" ? <Check size={20} /> : <X size={20} />}
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit} className="registro-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombreEstablecimiento">
                Nombre del Establecimiento *
              </label>
              <input
                type="text"
                id="nombreEstablecimiento"
                name="nombreEstablecimiento"
                value={formData.nombreEstablecimiento}
                onChange={handleInputChange}
                placeholder="Ej: Restaurante El Buen Sabor"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="direccion">Dirección completa *</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                placeholder="Ej: Calle 123 #45-67, Bogotá"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="categoria">Categoría *</label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="telefonoWhatsapp">Teléfono WhatsApp *</label>
              <input
                type="tel"
                id="telefonoWhatsapp"
                name="telefonoWhatsapp"
                value={formData.telefonoWhatsapp}
                onChange={handleInputChange}
                placeholder="Ej: 3001234567"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="descripcionVentas">
                Descripción de tus productos/servicios *
              </label>
              <textarea
                id="descripcionVentas"
                name="descripcionVentas"
                value={formData.descripcionVentas}
                onChange={handleInputChange}
                placeholder="Describe qué vendes, tus especialidades, horarios, etc."
                rows="4"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="paginaWeb">Página Web (opcional)</label>
              <input
                type="url"
                id="paginaWeb"
                name="paginaWeb"
                value={formData.paginaWeb}
                onChange={handleInputChange}
                placeholder="https://www.mitienda.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="redesSociales">Redes Sociales (opcional)</label>
              <input
                type="text"
                id="redesSociales"
                name="redesSociales"
                value={formData.redesSociales}
                onChange={handleInputChange}
                placeholder="@mitienda, facebook.com/mitienda"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Fotos de tus productos (máximo 3)</label>
            <div className="upload-area">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                id="fotos"
                className="file-input"
              />
              <label htmlFor="fotos" className="upload-label">
                <Upload size={24} />
                <span>Haz clic para seleccionar imágenes</span>
                <small>JPG, PNG - Máximo 5MB por imagen</small>
              </label>
            </div>

            {previewImages.length > 0 && (
              <div className="image-previews">
                {previewImages.map((preview, index) => (
                  <div key={index} className="image-preview">
                    <img src={preview} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      onClick={() => eliminarImagen(index)}
                      className="remove-image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  Registrando...
                </>
              ) : (
                <>
                  <Check size={20} />
                  Registrar mi tienda
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistroTienda;
