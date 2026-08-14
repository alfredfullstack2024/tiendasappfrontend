import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "https://tiendasappbackend.onrender.com";

// =====================================================
// UTILIDADES
// =====================================================

const texto = (valor, defecto = "Sin información") => {
  if (valor === null || valor === undefined || valor === "") {
    return defecto;
  }

  if (typeof valor === "object") {
    if (valor._id !== undefined) {
      return String(valor._id);
    }

    if (valor.nombre !== undefined) {
      return String(valor.nombre);
    }

    if (valor.ciudad !== undefined) {
      return String(valor.ciudad);
    }

    if (valor.departamento !== undefined) {
      return String(valor.departamento);
    }

    return defecto;
  }

  return String(valor);
};

const numero = (valor) => {
  const n = Number(valor);
  return Number.isFinite(n) ? n : 0;
};

const formatoNumero = (valor) => {
  return numero(valor).toLocaleString("es-CO");
};

const formatoFecha = (fecha) => {
  if (!fecha) return "Sin fecha";

  try {
    return new Date(fecha).toLocaleString("es-CO", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return "Sin fecha";
  }
};

const porcentaje = (valor, total) => {
  if (!total) return 0;

  return Math.round((numero(valor) / numero(total)) * 100);
};

// =====================================================
// COMPONENTE PRINCIPAL
// =====================================================

const ReportesAutoridades = () => {
  const navigate = useNavigate();

  // ===================================================
  // ESTADO DASHBOARD
  // ===================================================

  const [dashboard, setDashboard] = useState(null);

  const [cargando, setCargando] = useState(true);

  const [error, setError] = useState("");

  // ===================================================
  // FILTROS
  // ===================================================

  const [departamento, setDepartamento] = useState("");

  const [ciudad, setCiudad] = useState("");

  const [tipoReporte, setTipoReporte] = useState("");

  const [fechaInicio, setFechaInicio] = useState("");

  const [fechaFin, setFechaFin] = useState("");

  // ===================================================
  // BASE DE DATOS PRIVADA
  // ===================================================

  const [mostrarBase, setMostrarBase] = useState(false);

  const [reportes, setReportes] = useState([]);

  const [cargandoBase, setCargandoBase] = useState(false);

  const [errorBase, setErrorBase] = useState("");

  const [buscar, setBuscar] = useState("");

  const [pagina, setPagina] = useState(1);

  const [totalPaginas, setTotalPaginas] = useState(1);

  const [totalRegistros, setTotalRegistros] = useState(0);

  const [reporteSeleccionado, setReporteSeleccionado] =
    useState(null);

  const [cargandoDetalle, setCargandoDetalle] =
    useState(false);

  // ===================================================
  // MUNICIPIOS / DEPARTAMENTOS
  // ===================================================

  const [municipios, setMunicipios] = useState([]);

  const [departamentos, setDepartamentos] = useState([]);

  const [tipos, setTipos] = useState([]);

  // ===================================================
  // CARGAR OPCIONES
  // ===================================================

  useEffect(() => {
    cargarOpciones();
  }, []);

  const cargarOpciones = async () => {
    try {
      const [
        municipiosResponse,
        departamentosResponse,
        tiposResponse,
      ] = await Promise.all([
        axios.get(`${API_URL}/api/municipios`),
        axios.get(`${API_URL}/api/departamentos`),
        axios.get(`${API_URL}/api/tipos-reporte`),
      ]);

      if (Array.isArray(municipiosResponse.data)) {
        setMunicipios(municipiosResponse.data);
      }

      if (Array.isArray(departamentosResponse.data)) {
        setDepartamentos(departamentosResponse.data);
      }

      if (Array.isArray(tiposResponse.data)) {
        setTipos(tiposResponse.data);
      }
    } catch (err) {
      console.error("Error cargando opciones:", err);
    }
  };

  // ===================================================
  // CARGAR DASHBOARD
  // ===================================================

  useEffect(() => {
    cargarDashboard();
  }, []);

  const cargarDashboard = async () => {
    setCargando(true);
    setError("");

    try {
      const params = {};

      if (departamento) {
        params.departamento = departamento;
      }

      if (ciudad) {
        params.ciudad = ciudad;
      }

      if (tipoReporte) {
        params.tipoReporte = tipoReporte;
      }

      if (fechaInicio) {
        params.fechaInicio = fechaInicio;
      }

      if (fechaFin) {
        params.fechaFin = fechaFin;
      }

      const response = await axios.get(
        `${API_URL}/api/reportes/dashboard`,
        {
          params,
          withCredentials: true,
        }
      );

      if (!response.data || response.data.ok !== true) {
        throw new Error(
          response.data?.error ||
            "No fue posible cargar el dashboard"
        );
      }

      setDashboard(response.data);
    } catch (err) {
      console.error("Error dashboard:", err);

      if (err.response?.status === 401) {
        setError(
          "La sesión de autoridad no está activa o ha expirado."
        );
      } else {
        setError(
          err.response?.data?.error ||
            "No fue posible cargar los reportes."
        );
      }
    } finally {
      setCargando(false);
    }
  };

  // ===================================================
  // APLICAR FILTROS
  // ===================================================

  const aplicarFiltros = () => {
    setPagina(1);
    cargarDashboard();

    if (mostrarBase) {
      cargarBase(1);
    }
  };

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

  // ===================================================
  // CARGAR BASE PRIVADA
  // ===================================================

  const cargarBase = async (paginaSolicitada = pagina) => {
    setCargandoBase(true);
    setErrorBase("");

    try {
      const params = {
        pagina: paginaSolicitada,
        limite: 25,
      };

      if (buscar.trim()) {
        params.buscar = buscar.trim();
      }

      if (ciudad) {
        params.ciudad = ciudad;
      }

      if (departamento) {
        params.departamento = departamento;
      }

      if (tipoReporte) {
        params.tipoReporte = tipoReporte;
      }

      if (fechaInicio) {
        params.fechaInicio = fechaInicio;
      }

      if (fechaFin) {
        params.fechaFin = fechaFin;
      }

      const response = await axios.get(
        `${API_URL}/api/reportes/detallados`,
        {
          params,
          withCredentials: true,
        }
      );

      if (!response.data || response.data.ok !== true) {
        throw new Error(
          response.data?.error ||
            "No fue posible cargar la información"
        );
      }

      setReportes(
        Array.isArray(response.data.reportes)
          ? response.data.reportes
          : []
      );

      setPagina(numero(response.data.pagina) || 1);

      setTotalPaginas(
        Math.max(
          numero(response.data.totalPaginas) || 1,
          1
        )
      );

      setTotalRegistros(
        numero(response.data.total)
      );
    } catch (err) {
      console.error("Error base privada:", err);

      if (err.response?.status === 401) {
        setErrorBase(
          "La sesión de autoridad expiró."
        );
      } else {
        setErrorBase(
          err.response?.data?.error ||
            "No fue posible cargar la información privada."
        );
      }
    } finally {
      setCargandoBase(false);
    }
  };

  // ===================================================
  // ACTIVAR BASE
  // ===================================================

  useEffect(() => {
    if (mostrarBase) {
      cargarBase(1);
    }
  }, [mostrarBase]);

  // ===================================================
  // VER DETALLE
  // ===================================================

  const verDetalle = async (id) => {
    if (!id) return;

    setCargandoDetalle(true);

    try {
      const response = await axios.get(
        `${API_URL}/api/reportes/detallados/${id}`,
        {
          withCredentials: true,
        }
      );

      if (response.data?.ok) {
        setReporteSeleccionado(
          response.data.reporte
        );
      }
    } catch (err) {
      console.error(
        "Error obteniendo detalle:",
        err
      );

      if (err.response?.status === 401) {
        setErrorBase(
          "La sesión de autoridad expiró."
        );
      }
    } finally {
      setCargandoDetalle(false);
    }
  };

  // ===================================================
  // CERRAR SESIÓN
  // ===================================================

  const cerrarSesion = async () => {
    try {
      await axios.post(
        `${API_URL}/api/admin/logout`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      console.error(
        "Error cerrando sesión:",
        err
      );
    }

    navigate("/centro-control");
  };

  // ===================================================
  // DATOS SEGUROS
  // ===================================================

  const resumen = dashboard?.resumen || {};

  const indicadores =
    dashboard?.indicadores || {};

  const porDepartamento =
    Array.isArray(dashboard?.porDepartamento)
      ? dashboard.porDepartamento
      : [];

  const porCiudad =
    Array.isArray(dashboard?.porCiudad)
      ? dashboard.porCiudad
      : [];

  const porTipoReporte =
    Array.isArray(dashboard?.porTipoReporte)
      ? dashboard.porTipoReporte
      : [];

  const porNecesidad =
    Array.isArray(dashboard?.porNecesidad)
      ? dashboard.porNecesidad
      : [];

  const porEstadoVivienda =
    Array.isArray(
      dashboard?.porEstadoVivienda
    )
      ? dashboard.porEstadoVivienda
      : [];

  const evolucion =
    Array.isArray(dashboard?.evolucion)
      ? dashboard.evolucion
      : [];

  const ubicaciones =
    Array.isArray(dashboard?.ubicaciones)
      ? dashboard.ubicaciones
      : [];

  const alertas =
    Array.isArray(indicadores.alertas)
      ? indicadores.alertas
      : [];

  // ===================================================
  // MÁXIMOS PARA BARRAS
  // ===================================================

  const maxTipo = useMemo(() => {
    return Math.max(
      1,
      ...porTipoReporte.map((item) =>
        numero(item?.cantidad)
      )
    );
  }, [porTipoReporte]);

  const maxNecesidad = useMemo(() => {
    return Math.max(
      1,
      ...porNecesidad.map((item) =>
        numero(item?.cantidad)
      )
    );
  }, [porNecesidad]);

  const maxCiudad = useMemo(() => {
    return Math.max(
      1,
      ...porCiudad.map((item) =>
        numero(item?.reportes)
      )
    );
  }, [porCiudad]);

  const maxDepartamento = useMemo(() => {
    return Math.max(
      1,
      ...porDepartamento.map((item) =>
        numero(item?.reportes)
      )
    );
  }, [porDepartamento]);

  // ===================================================
  // ESTILOS
  // ===================================================

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#f4f6f9",
      color: "#172033",
      fontFamily:
        "Arial, Helvetica, sans-serif",
      paddingBottom: "50px",
    },

    header: {
      background:
        "linear-gradient(135deg, #10234d, #174ea6)",
      color: "#fff",
      padding: "22px 30px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "20px",
      flexWrap: "wrap",
      boxShadow:
        "0 3px 15px rgba(0,0,0,.15)",
    },

    title: {
      margin: 0,
      fontSize: "26px",
      fontWeight: 800,
    },

    subtitle: {
      margin:
        "7px 0 0",
      opacity: 0.88,
      fontSize: "14px",
    },

    headerActions: {
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
    },

    button: {
      border: "none",
      borderRadius: "8px",
      padding: "10px 15px",
      cursor: "pointer",
      fontWeight: 700,
      fontSize: "14px",
    },

    container: {
      maxWidth: "1500px",
      margin: "0 auto",
      padding: "25px",
    },

    filters: {
      background: "#fff",
      borderRadius: "14px",
      padding: "20px",
      marginBottom: "22px",
      boxShadow:
        "0 3px 15px rgba(0,0,0,.07)",
    },

    filterGrid: {
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "12px",
    },

    label: {
      display: "block",
      fontSize: "12px",
      fontWeight: 700,
      marginBottom: "6px",
      color: "#475569",
    },

    input: {
      width: "100%",
      boxSizing: "border-box",
      border:
        "1px solid #cbd5e1",
      borderRadius: "8px",
      padding: "10px",
      fontSize: "14px",
      background: "#fff",
    },

    card: {
      background: "#fff",
      borderRadius: "14px",
      padding: "20px",
      boxShadow:
        "0 3px 15px rgba(0,0,0,.07)",
      marginBottom: "20px",
    },

    sectionTitle: {
      margin:
        "0 0 16px",
      fontSize: "19px",
      fontWeight: 800,
    },

    grid4: {
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "15px",
      marginBottom: "20px",
    },

    metric: {
      borderRadius: "12px",
      padding: "18px",
      background: "#fff",
      border:
        "1px solid #e2e8f0",
      boxShadow:
        "0 2px 8px rgba(0,0,0,.04)",
    },

    metricLabel: {
      fontSize: "13px",
      color: "#64748b",
      fontWeight: 700,
    },

    metricValue: {
      fontSize: "30px",
      fontWeight: 900,
      marginTop: "7px",
    },

    metricSmall: {
      marginTop: "5px",
      fontSize: "12px",
      color: "#64748b",
    },

    twoColumns: {
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit, minmax(350px, 1fr))",
      gap: "20px",
    },

    tableWrapper: {
      overflowX: "auto",
      width: "100%",
    },

    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "13px",
    },

    th: {
      background: "#f1f5f9",
      textAlign: "left",
      padding: "11px",
      borderBottom:
        "1px solid #cbd5e1",
      whiteSpace: "nowrap",
    },

    td: {
      padding: "11px",
      borderBottom:
        "1px solid #e2e8f0",
      verticalAlign: "top",
    },

    barContainer: {
      marginBottom: "14px",
    },

    barHeader: {
      display: "flex",
      justifyContent: "space-between",
      gap: "10px",
      marginBottom: "5px",
      fontSize: "13px",
    },

    barBackground: {
      width: "100%",
      height: "10px",
      borderRadius: "10px",
      background: "#e2e8f0",
      overflow: "hidden",
    },

    bar: {
      height: "100%",
      borderRadius: "10px",
      background: "#2563eb",
    },

    alert: {
      borderRadius: "10px",
      padding: "14px",
      marginBottom: "10px",
      border:
        "1px solid #fed7aa",
      background: "#fff7ed",
    },

    empty: {
      textAlign: "center",
      padding: "30px",
      color: "#64748b",
    },

    modalOverlay: {
      position: "fixed",
      inset: 0,
      background:
        "rgba(0,0,0,.65)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      padding: "20px",
    },

    modal: {
      width: "100%",
      maxWidth: "900px",
      maxHeight: "90vh",
      overflowY: "auto",
      background: "#fff",
      borderRadius: "15px",
      padding: "25px",
      boxShadow:
        "0 20px 50px rgba(0,0,0,.3)",
    },
  };

  // ===================================================
  // LOADING
  // ===================================================

  if (cargando) {
    return (
      <div
        style={{
          ...styles.page,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            textAlign: "center",
            background: "#fff",
            padding: "40px",
            borderRadius: "15px",
            boxShadow:
              "0 5px 25px rgba(0,0,0,.1)",
          }}
        >
          <div
            style={{
              fontSize: "45px",
              marginBottom: "15px",
            }}
          >
            📊
          </div>

          <h2>
            Cargando información
          </h2>

          <p>
            Consultando los reportes
            ciudadanos...
          </p>
        </div>
      </div>
    );
  }

  // ===================================================
  // ERROR
  // ===================================================

  if (error) {
    return (
      <div
        style={{
          ...styles.page,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "40px",
            borderRadius: "15px",
            textAlign: "center",
            maxWidth: "600px",
            boxShadow:
              "0 5px 25px rgba(0,0,0,.1)",
          }}
        >
          <div
            style={{
              fontSize: "55px",
            }}
          >
            ⚠️
          </div>

          <h2>
            No fue posible cargar los
            reportes
          </h2>

          <p
            style={{
              color: "#b91c1c",
            }}
          >
            {error}
          </p>

          <button
            onClick={cargarDashboard}
            style={{
              ...styles.button,
              background: "#2563eb",
              color: "#fff",
            }}
          >
            🔄 Intentar nuevamente
          </button>

          <button
            onClick={() =>
              navigate("/centro-control")
            }
            style={{
              ...styles.button,
              background: "#e2e8f0",
              color: "#172033",
              marginLeft: "10px",
            }}
          >
            ← Volver
          </button>
        </div>
      </div>
    );
  }

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div style={styles.page}>
      {/* ============================================= */}
      {/* HEADER */}
      {/* ============================================= */}

      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>
            🇨🇴 Centro de Información de
            Emergencia
          </h1>

          <p style={styles.subtitle}>
            Dashboard operativo para
            organismos autorizados
          </p>
        </div>

        <div style={styles.headerActions}>
          <button
            onClick={cargarDashboard}
            style={{
              ...styles.button,
              background: "#fff",
              color: "#174ea6",
            }}
          >
            🔄 Actualizar
          </button>

          <button
            onClick={() =>
              setMostrarBase(
                !mostrarBase
              )
            }
            style={{
              ...styles.button,
              background:
                mostrarBase
                  ? "#f59e0b"
                  : "#16a34a",
              color: "#fff",
            }}
          >
            {mostrarBase
              ? "📊 Ver Dashboard"
              : "🗄️ Base de información"}
          </button>

          <button
            onClick={cerrarSesion}
            style={{
              ...styles.button,
              background: "#dc2626",
              color: "#fff",
            }}
          >
            🔒 Cerrar sesión
          </button>
        </div>
      </header>

      <main style={styles.container}>
        {/* =========================================== */}
        {/* FILTROS */}
        {/* =========================================== */}

        <section style={styles.filters}>
          <h2 style={styles.sectionTitle}>
            🔎 Filtros de consulta
          </h2>

          <div style={styles.filterGrid}>
            <div>
              <label style={styles.label}>
                Departamento
              </label>

              <select
                value={departamento}
                onChange={(e) =>
                  setDepartamento(
                    e.target.value
                  )
                }
                style={styles.input}
              >
                <option value="">
                  Todos
                </option>

                {departamentos.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label style={styles.label}>
                Municipio
              </label>

              <select
                value={ciudad}
                onChange={(e) =>
                  setCiudad(
                    e.target.value
                  )
                }
                style={styles.input}
              >
                <option value="">
                  Todos
                </option>

                {municipios.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label style={styles.label}>
                Tipo de reporte
              </label>

              <select
                value={tipoReporte}
                onChange={(e) =>
                  setTipoReporte(
                    e.target.value
                  )
                }
                style={styles.input}
              >
                <option value="">
                  Todos
                </option>

                {tipos.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label style={styles.label}>
                Fecha inicial
              </label>

              <input
                type="date"
                value={fechaInicio}
                onChange={(e) =>
                  setFechaInicio(
                    e.target.value
                  )
                }
                style={styles.input}
              />
            </div>

            <div>
              <label style={styles.label}>
                Fecha final
              </label>

              <input
                type="date"
                value={fechaFin}
                onChange={(e) =>
                  setFechaFin(
                    e.target.value
                  )
                }
                style={styles.input}
              />
            </div>
          </div>

          <div
            style={{
              marginTop: "15px",
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={aplicarFiltros}
              style={{
                ...styles.button,
                background:
                  "#2563eb",
                color: "#fff",
              }}
            >
              🔍 Aplicar filtros
            </button>

            <button
              onClick={limpiarFiltros}
              style={{
                ...styles.button,
                background:
                  "#e2e8f0",
                color:
                  "#172033",
              }}
            >
              Limpiar
            </button>
          </div>
        </section>

        {/* =========================================== */}
        {/* BASE PRIVADA */}
        {/* =========================================== */}

        {mostrarBase ? (
          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>
              🗄️ Información privada de
              reportes
            </h2>

            <p
              style={{
                color: "#64748b",
                fontSize: "13px",
              }}
            >
              Esta información solo está
              disponible para usuarios
              autenticados.
            </p>

            {/* BUSCADOR */}

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "20px",
                flexWrap: "wrap",
              }}
            >
              <input
                type="text"
                placeholder="Buscar por nombre, teléfono, dirección o descripción..."
                value={buscar}
                onChange={(e) =>
                  setBuscar(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (
                    e.key ===
                    "Enter"
                  ) {
                    cargarBase(1);
                  }
                }}
                style={{
                  ...styles.input,
                  flex: 1,
                  minWidth:
                    "250px",
                }}
              />

              <button
                onClick={() =>
                  cargarBase(1)
                }
                style={{
                  ...styles.button,
                  background:
                    "#2563eb",
                  color: "#fff",
                }}
              >
                🔍 Buscar
              </button>
            </div>

            {errorBase && (
              <div
                style={{
                  background:
                    "#fee2e2",
                  color:
                    "#991b1b",
                  padding:
                    "12px",
                  borderRadius:
                    "8px",
                  marginBottom:
                    "15px",
                }}
              >
                {errorBase}
              </div>
            )}

            {cargandoBase ? (
              <div
                style={
                  styles.empty
                }
              >
                Cargando información...
              </div>
            ) : (
              <>
                <div
                  style={{
                    marginBottom:
                      "15px",
                    fontWeight: 700,
                  }}
                >
                  Total de registros:
                  {" "}
                  {formatoNumero(
                    totalRegistros
                  )}
                </div>

                <div
                  style={
                    styles.tableWrapper
                  }
                >
                  <table
                    style={
                      styles.table
                    }
                  >
                    <thead>
                      <tr>
                        <th
                          style={
                            styles.th
                          }
                        >
                          Fecha
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Nombre
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Ciudad
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Departamento
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Tipo
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Teléfono
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Vivienda
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Estado
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Acción
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {reportes.length ===
                      0 ? (
                        <tr>
                          <td
                            colSpan="9"
                            style={{
                              ...styles.td,
                              ...styles.empty,
                            }}
                          >
                            No hay
                            registros
                            para los
                            filtros
                            seleccionados.
                          </td>
                        </tr>
                      ) : (
                        reportes.map(
                          (reporte) => (
                            <tr
                              key={texto(
                                reporte._id
                              )}
                            >
                              <td
                                style={
                                  styles.td
                                }
                              >
                                {formatoFecha(
                                  reporte.fechaCreacion
                                )}
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                <strong>
                                  {texto(
                                    reporte.nombre
                                  )}
                                </strong>
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                {texto(
                                  reporte.ciudad
                                )}
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                {texto(
                                  reporte.departamento
                                )}
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                {texto(
                                  reporte.tipoReporte
                                )}
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                {texto(
                                  reporte.telefonoWhatsapp
                                )}
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                {texto(
                                  reporte.estadoVivienda
                                )}
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                {reporte.activa ? (
                                  <span
                                    style={{
                                      background:
                                        "#dcfce7",
                                      color:
                                        "#166534",
                                      padding:
                                        "5px 8px",
                                      borderRadius:
                                        "20px",
                                      fontSize:
                                        "11px",
                                      fontWeight:
                                        700,
                                    }}
                                  >
                                    ACTIVO
                                  </span>
                                ) : (
                                  <span
                                    style={{
                                      background:
                                        "#e2e8f0",
                                      color:
                                        "#475569",
                                      padding:
                                        "5px 8px",
                                      borderRadius:
                                        "20px",
                                      fontSize:
                                        "11px",
                                      fontWeight:
                                        700,
                                    }}
                                  >
                                    CERRADO
                                  </span>
                                )}
                              </td>

                              <td
                                style={
                                  styles.td
                                }
                              >
                                <button
                                  onClick={() =>
                                    verDetalle(
                                      reporte._id
                                    )
                                  }
                                  style={{
                                    ...styles.button,
                                    background:
                                      "#0f766e",
                                    color:
                                      "#fff",
                                    padding:
                                      "7px 10px",
                                    fontSize:
                                      "12px",
                                  }}
                                >
                                  Ver
                                </button>
                              </td>
                            </tr>
                          )
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                {/* PAGINACIÓN */}

                {totalPaginas >
                  1 && (
                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "center",
                      alignItems:
                        "center",
                      gap: "10px",
                      marginTop:
                        "20px",
                    }}
                  >
                    <button
                      disabled={
                        pagina <= 1
                      }
                      onClick={() =>
                        cargarBase(
                          pagina -
                            1
                        )
                      }
                      style={{
                        ...styles.button,
                        background:
                          pagina <=
                          1
                            ? "#e2e8f0"
                            : "#2563eb",
                        color:
                          pagina <=
                          1
                            ? "#94a3b8"
                            : "#fff",
                      }}
                    >
                      ← Anterior
                    </button>

                    <strong>
                      Página{" "}
                      {pagina} de{" "}
                      {
                        totalPaginas
                      }
                    </strong>

                    <button
                      disabled={
                        pagina >=
                        totalPaginas
                      }
                      onClick={() =>
                        cargarBase(
                          pagina +
                            1
                        )
                      }
                      style={{
                        ...styles.button,
                        background:
                          pagina >=
                          totalPaginas
                            ? "#e2e8f0"
                            : "#2563eb",
                        color:
                          pagina >=
                          totalPaginas
                            ? "#94a3b8"
                            : "#fff",
                      }}
                    >
                      Siguiente →
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        ) : (
          <>
            {/* ======================================= */}
            {/* RESUMEN PRINCIPAL */}
            {/* ======================================= */}

            <div style={styles.grid4}>
              <div
                style={{
                  ...styles.metric,
                  borderTop:
                    "4px solid #2563eb",
                }}
              >
                <div
                  style={
                    styles.metricLabel
                  }
                >
                  📋 Total de reportes
                </div>

                <div
                  style={
                    styles.metricValue
                  }
                >
                  {formatoNumero(
                    resumen.totalReportes
                  )}
                </div>

                <div
                  style={
                    styles.metricSmall
                  }
                >
                  Registros activos
                </div>
              </div>

              <div
                style={{
                  ...styles.metric,
                  borderTop:
                    "4px solid #16a34a",
                }}
              >
                <div
                  style={
                    styles.metricLabel
                  }
                >
                  ❤️ Personas a salvo
                </div>

                <div
                  style={
                    styles.metricValue
                  }
                >
                  {formatoNumero(
                    resumen.personasASalvo
                  )}
                </div>

                <div
                  style={
                    styles.metricSmall
                  }
                >
                  {porcentaje(
                    resumen.personasASalvo,
                    resumen.totalReportes
                  )}
                  % de los reportes
                </div>
              </div>

              <div
                style={{
                  ...styles.metric,
                  borderTop:
                    "4px solid #dc2626",
                }}
              >
                <div
                  style={
                    styles.metricLabel
                  }
                >
                  🚨 No localizadas
                </div>

                <div
                  style={
                    styles.metricValue
                  }
                >
                  {formatoNumero(
                    resumen.personasNoLocalizadas
                  )}
                </div>

                <div
                  style={
                    styles.metricSmall
                  }
                >
                  Requieren seguimiento
                </div>
              </div>

              <div
                style={{
                  ...styles.metric,
                  borderTop:
                    "4px solid #f59e0b",
                }}
              >
                <div
                  style={
                    styles.metricLabel
                  }
                >
                  🆘 Necesitan ayuda
                </div>

                <div
                  style={
                    styles.metricValue
                  }
                >
                  {formatoNumero(
                    resumen.personasNecesitanAyuda
                  )}
                </div>

                <div
                  style={
                    styles.metricSmall
                  }
                >
                  Solicitudes activas
                </div>
              </div>

              <div
                style={{
                  ...styles.metric,
                  borderTop:
                    "4px solid #7c3aed",
                }}
              >
                <div
                  style={
                    styles.metricLabel
                  }
                >
                  👥 Personas afectadas
                </div>

                <div
                  style={
                    styles.metricValue
                  }
                >
                  {formatoNumero(
                    resumen.personasAfectadas
                  )}
                </div>
              </div>

              <div
                style={{
                  ...styles.metric,
                  borderTop:
                    "4px solid #0891b2",
                }}
              >
                <div
                  style={
                    styles.metricLabel
                  }
                >
                  🏠 Viviendas afectadas
                </div>

                <div
                  style={
                    styles.metricValue
                  }
                >
                  {formatoNumero(
                    resumen.viviendasAfectadas
                  )}
                </div>
              </div>

              <div
                style={{
                  ...styles.metric,
                  borderTop:
                    "4px solid #059669",
                }}
              >
                <div
                  style={
                    styles.metricLabel
                  }
                >
                  🤝 Ofrecen ayuda
                </div>

                <div
                  style={
                    styles.metricValue
                  }
                >
                  {formatoNumero(
                    resumen.personasOfrecenAyuda
                  )}
                </div>
              </div>

              <div
                style={{
                  ...styles.metric,
                  borderTop:
                    "4px solid #64748b",
                }}
              >
                <div
                  style={
                    styles.metricLabel
                  }
                >
                  📍 Municipios
                </div>

                <div
                  style={
                    styles.metricValue
                  }
                >
                  {porCiudad.length}
                </div>

                <div
                  style={
                    styles.metricSmall
                  }
                >
                  Con reportes registrados
                </div>
              </div>
            </div>

            {/* ======================================= */}
            {/* ALERTAS */}
            {/* ======================================= */}

            {alertas.length > 0 && (
              <section style={styles.card}>
                <h2
                  style={
                    styles.sectionTitle
                  }
                >
                  🚨 Alertas operativas
                </h2>

                {alertas.map(
                  (alerta, index) => (
                    <div
                      key={index}
                      style={
                        styles.alert
                      }
                    >
                      <strong>
                        {texto(
                          alerta.tipo
                        )}
                      </strong>

                      <div
                        style={{
                          marginTop:
                            "5px",
                        }}
                      >
                        {texto(
                          alerta.mensaje
                        )}
                      </div>

                      {alerta.cantidad !==
                        undefined && (
                        <div
                          style={{
                            marginTop:
                              "5px",
                            fontWeight:
                              800,
                          }}
                        >
                          Cantidad:{" "}
                          {formatoNumero(
                            alerta.cantidad
                          )}
                        </div>
                      )}
                    </div>
                  )
                )}
              </section>
            )}

            {/* ======================================= */}
            {/* INDICADORES */}
            {/* ======================================= */}

            <div
              style={
                styles.twoColumns
              }
            >
              <section
                style={styles.card}
              >
                <h2
                  style={
                    styles.sectionTitle
                  }
                >
                  📍 Mayor concentración
                </h2>

                {indicadores
                  .municipioMasReportado ? (
                  <div>
                    <div
                      style={{
                        fontSize:
                          "26px",
                        fontWeight:
                          900,
                      }}
                    >
                      {texto(
                        indicadores
                          .municipioMasReportado
                          ._id
                      )}
                    </div>

                    <p>
                      Departamento:{" "}
                      <strong>
                        {texto(
                          indicadores
                            .municipioMasReportado
                            .departamento
                        )}
                      </strong>
                    </p>

                    <p>
                      Reportes:{" "}
                      <strong>
                        {formatoNumero(
                          indicadores
                            .municipioMasReportado
                            .reportes
                        )}
                      </strong>
                    </p>
                  </div>
                ) : (
                  <div
                    style={
                      styles.empty
                    }
                  >
                    No hay información.
                  </div>
                )}
              </section>

              <section
                style={styles.card}
              >
                <h2
                  style={
                    styles.sectionTitle
                  }
                >
                  🗺️ Departamento con
                  mayor actividad
                </h2>

                {indicadores
                  .departamentoMasReportado ? (
                  <div>
                    <div
                      style={{
                        fontSize:
                          "26px",
                        fontWeight:
                          900,
                      }}
                    >
                      {texto(
                        indicadores
                          .departamentoMasReportado
                          ._id
                      )}
                    </div>

                    <p>
                      Reportes:{" "}
                      <strong>
                        {formatoNumero(
                          indicadores
                            .departamentoMasReportado
                            .reportes
                        )}
                      </strong>
                    </p>
                  </div>
                ) : (
                  <div
                    style={
                      styles.empty
                    }
                  >
                    No hay información.
                  </div>
                )}
              </section>
            </div>

            {/* ======================================= */}
            {/* REPORTES POR TIPO */}
            {/* ======================================= */}

            <section style={styles.card}>
              <h2
                style={
                  styles.sectionTitle
                }
              >
                📊 Distribución por tipo de
                reporte
              </h2>

              {porTipoReporte.length ===
              0 ? (
                <div
                  style={styles.empty}
                >
                  No hay datos disponibles.
                </div>
              ) : (
                porTipoReporte.map(
                  (item, index) => {
                    const cantidad =
                      numero(
                        item?.cantidad
                      );

                    const width =
                      (cantidad /
                        maxTipo) *
                      100;

                    return (
                      <div
                        key={index}
                        style={
                          styles.barContainer
                        }
                      >
                        <div
                          style={
                            styles.barHeader
                          }
                        >
                          <span>
                            {texto(
                              item?._id
                            )}
                          </span>

                          <strong>
                            {formatoNumero(
                              cantidad
                            )}
                          </strong>
                        </div>

                        <div
                          style={
                            styles.barBackground
                          }
                        >
                          <div
                            style={{
                              ...styles.bar,
                              width:
                                `${width}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  }
                )
              )}
            </section>

            {/* ======================================= */}
            {/* DEPARTAMENTOS + CIUDADES */}
            {/* ======================================= */}

            <div
              style={
                styles.twoColumns
              }
            >
              <section
                style={styles.card}
              >
                <h2
                  style={
                    styles.sectionTitle
                  }
                >
                  🗺️ Reportes por departamento
                </h2>

                {porDepartamento.length ===
                0 ? (
                  <div
                    style={
                      styles.empty
                    }
                  >
                    No hay datos.
                  </div>
                ) : (
                  porDepartamento.map(
                    (item, index) => {
                      const cantidad =
                        numero(
                          item?.reportes
                        );

                      const width =
                        (cantidad /
                          maxDepartamento) *
                        100;

                      return (
                        <div
                          key={index}
                          style={
                            styles.barContainer
                          }
                        >
                          <div
                            style={
                              styles.barHeader
                            }
                          >
                            <span>
                              {texto(
                                item?._id
                              )}
                            </span>

                            <strong>
                              {formatoNumero(
                                cantidad
                              )}
                            </strong>
                          </div>

                          <div
                            style={
                              styles.barBackground
                            }
                          >
                            <div
                              style={{
                                ...styles.bar,
                                width:
                                  `${width}%`,
                              }}
                            />
                          </div>

                          <div
                            style={{
                              fontSize:
                                "11px",
                              color:
                                "#64748b",
                              marginTop:
                                "3px",
                            }}
                          >
                            Afectados:{" "}
                            {formatoNumero(
                              item?.personasAfectadas
                            )}
                            {" | "}
                            No localizadas:{" "}
                            {formatoNumero(
                              item?.noLocalizadas
                            )}
                            {" | "}
                            A salvo:{" "}
                            {formatoNumero(
                              item?.aSalvo
                            )}
                          </div>
                        </div>
                      );
                    }
                  )
                )}
              </section>

              <section
                style={styles.card}
              >
                <h2
                  style={
                    styles.sectionTitle
                  }
                >
                  🏙️ Reportes por municipio
                </h2>

                {porCiudad.length ===
                0 ? (
                  <div
                    style={
                      styles.empty
                    }
                  >
                    No hay datos.
                  </div>
                ) : (
                  porCiudad.map(
                    (item, index) => {
                      const cantidad =
                        numero(
                          item?.reportes
                        );

                      const width =
                        (cantidad /
                          maxCiudad) *
                        100;

                      return (
                        <div
                          key={index}
                          style={
                            styles.barContainer
                          }
                        >
                          <div
                            style={
                              styles.barHeader
                            }
                          >
                            <span>
                              <strong>
                                {texto(
                                  item?._id
                                )}
                              </strong>

                              <br />

                              <small
                                style={{
                                  color:
                                    "#64748b",
                                }}
                              >
                                {texto(
                                  item?.departamento
                                )}
                              </small>
                            </span>

                            <strong>
                              {formatoNumero(
                                cantidad
                              )}
                            </strong>
                          </div>

                          <div
                            style={
                              styles.barBackground
                            }
                          >
                            <div
                              style={{
                                ...styles.bar,
                                width:
                                  `${width}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    }
                  )
                )}
              </section>
            </div>

            {/* ======================================= */}
            {/* NECESIDADES */}
            {/* ======================================= */}

            <section style={styles.card}>
              <h2
                style={
                  styles.sectionTitle
                }
              >
                🆘 Necesidades reportadas
              </h2>

              {porNecesidad.length ===
              0 ? (
                <div
                  style={styles.empty}
                >
                  No se han registrado
                  necesidades específicas.
                </div>
              ) : (
                porNecesidad.map(
                  (item, index) => {
                    const cantidad =
                      numero(
                        item?.cantidad
                      );

                    const width =
                      (cantidad /
                        maxNecesidad) *
                      100;

                    return (
                      <div
                        key={index}
                        style={
                          styles.barContainer
                        }
                      >
                        <div
                          style={
                            styles.barHeader
                          }
                        >
                          <span>
                            {texto(
                              item?._id
                            )}
                          </span>

                          <strong>
                            {formatoNumero(
                              cantidad
                            )}
                          </strong>
                        </div>

                        <div
                          style={
                            styles.barBackground
                          }
                        >
                          <div
                            style={{
                              ...styles.bar,
                              width:
                                `${width}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  }
                )
              )}
            </section>

            {/* ======================================= */}
            {/* ESTADO VIVIENDAS */}
            {/* ======================================= */}

            <section style={styles.card}>
              <h2
                style={
                  styles.sectionTitle
                }
              >
                🏠 Estado de las viviendas
              </h2>

              {porEstadoVivienda.length ===
              0 ? (
                <div
                  style={styles.empty}
                >
                  No hay información sobre
                  viviendas.
                </div>
              ) : (
                <div
                  style={{
                    display:
                      "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "12px",
                  }}
                >
                  {porEstadoVivienda.map(
                    (item, index) => (
                      <div
                        key={index}
                        style={{
                          border:
                            "1px solid #e2e8f0",
                          borderRadius:
                            "10px",
                          padding:
                            "15px",
                        }}
                      >
                        <div
                          style={{
                            fontWeight:
                              700,
                          }}
                        >
                          {texto(
                            item?._id
                          )}
                        </div>

                        <div
                          style={{
                            fontSize:
                              "25px",
                            fontWeight:
                              900,
                            marginTop:
                              "5px",
                          }}
                        >
                          {formatoNumero(
                            item?.cantidad
                          )}
                        </div>

                        <small
                          style={{
                            color:
                              "#64748b",
                          }}
                        >
                          viviendas
                        </small>
                      </div>
                    )
                  )}
                </div>
              )}
            </section>

            {/* ======================================= */}
            {/* EVOLUCIÓN */}
            {/* ======================================= */}

            <section style={styles.card}>
              <h2
                style={
                  styles.sectionTitle
                }
              >
                📈 Evolución diaria de reportes
              </h2>

              {evolucion.length ===
              0 ? (
                <div
                  style={styles.empty}
                >
                  No hay evolución disponible.
                </div>
              ) : (
                <div
                  style={
                    styles.tableWrapper
                  }
                >
                  <table
                    style={
                      styles.table
                    }
                  >
                    <thead>
                      <tr>
                        <th
                          style={
                            styles.th
                          }
                        >
                          Fecha
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Reportes
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Personas afectadas
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {evolucion.map(
                        (item, index) => (
                          <tr
                            key={index}
                          >
                            <td
                              style={
                                styles.td
                              }
                            >
                              {texto(
                                item?._id
                              )}
                            </td>

                            <td
                              style={
                                styles.td
                              }
                            >
                              {formatoNumero(
                                item?.reportes
                              )}
                            </td>

                            <td
                              style={
                                styles.td
                              }
                            >
                              {formatoNumero(
                                item?.personasAfectadas
                              )}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* ======================================= */}
            {/* UBICACIONES */}
            {/* ======================================= */}

            <section style={styles.card}>
              <h2
                style={
                  styles.sectionTitle
                }
              >
                📍 Reportes con ubicación
              </h2>

              <p
                style={{
                  color:
                    "#64748b",
                  fontSize:
                    "13px",
                }}
              >
                Se muestran únicamente
                registros que cuentan con
                coordenadas geográficas.
              </p>

              {ubicaciones.length ===
              0 ? (
                <div
                  style={styles.empty}
                >
                  No existen reportes con
                  coordenadas registradas.
                </div>
              ) : (
                <div
                  style={
                    styles.tableWrapper
                  }
                >
                  <table
                    style={
                      styles.table
                    }
                  >
                    <thead>
                      <tr>
                        <th
                          style={
                            styles.th
                          }
                        >
                          Municipio
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Departamento
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Tipo
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Latitud
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Longitud
                        </th>

                        <th
                          style={
                            styles.th
                          }
                        >
                          Afectados
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {ubicaciones.map(
                        (item, index) => (
                          <tr
                            key={index}
                          >
                            <td
                              style={
                                styles.td
                              }
                            >
                              {texto(
                                item?.ciudad
                              )}
                            </td>

                            <td
                              style={
                                styles.td
                              }
                            >
                              {texto(
                                item?.departamento
                              )}
                            </td>

                            <td
                              style={
                                styles.td
                              }
                            >
                              {texto(
                                item?.tipoReporte
                              )}
                            </td>

                            <td
                              style={
                                styles.td
                              }
                            >
                              {texto(
                                item?.latitud
                              )}
                            </td>

                            <td
                              style={
                                styles.td
                              }
                            >
                              {texto(
                                item?.longitud
                              )}
                            </td>

                            <td
                              style={
                                styles.td
                              }
                            >
                              {formatoNumero(
                                item?.personasAfectadas
                              )}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* ============================================= */}
      {/* MODAL DETALLE */}
      {/* ============================================= */}

      {reporteSeleccionado && (
        <div
          style={
            styles.modalOverlay
          }
          onClick={() =>
            setReporteSeleccionado(
              null
            )
          }
        >
          <div
            style={styles.modal}
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                gap: "10px",
                marginBottom:
                  "20px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                }}
              >
                📄 Detalle del reporte
              </h2>

              <button
                onClick={() =>
                  setReporteSeleccionado(
                    null
                  )
                }
                style={{
                  ...styles.button,
                  background:
                    "#fee2e2",
                  color:
                    "#991b1b",
                }}
              >
                ✕ Cerrar
              </button>
            </div>

            {cargandoDetalle ? (
              <div
                style={
                  styles.empty
                }
              >
                Cargando detalle...
              </div>
            ) : (
              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "15px",
                }}
              >
                <div
                  style={
                    styles.metric
                  }
                >
                  <strong>
                    Nombre
                  </strong>

                  <div>
                    {texto(
                      reporteSeleccionado.nombre
                    )}
                  </div>
                </div>

                <div
                  style={
                    styles.metric
                  }
                >
                  <strong>
                    Teléfono / WhatsApp
                  </strong>

                  <div>
                    {texto(
                      reporteSeleccionado.telefonoWhatsapp
                    )}
                  </div>
                </div>

                <div
                  style={
                    styles.metric
                  }
                >
                  <strong>
                    Ciudad
                  </strong>

                  <div>
                    {texto(
                      reporteSeleccionado.ciudad
                    )}
                  </div>
                </div>

                <div
                  style={
                    styles.metric
                  }
                >
                  <strong>
                    Departamento
                  </strong>

                  <div>
                    {texto(
                      reporteSeleccionado.departamento
                    )}
                  </div>
                </div>

                <div
                  style={
                    styles.metric
                  }
                >
                  <strong>
                    Tipo de reporte
                  </strong>

                  <div>
                    {texto(
                      reporteSeleccionado.tipoReporte
                    )}
                  </div>
                </div>

                <div
                  style={
                    styles.metric
                  }
                >
                  <strong>
                    Estado
                  </strong>

                  <div>
                    {reporteSeleccionado.activa
                      ? "ACTIVO"
                      : "CERRADO"}
                  </div>
                </div>

                <div
                  style={{
                    ...styles.metric,
                    gridColumn:
                      "1 / -1",
                  }}
                >
                  <strong>
                    Dirección
                  </strong>

                  <div
                    style={{
                      marginTop:
                        "7px",
                    }}
                  >
                    {texto(
                      reporteSeleccionado.direccion
                    )}
                  </div>
                </div>

                <div
                  style={{
                    ...styles.metric,
                    gridColumn:
                      "1 / -1",
                  }}
                >
                  <strong>
                    Descripción
                  </strong>

                  <div
                    style={{
                      marginTop:
                        "7px",
                      whiteSpace:
                        "pre-wrap",
                    }}
                  >
                    {texto(
                      reporteSeleccionado.descripcion
                    )}
                  </div>
                </div>

                <div
                  style={
                    styles.metric
                  }
                >
                  <strong>
                    Personas afectadas
                  </strong>

                  <div
                    style={{
                      fontSize:
                        "24px",
                      fontWeight:
                        900,
                    }}
                  >
                    {formatoNumero(
                      reporteSeleccionado.personasAfectadas
                    )}
                  </div>
                </div>

                <div
                  style={
                    styles.metric
                  }
                >
                  <strong>
                    Estado de vivienda
                  </strong>

                  <div>
                    {texto(
                      reporteSeleccionado.estadoVivienda
                    )}
                  </div>
                </div>

                <div
                  style={{
                    ...styles.metric,
                    gridColumn:
                      "1 / -1",
                  }}
                >
                  <strong>
                    Necesidades
                  </strong>

                  <div
                    style={{
                      marginTop:
                        "8px",
                    }}
                  >
                    {Array.isArray(
                      reporteSeleccionado.necesidades
                    ) &&
                    reporteSeleccionado
                      .necesidades
                      .length > 0 ? (
                      <ul>
                        {reporteSeleccionado.necesidades.map(
                          (
                            necesidad,
                            index
                          ) => (
                            <li
                              key={
                                index
                              }
                            >
                              {texto(
                                necesidad
                              )}
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      "No registradas"
                    )}
                  </div>
                </div>

                {reporteSeleccionado
                  .foto?.url && (
                  <div
                    style={{
                      ...styles.metric,
                      gridColumn:
                        "1 / -1",
                    }}
                  >
                    <strong>
                      Fotografía
                    </strong>

                    <div
                      style={{
                        marginTop:
                          "10px",
                      }}
                    >
                      <img
                        src={
                          reporteSeleccionado
                            .foto.url
                        }
                        alt="Fotografía del reporte"
                        style={{
                          maxWidth:
                            "100%",
                          maxHeight:
                            "500px",
                          objectFit:
                            "contain",
                          borderRadius:
                            "10px",
                          display:
                            "block",
                        }}
                      />
                    </div>
                  </div>
                )}

                <div
                  style={{
                    ...styles.metric,
                    gridColumn:
                      "1 / -1",
                  }}
                >
                  <strong>
                    Fecha del reporte
                  </strong>

                  <div>
                    {formatoFecha(
                      reporteSeleccionado.fechaCreacion
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportesAutoridades;
