import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

import config from "../../config";
import { headerConfig } from "../../helpers/headerConfig";

export type Application = {
    id: number;
    first_name: string;
    // last_name: string;
    // organization_name: string;
    phone_number: string;
    // email: string;
};

export type ApplicationsListResponse = Application[];

export type ApplicationsListParams = {
    page?: number;
    size?: number;
    [key: string]: unknown;
};

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

export const applicationsApi = createApi({
    reducerPath: 'applications/api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Applications"],
    endpoints: builder => ({
        getApplicationsList: builder.query<ApplicationsListResponse, ApplicationsListParams>({
            query: (params) => ({
                url: '/applications/list',
                method: 'GET',
                params,
            }),
            providesTags: ['Applications'],
        }),
    }),
});

export const {
    useGetApplicationsListQuery,
} = applicationsApi;
