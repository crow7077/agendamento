import { useState } from "react";
import { db, auth } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Scissors, CheckCircle, LogOut } from "lucide-react";
import "./Login.css";

export default function Agendamento() {
  const [servico, setServico] = useState("Corte Masculino");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAgendar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "agendamentos"), {
        clienteId: auth.currentUser?.uid,
        nome: auth.currentUser?.email || "Cliente",
        servico: servico,
        data: data,
        hora: hora,
        valor: servico === "Corte Masculino" ? 50 : 80,
        status: "pendente",
        createdAt: new Date(),
      });

      alert("Agendamento realizado com sucesso!");
      setData("");
      setHora("");
    } catch (error) {
      console.error("Erro ao agendar:", error);
      alert("Erro ao marcar horário.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <header className="login-header">
          <h2>Marcar Horário</h2>
          <p>Escolha o melhor momento</p>
        </header>

        <form onSubmit={handleAgendar}>
          <div className="form-group">
            <label className="form-label">
              <Scissors size={18} /> Serviço
            </label>
            <select
              className="form-input"
              value={servico}
              onChange={(e) => setServico(e.target.value)}
            >
              <option value="Corte Masculino">
                Corte Masculino - R$ 50,00
              </option>
              <option value="Corte + Barba">Corte + Barba - R$ 80,00</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              <Calendar size={18} /> Data
            </label>
            <input
              type="date"
              className="form-input"
              value={data}
              onChange={(e) => setData(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Clock size={18} /> Horário
            </label>
            <input
              type="time"
              className="form-input"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Salvando..." : "Confirmar Agendamento"}
          </button>
        </form>

        <button
          onClick={handleLogout}
          className="link-blue"
          style={{
            marginTop: "20px",
            border: "none",
            background: "none",
            width: "100%",
          }}
        >
          <LogOut size={16} /> Sair
        </button>
      </div>
    </div>
  );
}