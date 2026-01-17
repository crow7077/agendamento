import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, CheckCircle } from "lucide-react";
import { auth, db } from "./firebase";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import "./Agendamento.css"; // Certifique-se de ter os estilos para o calendário e seletores

const SERVICOS = [
  { id: 1, nome: "Corte Masculino", preco: 50 },
  { id: 2, nome: "Barba Terapia", preco: 35 },
  { id: 3, nome: "Combo (Corte + Barba)", preco: 75 },
];

const HORARIOS = [
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export default function Agendamento() {
  const navigate = useNavigate();
  const [servicoId, setServicoId] = useState<number | null>(null);
  const [horario, setHorario] = useState<string | null>(null);
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);

  // Função para salvar no Firebase
  const finalizarAgendamento = async () => {
    if (!servicoId || !horario || !data) return;

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuário não autenticado");

      // Busca o nome do usuário para salvar junto ao agendamento
      const userRef = doc(db, "usuarios", user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      const servicoNome = SERVICOS.find((s) => s.id === servicoId)?.nome;

      // Salva no Firestore
      await addDoc(collection(db, "agendamentos"), {
        clienteId: user.uid,
        clienteNome: userData?.nome || "Cliente",
        servico: servicoNome,
        data: data,
        horario: horario,
        status: "confirmado",
        createdAt: new Date(),
      });

      alert("Agendamento realizado com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao agendar:", error);
      alert("Erro ao salvar agendamento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-container">
      <header className="booking-header">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="btn-back"
        >
          <ChevronLeft size={24} />
        </button>
        <h1>Novo Agendamento</h1>
      </header>

      <main className="booking-content">
        {/* Seleção de Serviço */}
        <section className="booking-section">
          <h3>Escolha o Serviço</h3>
          <div className="services-grid">
            {SERVICOS.map((s) => (
              <div
                key={s.id}
                className={`service-card ${servicoId === s.id ? "selected" : ""}`}
                onClick={() => setServicoId(s.id)}
              >
                <span>{s.nome}</span>
                <strong>R$ {s.preco}</strong>
              </div>
            ))}
          </div>
        </section>

        {/* Seleção de Data */}
        <section className="booking-section">
          <h3>Data</h3>
          <input
            type="date"
            className="date-input"
            onChange={(e) => setData(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
        </section>

        {/* Seleção de Horário */}
        <section className="booking-section">
          <h3>Horários Disponíveis</h3>
          <div className="time-grid">
            {HORARIOS.map((h) => (
              <button
                key={h}
                className={`time-slot ${horario === h ? "selected" : ""}`}
                onClick={() => setHorario(h)}
              >
                {h}
              </button>
            ))}
          </div>
        </section>
      </main>

      <footer className="booking-footer">
        <button
          className="btn-confirm"
          disabled={!servicoId || !horario || !data || loading}
          onClick={finalizarAgendamento}
        >
          {loading ? "Salvando..." : "Confirmar Agendamento"}
        </button>
      </footer>
    </div>
  );
}
