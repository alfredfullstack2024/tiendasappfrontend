import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LockKeyhole,
  User,
  LogIn,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import axios from "axios";

const API_URL =
  "https://tiendasappbackend.onrender.com";

const AccesoAutoridades = () => {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const iniciarSesion = async (e) => {
    e.preventDefault();

    setError("");

    if (!usuario.trim() || !password) {
      setError(
        "Ingresa el usuario y la contraseña."
      );
      return;
    }

    try {
      setCargando(true);

      const response = await axios.post(
        `${API_URL}/api/admin/login`,
        {
          username: usuario.trim(),
          password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data?.ok) {
        navigate("/centro-control/reportes");
      } else {
        setError(
          "No fue posible iniciar sesión."
        );
      }
    } catch (err) {
      console.error(
        "Error iniciando sesión:",
        err
      );

      if (
        err.response?.status === 401
      ) {
        setError(
          "Usuario o contraseña incorrectos."
        );
      } else {
        setError(
          "No fue posible conectarse con el servidor."
        );
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px 20px",
        background:
          "linear-gradient(135deg, #0f172a, #1e3a8a)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          background: "#ffffff",
          borderRadius: "20px",
          padding: "40px",
          boxShadow:
            "0 20px 50px rgba(0,0,0,0.25)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              width: "70px",
              height: "70px",
              margin: "0 auto 18px",
              borderRadius: "50%",
              background: "#dbeafe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#1d4ed8",
            }}
          >
            <ShieldCheck size={38} />
          </div>

          <h1
            style={{
              margin: 0,
              color: "#111827",
              fontSize: "26px",
            }}
          >
            Centro de Autoridades
          </h1>

          <p
            style={{
              marginTop: "10px",
              color: "#64748b",
              lineHeight: 1.5,
            }}
          >
            Acceso restringido a la
            información de emergencia.
          </p>
        </div>

        {error && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              background: "#fee2e2",
              color: "#991b1b",
              padding: "12px 14px",
              borderRadius: "10px",
              marginBottom: "20px",
              fontSize: "14px",
            }}
          >
            <AlertCircle size={18} />

            <span>{error}</span>
          </div>
        )}

        <form onSubmit={iniciarSesion}>
          <div
            style={{
              marginBottom: "18px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              Usuario
            </label>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                border: "1px solid #cbd5e1",
                borderRadius: "10px",
                padding: "0 12px",
              }}
            >
              <User
                size={20}
                color="#64748b"
              />

              <input
                type="text"
                value={usuario}
                onChange={(e) =>
                  setUsuario(
                    e.target.value
                  )
                }
                autoComplete="username"
                placeholder="Usuario"
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  padding: "13px 5px",
                  fontSize: "16px",
                }}
              />
            </div>
          </div>

          <div
            style={{
              marginBottom: "25px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              Contraseña
            </label>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                border: "1px solid #cbd5e1",
                borderRadius: "10px",
                padding: "0 12px",
              }}
            >
              <LockKeyhole
                size={20}
                color="#64748b"
              />

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                autoComplete="current-password"
                placeholder="Contraseña"
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  padding: "13px 5px",
                  fontSize: "16px",
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={cargando}
            style={{
              width: "100%",
              border: "none",
              borderRadius: "10px",
              padding: "14px",
              background: cargando
                ? "#94a3b8"
                : "#2563eb",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "700",
              cursor: cargando
                ? "not-allowed"
                : "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <LogIn size={20} />

            {cargando
              ? "Verificando..."
              : "Ingresar"}
          </button>
        </form>

        <div
          style={{
            marginTop: "25px",
            paddingTop: "20px",
            borderTop:
              "1px solid #e5e7eb",
            textAlign: "center",
            color: "#94a3b8",
            fontSize: "12px",
          }}
        >
          Información protegida para
          organismos autorizados.
        </div>
      </div>
    </div>
  );
};

export default AccesoAutoridades;
