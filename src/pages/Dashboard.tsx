import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Calendar, DollarSign, LogOut, User, PlusCircle } from "lucide-react";

export default function Dashboard() {
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // PASSO 1: SEGURANÇA (Verifica se o usuário está logado)
    const user = auth.currentUser;
    if (!user) {
      navigate("/"); // Se não estiver logado, expulsa para o login
      return;
    }

    const carregarDados = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "agendamentos"));
        const lista = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAgendamentos(lista);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    carregarDados();
  }, [navigate]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  return (
    <div
      className="login-container"
      style={{ display: "block", overflowY: "auto", padding: "20px" }}
    >
      {/* CABEÇALHO */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ color: "white" }}>Olá, Renato</h2>
        <button
          onClick={handleLogout}
          className="btn-submit"
          style={{ width: "auto", padding: "10px", backgroundColor: "#ef4444" }}
        >
          <LogOut size={20} />
        </button>
      </header>

      {/* MENU DE ACESSO RÁPIDO */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => navigate("/agendamento")}
          className="btn-submit"
          style={{ fontSize: "0.9rem" }}
        >
          <PlusCircle size={18} /> Novo Agendamento
        </button>
        <button
          onClick={() => navigate("/financas")}
          className="btn-submit"
          style={{ fontSize: "0.9rem", backgroundColor: "#10b981" }}
        >
          <DollarSign size={18} /> Ver Finanças
        </button>
      </div>

      {/* CARD DE RESUMO FINANCEIRO */}
      <div
        className="login-card"
        style={{ marginBottom: "20px", borderLeft: "5px solid #10b981" }}
      >
        <div
          className="form-label"
          style={{ color: "#10b981", fontWeight: "bold" }}
        >
          <DollarSign size={20} /> Saldo de Hoje
        </div>
        <h1 style={{ margin: "10px 0" }}>R$ 50,00</h1>
      </div>

      {/* LISTA DE AGENDAMENTOS */}
      <div className="login-card">
        <div className="form-label">
          <Calendar size={20} /> Clientes Agendados
        </div>

        {agendamentos.length > 0 ? (
          agendamentos.map((item) => (
            <div
              key={item.id}
              style={{
                padding: "15px 0",
                borderBottom: "1px solid #eee",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#e0e7ff",
                  padding: "8px",
                  borderRadius: "50%",
                }}
              >
                <User size={20} color="#6366f1" />
              </div>
              <div>
                <strong style={{ display: "block", color: "#333" }}>
                  {item.nome}
                </strong>
                <span style={{ fontSize: "0.8rem", color: "#666" }}>
                  {item.servico} - R$ {item.valor}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", padding: "20px", color: "#999" }}>
            Nenhum agendamento para hoje.
          </p>
        )}
      </div>
    </div>
  );
}
