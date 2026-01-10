import { useState } from "react";
import { Mail, Lock, LogIn, Loader2 } from "lucide-react";
import { auth, db } from "./firebase"; // Mudou para ./ porque está na mesma pasta
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore"; // Importe o getDoc e doc do firestore
import "./Login.css"; // Mudou para ./ porque está na mesma pasta

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ... dentro do componente Login ...

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Faz o login básico
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 2. BUSCA O CARGO NO FIRESTORE
      // Vamos na coleção "usuarios" buscar o documento que tem o ID do usuário logado
      const userDoc = await getDoc(doc(db, "usuarios", user.uid));

      if (userDoc.exists()) {
        const dadosUsuario = userDoc.data();
        const cargo = dadosUsuario.cargo;

        console.log("Usuário logado como:", cargo);

        // 3. REDIRECIONAMENTO COM BASE NO CARGO
        if (cargo === "barbeiro") {
          navigate("/dashboard"); // Vai para a tela de dono/admin
        } else {
          navigate("/agendamento"); // Cliente vai direto para a tela de marcar horário
        }
      } else {
        // Caso o usuário exista no Auth mas não no Firestore (ex: sua conta antiga)
        alert("Perfil não encontrado no banco de dados.");
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Erro ao logar:", error.code);
      alert("Erro no login. Verifique e-mail e senha.");
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

          <a href="#" className="forgot-password">
            Esqueceu a senha?
          </a>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> Carregando...
              </>
            ) : (
              <>
                <LogIn size={20} /> Entrar
              </>
            )}
          </button>
        </form>
        {/* Adicione isso abaixo do botão de Entrar */}
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
