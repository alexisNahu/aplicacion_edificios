import { useState } from 'react';
import { navigate } from "astro:transitions/client";
import { APP_ROUTES } from "@/core";
import { EdificiosFilters } from "@/features/edificios/components/Filter";
import { EdificiosTable } from "@/features/edificios/components/Table";
import type {EdificioFiltrosDTO} from "@/core/services/edificios/schemas";
import {useEdificios} from "@/core/services/edificios/useEdificios";

function Edificios() {
    // 1. Estado para filtros (En contratos usas context, aquí local para simplificar)
    const [dataFilters, setDataFilters] = useState<EdificioFiltrosDTO>({
        page: 1,
        page_size: 10,
        nombre: '',
        status: undefined
    });

    // 2. Hook de datos
    const { data, isLoading, isError } = useEdificios(dataFilters);

    return (
        <div className="p-8 max-w-7xl mx-auto flex flex-col gap-8 bg-gray-50 min-h-screen">
            {/* Header con Acción Principal */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                        Gestión de Edificios
                    </h1>
                    <p className="text-gray-500 mt-1 flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        Administra las propiedades y complejos bajo tu gestión
                    </p>
                </div>

                <button
                    onClick={() => navigate(`${APP_ROUTES.edificios}/crear`)}
                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all active:scale-95"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Nuevo Edificio
                </button>
            </header>

            {/* Sección de Filtros con Card Estilizada */}
            <section className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                <EdificiosFilters
                    filters={dataFilters}
                    setFilters={setDataFilters}
                />
            </section>

            {/* Tabla de Resultados */}
            <main className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="p-1 bg-gray-50 border-b border-gray-100 flex justify-between items-center px-6 py-3">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Lista de edificios registrados
                    </span>
                    {data?.pagination && (
                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-md border shadow-sm">
                            Total: <strong>{data.pagination.paginas_totales}</strong>
                        </span>
                    )}
                </div>

                <EdificiosTable
                    edificios={data?.data || []}
                    loading={isLoading}
                    pagination={data?.pagination}
                    isError={isError}
                  />
            </main>

            {/* Footer Informativo */}
            <footer className="text-center">
                <p className="text-xs text-gray-400">
                    Sistema de Gestión de Inmuebles • v2.0
                </p>
            </footer>
        </div>
    );
}

export default Edificios;
