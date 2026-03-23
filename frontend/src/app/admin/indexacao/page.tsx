"use client";

import AreaDeUpload from "@/components/AreaUpload";
import Button from "@/components/widgets/Button";
import Input from "@/components/widgets/input";
import Select from "@/components/widgets/select";
import { userService } from "@/lib/services/usuario";
import apiClient from "@/lib/utils/axios";




const Indexacao = () => {


  async function nada (){
    try{
      await userService.create({email: "fw", nome: "gil", senha: "1234"})
    }catch(e){
      console.log("Erro")

    }
  }

  return (
 
    <>
    <div className="text-[#3f3f3f]">

      <h1 className="text-3xl mb-2">Anexar Documentos</h1>
      <hr className="text-[#685A22] mb-2"/>
      <p className="text-[#898989] text-l mb-4">Faça upload individual ou em lote. Formatos aceitos:  PDF</p>
      

      <AreaDeUpload
      onClick={()=>{console.log("submit")}}
      ></AreaDeUpload>

      <Select
      id="categoria"
      onChange={()=>{console.log("nada")}}
      options={[{value: "relatorio", optionLabel: "Relatório"}]}
      label="Categoria (Opcional)"
      className="mt-4"
      value="relatorio"
      />
    </div>
    </>
  );
};

export default Indexacao;
