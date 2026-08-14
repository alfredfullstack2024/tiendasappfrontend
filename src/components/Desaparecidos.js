import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  MapPin,
  Calendar,
  Plus,
} from "lucide-react";
import axios from "axios";

const API_URL =
  "https://tiendasappbackend.onrender.com";

const Desaparecidos = () => {
  const [personas, setPersonas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [ciudadSeleccionada, setCiudadSeleccionada] =
    useState("Todas");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const ciudades = [
    "Todas",
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

  useEffect(() => {
    cargarPersonas();
  }, []);

  const cargarPersonas = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/api/emergencias?tipoReporte=${encodeURIComponent(
          "Persona no localizada"
        )}`
      );

      const reportes =
        response.data?.reportes || [];

      const desaparecidos =
        reportes.filter(
          (reporte) =>
            reporte.activa !== false &&
            reporte.tipoReporte ===
              "Persona no localizada"
        );

      setPersonas(desaparecidos);
    } catch (err) {
      console.error(
        "Error cargando personas no localizadas:",
        err
      );

      setError(
        "No fue posible cargar los reportes. Intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FILTRAR POR NOMBRE Y CIUDAD
  // =====================================================

  const personasFiltradas =
    personas.filter((persona) => {
      const termino =
        busqueda.trim().toLowerCase();

      const coincideNombre =
        !termino ||
        persona.nombre
          ?.toLowerCase()
          .includes(termino);

      const coincideCiudad =
        ciudadSeleccionada === "Todas" ||
        persona.ciudad ===
          ciudadSeleccionada;

      return (
        coincideNombre &&
        coincideCiudad
      );
    });

  // =====================================================
  // FORMATEAR FECHA
  // =====================================================

  const formatearFecha = (fecha) => {
    if (!fecha) return "";

    return new Date(
      fecha
    ).toLocaleDateString("es-CO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // =====================================================
  // TRUNCAR DESCRIPCIÓN
  // =====================================================

  const truncarTexto = (
    texto,
    limite = 150
  ) => {
    if (!texto) return "";

    if (texto.length <= limite) {
      return texto;
    }

    return (
      texto.substring(0, limite) +
      "..."
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
          Cargando personas no localizadas...
        </p>
      </div>
    );
  }

  // =====================================================
  // VISTA
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
            "linear-gradient(135deg, #6d6bd6, #7650b5)",
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
            <div
              style={{
                fontSize: "3rem",
              }}
            >
              🔎
            </div>

            <h1
              style={{
                margin: "8px 0",
                fontSize: "32px",
              }}
            >
              Personas no localizadas
            </h1>

            <p
              style={{
                margin: 0,
                opacity: 0.95,
              }}
            >
              Consulta las personas reportadas y
              ayúdanos a encontrarlas.
            </p>
          </div>
        </div>
      </header>

      {/* =================================================
          BUSCADOR
      ================================================= */}

      <section
        style={{
          maxWidth: "900px",
          margin: "-25px auto 0",
          padding: "0 20px",
          position: "relative",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "14px",
            boxShadow:
              "0 4px 20px rgba(0,0,0,.10)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            {/* BUSCAR NOMBRE */}

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
                  boxSizing:
                    "border-box",
                  padding:
                    "13px 15px 13px 45px",
                  border:
                    "1px solid #cbd5e1",
                  borderRadius: "9px",
                  fontSize: "16px",
                  outline: "none",
                }}
              />
            </div>

            {/* CIUDAD */}

            <select
              value={
                ciudadSeleccionada
              }
              onChange={(e) =>
                setCiudadSeleccionada(
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
              {ciudades.map(
                (ciudad) => (
                  <option
                    key={ciudad}
                    value={ciudad}
                  >
                    {ciudad ===
                    "Todas"
                      ? "📍 Todas las ciudades"
                      : ciudad}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </section>

      {/* =================================================
          CONTENIDO
      ================================================= */}

      <main
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding:
            "35px 20px 60px",
        }}
      >
        {error ? (
          <div
            style={{
              background: "#fef2f2",
              border:
                "1px solid #fecaca",
              color: "#991b1b",
              padding: "25px",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <h3>Error</h3>

            <p>{error}</p>

            <button
              onClick={
                cargarPersonas
              }
              style={{
                border: "none",
                background:
                  "#dc2626",
                color: "#fff",
                padding:
                  "10px 20px",
                borderRadius:
                  "8px",
                cursor: "pointer",
              }}
            >
              Intentar nuevamente
            </button>
          </div>
        ) : (
          <>
            {/* =================================================
                ENCABEZADO LISTADO
            ================================================= */}

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                gap: "15px",
                flexWrap:
                  "wrap",
                marginBottom:
                  "25px",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    color:
                      "#1e293b",
                  }}
                >
                  Reportes activos
                </h2>

                <p
                  style={{
                    color:
                      "#64748b",
                    margin:
                      "5px 0 0",
                  }}
                >
                  {
                    personasFiltradas.length
                  }{" "}
                  {personasFiltradas.length ===
                  1
                    ? "persona reportada"
                    : "personas reportadas"}
                </p>
              </div>

              <Link
                to="/registro"
                className="btn-registro"
                style={{
                  display:
                    "inline-flex",
                  alignItems:
                    "center",
                  gap: "7px",
                  textDecoration:
                    "none",
                }}
              >
                <Plus size={18} />
                Reportar persona
              </Link>
            </div>

            {/* =================================================
                SIN RESULTADOS
            ================================================= */}

            {personasFiltradas.length ===
            0 ? (
              <div
                style={{
                  background:
                    "#fff",
                  padding:
                    "60px 20px",
                  borderRadius:
                    "14px",
                  textAlign:
                    "center",
                  border:
                    "1px solid #e2e8f0",
                }}
              >
                <Search
                  size={60}
                  color="#94a3b8"
                />

                <h3
                  style={{
                    color:
                      "#334155",
                  }}
                >
                  No encontramos
                  coincidencias
                </h3>

                <p
                  style={{
                    color:
                      "#64748b",
                  }}
                >
                  Prueba con otro
                  nombre o selecciona
                  otra ciudad.
                </p>
              </div>
            ) : (
              /* =================================================
                 TARJETAS
              ================================================= */

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "24px",
                }}
              >
                {personasFiltradas.map(
                  (persona) => (
                    <div
                      key={
                        persona._id
                      }
                      style={{
                        background:
                          "#fff",
                        borderRadius:
                          "14px",
                        overflow:
                          "hidden",
                        border:
                          "1px solid #e2e8f0",
                        boxShadow:
                          "0 3px 12px rgba(0,0,0,.08)",
                      }}
                    >
                      {/* FOTO */}

                      <div
                        style={{
                          width:
                            "100%",
                          height:
                            "300px",
                          background:
                            "#e2e8f0",
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          overflow:
                            "hidden",
                        }}
                      >
                        {persona
                          .foto?.url ? (
                          <img
                            src={
                              persona
                                .foto
                                .url
                            }
                            alt={
                              persona.nombre
                            }
                            style={{
                              width:
                                "100%",
                              height:
                                "100%",
                              objectFit:
                                "cover",
                            }}
                          />
                        ) : (
                          <Search
                            size={80}
                            color="#94a3b8"
                          />
                        )}
                      </div>

                      {/* INFORMACIÓN */}

                      <div
                        style={{
                          padding:
                            "20px",
                        }}
                      >
                        <div
                          style={{
                            display:
                              "inline-block",
                            background:
                              "#fef2f2",
                            color:
                              "#b91c1c",
                            padding:
                              "5px 10px",
                            borderRadius:
                              "20px",
                            fontSize:
                              "12px",
                            fontWeight:
                              "700",
                            marginBottom:
                              "10px",
                          }}
                        >
                          🔴 NO LOCALIZADA
                        </div>

                        <h3
                          style={{
                            margin:
                              "4px 0 12px",
                            color:
                              "#0f172a",
                            fontSize:
                              "21px",
                          }}
                        >
                          {
                            persona.nombre
                          }
                        </h3>

                        <div
                          style={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            gap: "7px",
                            color:
                              "#475569",
                            marginBottom:
                              "8px",
                          }}
                        >
                          <MapPin
                            size={
                              17
                            }
                            color="#dc2626"
                          />

                          <strong>
                            {
                              persona.ciudad
                            }
                          </strong>
                        </div>

                        <div
                          style={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            gap: "7px",
                            color:
                              "#64748b",
                            fontSize:
                              "14px",
                            marginBottom:
                              "12px",
                          }}
                        >
                          <Calendar
                            size={
                              16
                            }
                          />

                          Reportado el{" "}
                          {formatearFecha(
                            persona.fechaCreacion
                          )}
                        </div>

                        {persona.descripcion && (
                          <p
                            style={{
                              color:
                                "#475569",
                              lineHeight:
                                "1.5",
                              fontSize:
                                "14px",
                              margin:
                                "10px 0 0",
                            }}
                          >
                            {truncarTexto(
                              persona.descripcion
                            )}
                          </p>
                        )}

                        <div
                          style={{
                            marginTop:
                              "18px",
                            paddingTop:
                              "15px",
                            borderTop:
                              "1px solid #e2e8f0",
                            color:
                              "#64748b",
                            fontSize:
                              "13px",
                          }}
                        >
                          Si reconoces a esta
                          persona, verifica la
                          información con su familia
                          antes de difundir datos
                          personales.
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer
        style={{
          background:
            "#0f172a",
          color: "#fff",
          padding:
            "25px 20px",
          textAlign:
            "center",
        }}
      >
        <div
          style={{
            maxWidth:
              "1000px",
            margin:
              "0 auto",
          }}
        >
          <strong>
            🇨🇴 Colombia se ayuda
          </strong>

          <p
            style={{
              color:
                "#cbd5e1",
              fontSize:
                "14px",
            }}
          >
            Información ciudadana para ayudar
            a localizar personas.
          </p>

          <Link
            to="/"
            style={{
              color:
                "#93c5fd",
              textDecoration:
                "none",
            }}
          >
            Volver al inicio
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Desaparecidos;
