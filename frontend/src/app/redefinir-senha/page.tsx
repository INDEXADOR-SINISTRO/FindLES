'use client'

import Button from '@/components/widgets/Button';
import Input from '@/components/widgets/input';
import { useSnackbar } from '@/components/widgets/snackbar';
import { userService } from '@/lib/services/usuario';
import { redefinirSenhaDto } from '@/types/user';
import Image from 'next/image';
import React, { Suspense, useState } from 'react'

import logo from "@/assets/logo_findLES_cor.png";
import { useRouter, useSearchParams } from 'next/navigation';

const RedefinirSenhaContent = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const { showMessage } = useSnackbar();
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [submitWasClicked, setSubmitWasClicked] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onCheckFields = () => {
    if (password === "" || confirmPassword === "") {
      showMessage({ message: "Preencha todos os campos", type: "error" });
      return true;
    }

    if (password !== confirmPassword) {
      showMessage({ message: "A confirmação está diferente da senha", type: "error" });
      return true;
    }

    return false;
  }

  const onSubmit = async () => {
    const invalidFields = onCheckFields();
    setSubmitWasClicked(true);

    if (invalidFields) {
      return;
    }

    if (!token) {
      showMessage({ message: "Token inválido ou ausente", type: "error" });
      return;
    }

    try {
      setIsLoading(true);

      const payload: redefinirSenhaDto = {
        password: password
      }

      const response = await userService.redefinirSenha(token, payload);

      showMessage({ message: response, type: "success" });
      push("/login");
    } catch (e) {
      const error = e as Error;
      showMessage({ message: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EBE9E1]">
      <div className="bg-white p-10 w-full shadow-[4px_4px_5px_rgba(0,0,0,0.40)] border border-[#898989] max-w-105">

        <Image
          alt="logo"
          src={logo}
          className="ml-auto mr-auto cursor-pointer w-40 h-16"
          onClick={() => push("/login")}
        />

        <h2 className="text-md font-medium text-center text-[#898989] mb-4">
          Redefinir senha
        </h2>

        <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
          <div className="mb-1">
            <Input
              id="senha"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
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
              onChange={(e) => setConfirmPassword(e.target.value)}
              label="Confirmar senha"
              value={confirmPassword}
              isPassword={true}
              showError={confirmPassword === "" && submitWasClicked}
            />
          </div>

          <div className="flex justify-center mb-4">
            <Button
              onClick={onSubmit}
              text="Redefinir"
              className="text-white"
              isLoading={isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

const RedefinirSenha = () => {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <RedefinirSenhaContent />
    </Suspense>
  );
}

export default RedefinirSenha;