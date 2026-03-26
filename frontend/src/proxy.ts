import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { tokenDecoded } from './types/user';


export function b64DecodeUnicode(str: string) {
  // Decodifica primeiro a parte Base64 para binário, isso converte a string Base64 em uma string de bytes

  try {
    return Buffer.from(str, "base64").toString("utf8");
  } catch (e) {
    console.error("Erro ao decodificar:", e);
    return "";
  }
}

export function decodificarToken(token: string | undefined): tokenDecoded | null{

  if (!token) return null;
  
  const tokenParts = token.split(".");

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
}

export function proxy(request: NextRequest) {

  // Pega o token dos cookies nativos do Next.js
  const token = request.cookies.get('token')?.value;
  // A rota que o usuário está tentando acessar
  const pathname = request.nextUrl.pathname;

  const tokenDecodificado = decodificarToken(token)
  console.log("debug")
  console.log(tokenDecodificado)

  // Se tentar acessar o /dashboard SEM token, manda de volta pro / (login)
  if (!token || (!tokenDecodificado || !tokenDecodificado.isValidToken) && !(pathname.startsWith('/login') || pathname.startsWith("/cadastrar") || pathname.startsWith("/recuperar-senha") )) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (token && tokenDecodificado && tokenDecodificado.isValidToken){
      if ((pathname === '/' || pathname === '/login' || pathname === '/recuperar-senha' || pathname === "/cadastrar")) {
        return NextResponse.redirect(new URL('/busca', request.url));
      }

      if (
        tokenDecodificado.role === "ROLE_USER" &&
        pathname.startsWith("/admin")
      ) {
        return NextResponse.redirect(new URL('/busca', request.url));
      }
      
  }
  



  

  

  

  

  return NextResponse.next();
}



// Define em quais rotas o middleware deve agir
export const config = {
  matcher: ['/','/login','/cadastrar', '/recuperar-senha', '/admin/:path*', '/busca/:path*'],
};