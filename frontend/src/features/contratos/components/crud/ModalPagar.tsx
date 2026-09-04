import { useState } from "react";
import { useForm } from "react-hook-form";
import type { Contratos } from "@/features/contratos/models";
import { BACKEND_ENDPOINTS } from "@/core";

interface ModalPagarProps {
    isOpen: boolean;
    onClose: () => void;
    contrato: Contratos;
}

export function ModalPagar({ isOpen, onClose, contrato }: ModalPagarProps) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const onSubmit = async (data: any) => {
        setIsPending(true);
        setError(null);

        try {
            const response = await fetch(BACKEND_ENDPOINTS.pagos, {
                method: 'POST',
                headers: {
                    credentials: 'include',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contrato_id: contrato.id,
                    monto_pagado: parseFloat(data.monto_pagado),
                    descripcion: data.descripcion,
                    numero_departamento: contrato.departamento[0]?.numero_departamento || "N/A",
                    status: true
                }),
            });

            if (!response.ok) {
                throw new Error("Error al registrar el pago");
            }

            onClose(); // Cierra el modal al tener éxito
        } catch (err: any) {
            setError(err.message || "Ocurrió un error inesperado");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Registrar Pago</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>

                {error && (
                    <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded">{error}</div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Departamento</label>
                        <input
                            disabled
                            value={contrato.departamento[0]?.numero_departamento || "N/A"}
                            className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-gray-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Monto (Gs.)</label>
                        <input
                            type="number"
                            {...register("monto_pagado", { required: true, min: 1 })}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            placeholder="Ej: 500000"
                        />
                        {errors.monto_pagado && <span className="text-red-500 text-xs">El monto es requerido</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descripción</label>
                        <textarea
                            {...register("descripcion")}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            placeholder="Nota adicional..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isPending ? "Procesando..." : "Registrar Pago"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
