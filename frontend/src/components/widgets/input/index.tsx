import { EyeDropperIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import React, { ChangeEvent, useMemo, useState } from 'react'

type InputProps = {
  id: string;
  value?: string;
  checked?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=> void;
  showError?: boolean;
  type: string;
  className?: string;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  isPassword?: boolean;
};

const Input = ({
    id,
    value = "",
    checked = false,
    onChange,
    showError = false,
    type,
    className = "", 
    placeholder,
    label,
    disabled = false,
    isPassword = false,
}:InputProps) => {
    const desabilitado = " text-gray-400 "
    const baseStyle = " w-full h-10 px-2 bg-[#EBEAE4] border border-gray-600 shadow-[2px_2px_5px_rgba(0,0,0,0.30)] focus:outline-none focus:ring-1 focus:ring-gray-600 "
    const style = disabled ? desabilitado + baseStyle + " text-gray-400 " : baseStyle
    const error = " text-red-500 "
    const [escondido,setEscondido] = useState<string>("password");
    
    const renderInput = useMemo(()=>{
        // checkbox personalizado
        if (type === 'checkbox') {
          return (
            <div className={'flex items-center gap-2 ' + className}>
              <label htmlFor={id} className={`relative inline-flex items-center cursor-pointer ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
                <input
                  id={id}
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={onChange as (e: ChangeEvent<HTMLInputElement>) => void}
                  className="sr-only"
                />
                {/* track */}
                <span className={`w-10 h-6  rounded-full transition-colors ${checked ? 'bg-blue-500' : 'bg-gray-200'}`}></span>
                {/* thumb */}
                <span className={`absolute left-0 top-0 m-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
              </label>
              {label && <label htmlFor={id} className={showError ? error : disabled ? desabilitado : "text-sm"}>{label}</label>}
            
            </div>
          )
        }

        return (
            <div className={'flex flex-col relative ' + className} >
                { label && <label htmlFor={id} className={showError ? error : disabled ? desabilitado : ""}>{label}</label>}
                {type === 'textarea' ? (
                    <textarea
                        id={id}
                        value={value}
                        disabled={disabled}
                        onChange={onChange}
                        className={showError ? (className + style + error) : (className + style)}
                    />
                    ) : (
                    <input
                        value={value}
                        id={id}
                        disabled={disabled}
                        onChange={onChange}
                        type={isPassword ? escondido : type}
                        className={showError ? (className + style + " border-red-500") : (className + style)}
                        placeholder={placeholder}
                    />
                    )}
                    <div className='absolute right-4 top-8'>
                    <button
                    tabIndex={-1}
                    onClick={(e)=>{
                      e.preventDefault()
                      if (escondido === "text"){
                        setEscondido("password")
                      }else{
                        setEscondido("text")
                      }
                    }}
                    >
                      { isPassword && (
                          escondido === "password" ?
                            <EyeSlashIcon className='w-6 h-6 cursor-pointer'></EyeSlashIcon>
                          : <EyeIcon className='w-6 h-6 cursor-pointer'></EyeIcon>
                      )
                        
                      }
                    </button>
                    
                    </div>
                
            </div>
        )
    },[
        id,
        value,
        checked,
        onChange,
        showError,
        type,
        className,
        placeholder,
        label,
        disabled,
        isPassword,
        escondido
    ])



  return renderInput
}

export default Input