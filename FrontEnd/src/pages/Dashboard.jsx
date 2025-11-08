import React, { useEffect, useState } from "react";
import api from "../services/api";

const Dashboard = () => {
  const [user, setUser] = useState(null); // Estado para guardar datos del usuario

  useEffect(() => {
    // Ajustes globales de estilo del body
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.backgroundColor = "#e6f0ff"; // fondo azul claro
    document.body.style.overflow = "hidden"; // evita scroll

    // Obtener datos del usuario desde el backend
    api
      .get("/user")
      .then((res) => setUser(res.data)) // guardar usuario
      .catch(() => {
        window.location.href = "/"; // si falla, redirigir al login
      });

    // Limpiar estilos cuando se desmonte el componente
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!user)
    return (
      <div
        style={{
          backgroundColor: "#e6f0ff",
          color: "#002b5b",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Cargando datos... {/* Mensaje mientras se carga el usuario */}
      </div>
    );

  // Separar nombre y apellido
  const nameParts = (user.displayName || "").trim().split(/\s+/);
  const firstName = nameParts.length > 0 ? nameParts[0] : "";
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

  return (
    <div
      style={{
        backgroundColor: "#e6f0ff",
        color: "#002b5b",
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: 0,
        padding: 0,
      }}
    >
      <div
        style={{
          backgroundColor: "#d0e4ff",
          padding: "40px",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "600px",
          boxShadow: "0 0 15px rgba(0, 43, 91, 0.1)",
          textAlign: "center",
        }}
      >
        <h1>👋 Bienvenido</h1>
        <p>
          <b>Nombre:</b> {firstName} {/* Mostrar primer nombre */}
        </p>
        <p>
          <b>Apellido:</b> {lastName} {/* Mostrar apellido */}
        </p>
        <p>
          <b>Correo:</b> {user.mail} {/* Mostrar correo */}
        </p>
        <button
          onClick={() =>
            (window.location.href = `${import.meta.env.VITE_BACKEND_URL}/logout`)
          }
          style={{
            backgroundColor: "#0078d7", // azul Microsoft
            color: "white",
            border: "none",
            padding: "12px 24px",
            marginTop: "20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          Cerrar sesión {/* Botón para salir */}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
