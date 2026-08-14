import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  MapPin,
  Calendar,
  HeartHandshake,
  CheckCircle,
} from "lucide-react";
import axios from "axios";

const API_URL =
  "https://tiendasappbackend.onrender.com";

const CIUDADES = [
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

const Salvos = () => {
  // =====================================================
  // ESTADOS
  // =====================================================

  const [personas, setPersonas] = useState([]);

  const [nombre, setNombre] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [ciudadFiltro, setCiudadFiltro] = useState("Todas");

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // CARGAR PERSONAS A SALVO
  // =====================================================

  const cargarPersonas = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/api/emergencias?tipoReporte=${encodeURIComponent(
          "Estoy a salvo"
        )}`
      );

      const reportes = response.data?.reportes || [];

      const salvos = reportes.filter(
        (reporte) =>
          reporte.activa !== false &&
          reporte.tipoReporte === "Estoy a salvo"
      );

      setPersonas(salvos);
    } catch (err) {
      console.error(
        "Error cargando personas a salvo:",
        err
      );

      setError(
        "No fue posible cargar las personas registradas como a salvo."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPersonas();
  }, []);

  // =====================================================
  // REGISTRAR PERSONA A SALVO
  // =====================================================

  const registrarASalvo = async (e) => {
    e.preventDefault();

    setMensaje("");
    setError("");

    if (!nombre.trim()) {
      setError("Ingresa el nombre de la persona.");
      return;
    }

    if (!ciudad) {
      setError("Selecciona la ciudad o municipio.");
      return;
    }

    if (!direccion.trim()) {
      setError(
        "Ingresa una dirección o ubicación de referencia."
      );
      return;
    }

    if (!telefono.trim()) {
      setError("Ingresa un teléfono o WhatsApp.");
      return;
    }

    try {
      setGuardando(true);

      const formData = new FormData();

      formData.append(
        "nombre",
        nombre.trim()
      );

      formData.append(
        "ciudad",
        ciudad
      );

      formData.append(
        "direccion",
        direccion.trim()
      );

      formData.append(
        "telefonoWhatsapp",
        telefono.trim()
      );

      formData.append(
        "tipoReporte",
        "Estoy a salvo"
      );

      formData.append(
        "descripcion",
        descripcion.trim() ||
          "La persona informa que se encuentra a salvo."
      );

      formData.append(
        "personasAfectadas",
        "1"
      );

      formData.append(
        "necesidades",
        JSON.stringify([])
      );

      // IMPORTANTE:
      // Para "Estoy a salvo" NO enviamos fotografía.

      await axios.post(
        `${API_URL}/api/emergencias`,
        formData
      );

      setMensaje(
        "Tu registro fue realizado correctamente. Ahora apareces como persona a salvo."
      );

      setNombre("");
      setCiudad("");
      setDireccion("");
      setTelefono("");
      setDescripcion("");

      await cargarPersonas();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error(
        "Error registrando persona a salvo:",
        err
      );

      setError(
        err.response?.data?.error ||
          "No fue posible registrar la información."
      );
    } finally {
      setGuardando(false);
    }
  };

  // =====================================================
  // FILTRAR PERSONAS
  // =====================================================

  const personasFiltradas = personas.filter(
    (persona) => {
      const termino = busqueda
        .trim()
        .toLowerCase();

      const coincideNombre =
        !termino ||
        persona.nombre
          ?.toLowerCase()
          .includes(termino);

      const coincideCiudad =
        ciudadFiltro === "Todas" ||
        persona.ciudad === ciudadFiltro;

      return (
        coincideNombre &&
        coincideCiudad
      );
    }
  );

  // =====================================================
  // FORMATEAR FECHA
  // =====================================================

  const formatearFecha = (fecha) => {
    if (!fecha) {
      return "";
    }

    return new Date(fecha).toLocaleDateString(
      "es-CO",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>

        <p>
          Cargando personas a salvo...
        </p>
      </div>
    );
  }

  // =====================================================
  // PAGINA
  // =====================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <header
        style={{
          background:
            "linear-gradient(135deg, #16a34a, #15803d)",
          color: "#fff",
          padding: "20px",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >

          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "#fff",
              textDecoration: "none",
              background:
                "rgba(255,255,255,.18)",
              padding: "8px 14px",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          >
            <ArrowLeft size={17} />
            Volver
          </Link>

          <div
            style={{
              textAlign: "center",
              marginTop: "20px",
            }}
          >

            <HeartHandshake size={55} />

            <h1
              style={{
                margin: "10px 0",
                fontSize: "32px",
              }}
            >
              Personas a salvo
            </h1>

            <p
              style={{
                margin: 0,
                opacity: 0.95,
              }}
            >
              Informa que estás bien para que
              familiares y amigos sepan que estás a salvo.
            </p>

          </div>
        </div>
      </header>

      {/* =================================================
          MENSAJES
      ================================================= */}

      <div
        style={{
          maxWidth: "700px",
          margin: "25px auto 0",
          padding: "0 20px",
        }}
      >

        {mensaje && (
          <div
            style={{
              background: "#dcfce7",
              border: "1px solid #86efac",
              color: "#166534",
              padding: "16px",
              borderRadius: "10px",
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            <CheckCircle
              size={20}
              style={{
                verticalAlign: "middle",
                marginRight: "6px",
              }}
            />

            {mensaje}
          </div>
        )}

        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#991b1b",
              padding: "16px",
              borderRadius: "10px",
              textAlign: "center",
              marginTop: mensaje
                ? "12px"
                : "0",
            }}
          >
            {error}
          </div>
        )}

      </div>

      {/* =================================================
          FORMULARIO
      ================================================= */}

      <section
        style={{
          maxWidth: "700px",
          margin: "25px auto",
          padding: "0 20px",
        }}
      >

        <div
          style={{
            background: "#fff",
            borderRadius: "15px",
            padding: "25px",
            boxShadow:
              "0 4px 20px rgba(0,0,0,.08)",
          }}
        >

          <h2
            style={{
              textAlign: "center",
              color: "#166534",
              marginTop: 0,
            }}
          >
            ❤️ Regístrate como persona a salvo
          </h2>

          <p
            style={{
              textAlign: "center",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            Registra tus datos para que familiares
            y comunidad sepan que estás bien.
          </p>

          <form onSubmit={registrarASalvo}>

            {/* NOMBRE */}

            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginTop: "18px",
                marginBottom: "7px",
              }}
            >
              Nombre completo *
            </label>

            <input
              type="text"
              value={nombre}
              onChange={(e) =>
                setNombre(e.target.value)
              }
              placeholder="Nombre completo"
              maxLength={150}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px",
                border:
                  "1px solid #cbd5e1",
                borderRadius: "8px",
                fontSize: "15px",
              }}
            />

            {/* CIUDAD */}

            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginTop: "18px",
                marginBottom: "7px",
              }}
            >
              Ciudad / Municipio *
            </label>

            <select
              value={ciudad}
              onChange={(e) =>
                setCiudad(e.target.value)
              }
              style={{
                width: "100%",
                padding: "12px",
                border:
                  "1px solid #cbd5e1",
                borderRadius: "8px",
                fontSize: "15px",
                background: "#fff",
              }}
            >

              <option value="">
                Selecciona una ciudad
              </option>

              {CIUDADES.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}

            </select>

            {/* DIRECCION */}

            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginTop: "18px",
                marginBottom: "7px",
              }}
            >
              Dirección o ubicación de referencia *
            </label>

            <input
              type="text"
              value={direccion}
              onChange={(e) =>
                setDireccion(
                  e.target.value
                )
              }
              placeholder="Barrio, sector o dirección"
              maxLength={250}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px",
                border:
                  "1px solid #cbd5e1",
                borderRadius: "8px",
                fontSize: "15px",
              }}
            />

            {/* TELEFONO */}

            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginTop: "18px",
                marginBottom: "7px",
              }}
            >
              Teléfono / WhatsApp *
            </label>

            <input
              type="tel"
              value={telefono}
              onChange={(e) =>
                setTelefono(
                  e.target.value
                )
              }
              placeholder="Ej: 3001234567"
              maxLength={20}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px",
                border:
                  "1px solid #cbd5e1",
                borderRadius: "8px",
                fontSize: "15px",
              }}
            />

            {/* DESCRIPCION */}

            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginTop: "18px",
                marginBottom: "7px",
              }}
            >
              Mensaje
            </label>

            <textarea
              value={descripcion}
              onChange={(e) =>
                setDescripcion(
                  e.target.value
                )
              }
              placeholder="Información adicional que quieras compartir..."
              maxLength={1000}
              rows={4}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px",
                border:
                  "1px solid #cbd5e1",
                borderRadius: "8px",
                fontSize: "15px",
                resize: "vertical",
              }}
            />

            {/* AUTORIZACION */}

            <div
              style={{
                background: "#f8fafc",
                padding: "14px",
                borderRadius: "8px",
                marginTop: "18px",
                fontSize: "13px",
                color: "#475569",
                lineHeight: "1.5",
              }}
            >
              ❤️ Al registrarte autorizas la
              publicación de tu nombre, ciudad
              y dirección de referencia para
              informar que estás a salvo.
            </div>

            {/* BOTON */}

            <button
              type="submit"
              disabled={guardando}
              style={{
                width: "100%",
                marginTop: "20px",
                padding: "14px",
                border: "none",
                borderRadius: "9px",
                background: guardando
                  ? "#86efac"
                  : "#16a34a",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "16px",
                cursor: guardando
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {guardando
                ? "Registrando..."
                : "❤️ Estoy a salvo"}
            </button>

          </form>

        </div>
      </section>

      {/* =================================================
          BUSCADOR
      ================================================= */}

      <section
        style={{
          maxWidth: "900px",
          margin: "20px auto 0",
          padding: "0 20px",
        }}
      >

        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "14px",
            boxShadow:
              "0 4px 20px rgba(0,0,0,.08)",
          }}
        >

          <h2
            style={{
              marginTop: 0,
              color: "#166534",
            }}
          >
            🔎 Buscar personas a salvo
          </h2>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >

            <div
              style={{
                flex: "1 1 350px",
                position: "relative",
              }}
            >

              <Search
                size={20}
                color="#64748b"
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                }}
              />

              <input
                type="text"
                value={busqueda}
                onChange={(e) =>
                  setBusqueda(
                    e.target.value
                  )
                }
                placeholder="Buscar por nombre..."
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding:
                    "13px 15px 13px 45px",
                  border:
                    "1px solid #cbd5e1",
                  borderRadius: "9px",
                  fontSize: "16px",
                }}
              />

            </div>

            <select
              value={ciudadFiltro}
              onChange={(e) =>
                setCiudadFiltro(
                  e.target.value
                )
              }
              style={{
                flex: "0 1 250px",
                padding: "13px",
                border:
                  "1px solid #cbd5e1",
                borderRadius: "9px",
                fontSize: "16px",
                background: "#fff",
              }}
            >

              <option value="Todas">
                📍 Todas las ciudades
              </option>

              {CIUDADES.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}

            </select>

          </div>
        </div>
      </section>

      {/* =================================================
          LISTADO
      ================================================= */}

      <main
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "30px 20px 60px",
        }}
      >

        <div
          style={{
            marginBottom: "20px",
          }}
        >

          <h2
            style={{
              margin: "0 0 5px",
              color: "#1e293b",
            }}
          >
            Personas registradas como a salvo
          </h2>

          <p
            style={{
              margin: 0,
              color: "#64748b",
            }}
          >
            {personasFiltradas.length}{" "}
            {personasFiltradas.length === 1
              ? "persona"
              : "personas"}
          </p>

        </div>

        {personasFiltradas.length === 0 ? (

          <div
            style={{
              background: "#fff",
              padding: "60px 20px",
              borderRadius: "14px",
              textAlign: "center",
              border:
                "1px solid #e2e8f0",
            }}
          >

            <HeartHandshake
              size={70}
              color="#94a3b8"
            />

            <h3>
              Aún no hay personas registradas
            </h3>

            <p
              style={{
                color: "#64748b",
              }}
            >
              Registra tu situación para informar
              que estás a salvo.
            </p>

          </div>

        ) : (

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >

            {personasFiltradas.map(
              (persona) => (

                <div
                  key={persona._id}
                  style={{
                    background: "#fff",
                    borderRadius: "14px",
                    overflow: "hidden",
                    border:
                      "1px solid #e2e8f0",
                    boxShadow:
                      "0 3px 12px rgba(0,0,0,.08)",
                  }}
                >

                  <div
                    style={{
                      height: "100px",
                      background:
                        "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <HeartHandshake
                      size={60}
                      color="#16a34a"
                    />
                  </div>

                  {/* INFORMACION */}

                  <div
                    style={{
                      padding: "20px",
                    }}
                  >

                    <div
                      style={{
                        display: "inline-block",
                        background: "#dcfce7",
                        color: "#166534",
                        padding: "5px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "700",
                        marginBottom: "10px",
                      }}
                    >
                      ❤️ ESTÁ A SALVO
                    </div>

                    <h3
                      style={{
                        margin:
                          "4px 0 12px",
                        color: "#0f172a",
                        fontSize: "21px",
                      }}
                    >
                      {persona.nombre}
                    </h3>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "7px",
                        color: "#475569",
                        marginBottom: "8px",
                      }}
                    >

                      <MapPin
                        size={17}
                        color="#16a34a"
                      />

                      <strong>
                        {persona.ciudad}
                      </strong>

                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "7px",
                        color: "#64748b",
                        fontSize: "14px",
                      }}
                    >

                      <Calendar size={16} />

                      Reportado el{" "}
                      {formatearFecha(
                        persona.fechaCreacion
                      )}

                    </div>

                    {persona.descripcion && (
                      <p
                        style={{
                          color: "#475569",
                          lineHeight: "1.5",
                          fontSize: "14px",
                          marginTop: "14px",
                        }}
                      >
                        {persona.descripcion}
                      </p>
                    )}

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </main>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer
        style={{
          background: "#0f172a",
          color: "#fff",
          padding: "25px 20px",
          textAlign: "center",
        }}
      >

        <strong>
          🇨🇴 Colombia se ayuda
        </strong>

        <p
          style={{
            color: "#cbd5e1",
            fontSize: "14px",
          }}
        >
          Información ciudadana para ayudar
          durante la emergencia.
        </p>

        <Link
          to="/"
          style={{
            color: "#93c5fd",
            textDecoration: "none",
          }}
        >
          Volver al inicio
        </Link>

      </footer>

    </div>
  );
};

export default Salvos;
