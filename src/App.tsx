import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState, type ReactNode } from "react";
import { auth, db } from "./pages/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import Login from "./pages/Login";
import CadastroUsuario from "./pages/CadastroUsuario";
import Dashboard from "./pages/Dashboard";
import Agendamento from "./pages/Agendamento";
import Financas from "./pages/Financas";

// Interface corrigida para evitar erro de namespace JSX
interface ProtectedRouteProps {
  user: any;
  requireDono?: boolean;
  children: ReactNode;
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

  if (requireDono && cargo !== "dono") {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
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
