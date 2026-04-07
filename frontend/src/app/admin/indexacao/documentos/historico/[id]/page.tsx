'use client'

import Button from "@/components/widgets/Button"
import Dialog from "@/components/widgets/dialog";
import { useSnackbar } from "@/components/widgets/snackbar";
import { documentoService } from "@/lib/services/documento";
import { formatarDataHora } from "@/lib/utils/date";
import { listagemDocumentoDto } from "@/types/documento";
import { ArrowLongLeftIcon, ArrowLongRightIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

type Params = Promise<{ id: string }>;

const HistoricoDocumento = ({ params }: { params: Params }) => {

    const { push } = useRouter();

    const resolvida = use(params);
    const idDoDocumento = resolvida.id;
    const { showMessage } = useSnackbar();

    const [docs, setDocs] = useState<listagemDocumentoDto[]>([]);
    const [doc, setDoc] = useState<listagemDocumentoDto>();
    const [docRestaurar,setDocRestaurar] = useState<listagemDocumentoDto>();

    const[isLoading,setIsLoading] = useState<boolean>(false);
    const [isOpenRestaurar,setIsOpenRestaurar] = useState<boolean>(false)

    useEffect(() => {
        buscarDoc(idDoDocumento);
    }, [])

    useEffect(() => {
        if (doc?.idOrigem) {
            buscarHistorico(String(doc.idOrigem));
        } else {
            buscarHistorico(idDoDocumento);
        }
    }, [doc])

    const buscarHistorico = async (id: string) => {
        try {
            const response = await documentoService.getHistoricoById(Number(id));
            setDocs(response);
        } catch (error) {
            showMessage({ message: "Erro ao buscar histórico do documento", type: "error" });
            push("/admin/indexacao/documentos");
        }
    }

    const buscarDoc = async (id: string) => {
        try {
            const response = await documentoService.getById(Number(id));
            setDoc(response);
        } catch (error) {
            showMessage({ message: "Erro ao buscar documento", type: "error" });
            push("/admin/indexacao/documentos");
        }
    }

    const handleVisualizar = async (idDocumento: number) => {
        try {
            // Chama o serviço passando a rota do seu backend que devolve o arquivo
            await documentoService.AbrirDocumento(idDocumento);
        } catch (error) {
            showMessage({ message: "Não foi possível abrir o documento.", type: "error" });
        }
    };

    const handleRestaurar = async (idDocumento: number, idDocAtual: number) => {
        try {
            // Chama o serviço passando a rota do seu backend que devolve o arquivo
            setIsLoading(true);
            const response  = await documentoService.restaurarDocumento(idDocumento, idDocAtual);
            showMessage({ message: "Documento restaurado", type: "success" });
            push(`/admin/indexacao/documentos/historico/${String(response)}`)
        } catch (error) {
            showMessage({ message: "Não foi possível restaurar o documento.", type: "error" });
        }finally{
            setIsLoading(false);
        }
    };

    return (
        <div >

            <div className='w-full mb-4 flex justify-between items-center'>

                <a href="/admin/indexacao/documentos" className="text-sm text-gray-500 underline hover:text-gray-800 flex items-center gap-1 ">
                    <ArrowLongLeftIcon className="w-4 h-4"></ArrowLongLeftIcon>
                    voltar
                </a>

            </div>
            <h1 className="text-3xl mb-2">Histórico de versões</h1>
            <hr className="text-[#685A22] mb-2" />
            <p className="text-[#898989] text-l mb-4">{docs.length} versões registradas · Versão atual: {doc?.numeroVersao}</p>


            {/* Lista de Versões */}
            <div className="flex flex-col ml-10">
                {docs.map((item, index) => {
                    const isCurrent = index === 0;



                    return (
                        <div key={index} className="flex items-center justify-between py-5 border-b border-[#c5c3b9]">

                            {/* Lado Esquerdo: Bolinha e Textos */}
                            <div className="flex items-start gap-4">
                                {/* Bolinha indicadora */}
                                <div className={`mt-1.5 w-3.5 h-3.5 rounded-full shrink-0 ${isCurrent ? 'bg-[#3f3f3f]' : 'bg-[#9ca3af]'}`}></div>

                                <div>
                                    <h3 className={`text-base ${isCurrent ? 'font-bold text-[#3f3f3f]' : 'font-semibold text-[#6b6a65]'}`}>
                                        v{item.numeroVersao} - {item.titulo || "Documento sem título"}
                                    </h3>
                                    <p className="text-xs text-[#7e7d77] mt-1.5">
                                        Inserido por: {item.nomeUsuario} · Atualizado em: {formatarDataHora(item.atualizadoEm)}
                                    </p>
                                </div>
                            </div>

                            {/* Lado Direito: Botões */}
                            <div className="flex gap-3">
                                {isCurrent ? (
                                    <>

                                        <Button
                                            onClick={() => { handleVisualizar(item.id) }}
                                            text="Visualizar"
                                            className="text-white text-sm"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            onClick={() => { handleVisualizar(item.id) }}
                                            text="Visualizar"
                                            className="bg-neutral-100  hover:bg-neutral-200 text-[#404040] border border-[#3F3E3E] text-sm"
                                        />
                                        <Button
                                            onClick={() => { 
                                                setDocRestaurar(item);
                                                setIsOpenRestaurar(true);
                                            }}
                                            text="Restaurar"
                                            className="bg-neutral-100  hover:bg-neutral-200 text-[#404040] border border-[#3F3E3E] text-sm"
                                            isLoading={isLoading}
                                        />
                                    </>
                                )}
                            </div>

                        </div>
                    );
                })}
            </div>

            {/* Rodapé explicativo */}
            {docs.length > 1 && (
                <p className="text-sm text-[#9ca3af] mt-6 flex gap-2 items-center">
                    <ArrowLongRightIcon className="w-4 h-4"></ArrowLongRightIcon>
                    Restaurar cria uma nova versão com o conteúdo da selecionada
                </p>
            )}

            <Dialog
            isOpen={isOpenRestaurar}
            onClose={()=>setIsOpenRestaurar(false)}
            title={`Restaurar: ${docRestaurar?.titulo}`}
            isLoading={isLoading}
            onConfirm={()=>handleRestaurar(docRestaurar?.id!,doc?.id!)}
            >
                <div>
                    Restaurar cria uma nova versão com o conteúdo da versão selecionada. Deseja restaurar este documento?
                </div>

            </Dialog>

        </div>
    );
}

export default HistoricoDocumento;