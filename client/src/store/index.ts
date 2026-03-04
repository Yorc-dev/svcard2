import { configureStore } from '@reduxjs/toolkit'

import appReducer from '@/store/slices/appSlice'
import { applicationsApi } from '@/store/slices/applications'
import { authApi } from '@/store/slices/auth'

export const store = configureStore({
	reducer: {
		app: appReducer,
			[applicationsApi.reducerPath]: applicationsApi.reducer,
		[authApi.reducerPath]: authApi.reducer,
	},
	middleware: getDefaultMiddleware =>
			getDefaultMiddleware().concat(applicationsApi.middleware, authApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
