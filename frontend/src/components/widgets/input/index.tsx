import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import React, { ChangeEvent, KeyboardEvent, useMemo, useState } from 'react'

type InputProps = {
  id: string;
  value?: string;
  checked?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  showError?: boolean;
  type: string;
  className?: string;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  isPassword?: boolean;
  maxCaracteres?: number;
};

const Input = ({
  id,
  value = "",
  checked = false,
  onChange,
  onKeyDown,
  showError = false,
  type,
  className = "",
  placeholder,
  label,
  disabled = false,
  isPassword = false,
  maxCaracteres = undefined
}: InputProps) => {
  const desabilitado = " text-gray-400 ";
  const baseStyle = " w-full h-10 px-2 bg-[#EBEAE4] border shadow-[2px_2px_5px_rgba(0,0,0,0.30)] focus:outline-none focus:ring-1 focus:ring-gray-600 ";
  const style = disabled ? desabilitado + baseStyle + " text-gray-400 " : baseStyle;
  const error = " text-red-500 ";
  const [escondido, setEscondido] = useState<string>("password");

  const renderInput = useMemo(() => {
    if (type === 'checkbox') {
      return (
        <div className={'flex items-center gap-2 ' + className}>
          <label
            htmlFor={id}
            className={`font-medium relative inline-flex items-center cursor-pointer ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <input
              id={id}
              type="checkbox"
              checked={checked}
              disabled={disabled}
              onChange={onChange as (e: ChangeEvent<HTMLInputElement>) => void}
              onKeyDown={onKeyDown as ((e: KeyboardEvent<HTMLInputElement>) => void) | undefined}
              className="sr-only"
            />

            <span className={`w-10 h-6 rounded-full transition-colors ${checked ? 'bg-blue-500' : 'bg-[#3f3f3f]'}`}></span>

            <span className={`absolute left-0 top-0 m-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
          </label>

          {label && (
            <label
              htmlFor={id}
              className={showError ? error : disabled ? desabilitado : "text-sm"}
            >
              {label}
            </label>
          )}
        </div>
      );
    }

    return (
      <div className={'flex flex-col relative ' + className}>
        {label && (
          <label
            htmlFor={id}
            className={showError ? error : disabled ? desabilitado : "font-medium"}
          >
            {label}
          </label>
        )}

        {type === 'textarea' ? (
          <textarea
            id={id}
            value={value}
            disabled={disabled}
            onChange={onChange}
            onKeyDown={onKeyDown as ((e: KeyboardEvent<HTMLTextAreaElement>) => void) | undefined}
            className={showError ? (className + style + error) : (className + style)}
          />
        ) : (
          <input
            value={value}
            id={id}
            maxLength={maxCaracteres}
            disabled={disabled}
            onChange={onChange}
            onKeyDown={onKeyDown as ((e: KeyboardEvent<HTMLInputElement>) => void) | undefined}
            type={isPassword ? escondido : type}
            className={showError ? (className + style + " border-red-500") : (className + style)}
            placeholder={placeholder}
          />
        )}

        <div className='absolute right-4 top-8'>
          <button
            tabIndex={-1}
            onClick={(e) => {
              e.preventDefault();

              if (escondido === "text") {
                setEscondido("password");
              } else {
                setEscondido("text");
              }
            }}
          >
            {isPassword && (
              escondido === "password" ? (
                <EyeSlashIcon className={showError ? "text-red-500 w-6 h-6 cursor-pointer" : 'w-6 h-6 cursor-pointer'} />
              ) : (
                <EyeIcon className={showError ? "text-red-500 w-6 h-6 cursor-pointer" : 'w-6 h-6 cursor-pointer'} />
              )
            )}
          </button>
        </div>
      </div>
    );
  }, [
    id,
    value,
    checked,
    onChange,
    onKeyDown,
    showError,
    type,
    className,
    placeholder,
    label,
    disabled,
    isPassword,
    escondido,
    maxCaracteres
  ]);

  return renderInput;
}

export default Input;