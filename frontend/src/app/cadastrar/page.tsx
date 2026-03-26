"use client";

import Button from "@/components/widgets/Button";
import Input from "@/components/widgets/input";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useState } from "react";

import logo from "@/assets/logo_findLES_cor.png";
import { useSnackbar } from "@/components/widgets/snackbar";
import { UserDto } from "@/types/user";
import { userService } from "@/lib/services/usuario";

const Cadastro = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [nome, setNome] = useState<string>("");

  
  const [submitWasClicked,setSubmitWasClicked] = useState<boolean>(false)

  const {showMessage} = useSnackbar();

  const onCheckFields = ()=>{
      if (nome === "" || password === "" || confirmPassword === "" || email === "" ){
        showMessage({ message: "Preencha todos os campos ", type: "error" })
        return true;
      }
      if(password !== confirmPassword){
        showMessage({ message: "A confirmação está diferente da senha ", type: "error" })
        return true;
      }
      return false;
    }

  const {push} = useRouter();


  const onSubmit = async()=>{
      
      
      const invalidFields = onCheckFields()

      setSubmitWasClicked(true);
      if(invalidFields){
        return;
      }

      const payload :UserDto = {
        nome: nome,
        email: email,
        senha: password
      }
      
      try{
        await userService.create(payload)
        showMessage({message: "Usuário cadastrado", type: "success"})
        push("/login")
       
      }catch(e){
        const error = e as Error;
        showMessage({ message: error.message || "Erro ao cadastrar usuário", type: "error"})
        
      }
      
   
    } 



  return (

    <div className="min-h-screen flex items-center justify-center bg-[#EBE9E1]">

      <div className="bg-white p-10 w-full shadow-[4px_4px_5px_rgba(0,0,0,0.40)] border border-[#898989] max-w-105">
        
      <Image
          alt="logo"
          src={logo}
          className="ml-auto mr-auto cursor-pointer w-40 h-16  "
          onClick={() => push("/login")}
      />
        {/*<h1 className="text-3xl font-medium text-center text-black">
          FindLES
        </h1>*/}
        <h2 className="text-md font-medium text-center text-[#898989] mb-4">
          Criar nova conta
        </h2>


        <form className="flex flex-col" onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
          
        }}>
          

          <div className="mb-1">
            
            <Input
                id="nome"
                type="text"
                onChange={(e)=>{setNome(e.target.value)}}
                label="Nome"
                value={nome}
                showError={nome === "" && submitWasClicked}
            />
            
          </div>

          <div className="mb-1">
            
            <Input
                id="email"
                type="email"
                onChange={(e)=>{setEmail(e.target.value)}}
                label="E-mail"
                value={email}
                showError={email === "" && submitWasClicked}
            />
            
          </div>


          <div className="mb-1">
            <Input
                id="senha"
                type="password"
                onChange={(e)=>{setPassword(e.target.value)}}
                label="Senha"
                value={password}
                isPassword={true}
                showError={password === "" && submitWasClicked}
            />
          </div>

          <div className="mb-8">
            <Input
                id="confirmarsenha"
                type="password"
                onChange={(e)=>{setConfirmPassword(e.target.value)}}
                label="Confirmar senha"
                value={confirmPassword}
                isPassword={true}
                showError={confirmPassword === "" && submitWasClicked}
            />
          </div>

          

        


          <div className="flex justify-center mb-4">    

            <Button
             onClick={()=>{}}
             text="Criar conta"
             className="text-white"
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
