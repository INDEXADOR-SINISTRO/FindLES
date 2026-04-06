import { ArrowUpIcon, DocumentIcon, DocumentTextIcon } from '@heroicons/react/24/solid';
import React, { useState, useRef, useEffect } from 'react';
import Button from '../widgets/Button';
import { useSnackbar } from '../widgets/snackbar';
import apiClient from '@/lib/utils/axios';
import { documentoService } from '@/lib/services/documento';
import { TrashIcon } from '@heroicons/react/24/outline';

type AreaUploadProps = {
  idCategoria?: number | null;
  multiple?: boolean;
  onFilesChange?: (arquivos: File[]) => void; 
};

export default function AreaDeUpload({ idCategoria, multiple = true, onFilesChange }: AreaUploadProps) {
  const [arquivos, setArquivos] = useState<File[]>([]);
  const [arrastando, setArrastando] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputArquivoRef = useRef<HTMLInputElement>(null);
  const { showMessage } = useSnackbar();

  useEffect(() => {
    if (onFilesChange) {
      onFilesChange(arquivos);
    }
  }, [arquivos, onFilesChange]);

  const onSubmit = async () => {
    

    try {
      setIsLoading(true);
      await documentoService.upload(arquivos, idCategoria);
      showMessage({ message: "Arquivos enviados com sucesso!", type: "success" });
      setArquivos([]);
    } catch (error) {
      const erro = error as Error;
      showMessage({ message: erro.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  }

  const lidarComSelecao = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const novosArquivos = Array.from(event.target.files);
      
      if (multiple) {
        setArquivos((prev) => [...prev, ...novosArquivos]);
      } else {
        // Se for só 1, pega apenas o primeiro arquivo selecionado e substitui o array
        setArquivos([novosArquivos[0]]);
      }
    }
  };

  const lidarComDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); 
    setArrastando(true); 
  };

  const lidarComDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setArrastando(false); 
  };

  const lidarComDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); 
    setArrastando(false); 

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const arquivosSoltos = Array.from(e.dataTransfer.files);
      

      if (multiple) {
        setArquivos((prev) => [...prev, ...arquivosSoltos]);
      } else {
        setArquivos([arquivosSoltos[0]]);
      }
      
      e.dataTransfer.clearData(); 
    }
  };

  const removerArquivo = (indexParaRemover: number) => {
    setArquivos(arquivos.filter((_, index) => index !== indexParaRemover));
  };

  return (
    <div className="w-full mx-auto">
      <input
        type="file"
        multiple={multiple} 
        ref={inputArquivoRef}
        onChange={lidarComSelecao}
        className="hidden"
        accept=".pdf"
      />

      {arquivos.length === 0 ? (
        <div
          onClick={() => inputArquivoRef.current?.click()}
          onDragOver={lidarComDragOver}
          onDragLeave={lidarComDragLeave}
          onDrop={lidarComDrop}
          className={`border-2 border-dashed p-12 text-center bg-[#EBE9E1] cursor-pointer transition-colors duration-200 ${arrastando ? 'border-blue-500 bg-blue-50' : 'border-gray-400 hover:bg-[#dfddd4]'}`}
        >
          <ArrowUpIcon className='w-12 h-12 mx-auto'></ArrowUpIcon>
          <p className="text-gray-600 font-medium">
            Arraste {multiple ? 'arquivos' : 'o arquivo'} aqui ou clique para selecionar
          </p>

          <p className="text-sm text-gray-400 mt-1">
            PDF ({multiple ? 'múltiplos arquivos permitidos' : 'apenas 1 arquivo permitido'})
          </p>
        </div>

      ) : (
        <div
          onDragOver={lidarComDragOver}
          onDragLeave={lidarComDragLeave}
          onDrop={lidarComDrop}
          className={`border  p-4 shadow-sm transition-colors duration-200 ${arrastando ? 'bg-blue-50 border-blue-400 border-2 border-dashed' : 'bg-[#EBE9E1]'}`}
        >
          <h3 className="font-semibold text-gray-700 mb-4 border-b pb-2">
            {multiple ? `Arquivos Prontos para Envio (${arquivos.length})` : 'Arquivo Pronto para Envio'}
            {arrastando && <span className="ml-2 text-blue-500 text-sm font-normal">Solte para {multiple ? 'adicionar' : 'substituir'}...</span>}
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
              {multiple ? '+ Adicionar mais arquivos' : 'Substituir arquivo'}
            </button>
            
            <div className={multiple === false ? "hidden" :'flex gap-2'}>
              <Button
                text='Limpar'
                onClick={() => { setArquivos([]) }}
                className="bg-neutral-100  hover:bg-neutral-200 text-[#404040] border-2 border-[#3F3E3E]"
              />
              <Button
                text='Salvar'
                onClick={onSubmit}
                className="text-white"
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}