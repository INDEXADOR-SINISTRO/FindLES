
// app/not-found.js
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='bg-[#EBE9E1] min-w-screen min-h-screen flex flex-col justify-center items-center'>
      <h1 >404 - Página Não Encontrada</h1>
      <p >Desculpe, a página que você procura não existe.</p>
      <Link href="/">
        Voltar para a Home
      </Link>
    </div>
  )
}
