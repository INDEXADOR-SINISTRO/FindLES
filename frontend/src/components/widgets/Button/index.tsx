import React, { ChangeEvent, ChangeEventHandler, MouseEventHandler, ReactEventHandler, useMemo } from 'react'

type ButtonProps = {
  onClick: MouseEventHandler | undefined;
  className?: string;
  isLoading?: boolean;
  text?: string;

};

const spin = <svg
    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>

const Button = ({
    onClick,
    className = "",
    isLoading = false,
    text  = "confirmar"
}:ButtonProps) => {

    const style = " bg-[#404040] text-white py-2 px-16 text-lg hover:bg-[#2b2b2b] transition-colors hover:cursor-pointer "
    const renderButton = useMemo(()=>{
        return (
                <button
                    onClick={onClick}
                    className={isLoading ? className + style + "cursor-not-allowed text-gray-400" : className + style + "cursor-pointer"}
                    disabled={isLoading}
                >
                    <div className='flex justify-center w-full'>
                        {isLoading && spin}
                        {text}
                    </div>
                </button>
        )
    },[
        onClick,
        className,
        isLoading,
        text
    ])



  return renderButton
}

export default Button