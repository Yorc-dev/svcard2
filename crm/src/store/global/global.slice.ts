import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface IGlobalState {
  language: string,
  sidebarShow: boolean,
  sidebarUnfoldable: boolean,
  theme: string
}

const initialState: IGlobalState = {
  language: 'ky',
  sidebarShow: true,
  sidebarUnfoldable: false,
  theme: 'light'
};

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload
    },
    setSidebarShow: (state, action: PayloadAction<boolean>) => {
      state.sidebarShow = action.payload
    },
    setSidebarUnfoldable: (state, action: PayloadAction<boolean>) => {
      state.sidebarUnfoldable = action.payload
    },
    setTheme: (state, action: PayloadAction<string>) => {
      state.theme = action.payload
    }
  }
});

export const { setLanguage, setSidebarShow, setSidebarUnfoldable, setTheme } = globalSlice.actions;
export default globalSlice.reducer;
