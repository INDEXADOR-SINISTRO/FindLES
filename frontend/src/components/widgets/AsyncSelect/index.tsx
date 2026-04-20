import React, { useState, useEffect, useRef } from 'react';

// Tipagem do que esperamos que o banco retorne
export type Option = {
  value: string | number;
  label: string;
};

type AsyncSelectProps = {
  label: string;
  placeholder?: string;
  // Função que vai no backend buscar os dados
  fetchOptions: (busca: string) => Promise<Option[]>; 
  // Função que avisa o Pai quem foi selecionado
  onChange: (opcao: Option | null) => void; 
};

export default function AsyncSelect({ label, placeholder, fetchOptions, onChange }: AsyncSelectProps) {
  const [busca, setBusca] = useState('');
  const [opcoes, setOpcoes] = useState<Option[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [aberto, setAberto] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 1. Efeito do Debounce (Busca no banco)
  useEffect(() => {
    if (busca.length < 2) {
      setOpcoes([]); // Só busca se tiver 2 letras ou mais
      return;
    }

    setCarregando(true);

    // Espera 500ms depois que o usuário parou de digitar para ir no banco
    const delayDebounce = setTimeout(async () => {
      try {
        const resultados = await fetchOptions(busca);
        setOpcoes(resultados);
      } catch (error) {
        console.error("Erro ao buscar opções:", error);
      } finally {
        setCarregando(false);
      }
    }, 500);

    // Limpa o timer se o usuário voltar a digitar antes dos 500ms
    return () => clearTimeout(delayDebounce);
  }, [busca, fetchOptions]);

  // 2. Fecha o dropdown se clicar fora dele
  useEffect(() => {
    const handleClickFora = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAberto(false);
      }
    };
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  const selecionarOpcao = (opcao: Option) => {
    setBusca(opcao.label); // Coloca o nome no input
    setAberto(false);      // Fecha a lista
    onChange(opcao);       // Avisa o componente pai
  };

  return (
    <div className="relative w-full flex flex-col gap-1" ref={dropdownRef}>
      {label && <label className="text-[#7e7d77] text-xs font-medium">{label}</label>}
      
      {/* Campo de Texto que simula o Select */}
      <input
        type="text"
        value={busca}
        onChange={(e) => {
          setBusca(e.target.value);
          setAberto(true);
          onChange(null); // Limpa a seleção se ele apagar e começar a digitar de novo
        }}
        onClick={() => setAberto(true)}
        placeholder={placeholder || "Digite para buscar..."}
        className="w-full border border-gray-300 rounded p-2 text-sm text-gray-700 outline-none focus:border-blue-500 bg-white"
      />

      {/* A Lista Flutuante (Só aparece se estiver aberto e tiver digitado algo) */}
      {aberto && busca.length >= 2 && (
        <ul className="absolute z-50 top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-y-auto">
          
          {carregando ? (
            <li className="p-3 text-sm text-gray-500 text-center">Buscando...</li>
          ) : opcoes.length > 0 ? (
            opcoes.map((opcao, index) => (
              <li
                key={index}
                onClick={() => selecionarOpcao(opcao)}
                className="p-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 border-b last:border-0"
              >
                {opcao.label}
              </li>
            ))
          ) : (
            <li className="p-3 text-sm text-gray-500 text-center">Nenhum resultado encontrado.</li>
          )}
          
        </ul>
      )}
    </div>
  );
}