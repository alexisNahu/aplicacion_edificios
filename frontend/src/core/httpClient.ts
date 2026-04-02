import axios from 'axios'
import {QueryClient} from "@tanstack/react-query";
import {setupErrorInterceptor} from "./interceptors/errors.interceptor";

export const api = axios.create({
    baseURL: import.meta.env.PUBLIC_BACKEND_API,
    withCredentials: true
})

setupErrorInterceptor(api)

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});
