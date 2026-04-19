export type TipoIdentificacion = 'cedula' | 'pasaporte' | 'ruc' | 'licencia'

export interface Inquilinos {
    id: number,
    nombre_completo: string,
    status: boolean,
    telefono: string,
    email: string,
    numero_identificacion: string,
    tipo_identificacion: TipoIdentificacion,
}


