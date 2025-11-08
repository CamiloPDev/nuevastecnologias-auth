import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cookieSession from "cookie-session";
import cors from "cors";

dotenv.config();
const app = express();

// --- Configuración general ---
app.set("trust proxy", 1); // Necesario en Codespaces

// --- CORS ---
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // frontend exacto
    credentials: true, // permite enviar cookies
  })
);

app.use(express.json());

// --- Sesión ---
app.use(
  cookieSession({
    name: "session",
    keys: ["clave_secreta"],
    maxAge: 24 * 60 * 60 * 1000, // 24h
    sameSite: "none",
    secure: true, // Codespaces usa HTTPS
    // dominio eliminado para que funcione entre subdominios
  })
);

// --- Login Microsoft ---
app.get("/auth/microsoft", (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    response_type: "code",
    redirect_uri: process.env.REDIRECT_URI,
    response_mode: "query",
    scope: "openid profile email offline_access User.Read",
  });
  res.redirect(
    `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params}`
  );
});

// --- Callback Microsoft ---
app.get("/auth/microsoft/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.redirect(`${process.env.FRONTEND_URL}/`);

  try {
    // Obtener token
    const tokenRes = await axios.post(
      "https://login.microsoftonline.com/common/oauth2/v2.0/token",
      new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        scope: "openid profile email offline_access User.Read",
        code,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: "authorization_code",
        client_secret: process.env.CLIENT_SECRET,
      })
    );

    const access_token = tokenRes.data.access_token;

    // Obtener datos del usuario
    const userRes = await axios.get("https://graph.microsoft.com/v1.0/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const userData = userRes.data;

    console.log("Datos del usuario Microsoft:", userData);

    const cleanMail =
      userData.mail?.split("#EXT#")[0] ||
      userData.userPrincipalName?.split("#EXT#")[0] ||
      "Sin correo";

    // Guardar en sesión (sin foto)
    req.session.user = {
      id: userData.id,
      displayName: userData.displayName,
      mail: cleanMail,
    };

    // Redirigir al frontend con delay de 10s para Codespaces
    const redirectUrl = `${process.env.FRONTEND_URL}/dashboard`;
    const delayMs = 10000;
    console.log(
      `Esperando ${delayMs}ms antes de redirigir al frontend...`
    );
    setTimeout(() => res.redirect(redirectUrl), delayMs);
  } catch (err) {
    console.error(
      "Error autenticando:",
      err.response?.data || err.message
    );
    res.status(500).send("Error autenticando con Microsoft");
  }
});

// --- Obtener usuario ---
app.get("/user", (req, res) => {
  if (req.session.user) res.json(req.session.user);
  else res.status(401).send("No autenticado");
});

// --- Logout ---
app.get("/logout", (req, res) => {
  req.session = null;
  res.redirect(`${process.env.FRONTEND_URL}/`);
});

// --- Raíz ---
app.get("/", (req, res) =>
  res.send("Servidor backend Microsoft Auth funcionando")
);

// --- Iniciar servidor ---
app.listen(5000, () =>
  console.log("Servidor corriendo en puerto 5000")
);
