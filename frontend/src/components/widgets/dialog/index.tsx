"use client"; // importante para componentes com estado
import { XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

import loading from "@/assets/loading.png"
import Button from "../Button";

type DialogProps = {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  onConfirmText?: string;
  isLoading?: boolean;
};



export default function Dialog({ title, children, isOpen, onClose, onConfirm, onConfirmText = "Confirmar", isLoading=false}: DialogProps) {

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Fundo com blur */}
          <div className="absolute inset-0 bg-opacity-30 backdrop-blur-sm"></div>

          {/* Conteúdo do Dialog */}
          <div className="relative bg-white border border-secondary rounded-lg shadow-lg max-w-lg w-full h-screen md:h-auto p-4 z-10 flex flex-col">
            {/* Cabeçalho fixo */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{title}</h2>
              <button
                onClick={onClose}
                className="cursor-pointer text-gray-500 hover:text-black"
                disabled={isLoading}
              >
                <XMarkIcon className="w-8 h-8" />
              </button>
            </div>

            {/* Conteúdo com scroll */}
            <div className="flex-1 overflow-y-auto min-h-0 mb-4">
              {children}
            </div>

            {/* Rodapé fixo */}
            <div className="flex justify-end mt-auto pt-4">
              <Button
                onClick={onConfirm}
                className="bg-[#3F3E3E] hover:bg-emerald-500"
                isLoading={isLoading}
                text={onConfirmText}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}