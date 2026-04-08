import type {Inquilinos} from "@/features/inquilinos/models";
import type {Departamentos} from "@/features/departamentos/models";

export type FrecuenciaPago = 'semanal' | 'quincenal' | 'mensual' | 'bimestral' | 'trimestral' | 'semestral' | 'anual'

export interface Contratos {
    id?: number,
    inquilino: Pick<Inquilinos, "nombre_completo" |"numero_identificacion" | "email" >[]
    departamento: Pick<Departamentos, "numero_departamento" | "piso">[]
    frecuencia_pago: FrecuenciaPago,
    monto: number,
    dia_pago: number,
    fecha_inicio: string,
    fecha_fin: string,
    al_dia: boolean,
    descripcion: string
}
