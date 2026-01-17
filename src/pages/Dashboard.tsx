import { useState, useEffect } from "react";
import {
  Users,
  DollarSign,
  LogOut,
  Clock,
  Plus,
  TrendingUp,
  Calendar,
} from "lucide-react";
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
    async function loadData() {
      if (auth.currentUser) {
        // 1. Busca dados do perfil do usuário
        const userRef = doc(db, "usuarios", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        const data = userSnap.data();
        setUserData(data);

        // 2. Define o que o usuário pode ver (Dono vê tudo, Cliente vê o dele)
        const q =
          data?.cargo === "dono"
            ? query(collection(db, "agendamentos"))
            : query(
                collection(db, "agendamentos"),
                where("clienteId", "==", auth.currentUser.uid),
              );

        // 3. Listener em tempo real
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          setAgendamentos(docs);
          setLoading(false);
        });

        return () => unsubscribe();
      }
    }
    loadData();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const isDono = userData?.cargo === "dono";

  if (loading) return <div className="loading-screen">Carregando...</div>;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="logo-section">
          <h2>
            Barber<span>Shop</span>
          </h2>
        </div>
        <nav className="sidebar-nav">
          <button className="active">
            <TrendingUp size={20} /> Dashboard
          </button>
          {isDono ? (
            <button onClick={() => navigate("/financas")}>
              <DollarSign size={20} /> Finanças
            </button>
          ) : (
            <button onClick={() => navigate("/agendamento")}>
              <Plus size={20} /> Novo Agendamento
            </button>
          )}
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} /> Sair
        </button>
      </aside>

      {/* Conteúdo Principal */}
      <main className="dashboard-main">
        <header className="main-header">
          <h1>Olá, {userData?.nome?.split(" ")[0]}</h1>
          {!isDono && (
            <button
              className="btn-agendar-top"
              onClick={() => navigate("/agendamento")}
            >
              <Calendar size={18} /> Agendar Novo
            </button>
          )}
        </header>

        {/* Estatísticas Rápidas */}
        <section className="stats-grid">
          {isDono ? (
            <>
              <div className="stat-card">
                <h3>Total de Agendamentos</h3>
                <p>{agendamentos.length}</p>
              </div>
              <div className="stat-card">
                <h3>Faturamento Estimado</h3>
                <p>R$ {(agendamentos.length * 50).toLocaleString("pt-BR")}</p>
              </div>
            </>
          ) : (
            <div className="cliente-welcome-card">
              <h3>
                Você possui {agendamentos.length} agendamento(s) ativo(s).
              </h3>
            </div>
          )}
        </section>

        {/* Lista de Agendamentos */}
        <section className="recent-appointments">
          <h2>{isDono ? "Agenda Geral" : "Meus Agendamentos"}</h2>
          <div className="appointments-list">
            {agendamentos.length > 0 ? (
              agendamentos.map((item) => (
                <div key={item.id} className="appointment-item">
                  <div className="item-main">
                    <Clock size={18} color="#E5B817" />
                    <div className="details">
                      <strong>{item.servico}</strong>
                      <span>
                        {isDono ? `Cliente: ${item.clienteNome}` : "Confirmado"}
                      </span>
                    </div>
                  </div>
                  <div className="item-time">
                    <span>
                      {item.data} - {item.horario}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-list">Nenhum agendamento encontrado.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
