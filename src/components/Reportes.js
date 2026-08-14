import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowLeft,
  BarChart3,
  MapPin,
  Users,
  Heart,
  Search,
  Home,
  AlertTriangle,
  RefreshCw,
  Filter,
  Activity,
  ShieldCheck,
  TrendingUp,
  Package,
} from "lucide-react";
import axios from "axios";

const API_URL = "https://tiendasappbackend.onrender.com";

const Reportes = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [departamento, setDepartamento] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [tipoReporte, setTipoReporte] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const cargarDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

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

      const response = await axios.get(
        `${API_URL}/api/reportes/dashboard`,
        {
          params,
          timeout: 30000,
        }
      );

      if (response.data && response.data.ok) {
        setDashboard(response.data);
      } else {
        setError("El servidor no devolvió información válida.");
      }
    } catch (err) {
      console.error("Error cargando dashboard:", err);

      if (err.response) {
        setError(
          `Error del servidor: ${
            err.response.data?.mensaje ||
            err.response.data?.message ||
            err.response.status
          }`
        );
      } else if (err.request) {
        setError(
          "No fue posible comunicarse con el servidor."
        );
      } else {
        setError("No fue posible cargar el dashboard.");
      }
    } finally {
      setLoading(false);
    }
  }, [departamento, ciudad, tipoReporte]);

  useEffect(() => {
    cargarDashboard();
  }, [cargarDashboard]);

  const limpiarFiltros = () => {
    setDepartamento("");
    setCiudad("");
    setTipoReporte("");
    setBusqueda("");
  };

  const numero = (valor) => {
    if (valor === null || valor === undefined) {
      return "0";
    }

    return Number(valor).toLocaleString("es-CO");
  };

  

  const obtenerValor = (objeto, posiblesCampos) => {
    if (!objeto) return "";

    for (const campo of posiblesCampos) {
      if (
        objeto[campo] !== undefined &&
        objeto[campo] !== null
      ) {
        return objeto[campo];
      }
    }

    return "";
  };

  const resumen = dashboard?.resumen || {};
  const indicadores = dashboard?.indicadores || {};

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

  const ubicaciones =
    dashboard?.ubicaciones || [];

  const alertas =
    dashboard?.alertas || [];

  const departamentos = [
    ...new Set(
      porDepartamento
        .map((item) =>
          obtenerValor(item, [
            "departamento",
            "_id",
            "nombre",
          ])
        )
        .filter(Boolean)
    ),
  ];

  const ciudades = [
    ...new Set(
      porCiudad
        .map((item) =>
          obtenerValor(item, [
            "ciudad",
            "municipio",
            "_id",
            "nombre",
          ])
        )
        .filter(Boolean)
    ),
  ];

  const tipos = [
    ...new Set(
      porTipoReporte
        .map((item) =>
          obtenerValor(item, [
            "tipoReporte",
            "tipo",
            "_id",
            "nombre",
          ])
        )
        .filter(Boolean)
    ),
  ];

  const ciudadesFiltradas = ciudades.filter((nombre) =>
    nombre
      .toString()
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  const maxDepartamento = Math.max(
    ...porDepartamento.map((item) =>
      Number(
        obtenerValor(item, [
          "total",
          "cantidad",
          "count",
          "valor",
        ])
      ) || 0
    ),
    1
  );

  const maxCiudad = Math.max(
    ...porCiudad.map((item) =>
      Number(
        obtenerValor(item, [
          "total",
          "cantidad",
          "count",
          "valor",
        ])
      ) || 0
    ),
    1
  );

  const maxTipo = Math.max(
    ...porTipoReporte.map((item) =>
      Number(
        obtenerValor(item, [
          "total",
          "cantidad",
          "count",
          "valor",
        ])
      ) || 0
    ),
    1
  );

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <RefreshCw
          size={40}
          className="loading-spinner"
        />

        <h3>
          Cargando información de emergencia...
        </h3>

        <p style={{ color: "#64748b" }}>
          Consultando los reportes registrados
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            background: "white",
            borderRadius: "16px",
            padding: "40px",
            textAlign: "center",
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <AlertTriangle
            size={60}
            color="#dc2626"
          />

          <h2 style={{ marginTop: "20px" }}>
            No fue posible cargar los reportes
          </h2>

          <p
            style={{
              color: "#64748b",
              margin: "15px 0 25px",
            }}
          >
            {error}
          </p>

          <button
            onClick={cargarDashboard}
            style={{
              border: "none",
              background: "#2563eb",
              color: "white",
              padding: "12px 22px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <RefreshCw size={18} />
            Intentar nuevamente
          </button>

          <div style={{ marginTop: "20px" }}>
            <Link
              to="/"
              style={{
                color: "#2563eb",
                textDecoration: "none",
              }}
            >
              <ArrowLeft
                size={16}
                style={{
                  verticalAlign: "middle",
                }}
              />{" "}
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        paddingBottom: "60px",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          background:
            "linear-gradient(135deg,#172554,#2563eb)",
          color: "white",
          padding: "25px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          <Link
            to="/"
            style={{
              color: "white",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "20px",
              background:
                "rgba(255,255,255,.15)",
              padding: "8px 14px",
              borderRadius: "8px",
            }}
          >
            <ArrowLeft size={17} />
            Volver
          </Link>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <BarChart3 size={38} />

                <h1
                  style={{
                    margin: 0,
                    fontSize: "30px",
                  }}
                >
                  Centro de Información
                </h1>
              </div>

              <p
                style={{
                  margin: "10px 0 0",
                  opacity: 0.9,
                }}
              >
                Información ciudadana para apoyar
                la atención de emergencias
              </p>
            </div>

            <button
              onClick={cargarDashboard}
              style={{
                background: "white",
                color: "#1d4ed8",
                border: "none",
                padding: "11px 18px",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <RefreshCw size={17} />
              Actualizar
            </button>
          </div>
        </div>
      </header>

      <main
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "25px 20px",
        }}
      >
        {/* FILTROS */}
        <section
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "14px",
            marginBottom: "25px",
            boxShadow:
              "0 2px 10px rgba(0,0,0,.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "15px",
            }}
          >
            <Filter
              size={20}
              color="#2563eb"
            />

            <h3 style={{ margin: 0 }}>
              Filtros de información
            </h3>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(220px,1fr))",
              gap: "12px",
            }}
          >
            <select
              value={departamento}
              onChange={(e) =>
                setDepartamento(e.target.value)
              }
              style={{
                padding: "11px",
                border:
                  "1px solid #cbd5e1",
                borderRadius: "8px",
              }}
            >
              <option value="">
                Todos los departamentos
              </option>

              {departamentos.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={ciudad}
              onChange={(e) =>
                setCiudad(e.target.value)
              }
              style={{
                padding: "11px",
                border:
                  "1px solid #cbd5e1",
                borderRadius: "8px",
              }}
            >
              <option value="">
                Todos los municipios
              </option>

              {ciudades.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={tipoReporte}
              onChange={(e) =>
                setTipoReporte(e.target.value)
              }
              style={{
                padding: "11px",
                border:
                  "1px solid #cbd5e1",
                borderRadius: "8px",
              }}
            >
              <option value="">
                Todos los tipos de reporte
              </option>

              {tipos.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <button
              onClick={limpiarFiltros}
              style={{
                padding: "11px",
                border: "1px solid #cbd5e1",
                background: "#f8fafc",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Limpiar filtros
            </button>
          </div>
        </section>

        {/* INDICADORES PRINCIPALES */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(210px,1fr))",
            gap: "16px",
            marginBottom: "25px",
          }}
        >
          <Indicador
            icon={<Activity size={25} />}
            titulo="Total reportes"
            valor={numero(
              resumen.totalReportes
            )}
            texto="Registros ciudadanos"
          />

          <Indicador
            icon={<Users size={25} />}
            titulo="Personas afectadas"
            valor={numero(
              resumen.personasAfectadas
            )}
            texto="Personas reportadas"
          />

          <Indicador
            icon={<Heart size={25} />}
            titulo="Personas a salvo"
            valor={numero(
              resumen.personasSalvas
            )}
            texto="Reportadas como seguras"
          />

          <Indicador
            icon={<Search size={25} />}
            titulo="No localizadas"
            valor={numero(
              resumen.personasNoLocalizadas
            )}
            texto="Pendientes de localizar"
            alerta
          />

          <Indicador
            icon={<Home size={25} />}
            titulo="Viviendas afectadas"
            valor={numero(
              resumen.viviendasAfectadas
            )}
            texto="Reportes de vivienda"
          />

          <Indicador
            icon={<Users size={25} />}
            titulo="Necesitan ayuda"
            valor={numero(
              resumen.personasNecesitanAyuda
            )}
            texto="Solicitudes registradas"
            alerta
          />

          <Indicador
            icon={<ShieldCheck size={25} />}
            titulo="Ofrecen ayuda"
            valor={numero(
              resumen.personasOfrecenAyuda
            )}
            texto="Personas disponibles"
          />

          <Indicador
            icon={<Package size={25} />}
            titulo="Necesidades"
            valor={numero(
              resumen.totalNecesidades
            )}
            texto="Necesidades reportadas"
          />
        </section>

        {/* ALERTAS */}
        {alertas.length > 0 && (
          <section
            style={{
              background: "#fff7ed",
              border:
                "1px solid #fed7aa",
              borderRadius: "14px",
              padding: "20px",
              marginBottom: "25px",
            }}
          >
            <h2
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: 0,
                color: "#9a3412",
              }}
            >
              <AlertTriangle size={23} />
              Alertas prioritarias
            </h2>

            <div
              style={{
                display: "grid",
                gap: "10px",
              }}
            >
              {alertas.map((alerta, index) => (
                <div
                  key={index}
                  style={{
                    background: "white",
                    padding: "14px",
                    borderRadius: "9px",
                    borderLeft:
                      "4px solid #ea580c",
                  }}
                >
                  <strong>
                    {obtenerValor(alerta, [
                      "titulo",
                      "tipo",
                      "nombre",
                    ]) ||
                      "Alerta"}
                  </strong>

                  <p
                    style={{
                      margin:
                        "5px 0 0",
                      color: "#64748b",
                    }}
                  >
                    {obtenerValor(alerta, [
                      "mensaje",
                      "descripcion",
                      "detalle",
                    ])}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* INDICADORES DE CONTEXTO */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(250px,1fr))",
            gap: "16px",
            marginBottom: "25px",
          }}
        >
          <InfoCard
            titulo="Municipio con mayor concentración"
            icon={<MapPin size={22} />}
            valor={
              indicadores.municipioMasReportado ||
              "Sin información"
            }
          />

          <InfoCard
            titulo="Departamento con mayor concentración"
            icon={<MapPin size={22} />}
            valor={
              indicadores.departamentoMasReportado ||
              "Sin información"
            }
          />

          <InfoCard
            titulo="Necesidad prioritaria"
            icon={<TrendingUp size={22} />}
            valor={
              indicadores.necesidadPrioritaria ||
              "Sin información"
            }
          />

          <InfoCard
            titulo="Municipios con personas no localizadas"
            icon={<Search size={22} />}
            valor={numero(
              indicadores.municipiosNoLocalizados
            )}
          />
        </section>

        {/* GRÁFICAS */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(400px,1fr))",
            gap: "20px",
            marginBottom: "25px",
          }}
        >
          {/* DEPARTAMENTOS */}
          <ChartCard
            titulo="Reportes por departamento"
            icon={<MapPin size={21} />}
          >
            {porDepartamento.length === 0 ? (
              <Empty />
            ) : (
              porDepartamento.map(
                (item, index) => {
                  const nombre =
                    obtenerValor(item, [
                      "departamento",
                      "_id",
                      "nombre",
                    ]);

                  const valor =
                    Number(
                      obtenerValor(item, [
                        "total",
                        "cantidad",
                        "count",
                        "valor",
                      ])
                    ) || 0;

                  return (
                    <BarItem
                      key={index}
                      nombre={nombre}
                      valor={valor}
                      max={maxDepartamento}
                    />
                  );
                }
              )
            )}
          </ChartCard>

          {/* MUNICIPIOS */}
          <ChartCard
            titulo="Reportes por municipio"
            icon={<MapPin size={21} />}
          >
            <div
              style={{
                marginBottom: "12px",
                position: "relative",
              }}
            >
              <Search
                size={17}
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "11px",
                  color: "#94a3b8",
                }}
              />

              <input
                value={busqueda}
                onChange={(e) =>
                  setBusqueda(e.target.value)
                }
                placeholder="Buscar municipio..."
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding:
                    "10px 10px 10px 35px",
                  border:
                    "1px solid #cbd5e1",
                  borderRadius: "8px",
                }}
              />
            </div>

            {porCiudad.length === 0 ? (
              <Empty />
            ) : (
              porCiudad
                .filter((item) => {
                  const nombre =
                    obtenerValor(item, [
                      "ciudad",
                      "municipio",
                      "_id",
                      "nombre",
                    ]);

                  return ciudadesFiltradas.includes(
                    nombre
                  );
                })
                .map((item, index) => {
                  const nombre =
                    obtenerValor(item, [
                      "ciudad",
                      "municipio",
                      "_id",
                      "nombre",
                    ]);

                  const valor =
                    Number(
                      obtenerValor(item, [
                        "total",
                        "cantidad",
                        "count",
                        "valor",
                      ])
                    ) || 0;

                  return (
                    <BarItem
                      key={index}
                      nombre={nombre}
                      valor={valor}
                      max={maxCiudad}
                    />
                  );
                })
            )}
          </ChartCard>

          {/* TIPOS */}
          <ChartCard
            titulo="Tipos de reporte"
            icon={<Activity size={21} />}
          >
            {porTipoReporte.length === 0 ? (
              <Empty />
            ) : (
              porTipoReporte.map(
                (item, index) => {
                  const nombre =
                    obtenerValor(item, [
                      "tipoReporte",
                      "tipo",
                      "_id",
                      "nombre",
                    ]);

                  const valor =
                    Number(
                      obtenerValor(item, [
                        "total",
                        "cantidad",
                        "count",
                        "valor",
                      ])
                    ) || 0;

                  return (
                    <BarItem
                      key={index}
                      nombre={nombre}
                      valor={valor}
                      max={maxTipo}
                    />
                  );
                }
              )
            )}
          </ChartCard>

          {/* NECESIDADES */}
          <ChartCard
            titulo="Necesidades reportadas"
            icon={<Package size={21} />}
          >
            {porNecesidad.length === 0 ? (
              <Empty />
            ) : (
              porNecesidad.map(
                (item, index) => {
                  const nombre =
                    obtenerValor(item, [
                      "necesidad",
                      "tipo",
                      "_id",
                      "nombre",
                    ]);

                  const valor =
                    Number(
                      obtenerValor(item, [
                        "total",
                        "cantidad",
                        "count",
                        "valor",
                      ])
                    ) || 0;

                  const maxNecesidad =
                    Math.max(
                      ...porNecesidad.map(
                        (x) =>
                          Number(
                            obtenerValor(
                              x,
                              [
                                "total",
                                "cantidad",
                                "count",
                                "valor",
                              ]
                            )
                          ) || 0
                      ),
                      1
                    );

                  return (
                    <BarItem
                      key={index}
                      nombre={nombre}
                      valor={valor}
                      max={maxNecesidad}
                    />
                  );
                }
              )
            )}
          </ChartCard>
        </section>

        {/* ESTADO VIVIENDAS */}
        <ChartCard
          titulo="Estado de las viviendas"
          icon={<Home size={21} />}
        >
          {porEstadoVivienda.length === 0 ? (
            <Empty />
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(180px,1fr))",
                gap: "12px",
              }}
            >
              {porEstadoVivienda.map(
                (item, index) => {
                  const nombre =
                    obtenerValor(item, [
                      "estadoVivienda",
                      "estado",
                      "_id",
                      "nombre",
                    ]);

                  const valor =
                    Number(
                      obtenerValor(item, [
                        "total",
                        "cantidad",
                        "count",
                        "valor",
                      ])
                    ) || 0;

                  return (
                    <div
                      key={index}
                      style={{
                        background: "#f8fafc",
                        borderRadius: "10px",
                        padding: "18px",
                        textAlign: "center",
                        border:
                          "1px solid #e2e8f0",
                      }}
                    >
                      <Home
                        size={28}
                        color="#2563eb"
                      />

                      <div
                        style={{
                          fontSize: "25px",
                          fontWeight: "800",
                          marginTop: "8px",
                        }}
                      >
                        {numero(valor)}
                      </div>

                      <div
                        style={{
                          color: "#64748b",
                          marginTop: "4px",
                        }}
                      >
                        {nombre}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </ChartCard>

        {/* EVOLUCIÓN */}
        <ChartCard
          titulo="Evolución de reportes"
          icon={<TrendingUp size={21} />}
        >
          {evolucion.length === 0 ? (
            <Empty />
          ) : (
            <div
              style={{
                overflowX: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "10px",
                  minHeight: "220px",
                  padding:
                    "20px 10px 5px",
                }}
              >
                {evolucion.map(
                  (item, index) => {
                    const fecha =
                      obtenerValor(item, [
                        "fecha",
                        "_id",
                        "dia",
                      ]);

                    const valor =
                      Number(
                        obtenerValor(item, [
                          "total",
                          "cantidad",
                          "count",
                          "valor",
                        ])
                      ) || 0;

                    const maxEvolucion =
                      Math.max(
                        ...evolucion.map(
                          (x) =>
                            Number(
                              obtenerValor(
                                x,
                                [
                                  "total",
                                  "cantidad",
                                  "count",
                                  "valor",
                                ]
                              )
                            ) || 0
                        ),
                        1
                      );

                    const alto =
                      Math.max(
                        8,
                        (valor /
                          maxEvolucion) *
                          170
                      );

                    return (
                      <div
                        key={index}
                        style={{
                          minWidth: "45px",
                          display: "flex",
                          flexDirection:
                            "column",
                          alignItems:
                            "center",
                          justifyContent:
                            "flex-end",
                          height: "190px",
                        }}
                      >
                        <strong
                          style={{
                            fontSize: "11px",
                            marginBottom: "5px",
                          }}
                        >
                          {valor}
                        </strong>

                        <div
                          style={{
                            width: "28px",
                            height: `${alto}px`,
                            background:
                              "#2563eb",
                            borderRadius:
                              "6px 6px 0 0",
                          }}
                        />

                        <span
                          style={{
                            fontSize: "10px",
                            color: "#64748b",
                            marginTop: "6px",
                            writingMode:
                              "vertical-rl",
                          }}
                        >
                          {fecha}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}
        </ChartCard>

        {/* UBICACIONES */}
        <ChartCard
          titulo={`Ubicaciones registradas (${numero(
            ubicaciones.length
          )})`}
          icon={<MapPin size={21} />}
        >
          {ubicaciones.length === 0 ? (
            <Empty />
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(250px,1fr))",
                gap: "12px",
              }}
            >
              {ubicaciones
                .slice(0, 100)
                .map((item, index) => (
                  <div
                    key={index}
                    style={{
                      border:
                        "1px solid #e2e8f0",
                      borderRadius: "10px",
                      padding: "15px",
                      background:
                        "#f8fafc",
                    }}
                  >
                    <MapPin
                      size={20}
                      color="#dc2626"
                    />

                    <strong
                      style={{
                        display: "block",
                        marginTop: "7px",
                      }}
                    >
                      {obtenerValor(item, [
                        "ciudad",
                        "municipio",
                        "nombre",
                      ]) ||
                        "Ubicación registrada"}
                    </strong>

                    <span
                      style={{
                        display: "block",
                        color: "#64748b",
                        fontSize: "13px",
                        marginTop: "5px",
                      }}
                    >
                      Lat:{" "}
                      {obtenerValor(item, [
                        "latitud",
                        "lat",
                        "latitude",
                      ])}
                      <br />
                      Lng:{" "}
                      {obtenerValor(item, [
                        "longitud",
                        "lng",
                        "longitude",
                      ])}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </ChartCard>

        {/* PIE */}
        <footer
          style={{
            textAlign: "center",
            color: "#64748b",
            padding: "30px 10px",
          }}
        >
          <p
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "7px",
            }}
          >
            <ShieldCheck size={18} />
            Información generada a partir de
            reportes ciudadanos.
          </p>

          {dashboard?.generadoEn && (
            <small>
              Última actualización:{" "}
              {new Date(
                dashboard.generadoEn
              ).toLocaleString("es-CO")}
            </small>
          )}
        </footer>
      </main>
    </div>
  );
};

/* =====================================================
   COMPONENTES AUXILIARES
===================================================== */

const Indicador = ({
  icon,
  titulo,
  valor,
  texto,
  alerta = false,
}) => {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "14px",
        padding: "20px",
        boxShadow:
          "0 2px 10px rgba(0,0,0,.05)",
        borderTop: `4px solid ${
          alerta ? "#dc2626" : "#2563eb"
        }`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "9px",
          color: alerta
            ? "#dc2626"
            : "#2563eb",
        }}
      >
        {icon}

        <strong>{titulo}</strong>
      </div>

      <div
        style={{
          fontSize: "32px",
          fontWeight: "800",
          marginTop: "10px",
        }}
      >
        {valor}
      </div>

      <div
        style={{
          color: "#64748b",
          fontSize: "13px",
          marginTop: "4px",
        }}
      >
        {texto}
      </div>
    </div>
  );
};

const InfoCard = ({
  titulo,
  icon,
  valor,
}) => {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "14px",
        padding: "20px",
        boxShadow:
          "0 2px 10px rgba(0,0,0,.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "#2563eb",
          fontWeight: "bold",
        }}
      >
        {icon}
        {titulo}
      </div>

      <div
        style={{
          marginTop: "12px",
          fontSize: "20px",
          fontWeight: "800",
        }}
      >
        {valor}
      </div>
    </div>
  );
};

const ChartCard = ({
  titulo,
  icon,
  children,
}) => {
  return (
    <section
      style={{
        background: "white",
        borderRadius: "14px",
        padding: "20px",
        boxShadow:
          "0 2px 10px rgba(0,0,0,.05)",
        marginBottom: "20px",
      }}
    >
      <h2
        style={{
          marginTop: 0,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "19px",
        }}
      >
        {icon}
        {titulo}
      </h2>

      <div>{children}</div>
    </section>
  );
};

const BarItem = ({
  nombre,
  valor,
  max,
}) => {
  const porcentajeBarra =
    Math.max(
      3,
      (valor / max) * 100
    );

  return (
    <div
      style={{
        marginBottom: "14px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          marginBottom: "5px",
          fontSize: "14px",
        }}
      >
        <span>{nombre}</span>

        <strong>{valor}</strong>
      </div>

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
            background: "#2563eb",
            borderRadius: "20px",
          }}
        />
      </div>
    </div>
  );
};

const Empty = () => {
  return (
    <div
      style={{
        padding: "30px",
        textAlign: "center",
        color: "#94a3b8",
      }}
    >
      No hay información disponible.
    </div>
  );
};

export default Reportes;
