// Definimos o que o botão pode receber (TypeScript)
interface BotaoProps {
  texto: string;
  onClick?: () => void;
  tipo?: "button" | "submit"; // Importante para o formulário
  variante?: "primario" | "secundario";
}

export function BotaoAgendamento({
  texto,
  onClick,
  tipo = "button",
  variante = "primario",
}: BotaoProps) {
  // Escolhe a classe CSS baseada na variante
  const classeCss = variante === "primario" ? "btn-submit" : "btn-secundario";

  return (
    <button type={tipo} onClick={onClick} className={classeCss}>
      {texto}
    </button>
  );
}
