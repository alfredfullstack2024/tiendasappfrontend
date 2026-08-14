
import React from "react";
import { Link } from "react-router-dom";
import {
  Store,
  Plus,
  Download,
  HeartHandshake,
  Search,
  MapPin,
  AlertTriangle,
} from "lucide-react";

const MenuPrincipal = () => {
  const opcionesAyuda = [
    {
      titulo: "Necesito ayuda",
      descripcion: "Registra lo que necesitas y dónde te encuentras.",
      icono: "🆘",
      color: "#dc2626",
    },
    {
      titulo: "Daños en mi vivienda",
      descripcion: "Reporta el estado de tu vivienda después del sismo.",
      icono: "🏚️",
      color: "#ea580c",
    },
    {
      titulo: "Persona no localizada",
      descripcion: "Reporta una persona que aún no ha sido localizada.",
      icono: "🔎",
      color: "#7c3aed",
    },
    {
      titulo: "Estoy a salvo",
      descripcion: "Informa que estás bien y dónde te encuentras.",
      icono: "❤️",
      color: "#16a34a",
    },
    {
      titulo: "Quiero ofrecer ayuda",
      descripcion: "Indica qué puedes aportar a otras personas.",
      icono: "🤝",
      color: "#2563eb",
    },
    {
      titulo: "Otro reporte",
      descripcion: "Registra cualquier otra situación importante.",
      icono: "📢",
      color: "#475569",
    },
  ];

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

  return (
    <div className="menu-principal">

      {/* HEADER */}

      <header
        style={{
          width: "100%",
          background: "#fff",
        }}
      >
        <img
          src="https://raw.githubusercontent.com/alfredfullstack2024/tiendasappfrontend/main/src/superior.png"
          alt="Colombia Ayuda"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
        />
      </header>


      {/* HERO */}

      <section className="hero">

        <div className="hero-content">

          <div
            style={{
              background: "#fef2f2",
              padding: "18px",
              borderRadius: "12px",
              marginTop: "30px",
              textAlign: "center",
              border: "1px solid #fecaca",
            }}
          >
            <strong>
              🇨🇴 TIENDASAPP AYUDA
            </strong>

            <br />

            <span
              style={{
                display: "block",
                marginTop: "8px",
                color: "#7f1d1d",
              }}
            >
              Una herramienta ciudadana para registrar situaciones,
              necesidades y personas afectadas.
            </span>
          </div>


          {/* CIUDADES */}

          <div
            style={{
              background: "#eff6ff",
              padding: "15px",
              borderRadius: "12px",
              marginTop: "20px",
              textAlign: "center",
            }}
          >

            <strong>
              <MapPin
                size={18}
                style={{
                  verticalAlign: "middle",
                  marginRight: "5px",
                }}
              />

              Municipios habilitados para reportes
            </strong>

            <p
              style={{
                marginTop: "10px",
                lineHeight: "1.7",
                marginBottom: 0,
              }}
            >
              {ciudades.join(" • ")}
            </p>

          </div>


          <h2>
            🇨🇴 Colombia se ayuda
          </h2>

          <p>
            Registra tu situación, informa que estás a salvo,
            solicita ayuda o ayuda a otras personas afectadas.
          </p>


          {/* BOTON PRINCIPAL */}

          <div
            className="hero-actions"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "15px",
              flexWrap: "wrap",
              marginTop: "25px",
            }}
          >

            <Link
              to="/registro"
              className="btn-registro"
            >
              <Plus size={20} />

              Registrar mi situación
            </Link>


            <a
              href="https://www.appcreator24.com/app4111620-h57lx9"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#16a34a",
                color: "#fff",
                textDecoration: "none",
                padding: "14px 24px",
                borderRadius: "10px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow:
                  "0 4px 12px rgba(0,0,0,.2)",
              }}
            >
              <Download size={20} />

              📲 App Android
            </a>

          </div>


          <p
            style={{
              marginTop: "18px",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: "500",
            }}
          >
            Registro gratuito. La información puede ayudar a
            identificar dónde existen necesidades.
          </p>

        </div>

      </section>


      {/* OPCIONES */}

      <section className="categorias-section">

        <div className="container">

          <h2 className="section-title">

            <HeartHandshake size={24} />

            ¿Qué necesitas reportar?

          </h2>


          <div className="categorias-grid">

            {opcionesAyuda.map(
              (opcion, index) => (

                <Link
                  key={index}
                  to="/registro"
                  className="categoria-card"
                  style={{
                    textDecoration: "none",
                  }}
                >

                  <div
                    className="categoria-icon"
                    style={{
                      fontSize: "2.8rem",
                    }}
                  >
                    {opcion.icono}
                  </div>

                  <h3>
                    {opcion.titulo}
                  </h3>

                  <p
                    style={{
                      fontSize: "14px",
                      color: "#64748b",
                      lineHeight: "1.5",
                      margin: "8px 0",
                    }}
                  >
                    {opcion.descripcion}
                  </p>

                  <div
                    className="categoria-arrow"
                    style={{
                      color: opcion.color,
                    }}
                  >
                    →
                  </div>

                </Link>

              )
            )}

          </div>

        </div>

      </section>


      {/* INFORMACION */}

      <section
        style={{
          padding: "40px 20px",
          background: "#f8fafc",
        }}
      >

        <div
          className="container"
          style={{
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "20px",
            }}
          >

            <div
              style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "12px",
                textAlign: "center",
                border: "1px solid #e2e8f0",
              }}
            >

              <MapPin
                size={32}
                color="#2563eb"
              />

              <h3>
                Información localizada
              </h3>

              <p>
                Los reportes pueden ser asociados
                a un municipio y posteriormente
                representados en un mapa.
              </p>

            </div>


            <div
              style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "12px",
                textAlign: "center",
                border: "1px solid #e2e8f0",
              }}
            >

              <AlertTriangle
                size={32}
                color="#ea580c"
              />

              <h3>
                Reporta una situación
              </h3>

              <p>
                Cada registro ayuda a conocer
                qué está ocurriendo y qué
                necesidades existen.
              </p>

            </div>


            <div
              style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "12px",
                textAlign: "center",
                border: "1px solid #e2e8f0",
              }}
            >

              <HeartHandshake
  size={32}
  color="#16a34a"
