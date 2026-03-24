import { ArrowUpIcon, DocumentIcon, DocumentTextIcon } from '@heroicons/react/24/solid';
import React, { useState, useRef, MouseEventHandler } from 'react';
import Button from '../widgets/Button';
import { useSnackbar } from '../widgets/snackbar';
import apiClient from '@/lib/utils/axios';
import { documentoService } from '@/lib/services/documento';
import { TrashIcon } from '@heroicons/react/24/outline';


type AreaUploadProps = {
  idCategoria?: number | null;
};

export default function AreaDeUpload({idCategoria}: AreaUploadProps) {
  const [arquivos, setArquivos] = useState<File[]>([]);
  // NOVO: Estado para controlar a cor da caixa quando o arquivo estiver "sobreando" ela
  const [arrastando, setArrastando] = useState(false); 
  
  const inputArquivoRef = useRef<HTMLInputElement>(null);

  const {showMessage} = useSnackbar();


  const onSubmit = async()=>{
  
  const idCategoriaSelecionada = idCategoria; 

  // 1. Cria o pacote FormData
  const formData = new FormData();

  // 2. Coloca os arquivos dentro do pacote
  // O nome 'arquivos' DEVE ser exatamente o mesmo nome do parâmetro no seu Controller Java
  arquivos.forEach((arquivo) => {
    formData.append('arquivos', arquivo);
  });

  // 3. Coloca os outros dados que o backend pede
  // O FormData só aceita strings ou Blobs, então convertemos o número para string
  formData.append('idCategoria', String(idCategoriaSelecionada));


  try {

    // 4. Faz o POST para o seu backend
    // O Axios é inteligente: ao ver um FormData, ele já muda o Content-Type para 'multipart/form-data'
    await documentoService.upload(arquivos, idCategoria);

    showMessage({ message: "Arquivos enviados com sucesso!", type: "success" });
    
    // Limpa a tela após o sucesso
    setArquivos([]); 

  } catch (error) {
    
    showMessage({ message: "Falha ao enviar os documentos.", type: "error" });
  } 
}

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
                    <button onClick={() => removerArquivo(index)} className="text-red-500 cursor-pointer hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition" title="Remover arquivo">
                       
                        <TrashIcon className="w-5 h-5"></TrashIcon>
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
            onClick={onSubmit}
            className="text-white"
            />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}