import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, User, Store } from "lucide-react";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "./Cadastro.css"; // Note o 'C' maiúsculo conforme sua pasta

export default function CadastroUsuario() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [perfil, setPerfil] = useState<"cliente" | "dono">("cliente");

  const [formData, setFormData] = useState({
    nome: "",
    barbearia: "",
    telefone: "",
    email: "",
    senha: "",
    confirmar: "",
  });

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.senha.length < 6) return alert("Mínimo 6 caracteres.");
    if (formData.senha !== formData.confirmar)
      return alert("Senhas não coincidem.");

    setLoading(true);
    try {
      // 1. Cria no Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.senha,
      );
      const user = userCredential.user;

      // 2. Salva na coleção 'usuarios' que você já tem
      await setDoc(doc(db, "usuarios", user.uid), {
        uid: user.uid,
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        cargo: perfil,
        // Salva barbearia apenas se for dono, senão salva null
        barbearia: perfil === "dono" ? formData.barbearia : null,
        dataCriacao: new Date(),
      });

      alert("Conta criada com sucesso!");
      navigate("/");
    } catch (error: any) {
      alert("Erro: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-page">
      <div className="cadastro-card">
        <header className="cadastro-header">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="btn-back-top"
          >
            <ArrowLeft size={30} color="#E5B817" />
          </button>
          <h1>Criar conta</h1>
          <p>Selecione o tipo de conta</p>
        </header>

        <div className="perfil-selector">
          <button
            type="button"
            className={`selector-btn ${perfil === "cliente" ? "active" : ""}`}
            onClick={() => setPerfil("cliente")}
          >
            <User size={18} /> Cliente
          </button>
          <button
            type="button"
            className={`selector-btn ${perfil === "dono" ? "active" : ""}`}
            onClick={() => setPerfil("dono")}
          >
            <Store size={18} /> Dono
          </button>
        </div>

        <form onSubmit={handleCadastro}>
          <div className="input-group-line">
            <label>Nome do responsável</label>
            <input
              type="text"
              placeholder="Nome completo"
              required
              onChange={(e) =>
                setFormData({ ...formData, nome: e.target.value })
              }
            />
          </div>

          {perfil === "dono" && (
            <div className="input-group-line animate-fade-in">
              <label>Nome da sua barbearia</label>
              <input
                type="text"
                placeholder="Nome do estabelecimento"
                required
                onChange={(e) =>
                  setFormData({ ...formData, barbearia: e.target.value })
                }
              />
            </div>
          )}

          <div className="input-group-line">
            <label>Telefone (celular)</label>
            <input
              type="tel"
              placeholder="(XX) XXXXX-XXXX"
              required
              onChange={(e) =>
                setFormData({ ...formData, telefone: e.target.value })
              }
            />
          </div>

          <div className="input-group-line">
            <label>E-mail</label>
            <input
              type="email"
              placeholder="seuemail@exemplo.com"
              required
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="input-group-line">
            <label>Senha</label>
            <div className="pass-container">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Senha"
                required
                onChange={(e) =>
                  setFormData({ ...formData, senha: e.target.value })
                }
              />
              <button type="button" onClick={() => setShowPass(!showPass)}>
                {showPass ? (
                  <EyeOff size={22} color="#E5B817" />
                ) : (
                  <Eye size={22} color="#E5B817" />
                )}
              </button>
            </div>
          </div>

          <div className="input-group-line">
            <label>Confirme sua senha</label>
            <input
              type="password"
              placeholder="Repita a senha"
              required
              onChange={(e) =>
                setFormData({ ...formData, confirmar: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="btn-cadastro-submit"
            disabled={loading}
          >
            {loading ? "Processando..." : "Criar conta"}
          </button>
        </form>
      </div>
    </div>
  );
}
