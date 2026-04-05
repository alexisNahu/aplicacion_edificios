export const getErrorMessage = (error: any) => {
    const statusCode = (error as any)?.response?.status;
    if (statusCode === 401) return 'Credenciales inválidas';
    if (statusCode === 403) return 'No tienes permisos';
    return 'Ocurrió un error inesperado';
};

