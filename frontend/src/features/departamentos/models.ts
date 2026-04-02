export interface Departamentos {
    id?: string,
    numero_departamento: string,
    piso: number,
    descripcion: string,
    edificio: {
        nombre: string,
        descripcion: string
    },
    ocupado: string,
}
