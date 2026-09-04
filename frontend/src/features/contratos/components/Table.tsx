import { useState } from "react";
import type { Contratos } from "../models";
import { DataTable } from "@/shared/components/DataTable";
import { APP_ROUTES, type Pagination } from "@/core";
import { useContratoContext } from "@/features/contratos/components/contratos.context";
import { navigate } from "astro:transitions/client";
import { useDeleteContrato } from "@/core/services/contratos/useContratos";
import { ModalPagar } from "./crud/ModalPagar";

interface ContratosTableProps {
    contratos: Contratos[];
    loading: boolean;
    pagination?: Pagination;
    isError?: any;
}

export function ContratosTable({ contratos, loading, pagination, isError }: ContratosTableProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedContrato, setSelectedContrato] = useState<Contratos | null>(null);

    const { mutate: deleteContrato } = useDeleteContrato();
    const { setDataFilters, dataFilters } = useContratoContext();

    const columns = [
        {
            header: "Inquilino",
            cell: (c: Contratos) => (
                <div>
                    {c.inquilino.map(inq => (
                        <div key={inq.numero_identificacion} className="font-semibold text-gray-900">{inq.nombre_completo}</div>
                    ))}
                    {c.inquilino.map(inq => (
                        <div key={inq.numero_identificacion} className="text-sm text-gray-600">{inq.numero_identificacion}</div>
                    ))}
                </div>
            ),
        },
        {
            header: "Departamento",
            cell: (c: Contratos) => (
                c.departamento.map((dep) => (
                    <span key={dep.numero_departamento} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                        Depto {dep.numero_departamento}
                    </span>
                ))
            ),
        },
        {
            header: "Monto",
            cell: (c: Contratos) => <span>{c.monto} Gs.</span>,
        },
        {
            header: "Al dia",
            cell: (c: Contratos) => <span>{c.al_dia ? 'si' : 'no'}</span>,
        },
        {
            header: "Acciones",
            className: "text-center",
            cell: (c: Contratos) => (
                <div className="flex items-center justify-center gap-3">
                    {/* Botón Ver Ficha */}
                    <button
                        title="Ver ficha"
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        onClick={() => navigate(`${APP_ROUTES.contratos}/${c.id}`)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </button>

                    {/* Botón Editar */}
                    <button
                        title="Editar contrato"
                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        onClick={() => navigate(`${APP_ROUTES.contratos_editar}/${c.id}`)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>

                    {/* Botón de Pagar: Solo visible si c.al_dia es FALSE */}
                    {!c.al_dia && (
                        <button
                            title="Pagar contrato"
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            onClick={() => {
                                setSelectedContrato(c);
                                setIsModalOpen(true);
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </button>
                    )}

                    {/* Botón Eliminar */}
                    <button
                        title="Eliminar contrato"
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={() => {
                            if (!c.id) return;
                            if (confirm(`¿Estás seguro de eliminar el contrato #${c.id}?`)) {
                                deleteContrato(c.id);
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
                <div className="p-4 text-red-500 bg-red-50">Error al cargar los contratos.</div>
            )}
            <DataTable
                data={contratos}
                columns={columns}
                loading={loading}
                onPageChange={(page) => setDataFilters({ ...dataFilters, page })}
                pagination={pagination}
                rowKey="id"
            />

            {/* Modal de Pago */}
            {isModalOpen && selectedContrato && (
                <ModalPagar
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    contrato={selectedContrato}
                />
            )}
        </>
    );
}
