import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type AppState = {
	language: string
}

const initialState: AppState = {
	language: 'ru',
}

const appSlice = createSlice({
	name: 'app',
	initialState,
	reducers: {
		setLanguage(state, action: PayloadAction<string>) {
			state.language = action.payload
		},
	},
})

export const { setLanguage } = appSlice.actions
export default appSlice.reducer
