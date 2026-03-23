"use client"; // Necessário pois usa estado do React

import { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { authDto, tokenDecoded, UserDto } from '@/types/user';
import apiClient from '@/lib/utils/axios';
import { useSnackbar } from '@/components/widgets/snackbar';



type AuthContextType = {
  isAuthenticated: boolean;
  user: UserDto | null;
  signIn: (data: any) => Promise<void>;
  signOut: () => void;
  getUser: (token?: string) => tokenDecoded | null;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null);
  const router = useRouter();
  const isAuthenticated = !!user;

  // Verifica se já tem cookie ao carregar a página
  /*useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      // Idealmente, você faz uma rota na API como api.get('/me') para pegar os dados do usuário com base no token
      // Para simplificar, estamos apenas simulando:
      apiClient.get('/me').then(response => {
        setUser(response.data);
      }).catch(() => {
        signOut(); // Se o token for inválido, desloga
      });
    }
  }, []);*/

  async function signIn({ email, senha }: authDto) {
    
      // Chama seu backend passando email e senha
      const response = await apiClient.post('/login', { email, senha });
      
      const { token, user } = response.data;

      // Salva o token no cookie (válido por 30 dias)
      Cookies.set('token', token, { expires: 30 });

      // Atualiza o estado global
      setUser(user);
      
      // Manda o usuário para o painel principal
      router.push('/busca');
    
  }

  function signOut() {
    Cookies.remove('token');
    setUser(null);
    router.push('/'); // Volta pro Login
  }

  function b64DecodeUnicode(str: string) {
  // Decodifica primeiro a parte Base64 para binário, isso converte a string Base64 em uma string de bytes

  try {
    return Buffer.from(str, "base64").toString("utf8");
  } catch (e) {
    console.error("Erro ao decodificar:", e);
    return "";
  }
}

function getUser(token?: string): tokenDecoded | null {
  // Obtém o token atual ou usa um valor padrão do cookie
  const currentToken = token || Cookies.get("token");
  // Se não houver token, retorna null
  if (!currentToken) return null;

  // Divide o token em suas partes (cabeçalho, payload, assinatura)
  const tokenParts = currentToken.split(".");

  // Verifica se o token possui três partes
  if (tokenParts.length !== 3) return null;

  // Obtém o payload do token
  const [, payload] = tokenParts;

  // Se não houver payload, retorna null
  if (!payload) return null;

  try {
    // Decodifica o payload em base64 e o analisa como JSON
    const decodedPayload = JSON.parse(b64DecodeUnicode(payload));

    // Obtém a data de expiração do payload
    const { exp } = decodedPayload;

    // Se não houver data de expiração, retorna null
    if (!exp) return null;

    // Obtém o tempo atual em segundos
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);

    // Calcula a validade do token com base na data de expiração
    const isValidToken = exp >= currentTimeInSeconds;

    // Retorna o payload com a propriedade isValidToken
    return { ...decodedPayload, isValidToken };
  } catch (error) {
    console.error("Erro ao verificar o token:", error);
    return null;
  }
};

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, signIn, signOut, getUser }}>
      {children}
    </AuthContext.Provider>
  );
}

