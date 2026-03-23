import { createSlice, PayloadAction } from "@reduxjs/toolkit";




interface PerfilState {
  perfil?: string;
}

const initialState: PerfilState = {
  perfil: "user"
};

const perfilSlice = createSlice({
  name: "perfil",
  initialState,
  reducers: {
    setPerfil: (state, action: PayloadAction<string>) => {
      state.perfil = action.payload;
    },
    }
});

const { reducer: perfilReducer} = perfilSlice;

export const { setPerfil } =
  perfilSlice.actions;
export { perfilReducer };
