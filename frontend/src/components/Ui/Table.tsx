import type { ReactNode } from "react";
import type { Pagination } from "@/core";

interface Column<T> {
    header: string;
    cell: (item: T) => ReactNode;
    className?: string;
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    loading?: boolean;
    rowKey: keyof T;
    emptyMessage?: string;
    pagination?: Pagination;
    onPageChange?: (page: number) => void;
}

export function Table<T>({
                             data,
                             columns,
                             loading,
                             emptyMessage = "No se encontraron resultados.",
                             rowKey,
                             pagination,
                             onPageChange
                         }: TableProps<T>) {

    if (loading) {
        return (
            <div className="p-12 flex flex-col justify-center items-center gap-3 bg-white">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                <p className="text-gray-500 font-medium text-sm">Cargando datos...</p>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="p-12 text-center text-gray-400 italic bg-white border rounded-xl">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className="overflow-hidden border border-gray-100 rounded-xl bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50/50 border-b border-gray-100">
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} className={`px-6 py-4 font-bold tracking-wider ${col.className || ""}`}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {data.map((item) => (
                        <tr key={String(item[rowKey])} className="hover:bg-gray-50/50 transition-colors">
                            {columns.map((col, index) => (
                                <td key={index} className={`px-6 py-4 whitespace-nowrap ${col.className || ""}`}>
                                    {col.cell(item)}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Renderizado de Paginación Interna usando tu Interface Pagination */}
            {pagination && pagination.paginas_totales > 1 && onPageChange && (
                <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                        Página <span className="font-semibold text-gray-900">{pagination.pagina_actual}</span> de <span className="font-semibold text-gray-900">{pagination.paginas_totales}</span>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            disabled={!pagination.pagina_previa}
                            onClick={() => onPageChange(pagination.pagina_previa!)}
                            className="px-4 py-2 text-xs font-bold uppercase tracking-tight text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm disabled:opacity-40 disabled:bg-gray-50 hover:bg-gray-50 transition-all active:scale-95"
                        >
                            Anterior
                        </button>
                        <button
                            type="button"
                            disabled={!pagination.pagina_siguiente}
                            onClick={() => onPageChange(pagination.pagina_siguiente!)}
                            className="px-4 py-2 text-xs font-bold uppercase tracking-tight text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm disabled:opacity-40 disabled:bg-gray-50 hover:bg-gray-50 transition-all active:scale-95"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
