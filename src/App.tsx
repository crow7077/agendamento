import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "./pages/firebase";
import { onAuthStateChanged } from "firebase/auth";

// Importe suas páginas (verifique se os caminhos estão corretos)
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Dashboard from "./pages/Dashboard";
import Agendamento from "./pages/Agendamento";
import Financas from "./pages/Financas";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Esse "observador" checa se o usuário já estava logado antes
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
          background: "#0f172a",
          color: "white",
        }}
      >
        Carregando sistema...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Se o usuário não estiver logado, ele vai para o Login. Se estiver, vai para o Agendamento */}
        <Route
          path="/"
          element={!user ? <Login /> : <Navigate to="/agendamento" />}
        />

        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rotas Protegidas (Sempre checam se o user existe) */}
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
      </Routes>
    </Router>
  );
}
