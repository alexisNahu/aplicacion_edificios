import { useInquilinos } from "@/core/services/inquilinos/useInquilinos";
import { navigate } from "astro:transitions/client";
import { APP_ROUTES } from "@/core";
import {useInquilinoContext} from "@/features/inquilinos/components/inquilinos.context";
import {InquilinosTable} from "@/features/inquilinos/components/InquilinosTable";
import {InquilinosFilters} from "@/features/inquilinos/components/InquilinosFilter";

function Inquilinos() {
    const { dataFilters } = useInquilinoContext();
    const { data, isLoading, isError } = useInquilinos(dataFilters);

    return (
        <div className="p-8 max-w-7xl mx-auto flex flex-col gap-8 bg-gray-50 min-h-screen">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                        Gestión de Inquilinos
                    </h1>
                    <p className="text-gray-500 mt-1 flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        Base de datos de personas y contactos de tus propiedades
                    </p>
                </div>

                <button
                    onClick={() => navigate(`${APP_ROUTES.inquilinos}/crear`)}
                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all active:scale-95"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Nuevo Inquilino
                </button>
            </header>

            <section className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                <InquilinosFilters />
            </section>

            <main className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="p-1 bg-gray-50 border-b border-gray-100 flex justify-between items-center px-6 py-3">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Lista de inquilinos
                    </span>
                    {data?.pagination && (
                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-md border shadow-sm">
                            Total: <strong>{data.pagination.paginas_totales}</strong>
                        </span>
                    )}
                </div>

                <InquilinosTable
                    inquilinos={data?.data || []}
                    loading={isLoading}
                    pagination={data?.pagination}
                    isError={isError}
                />
            </main>

            <footer className="text-center">
                <p className="text-xs text-gray-400">
                    Sistema de Gestión de Inmuebles • v2.0
                </p>
            </footer>
        </div>
    );
}

export default Inquilinos;
