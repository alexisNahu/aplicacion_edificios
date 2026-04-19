import type { Inquilinos } from "../models";
import { DataTable } from "@/shared/components/DataTable";
import { APP_ROUTES, type Pagination } from "@/core";
import { navigate } from "astro:transitions/client";
import { useDeleteInquilino } from "@/core/services/inquilinos/useInquilinos";
import {useInquilinoContext} from "@/features/inquilinos/components/inquilinos.context";

interface InquilinosTableProps {
    inquilinos: Inquilinos[];
    loading: boolean;
    pagination?: Pagination;
    isError?: any;
}

export function InquilinosTable({ inquilinos, loading, pagination, isError }: InquilinosTableProps) {
    const { mutate: deleteInquilino, isPending: isDeleting } = useDeleteInquilino();
    const { setDataFilters, dataFilters } = useInquilinoContext();

    const columns = [
        {
            header: "Nombre Completo",
            cell: (i: Inquilinos) => (
                <div className="font-semibold text-gray-900">
                    {i.nombre_completo}
                </div>
            ),
        },
        {
            header: "Identificación",
            cell: (i: Inquilinos) => (
                <div className="text-sm text-gray-600">
                    {i.numero_identificacion}
                </div>
            ),
        },
        {
            header: "Contacto",
            cell: (i: Inquilinos) => (
                <div className="flex flex-col text-xs">
                    <span className="text-gray-700">{i.telefono}</span>
                    <span className="text-gray-400">{i.email}</span>
                </div>
            ),
        },
        {
            header: "Acciones",
            className: "text-center",
            cell: (i: Inquilinos) => (
                <div className="flex items-center justify-center gap-3">
                    <button
                        title="Ver ficha"
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        onClick={() => navigate(`${APP_ROUTES.inquilinos}/${i.id}`)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </button>
                    <button
                        title="Editar inquilino"
                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        onClick={() => navigate(`${APP_ROUTES.inquilinos}/editar/${i.id}`)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>

                    <button
                        title="Eliminar inquilino"
                        disabled={isDeleting}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        onClick={() => {
                            if (!i.id) return;
                            if (confirm(`¿Estás seguro de eliminar a ${i.nombre_completo}?`)) {
                                if (!i.id) return
                                deleteInquilino(i.id);
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
                <div className="p-4 text-red-500 bg-red-50">Error al cargar los inquilinos.</div>
            )}
            <DataTable
                data={inquilinos}
                columns={columns}
                loading={loading}
                onPageChange={(page) => setDataFilters({ ...dataFilters, page })}
                pagination={pagination}
                rowKey="id"
            />
        </>
    );
}
