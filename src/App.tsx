import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "./pages/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import Login from "./pages/Login";
import CadastroUsuario from "./pages/CadastroUsuario";
import Dashboard from "./pages/Dashboard";
import Agendamento from "./pages/Agendamento";
import Financas from "./pages/Financas";

interface ProtectedRouteProps {
  user: any;
  requireDono?: boolean;
  children: JSX.Element;
}

function ProtectedRoute({
  user,
  requireDono = false,
  children,
}: ProtectedRouteProps) {
  const [cargo, setCargo] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkCargo() {
      if (user) {
        try {
          // Busca o perfil do usuário no Firestore para validar acesso
          const docRef = doc(db, "usuarios", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setCargo(docSnap.data().cargo);
          }
        } catch (error) {
          console.error("Erro ao validar cargo:", error);
        }
      }
      setChecking(false);
    }
    checkCargo();
  }, [user]);

  if (!user) return <Navigate to="/" />;
  if (checking) return <div style={{ background: "#000", height: "100vh" }} />;

  // Se a rota exige ser dono (ex: Finanças) e o usuário é cliente, volta para Dashboard
  if (requireDono && cargo !== "dono") {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="loading-screen">Carregando...</div>;

  return (
    <Router>
      <Routes>
        {/* Se logado, sempre envia para o Dashboard como ponto central */}
        <Route
          path="/"
          element={!user ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route path="/cadastro" element={<CadastroUsuario />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/agendamento"
          element={
            <ProtectedRoute user={user}>
              <Agendamento />
            </ProtectedRoute>
          }
        />

        <Route
          path="/financas"
          element={
            <ProtectedRoute user={user} requireDono={true}>
              <Financas />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
