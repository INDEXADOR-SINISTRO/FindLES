"use client";

import Button from "@/components/widgets/Button";
import Input from "@/components/widgets/input";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useState } from "react";



const Cadastro = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [nome, setNome] = useState<string>("");
  return (

    <div className="min-h-screen flex items-center justify-center bg-[#EBE9E1]">

      <div className="bg-white p-10 w-full shadow-[4px_4px_5px_rgba(0,0,0,0.40)] border border-[#898989] max-w-[420px]">
        

        <h1 className="text-3xl font-medium text-center text-[#3F3E3E] ">
          FindLES
        </h1>
        <h2 className="text-md font-medium text-center text-[#898989] mb-4">
          Criar nova conta
        </h2>


        <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
          

          <div className="mb-1">
            
            <Input
                id="nome"
                type="text"
                onChange={(e)=>{setNome(e.target.value)}}
                label="Nome"
                value={nome}
            />
            
          </div>

          <div className="mb-1">
            
            <Input
                id="email"
                type="email"
                onChange={(e)=>{setEmail(e.target.value)}}
                label="E-mail"
                value={email}
            />
            
          </div>


          <div className="mb-1">
            <Input
                id="senha"
                type="password"
                onChange={(e)=>{setPassword(e.target.value)}}
                label="Senha"
                value={password}
            />
          </div>

          <div className="mb-8">
            <Input
                id="confirmarsenha"
                type="password"
                onChange={(e)=>{setConfirmPassword(e.target.value)}}
                label="Confirmar senha"
                value={confirmPassword}
            />
          </div>

          

        


          <div className="flex justify-center mb-4">    

            <Button
             onClick={()=>{console.log("nada")}}
             text="Criar conta"
            />

            
          </div>

          <div className="flex justify-center">
            <a href="/login" className="text-xs text-gray-500 underline hover:text-gray-700">
              Já tenho conta! Entrar
            </a>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Cadastro;
