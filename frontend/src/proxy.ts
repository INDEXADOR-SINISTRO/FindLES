import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Pega o token dos cookies nativos do Next.js
  const token = request.cookies.get('token')?.value;
  // A rota que o usuário está tentando acessar
  const pathname = request.nextUrl.pathname;

  // Se tentar acessar o /dashboard SEM token, manda de volta pro / (login)
  if (!token && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Se tentar acessar o Login (/) COM token válido, manda pro /dashboard
  if (token && (pathname === '/' || pathname === '/login' || pathname === '/recuperar-senha' || pathname === "/cadastrar")) {
    return NextResponse.redirect(new URL('/admin/indexacao', request.url));
  }

  return NextResponse.next();
}

// Define em quais rotas o middleware deve agir
export const config = {
  matcher: ['/','/login','/cadastrar', '/recuperar-senha', '/admin/:path*'],
};