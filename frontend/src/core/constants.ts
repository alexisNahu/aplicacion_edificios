import type {ContratoFiltrosDTO} from "@/core/services/contratos/schemas";

const baseURL: string = import.meta.env.PUBLIC_BACKEND_API;

export const BACKEND_ENDPOINTS = {
    auth: {
        login: `${baseURL}/auth/login`,
        register: `${baseURL}/auth/register`,
        logout: `${baseURL}/auth/logout`,
        me: `${baseURL}/auth/me`
    },
    contratos: `${baseURL}/contratos`,
    contratos_crear: `${baseURL}/contratos/crear`,
    inquilinos: `${baseURL}/inquilinos`,
    edificios: `${baseURL}/edificios`
}


export const APP_ROUTES = {
    auth: {
        login: `/auth/login`,
        register: '/auth/register',
        logout: '/auth/logout'
    },
    contratos: '/contratos',
    edificios: '/edificios',
    contratos_crear: '/contratos/crear',
    contratos_listar: '/contratos/listar',
    contratos_editar: '/contratos/editar',
    contratos_eliminar: '/contratos/eliminar',

    inquilinos: '/inquilinos',
    departamentos: '/departamentos',
}
