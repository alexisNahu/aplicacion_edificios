import type { Contratos } from "../models";
import {Table} from "@/components/Ui/Table";
import type {Pagination} from "@/core";
import {useContratoContext} from "@/features/contratos/contratos.context";

interface ContratosTableProps {
    contratos: Contratos[];
    loading: boolean;
    pagination?: Pagination
}

export function ContratosTable({ contratos, loading, pagination }: ContratosTableProps) {
    const {setDataFilters, dataFilters} = useContratoContext()

    const columns = [
        {
            header: "Inquilino",
            cell: (c: Contratos) => (
                <div>
                    {
                        c.inquilino.map(inq => (
                            <div className="font-semibold text-gray-900">{inq.nombre_completo}</div>
                        ))
                    }
                    {
                        c.inquilino.map(inq => (
                            <div className="font-semibold text-gray-900">{inq.numero_identificacion}</div>
                        ))
                    }
                </div>
            ),
        },
        {
            header: "Departamento",
            cell: (c: Contratos) => (
                    c.departamento.map((dep) => (
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                            Depto {dep.numero_departamento}
                        </span>
                    ))
            ),
        },
        {
            header: "Monto",
            cell: (c: Contratos) => <span>{c.monto} Gs.</span>,
        },
        {
            header: "Al dia",
            cell: (c: Contratos) => <span>{c.al_dia ? 'si':'no'} </span>,
        },
        {
            header: "Acciones",
            className: "text-center",
            cell: (c: Contratos) => (
                <button className="text-blue-600 hover:underline">Ver ficha</button>
            ),
        }
    ];

    return (
        <Table
            data={contratos}
            columns={columns}
            loading={loading}
            onPageChange={(page) => setDataFilters({...dataFilters, page})}
            pagination={pagination}
            rowKey="id"
        />
    );
}
