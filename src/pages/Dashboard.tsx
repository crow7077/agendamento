import { useState, useEffect } from "react";
import { DollarSign, LogOut, Plus, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import {
  collection,
  query,
  onSnapshot,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      if (auth.currentUser) {
        const userRef = doc(db, "usuarios", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        const data = userSnap.data();
        setUserData(data);

        const q =
          data?.cargo === "dono"
            ? query(collection(db, "agendamentos"))
            : query(
                collection(db, "agendamentos"),
                where("clienteId", "==", auth.currentUser.uid),
              );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          setAgendamentos(
            snapshot.docs.map((d) => ({ id: d.id, ...d.data() })),
          );
          setLoading(false);
        });
        return () => unsubscribe();
      }
    }
    loadDashboard();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <nav className="sidebar-nav">
          <button className="active">
            <TrendingUp size={20} /> Dashboard
          </button>
          {userData?.cargo === "dono" ? (
            <button onClick={() => navigate("/financas")}>
              <DollarSign size={20} /> Finanças
            </button>
          ) : (
            <button onClick={() => navigate("/agendamento")}>
              <Plus size={20} /> Agendar
            </button>
          )}
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} /> Sair
        </button>
      </aside>
      <main className="dashboard-main">
        <header className="main-header">
          <h1>Olá, {userData?.nome?.split(" ")[0]}</h1>
        </header>
        {/* Conteúdo resumido para build */}
        <section className="stats-grid">
          <div className="stat-card">
            <h3>Agendamentos</h3>
            <p>{agendamentos.length}</p>
          </div>
        </section>
      </main>
    </div>
  );
}
