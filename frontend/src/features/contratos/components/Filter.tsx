import { useState } from "react";
import InputField from "@/shared/components/InputField";
import type {ContratoFiltrosDTO} from "@/core/services/contratos/schemas";
import {defaultPaginationOptions, useContratoContext} from "@/features/contratos/contratos.context";


export function ContratosFilters() {
    const {dataFilters, setDataFilters} = useContratoContext()

    const handleInputChange = (update: ContratoFiltrosDTO) => {
        setDataFilters((prev) => ({ ...prev, ...update }));
    };

    const handleClear = () => {
        setDataFilters(defaultPaginationOptions);
    };

    return (
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">

                <InputField
                    label="Inquilino (RUC/CI)"
                    placeholder="Buscar documento..."
                    value={dataFilters.inquilino_num_identificacion || ""}
                    onFilter={(val) => handleInputChange({ inquilino_num_identificacion: val })}
                />

                <InputField
                    label="Número de Depto"
                    placeholder="Ej: 101..."
                    value={dataFilters.num_departamento || ""}
                    onFilter={(val) => handleInputChange({ num_departamento: val })}
                />

                <InputField
                    label="Edificio"
                    placeholder="Nombre..."
                    value={dataFilters.nombre_edificio || ""}
                    onFilter={(val) => handleInputChange({ nombre_edificio: val })}
                />

                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Estado de cuenta
                    </label>
                    <div className="flex items-center gap-3 h-[46px] px-3 border border-gray-300 rounded-lg bg-gray-50">
                        <input
                            id="al_dia_checkbox"
                            type="checkbox"
                            checked={!!dataFilters.al_dia}
                            onChange={(e) => handleInputChange({ al_dia: e.target.checked })}
                            className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                        />
                        <label htmlFor="al_dia_checkbox" className="text-sm font-medium text-gray-700 cursor-pointer">
                            ¿Está al día?
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                    onClick={() => handleClear()}
                    type="button"
                    className="px-4 py-2 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
                >
                    Limpiar filtros
                </button>
            </div>
        </div>
    );
}
