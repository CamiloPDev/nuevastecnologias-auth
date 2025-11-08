import React from "react";

const Home = () => {
  // Función para redirigir al login de Microsoft
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/microsoft`;
  };

  return (
    <div
      style={{
        backgroundColor: "#e6f0ff", // fondo azul claro
        color: "#002b5b", // texto azul oscuro
        minHeight: "100vh", // ocupar toda la altura
        width: "100vw", // ocupar todo el ancho
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          backgroundColor: "#d0e4ff", // cuadro más claro
          padding: "40px",
          borderRadius: "12px", // bordes redondeados
          width: "90%",
          maxWidth: "500px", // ancho máximo
          textAlign: "center",
          boxShadow: "0 0 15px rgba(0, 43, 91, 0.1)", // sombra ligera
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "10px" }}>
          Autenticación con Microsoft {/* Título */}
        </h1>
        <p style={{ marginBottom: "20px" }}>
          Inicia sesión para continuar {/* Instrucción */}
        </p>
        <button
          onClick={handleLogin} // acción al hacer click
          style={{
            backgroundColor: "#0078d7", // azul Microsoft
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            cursor: "pointer", // puntero al pasar sobre el botón
            fontSize: "16px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)", // sombra del botón
          }}
        >
          Iniciar sesión con Microsoft {/* texto del botón */}
        </button>
      </div>
    </div>
  );
};

export default Home;
