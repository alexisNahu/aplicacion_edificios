import { z } from "zod";
import type {Departamentos} from "@/features/departamentos/models";

// ==========================================
// 1. ENUMS Y TIPOS BASE (Si fueran necesarios)
// ==========================================
// Por ahora los departamentos usan tipos primitivos y FKs de ID.

// ==========================================
// 2. INTERFACES DE RESPUESTA (Modelos)
// ==========================================
// Se definen en el archivo de models.ts generalmente,
// pero se usan aquí para el tipado de la respuesta paginada.

// ==========================================
// 3. SCHEMAS DE VALIDACIÓN (ZOD)
// ==========================================

// --- SCHEMA PARA CREACIÓN ---
export const DepartamentoCrearSchema = z.object({
    numero_departamento: z.string()
        .min(1, "El número es requerido")
        .max(20, "Máximo 20 caracteres"),
    piso: z.coerce.number()
        .int()
        .min(0, "Mínimo piso 0")
        .max(3, "Máximo piso 3"),
    descripcion: z.string()
        .max(100, "Máximo 100 caracteres")
        .optional()
        .nullable(),
    edificio_id: z.number()
        .int()
        .min(1, "Debe seleccionar un edificio"),
    status: z.boolean().default(true),
    ocupado: z.boolean().default(false),
});

// --- SCHEMA PARA ACTUALIZACIÓN ---
// .partial() permite enviar solo los campos que cambian (PATCH style)
export const DepartamentoActualizarSchema = DepartamentoCrearSchema.partial();

// --- SCHEMA PARA FILTROS (Query Params) ---
// Usamos z.coerce para que los valores de la URL (strings) se conviertan a tipos correctos
export const DepartamentoFiltrosSchema = z.object({
    nombre_edificio: z.string().max(60).optional(), // Alias para edificio__nombre__icontains
    numero_departamento: z.string().max(20).optional(),
    piso: z.coerce.number().int().min(0).max(3).optional(),
    status: z.coerce.boolean().optional(),
    ocupado: z.coerce.boolean().optional(),
    page: z.coerce.number().int().min(1).default(1),
    page_size: z.coerce.number().int().min(1).max(100).default(10),
});

// ==========================================
// 4. TIPOS DERIVADOS (DTOs)
// ==========================================

export type DepartamentoCrearDTO = z.infer<typeof DepartamentoCrearSchema>;
export type DepartamentoActualizarDTO = z.infer<typeof DepartamentoActualizarSchema>;
export type DepartamentoFiltrosDTO = z.infer<typeof DepartamentoFiltrosSchema>;

/**
 * Respuesta paginada estándar para Departamentos
 */
export interface DepartamentoPaginadoResponse {
    data: Departamentos[];
    pagination: {
        paginas_totales: number;
        pagina_actual: number;
        pagina_siguiente: number | null;
        pagina_previa: number | null;
    };
}
