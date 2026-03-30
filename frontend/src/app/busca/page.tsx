'use client'

import Button from "@/components/widgets/Button"
import Input from "@/components/widgets/input"
import Select, { OptionType } from "@/components/widgets/select"
import { useSnackbar } from "@/components/widgets/snackbar"
import { CategoriaList } from "@/types/documento"
import { FunnelIcon } from "@heroicons/react/24/solid"
import { useState } from "react"


 
 
 
 
 
 const Busca = ()=>{
  // Estados da Paginação
      const [paginaAtual, setPaginaAtual] = useState(1);
      const [size, setSize] = useState<number>(5); // Quantos itens mostrar por vez
      const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false)
      const [titulo, setTitulo] = useState<string>("")
  
      const [totalPaginas, setTotalPaginas] = useState(0)
      const { showMessage } = useSnackbar();
      const [nadaEncontrado, setNadaEncontrado] = useState<boolean>(false)
  
      const [expandido, setExpandido] = useState(false);
  
      // Estados dos formulários (para você ligar com sua requisição depois)
      const [categoria, setCategoria] = useState<string>("");
      const optionsCategoria: OptionType[] = CategoriaList.map(
          (item) => ({
              value: String(item.value),
              optionLabel: item.descricao
          })
      );
      const optionsMaxResultados: OptionType[] = [
          {
              value: "5",
              optionLabel: "5"
          },
          {
              value: "10",
              optionLabel: "10"
          },
          {
              value: "20",
              optionLabel: "20"
          },
          {
              value: "50",
              optionLabel: "50"
          },
          {
              value: "100",
              optionLabel: "100"
          },
  
      ]
      
      const [dataDe, setDataDe] = useState("");
      const [dataAte, setDataAte] = useState("");
  
      const handleAplicar = () => {
          setPaginaAtual(1)
      };
  
      const handleLimpar = () => {
          setCategoria("");
          setDataDe("");
          setDataAte("");
          setSize(5);
      };
  
  
  return (
    <>
      <div className='mb-10 flex items-end w-full'>
            <Input
                id='titulo'
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                type='text'
                label='Buscar por Título'
                className='w-full'
            />
            <Button
                onClick={() => {  }}
                className='bg-[#3f3f3f] text-white '
                text='Buscar'
            />
        </div>
        {/* Container principal com a cor de fundo bege*/}
        

        
        <div className={`border border-[#c5c3b9] bg-[#EAE8E1] p-3 w-full mb-10 shadow-md`}>

            {/* Cabeçalho do Filtro (Clicável) */}
            <button
                onClick={() => setExpandido(!expandido)}
                className="flex items-center gap-2 text-[#6b6a65] hover:text-gray-800 transition-colors font-medium outline-none"
            >
                <svg
                    className={`w-3 h-3 transition-transform duration-300 ${expandido ? 'rotate-90' : ''}`}
                    fill="currentColor"
                    viewBox="0 0 16 16"
                >
                    <path d="m4.86 12.33 5.48-4.33-5.48-4.33a.62.62 0 0 0-1 .5v8.66a.62.62 0 0 0 1 .5z" />
                </svg>
                <FunnelIcon className='w-5 h-5'></FunnelIcon>
                <span className="text-sm">Filtros</span>
                
            </button>

            {/* A MÁGICA DA TRANSIÇÃO AQUI */}
            <div
                className={`grid transition-all duration-300 ease-in-out ${expandido
                    ? 'grid-rows-[1fr] opacity-100 mt-4'
                    : 'grid-rows-[0fr] opacity-0 mt-0'
                    }`}
            >
                {/* Este overflow-hidden impede que o conteúdo vaze enquanto a div encolhe */}
                <div className="overflow-hidden">

                    {/* Grid com os 4 campos organizados horizontalmente */}
                    <div className="flex flex-wrap gap-2">

                        <div className="flex flex-col gap-1 w-60">
                            <Select
                                id="categoria"
                                onChange={(e) => setCategoria(e.target.value)}
                                options={optionsCategoria}
                                label="Categoria"
                                className="text-[#7e7d77] text-xs "
                                value={categoria}
                            />
                        </div>

                        <div className="flex flex-col gap-1 w-58">
                            
                            <Input
                            id="dataDe"
                            onChange={(e) => setDataDe(e.target.value)}
                            type="date"
                            label="Data - DE"
                            value={dataDe}
                            className='text-[#7e7d77] text-xs  '
                            />
                        </div>

                        <div className="flex flex-col gap-1 w-58">
                            
                            <Input
                            id="dataAte"
                            onChange={(e) => setDataAte(e.target.value)}
                            type="date"
                            label="Data - ATÉ"
                            value={dataAte}
                            className='text-[#7e7d77] text-xs  '
                            />
                        </div>

                        <div className="flex flex-col gap-1 w-58">
                            
                            <Select
                                id="maxResultados"
                                onChange={(e) => setSize(Number(e.target.value))}
                                options={optionsMaxResultados}
                                label="Máx Resultados"
                                className="text-[#7e7d77] text-xs "
                                value={String(size)}
                                hasDefaultValue={false}
                            />
                        </div>

                    </div>

                    {/* Botões de Ação */}
                    <div className="flex items-center gap-3 mt-6 pb-1">
                        
                        <Button
                        onClick={handleAplicar}
                            text='Aplicar filtros'
                            className='text-white font-medium text-sm '
                        />
                        
                        <Button
                        onClick={handleLimpar}
                            text='Limpar'
                            className='bg-neutral-100  hover:bg-neutral-200 text-[#404040] border border-[#3F3E3E] text-sm '
                        />
                    </div>

                </div>
            </div>
           </div> 

    </>
  )
 }

 export default Busca