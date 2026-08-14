import React from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Search,
  AlertTriangle,
  BarChart3,
  MapPin,
  ShieldCheck,
  Users,
  Home,
} from "lucide-react";

const MenuPrincipal = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        color: "#1e293b",
      }}
    >
      {/* =====================================================
          ENCABEZADO
      ====================================================== */}

      <header
        style={{
          width: "100%",
          background: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <img
          src="https://raw.githubusercontent.com/alfredfullstack2024/tiendasappfrontend/main/src/superior.png"
          alt="Sistema de Ayuda Ciudadana"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
        />
      </header>

      {/* =====================================================
          HERO
      ====================================================== */}

      <section
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e3a5f 55%, #2563eb 100%)",
          color: "#ffffff",
          padding: "55px 20px 60px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: "1050px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255,255,255,0.12)",
              padding: "8px 16px",
              borderRadius: "30px",
              marginBottom: "20px",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            🇨🇴 Herramienta ciudadana de ayuda
          </div>

          <h1
            style={{
              fontSize: "clamp(30px, 5vw, 52px)",
              margin: "0 auto 18px",
              lineHeight: "1.1",
              maxWidth: "900px",
            }}
          >
            Sistema de Ayuda Ciudadana
          </h1>

          <p
            style={{
              fontSize: "18px",
              lineHeight: "1.6",
              maxWidth: "780px",
              margin: "0 auto 30px",
              color: "#e2e8f0",
            }}
          >
            Una herramienta para que las personas puedan reportar su
            situación, informar que están a salvo, solicitar ayuda y
            facilitar la localización de personas después de una emergencia.
          </p>

          {/* CIUDADES */}

          <div
            style={{
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: "16px",
              padding: "18px",
              maxWidth: "900px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "10px",
                fontWeight: "700",
              }}
            >
              <MapPin size={20} />
              Municipios habilitados
            </div>

            <p
              style={{
                margin: 0,
                lineHeight: "1.8",
                color: "#e2e8f0",
                fontSize: "14px",
              }}
            >
              Armenia • Bagadó • Bugalagrande • Cali • Cartago •
              Certegui • Condoto • Dosquebradas • El Cantón de San
              Pablo • La Tebaida • La Unión • La Victoria • Manizales •
              Montenegro • Novita • Pereira • Quibdó • Roldanillo •
              Salento • San Francisco • San José del Palmar •
              Subachoque • Tabio • Tadó • Toro • Tuluá • Viterbo •
              Zarzal
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          ACCIONES PRINCIPALES
      ====================================================== */}

      <main
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <h2
            style={{
              margin: "0 0 10px",
              fontSize: "30px",
              color: "#0f172a",
            }}
          >
            ¿Qué necesitas reportar?
          </h2>

          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: "16px",
            }}
          >
            Selecciona la opción que corresponda a tu situación.
          </p>
        </div>

        {/* =====================================================
            TARJETAS
        ====================================================== */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {/* NECESITO AYUDA */}

          <Link
            to="/registro"
            style={{
              textDecoration: "none",
              color: "inherit",
              background: "#ffffff",
              borderRadius: "18px",
              padding: "28px 22px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 8px 25px rgba(15,23,42,0.07)",
              display: "block",
              transition: "transform .2s",
            }}
          >
            <div
              style={{
                width: "58px",
                height: "58px",
                borderRadius: "15px",
                background: "#fee2e2",
                color: "#dc2626",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "18px",
              }}
            >
              <AlertTriangle size={30} />
            </div>

            <h3
              style={{
                margin: "0 0 8px",
                color: "#0f172a",
              }}
            >
              Reportar una situación
            </h3>

            <p
              style={{
                margin: 0,
                color: "#64748b",
                lineHeight: "1.5",
              }}
            >
              Registra tu situación, daños, necesidades o solicita
              ayuda.
            </p>
          </Link>

          {/* PERSONAS NO LOCALIZADAS */}

          <Link
            to="/desaparecidos"
            style={{
              textDecoration: "none",
              color: "inherit",
              background: "#ffffff",
              borderRadius: "18px",
              padding: "28px 22px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 8px 25px rgba(15,23,42,0.07)",
              display: "block",
            }}
          >
            <div
              style={{
                width: "58px",
                height: "58px",
                borderRadius: "15px",
                background: "#fef3c7",
                color: "#d97706",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "18px",
              }}
            >
              <Search size={30} />
            </div>

            <h3
              style={{
                margin: "0 0 8px",
                color: "#0f172a",
              }}
            >
              Personas no localizadas
            </h3>

            <p
              style={{
                margin: 0,
                color: "#64748b",
                lineHeight: "1.5",
              }}
            >
              Consulta los reportes de personas que aún no han sido
              localizadas.
            </p>
          </Link>

          {/* PERSONAS A SALVO */}

          <Link
            to="/salvos"
            style={{
              textDecoration: "none",
              color: "inherit",
              background: "#ffffff",
              borderRadius: "18px",
              padding: "28px 22px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 8px 25px rgba(15,23,42,0.07)",
              display: "block",
            }}
          >
            <div
              style={{
                width: "58px",
                height: "58px",
                borderRadius: "15px",
                background: "#dcfce7",
                color: "#16a34a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "18px",
              }}
            >
              <Heart size={30} />
            </div>

            <h3
              style={{
                margin: "0 0 8px",
                color: "#0f172a",
              }}
            >
              Personas a salvo
            </h3>

            <p
              style={{
                margin: 0,
                color: "#64748b",
                lineHeight: "1.5",
              }}
            >
              Consulta quiénes han informado que se encuentran a salvo.
            </p>
          </Link>

          {/* DASHBOARD */}

          <Link
            to="/reportes"
            style={{
              textDecoration: "none",
              color: "inherit",
              background: "#ffffff",
              borderRadius: "18px",
              padding: "28px 22px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 8px 25px rgba(15,23,42,0.07)",
              display: "block",
            }}
          >
            <div
              style={{
                width: "58px",
                height: "58px",
                borderRadius: "15px",
                background: "#dbeafe",
                color: "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "18px",
              }}
            >
              <BarChart3 size={30} />
            </div>

            <h3
              style={{
                margin: "0 0 8px",
                color: "#0f172a",
              }}
            >
              Información y reportes
            </h3>

            <p
              style={{
                margin: 0,
                color: "#64748b",
                lineHeight: "1.5",
              }}
            >
              Consulta información estadística sobre las situaciones
              reportadas.
            </p>
          </Link>
        </div>

        {/* =====================================================
            INFORMACIÓN
        ====================================================== */}

        <section
          style={{
            marginTop: "45px",
            background: "#ffffff",
            borderRadius: "20px",
            padding: "30px",
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "25px",
            }}
          >
            <div>
              <ShieldCheck
                size={28}
                color="#2563eb"
              />

              <h3
                style={{
                  margin: "10px 0 6px",
                }}
              >
                Información organizada
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  lineHeight: "1.5",
                }}
              >
                Los reportes permiten conocer qué está ocurriendo en
                cada municipio.
              </p>
            </div>

            <div>
              <MapPin
                size={28}
                color="#2563eb"
              />

              <h3
                style={{
                  margin: "10px 0 6px",
                }}
              >
                Ubicación
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  lineHeight: "1.5",
                }}
              >
                Los datos pueden ayudar a identificar las zonas con
                mayor concentración de reportes.
              </p>
            </div>

            <div>
              <Users
                size={28}
                color="#2563eb"
              />

              <h3
                style={{
                  margin: "10px 0 6px",
                }}
              >
                Comunidad
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  lineHeight: "1.5",
                }}
              >
                La información ciudadana ayuda a tener una visión más
                clara de las necesidades.
              </p>
            </div>

            <div>
              <Home
                size={28}
                color="#2563eb"
              />

              <h3
                style={{
                  margin: "10px 0 6px",
                }}
              >
                Viviendas
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  lineHeight: "1.5",
                }}
              >
                También se pueden registrar daños y condiciones de las
                viviendas.
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            MENSAJE
        ====================================================== */}

        <div
          style={{
            marginTop: "35px",
            textAlign: "center",
            padding: "25px",
            background: "#eff6ff",
            borderRadius: "18px",
            color: "#1e3a8a",
          }}
        >
          <strong>
            🇨🇴 Una comunidad informada puede ayudar mejor.
          </strong>

          <p
            style={{
              margin: "8px 0 0",
              color: "#475569",
            }}
          >
            Registra información real y útil. Evita reportes falsos o
            información que pueda generar confusión.
          </p>
        </div>
      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer
        style={{
          background: "#0f172a",
          color: "#ffffff",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "40px 20px 25px",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "30px",
          }}
        >
          <div>
            <h3
              style={{
                margin: "0 0 10px",
              }}
            >
              🇨🇴 Sistema de Ayuda Ciudadana
            </h3>

            <p
              style={{
                margin: 0,
                color: "#94a3b8",
                lineHeight: "1.6",
              }}
            >
              Herramienta ciudadana para registrar y consultar
              información durante una emergencia.
            </p>
          </div>

          <div>
            <h4
              style={{
                margin: "0 0 12px",
              }}
            >
              Ciudadanía
            </h4>

            <Link
              to="/registro"
              style={{
                display: "block",
                color: "#cbd5e1",
                textDecoration: "none",
                marginBottom: "8px",
              }}
            >
              Reportar una situación
            </Link>

            <Link
              to="/desaparecidos"
              style={{
                display: "block",
                color: "#cbd5e1",
                textDecoration: "none",
                marginBottom: "8px",
              }}
            >
              Personas no localizadas
            </Link>

            <Link
              to="/salvos"
              style={{
                display: "block",
                color: "#cbd5e1",
                textDecoration: "none",
              }}
            >
              Personas a salvo
            </Link>
          </div>

          <div>
            <h4
              style={{
                margin: "0 0 12px",
              }}
            >
              Información
            </h4>

            <Link
              to="/reportes"
              style={{
                display: "block",
                color: "#cbd5e1",
                textDecoration: "none",
                marginBottom: "8px",
              }}
            >
              Dashboard de reportes
            </Link>

            <a
              href="#contacto"
              style={{
                display: "block",
                color: "#cbd5e1",
                textDecoration: "none",
              }}
            >
              Contacto
            </a>
          </div>
        </div>

        <div
          style={{
            borderTop:
              "1px solid #1e293b",
            textAlign: "center",
            padding: "18px 20px",
            color: "#94a3b8",
            fontSize: "14px",
          }}
        >
          © 2026 ALFREDFULLSTACK.COM · Herramienta ciudadana
        </div>
      </footer>
    </div>
  );
};

export default MenuPrincipal;
