import {
    type ApiResponse,
    type LoginSchemaDTO,
    type RegisterSchemaDTO,
    type TokenPayload,
    type User
} from "./schemas";

import {BACKEND_ENDPOINTS} from "@/core/constants";
import {authKeys} from "@/core/services/auth/auth.keys";
import {api, queryClient} from "@/core/httpClient";

export const authServices = {
    register: async (request: RegisterSchemaDTO): Promise<User> => {
        const { repeat_password, ...fields } = request
        const response = await api.post<ApiResponse<User>>(BACKEND_ENDPOINTS.auth.register, fields)
        return response.data.data
    },
    login: async (request: LoginSchemaDTO): Promise<ApiResponse<null>> => {
        const response = await api.post(BACKEND_ENDPOINTS.auth.login, request);
        const userData: TokenPayload = await authServices.me();

        queryClient.setQueryData(authKeys.me, userData);
        return response.data;
    },
    me: async (): Promise<TokenPayload> => {
        const response = await api.get<ApiResponse<TokenPayload>>(BACKEND_ENDPOINTS.auth.me)
        return response.data.data
    },
    logout: async (): Promise<void> => await api.post(BACKEND_ENDPOINTS.auth.logout)

}
