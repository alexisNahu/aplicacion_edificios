import { type ReactNode, useEffect } from "react";
import { getErrorMessage } from "@/shared/utils";
import { navigate } from "astro:transitions/client";

interface EntityLoaderProps<T> {
    queryResult: {
        data: T | undefined;
        isLoading: boolean;
        isError: boolean;
        error: any;
    };
    redirectPath: string;
    entityName?: string;
    children: (data: T) => ReactNode;
}

export function EntityLoader<T>({
                                    queryResult,
                                    redirectPath,
                                    entityName = "recurso",
                                    children
                                }: EntityLoaderProps<T>) {
    const { data, isLoading, isError, error } = queryResult;

    // Redirección si la carga termina y no hay datos
    useEffect(() => {
        if (!isLoading && !data) {
            navigate(redirectPath);
        }
    }, [data, isLoading, redirectPath]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <div className="relative">
                    <div className="h-16 w-16 rounded-full border-4 border-indigo-50/50 border-t-indigo-600 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
                    </div>
                </div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest animate-pulse">
                    Cargando {entityName}...
                </p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-8 flex justify-center">
                <div className="bg-red-50 border border-red-100 p-6 rounded-3xl max-w-md w-full shadow-sm text-center">
                    <div className="bg-red-100 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-red-900 font-black text-lg">Error de recuperación</h3>
                    <p className="text-red-700/80 text-sm mt-1">{getErrorMessage(error)}</p>
                    <button
                        onClick={() => navigate(redirectPath)}
                        className="mt-6 w-full bg-white border border-red-200 py-2 rounded-xl text-red-700 font-bold hover:bg-red-100 transition-colors"
                    >
                        Volver al listado
                    </button>
                </div>
            </div>
        );
    }

    // Solo si hay data, ejecutamos el children
    if (data) {
        return <>{children(data)}</>;
    }

    return null;
}
