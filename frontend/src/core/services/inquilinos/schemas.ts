import { z } from "zod";
import type {Inquilinos} from "@/features/inquilinos/models";

// ==========================================
// 1. ENUMS Y TIPOS BASE
// ==========================================

export const TipoIdentificacionEnum = z.enum([
    'Cedula',
    'Pasaporte',
    'Ruc',
    'Licencia'
]);

export type TipoIdentificacion = z.infer<typeof TipoIdentificacionEnum>;

// ==========================================
// 2. INTERFACES DE RESPUESTA (Modelos)
// Lo que recibes del GET
// ==========================================

// ==========================================
// 3. SCHEMAS DE VALIDACIÓN (ZOD)
// ==========================================

// --- SCHEMA PARA CREACIÓN ---
export const InquilinoCrearSchema = z.object({
    nombre_completo: z.string()
        .min(5, "Mínimo 5 caracteres")
        .max(60, "Máximo 60 caracteres"),
    status: z.boolean().default(true),
    telefono: z.string()
        .min(7, "El teléfono debe tener al menos 7 dígitos")
        .max(60),
    email: z.email("Correo electrónico inválido"),
    numero_identificacion: z.string()
        .min(5, "Mínimo 5 caracteres")
        .max(60),
    tipo_identificacion: TipoIdentificacionEnum,
});

// --- SCHEMA PARA ACTUALIZACIÓN ---
// Usamos .partial() para que el backend reciba solo lo que cambió
export const InquilinoActualizarSchema = InquilinoCrearSchema.partial();

// --- SCHEMA PARA FILTROS (Query Params) ---
export const InquilinoFiltrosSchema = z.object({
    nombre_completo: z.string().max(60).optional(),
    status: z.coerce.boolean().optional(),
    num_identificacion: z.string().optional(),
    tipo_identificacion: TipoIdentificacionEnum.optional(),
    page: z.coerce.number().int().min(1).default(1),
    page_size: z.coerce.number().int().min(1).max(100).default(10),
});

// ==========================================
// 4. TIPOS DERIVADOS (DTOs)
// ==========================================

export type InquilinoCrearDTO = z.infer<typeof InquilinoCrearSchema>;
export type InquilinoActualizarDTO = z.infer<typeof InquilinoActualizarSchema>;
export type InquilinoFiltrosDTO = z.infer<typeof InquilinoFiltrosSchema>;

/**
 * Respuesta paginada estándar
 */
export interface InquilinoPaginadoResponse {
    data: Inquilinos[];
    total: number;
    page: number;
    page_size: number;
}
