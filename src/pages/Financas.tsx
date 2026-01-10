import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { ArrowLeft, TrendingUp, Wallet } from "lucide-react"; // Removi o DollarSign daqui
import { useNavigate } from "react-router-dom";

export default function Financas() {
  const [movimentacoes, setMovimentacoes] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarFinancas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "financas"));
        const dados = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as any), // O "as any" resolve o erro de propriedade inexistente
        }));
        setMovimentacoes(dados);

        const soma = dados.reduce(
          (acc: number, curr: any) => acc + (Number(curr.valor) || 0),
          0
        );
        setTotal(soma);
      } catch (error) {
        console.error("Erro ao buscar finanças:", error);
      }
    };

    carregarFinancas();
  }, []);

  return (
    <div
      className="login-container"
      style={{ display: "block", padding: "20px" }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => navigate("/dashboard")}
          className="btn-submit"
          style={{ width: "40px", padding: "10px" }}
        >
          <ArrowLeft size={20} />
        </button>
        <h2 style={{ color: "white", margin: 0 }}>Financeiro</h2>
      </header>

      <div
        className="login-card"
        style={{
          marginBottom: "20px",
          background: "linear-gradient(135deg, #fff 0%, #f0fdf4 100%)",
        }}
      >
        <div className="form-label" style={{ color: "#10b981" }}>
          <Wallet size={20} /> Saldo Total
        </div>
        <h1 style={{ fontSize: "2.5rem", margin: "10px 0", color: "#065f46" }}>
          R$ {total.toFixed(2).replace(".", ",")}
        </h1>
      </div>

      <div className="login-card">
        <div className="form-label">
          <TrendingUp size={20} color="#6366f1" /> Histórico de Ganhos
        </div>

        {movimentacoes.length > 0 ? (
          movimentacoes.map((item) => (
            <div
              key={item.id}
              style={{
                padding: "15px 0",
                borderBottom: "1px solid #eee",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong style={{ display: "block" }}>
                  {item.descricao || "Serviço"}
                </strong>
                <span style={{ fontSize: "0.8rem", color: "#666" }}>
                  {item.data || "Hoje"}
                </span>
              </div>
              <span style={{ color: "#10b981", fontWeight: "bold" }}>
                + R$ {Number(item.valor).toFixed(2)}
              </span>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "#999", padding: "20px" }}>
            Nenhuma movimentação encontrada.
          </p>
        )}
      </div>
    </div>
  );
}
