import { getErrorMessage } from "@/shared/utils";
import { navigate } from "astro:transitions/client";
import { APP_ROUTES } from "@/core";
import { useEffect } from "react";
import {useEdificios} from "@/core/services/edificios/useEdificios";
import type {Edificio} from "@/core/services/edificios/schemas";

interface Params {
    id: string
}

function ReadEdificio({ id }: Params) {
    useEffect(() => {
        if (!id) {
            navigate(APP_ROUTES.edificios);
        }
    }, [id]);

    const { data, isLoading, isError, error } = useEdificios({ id: Number(id) });

    const edificio: Edificio | undefined = data?.data[0];

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
    );

    if (isError) return (
        <div className="p-8 text-center">
            <div className="bg-red-50 text-red-700 p-4 rounded-xl inline-block shadow-sm">
                <p className="font-bold">Error al cargar el edificio</p>
                <p className="text-sm">{getErrorMessage(error)}</p>
            </div>
        </div>
    );

    if (!edificio) {
        navigate(APP_ROUTES.edificios);
        return null;
    }

    return (
        <div className="p-8 max-w-5xl mx-auto bg-gray-50 min-h-screen space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(APP_ROUTES.edificios)}
                        className="p-2 hover:bg-white rounded-full transition-colors shadow-sm border border-transparent hover:border-gray-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                            {edificio.nombre}
                        </h1>
                        <p className="text-gray-500">Detalles de la propiedad y ubicación</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => navigate(`${APP_ROUTES.edificios}/${edificio.id}/editar`)}
                        className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm shadow-sm hover:bg-gray-50 transition-all"
                    >
                        Editar Propiedad
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    {/* Sección Principal: Ubicación y Descripción */}
                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            Ubicación y Referencias
                        </h2>
                        <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold">Dirección</p>
                                <p className="text-gray-900 font-semibold text-lg">
                                    {edificio.direccion || "No especificada"}
                                </p>
                            </div>
                            <div className="pt-4 border-t border-gray-200">
                                <p className="text-xs text-gray-400 uppercase font-bold">Descripción / Notas</p>
                                <p className="text-gray-600 mt-1">
                                    {edificio.descripcion || "Sin descripción adicional."}
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="space-y-8">
                    {/* Card de Estado Lateral */}
                    <section className={`p-6 rounded-2xl shadow-lg ${
                        edificio.status
                            ? 'bg-emerald-600 shadow-emerald-100'
                            : 'bg-gray-700 shadow-gray-200'
                    } text-white`}>
                        <h2 className={`${
                            edificio.status ? 'text-emerald-100' : 'text-gray-300'
                        } text-xs font-bold uppercase tracking-wider mb-4`}>
                            Estado Operativo
                        </h2>
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${
                                edificio.status ? 'bg-emerald-500/30' : 'bg-gray-600/30'
                            }`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-black italic tracking-tight">
                                    {edificio.status ? 'ACTIVO' : 'INACTIVO'}
                                </p>
                                <p className="text-xs opacity-80 font-medium">
                                    ID de Sistema: #{edificio.id}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Card Informativa de gestión */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-sm text-gray-500 leading-relaxed italic">
                            "Los cambios realizados en este edificio afectarán la disponibilidad de los departamentos asociados."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReadEdificio;
