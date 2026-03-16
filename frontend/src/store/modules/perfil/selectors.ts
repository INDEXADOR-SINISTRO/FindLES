import { RootState } from "@/store";


export const getPerfil = (
  state: RootState
): string | undefined => state.perfil.perfil;
