import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Base de estilo
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
    // Formata a data para exibir no alerta
    const dataFormatada = dataSelecionada.toLocaleDateString("pt-BR");
    alert(
      `Agendamento realizado!\nData: ${dataFormatada}\nHorário: ${horarioSelecionado}`,
    );

    // Volta automaticamente para o Dashboard
    navigate("/dashboard");
  };

  return (
    <div className="booking-container">
      <header className="booking-header">
        {/* Seta para voltar ao Dashboard */}
        <button onClick={() => navigate("/dashboard")} className="btn-back">
          <ChevronLeft />
        </button>
        <h1>Agendamento</h1>
      </header>

      <main className="booking-content">
        {/* Seção 1: Serviços */}
        <section className="booking-section">
          <h2 className="section-title">
            <Scissors size={20} /> Selecione o Serviço
          </h2>
          <div className="services-grid">
            {SERVICOS.map((servico) => (
              <div
                key={servico.id}
                className={`service-card ${servicoSelecionado === servico.id ? "active" : ""}`}
                onClick={() => setServicoSelecionado(servico.id)}
              >
                <div className="service-info">
                  <h3>{servico.nome}</h3>
                  <span>{servico.tempo}</span>
                </div>
                <span className="service-price">{servico.preco}</span>
                {servicoSelecionado === servico.id && (
                  <CheckCircle2 className="check-icon" size={20} />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Seção 2: Calendário Inline */}
        <section className="booking-section">
          <h2 className="section-title">
            <CalendarIcon size={20} /> Escolha a Data
          </h2>
          <div className="calendar-wrapper">
            <Calendar
              onChange={(val) => setDataSelecionada(val as Date)}
              value={dataSelecionada}
              minDate={new Date()} // Bloqueia dias passados
              locale="pt-BR"
            />
          </div>
        </section>

        {/* Seção 3: Horários */}
        <section className="booking-section">
          <h2 className="section-title">
            <Clock size={20} /> Horários Disponíveis
          </h2>
          <div className="hours-grid">
            {HORARIOS.map((hora) => (
              <button
                key={hora}
                className={`hour-item ${horarioSelecionado === hora ? "active" : ""}`}
                onClick={() => setHorarioSelecionado(hora)}
              >
                {hora}
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
          Confirmar Agendamento
        </button>
      </footer>
    </div>
  );
}
