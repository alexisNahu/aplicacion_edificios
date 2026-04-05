import type {ContratoFiltrosDTO} from "@/core/services/contratos/schemas";
import {useContratos} from "@/core/services/contratos/useContratos";
import {ContratosFilters} from "@/features/contratos/components/Filter";
import {ContratosTable} from "@/features/contratos/components/Table";
import {useContratoContext} from "@/features/contratos/contratos.context";
import {useEffect} from "react";

function Contratos() {

    const {dataFilters} = useContratoContext();
    const { data, isLoading, isError } = useContratos(dataFilters);

    return (
        <div className="p-6 flex flex-col gap-8">
            <header>
                <h1 className="text-2xl font-bold text-gray-800">Gestión de Contratos</h1>
                <p className="text-gray-500">Administra los alquileres de tus edificios en San Lorenzo</p>
            </header>

            <ContratosFilters />

            <div className="bg-white rounded-xl shadow-sm border">
                <ContratosTable
                    contratos={data?.data || []}
                    loading={isLoading}
                    pagination={data?.pagination}
                    isError={isError}
                />
            </div>
        </div>
    );
}

export default Contratos
