import { api, type ApiResponse, APP_ROUTES } from "@/core";
import type {
    DepartamentoCrearDTO,
    DepartamentoActualizarDTO,
    DepartamentoFiltrosDTO
} from "./schemas";
import type {Departamentos} from "@/features/departamentos/models"; // Ajustá la ruta según tu carpeta de schemas

export const DepartamentosService = {
    /**
     * Obtener departamentos con filtros (nombre_edificio, piso, etc.) y paginación
     */
    get: async (params: DepartamentoFiltrosDTO) => {
        // Axios convierte el objeto en Query Params (?nombre_edificio=Torre&piso=1...)
        const { data } = await api.get<ApiResponse<Departamentos[]>>(
            APP_ROUTES.departamentos,
            { params }
        );
        return data;
    },

    /**
     * Crear un nuevo departamento
     */
    create: async (payload: DepartamentoCrearDTO) => {
        const { data } = await api.post<ApiResponse<Departamentos>>(
            APP_ROUTES.departamentos,
            payload
        );
        return data;
    },

    /**
     * Actualizar un departamento existente por ID
     */
    update: async (id: number, payload: DepartamentoActualizarDTO) => {
        const { data } = await api.put<ApiResponse<Departamentos>>(
            `${APP_ROUTES.departamentos}/${id}`,
            payload
        );
        return data;
    },

    /**
     * Eliminar un departamento por ID
     */
    delete: async (id: number) => {
        const { data } = await api.delete<ApiResponse<Departamentos>>(
            `${APP_ROUTES.departamentos}/${id}`
        );
        return data;
    }
};
