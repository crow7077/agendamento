import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Importa o seu App que já tem as rotas e o login
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
