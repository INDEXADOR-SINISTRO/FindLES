"use client";

import AreaDeUpload from "@/components/AreaUpload";
import Button from "@/components/widgets/Button";
import Input from "@/components/widgets/input";
import Select, { OptionType } from "@/components/widgets/select";
import { userService } from "@/lib/services/usuario";
import apiClient from "@/lib/utils/axios";
import { CategoriaList, StatusDocumentList } from "@/types/documento";
import { useState } from "react";




const Indexacao = () => {

  const [categoria,setCategoria] = useState<number>();




  const optionsCategoria: OptionType[] = CategoriaList.map(
    (item) => ({
      value: String(item.value),
      optionLabel: item.descricao
    })
  );
 

  return (
 
    <>
    <div className="text-[#3f3f3f]">

      <h1 className="text-3xl mb-2">Anexar Documentos</h1>
      <hr className="text-[#685A22] mb-2"/>
      <p className="text-[#898989] text-l mb-4">Faça upload individual ou em lote. Formatos aceitos:  PDF</p>
      

      <AreaDeUpload
      idCategoria={categoria}
      ></AreaDeUpload>

      <Select
      id="categoria"
      onChange={(e)=>setCategoria(Number(e.target.value))}
      options={optionsCategoria}
      label="Categoria (Opcional)"
      className="mt-4"
      value={String(categoria)}
      />
    </div>
    </>
  );
};

export default Indexacao;
