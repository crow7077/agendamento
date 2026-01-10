import { useState } from "react";
import { Mail, Lock, LogIn, Loader2 } from "lucide-react";
import { auth, db } from "./firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 1. Função de Esquecer Senha (Agora definida corretamente)
  const handleForgotPassword = async () => {
    if (!email) {
      alert("Por favor, digite seu e-mail no campo acima primeiro.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("E-mail de redefinição enviado! Verifique sua caixa de entrada.");
    } catch (error: any) {
      console.error("Erro ao enviar e-mail:", error.code);
      alert("Erro ao enviar e-mail. Verifique se o endereço está correto.");
    }
  };

  // 2. Função de Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "usuarios", user.uid));

      if (userDoc.exists()) {
        const cargo = userDoc.data().cargo;
        if (cargo === "barbeiro" || user.email === "renatonj0489@gmail.com") {
          navigate("/dashboard");
        } else {
          navigate("/agendamento");
        }
      } else {
        if (user.email === "renatonj0489@gmail.com") {
          navigate("/dashboard");
        } else {
          navigate("/agendamento");
        }
      }
    } catch (error: any) {
      console.error("Erro ao logar:", error.code);
      alert("E-mail ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <header className="login-header">
          <h2>Bem-vindo de volta</h2>
          <p>Entre com seus dados para acessar</p>
        </header>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">
              <Mail size={18} /> E-mail
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock size={18} /> Senha
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <a
            href="#"
            className="forgot-password"
            onClick={(e) => {
              e.preventDefault();
              handleForgotPassword();
            }}
          >
            Esqueceu a senha?
          </a>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <LogIn size={20} /> Entrar
              </>
            )}
          </button>
        </form>

        <div className="footer-link">
          Não tem uma conta?{" "}
          <span className="link-blue" onClick={() => navigate("/cadastro")}>
            Cadastre-se agora
          </span>
        </div>
      </div>
    </div>
  );
}
