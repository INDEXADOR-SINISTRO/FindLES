import React, { ChangeEvent, useMemo } from 'react'

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
}:InputProps) => {
    const desabilitado = " text-gray-400 "
    const baseStyle = " w-full h-10 px-2 bg-[#EBEAE4] border border-gray-600 shadow-[2px_2px_5px_rgba(0,0,0,0.30)] focus:outline-none focus:ring-1 focus:ring-gray-600 "
    const style = disabled ? desabilitado + baseStyle + " text-gray-400 " : baseStyle
    const error = " text-red-500 "
    
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
            <div className={'flex flex-col ' + className} >
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
                        type={type}
                        className={showError ? (className + style + " border-red-500") : (className + style)}
                        placeholder={placeholder}
                    />
                    )}
                
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
        disabled
    ])



  return renderInput
}

export default Input