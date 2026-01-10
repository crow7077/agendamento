import "./App.css";
import { User, Calendar, Clock } from "lucide-react";

export default function App() {
  return (
    <main className="app-container">
      <header>
        <h1 className="title">Agendamento Online</h1>
      </header>

      <section className="booking-card">
        <form>
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              <User size={20} /> Nome Completo
            </label>
            <input
              id="name"
              type="text"
              className="form-input"
              placeholder="Digite seu nome"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="date">
              <Calendar size={20} /> Selecione a Data
            </label>
            <input id="date" type="date" className="form-input" />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="time">
              <Clock size={20} /> Horário
            </label>
            <input id="time" type="time" className="form-input" />
          </div>

          <button type="submit" className="btn-submit">
            Confirmar Agendamento
          </button>
        </form>
      </section>
    </main>
  );
}
