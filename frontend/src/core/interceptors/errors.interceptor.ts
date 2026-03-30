import type { AxiosError, AxiosInstance } from "axios";

export const setupErrorInterceptor = (axiosInstance: AxiosInstance) => {
    axiosInstance.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {
            if (error.response) {
                const { status, data } = error.response;
                const errorMessage = (data as any)?.detail || (data as any)?.error || "Error inesperado";

                switch (status) {
                    case 401:
                        console.error("🚫 Sesión expirada o inválida.");
                        if (!window.location.pathname.includes("/login")) {
                            window.location.href = "/login";
                        }
                        break;
                    case 403:
                        console.error("🛑 Forbidden: Revisa los permisos o el CSRF.");
                        break;
                    case 400:
                        console.error("⚠️ Datos inválidos enviados al servidor:", data);
                        break;
                    case 500:
                        console.error("🔥 Error interno en el servidor de Django.");
                        break;
                    default:
                        console.error(`❌ Error ${status}:`, errorMessage);
                }
            } else if (error.request) {
                console.error("🌐 No hay respuesta del servidor. ¿Django está corriendo?");
            }

            return Promise.reject(error);
        }
    );
};
