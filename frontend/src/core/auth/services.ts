import {
    type ApiResponse,
    type LoginSchemaDTO,
    type RegisterSchemaDTO,
    type TokenPayload,
    type User
} from "./schemas";
import {httpClient, queryClient} from "../httpClient";
import {authKeys} from "./auth.keys.ts";
import {BACKEND_ENDPOINTS} from "../constants.ts";

export const authServices = {
    register: async (request: RegisterSchemaDTO): Promise<User> => {
        const { repeat_password, ...fields } = request
        const response = await httpClient.post<ApiResponse<User>>(BACKEND_ENDPOINTS.auth.register, fields)
        return response.data.data
    },
    login: async (request: LoginSchemaDTO): Promise<TokenPayload> => {
        await httpClient.post(BACKEND_ENDPOINTS.auth.login, request);
        const userData: TokenPayload = await authServices.me();

        queryClient.setQueryData(authKeys.me, userData);
        return userData;
    },
    me: async (): Promise<TokenPayload> => {
        const response = await httpClient.get<ApiResponse<TokenPayload>>(BACKEND_ENDPOINTS.auth.me)
        return response.data.data
    },
    logout: async (): Promise<void> => await httpClient.post(BACKEND_ENDPOINTS.auth.logout)

}
