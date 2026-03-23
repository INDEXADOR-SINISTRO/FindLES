import { ArrowUpIcon, DocumentIcon, DocumentTextIcon } from '@heroicons/react/24/solid';
import React, { useState, useRef, MouseEventHandler } from 'react';
import Button from '../widgets/Button';


type AreaUploadProps = {
  onClick: MouseEventHandler | undefined;
};

export default function AreaDeUpload({onClick}: AreaUploadProps) {
  const [arquivos, setArquivos] = useState<File[]>([]);
  // NOVO: Estado para controlar a cor da caixa quando o arquivo estiver "sobreando" ela
  const [arrastando, setArrastando] = useState(false); 
  
  const inputArquivoRef = useRef<HTMLInputElement>(null);

  // Função do input invisível (Mantida)
  const lidarComSelecao = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const novosArquivos = Array.from(event.target.files);
      setArquivos((prev) => [...prev, ...novosArquivos]);
    }
  };

  // NOVAS FUNÇÕES DE DRAG AND DROP ====================

  const lidarComDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Impede o navegador de abrir o arquivo
    setArrastando(true); // Muda a cor da borda
  };

  const lidarComDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setArrastando(false); // Volta a borda ao normal se o usuário tirar o mouse de cima
  };

  const lidarComDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Impede o navegador de abrir o arquivo
    setArrastando(false); // Volta a cor ao normal
    
    // Pega os arquivos que foram soltos e coloca no nosso array
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const arquivosSoltos = Array.from(e.dataTransfer.files);
      setArquivos((prev) => [...prev, ...arquivosSoltos]);
      e.dataTransfer.clearData(); // Limpa a memória do navegador
    }
  };

  // ====================================================

  const removerArquivo = (indexParaRemover: number) => {
    setArquivos(arquivos.filter((_, index) => index !== indexParaRemover));
  };

  return (
    <div className="w-full mx-auto">
      <input
        type="file"
        multiple
        ref={inputArquivoRef}
        onChange={lidarComSelecao}
        className="hidden"
        accept=".pdf"
      />

      {arquivos.length === 0 ? (
        /* ÁREA DE UPLOAD VAZIA */
        <div 
          onClick={() => inputArquivoRef.current?.click()} 
          onDragOver={lidarComDragOver}
          onDragLeave={lidarComDragLeave}
          onDrop={lidarComDrop}
          className={`border-2 border-dashed p-12 text-center bg-[#EBE9E1] cursor-pointer transition-colors duration-200 ${
            arrastando ? 'border-blue-500 bg-blue-50' : 'border-gray-400 hover:bg-[#dfddd4]'
          }`}
        >
          {/* ... Icone e Textos ... */}
          <ArrowUpIcon className='w-12 h-12 mx-auto'></ArrowUpIcon>
          <p className="text-gray-600 font-medium">
            Arraste arquivos aqui ou clique para selecionar
          </p>
          <p className="text-sm text-gray-400 mt-1">PDF (multiplos arquivos permitidos)</p>
        </div>

      ) : (
        /* LISTA DE ARQUIVOS - AGORA COM SUPORTE A DRAG & DROP E SCROLL */
        <div 
          onDragOver={lidarComDragOver}
          onDragLeave={lidarComDragLeave}
          onDrop={lidarComDrop}
          
          className={`border rounded-lg p-4 shadow-sm transition-colors duration-200 ${
            arrastando ? 'bg-blue-50 border-blue-400 border-2 border-dashed' : 'bg-[#EBE9E1]'
          }`}
        >
          
          <h3 className="font-semibold text-gray-700 mb-4 border-b pb-2">
            Arquivos Prontos para Envio ({arquivos.length})
            {arrastando && <span className="ml-2 text-blue-500 text-sm font-normal">Solte para adicionar...</span>}
          </h3>
          
          <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
             {arquivos.map((arquivo, index) => (
                <li key={index} className="flex items-center justify-between bg-neutral-100 p-3 rounded border">

                    <div className="flex items-center space-x-3 overflow-hidden">
                        <DocumentTextIcon className='w-8 h-8 '></DocumentTextIcon>
                        <div className="truncate">
                            <p className="text-sm font-medium text-gray-700 truncate">{arquivo.name}</p>
                            <p className="text-xs text-gray-500">{(arquivo.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    </div>
                    <button onClick={() => removerArquivo(index)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition" title="Remover arquivo">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </li>
             ))}
          </ul>

          <div className="mt-6 flex justify-between">
            <button 
              onClick={() => inputArquivoRef.current?.click()}
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              + Adicionar mais arquivos
            </button>
            <div className='flex gap-2'>

            <Button
            text='Limpar'
            onClick={()=>{setArquivos([])}}
            className="bg-neutral-100  hover:bg-neutral-200 text-[#404040] border-2 border-[#3F3E3E]"
            />
            <Button
            text='Indexar'
            onClick={onClick}
            className="text-white"
            />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}