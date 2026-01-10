import { useState } from "react";
import { Mail, Lock, LogIn, Loader2 } from "lucide-react";
import { auth, db } from "./firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import logoImg from "../assets/img/logobarber.png";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Por favor, digite seu e-mail primeiro.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("E-mail de recuperação enviado!");
    } catch (error) {
      alert("Erro ao enviar e-mail. Verifique o endereço digitado.");
    }
  };

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
      const cargo = userDoc.exists() ? userDoc.data().cargo : "cliente";

      if (cargo === "barbeiro" || user.email === "renatonj0489@gmail.com") {
        navigate("/dashboard");
      } else {
        navigate("/agendamento");
      }
    } catch (error) {
      alert("E-mail ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <header className="login-header">
          <img src={logoImg} alt="Logo Barber Shop" className="login-logo" />
          <p>Acesse sua conta</p>
        </header>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                Login <LogIn size={18} />
              </>
            )}
          </button>

          <div className="forgot-wrapper">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="forgot-link"
            >
              Esqueceu sua senha?
            </button>
          </div>
        </form>

        <footer className="login-footer">
          <span>Não possui conta?</span>
          <button onClick={() => navigate("/cadastro")} className="signup-link">
            Faça seu Cadastro
          </button>
        </footer>
      </div>
    </div>
  );
}
