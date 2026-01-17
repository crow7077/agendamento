import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "./pages/firebase";
import { onAuthStateChanged } from "firebase/auth";

// Importação das suas páginas
import Login from "./pages/Login";
import CadastroUsuario from "./pages/CadastroUsuario";
import Dashboard from "./pages/Dashboard";
import Agendamento from "./pages/Agendamento";
import Financas from "./pages/Financas";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Observador que checa o estado da autenticação em tempo real
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#000000",
          color: "#E5B817",
          fontFamily: "Inter, sans-serif",
        }}
      >
        Carregando sistema...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Rota Raiz (Login) */}
        <Route
          path="/"
          element={!user ? <Login /> : <Navigate to="/agendamento" />}
        />

        {/* Rota de Cadastro Única
            Agora o componente CadastroUsuario gerencia internamente se é Dono ou Cliente */}
        <Route path="/cadastro" element={<CadastroUsuario />} />

        {/* Rotas Protegidas (Só acessíveis se o 'user' existir) */}
        <Route
          path="/agendamento"
          element={user ? <Agendamento /> : <Navigate to="/" />}
        />

        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/" />}
        />

        <Route
          path="/financas"
          element={user ? <Financas /> : <Navigate to="/" />}
        />

        {/* Fallback: Redireciona qualquer rota desconhecida para o Login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
