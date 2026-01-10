import { useState } from "react";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Scissors,
  UserCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import "./Login.css";

export default function Cadastro() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("cliente");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Cria o acesso no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Salva os detalhes no Firestore (Banco de Dados)
      await setDoc(doc(db, "usuarios", user.uid), {
        nome: nome,
        email: email,
        cargo: cargo,
        uid: user.uid,
      });

      alert("Conta criada com sucesso!");
      navigate("/"); // Volta para o login
    } catch (error: any) {
      alert("Erro ao cadastrar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <button
          onClick={() => navigate("/")}
          className="link-blue"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            marginBottom: "15px",
            border: "none",
            background: "none",
          }}
        >
          <ArrowLeft size={16} /> Voltar para o login
        </button>

        <header className="login-header">
          <h2>Crie sua conta</h2>
          <p>Preencha os dados abaixo</p>
        </header>

        <form onSubmit={handleCadastro}>
          <div className="form-group">
            <label className="form-label">
              <User size={18} /> Nome Completo
            </label>
            <input
              className="form-input"
              type="text"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Mail size={18} /> E-mail
            </label>
            <input
              className="form-input"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock size={18} /> Senha
            </label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Você é:</label>
            <div className="role-selection">
              <button
                type="button"
                className={`role-button ${cargo === "cliente" ? "active" : ""}`}
                onClick={() => setCargo("cliente")}
              >
                <UserCircle size={24} />
                <span>Cliente</span>
              </button>
              <button
                type="button"
                className={`role-button ${
                  cargo === "barbeiro" ? "active" : ""
                }`}
                onClick={() => setCargo("barbeiro")}
              >
                <Scissors size={24} />
                <span>Barbeiro</span>
              </button>
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Finalizar Cadastro"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
