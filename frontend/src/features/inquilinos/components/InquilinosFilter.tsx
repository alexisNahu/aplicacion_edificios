import InputField from "@/shared/components/InputField";
import type { InquilinoFiltrosDTO } from "@/core/services/inquilinos/schemas";
import {defaultInquilinoPagination, useInquilinoContext} from "@/features/inquilinos/components/inquilinos.context";

export function InquilinosFilters() {
    const { dataFilters, setDataFilters } = useInquilinoContext();

    const handleInputChange = (update: Partial<InquilinoFiltrosDTO>) => {
        setDataFilters((prev) => ({ ...prev, ...update }));
    };

    const handleClear = () => {
        setDataFilters(defaultInquilinoPagination);
    };

    return (
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
                <InputField
                    label="Nombre / Apellido"
                    placeholder="Buscar inquilino..."
                    value={dataFilters.nombre_completo || ""}
                    onFilter={(val) => handleInputChange({ nombre_completo: val })}
                />

                <InputField
                    label="Identificación (RUC/CI)"
                    placeholder="Número de documento..."
                    value={dataFilters.numero_identificacion || ""}
                    onFilter={(val) => handleInputChange({ numero_identificacion: val })}
                />
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
