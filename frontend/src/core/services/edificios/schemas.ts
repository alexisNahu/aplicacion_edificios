import { z } from "zod";

// ==========================================
// 1. INTERFACES DE MODELO (Entidades)
// ==========================================

export interface Edificio {
    id: number;
    nombre: string;
    descripcion: string | null;
    status: boolean;
    direccion: string | null;
}

// ==========================================
// 2. SCHEMAS DE ZOD (Validación y DTOs)
// ==========================================

// Campos base alineados con el backend (Pydantic)
const edificioFields = {
    nombre: z.string()
        .min(5, "El nombre debe tener al menos 5 caracteres")
        .max(50, "Máximo 50 caracteres"),
    descripcion: z.string()
        .max(100, "Máximo 100 caracteres")
        .optional()
        .nullable(),
    direccion: z.string()
        .max(100, "Máximo 100 caracteres")
        .optional()
        .nullable(),
    status: z.boolean().default(true),
};

// --- SCHEMA PARA CREACIÓN ---
export const EdificioCrearSchema = z.object(edificioFields);

// --- SCHEMA PARA ACTUALIZACIÓN ---
// Nota: Tu backend permite nombre de 4 caracteres en el update,
// pero mantendremos la consistencia de los campos base o aplicamos el override:
export const EdificioActualizarSchema = z.object({
    ...edificioFields,
    nombre: z.string().min(4).max(20).optional(), // Override específico del backend
}).partial();

// --- SCHEMA PARA FILTROS DE BÚSQUEDA ---
export const EdificioFiltrosSchema = z.object({
    id: z.coerce.number().int().optional(),
    nombre: z.string().max(50).optional(),
    status: z.coerce.boolean().optional(),
    direccion: z.string().max(100).optional(),
    // Paginación estándar
    page: z.coerce.number().int().min(1).default(1).optional(),
    page_size: z.coerce.number().int().min(1).max(100).default(10).optional(),
});

// ==========================================
// 3. TIPOS DERIVADOS (DTOs)
// ==========================================

export type EdificioCrearDTO = z.infer<typeof EdificioCrearSchema>;
export type EdificioActualizarDTO = z.infer<typeof EdificioActualizarSchema>;
export type EdificioFiltrosDTO = z.infer<typeof EdificioFiltrosSchema>;

/**
 * Interfaz para la respuesta paginada del backend
 */
export interface EdificioPaginadoResponse {
    data: Edificio[];
    pagination: {
        paginas_totales: number;
        pagina_actual: number;
        pagina_siguiente: number | null;
        pagina_previa: number | null;
    };
}
