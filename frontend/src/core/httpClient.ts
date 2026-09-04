import axios from 'axios'
import {QueryClient} from "@tanstack/react-query";
import {setupErrorInterceptor} from "./interceptors/errors.interceptor";

// Sin baseURL: BACKEND_ENDPOINTS (core/constants.ts) ya arma la URL completa
// a partir de PUBLIC_BACKEND_API. Setearlo acá también duplicaba el prefijo
// cuando PUBLIC_BACKEND_API es una ruta relativa (p. ej. "/api").
export const api = axios.create({
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
