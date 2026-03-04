import {createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError} from "@reduxjs/toolkit/query/react";

import config from "../../config";
import {headerConfig} from "../../helpers/headerConfig";

export type RegisterRequest = {
    full_name: string
    email: string
    phone_number: string
    tin: string
    password: string
}

export type RegisterResponse = {
    id: number
    full_name: string
    email: string
    created_at: string
}

export type LoginRequest = {
    email: string
    password: string
}

export type TokenResponse = {
    access_token: string
    token_type: string
}

export type CurrentUser = Record<string, unknown>
export type UsersResponse = CurrentUser[]

// Базовый query
const baseQuery = fetchBaseQuery({
    baseUrl: config.apiUrl,
    prepareHeaders: (headers) => headerConfig(headers),
});

// Обертка для обработки 401 ошибок
const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    
    // Если получили 401 статус - разлогиниваем пользователя
    if (result.error && result.error.status === 401) {
        localStorage.removeItem('svcard_token');
        // Редирект на страницу логина
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
    }
    
    return result;
};

export const authApi = createApi({
    reducerPath: 'auth/api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ["User"],
    endpoints: builder => ({
		register: builder.mutation<RegisterResponse, RegisterRequest>({
			query: body => ({
				url: '/users/register',
				method: 'POST',
				body,
			}),
		}),
		login: builder.mutation<TokenResponse, LoginRequest>({
			query: body => ({
				url: '/users/login',
				method: 'POST',
				body,
			}),
		}),
		getMe: builder.query<CurrentUser, void>({
			query: () => ({
				url: '/users/me',
				method: 'GET',
			}),
		}),
        getUsers: builder.query<UsersResponse, void>({
            query: () => ({
                url: '/users/',
                method: 'GET',
            }),
        }),
		logout: builder.mutation<void, void>({
			query: () => ({
				url: '/users/logout',
				method: 'POST',
			}),
		}),
	}),
})

export const {
    useRegisterMutation,
    useLoginMutation,
    useGetMeQuery,
    useGetUsersQuery,
    useLogoutMutation
} = authApi;