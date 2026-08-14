import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BarChart3,
  MapPin,
  Users,
  Heart,
  Search,
  Home,
  Handshake,
  AlertTriangle,
  RefreshCw,
  Filter,
  Activity,
  ShieldCheck,
  TrendingUp,
  Package,
} from "lucide-react";

const API_URL = "https://tiendasappbackend.onrender.com";

const Reportes = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [departamento, setDepartamento] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [tipoReporte, setTipoReporte] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const [ultimaActualizacion, setUltimaActualizacion] =
    useState(null);

  const cargarDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (departamento) {
        params.append("departamento", departamento);
      }

      if (ciudad) {
        params.append("ciudad", ciudad);
      }

      if (tipoReporte) {
        params.append("tipoReporte", tipoReporte);
      }

      if (fechaInicio) {
        params.append("fechaInicio", fechaInicio);
      }

      if (fechaFin) {
        params.append("fechaFin", fechaFin);
      }

      const url =
        `${API_URL}/api/reportes/dashboard` +
        (params.toString()
          ? `?${params.toString()}`
          : "");

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          "No fue posible obtener la información del dashboard."
        );
      }

      const data = await response.json();

      if (!data.ok) {
        throw new Error(
          data.error ||
            "El servidor no pudo generar el dashboard."
        );
      }

      setDashboard(data);
      setUltimaActualizacion(new Date());
    } catch (err) {
      console.error("Error dashboard:", err);

      setError(
        err.message ||
          "Error cargando la información."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDashboard();
  }, []);

  const limpiarFiltros = () => {
    setDepartamento("");
    setCiudad("");
    setTipoReporte("");
    setFechaInicio("");
    setFechaFin("");

    setTimeout(() => {
      cargarDashboard();
    }, 0);
  };

  const resumen = dashboard?.resumen || {
    totalReportes: 0,
    personasAfectadas: 0,
    personasASalvo: 0,
    personasNoLocalizadas: 0,
    viviendasAfectadas: 0,
    personasNecesitanAyuda: 0,
    personasOfrecenAyuda: 0,
  };

  const porDepartamento =
    dashboard?.porDepartamento || [];

  const porCiudad =
    dashboard?.porCiudad || [];

  const porTipoReporte =
    dashboard?.porTipoReporte || [];

  const porNecesidad =
    dashboard?.porNecesidad || [];

  const porEstadoVivienda =
    dashboard?.porEstadoVivienda || [];

  const evolucion =
    dashboard?.evolucion || [];

  const alertas =
    dashboard?.alertas || [];

  const ubicaciones =
    dashboard?.ubicaciones || [];

  const indicadores =
    dashboard?.indicadores || {};

  const ciudadesFiltradas = useMemo(() => {
    if (!departamento) {
      return porCiudad;
    }

    return porCiudad.filter(
      (item) =>
        item.departamento === departamento
    );
  }, [porCiudad, departamento]);

  const porcentaje = (cantidad) => {
    const total =
      resumen.totalReportes || 0;

    if (!total) return 0;

    return Math.round(
      (cantidad / total) * 100
    );
  };

  const iconoTipo = (tipo) => {
    const iconos = {
      "Necesito ayuda": "🆘",
      "Daños en mi vivienda": "🏚️",
      "Persona no localizada": "🔎",
      "Estoy a salvo": "❤️",
      "Quiero ofrecer ayuda": "🤝",
      "Otro reporte": "📢",
    };

    return iconos[tipo] || "📌";
  };

  const iconoNecesidad = (necesidad) => {
    const texto =
      String(necesidad || "").toLowerCase();

    if (texto.includes("agua")) return "💧";
    if (texto.includes("alimento")) return "🍞";
    if (texto.includes("comida")) return "🍞";
    if (texto.includes("medic")) return "💊";
    if (texto.includes("salud")) return "🏥";
    if (texto.includes("médic")) return "🏥";
    if (texto.includes("aloj")) return "🏠";
    if (texto.includes("vivi")) return "🏠";
    if (texto.includes("ropa")) return "👕";
    if (texto.includes("trans")) return "🚑";
    if (texto.includes("energ")) return "⚡";
    if (texto.includes("comunic")) return "📡";
    if (texto.includes("rescate")) return "🆘";

    return "📦";
  };

  const colorTipo = (tipo) => {
    if (tipo === "Estoy a salvo") {
      return "#16a34a";
    }

    if (tipo === "Persona no localizada") {
      return "#dc2626";
    }

    if (tipo === "Necesito ayuda") {
      return "#ea580c";
    }

    if (tipo === "Daños en mi vivienda") {
      return "#d97706";
    }

    if (tipo === "Quiero ofrecer ayuda") {
      return "#2563eb";
    }

    return "#64748b";
  };

  const Barra = ({
    valor,
    maximo,
    color = "#2563eb",
  }) => {
    const porcentajeBarra =
      maximo > 0
        ? Math.max(
            3,
            Math.round(
              (valor / maximo) * 100
            )
          )
        : 0;

    return (
      <div
        style={{
          width: "100%",
          height: "10px",
          background: "#e2e8f0",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${porcentajeBarra}%`,
            height: "100%",
            background: color,
            borderRadius: "20px",
            transition:
              "width .4s ease",
          }}
        />
      </div>
    );
  };

  if (loading && !dashboard) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "30px",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "40px",
            textAlign: "center",
            boxShadow:
              "0 10px 35px rgba(15,23,42,.08)",
          }}
        >
          <RefreshCw
            size={40}
            color="#2563eb"
            style={{
              animation:
                "spin 1s linear infinite",
            }}
          />

          <h2>
            Cargando información
          </h2>

          <p
            style={{
              color: "#64748b",
            }}
          >
            Consultando los reportes ciudadanos...
          </p>
        </div>
      </div>
    );
  }

  if (error && !dashboard) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
          padding: "30px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "700px",
            margin: "80px auto",
            background: "#ffffff",
            borderRadius: "20px",
            padding: "40px",
            textAlign: "center",
            border:
              "1px solid #fecaca",
          }}
        >
          <AlertTriangle
            size={55}
            color="#dc2626"
          />

          <h2>
            No fue posible cargar los reportes
          </h2>

          <p
            style={{
              color: "#64748b",
            }}
          >
            {error}
          </p>

          <button
            onClick={cargarDashboard}
            style={{
              border: "none",
              background: "#2563eb",
              color: "#ffffff",
              padding: "13px 22px",
              borderRadius: "10px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        color: "#0f172a",
      }}
    >
      {/* HEADER */}

      <header
        style={{
          background:
            "linear-gradient(135deg,#0f172a,#1e3a5f)",
          color: "#ffffff",
          padding: "25px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "1250px",
            margin: "0 auto",
          }}
        >
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              color: "#cbd5e1",
              textDecoration: "none",
              marginBottom: "20px",
              fontSize: "14px",
            }}
          >
            <ArrowLeft size={18} />
            Volver
          </Link>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "8px",
                }}
              >
                <BarChart3 size={30} />

                <span
                  style={{
                    fontWeight: "700",
                    color: "#93c5fd",
                  }}
                >
                  CENTRO DE INFORMACIÓN
                </span>
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize:
                    "clamp(28px,4vw,42px)",
                }}
              >
                Dashboard de Emergencia
              </h1>

              <p
                style={{
                  margin:
                    "10px 0 0",
                  color: "#cbd5e1",
                }}
              >
                Información estadística de los
                reportes ciudadanos.
              </p>
            </div>

            <button
              onClick={cargarDashboard}
              disabled={loading}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "#ffffff",
                color: "#1e3a8a",
                border: "none",
                padding: "12px 18px",
                borderRadius: "10px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              <RefreshCw
                size={18}
                style={
                  loading
                    ? {
                        animation:
                          "spin 1s linear infinite",
                      }
                    : {}
                }
              />

              Actualizar
            </button>
          </div>
        </div>
      </header>

      <main
        style={{
          maxWidth: "1250px",
          margin: "0 auto",
          padding: "25px 20px 60px",
        }}
      >
        {/* FILTROS */}

        <section
          style={{
            background: "#ffffff",
            borderRadius: "18px",
            padding: "20px",
            marginBottom: "25px",
            border:
              "1px solid #e2e8f0",
            boxShadow:
              "0 4px 18px rgba(15,23,42,.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",
              marginBottom: "18px",
              gap: "15px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Filter
                size={20}
                color="#2563eb"
              />

              <strong>
                Filtros de información
              </strong>
            </div>

            <button
              onClick={limpiarFiltros}
              style={{
                border:
                  "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#475569",
                padding: "8px 13px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Limpiar filtros
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(190px,1fr))",
              gap: "14px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "700",
                  marginBottom: "6px",
                  color: "#475569",
                }}
              >
                Departamento
              </label>

              <select
                value={departamento}
                onChange={(e) => {
                  setDepartamento(
                    e.target.value
                  );
                  setCiudad("");
                }}
                style={{
                  width: "100%",
                  padding: "11px",
                  borderRadius: "9px",
                  border:
                    "1px solid #cbd5e1",
                  background: "#ffffff",
                }}
              >
                <option value="">
                  Todos los departamentos
                </option>

                {porDepartamento.map(
                  (item) => (
                    <option
                      key={item._id}
                      value={item._id}
                    >
                      {item._id}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "700",
                  marginBottom: "6px",
                  color: "#475569",
                }}
              >
                Municipio
              </label>

              <select
                value={ciudad}
                onChange={(e) =>
                  setCiudad(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "11px",
                  borderRadius: "9px",
                  border:
                    "1px solid #cbd5e1",
                  background: "#ffffff",
                }}
              >
                <option value="">
                  Todos los municipios
                </option>

                {ciudadesFiltradas.map(
                  (item) => (
                    <option
                      key={item._id}
                      value={item._id}
                    >
                      {item._id}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "700",
                  marginBottom: "6px",
                  color: "#475569",
                }}
              >
                Tipo de reporte
              </label>

              <select
                value={tipoReporte}
                onChange={(e) =>
                  setTipoReporte(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "11px",
                  borderRadius: "9px",
                  border:
                    "1px solid #cbd5e1",
                  background: "#ffffff",
                }}
              >
                <option value="">
                  Todos los tipos
                </option>

                {[
                  "Necesito ayuda",
                  "Daños en mi vivienda",
                  "Persona no localizada",
                  "Estoy a salvo",
                  "Quiero ofrecer ayuda",
                  "Otro reporte",
                ].map(
                  (tipo) => (
                    <option
                      key={tipo}
                      value={tipo}
                    >
                      {iconoTipo(tipo)}{" "}
                      {tipo}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "700",
                  marginBottom: "6px",
                  color: "#475569",
                }}
              >
                Desde
              </label>

              <input
                type="date"
                value={fechaInicio}
                onChange={(e) =>
                  setFechaInicio(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  boxSizing:
                    "border-box",
                  padding: "10px",
                  borderRadius: "9px",
                  border:
                    "1px solid #cbd5e1",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "700",
                  marginBottom: "6px",
                  color: "#475569",
                }}
              >
                Hasta
              </label>

              <input
                type="date"
                value={fechaFin}
                onChange={(e) =>
                  setFechaFin(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  boxSizing:
                    "border-box",
                  padding: "10px",
                  borderRadius: "9px",
                  border:
                    "1px solid #cbd5e1",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "end",
              }}
            >
              <button
                onClick={cargarDashboard}
                style={{
                  width: "100%",
                  padding: "11px",
                  borderRadius: "9px",
                  border: "none",
                  background: "#2563eb",
                  color: "#ffffff",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        </section>

        {ultimaActualizacion && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              color: "#64748b",
              fontSize: "13px",
              marginBottom: "15px",
            }}
          >
            <Activity size={15} />

            Actualizado:{" "}
            {ultimaActualizacion.toLocaleTimeString(
              "es-CO"
            )}
          </div>
        )}

        {/* KPIs */}

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(190px,1fr))",
            gap: "15px",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "22px",
              border:
                "1px solid #e2e8f0",
            }}
          >
            <BarChart3
              size={27}
              color="#2563eb"
            />

            <div
              style={{
                fontSize: "32px",
                fontWeight: "800",
                marginTop: "12px",
              }}
            >
              {resumen.totalReportes}
            </div>

            <div
              style={{
                color: "#64748b",
              }}
            >
              Total de reportes
            </div>
          </div>

          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "22px",
              border:
                "1px solid #e2e8f0",
            }}
          >
            <Users
              size={27}
              color="#7c3aed"
            />

            <div
              style={{
                fontSize: "32px",
                fontWeight: "800",
                marginTop: "12px",
              }}
            >
              {resumen.personasAfectadas}
            </div>

            <div
              style={{
                color: "#64748b",
              }}
            >
              Personas afectadas
            </div>
          </div>

          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "22px",
              border:
                "1px solid #bbf7d0",
            }}
          >
            <Heart
              size={27}
              color="#16a34a"
            />

            <div
              style={{
                fontSize: "32px",
                fontWeight: "800",
                marginTop: "12px",
                color: "#15803d",
              }}
            >
              {resumen.personasASalvo}
            </div>

            <div
              style={{
                color: "#64748b",
              }}
            >
              Personas a salvo
            </div>
          </div>

          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "22px",
              border:
                "1px solid #fecaca",
            }}
          >
            <Search
              size={27}
              color="#dc2626"
            />

            <div
              style={{
                fontSize: "32px",
                fontWeight: "800",
                marginTop: "12px",
                color: "#dc2626",
              }}
            >
              {resumen.personasNoLocalizadas}
            </div>

            <div
              style={{
                color: "#64748b",
              }}
            >
              No localizadas
            </div>
          </div>

          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "22px",
              border:
                "1px solid #fed7aa",
            }}
          >
            <Home
              size={27}
              color="#ea580c"
            />

            <div
              style={{
                fontSize: "32px",
                fontWeight: "800",
                marginTop: "12px",
                color: "#ea580c",
              }}
            >
              {resumen.viviendasAfectadas}
            </div>

            <div
              style={{
                color: "#64748b",
              }}
            >
              Viviendas reportadas
            </div>
          </div>

          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "22px",
              border:
                "1px solid #fed7aa",
            }}
          >
            <AlertTriangle
              size={27}
              color="#f97316"
            />

            <div
              style={{
                fontSize: "32px",
                fontWeight: "800",
                marginTop: "12px",
                color: "#ea580c",
              }}
            >
              {resumen.personasNecesitanAyuda}
            </div>

            <div
              style={{
                color: "#64748b",
              }}
            >
              Solicitan ayuda
            </div>
          </div>

          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "22px",
              border:
                "1px solid #bfdbfe",
            }}
          >
            <Handshake
              size={27}
              color="#2563eb"
            />

            <div
              style={{
                fontSize: "32px",
                fontWeight: "800",
                marginTop: "12px",
                color: "#2563eb",
              }}
            >
              {resumen.personasOfrecenAyuda}
            </div>

            <div
              style={{
                color: "#64748b",
              }}
            >
              Ofrecen ayuda
            </div>
          </div>
        </section>

        {/* ALERTAS */}

        {alertas.length > 0 && (
          <section
            style={{
              background: "#ffffff",
              borderRadius: "18px",
              padding: "22px",
              marginBottom: "25px",
              border:
                "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "18px",
              }}
            >
              <AlertTriangle
                color="#dc2626"
                size={22}
              />

              <h2
                style={{
                  margin: 0,
                  fontSize: "20px",
                }}
              >
                Situaciones relevantes
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gap: "10px",
              }}
            >
              {alertas.map(
                (alerta, index) => {
                  const critico =
                    alerta.nivel ===
                    "critico";

                  const alto =
                    alerta.nivel ===
                    "alto";

                  return (
                    <div
                      key={index}
                      style={{
                        padding: "15px",
                        borderRadius: "12px",
                        background:
                          critico
                            ? "#fef2f2"
                            : alto
                            ? "#fff7ed"
                            : "#eff6ff",
                        border: `1px solid ${
                          critico
                            ? "#fecaca"
                            : alto
                            ? "#fed7aa"
                            : "#bfdbfe"
                        }`,
                      }}
                    >
                      <div
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          gap: "10px",
                          flexWrap:
                            "wrap",
                        }}
                      >
                        <strong>
                          {alerta.tipo}
                        </strong>

                        <strong>
                          {alerta.cantidad}
                        </strong>
                      </div>

                      <div
                        style={{
                          marginTop: "5px",
                          color:
                            "#64748b",
                          fontSize:
                            "14px",
                        }}
                      >
                        {alerta.mensaje}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </section>
        )}

        {/* INDICADORES */}

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(250px,1fr))",
            gap: "18px",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              padding: "22px",
              borderRadius: "16px",
              border:
                "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                color: "#64748b",
                fontSize: "14px",
                marginBottom: "8px",
              }}
            >
              Municipio con más reportes
            </div>

            <div
              style={{
                fontSize: "24px",
                fontWeight: "800",
              }}
            >
              {indicadores
                .municipioMasReportado
                ? indicadores
                    .municipioMasReportado
                    ._id
                : "Sin datos"}
            </div>

            {indicadores
              .municipioMasReportado && (
              <div
                style={{
                  marginTop: "6px",
                  color: "#64748b",
                }}
              >
                {
                  indicadores
                    .municipioMasReportado
                    .reportes
                }{" "}
                reportes
              </div>
            )}
          </div>

          <div
            style={{
              background: "#ffffff",
              padding: "22px",
              borderRadius: "16px",
              border:
                "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                color: "#64748b",
                fontSize: "14px",
                marginBottom: "8px",
              }}
            >
              Departamento con más reportes
            </div>

            <div
              style={{
                fontSize: "24px",
                fontWeight: "800",
              }}
            >
              {indicadores
                .departamentoMasReportado
                ? indicadores
                    .departamentoMasReportado
                    ._id
                : "Sin datos"}
            </div>

            {indicadores
              .departamentoMasReportado && (
              <div
                style={{
                  marginTop: "6px",
                  color: "#64748b",
                }}
              >
                {
                  indicadores
                    .departamentoMasReportado
                    .reportes
                }{" "}
                reportes
              </div>
            )}
          </div>

          <div
            style={{
              background: "#ffffff",
              padding: "22px",
              borderRadius: "16px",
              border:
                "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                color: "#64748b",
                fontSize: "14px",
                marginBottom: "8px",
              }}
            >
              Necesidad prioritaria
            </div>

            <div
              style={{
                fontSize: "24px",
                fontWeight: "800",
              }}
            >
              {indicadores
                .necesidadPrioritaria
                ? `${iconoNecesidad(
                    indicadores
                      .necesidadPrioritaria
                      ._id
                  )} ${
                    indicadores
                      .necesidadPrioritaria
                      ._id
                  }`
                : "Sin datos"}
            </div>

            {indicadores
              .necesidadPrioritaria && (
              <div
                style={{
                  marginTop: "6px",
                  color: "#64748b",
                }}
              >
                {
                  indicadores
                    .necesidadPrioritaria
                    .cantidad
                }{" "}
                reportes
              </div>
            )}
          </div>
        </section>

        {/* DEPARTAMENTOS / TIPOS */}

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(330px,1fr))",
            gap: "20px",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "18px",
              padding: "22px",
              border:
                "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "20px",
              }}
            >
              <MapPin
                size={22}
                color="#2563eb"
              />

              <h2
                style={{
                  margin: 0,
                  fontSize: "20px",
                }}
              >
                Reportes por departamento
              </h2>
            </div>

            {porDepartamento.length ===
            0 ? (
              <p
                style={{
                  color: "#64748b",
                }}
              >
                No hay información.
              </p>
            ) : (
              porDepartamento.map(
                (item) => {
                  const maximo =
                    porDepartamento[0]
                      ?.reportes || 1;

                  return (
                    <div
                      key={item._id}
                      style={{
                        marginBottom:
                          "17px",
                      }}
                    >
                      <div
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          marginBottom:
                            "6px",
                        }}
                      >
                        <strong>
                          {item._id}
                        </strong>

                        <span>
                          {item.reportes}
                        </span>
                      </div>

                      <Barra
                        valor={
                          item.reportes
                        }
                        maximo={
                          maximo
                        }
                        color="#2563eb"
                      />

                      <div
                        style={{
                          display:
                            "flex",
                          gap: "12px",
                          marginTop:
                            "6px",
                          fontSize:
                            "12px",
                          color:
                            "#64748b",
                          flexWrap:
                            "wrap",
                        }}
                      >
                        <span>
                          👥{" "}
                          {
                            item.personasAfectadas
                          }
                        </span>

                        <span>
                          ❤️{" "}
                          {item.aSalvo}
                        </span>

                        <span>
                          🔎{" "}
                          {
                            item.noLocalizadas
                          }
                        </span>

                        <span>
                          🆘{" "}
                          {
                            item.necesitanAyuda
                          }
                        </span>
                      </div>
                    </div>
                  );
                }
              )
            )}
          </div>

          <div
            style={{
              background: "#ffffff",
              borderRadius: "18px",
              padding: "22px",
              border:
                "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "20px",
              }}
            >
              <Activity
                size={22}
                color="#7c3aed"
              />

              <h2
                style={{
                  margin: 0,
                  fontSize: "20px",
                }}
              >
                Tipos de reporte
              </h2>
            </div>

            {porTipoReporte.length ===
            0 ? (
              <p
                style={{
                  color: "#64748b",
                }}
              >
                No hay información.
              </p>
            ) : (
              porTipoReporte.map(
                (item) => {
                  const maximo =
                    porTipoReporte[0]
                      ?.cantidad || 1;

                  return (
                    <div
                      key={item._id}
                      style={{
                        marginBottom:
                          "17px",
                      }}
                    >
                      <div
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "space-between",
                          marginBottom:
                            "6px",
                        }}
                      >
                        <span>
                          {iconoTipo(
                            item._id
                          )}{" "}
                          {item._id}
                        </span>

                        <strong>
                          {
                            item.cantidad
                          }
                        </strong>
                      </div>

                      <Barra
                        valor={
                          item.cantidad
                        }
                        maximo={
                          maximo
                        }
                        color={colorTipo(
                          item._id
                        )}
                      />

                      <div
                        style={{
                          marginTop:
                            "5px",
                          color:
                            "#64748b",
                          fontSize:
                            "12px",
                        }}
                      >
                        {
                          item.personasAfectadas
                        }{" "}
                        personas afectadas
                      </div>
                    </div>
                  );
                }
              )
            )}
          </div>
        </section>

        {/* MUNICIPIOS */}

        <section
          style={{
            background: "#ffffff",
            borderRadius: "18px",
            padding: "22px",
            border:
              "1px solid #e2e8f0",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "20px",
            }}
          >
            <MapPin
              size={22}
              color="#ea580c"
            />

            <h2
              style={{
                margin: 0,
                fontSize: "20px",
              }}
            >
              Ranking de municipios
            </h2>
          </div>

          {porCiudad.length === 0 ? (
            <p
              style={{
                color: "#64748b",
              }}
            >
              No hay información disponible.
            </p>
          ) : (
            <div
              style={{
                overflowX: "auto",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse:
                    "collapse",
                  minWidth: "700px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background:
                        "#f8fafc",
                      textAlign: "left",
                    }}
                  >
                    <th
                      style={{
                        padding: "12px",
                      }}
                    >
                      #
                    </th>

                    <th
                      style={{
                        padding: "12px",
                      }}
                    >
                      Municipio
                    </th>

                    <th
                      style={{
                        padding: "12px",
                      }}
                    >
                      Departamento
                    </th>

                    <th
                      style={{
                        padding: "12px",
                      }}
                    >
                      Reportes
                    </th>

                    <th
                      style={{
                        padding: "12px",
                      }}
                    >
                      Personas
                    </th>

                    <th
                      style={{
                        padding: "12px",
                      }}
                    >
                      A salvo
                    </th>

                    <th
                      style={{
                        padding: "12px",
                      }}
                    >
                      No localizadas
                    </th>

                    <th
                      style={{
                        padding: "12px",
                      }}
                    >
                      Ayuda
                    </th>

                    <th
                      style={{
                        padding: "12px",
                      }}
                    >
                      Viviendas
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {porCiudad.map(
                    (item, index) => (
                      <tr
                        key={item._id}
                        style={{
                          borderTop:
                            "1px solid #e2e8f0",
                        }}
                      >
                        <td
                          style={{
                            padding: "12px",
                            fontWeight:
                              "700",
                          }}
                        >
                          {index + 1}
                        </td>

                        <td
                          style={{
                            padding: "12px",
                            fontWeight:
                              "700",
                          }}
                        >
                          {item._id}
                        </td>

                        <td
                          style={{
                            padding: "12px",
                            color:
                              "#64748b",
                          }}
                        >
                          {
                            item.departamento
                          }
                        </td>

                        <td
                          style={{
                            padding: "12px",
                          }}
                        >
                          {item.reportes}
                        </td>

                        <td
                          style={{
                            padding: "12px",
                          }}
                        >
                          {
                            item.personasAfectadas
                          }
                        </td>

                        <td
                          style={{
                            padding: "12px",
                            color:
                              "#16a34a",
                            fontWeight:
                              "700",
                          }}
                        >
                          {item.aSalvo}
                        </td>

                        <td
                          style={{
                            padding: "12px",
                            color:
                              item.noLocalizadas >
                              0
                                ? "#dc2626"
                                : "#64748b",
                            fontWeight:
                              "700",
                          }}
                        >
                          {
                            item.noLocalizadas
                          }
                        </td>

                        <td
                          style={{
                            padding: "12px",
                            color:
                              "#ea580c",
                          }}
                        >
                          {
                            item.necesitanAyuda
                          }
                        </td>

                        <td
                          style={{
                            padding: "12px",
                          }}
                        >
                          {item.viviendas}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* NECESIDADES / VIVIENDAS */}

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(330px,1fr))",
            gap: "20px",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "18px",
              padding: "22px",
              border:
                "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "20px",
              }}
            >
              <Package
                size={22}
                color="#ea580c"
              />

              <h2
                style={{
                  margin: 0,
                  fontSize: "20px",
                }}
              >
                Necesidades reportadas
              </h2>
            </div>

            {porNecesidad.length ===
            0 ? (
              <p
                style={{
                  color: "#64748b",
                }}
              >
                No se han registrado necesidades.
              </p>
            ) : (
              porNecesidad.map(
                (item) => {
                  const maximo =
                    porNecesidad[0]
                      ?.cantidad || 1;

                  return (
                    <div
                      key={item._id}
                      style={{
                        marginBottom:
                          "17px",
                      }}
                    >
                      <div
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          marginBottom:
                            "6px",
                        }}
                      >
                        <span>
                          {iconoNecesidad(
                            item._id
                          )}{" "}
                          {item._id}
                        </span>

                        <strong>
                          {
                            item.cantidad
                          }
                        </strong>
                      </div>

                      <Barra
                        valor={
                          item.cantidad
                        }
                        maximo={
                          maximo
                        }
                        color="#ea580c"
                      />
                    </div>
                  );
                }
              )
            )}
          </div>

          <div
            style={{
              background: "#ffffff",
              borderRadius: "18px",
              padding: "22px",
              border:
                "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "20px",
              }}
            >
              <Home
                size={22}
                color="#d97706"
              />

              <h2
                style={{
                  margin: 0,
                  fontSize: "20px",
                }}
              >
                Estado de viviendas
              </h2>
            </div>

            {porEstadoVivienda.length ===
            0 ? (
              <p
                style={{
                  color: "#64748b",
                }}
              >
                No hay información de estado de viviendas.
              </p>
            ) : (
              porEstadoVivienda.map(
                (item) => {
                  const maximo =
                    porEstadoVivienda[0]
                      ?.cantidad || 1;

                  return (
                    <div
                      key={item._id}
                      style={{
                        marginBottom:
                          "17px",
                      }}
                    >
                      <div
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          marginBottom:
                            "6px",
                        }}
                      >
                        <span>
                          {item._id}
                        </span>

                        <strong>
                          {
                            item.cantidad
                          }
                        </strong>
                      </div>

                      <Barra
                        valor={
                          item.cantidad
                        }
                        maximo={
                          maximo
                        }
                        color="#d97706"
                      />
                    </div>
                  );
                }
              )
            )}
          </div>
        </section>

        {/* EVOLUCIÓN */}

        <section
          style={{
            background: "#ffffff",
            borderRadius: "18px",
            padding: "22px",
            border:
              "1px solid #e2e8f0",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "20px",
            }}
          >
            <TrendingUp
              size={22}
              color="#2563eb"
            />

            <h2
              style={{
                margin: 0,
                fontSize: "20px",
              }}
            >
              Evolución de reportes
            </h2>
          </div>

          {evolucion.length === 0 ? (
            <p
              style={{
                color: "#64748b",
              }}
            >
              Todavía no hay suficiente información temporal.
            </p>
          ) : (
            <div
              style={{
                overflowX: "auto",
              }}
            >
              <div
                style={{
                  minWidth: Math.max(
                    650,
                    evolucion.length *
                      90
                  ),
                  display: "flex",
                  alignItems:
                    "flex-end",
                  gap: "15px",
                  height: "270px",
                  padding:
                    "20px 10px 10px",
                }}
              >
                {evolucion.map(
                  (item) => {
                    const maximo =
                      Math.max(
                        ...evolucion.map(
                          (x) =>
                            x.reportes
                        ),
                        1
                      );

                    const altura =
                      Math.max(
                        12,
                        (item.reportes /
                          maximo) *
                          190
                      );

                    return (
                      <div
                        key={item._id}
                        style={{
                          flex: 1,
                          minWidth:
                            "55px",
                          display:
                            "flex",
                          flexDirection:
                            "column",
                          alignItems:
                            "center",
                          justifyContent:
                            "flex-end",
                          height:
                            "100%",
                        }}
                      >
                        <strong
                          style={{
                            fontSize:
                              "13px",
                            marginBottom:
                              "6px",
                          }}
                        >
                          {
                            item.reportes
                          }
                        </strong>

                        <div
                          style={{
                            width:
                              "100%",
                            maxWidth:
                              "45px",
                            height: `${altura}px`,
                            background:
                              "#2563eb",
                            borderRadius:
                              "7px 7px 2px 2px",
                          }}
                        />

                        <span
                          style={{
                            fontSize:
                              "11px",
                            color:
                              "#64748b",
                            marginTop:
                              "8px",
                            transform:
                              "rotate(-40deg)",
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {item._id}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}
        </section>

        {/* INDICADORES GENERALES */}

        <section
          style={{
            background: "#ffffff",
            borderRadius: "18px",
            padding: "22px",
            border:
              "1px solid #e2e8f0",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "20px",
            }}
          >
            <ShieldCheck
              size={22}
              color="#16a34a"
            />

            <h2
              style={{
                margin: 0,
                fontSize: "20px",
              }}
            >
              Indicadores generales
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(180px,1fr))",
              gap: "15px",
            }}
          >
            <div
              style={{
                background: "#f0fdf4",
                padding: "18px",
                borderRadius: "12px",
              }}
            >
              <strong
                style={{
                  fontSize: "24px",
                  color: "#15803d",
                }}
              >
                {porcentaje(
                  resumen.personasASalvo
                )}
                %
              </strong>

              <div
                style={{
                  color: "#475569",
                  marginTop: "5px",
                }}
              >
                Personas reportadas a salvo
              </div>
            </div>

            <div
              style={{
                background: "#fef2f2",
                padding: "18px",
                borderRadius: "12px",
              }}
            >
              <strong
                style={{
                  fontSize: "24px",
                  color: "#dc2626",
                }}
              >
                {porcentaje(
                  resumen.personasNoLocalizadas
                )}
                %
              </strong>

              <div
                style={{
                  color: "#475569",
                  marginTop: "5px",
                }}
              >
                Personas no localizadas
              </div>
            </div>

            <div
              style={{
                background: "#fff7ed",
                padding: "18px",
                borderRadius: "12px",
              }}
            >
              <strong
                style={{
                  fontSize: "24px",
                  color: "#ea580c",
                }}
              >
                {porcentaje(
                  resumen.personasNecesitanAyuda
                )}
                %
              </strong>

              <div
                style={{
                  color: "#475569",
                  marginTop: "5px",
                }}
              >
                Solicitudes de ayuda
              </div>
            </div>

            <div
              style={{
                background: "#eff6ff",
                padding: "18px",
                borderRadius: "12px",
              }}
            >
              <strong
                style={{
                  fontSize: "24px",
                  color: "#2563eb",
                }}
              >
                {porcentaje(
                  resumen.personasOfrecenAyuda
                )}
                %
              </strong>

              <div
                style={{
                  color: "#475569",
                  marginTop: "5px",
                }}
              >
                Personas ofreciendo ayuda
              </div>
            </div>
          </div>
        </section>

        {/* MAPA */}

        <section
          style={{
            background: "#ffffff",
            borderRadius: "18px",
            padding: "22px",
            border:
              "1px solid #e2e8f0",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",
              gap: "15px",
              flexWrap: "wrap",
              marginBottom: "18px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <MapPin
                size={22}
                color="#2563eb"
              />

              <h2
                style={{
                  margin: 0,
                  fontSize: "20px",
                }}
              >
                Información geográfica
              </h2>
            </div>

            <span
              style={{
                background: "#eff6ff",
                color: "#1d4ed8",
                padding:
                  "6px 10px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "700",
              }}
            >
              {ubicaciones.length} ubicaciones
            </span>
          </div>

          <div
            style={{
              background:
                "linear-gradient(135deg,#e0f2fe,#eff6ff)",
              minHeight: "220px",
              borderRadius: "14px",
              display: "flex",
              flexDirection:
                "column",
              alignItems: "center",
              justifyContent:
                "center",
              textAlign: "center",
              padding: "25px",
              border:
                "1px solid #bfdbfe",
            }}
          >
            <MapPin
              size={48}
              color="#2563eb"
            />

            <h3
              style={{
                margin:
                  "12px 0 6px",
              }}
            >
              Mapa de reportes
            </h3>

            {ubicaciones.length >
            0 ? (
              <p
                style={{
                  margin: 0,
                  color: "#475569",
                  maxWidth:
                    "600px",
                }}
              >
                Existen{" "}
                <strong>
                  {ubicaciones.length}
                </strong>{" "}
                reportes con coordenadas disponibles.
                La información está preparada para
                representarse en un mapa geográfico.
              </p>
            ) : (
              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  maxWidth:
                    "600px",
                }}
              >
                Todavía no existen suficientes coordenadas
                registradas.
              </p>
            )}
          </div>
        </section>

        {/* FOOTER */}

        <footer
          style={{
            textAlign: "center",
            padding: "20px",
            color: "#64748b",
            fontSize: "13px",
          }}
        >
          <p
            style={{
              margin: 0,
            }}
          >
            🇨🇴 Sistema de Información de Ayuda Ciudadana
          </p>

          <p
            style={{
              margin:
                "6px 0 0",
            }}
          >
            La información mostrada es estadística y
            proviene de reportes ciudadanos.
          </p>
        </footer>
      </main>

      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          button:hover {
            opacity: .92;
          }

          a:hover {
            opacity: .88;
          }
        `}
      </style>
    </div>
  );
};

export default Reportes;
