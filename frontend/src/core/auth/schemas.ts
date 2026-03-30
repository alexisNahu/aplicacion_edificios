import {z} from 'zod'

export const RegisterSchema = z.object({
    username: z.string().min(8,"8 characteres minimo"),
    first_name: z.string().min(1, "Campo obligatorio"),
    last_name: z.string().min(1, "Campo obligatorio"),
    email: z.email("Formato incorrecto").min(1, "El email es requerido"),
    password: z.string().min(8, "Minimo 8 caracteres"),
    repeat_password: z.string(),
}).refine((data) => data.password === data.repeat_password, {
    message: "Las contraseñas no coinciden",
    path: ['repeat_password']
})

export const LoginSchema = z.object({
    username: z.string().min(1, 'Campo obligatorio'),
    password: z.string().min(1, 'Campo obligatorio')
})

export type RegisterSchemaDTO = z.infer<typeof RegisterSchema>
export type LoginSchemaDTO = z.infer<typeof LoginSchema>


export type Role = 'admin' | 'viewer'

export interface TokenPayload {
    id: string,
    username: string,
    exp: Date
}

export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    is_staff: boolean;
    is_superuser: boolean;
    date_joined: string;
    last_login: string | null;
}

export interface ApiResponse<T> {
    msg: string,
    data: T,
    status_code: number
}

