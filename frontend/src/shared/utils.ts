import {stat} from "unstorage/drivers/utils/node-fs";

export const getErrorMessage = (error: any, conflictMsg?: string) => {
    const statusCode = error?.response?.status;
    const responseData = error?.response?.data;

    if (statusCode === 401) return 'Credenciales inválidas';
    if (statusCode === 403) return 'No tienes permisos';
    if (statusCode === 404) return 'No se encontro'
    if (statusCode === 409) {
        // Usa el mensaje del backend si existe, si no el que pasaste, si no uno genérico
        return responseData?.msg ?? conflictMsg ?? 'Conflicto con un registro existente';
    }
    return 'Ocurrió un error inesperado';
};
