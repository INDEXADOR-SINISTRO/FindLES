import { useRef, useEffect } from "react";

// TODO: corrigir o tipo
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const usePrevious = (value: any) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};
