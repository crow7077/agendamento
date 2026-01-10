import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Essas informações você encontra no Console do Firebase:
// Configurações do Projeto > Geral > Seus Aplicativos > Configuração do SDK
const firebaseConfig = {
  apiKey: "AIzaSyDgIffmEp_L0gVqZ_6XZOHUaK6AJBlws2A",
  authDomain: "sistema-agendamentos-financas.firebaseapp.com",
  projectId: "sistema-agendamentos-financas",
  storageBucket: "sistema-agendamentos-financas.firebasestorage.app",
  messagingSenderId: "670167810660",
  appId: "1:670167810660:web:1fa6aa648ecd980cf89571",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços para usar nos outros arquivos
export const auth = getAuth(app);
export const db = getFirestore(app);
