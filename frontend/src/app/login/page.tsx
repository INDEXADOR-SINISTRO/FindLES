"use client";

import Button from "@/components/widgets/Button";
import Input from "@/components/widgets/input";
import { useSnackbar } from "@/components/widgets/snackbar";
import { authDto } from "@/types/user";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useContext, useEffect, useState } from "react";

import logo from "@/assets/logo_findLES_cor.png";
import { AuthContext } from "@/context/AuthContext";



const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [ isLoading,setIsLoading] = useState<boolean>(false);
  const {showMessage} = useSnackbar()
  const {push} = useRouter();
  const { signIn } = useContext(AuthContext);

  const onCheckFields = ()=>{
      if (email === "" || password === ""){
        return true;
      }
      return false;
    }
    
    const onSubmit = async()=>{
      
      
      const invalidFields = onCheckFields() 

      if(invalidFields){
        showMessage({ message: "Preencha todos os campos", type: "error" })
        return;
      }
      setIsLoading(true);
      const payload :authDto = {
        email: email,
        senha: password
      }
      try{
        await signIn(payload);
      }catch(e){
        const error = e as Error;
        showMessage({message:"E-mail ou senha incorretos.", type:"error"});
        
      }
    }


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

        <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
          
          <div className="mb-4">
            
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
                isPassword={true}
            />
          </div>

          <div className="flex justify-end mb-8">
            <a href="/recuperar-senha" className="text-xs text-gray-500 underline hover:text-gray-700">
              Esqueci minha senha
            </a>
          </div>

          <div className="flex justify-center mb-4">    
            <a href="/admin">
                <Button
                onClick={onSubmit}
                text="Entrar"
                className="text-white"
                />
            </a>
          </div>

          <div className="flex justify-center">
            <a href="/cadastrar" className="text-xs text-gray-500 underline hover:text-gray-700">
              Cadastrar-se
            </a>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Login;
