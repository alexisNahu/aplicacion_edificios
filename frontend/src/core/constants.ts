import type {ContratoFiltrosDTO} from "@/core/services/contratos/schemas";

const baseURL: string = import.meta.env.PUBLIC_BACKEND_API;

export const BACKEND_ENDPOINTS = {
    auth: {
        login: `${baseURL}/auth/login`,
        register: `${baseURL}/auth/register`,
        logout: `${baseURL}/auth/logout`,
        me: `${baseURL}/auth/me`
    }
}


export const APP_ROUTES = {
    auth: {
        login: `/auth/login`,
        register: '/auth/register',
        logout: '/auth/logout'
    },
    contratos: '/contratos',
    inquilinos: '/inquilinos',
    departamentos: '/departamentos'
}
