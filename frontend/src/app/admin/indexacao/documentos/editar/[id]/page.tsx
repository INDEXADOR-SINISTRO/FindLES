'use client'

import AreaDeUpload from '@/components/AreaUpload';
import Button from '@/components/widgets/Button';
import Input from '@/components/widgets/input';
import Select, { OptionType } from '@/components/widgets/select';
import { useSnackbar } from '@/components/widgets/snackbar';
import { documentoService } from '@/lib/services/documento';
import { formatarDataHora } from '@/lib/utils/date';
import { CategoriaList, listagemDocumentoDto } from '@/types/documento';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { ArrowLongLeftIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';

type Params = Promise<{ id: string }>;

const AtualizarDoc = ({ params }: { params: Params }) => {

    const resolvida = use(params);
    const idDoDocumento = resolvida.id;
    const { push } = useRouter();

    const { showMessage } = useSnackbar();


    const [submitWasClicked, setSubmitWasClicked] = useState<boolean>(false)

    const [doc, setDoc] = useState<listagemDocumentoDto>()

    const [titulo, setTitulo] = useState<string>("");
    const [categoria, setCategoria] = useState<number>();
    const optionsCategoria: OptionType[] = CategoriaList.map(
        (item) => ({
            value: String(item.value),
            optionLabel: item.descricao
        })
    );

    const [arquivos, setArquivos] = useState<File[]>([]);

    const onFilesChange = (arquivos: File[]) => {
        setArquivos(arquivos);
    };

    useEffect(() => {
        buscarDoc(idDoDocumento);
    }, [])


    const [isLoading, setIsLoading] = useState<boolean>(false)


    const onCheckFields = () => {
        if (titulo === "") {
            return true;
        }
        return false;
    }

    const onSubmit = async () => {

        const invalidFields = onCheckFields()
        setSubmitWasClicked(true);
        if (invalidFields) {
            showMessage({ message: "Título não pode estar vazio", type: "error" })
            return;
        }

        try {

            setIsLoading(true);
            await documentoService.editar(doc?.id!, arquivos, titulo, Number(categoria));
            showMessage({ message: "Arquivo atualizado com sucesso!", type: "success" });
            push("/admin/indexacao/documentos")
        } catch (error) {
            const erro = error as Error;
            showMessage({ message: erro.message, type: "error" });
        } finally {
            setIsLoading(false);
        }
    }




    const buscarDoc = async (id: string) => {
        try {
            const response = await documentoService.getById(Number(id));
            setDoc(response)
            setTitulo(response.titulo)
            setCategoria(Number(optionsCategoria.find(opt => opt.optionLabel === response.nomeCategoria)?.value ?? ""))
        } catch (error) {
            showMessage({ message: "Erro ao buscar documento", type: "error" })
            push("/admin/indexacao/documentos")
        }
    }



    return <>
        <div className='w-full mb-4 flex justify-between items-center'>

            <a href="/admin/indexacao/documentos" className="text-sm text-gray-500 underline hover:text-gray-800 flex items-center gap-1 ">
                <ArrowLongLeftIcon className="w-4 h-4"></ArrowLongLeftIcon>
                voltar
            </a>

        </div>
        <h1 className="text-3xl mb-2">Editar documento</h1>
        <hr className="text-[#685A22] mb-2" />
        <p className="text-[#898989] text-l mb-4">{doc?.titulo + " · Indexado em " + formatarDataHora(doc?.criadoEm!) + " · Versão atual: " + doc?.numeroVersao}</p>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-start'>
            <div className='w-full flex flex-col gap-2'>
                <Input
                    id='titulo'
                    onChange={(e) => setTitulo(e.target.value)}
                    type='text'
                    label='Título'
                    className='w-full'
                    value={titulo}
                    maxCaracteres={80}
                    showError={titulo === "" && submitWasClicked}
                />
                <Select
                    id="categoria"
                    onChange={(e) => setCategoria(Number(e.target.value))}
                    options={optionsCategoria}
                    label="Categoria"
                    value={String(categoria)}
                />

                <div className="flex border border-gray-400 mt-6">

                    <div className="w-3 bg-gray-300"></div>

                    <div className="px-4 py-2.5  text-gray-700 font-medium leading-relaxed flex gap-2">
                        Substituir arquivo irá criar nova versão no histórico.
                    </div>
                    <ExclamationTriangleIcon className='w-5 h-5 text-gray-700 my-auto ml-auto mr-2'></ExclamationTriangleIcon>
                </div>


            </div>
            <div className=' w-full flex flex-col'>
                <p>
                    Substituir arquivo
                </p>

                <AreaDeUpload
                    multiple={false}
                    onFilesChange={onFilesChange}

                ></AreaDeUpload>
            </div>



        </div>
        <Button
            onClick={onSubmit}
            className='mt-10 text-white'
            text='Salvar alterações'
            isLoading={isLoading}
        />

    </>

}

export default AtualizarDoc