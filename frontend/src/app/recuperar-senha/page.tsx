"use client";

import Button from "@/components/widgets/Button";
import Input from "@/components/widgets/input";
import { useSnackbar } from "@/components/widgets/snackbar";
import { ArrowLeftIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

import Link from "next/link";

import { useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useState } from "react";

import logo from "@/assets/logo_findLES_cor.png";



const Recover = () => {
  const [email, setEmail] = useState<string>("");
  const { showMessage } = useSnackbar();
  const {push} = useRouter();
  return (
 
    <div className="min-h-screen flex items-center justify-center bg-[#EBE9E1]">
      
      
      <div className="bg-white p-10 w-full shadow-[4px_4px_5px_rgba(0,0,0,0.40)] border border-[#898989] max-w-105">
        
        <Image
            alt="logo"
            src={logo}
            className="ml-auto mr-auto cursor-pointer w-40 h-16 "
            onClick={() => push("/login")}
        />
        {/*<h1 className="text-3xl font-medium text-center text-black">
          FindLES
        </h1>*/}

        <h2 className="text-md font-medium text-center text-[#898989] mb-4">
          Recuperar senha
        </h2>

        <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>


          <div className="flex items-stretch border border-gray-400 mb-8">
          
          <div className="w-3 bg-gray-300 shrink-0"></div>
          
          <div className="p-4 text-sm text-gray-700 font-medium leading-relaxed flex gap-2">
             Informe o e-mail da sua conta para receber o link de recuperação.
          </div>
        </div>
          
          <div className="mb-4">
            
            <Input
                id="email"
                type="email"
                onChange={(e)=>{setEmail(e.target.value)}}
                label="E-mail cadastrado"
                value={email}
            />
            
          </div>

         

          <div className="flex justify-center mb-4">    

            <Button
             onClick={()=>{showMessage({ message: "Não implementado", type: "warning" })}}
             text="Enviar"
             className="text-white"
            />
          </div>

          <div className="flex justify-center">
            <a href="/login" className="text-xs text-gray-500 underline hover:text-gray-700 flex items-center gap-1">
               <ArrowLeftIcon className="w-2.5 h-2.5"></ArrowLeftIcon> voltar ao login
            </a>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Recover;
