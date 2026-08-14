import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Check, X, HeartHandshake } from "lucide-react";
import axios from "axios";

const RegistroTienda = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");

  const ciudades = [
    "Armenia",
    "Bagadó",
    "Bugalagrande",
    "Cali",
    "Cartago",
    "Certegui",
    "Condoto",
    "Dosquebradas",
    "El Cantón de San Pablo",
    "La Tebaida",
    "La Unión",
    "La Victoria",
    "Manizales",
    "Montenegro",
    "Novita",
    "Pereira",
    "Quibdó",
    "Roldanillo",
    "Salento",
    "San Francisco",
    "San José del Palmar",
    "Subachoque",
    "Tabio",
    "Tadó",
    "Toro",
    "Tuluá",
    "Viterbo",
    "Zarzal",
  ];

  const tiposReporte = [
    "Necesito ayuda",
    "Daños en mi vivienda",
    "Persona no localizada",
    "Estoy a salvo",
    "Quiero ofrecer ayuda",
    "Otro reporte",
  ];

  const estadosVivienda = [
    "Sin daños aparentes",
    "Daños menores",
    "Daños importantes",
    "Daño grave / inhabitable",
    "Vivienda destruida",
    "No puedo determinarlo",
  ];

  const necesidades = [
    "Agua",
    "Alimentos",
    "Alojamiento",
    "Atención médica",
    "Medicamentos",
    "Materiales para vivienda",
    "Transporte",
    "Ropa e higiene",
    "Electricidad / comunicaciones",
    "Ayuda para animales",
    "Rescate / evacuación",
    "Apoyo a personas vulnerables",
    "Otra necesidad",
  ];

  const [formData, setFormData] = useState({
    nombre: "",
    ciudad: "",
    direccion: "",
    tipoReporte: "",
    telefonoWhatsapp: "",
    estadoVivienda: "",
    personasAfectadas: "1",
    necesidades: [],
    descripcion: "",
  });

  const [archivo, setArchivo] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNecesidadChange = (necesidad) => {
    setFormData((prev) => {
      const existe = prev.necesidades.includes(necesidad);

      return {
        ...prev,
        necesidades: existe
          ? prev.necesidades.filter((item) => item !== necesidad)
          : [...prev.necesidades, necesidad],
      };
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];

    if (!file) {
      return;
    }

    // Solo permitimos una imagen
    setArchivo(file);

    const reader = new FileReader();

    reader.onload = (event) => {
      setPreviewImage(event.target.result);
    };

    reader.readAsDataURL(file);
  };

  const eliminarImagen = () => {
    setArchivo(null);
    setPreviewImage("");

    const input = document.getElementById("foto");

    if (input) {
      input.value = "";
    }
  };

  const mostrarMensaje = (texto, tipo) => {
    setMensaje(texto);
    setTipoMensaje(tipo);

    setTimeout(() => {
      setMensaje("");
      setTipoMensaje("");
    }, 5000);
  };

  const validarFormulario = () => {
    const {
      nombre,
      ciudad,
      direccion,
      tipoReporte,
      telefonoWhatsapp,
      personasAfectadas,
      descripcion,
    } = formData;

    if (!nombre.trim()) {
      mostrarMensaje("El nombre es obligatorio", "error");
      return false;
    }

    if (!ciudad) {
      mostrarMensaje("Debe seleccionar una ciudad o municipio", "error");
      return false;
    }

    if (!direccion.trim()) {
      mostrarMensaje("La dirección es obligatoria", "error");
      return false;
    }

    if (!tipoReporte) {
      mostrarMensaje("Debe seleccionar qué desea reportar", "error");
      return false;
    }

    if (!telefonoWhatsapp.trim()) {
      mostrarMensaje("El teléfono o WhatsApp es obligatorio", "error");
      return false;
    }

    const telefonoLimpio = telefonoWhatsapp.replace(/\D/g, "");

    if (telefonoLimpio.length < 10) {
      mostrarMensaje(
        "El teléfono debe tener al menos 10 dígitos",
        "error"
      );
      return false;
    }

    if (!personasAfectadas || Number(personasAfectadas) < 1) {
      mostrarMensaje(
        "Debe indicar cuántas personas están afectadas",
        "error"
      );
      return false;
    }

    if (!descripcion.trim()) {
      mostrarMensaje(
        "Describe brevemente la situación",
        "error"
      );
      return false;
    }

    // Única situación que requiere fotografía
    if (
      tipoReporte === "Persona no localizada" &&
      !archivo
    ) {
      mostrarMensaje(
        "Para reportar una persona no localizada debes adjuntar una fotografía",
        "error"
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setLoading(true);

    try {
      const datos = new FormData();

      datos.append("nombre", formData.nombre);
      datos.append("ciudad", formData.ciudad);
      datos.append("direccion", formData.direccion);
      datos.append("tipoReporte", formData.tipoReporte);

      datos.append(
        "telefonoWhatsapp",
        formData.telefonoWhatsapp.replace(/\D/g, "")
      );

      datos.append(
        "estadoVivienda",
        formData.estadoVivienda
      );

      datos.append(
        "personasAfectadas",
        formData.personasAfectadas
      );

      datos.append(
        "necesidades",
        JSON.stringify(formData.necesidades)
      );

      datos.append(
        "descripcion",
        formData.descripcion
      );

      // Solo enviar fotografía para persona no localizada
      if (
        formData.tipoReporte === "Persona no localizada" &&
        archivo
      ) {
        datos.append("foto", archivo);
      }

      await axios.post(
        "https://tiendasappbackend.onrender.com/api/emergencias",
        datos,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      mostrarMensaje(
        "¡Reporte registrado correctamente!",
        "success"
      );

      setFormData({
        nombre: "",
        ciudad: "",
        direccion: "",
        tipoReporte: "",
        telefonoWhatsapp: "",
        estadoVivienda: "",
        personasAfectadas: "1",
        necesidades: [],
        descripcion: "",
      });

      setArchivo(null);
      setPreviewImage("");

      setTimeout(() => {
        navigate("/");
      }, 2500);
    } catch (error) {
      console.error(
        "Error registrando reporte:",
        error
      );

      const mensajeError =
        error.response &&
        error.response.data &&
        error.response.data.error
          ? error.response.data.error
          : "Error registrando el reporte. Intenta nuevamente.";

      mostrarMensaje(
        mensajeError,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const mostrarEstadoVivienda =
    formData.tipoReporte === "Daños en mi vivienda" ||
    formData.tipoReporte === "Necesito ayuda";

  const mostrarNecesidades =
    formData.tipoReporte === "Necesito ayuda" ||
    formData.tipoReporte === "Daños en mi vivienda";

  const mostrarFoto =
    formData.tipoReporte === "Persona no localizada";

  return (
    <div className="registro-tienda">

      <div className="registro-container">

        <div className="registro-header">

          <Link
            to="/"
            className="back-button"
          >
            <ArrowLeft size={20} />
            Volver
          </Link>

          <div className="logo">

            <HeartHandshake size={32} />

            <h1>
              Registra tu situación
            </h1>

          </div>

          <p>
            Tu reporte puede ayudar a identificar dónde se necesita ayuda.
          </p>

        </div>

        {mensaje && (
          <div
            className={
              "mensaje " + tipoMensaje
            }
          >
            {tipoMensaje === "success" ? (
              <Check size={20} />
            ) : (
              <X size={20} />
            )}

            <span>{mensaje}</span>

          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="registro-form"
        >

          {/* NOMBRE */}

          <div className="form-row">

            <div className="form-group">

              <label htmlFor="nombre">
                Nombre de la persona *
              </label>

              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Nombre completo"
                required
              />

            </div>

          </div>


          {/* TELEFONO */}

          <div className="form-row">

            <div className="form-group">

              <label htmlFor="telefonoWhatsapp">
                Teléfono / WhatsApp *
              </label>

              <input
                type="tel"
                id="telefonoWhatsapp"
                name="telefonoWhatsapp"
                value={formData.telefonoWhatsapp}
                onChange={handleInputChange}
                placeholder="3001234567"
                required
              />

            </div>

          </div>


          {/* CIUDAD */}

          <div className="form-row">

            <div className="form-group">

              <label htmlFor="ciudad">
                Ciudad / Municipio *
              </label>

              <select
                id="ciudad"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleInputChange}
                required
              >

                <option value="">
                  Selecciona una ciudad
                </option>

                {ciudades.map((ciudad) => (
                  <option
                    key={ciudad}
                    value={ciudad}
                  >
                    {ciudad}
                  </option>
                ))}

              </select>

            </div>

          </div>


          {/* DIRECCION */}

          <div className="form-row">

            <div className="form-group">

              <label htmlFor="direccion">
                Dirección *
              </label>

              <input
                type="text"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                placeholder="Dirección donde se encuentra"
                required
              />

            </div>

          </div>


          {/* TIPO DE REPORTE */}

          <div className="form-row">

            <div className="form-group">

              <label htmlFor="tipoReporte">
                ¿Qué deseas reportar? *
              </label>

              <select
                id="tipoReporte"
                name="tipoReporte"
                value={formData.tipoReporte}
                onChange={handleInputChange}
                required
              >

                <option value="">
                  Selecciona una opción
                </option>

                {tiposReporte.map((tipo) => (
                  <option
                    key={tipo}
                    value={tipo}
                  >
                    {tipo}
                  </option>
                ))}

              </select>

            </div>

          </div>


          {/* ESTADO VIVIENDA */}

          {mostrarEstadoVivienda && (

            <div className="form-row">

              <div className="form-group">

                <label htmlFor="estadoVivienda">
                  ¿Cómo quedó la vivienda?
                </label>

                <select
                  id="estadoVivienda"
                  name="estadoVivienda"
                  value={formData.estadoVivienda}
                  onChange={handleInputChange}
                >

                  <option value="">
                    Selecciona el estado
                  </option>

                  {estadosVivienda.map(
                    (estado) => (
                      <option
                        key={estado}
                        value={estado}
                      >
                        {estado}
                      </option>
                    )
                  )}

                </select>

              </div>

            </div>

          )}


          {/* PERSONAS AFECTADAS */}

          <div className="form-row">

            <div className="form-group">

              <label htmlFor="personasAfectadas">
                ¿Cuántas personas están afectadas? *
              </label>

              <input
                type="number"
                id="personasAfectadas"
                name="personasAfectadas"
                min="1"
                value={formData.personasAfectadas}
                onChange={handleInputChange}
                required
              />

            </div>

          </div>


          {/* NECESIDADES */}

          {mostrarNecesidades && (

            <div className="form-group">

              <label>
                ¿Qué necesitas?
              </label>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >

                {necesidades.map(
                  (necesidad) => (

                    <label
                      key={necesidad}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >

                      <input
                        type="checkbox"
                        checked={formData.necesidades.includes(
                          necesidad
                        )}
                        onChange={() =>
                          handleNecesidadChange(
                            necesidad
                          )
                        }
                      />

                      <span>
                        {necesidad}
                      </span>

                    </label>

                  )
                )}

              </div>

            </div>

          )}


          {/* FOTO */}

          {mostrarFoto && (

            <div className="form-group">

              <label>
                Fotografía de la persona *
              </label>

              <p
                style={{
                  fontSize: "14px",
                  color: "#64748b",
                  marginBottom: "10px",
                }}
              >
                Adjunta una sola fotografía clara de la persona.
              </p>

              <div className="upload-area">

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  id="foto"
                  className="file-input"
                />

                <label
                  htmlFor="foto"
                  className="upload-label"
                >

                  <Upload size={24} />

                  <span>
                    Seleccionar fotografía
                  </span>

                </label>

              </div>

              {previewImage && (

                <div className="image-previews">

                  <div className="image-preview">

                    <img
                      src={previewImage}
                      alt="Fotografía seleccionada"
                      style={{
                        width: "180px",
                        height: "180px",
                        objectFit: "cover",
                      }}
                    />

                    <button
                      type="button"
                      onClick={eliminarImagen}
                      className="remove-image"
                    >

                      <X size={16} />

                    </button>

                  </div>

                </div>

              )}

            </div>

          )}


          {/* DESCRIPCION */}

          <div className="form-row">

            <div className="form-group">

              <label htmlFor="descripcion">
                Describe brevemente la situación *
              </label>

              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows="5"
                placeholder="Cuéntanos qué ocurrió, qué necesitas o cualquier información importante."
                required
              />

            </div>

          </div>


          {/* BOTON */}

          <div className="form-actions">

            <button
              type="submit"
              disabled={loading}
              className="btn-submit"
            >

              {loading
                ? "Enviando reporte..."
                : "Registrar mi situación"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default RegistroTienda;
