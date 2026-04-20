"use client";

import AsyncSelect, { Option } from "@/components/widgets/AsyncSelect";
import Button from "@/components/widgets/Button";
import Input from "@/components/widgets/input";
import Select, { OptionType } from "@/components/widgets/select";
import { useSnackbar } from "@/components/widgets/snackbar";
import { auditoriaService } from "@/lib/services/auditoria";
import { consultaService } from "@/lib/services/consulta";
import { formatarData, formatarDataHora } from "@/lib/utils/date";
import { AuditoriaDto } from "@/types/auditoria";
import { listagemConsultaDto } from "@/types/consulta";
import { ChevronLeftIcon, ChevronRightIcon, FunnelIcon, HandThumbDownIcon, StarIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";



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


const Historico = () => {
  const nada = true;

  const [erroChecked, setErroChecked] = useState<boolean>(false)

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [size, setSize] = useState<number>(10);

  const [maxResultados, setMaxResultados] = useState<number>(10)

  const [totalPaginas, setTotalPaginas] = useState(0)

  const { showMessage } = useSnackbar();

  const [consultas, setConsultas] = useState<listagemConsultaDto[]>([])


  const [nadaEncontrado, setNadaEncontrado] = useState<boolean>(false)

  const buscarConsultas = async (paginaAtual: number, size: number, nomeOuEmail: string, dataDe: string, dataAte: string, onlyErro: boolean) => {
    try {
      setNadaEncontrado(false)
      setPaginaAtual(1)
      setMaxResultados(size)
      const response = await consultaService.getAll(
        paginaAtual - 1,
        {
          size: size,
          sort: 'dataConsulta,desc',
          nomeOuEmail: nomeOuEmail,
          dataDe: dataDe,
          dataAte: dataAte,
          onlyErro: onlyErro
        }
      );
      if (response.content.length === 0) {
        setNadaEncontrado(true)
      }
      rolarParaOTopo();
      setConsultas(response.content)
      setTotalPaginas(response.page.totalPages)

    } catch (error) {
      console.error("Erro ao buscar:", error);
      showMessage({ message: "Erro ao listar consultas", type: "error" })
    }
  };

  useEffect(() => {
    buscarConsultas(1, size, nomeOuEmail, dataDe, dataAte, erroChecked)
    setPaginaAtual(1)
  }, [size])



const [nomeOuEmail, setNomeOuEmail] = useState<string>("")
  const [expandido, setExpandido] = useState(true);
  const [dataDe, setDataDe] = useState("");
  const [dataAte, setDataAte] = useState("");

  const handleAplicar = () => {
    setPaginaAtual(1)
    buscarConsultas(1, size, nomeOuEmail, dataDe, dataAte, erroChecked)
  };

  const handleLimpar = () => {
    setNomeOuEmail("")
    setDataDe("");
    setDataAte("");
    setSize(10);
    setErroChecked(false)
    buscarConsultas(1, 10, "", "", "", false)
  };






  const topoRef = useRef<HTMLDivElement>(null);

  const rolarParaOTopo = () => {
    if (topoRef.current) {
      topoRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (

    <>

      <div
        className="text-[#3f3f3f]">
        <div ref={topoRef} ></div>

        <h1 className="text-3xl mb-2">Histórico de consultas</h1>
        <hr className="text-[#685A22] mb-2" />
        <p className="text-[#898989] text-l mb-4">Todas as buscas realizadas no sistema</p>
        <div className="flex flex-col items-center">
          <div className={`border border-[#c5c3b9] bg-[#EAE8E1] p-3 w-full mb-5 shadow-md`}>

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
                  <div className="flex flex-col gap-1 w-58">
                    <Input
                      id='nomeOuEmail'
                      value={nomeOuEmail}
                      onChange={(e) => setNomeOuEmail(e.target.value)}
                      type='text'
                      label='Usuário (nome ou email)'
                      className='text-[#7e7d77] text-xs '
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
                <div className="flex items-center justify-between mt-6 pb-1">
                  <div className="flex gap-3">
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


                  <div className="flex flex-col gap-1">


                    <Input
                      id="erros"
                      type="checkbox"
                      checked={erroChecked}
                      onChange={() => setErroChecked(!erroChecked)}
                      label="Apenas consultas com falha ou sem resultados"
                      className="text-[#7e7d77] text-xs"
                    />
                  </div>
                </div>

              </div>
            </div>

          </div>

          {consultas.length !== 0 && (
            <div className='w-full mb-4 mt-4 flex justify-end items-center'>




              <div className={'flex gap-2'}>
                <Button
                  onClick={() => { showMessage({ message: "Não implementado", type: "warning" }) }}
                  className='bg-neutral-100  hover:bg-neutral-200 text-[#404040] border border-[#3F3E3E] text-sm '
                  text='Exportar CSV'
                />

                <Button
                  onClick={() => { showMessage({ message: "Não implementado", type: "warning" }) }}
                  className='bg-neutral-100  hover:bg-neutral-200 text-[#404040] border border-[#3F3E3E] text-sm '
                  text='Exportar PDF'
                />
              </div>

            </div>
          )}

          {consultas.length !== 0 && (<div className="overflow-x-auto border shadow-lg w-full border-[#c5c3b9]">
            <table className="w-full border-collapse text-center">

              {/* CABEÇALHO DA TABELA (Bege) */}
              <thead className="bg-[#E6E5DC] border-b border-[#c5c3b9]">
                <tr>
                  <th className="p-4 border-r border-[#c5c3b9] text-[#4a4a4a] font-semibold w-auto">
                    #
                  </th>
                  <th className="p-4 border-r border-[#c5c3b9] text-[#4a4a4a] font-semibold w-2/5">
                    Pesquisa
                  </th>
                  <th className="p-4 border-r border-[#c5c3b9] text-[#4a4a4a] font-semibold w-1/5">
                    Filtros
                  </th>
                  <th className="p-4 border-r border-[#c5c3b9] text-[#4a4a4a] font-semibold w-1/5">
                    Usuário
                  </th>
                  <th className="p-4 border-r border-[#c5c3b9] text-[#4a4a4a] font-semibold w-1/6">
                    Data / Hora
                  </th>
                  <th className="p-4 border-r border-[#c5c3b9] text-[#4a4a4a] font-semibold w-1/8">
                    Resultados
                  </th>
                  <th className="p-4 border-r border-[#c5c3b9] text-[#4a4a4a] font-semibold w-1/8">
                    Tempo em ms
                  </th>
                  <th className={consultas.find(consulta => consulta.erro != "") ? "p-4 border-r border-[#c5c3b9] text-[#4a4a4a] font-semibold w-1/5" : "hidden"}>
                    Erro
                  </th>
                  <th className="p-4 border-r border-[#c5c3b9] text-[#4a4a4a] font-semibold w-1/5">
                    Avaliação
                  </th>
                </tr>
              </thead>

              {/* CORPO DA TABELA */}
              <tbody>
                {consultas.map((consulta, index) => (
                  <tr
                    key={index}
                    // A mágica das cores alternadas: pares ficam brancos, ímpares ficam bege clarinho
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#F2F1EC]'} border-b border-[#c5c3b9] hover:bg-[#e4e2d8] transition-colors`}
                  >
                    <td className="p-4 border-r border-[#c5c3b9] text-[#555555] font-medium text-left">
                      {(maxResultados * (paginaAtual - 1)) + 1 + index}
                    </td>

                    <td className="p-4 border-r border-[#c5c3b9] text-[#555555] text-xs text-left">
                      {consulta.stringBusca}
                    </td>
                    <td className="p-4 border-r border-[#c5c3b9] text-[#666666] text-xs">
                      <div className="flex flex-col">
                        <p>{consulta.nomeCategoria}</p>
                        <p className={consulta.dataDe ? "" : "hidden"}>Data de: {formatarData(consulta.dataDe!)} </p>
                        <p className={consulta.dataAte ? "" : "hidden"}>Data Até: {formatarData(consulta.dataAte!)}</p>

                      </div>

                    </td>
                    <td className="p-4 border-r border-[#c5c3b9] text-[#666666] text-xs ">
                      {consulta.nomeUsuario}
                    </td>

                    <td className="p-4 border-r border-[#c5c3b9] text-[#777777] text-xs">
                      {formatarDataHora(consulta.dataConsulta)}
                    </td>
                    <td className="p-4 border-r border-[#c5c3b9] text-[#777777] text-xs">
                      {consulta.quantidadeResultado}
                    </td>
                    <td className="p-4 border-r border-[#c5c3b9] text-[#777777] text-xs">
                      {consulta.tempoResposta}
                    </td>
                    <td className={consultas.find(consulta => consulta.erro != "") ? "p-4 border-r border-[#c5c3b9] text-[#f54b4b] text-xs" : "hidden"}>
                      {consulta.erro}
                    </td>
                    <td className="p-4 border-r border-[#c5c3b9] text-[#777777] text-xs">
                      {consulta?.avaliacao !== null ? <div className="flex">
                        {[1, 2, 3, 4, 5].map((item, index) => {
                          return item <= consulta.avaliacao! ? <StarIcon key={index} className="w-5 h-5 text-amber-300" /> : <StarIcon key={index} className="w-5 h-5 text-[#898989]" />
                        })}
                      </div> : <p>Não avaliada</p>}
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
                    buscarConsultas(paginaAtual - 1, size, nomeOuEmail, dataDe, dataAte, erroChecked)
                    setPaginaAtual(paginaAtual - 1)
                  }}
                  className={"px-2 py-2 bg-[#E6E5DC] border border-[#c5c3b9] text-[#4a4a4a] hover:bg-[#d5d4cb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors disabled:hover:bg-[#E6E5DC]"}
                >
                  <ChevronLeftIcon className='w-6 h-6'></ChevronLeftIcon>
                </button>
                <button
                  onClick={() => {
                    buscarConsultas(1, size, nomeOuEmail, dataDe, dataAte, erroChecked)
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
                    buscarConsultas(1, size, nomeOuEmail, dataDe, dataAte, erroChecked)
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
                    buscarConsultas(totalPaginas, size, nomeOuEmail, dataDe, dataAte, erroChecked)
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
                    buscarConsultas(paginaAtual + 1, size, nomeOuEmail, dataDe, dataAte, erroChecked);
                    setPaginaAtual(paginaAtual + 1);
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

export default Historico;

