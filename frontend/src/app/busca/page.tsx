'use client'

import BarraRelevancia from "@/components/barraRelevancia"
import Button from "@/components/widgets/Button"
import Input from "@/components/widgets/input"
import Select, { OptionType } from "@/components/widgets/select"
import { useSnackbar } from "@/components/widgets/snackbar"
import { consultaService } from "@/lib/services/consulta"
import { documentoService } from "@/lib/services/documento"
import { resultadoService } from "@/lib/services/resultado"
import { formatarData, formatarDataHora } from "@/lib/utils/date"
import { avaliarConsultaDto } from "@/types/consulta"
import { CategoriaList } from "@/types/documento"
import { resultadoDto } from "@/types/resultado"
import { ChevronLeftIcon, ChevronRightIcon, DocumentTextIcon, FunnelIcon, HandThumbDownIcon, StarIcon } from "@heroicons/react/24/solid"
import { useEffect, useRef, useState } from "react"







const Busca = () => {
    // Estados da Paginação
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [size, setSize] = useState<number>(10); // Quantos itens mostrar por vez
    const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false)
    const [busca, setBusca] = useState<string>("")

    // Guarda a nota que o usuário clicou (definitiva)
    const [nota, setNota] = useState(0);

    // Guarda a posição do mouse (temporária)
    const [hover, setHover] = useState(0);


    const [totalArquivos, setTotalArquivos] = useState(0)


    const [tokens, setTokens] = useState<string[]>([])
    const [idConsulta, setIdConsulta] = useState<number>()

    const [resultados, setResultados] = useState<resultadoDto[]>([])


    const [maxResultados, setMaxResultados] = useState<number>(10)

    const [totalPaginas, setTotalPaginas] = useState(0)
    const { showMessage } = useSnackbar();
    const [nadaEncontrado, setNadaEncontrado] = useState<boolean>(false)

    const [expandido, setExpandido] = useState(true);

    // Estados dos formulários (para você ligar com sua requisição depois)
    const [categoria, setCategoria] = useState<string>("");
    const optionsCategoria: OptionType[] = CategoriaList.map(
        (item) => ({
            value: String(item.value),
            optionLabel: item.descricao
        })
    );

    useEffect(() => {
        if (idConsulta && idConsulta > 0) {
            buscarResultados(1, size, idConsulta)
        }
    }, [idConsulta, size])
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
        criarConsulta(busca, categoria, dataDe, dataAte)
        setPaginaAtual(1)
    };

    const handleLimpar = () => {
        setCategoria("");
        setDataDe("");
        setDataAte("");
        setSize(10);
    };

    const avaliarConsulta = async(nota: number)=>{
        try{

            const payload: avaliarConsultaDto = {
                avaliacao: nota,
                idConsulta: idConsulta!
            }            
            await consultaService.avaliar(payload)
            showMessage({ message: "Avaliado", type: "success" })
        }catch (error) {

            showMessage({ message: "Erro ao avaliar consulta", type: "error" })
        }
    }

    const criarConsulta = async (busca: string, categoria: string, dataDe: string, dataAte: string) => {
        if (busca.trim() === "" || busca.trim().length < 2) {
            return;
        }
        try {
            const response = await consultaService.criarConsulta(
                {
                    busca: busca,
                    dataDe: dataDe,
                    dataAte: dataAte,
                    idCategoria: categoria,
                }
            );
            setTokens(response.tokens)
            setIdConsulta(response.id)
            console.log(response)

        } catch (error) {

            showMessage({ message: "Erro ao consultar documentos", type: "error" })
        }
    };

    const topoRef = useRef<HTMLDivElement>(null);

    const rolarParaOTopo = () => {
        if (topoRef.current) {
            topoRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const buscarResultados = async (paginaAtual: number, size: number, idConsulta: number) => {

        try {
            setNadaEncontrado(false)
            setPaginaAtual(1)
            setMaxResultados(size)
            const response = await resultadoService.getAll(
                paginaAtual - 1,
                {
                    idConsulta: idConsulta,
                    size: size,
                    sort: 'relevanciaScore,desc'
                }
            );
            if (response.content.length === 0) {
                setNadaEncontrado(true)
            }
            rolarParaOTopo();
            setResultados(response.content)
            setTotalPaginas(response.page.totalPages)
            setTotalArquivos(response.page.totalElements)

        } catch (error) {

            showMessage({ message: "Erro ao listar documentos", type: "error" })
        }
    };

    const handleVisualizar = async (idDocumento: number) => {

        try {
            // Chama o serviço passando a rota do seu backend que devolve o arquivo
            await documentoService.AbrirDocumento(idDocumento);
        } catch (error) {
            showMessage({ message: "Não foi possível abrir o documento.", type: "error" });
        }
    };

    useEffect(()=>{
        setNota(0)
    },[idConsulta])


    return (
        <>
            <div ref={topoRef}></div>
            <h1 className="text-3xl mb-2 text-center">Buscar documentos</h1>
            <hr className="text-[#685A22] mb-2" />
            <p className="text-[#898989] text-l mb-4 text-center">Digite um ou mais termos para pesquisar</p>
            <div className='mb-10 flex items-end w-full'>
                <Input
                    id='busca'
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    type='text'
                    className='w-full'
                />
                <Button
                    onClick={() => { criarConsulta(busca, categoria, dataDe, dataAte) }}
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
            {resultados.length !== 0 && (<div className='w-full flex justify-between items-end'>
                <div className="border-[#c5c3b9] border bg-[#EAE8E1] px-2 mb-2 flex flex-col items-center">
                    <p className="text-[#3f3f3f]">Avalie o resultado da busca:</p>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((estrelaAtual) => {

                            // A mágica acontece aqui: 
                            // A estrela deve ficar amarela se o número dela for menor ou igual
                            // ao número que está com hover. Se não tiver hover, olha pra nota fixa.
                            const estaAtiva = estrelaAtual <= (hover || nota);

                            return (
                                <StarIcon
                                    key={estrelaAtual}
                                    // onMouseEnter: O mouse entrou nessa estrela (Ex: entrou na 3, hover vira 3)
                                    onMouseEnter={() => setHover(estrelaAtual)}
                                    // onMouseLeave: O mouse saiu do grupo de estrelas, zera o hover
                                    onMouseLeave={() => setHover(0)}
                                    // onClick: Grava a nota definitiva
                                    onClick={() => { 
                                        setNota(estrelaAtual)
                                        avaliarConsulta(estrelaAtual)
                                    }}

                                    role="presentation"

                                    className={`w-6 h-6 cursor-pointer transition-colors duration-200 ${estaAtiva ? 'text-amber-400' : 'text-[#898989]'
                                        }`}
                                />
                            );
                        })}
                    </div>
                </div>
                <p className='text-[#898989] text-sm'>total de arquivos: {totalArquivos}</p>

            </div>)}

            <div className="flex flex-col items-center gap-10">
                {resultados.map((res) => {
                    return (

                        <div key={res.id} className="flex gap-4 bg-[#EBE9E1] border w-full border-[#898989] p-2 hover:bg-[#cac7b8] cursor-pointer transition-colors duration-200 shadow-md items-start"
                            onClick={() => handleVisualizar(res.documento.id)}
                            title="Visualizar"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleVisualizar(res.documento.id);
                                }
                            }}
                        >

                            <div >
                                <DocumentTextIcon className="w-15 h-15 text-[#5c5c5c]"></DocumentTextIcon>
                            </div>
                            <div className="w-full flex flex-col "
                            >
                                <div className="text-xl">{res.documento.titulo}</div>
                                <div className="text-[#898989]">PDF · {res.documento.nomeCategoria !== "Sem Categoria" ? `Categoria: ${res.documento.nomeCategoria}` : res.documento.nomeCategoria} · Indexado: {formatarData(res.documento.criadoEm)}
                                </div>
                                <p className="bg-neutral-300 opacity-90 px-4 py-2 border border-neutral-700 text-shadow-2xs leading-relaxed cursor-default"
                                    onClick={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => e.stopPropagation()}
                                    role="presentation">
                                    {res.trechoEncontrado?.replaceAll("�", "e").split(" ").map((string, index) => {
                                        const ehPalavraBuscada = tokens.some((token) => string.toLowerCase().includes(token.toLowerCase()) /*&& token.toLowerCase().charAt(0) == string.toLowerCase().charAt(0)*/);

                                        return (
                                            <span
                                                key={index}
                                                className={`text-sm ${ehPalavraBuscada ? "text-neutral-950 font-bold" : "text-neutral-800"}`}
                                            >
                                                {string}{" "}
                                            </span>
                                        );
                                    })}
                                </p>
                                <div className="mt-2 flex gap-2 ">{res.busca.trim().split(" ").map((string, index) => {
                                    if (string.trim() === "" || string.trim().length < 2) return;
                                    if (res.trechoEncontrado?.replaceAll("�", "e").toLowerCase().includes(string.toLowerCase().trim())) {
                                        return (<div className="py-1 px-4 text-xs bg-neutral-500 text-white" key={index}>{string}</div>)
                                    }

                                })}</div>
                                <div className="flex w-full  text-[#696969]">
                                    <p className="mr-2">Relevânica: </p>
                                    <BarraRelevancia mostrarTexto={true} porcentagem={(res.relevanciaScore * 100).toFixed(2)} />
                                </div>
                            </div>
                        </div>
                    )
                }
                )}

                {
                    nadaEncontrado && (<div className='w-150 bg-[#EBE9E1] h-60 flex flex-col justify-center text-2xl items-center border border-[#898989] opacity-30'>
                        <div >Nenhum arquivo encontrado</div>
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
                                    buscarResultados(paginaAtual - 1, size, idConsulta!)
                                    setPaginaAtual(paginaAtual - 1)
                                }}
                                className={"px-2 py-2 bg-[#E6E5DC] border border-[#c5c3b9] text-[#4a4a4a] hover:bg-[#d5d4cb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors disabled:hover:bg-[#E6E5DC]"}
                            >
                                <ChevronLeftIcon className='w-6 h-6'></ChevronLeftIcon>
                            </button>
                            <button
                                onClick={() => {
                                    buscarResultados(1, size, idConsulta!)
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
                                    buscarResultados(1, size, idConsulta!)
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
                                    buscarResultados(totalPaginas, size, idConsulta!)
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
                                    buscarResultados(paginaAtual + 1, size, idConsulta!)
                                    setPaginaAtual(paginaAtual + 1)
                                }}
                                className={"px-2 py-2 bg-[#E6E5DC] border border-[#c5c3b9] text-[#4a4a4a] hover:bg-[#d5d4cb] disabled:hover:bg-[#E6E5DC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"}
                            >
                                <ChevronRightIcon className='w-6 h-6'></ChevronRightIcon>
                            </button>
                        </div>
                    </div>
                )}
            </div>


        </>
    )
}

export default Busca