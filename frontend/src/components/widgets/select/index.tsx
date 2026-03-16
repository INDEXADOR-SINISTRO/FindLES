import React, { ChangeEvent, ChangeEventHandler, ReactEventHandler, useMemo } from 'react'

export type OptionType = {
    value: string;
    optionLabel: string;
}

type SelectProps = {
  id: string;
  value?: string;
  onChange: (event : ChangeEvent<HTMLSelectElement>)=>void;
  options?: OptionType[];
  showError?: boolean;
  className?: string;
  label?: string;
  name?: string;
  disabled?: boolean;

};

const Select = ({
    id,
    value = "",
    onChange,
    showError = false,
    className = "", 
    label,
    options = [],
    name,
    disabled = false,
}:SelectProps) => {
    const desabilitado = " text-gray-400 "  
    const style = disabled ? desabilitado + " p-[0.7rem] bg-white cursor-pointer shadow-md border rounded-md " : " p-[0.7rem] bg-white cursor-pointer shadow-md border rounded-md "
    const error = " text-red-500 "
    const renderSelect = useMemo(()=>{
        return (
            <div className={'flex flex-col ' + className}>
                { label && <label htmlFor={id} className={showError ? error : disabled ? desabilitado : ""}>{label}</label>}
                <select 
                    value={value}
                    onChange={onChange}
                    name={name} 
                    id={id}
                    disabled={disabled}
                    className={showError ? (className + style + " border-red-500") : (className + style)}
                >
                    <option disabled value="" >Selecione...</option>
                    {
                    
                    options.map((opt, index)=> <option key={index} value={opt.value}>{opt.optionLabel} </option>)
                    
                    }
                </select>
            </div>
        )
    },[
        id,
        value,
        onChange,
        showError,
        className,
        label
    ])



  return renderSelect
}

export default Select