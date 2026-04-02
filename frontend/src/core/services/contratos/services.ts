// core/services/contratos.service.ts
import type {
    ContratoCrearDTO,
    ContratoActualizarDTO,
    ContratoFiltrosDTO
} from "./schemas";
import {api, type ApiResponse, APP_ROUTES} from "@/core";
import type {Contratos} from "@/features/contratos/models";



export const ContratosService = {
    /**
     * Obtener contratos con filtros y paginación
     */
    get: async (params: ContratoFiltrosDTO): Promise<ApiResponse<Contratos[]>> => {
        const { data } = await api.get<ApiResponse<Contratos[]>>(APP_ROUTES.contratos, {
            params,
        });
        return data;
    },

    /**
     * Crear un nuevo contrato
     */
    create: async (payload: ContratoCrearDTO): Promise<ApiResponse<Contratos>> => {
        const { data } = await api.post<ApiResponse<Contratos>>(
            APP_ROUTES.contratos,
            payload
        );
        return data;
    },

    /**
     * Actualizar un contrato existente por ID
     */
    update: async (id: number, payload: ContratoActualizarDTO): Promise<ApiResponse<Contratos>> => {
        const { data } = await api.put<ApiResponse<Contratos>>(
            `${APP_ROUTES.contratos}/${id}`,
            payload
        );
        return data;
    },

    /**
     * Eliminar (o dar de baja) un contrato por ID
     */
    delete: async (id: number): Promise<ApiResponse<Contratos>> => {
        const { data } = await api.delete<ApiResponse<Contratos>>(
            `${APP_ROUTES.contratos}/${id}`
        );
        return data;
    }
};
