// core/services/inquilinos.service.ts
import {api, type ApiResponse, BACKEND_ENDPOINTS} from "@/core";
import type {
    Edificio, EdificioActualizarDTO,
    EdificioCrearDTO,
    EdificioFiltrosDTO
} from "./schemas";

const apiUrl = BACKEND_ENDPOINTS.edificios

export const EdificiosService = {

    get: async (params: EdificioFiltrosDTO) => {
        const { data } = await api.get<ApiResponse<Edificio[]>>(
            apiUrl, { params }
        );
        return data;
    },

    getById: async (id: number) => {
        const { data } = await api.get<ApiResponse<Edificio>>(
            `${apiUrl}/${id}`
        );
        return data;
    },
    create: async (payload: EdificioCrearDTO) => {
        console.log(payload)
        const { data } = await api.post<ApiResponse<Edificio>>(
            apiUrl,
            payload
        );
        return data;
    },

    update: async (id: number, payload: EdificioActualizarDTO) => {

        const { data } = await api.put<ApiResponse<Edificio>>(
            `${apiUrl}/${id}`,
            payload
        );
        return data;
    },

    delete: async (id: number) => {
        const { data } = await api.delete<ApiResponse<Edificio>>(
            `${apiUrl}/${id}`
        );
        return data;
    }
};
