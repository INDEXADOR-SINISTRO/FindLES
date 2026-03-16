import { useState, useEffect } from "react";

type ResponsiveSize = "sm" | "md" | "lg" | "xl" | "2xl";

function useResponsiveDetect(): ResponsiveSize {
  const [responsiveSize, setResponsiveSize] = useState<ResponsiveSize>("xl");

  useEffect(() => {
    function handleResize() {
      const windowWidth = window.innerWidth;

      if (windowWidth >= 1536) {
        setResponsiveSize("2xl");
      } else if (windowWidth >= 1280) {
        setResponsiveSize("xl");
      } else if (windowWidth >= 1024) {
        setResponsiveSize("lg");
      } else if (windowWidth >= 768) {
        setResponsiveSize("md");
      } else {
        setResponsiveSize("sm"); // Define um valor padrão para telas menores que 640px
      }
    }

    // Adiciona um listener para atualizar o estado quando a janela for redimensionada
    window.addEventListener("resize", handleResize);

    // Chama a função handleResize uma vez para definir o estado inicial
    handleResize();

    // Remove o listener quando o componente é desmontado
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return responsiveSize;
}

export default useResponsiveDetect;
