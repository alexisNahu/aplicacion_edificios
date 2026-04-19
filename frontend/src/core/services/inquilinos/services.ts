// core/services/inquilinos.service.ts
import {api, type ApiResponse, APP_ROUTES, BACKEND_ENDPOINTS} from "@/core";
import type {
    InquilinoCrearDTO,
    InquilinoActualizarDTO,
    InquilinoFiltrosDTO,
} from "./schemas";
import type {Inquilinos} from "@/features/inquilinos/models";

export const InquilinosService = {
    /**
     * Obtener listado de inquilinos con filtros y paginación
     * Retorna la respuesta paginada (data + total/page info)
     */
    get: async (params: InquilinoFiltrosDTO) => {
        const { data } = await api.get<ApiResponse<Inquilinos[]>>(
            BACKEND_ENDPOINTS.inquilinos,
            { params }
        );
        return data;
    },

    /**
     * Obtener un inquilino específico por ID
     */
    getById: async (id: number) => {
        const { data } = await api.get<ApiResponse<Inquilinos>>(
            `${BACKEND_ENDPOINTS.inquilinos}/${id}`
        );
        return data;
    },

    /**
     * Crear un nuevo inquilino en el sistema
     */
    create: async (payload: InquilinoCrearDTO) => {
        const { data } = await api.post<ApiResponse<Inquilinos>>(
            BACKEND_ENDPOINTS.inquilinos,
            payload
        );
        return data;
    },

    /**
     * Actualizar datos de un inquilino existente
     */
    update: async (id: number, payload: InquilinoActualizarDTO) => {
        console.log(BACKEND_ENDPOINTS.inquilinos)

        const { data } = await api.put<ApiResponse<Inquilinos>>(
            `${BACKEND_ENDPOINTS.inquilinos}/${id}`,
            payload
        );
        return data;
    },

    /**
     * Eliminar o desactivar un inquilino
     */
    delete: async (id: number) => {
        const { data } = await api.delete<ApiResponse<Inquilinos>>(
            `${BACKEND_ENDPOINTS.inquilinos}/${id}`
        );
        return data;
    }
};
