"use client";

import Button from "@/components/widgets/Button";
import Select, { OptionType } from "@/components/widgets/select";
import { useSnackbar } from "@/components/widgets/snackbar";
import { auditoriaService } from "@/lib/services/auditoria";
import { formatarDataHora } from "@/lib/utils/date";
import { AuditoriaDto } from "@/types/auditoria";
import { ChevronLeftIcon, ChevronRightIcon, HandThumbDownIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";



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


const Auditoria = () => {
  const nada = true;

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [size, setSize] = useState<number>(5);

  const [maxResultados, setMaxResultados] = useState<number>(5)

  const [totalPaginas, setTotalPaginas] = useState(0)

  const { showMessage } = useSnackbar();

  const [auditorias, setAuditorias] = useState<AuditoriaDto[]>([])


  const [nadaEncontrado, setNadaEncontrado] = useState<boolean>(false)

  const buscarAuditorias = async (paginaAtual: number,size: number) => {
    try {
      setNadaEncontrado(false)
      setPaginaAtual(1)
      setMaxResultados(size)
      const response = await auditoriaService.getAll(
        paginaAtual - 1,
        {
          size: size,
          sort: 'data,desc'
        }
      );
      if (response.content.length === 0) {
        setNadaEncontrado(true)
      }

      setAuditorias(response.content)
      setTotalPaginas(response.page.totalPages)

    } catch (error) {
      console.error("Erro ao buscar:", error);
      showMessage({ message: "Erro ao listar auditoria", type: "error" })
    }
  };

  useEffect(() => {

    buscarAuditorias(1,size)
    setPaginaAtual(1)
  }, [size])

  return (

    <>

      <div className="text-[#3f3f3f] ">

        <h1 className="text-3xl mb-2">Auditoria</h1>
        <hr className="text-[#685A22] mb-2" />
        <p className="text-[#898989] text-l mb-4">Histórico de ações</p>
        <div className="flex flex-col items-center">
          <div className='w-full mb-4 mt-4 flex justify-between items-center'>

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

            <div className={'flex gap-2'}>
              <Button
                onClick={() => { showMessage({message: "Não implementado",type:"warning"})}}
                className='bg-neutral-100  hover:bg-neutral-200 text-[#404040] border border-[#3F3E3E] text-sm '
                text='Exportar CSV'
              />

              <Button
                onClick={() => { showMessage({message: "Não implementado",type:"warning"})}}
                className='bg-neutral-100  hover:bg-neutral-200 text-[#404040] border border-[#3F3E3E] text-sm '
                text='Exportar PDF'
              />
            </div>
          </div>
          {auditorias.length !== 0 && (<div className="overflow-x-auto border shadow-lg w-full border-[#c5c3b9]">
            <table className="w-full border-collapse text-center">

              {/* CABEÇALHO DA TABELA (Bege) */}
              <thead className="bg-[#E6E5DC] border-b border-[#c5c3b9]">
                <tr>
                  <th className="p-4 border-r border-[#c5c3b9] text-[#4a4a4a] font-semibold w-auto">
                    #
                  </th>
                  <th className="p-4 border-r border-[#c5c3b9] text-[#4a4a4a] font-semibold w-2/5">
                    Ação
                  </th>
                  <th className="p-4 border-r border-[#c5c3b9] text-[#4a4a4a] font-semibold w-auto">
                    Usuário
                  </th>
                  <th className="p-4 border-r border-[#c5c3b9] text-[#4a4a4a] font-semibold w-1/5">
                    Data / Hora
                  </th>
                  <th className="p-4 border-r border-[#c5c3b9] text-[#4a4a4a] font-semibold w-2/5">
                    Erro
                  </th>
                </tr>
              </thead>

              {/* CORPO DA TABELA */}
              <tbody>
                {auditorias.map((aud, index) => (
                  <tr
                    key={index}
                    // A mágica das cores alternadas: pares ficam brancos, ímpares ficam bege clarinho
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#F2F1EC]'} border-b border-[#c5c3b9] hover:bg-[#e4e2d8] transition-colors`}
                  >
                    <td className="p-4 border-r border-[#c5c3b9] text-[#555555] font-medium text-left">
                      {(maxResultados * (paginaAtual - 1)) + 1 + index}
                    </td>
                    <td className="p-4 border-r border-[#c5c3b9] text-[#666666] text-left">
                      {aud.acao}
                    </td>
                    <td className="p-4 border-r border-[#c5c3b9] text-[#555555] font-medium">
                      {aud.nomeUsuario}
                    </td>
                    
                    <td className="p-4 border-r border-[#c5c3b9] text-[#777777] text-sm">
                      {formatarDataHora( aud.data)}
                    </td>
                    <td className="p-4 border-r border-[#c5c3b9] text-[#f54b4b] text-xs">
                      {aud.logErro}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>)
          }

          {
            nadaEncontrado && (<div className='w-150 bg-[#EBE9E1] h-60 flex flex-col justify-center text-2xl items-center border border-[#898989] opacity-30'>
                <div >Nenhum dado encontrado</div>
                <HandThumbDownIcon className='w-20 h-20'> </HandThumbDownIcon>
            </div>)
        }
          {/* CONTROLES DE PAGINAÇÃO */}
          {totalPaginas > 1 && (
            <div className="flex justify-center items-center mt-6">


              <div className="flex gap-2">
                <button
                  disabled={paginaAtual === 1}
                  onClick={() => {
                                      buscarAuditorias(paginaAtual-1,size)
                                      setPaginaAtual(paginaAtual - 1)
                                  }}
                  className={"px-2 py-2 bg-[#E6E5DC] border border-[#c5c3b9] text-[#4a4a4a] hover:bg-[#d5d4cb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors disabled:hover:bg-[#E6E5DC]"}
                >
                  <ChevronLeftIcon className='w-6 h-6'></ChevronLeftIcon>
                </button>
                <button
                  onClick={() => {
                                      buscarAuditorias(1,size)
                                      setPaginaAtual(1)
                                  }}
                  disabled={paginaAtual === 1}
                  className={paginaAtual === 1 ? "px-4 py-2 bg-[#3f3f3f] border border-[#c5c3b9] text-white font-bold cursor-not-allowed" : "px-4 py-2 bg-[#E6E5DC] border border-[#c5c3b9] text-[#4a4a4a] hover:bg-[#d5d4cb] transition-colors"}
                >
                  1
                </button>
                <div className={paginaAtual === 1 || paginaAtual === 2 ? "hidden" : ' flex items-start text-[#3f3f3f] text-3xl'}>
                  <p className=''>...</p>
                </div>
                <button
                  disabled={true}
                  onClick={() => {
                                      buscarAuditorias(1,size)
                                      setPaginaAtual(1)
                                  }}
                  className={paginaAtual === 1 || paginaAtual === totalPaginas ? "hidden" : "px-4 py-2 bg-[#3f3f3f] border border-[#c5c3b9] text-white font-bold cursor-not-allowed"}
                >
                  {paginaAtual}
                </button>


                <div className={paginaAtual === totalPaginas || paginaAtual === totalPaginas - 1 ? "hidden" : ' flex items-start text-[#3f3f3f] text-3xl'}>
                  <p className=''>...</p>
                </div>
                <button
                  onClick={() => {
                                      buscarAuditorias(totalPaginas,size)
                                      setPaginaAtual(totalPaginas)
                                  }}
                  disabled={paginaAtual === totalPaginas}
                  className={paginaAtual === totalPaginas ? "px-4 py-2 bg-[#3f3f3f] border border-[#c5c3b9] text-white font-bold cursor-not-allowed" : "px-4 py-2 bg-[#E6E5DC] border border-[#c5c3b9] text-[#4a4a4a] hover:bg-[#d5d4cb] transition-colors"}
                >
                  {totalPaginas}
                </button>
                <button
                  disabled={paginaAtual === totalPaginas}
                  onClick={() => {
                                      buscarAuditorias(paginaAtual +1,size)
                                      setPaginaAtual(paginaAtual + 1)
                                  }}
                  className={"px-2 py-2 bg-[#E6E5DC] border border-[#c5c3b9] text-[#4a4a4a] hover:bg-[#d5d4cb] disabled:hover:bg-[#E6E5DC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"}
                >
                  <ChevronRightIcon className='w-6 h-6'></ChevronRightIcon>
                </button>
              </div>
            </div>)}


        </div>
      </div>

    </>
  );
};

export default Auditoria;
