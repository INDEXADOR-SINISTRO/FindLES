type BarraRelevanciaProps = {
  porcentagem: string; // Ex: 45, 80, 100
  mostrarTexto?: boolean; // Opcional: para mostrar o número "45%" do lado
};

export default function BarraRelevancia({ porcentagem, mostrarTexto = false }: BarraRelevanciaProps) {
  // Trava de segurança para garantir que o preenchimento nunca passe de 100% ou seja menor que 0%
  const valorSeguro = Math.min(100, Math.max(0, Number(porcentagem)));

  // Opcional: Lógica para mudar de cor dependendo da relevância (Vermelho -> Amarelo -> Verde)
  // Se quiser uma cor fixa, basta ignorar isso e colocar a cor direto no className da div interna.
  const corDaBarra = 
    valorSeguro > 15 ? 'bg-green-500' : 
    valorSeguro > 5 ? 'bg-yellow-500' : 
    'bg-red-500';

  return (
    <div className="flex items-center gap-3 w-full">
      {/* Container Pai (A trilha de fundo) */}
      <div className="w-full bg-[#ffffff] rounded-full h-2.5 overflow-hidden">
        
        {/* Container Filho (O preenchimento dinâmico) */}
        <div
          className={`${corDaBarra} h-2.5 rounded-full transition-all duration-500 ease-out`}
          // A MÁGICA ACONTECE AQUI: O width usa estilo inline (o Tailwind não suporta classes dinâmicas arbitrárias de forma fácil)
          style={{ width: `${valorSeguro}%` }}
        ></div>
        
      </div>

      {/* Texto da porcentagem opcional */}
      {mostrarTexto && (
        <span className="text-xs font-medium text-[#7e7d77] w-8">
          {valorSeguro}%
        </span>
      )}
    </div>
  );
}