/>

              <h3>
                La comunidad ayuda
              </h3>

              <p>
                También puedes registrar
                qué tipo de ayuda estás
                dispuesto a ofrecer.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* DIRECTORIO */}

      <section
        style={{
          padding: "30px 20px",
          textAlign: "center",
          background: "#fff",
        }}
      >

        <div className="container">

          <Store
            size={30}
            color="#2563eb"
          />

          <h3>
            COLOMBIA SOMOS TODOS
          </h3>

          <p>
            Directorio para reportar su situacion
          </p>

          <Link
            to="/"
            className="btn-registro"
            style={{
              display: "inline-flex",
              marginTop: "10px",
            }}
          >
            <Search size={18} />

            Ver directorio

          </Link>

        </div>

      </section>


      {/* FOOTER */}

      <footer className="footer">

        <div className="footer-content">

          <div className="footer-section">

            <div className="logo">

              <HeartHandshake size={24} />

              <span>
                COLOMBIA AYUDA
              </span>

            </div>

            <p>
              Una herramienta ciudadana
              para conectar información
              y necesidades durante
              la emergencia.
            </p>

          </div>


          <div className="footer-section">

            <h4>
              Ciudadanía
            </h4>

            <ul>

              <li>
                <Link to="/registro">
                  Registrar mi situación
                </Link>
              </li>

              <li>
                <Link to="/registro">
                  Reportar persona no localizada
                </Link>
              </li>

            </ul>

          </div>


          <div className="footer-section">

            <h4>
              ALFREDFULLSTACK.COM
            </h4>

            <ul>

              <li>
                <Link to="/registro">
                  Registrar situación
                </Link>
              </li>

              <li>
                <a href="#contacto">
                  Contacto
                </a>
              </li>

            </ul>

          </div>

        </div>


        <div className="footer-bottom">

          <p>
            © 2026 www.alfredfullstack.com · Herramienta ciudadana
          </p>

        </div>

      </footer>

    </div>
  );
};

export default MenuPrincipal;
