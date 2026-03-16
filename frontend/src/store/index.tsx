import { configureStore } from "@reduxjs/toolkit";

import { perfilReducer } from "./modules/perfil";

export const store = configureStore({
  reducer: {
    perfil: perfilReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export interface ThunkApiType<T> {
  // Campos opcionais para definir os tipos dos campos da thunkApi
  dispatch: AppDispatch;
  state: T;
}
