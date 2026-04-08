import { useParams } from "react-router-dom"; // O el hook de params que uses
import { useContratos } from "@/core/services/contratos/useContratos";
import { getErrorMessage } from "@/shared/utils";
import { navigate } from "astro:transitions/client";
import { APP_ROUTES } from "@/core";
import {useEffect} from "react";
import type {Contratos} from "@/features/contratos/models";

interface Params {
    id: string
}

function DetalleContrato({id}: Params) {
    console.log(id)
    useEffect(() => {
        console.log(id)
        if (!id) {
            navigate(APP_ROUTES.contratos);
        }
    }, [id]);
    const { data, isLoading, isError, error } = useContratos({id: Number(id)});

    const contrato: Contratos | undefined = data?.data[0]


    console.log(contrato)

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (isError) return (
        <div className="p-8 text-center">
            <div className="bg-red-50 text-red-700 p-4 rounded-xl inline-block">
                <p className="font-bold">Error al cargar el contrato</p>
                <p className="text-sm">{getErrorMessage(error)}</p>
            </div>
        </div>
    );


    if (!contrato) {
        navigate(APP_ROUTES.contratos)
        return
    }


    return (
        <div className="p-8 max-w-5xl mx-auto bg-gray-50 min-h-screen space-y-8">
            {/* Header con Badge de Estado */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(APP_ROUTES.contratos)}
                        className="p-2 hover:bg-white rounded-full transition-colors shadow-sm border border-transparent hover:border-gray-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                            Contrato #{contrato.id}
                        </h1>
                        <p className="text-gray-500">Detalles técnicos y financieros de la vinculación</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm ${
                        contrato.al_dia
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}>
                        {contrato.al_dia ? 'Al día' : 'Pendiente'}
                    </span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Columna Izquierda: Entidades */}
                <div className="md:col-span-2 space-y-8">
                    {/* Card Inquilino */}
                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            Información del Inquilino
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold">Nombre Completo</p>
                                <p className="text-gray-900 font-medium">{contrato.inquilino[0].nombre_completo || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold">Cédula / Identificación</p>
                                <p className="text-gray-900 font-medium">{contrato.inquilino[0].numero_identificacion || 'N/A'}</p>
                            </div>
                        </div>
                    </section>

                    {/* Card Departamento */}
                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            Ubicación
                        </h2>
                        <div className="flex items-center gap-6 bg-gray-50 p-4 rounded-xl">
                            <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-black text-xl">
                                {contrato.departamento[0].numero_departamento}
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold">Departamento</p>
                                <p className="text-gray-900 font-medium">Unidad asignada para el contrato</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Columna Derecha: Finanzas y Fechas */}
                <div className="space-y-8">
                    <section className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg shadow-indigo-100">
                        <h2 className="text-indigo-100 text-xs font-bold uppercase tracking-wider mb-4">Monto del Alquiler</h2>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black">Gs. {Number(contrato.monto).toLocaleString()}</span>
                            <span className="text-indigo-200">/ {contrato.frecuencia_pago}</span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-indigo-500/30">
                            <p className="text-sm">Día de pago preferente: <strong>{contrato.dia_pago}</strong></p>
                        </div>
                    </section>

                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Cronograma</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full" />
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Inicio</p>
                                    <p className="text-sm font-medium text-gray-700">{contrato.fecha_inicio}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-red-500 rounded-full" />
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Vencimiento</p>
                                    <p className="text-sm font-medium text-gray-700">{contrato.fecha_fin}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {contrato.descripcion && (
                        <section className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                            <h2 className="text-sm font-bold text-amber-800 uppercase mb-2">Observaciones</h2>
                            <p className="text-sm text-amber-900 italic">{contrato.descripcion}</p>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DetalleContrato;
