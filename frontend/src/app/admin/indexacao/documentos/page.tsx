"use client";

import Button from '@/components/widgets/Button';
import Dialog from '@/components/widgets/dialog';
import Input from '@/components/widgets/input';
import Select, { OptionType } from '@/components/widgets/select';
import { useSnackbar } from '@/components/widgets/snackbar';
import { documentoService } from '@/lib/services/documento';
import { formatarDataHora } from '@/lib/utils/date';
import { CategoriaList, listagemDocumentoDto } from '@/types/documento';
import { DocumentDuplicateIcon, EyeIcon, PencilIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ArrowLeftIcon, ArrowLongLeftIcon, ChevronLeftIcon, ChevronRightIcon, FunnelIcon, HandThumbDownIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useState } from 'react';

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



const Documentos = () => {

    // Estados da Paginação
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [size, setSize] = useState<number>(5); // Quantos itens mostrar por vez
    const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false)
    const [isOpenIndexar, setIsOpenIndexar] = useState<boolean>(false)

    const [isLoadingIndexar,setIsLoadingIndexar] = useState<boolean>(false)
    const [isOpenCalcular, setIsOpenCalcular] = useState<boolean>(false)
    const [titulo, setTitulo] = useState<string>("")

    const [maxResultados,setMaxResultados] = useState<number>(5)

    const [totalPaginas, setTotalPaginas] = useState(0)
    const [totalArquivos, setTotalArquivos] = useState(0)
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
    
    
    const [dataDe, setDataDe] = useState("");
    const [dataAte, setDataAte] = useState("");

    const handleAplicar = () => {
        setPaginaAtual(1)
        buscarDocumentos(titulo, 1, size, categoria,dataDe,dataAte)
    };

    const handleLimpar = () => {
        setCategoria("");
        setDataDe("");
        setDataAte("");
        setSize(5);
    };


    const [docs, setDocs] = useState<listagemDocumentoDto[]>([])

    const handleVisualizar = async (idDocumento: number) => {
        try {
            // Chama o serviço passando a rota do seu backend que devolve o arquivo
            await documentoService.AbrirDocumento(idDocumento);
        } catch (error) {
            showMessage({ message: "Não foi possível abrir o documento.", type: "error" });
        }
    };

    const handleIndexar = async( )=>{
        try{
            setIsLoadingIndexar(true);
            const response = await documentoService.indexarDocumentos();
            showMessage({ message: response , type: "success" });
            setIsLoadingIndexar(false);
            setIsOpenIndexar(false);
        }catch(error){
            setIsLoadingIndexar(false)
            showMessage({ message: "Não foi possível indexar documentos.", type: "error" });
        }
        handleAplicar();
    }


    useEffect(() => {
        
        buscarDocumentos("", paginaAtual, size, categoria,dataDe,dataAte)
    }, [])


    const buscarDocumentos = async (titulo: string, paginaAtual: number, size: number, categoria: string,dataDe: string, dataAte: string) => {
        try {
            setNadaEncontrado(false)
            setPaginaAtual(1)
            setMaxResultados(size)
            const response = await documentoService.getAll(
                paginaAtual - 1,
                {
                    titulo: titulo,
                    size: size,
                    idCategoria: categoria,
                    dataDe: dataDe,
                    dataAte: dataAte,
                    sort: 'criadoEm,desc'
                }
            );
            if (response.content.length === 0) {
                setNadaEncontrado(true)
            }
            setDocs(response.content)
            setTotalPaginas(response.page.totalPages)
            setTotalArquivos(response.page.totalElements)

        } catch (error) {
            console.error("Erro ao buscar:", error);
            showMessage({ message: "Erro ao listar documentos", type: "error" })
        }
    };

    return (<div className="flex flex-col items-center">

        <div className='w-full mb-4 flex justify-between items-center'>
            
            <a href="/admin/indexacao" className="text-sm text-gray-500 underline hover:text-gray-800 flex items-center gap-1 ">
              <ArrowLongLeftIcon className="w-4 h-4"></ArrowLongLeftIcon>
              voltar
            </a>
            <div className='flex gap-2'>
            <Button
            onClick={()=>{setIsOpenIndexar(true)}}
            className='text-white text-sm '
            text='Indexar'
            />

            <Button
            onClick={()=>{setIsOpenCalcular(true)}}
            className='bg-neutral-100  hover:bg-neutral-200 text-[#404040] border border-[#3F3E3E] text-sm '
            text='Cálcular TF-IDF'
            />
            </div>
        </div>

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
                onClick={() => { buscarDocumentos(titulo, 1, size,categoria,dataDe,dataAte) }}
                className=" text-white "
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
        {docs.length !== 0 && (<div className='w-full flex justify-end'>
            <p className='text-[#898989] text-sm'>total de arquivos: {totalArquivos}</p>

        </div>)}
        {/* Tabela com bordas externas para imitar o design da imagem */}
        {docs.length !== 0 && (<div className="overflow-x-auto border shadow-lg w-full border-[#c5c3b9]">
            <table className="w-full border-collapse text-center">

                {/* CABEÇALHO DA TABELA (Bege) */}
                <thead className="bg-[#E6E5DC] border-b border-[#c5c3b9]">
                    <tr>
                        <th className="p-4 border-r border-[#c5c3b9] text-[#4a4a4a] font-semibold w-auto">
                            #
                        </th>
                        <th className="p-4 border-r border-[#c5c3b9] text-[#4a4a4a] font-semibold w-2/5">
                            Título
                        </th>
                        <th className="p-4 border-r border-[#c5c3b9] text-[#4a4a4a] font-semibold w-1/5">
                            Data de criação
                        </th>
                        <th className="p-4 border-r border-[#c5c3b9] text-[#4a4a4a] font-semibold w-1/5">
                            Inserido por
                        </th>
                        <th className="p-4 border-r border-[#c5c3b9] text-[#4a4a4a] font-semibold w-1/8">
                            Status
                        </th>
                        <th className="p-4 text-[#4a4a4a] font-semibold w-1/5">
                            Ações
                        </th>
                    </tr>
                </thead>

                {/* CORPO DA TABELA */}
                <tbody>
                    {docs.map((doc, index) => (
                        <tr
                            key={doc.id}
                            // A mágica das cores alternadas: pares ficam brancos, ímpares ficam bege clarinho
                            className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#F2F1EC]'} border-b border-[#c5c3b9] hover:bg-[#e4e2d8] transition-colors`}
                        >
                            <td className="p-4 border-r border-[#c5c3b9] text-[#555555] font-medium text-left">
                                {(maxResultados*(paginaAtual -1)) + 1 + index }
                            </td>
                            <td className="p-4 border-r border-[#c5c3b9] text-[#555555] font-medium text-left">
                                {doc.titulo}
                            </td>
                            <td className="p-4 border-r border-[#c5c3b9] text-[#666666]">
                                {formatarDataHora(doc.criadoEm)}
                            </td>
                            <td className="p-4 border-r border-[#c5c3b9] text-[#777777] text-sm">
                                {doc.nomeUsuario}
                            </td>
                            <td className="p-4 border-r border-[#c5c3b9] text-[#777777] text-sm">
                                {doc.nomeStatus}
                            </td>

                            {/* BOTÕES DE AÇÃO */}
                            <td className="p-4 flex justify-evenly gap-1">
                                {/* Botão Ver */}
                                <button className="text-[#3f3f3f] hover:text-blue-700 transition-colors" title="Visualizar"
                                    onClick={() => { handleVisualizar(doc.id) }}
                                >

                                    <EyeIcon className='w-6 h-6 cursor-pointer'></EyeIcon>
                                </button>

                                {/* Botão Baixar */}
                                <button className="text-[#3f3f3f] hover:text-blue-700 transition-colors" title="Atualizar"
                                    onClick={() => showMessage({ message: "Não implementado", type: "warning" })}>
                                    <PencilSquareIcon className="w-6 h-6 cursor-pointer"></PencilSquareIcon>
                                </button>
                                {/* Botão historico */}
                                <button className="text-[#3f3f3f] hover:text-blue-700 transition-colors" title="Histórico"
                                    onClick={() => showMessage({ message: "Não implementado", type: "warning" })}>
                                    <DocumentDuplicateIcon className="w-6 h-6 cursor-pointer"></DocumentDuplicateIcon>
                                </button>

                                {/* Botão Excluir */}
                                <button className="text-red-500 hover:opacity-60 transition-colors" title="Remover"
                                    onClick={() => {
                                        setIsOpenDelete(!isOpenDelete)
                                    }}
                                >
                                    <TrashIcon className="w-6 h-6 cursor-pointer"></TrashIcon>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>)
        }
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
                            buscarDocumentos(titulo, paginaAtual - 1, size,categoria,dataDe,dataAte)
                            setPaginaAtual(paginaAtual - 1)
                        }}
                        className={"px-2 py-2 bg-[#E6E5DC] border border-[#c5c3b9] text-[#4a4a4a] hover:bg-[#d5d4cb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors disabled:hover:bg-[#E6E5DC]"}
                    >
                        <ChevronLeftIcon className='w-6 h-6'></ChevronLeftIcon>
                    </button>
                    <button
                        onClick={() => {
                            buscarDocumentos(titulo, 1, size,categoria,dataDe,dataAte)
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
                            buscarDocumentos(titulo, 1, size,categoria,dataDe,dataAte)
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
                            buscarDocumentos(titulo, totalPaginas, size,categoria,dataDe,dataAte)
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
                            buscarDocumentos(titulo, paginaAtual + 1, size,categoria,dataDe,dataAte )
                            setPaginaAtual(paginaAtual + 1)
                        }}
                        className={"px-2 py-2 bg-[#E6E5DC] border border-[#c5c3b9] text-[#4a4a4a] hover:bg-[#d5d4cb] disabled:hover:bg-[#E6E5DC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"}
                    >
                        <ChevronRightIcon className='w-6 h-6'></ChevronRightIcon>
                    </button>
                </div>
            </div>
        )}

        <Dialog
            isOpen={isOpenDelete}
            onClose={() => { setIsOpenDelete(false) }}
            title='Apagar arquivo'
            onConfirm={() => showMessage({ message: "Não implementado", type: "warning" })}

        >
            <div className='text-[#898989] text-lg'>
                Deseja mesmo remover esse arquivo do sistema?
            </div>

        </Dialog>
        <Dialog
            isOpen={isOpenIndexar}
            onClose={() => { setIsOpenIndexar(false) }}
            title='Indexar documentos'
            onConfirm={handleIndexar}
            isLoading={isLoadingIndexar}

        >
            <div className='text-[#898989] text-lg'>
                Ao confirmar todos os documentos com status "Pendente" serão indexados
             </div>

        </Dialog>
        <Dialog
            isOpen={isOpenCalcular}
            onClose={() => { setIsOpenCalcular(false) }}
            title='Calcular TF-IDF'
            onConfirm={() => showMessage({ message: "Não implementado", type: "warning" })}

        >
            <div className='text-[#898989] text-lg'>
                Ao confirmar o calculo de TF-IDF será processado com base em todos os documentos com status "ativo"
            </div>

        </Dialog>
    </div>
    );
}

export default Documentos;