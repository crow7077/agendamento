import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  Scissors,
  Clock,
  ChevronLeft,
  Calendar as CalendarIcon,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Agendamento.css";

const SERVICOS = [
  { id: 1, nome: "Corte Degradê", preco: "R$ 45,00", tempo: "45 min" },
  { id: 2, nome: "Barba Terapia", preco: "R$ 35,00", tempo: "30 min" },
  {
    id: 3,
    nome: "Combo (Corte + Barba)",
    preco: "R$ 70,00",
    tempo: "1h 15min",
  },
];

const HORARIOS = [
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

export default function Agendamento() {
  const [servicoSelecionado, setServicoSelecionado] = useState<number | null>(
    null,
  );
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(
    null,
  );
  const [dataSelecionada, setDataSelecionada] = useState<Date>(new Date());
  const navigate = useNavigate();

  const finalizarAgendamento = () => {
    alert(`Agendamento realizado para ${horarioSelecionado}!`);
    navigate("/dashboard");
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
        <h1>Agendamento</h1>
      </header>
      <main className="booking-content">
        <section className="booking-section">
          <h2 className="section-title">
            <Scissors size={20} /> Serviço
          </h2>
          <div className="services-grid">
            {SERVICOS.map((s) => (
              <div
                key={s.id}
                className={`service-card ${servicoSelecionado === s.id ? "active" : ""}`}
                onClick={() => setServicoSelecionado(s.id)}
              >
                <div className="service-info">
                  <h3>{s.nome}</h3>
                  <span>{s.tempo}</span>
                </div>
                <span className="service-price">{s.preco}</span>
                {servicoSelecionado === s.id && (
                  <CheckCircle2 className="check-icon" size={20} />
                )}
              </div>
            ))}
          </div>
        </section>
        <section className="booking-section">
          <h2 className="section-title">
            <CalendarIcon size={20} /> Data
          </h2>
          <div className="calendar-wrapper">
            <Calendar
              onChange={(val) => setDataSelecionada(val as Date)}
              value={dataSelecionada}
              minDate={new Date()}
              locale="pt-BR"
            />
          </div>
        </section>
        <section className="booking-section">
          <h2 className="section-title">
            <Clock size={20} /> Horário
          </h2>
          <div className="hours-grid">
            {HORARIOS.map((h) => (
              <button
                key={h}
                type="button"
                className={`hour-item ${horarioSelecionado === h ? "active" : ""}`}
                onClick={() => setHorarioSelecionado(h)}
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
          disabled={!servicoSelecionado || !horarioSelecionado}
          onClick={finalizarAgendamento}
        >
          Confirmar
        </button>
      </footer>
    </div>
  );
}
