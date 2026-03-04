import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import config from '@/config'

export const authApi = createApi({
	reducerPath: 'authApi',
	baseQuery: fetchBaseQuery({
		baseUrl: config.baseUrl,
		prepareHeaders: headers => {
			return headers
		},
	}),
	endpoints: builder => ({}),
})

export const {} = authApi
