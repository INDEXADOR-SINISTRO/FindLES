"use client";

import Button from "@/components/widgets/Button";
import Dialog from "@/components/widgets/dialog";
import Input from "@/components/widgets/input";
import Select, { OptionType } from "@/components/widgets/select";
import { useSnackbar } from "@/components/widgets/snackbar";
import { userService } from "@/lib/services/usuario";
import { formatarDataHora } from "@/lib/utils/date";
import { formartarRole } from "@/lib/utils/geral";
import { UserDto, UserEditarDto } from "@/types/user";
import { ChevronLeftIcon, ChevronRightIcon, FunnelIcon, HandThumbDownIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
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


const optionsPerfil: OptionType[] = [
  {
    value: "",
    optionLabel: "Todos"
  }, {
    value: "1",
    optionLabel: "Usuário"
  }, {
    value: "2",
    optionLabel: "Administrador"
  }

]


const Usuarios = () => {




  // Estados da Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [size, setSize] = useState<number>(10); // Quantos itens mostrar por vez
  const [isOpenEditar, setIsOpenEditar] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [nomeOuEmail, setNomeOuEmail] = useState<string>("")


  const [nome, setNome] = useState<string>("")
  const [email, setEmail] = useState<string>("")

  const [maxResultados, setMaxResultados] = useState<number>(5)

  const [totalPaginas, setTotalPaginas] = useState(0)
  const { showMessage } = useSnackbar();
  const [nadaEncontrado, setNadaEncontrado] = useState<boolean>(false)

  const [perfil, setPerfil] = useState<string>("")
  const [perfilAcesso, setPerfilAcesso] = useState<string>("")
  const [users, setUsers] = useState<UserDto[]>([])


  const [user, setUser] = useState<UserDto>()

  const topoRef = useRef<HTMLDivElement>(null);


  const [submitWasClicked, setSubmitWasClicked] = useState<boolean>(false)

  const rolarParaOTopo = () => {
    if (topoRef.current) {
      topoRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {

    buscarUsuarios(nomeOuEmail, paginaAtual, size, perfil)
  }, [size, perfil])


  const buscarUsuarios = async (nomeOuEmail: string, paginaAtual: number, size: number, perfil: string) => {
    try {
      setNadaEncontrado(false)
      setPaginaAtual(1)
      setMaxResultados(size)
      const response = await userService.getAll(
        paginaAtual - 1,
        {
          nomeOuEmail: nomeOuEmail,
          size: size,
          idPerfil: perfil,
          sort: 'cadastradoEm,desc'
        }
      );
      if (response.content.length === 0) {
        setNadaEncontrado(true)
      }
      rolarParaOTopo();
      setUsers(response.content)
      setTotalPaginas(response.page.totalPages)

    } catch (error) {
      console.error("Erro ao buscar:", error);
      showMessage({ message: "Erro ao listar documentos", type: "error" })
    }
  };

  const onCheckFields = () => {
    if (nome === "" || email === "") {
      return true;
    }
    return false;
  }



  const handleEditar = async () => {
    setSubmitWasClicked(true);
    const invalidFields = onCheckFields()
    if (invalidFields) {
      showMessage({ message: "Preencha os campos obrigatórios", type: "error" })
      return;
    }


    const data: UserEditarDto = {
      nome: nome,
      email: email,
      role: Number(perfilAcesso)
    }
    try {
      setIsLoading(true);
      await userService.update(user?.id!, data)
      showMessage({ message: "Usuário editado com sucesso", type: "success" });

    } catch (error) {
      showMessage({ message: "Não foi possível editar usuário", type: "error" });
    } finally {
      setIsLoading(false);
      setIsOpenEditar(false);
    }
    buscarUsuarios(nomeOuEmail, paginaAtual, size, perfil)
  }

  return (

    <>
      <div className="text-[#3f3f3f]">
        <div ref={topoRef} ></div>

        <h1 className="text-3xl mb-2">Gerenciar usuários</h1>
        <hr className="text-[#685A22] mb-8" />

        <div className='mb-5 flex items-end w-full'>
          <div className="flex items-end w-full mr-2">

            <Input
              id='nomeOuEmail'
              value={nomeOuEmail}
              onChange={(e) => setNomeOuEmail(e.target.value)}
              type='text'
              label='Buscar por nome ou e-mail'
              className='w-full'
            />
            <Button
              onClick={() => { buscarUsuarios(nomeOuEmail, 1, size, perfil) }}
              className=" text-white "
              text='Buscar'
            />
          </div>
          <div className="flex gap-2">

            <div className="flex flex-col gap-1 w-40">

              <Select
                id="perfil"
                onChange={(e) => setPerfil(e.target.value)}
                options={optionsPerfil}
                label="Perfil"
                className="text-[#7e7d77] text-xs "
                value={perfil}
                hasDefaultValue={false}
              />
            </div>
            <div className="flex flex-col gap-1 w-40">

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
        </div>

        {users.length !== 0 && (<div className="overflow-x-auto border shadow-lg w-full border-[#c5c3b9]">
          <table className="w-full border-collapse text-center">

            {/* CABEÇALHO DA TABELA (Bege) */}
            <thead className="bg-[#E6E5DC] border-b border-[#c5c3b9]">
              <tr>
                <th className="p-4 border-r border-[#c5c3b9] text-[#4a4a4a] font-semibold w-auto">
                  #
                </th>
                <th className="p-4 border-r border-[#c5c3b9] text-[#4a4a4a] font-semibold w-2/5">
                  Nome
                </th>
                <th className="p-4 border-r border-[#c5c3b9] text-[#4a4a4a] font-semibold w-1/5">
                  E-mail
                </th>
                <th className="p-4 border-r border-[#c5c3b9] text-[#4a4a4a] font-semibold w-1/5">
                  Perfil
                </th>
                <th className="p-4 border-r border-[#c5c3b9] text-[#4a4a4a] font-semibold w-1/5">
                  Cadastrado em
                </th>
                <th className="p-4 border-r border-[#c5c3b9] text-[#4a4a4a] font-semibold w-auto">
                  Ações
                </th>
              </tr>
            </thead>

            {/* CORPO DA TABELA */}
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={index}
                  // A mágica das cores alternadas: pares ficam brancos, ímpares ficam bege clarinho
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#F2F1EC]'} border-b border-[#c5c3b9] hover:bg-[#e4e2d8] transition-colors`}
                >
                  <td className="p-4 border-r border-[#c5c3b9] text-[#555555] font-medium text-left">
                    {(maxResultados * (paginaAtual - 1)) + 1 + index}
                  </td>
                  <td className="p-4 border-r border-[#c5c3b9] text-[#666666] text-left">
                    {user.nome}
                  </td>
                  <td className="p-4 border-r border-[#c5c3b9] text-[#555555] font-medium">
                    {user.email}
                  </td>

                  <td className="p-4 border-r border-[#c5c3b9] text-[#777777] text-sm">
                    <div className={user.role === "ROLE_USER" ? "p-0.5 border rounded-xl " : "p-0.5 bg-[#3f3f3f] rounded-xl text-white"}>
                      {formartarRole(user.role!)}
                    </div>

                  </td>
                  <td className="p-4 border-r border-[#c5c3b9] text-[#777777] text-xs">
                    {formatarDataHora(user.cadastradoEm!)}
                  </td>
                  <td className="p-4 flex justify-evenly gap-1">

                    <button className="text-[#3f3f3f] hover:text-blue-700 transition-colors" title="Editar"
                      onClick={() => {
                        setUser(user)
                        setNome(user.nome)
                        setEmail(user.email)
                        setPerfilAcesso(optionsPerfil.find(opt => opt.optionLabel === formartarRole(user.role!))?.value!)
                        setIsOpenEditar(!isOpenEditar)

                      }}>
                      <PencilSquareIcon className="w-6 h-6 cursor-pointer"></PencilSquareIcon>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>)
        }

        {
          nadaEncontrado && (<div className='w-150 mx-auto bg-[#EBE9E1] h-60 flex flex-col justify-center text-2xl items-center border border-[#898989] opacity-30'>
            <div >Nenhum usuário encontrado</div>
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
                  buscarUsuarios(nomeOuEmail, paginaAtual - 1, size, perfil)
                  setPaginaAtual(paginaAtual - 1)
                }}
                className={"px-2 py-2 bg-[#E6E5DC] border border-[#c5c3b9] text-[#4a4a4a] hover:bg-[#d5d4cb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors disabled:hover:bg-[#E6E5DC]"}
              >
                <ChevronLeftIcon className='w-6 h-6'></ChevronLeftIcon>
              </button>
              <button
                onClick={() => {
                  buscarUsuarios(nomeOuEmail, paginaAtual - 1, size, perfil)
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
                onClick={() => { }}
                className={paginaAtual === 1 || paginaAtual === totalPaginas ? "hidden" : "px-4 py-2 bg-[#3f3f3f] border border-[#c5c3b9] text-white font-bold cursor-not-allowed"}
              >
                {paginaAtual}
              </button>


              <div className={paginaAtual === totalPaginas || paginaAtual === totalPaginas - 1 ? "hidden" : ' flex items-start text-[#3f3f3f] text-3xl'}>
                <p className=''>...</p>
              </div>
              <button
                onClick={() => {
                  buscarUsuarios(nomeOuEmail, totalPaginas, size, perfil)
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
                  buscarUsuarios(nomeOuEmail, paginaAtual + 1, size, perfil)
                  setPaginaAtual(paginaAtual + 1);
                }}
                className={"px-2 py-2 bg-[#E6E5DC] border border-[#c5c3b9] text-[#4a4a4a] hover:bg-[#d5d4cb] disabled:hover:bg-[#E6E5DC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"}
              >
                <ChevronRightIcon className='w-6 h-6'></ChevronRightIcon>
              </button>
            </div>
          </div>)}




      </div>

      <Dialog
        isOpen={isOpenEditar}
        onClose={() => { setIsOpenEditar(false) }}
        title='Editar usuário'
        onConfirm={handleEditar}
        isLoading={isLoading}
        onConfirmText="Salvar"

      >
        <div className='text-lg p-2 bg-white border border-dashed border-neutral-400 pb-10'>

          <div className="flex md:flex-row flex-col  w-full md:gap-2">

            <Input
              id="nome"
              onChange={(e) => { setNome(e.target.value) }}
              type="text"
              label="Nome"
              value={nome}
              className="w-full"
              showError={nome === "" && submitWasClicked}

            />
            <Input
              id="email"
              onChange={(e) => { setEmail(e.target.value) }}
              type="text"
              label="E-mail"
              value={email}
              className="w-full"
              showError={email === "" && submitWasClicked}
            />
          </div>

          <Select
            id="perfilAcesso"
            onChange={(e) => setPerfilAcesso(e.target.value)}
            options={optionsPerfil.filter(opt => opt.optionLabel !== "Todos")}
            label="Perfil de Acesso"
            value={perfilAcesso}
            hasDefaultValue={false}
          />

        </div>

      </Dialog>
    </>

  );
};

export default Usuarios;
