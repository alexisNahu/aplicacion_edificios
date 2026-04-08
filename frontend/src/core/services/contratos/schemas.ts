import { z } from "zod";

// ==========================================
// 1. INTERFACES DE MODELO (Entidades)
// ==========================================

export interface InquilinoMinimo {
    id: number;
    nombre_completo: string;
    numero_identificacion: string;
}

export interface DepartamentoMinimo {
    id: number;
    num_departamento: string;
}

export interface Contrato {
    id: number;
    frecuencia_pago: string;
    monto: number;
    status: boolean;
    dia_pago: number;
    fecha_inicio: string;
    fecha_fin: string;
    al_dia: boolean;
    descripcion: string | null;
    inquilino: InquilinoMinimo[];
    departamento: DepartamentoMinimo[];
}

// ==========================================
// 2. SCHEMAS DE ZOD (Validación y DTOs)
// ==========================================

const FrecuenciaPagoEnum = z.enum([
    'semanal', 'quincenal', 'mensual', 'bimestral', 'trimestral', 'semestral', 'anual'
]);

// Definición de los campos base para reutilizar
const contratoFields = {
    frecuencia_pago: FrecuenciaPagoEnum,
    monto: z.coerce.number().min(0, "El monto debe ser mayor o igual a 0"),
    dia_pago: z.coerce.number().int().min(1).max(31, "Día entre 1 y 31"),
    fecha_inicio: z.string().min(1, "Fecha de inicio requerida"),
    fecha_fin: z.string().min(1, "Fecha de fin requerida"),
    descripcion: z.string().max(500, "Máximo 500 caracteres").optional().nullable(),
    numero_identificacion: z.coerce.string().min(1, "Seleccione un inquilino"),
    numero_departamento: z.coerce.string().min(1, "Seleccione un departamento"),
    status: z.boolean().default(true),
    al_dia: z.boolean().default(true),
};

// --- SCHEMA PARA CREACIÓN ---
// Aplicamos el refinamiento sobre el objeto construido con los campos base
export const ContratoCrearSchema = z.object(contratoFields).superRefine((data, ctx) => {
    if (data.fecha_inicio && data.fecha_fin) {
        if (new Date(data.fecha_inicio) > new Date(data.fecha_fin)) {
            ctx.addIssue({
                code: 'custom',
                message: "La fecha de inicio no puede ser posterior a la fecha de finalización.",
                path: ["fecha_inicio"],
            });
        }
    }
});

// --- SCHEMA PARA ACTUALIZACIÓN ---
// Aquí está el truco: .partial() se aplica al objeto base, y LUEGO se añade el superRefine
export const ContratoActualizarSchema = z.object(contratoFields).partial().superRefine((data, ctx) => {
    if (data.fecha_inicio && data.fecha_fin) {
        if (new Date(data.fecha_inicio) > new Date(data.fecha_fin)) {
            ctx.addIssue({
                code: 'custom',
                message: "La fecha de inicio no puede ser posterior a la fecha de finalización.",
                path: ["fecha_inicio"],
            });
        }
    }
});

// --- SCHEMA PARA FILTROS DE BÚSQUEDA ---
export const ContratoFiltrosSchema = z.object({
    id: z.coerce.number().int().optional(),
    status: z.coerce.boolean().optional(),
    al_dia: z.coerce.boolean().optional(),
    frecuencia_pago: z.string().optional(),
    inquilino_num_identificacion: z.string().optional(),
    num_departamento: z.string().optional(),
    nombre_edificio: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1).optional(),
    page_size: z.coerce.number().int().min(1).max(100).default(10).optional(),
});

// ==========================================
// 3. TIPOS DERIVADOS (DTOs)
// ==========================================

export type ContratoCrearDTO = z.infer<typeof ContratoCrearSchema>;
export type ContratoActualizarDTO = z.infer<typeof ContratoActualizarSchema>;
export type ContratoFiltrosDTO = z.infer<typeof ContratoFiltrosSchema>;

/**
 * Interfaz para la respuesta paginada del backend
 */
export interface ContratoPaginadoResponse {
    data: Contrato[];
    pagination: {
        paginas_totales: number;
        pagina_actual: number;
        pagina_siguiente: number | null;
        pagina_previa: number | null;
    };
}
