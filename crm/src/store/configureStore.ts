import {configureStore} from "@reduxjs/toolkit";

import globalReducer from "./global/global.slice";
import {authApi} from "./auth/auth.api";
import {applicationsApi} from "./applications/applications.api";

export const store = configureStore({
    reducer: {
        global: globalReducer,
        [authApi.reducerPath]: authApi.reducer,
        [applicationsApi.reducerPath]: applicationsApi.reducer,
    },
    // @ts-ignore
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: true,
        immutableCheck: true,
    }).concat(
        [
            authApi.middleware,
            applicationsApi.middleware,
        ]
    )
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
