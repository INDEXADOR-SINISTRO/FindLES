"use client"; // Necessário pois usa estado do React

import { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { authDto, tokenDecoded, UserDto } from '@/types/user';
import apiClient from '@/lib/utils/axios';
import { useSnackbar } from '@/components/widgets/snackbar';
import { decodificarToken } from '@/proxy';



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
      if(Cookies.get('token')){
        Cookies.remove('token');
      }
    
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


function getUser(token?: string): tokenDecoded | null {
  // Obtém o token atual ou usa um valor padrão do cookie
  const currentToken = token || Cookies.get("token");

  return decodificarToken(currentToken);
};

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, signIn, signOut, getUser }}>
      {children}
    </AuthContext.Provider>
  );
}

