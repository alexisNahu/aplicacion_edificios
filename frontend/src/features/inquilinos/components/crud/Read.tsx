import { useInquilinos } from "@/core/services/inquilinos/useInquilinos";
import { getErrorMessage } from "@/shared/utils";
import { navigate } from "astro:transitions/client";
import { APP_ROUTES } from "@/core";
import { useEffect } from "react";
import type { Inquilinos } from "@/features/inquilinos/models";
import {defaultInquilinoPagination} from "@/features/inquilinos/components/inquilinos.context";

interface Params {
    id: string
}

function ReadInquilino({ id }: Params) {
    useEffect(() => {
        if (!id) {
            navigate(APP_ROUTES.inquilinos);
        }
    }, [id]);

    const { data, isLoading, isError, error } = useInquilinos({...defaultInquilinoPagination, id: Number(id) });

    const inquilino: Inquilinos | undefined = data?.data[0];

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
    );

    if (isError) return (
        <div className="p-8 text-center">
            <div className="bg-red-50 text-red-700 p-4 rounded-xl inline-block">
                <p className="font-bold">Error al cargar el inquilino</p>
                <p className="text-sm">{getErrorMessage(error)}</p>
            </div>
        </div>
    );

    if (!inquilino) {
        navigate(APP_ROUTES.inquilinos);
        return null;
    }

    return (
        <div className="p-8 max-w-5xl mx-auto bg-gray-50 min-h-screen space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(APP_ROUTES.inquilinos)}
                        className="p-2 hover:bg-white rounded-full transition-colors shadow-sm border border-transparent hover:border-gray-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                            {inquilino.nombre_completo}
                        </h1>
                        <p className="text-gray-500">Perfil detallado del arrendatario</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            Datos de Identidad
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl">
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold">Número de Cédula / RUC</p>
                                <p className="text-gray-900 font-semibold text-lg">{inquilino.numero_identificacion}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold">ID de Sistema</p>
                                <p className="text-gray-900 font-medium">#{inquilino.id}</p>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="space-y-8">
                    <section className="bg-emerald-600 text-white p-6 rounded-2xl shadow-lg shadow-emerald-100">
                        <h2 className="text-emerald-100 text-xs font-bold uppercase tracking-wider mb-4">Información de Contacto</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/30 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                </div>
                                <span className="font-bold">{inquilino.telefono}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/30 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                </div>
                                <span className="text-sm truncate">{inquilino.email}</span>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}

export default ReadInquilino;
