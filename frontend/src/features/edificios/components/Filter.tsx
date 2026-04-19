import InputField from "@/shared/components/InputField";
import type { EdificioFiltrosDTO } from "@/core/services/edificios/schemas";
import React from "react";

interface Props {
    filters: EdificioFiltrosDTO;
    setFilters: React.Dispatch<React.SetStateAction<EdificioFiltrosDTO>>;
}

const defaultFilters: EdificioFiltrosDTO = {
    page: 1,
    page_size: 10,
};

export function EdificiosFilters({ filters, setFilters }: Props) {

    const handleInputChange = (update: Partial<EdificioFiltrosDTO>) => {
        setFilters((prev) => ({ ...prev, ...update, page: 1 }));
    };

    const handleClear = () => {
        setFilters(defaultFilters);
    };

    return (
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
                {/* Filtro por Nombre */}
                <InputField
                    label="Nombre del Edificio"
                    placeholder="Ej: Torre San Lorenzo..."
                    value={filters.nombre || ""}
                    onFilter={(val) => handleInputChange({ nombre: val })}
                />

                {/* Aquí puedes agregar más filtros en el futuro (Dirección, Status, etc.) */}
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                    onClick={handleClear}
                    type="button"
                    className="px-4 py-2 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
                >
                    Limpiar filtros
                </button>
            </div>
        </div>
    );
}
