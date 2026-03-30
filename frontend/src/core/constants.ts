const baseURL: string = import.meta.env.PUBLIC_BACKEND_API;

export const BACKEND_ENDPOINTS = {
    auth: {
        login: `${baseURL}/auth/login`,
        register: `${baseURL}/auth/register`,
        logout: `${baseURL}/auth/logout`,
        me: `${baseURL}/auth/me`
    }
}
