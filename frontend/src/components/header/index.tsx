"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";

import { ChevronUpIcon } from "@heroicons/react/24/solid";
import useResponsiveDetect from "@/hooks/useResponsiveDetect";
import logo from "@/assets/logo_FindLES.png";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { getPerfil } from "@/store/modules/perfil/selectors";
import { setPerfil } from "@/store/modules/perfil";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { Route } from "@mui/icons-material";

export const Header = ({ titulo }: { titulo: string }) => {
  const [isCollapside, setIsCollapside] = useState<boolean>(false);
  const pathname = usePathname();

  const responsiveSize = useResponsiveDetect();

  const perfil = useSelector(getPerfil);
  const dispatch = useAppDispatch()

  const { push } = useRouter();


  const usuario = true;

  /*const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const novoValor = e.target.value;
    setCookie(PERFIL_ATIVO, novoValor);
    dispatch(authActions.changePerfilAtivo(novoValor));
    push(ROUTES.PRIVATE.ESTAGIOS.ROOT);
  };

  const logout = async () => {
    removeAllCookies();
    window.location.reload();

    push("/");
  };

  useEffect(() => {
    setUsuario(getUser());
  }, []);*/


  return (
    <div className="relative">
      <div
        className={
          " top-0  w-screen  bg-[#3F3E3E] flex flex-col lg:flex-row  items-start z-40 lg:fixed"
        }
      >
        <Image
            alt="logo"
            src={logo}
            className="ml-20 cursor-pointer w-32 h-12 "
            onClick={() => push("/busca")}
        />
        

        
        {((!isCollapside && responsiveSize === "sm") ||
          responsiveSize !== "sm") && (
            <>

             {/* <p className="text-white font-bold py-2 lg:ml-20 text-2xl">
                {titulo}
              </p>*/}
            </>
          )}
        <div className="ml-auto mr-auto flex text-[#898989] text-xl ">
          <div className={ pathname.includes("busca") ? " text-white font bold border-t-4 py-2 px-4 border-[#cecccc] hover:cursor-pointer bg-taupe-500" : "transition-all duration-300 ease-in-out border-t-4 py-2 px-4 hover:border-taupe-500 border-[#3f3f3f]  hover:cursor-pointer hover:bg-taupe-500 hover:text-white"}>
            <Link className="w-full h-full"
              href="/busca"
            >
              Busca
            </Link>
          </div>
          <div className={pathname.includes("admin") ? " text-white font bold border-t-4 py-2 px-4 border-[#cecccc] hover:cursor-pointer bg-taupe-500" : " transition-all duration-300 ease-in-out border-t-4 py-2 px-4 hover:border-taupe-500 border-[#3f3f3f]  hover:cursor-pointer hover:bg-taupe-500 hover:text-white "}>
            <Link className="w-full h-full"
              href="/admin/indexacao"
            >
              Admin
            </Link>


          </div>
        </div>
        {usuario && (
          <div className="flex gap-3 items-center md:justify-center lg:absolute right-28 mt-2 mb-2">
            <div>
              <p className="text-white">Olá, usuário</p>

            </div>
            <a href="/login">
              <button
                className="flex items-center justify-center gap-1 h-8 rounded-md cursor-pointer text-white hover:opacity-60 p-2"
                onClick={() => console.log("nada")}
              >
                <p className="border-b-2">Sair</p>
              </button>
            </a>
            {responsiveSize === "sm" && (
              <button
                className="absolute right-4 cursor-pointer rounded-md w-8 h-8 flex justify-center items-center"
                onClick={() => setIsCollapside((prevState) => !prevState)}
              >
                <ChevronUpIcon
                  className={`w-6 h-6 text-white ${isCollapside && "transform rotate-180"
                    }`}
                />
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default Header;
