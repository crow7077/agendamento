import { useState } from "react";
import { LogIn, Loader2 } from "lucide-react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
// Subindo dois níveis (../../) para sair de 'pages' e chegar em 'assets'
import logoimg from "../assets/img/logobarber.png";
import backgroundbarber from "../assets/img/barbearia1.png";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      alert("E-mail ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-container"
      style={{ backgroundImage: `url(${backgroundbarber})` }}
    >
      <div className="login-card">
        <header className="login-header">
          <img src={logoimg} alt="Logo" className="login-logo" />
          <p>Acesse sua conta</p>
        </header>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                Entrar <LogIn size={18} />
              </>
            )}
          </button>
        </form>
        <footer className="login-footer">
          <button onClick={() => navigate("/cadastro")} className="signup-link">
            Cadastre-se
          </button>
        </footer>
      </div>
    </div>
  );
}
