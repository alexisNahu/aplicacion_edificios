import type {ContratoFiltrosDTO} from "@/core/services/contratos/schemas";
import {useContratos} from "@/core/services/contratos/useContratos";
import {ContratosFilters} from "@/features/contratos/components/Filter";
import {ContratosTable} from "@/features/contratos/components/Table";
import {useContratoContext} from "@/features/contratos/contratos.context";

function Contratos() {

    const {dataFilters, setDataFilters} = useContratoContext();

    // 2. Consumimos el Hook.
    // Cada vez que 'filters' cambie, useContratos disparará una nueva petición al back automáticamente.
    const { data, isLoading, isError } = useContratos(dataFilters);

    return (
        <div className="p-6 flex flex-col gap-8">
            <header>
                <h1 className="text-2xl font-bold text-gray-800">Gestión de Contratos</h1>
                <p className="text-gray-500">Administra los alquileres de tus edificios en San Lorenzo</p>
            </header>

            <ContratosFilters />

            <div className="bg-white rounded-xl shadow-sm border">
                {isError && (
                    <div className="p-4 text-red-500 bg-red-50">Error al cargar los contratos.</div>
                )}

                <ContratosTable
                    contratos={data?.data || []}
                    loading={isLoading}
                    pagination={data?.pagination}
                />
            </div>
        </div>
    );
}

export default Contratos
