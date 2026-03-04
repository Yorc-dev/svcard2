import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import config from '@/config'

export type CreateApplicationRequest = {
	first_name: string
	phone_number: string
}

export const applicationsApi = createApi({
	reducerPath: 'applicationsApi',
	baseQuery: fetchBaseQuery({ baseUrl: config.baseUrl }),
	endpoints: builder => ({
		createApplication: builder.mutation<unknown, CreateApplicationRequest>({
			query: body => ({
				url: '/applications/create',
				method: 'POST',
				body,
			}),
		}),
	}),
})

export const { useCreateApplicationMutation } = applicationsApi
