import { DataTable } from "@/shared/components/DataTable";
import { APP_ROUTES, type Pagination } from "@/core";
import { navigate } from "astro:transitions/client";
import { useDeleteEdificio } from "@/core/services/edificios/useEdificios";
import type {Edificio, EdificioFiltrosDTO} from "@/core/services/edificios/schemas";
import {useEdificioContext} from "@/features/edificios/components/context";

interface EdificiosTableProps {
    edificios: Edificio[];
    loading: boolean;
    pagination?: Pagination;
    isError?: any;
}

export function EdificiosTable({
                                   edificios,
                                   loading,
                                   pagination,
                                   isError,
                               }: EdificiosTableProps) {
    const { mutate: deleteEdificio } = useDeleteEdificio();
    const {dataFilters, setDataFilters} = useEdificioContext()

    const columns = [
        {
            header: "Edificio",
            cell: (e: Edificio) => (
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900">{e.nombre}</span>
                    <span className="text-xs text-gray-500">ID: #{e.id}</span>
                </div>
            ),
        },
        {
            header: "Dirección",
            cell: (e: Edificio) => (
                <span className="text-gray-600 text-sm">
                    {e.direccion || "Sin dirección registrada"}
                </span>
            ),
        },
        {
            header: "Estado",
            cell: (e: Edificio) => (
                <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    e.status
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                }`}>
                    {e.status ? 'Activo' : 'Inactivo'}
                </span>
            ),
        },
        {
            header: "Acciones",
            className: "text-center",
            cell: (e: Edificio) => (
                <div className="flex items-center justify-center gap-3">
                    {/* Botón Editar */}
                    <button
                        title="Editar edificio"
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        onClick={() => navigate(`${APP_ROUTES.edificios}/editar/${e.id}`)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>

                    {/* Botón Eliminar */}
                    <button
                        title="Eliminar edificio"
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={() => {
                            if (!e.id) return;
                            if(confirm(`¿Estás seguro de eliminar el edificio "${e.nombre}"?`)) {
                                deleteEdificio(e.id);
                            }
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            ),
        }
    ];

    return (
        <>
            {isError && (
                <div className="p-4 text-red-500 bg-red-50 border-b border-red-100 text-sm">
                    ⚠️ Error al sincronizar con el servidor de edificios.
                </div>
            )}
            <DataTable
                data={edificios}
                columns={columns}
                loading={loading}
                onPageChange={(page) => setDataFilters({...dataFilters, page})}
                pagination={pagination}
                rowKey="id"
            />
        </>
    );
}
