import { useContratos, useUpdateContrato } from "@/core/services/contratos/useContratos";
import { EntityLoader } from "@/components/PageLoaderLayout/PageLoaderLayout";
import { APP_ROUTES } from "@/core";
import { type ContratoActualizarDTO, ContratoActualizarSchema } from "@/core/services/contratos/schemas";
import CustomForm from "@/components/Form/CustomForm";
import InputForm from '@/components/Form/components/CustomInput';
import { getErrorMessage } from '@/shared/utils';
import { navigate } from "astro:transitions/client";

function EditarContrato({ id }: { id: string }) {
    // 1. Hook para obtener datos
    const query = useContratos({ id: Number(id) });

    // 2. Hook para actualizar (Mutación)
    const { mutate: updateContrato, isPending, isError, error } = useUpdateContrato();

    const contratoQueryResult = {
        ...query,
        data: query.data?.data?.[0]
    };

    const onSubmit = (formData: ContratoActualizarDTO) => {
        updateContrato({ id: Number(id), payload: formData }, {
            onSuccess: () => {
                navigate(`${APP_ROUTES.contratos}/${id}`);
            }
        });
    };

    return (
        <EntityLoader
            queryResult={contratoQueryResult}
            redirectPath={APP_ROUTES.contratos}
            entityName="Contrato"
        >
            {(contrato) => (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                        <div className="h-2 bg-indigo-600"/>

                        <div className="p-10">
                            <header className="mb-10">
                                <h1 className="text-3xl font-black text-gray-900">Actualizar Contrato</h1>
                                <p className="text-gray-500 mt-2">
                                    Modificando términos para el departamento <span className="font-bold text-indigo-600">
                                        {contrato.departamento[0]?.numero_departamento}
                                    </span>
                                </p>
                            </header>

                            <CustomForm<ContratoActualizarDTO>
                                schema={ContratoActualizarSchema}
                                onSubmit={onSubmit}
                                isPending={isPending}
                                formMode="onBlur"
                                defaultValues={{
                                    monto: Number(contrato.monto),
                                    frecuencia_pago: contrato.frecuencia_pago as any,
                                    dia_pago: contrato.dia_pago,
                                    fecha_inicio: contrato.fecha_inicio.toString().split('T')[0],
                                    fecha_fin: contrato.fecha_fin.toString().split('T')[0],
                                    al_dia: contrato.al_dia,
                                    descripcion: contrato.descripcion || ''
                                }}
                            >
                                {({control, errors}) => (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <InputForm
                                                name="monto"
                                                label="Monto del Alquiler (Gs.)"
                                                type="number"
                                                control={control}
                                                error={errors.monto}
                                            />
                                            <InputForm
                                                name="dia_pago"
                                                label="Día de Pago"
                                                type="number"
                                                control={control}
                                                error={errors.dia_pago}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <InputForm
                                                name="fecha_inicio"
                                                label="Fecha Inicio"
                                                type="date"
                                                control={control}
                                                error={errors.fecha_inicio}
                                            />
                                            <InputForm
                                                name="fecha_fin"
                                                label="Fecha Final"
                                                type="date"
                                                control={control}
                                                error={errors.fecha_fin}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-bold text-gray-700">Frecuencia</label>
                                                <select
                                                    {...control.register("frecuencia_pago")}
                                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                >
                                                    <option value="semanal">Semanal</option>
                                                    <option value="quincenal">Quincenal</option>
                                                    <option value="mensual">Mensual</option>
                                                    <option value="anual">Anual</option>
                                                </select>
                                            </div>

                                            <div className="flex flex-col justify-end">
                                                <label className="flex items-center gap-3 cursor-pointer p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                                                    <input
                                                        type="checkbox"
                                                        {...control.register("al_dia")}
                                                        className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                                    />
                                                    <span className="text-sm font-bold text-indigo-900">Inquilino al día</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-bold text-gray-700">Observaciones Adicionales</label>
                                            <textarea
                                                {...control.register("descripcion")}
                                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm min-h-[100px] focus:ring-2 focus:ring-indigo-500 outline-none"
                                                placeholder="Ej: Ajuste de precio anual..."
                                            />
                                        </div>

                                        {isError && (
                                            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-800 text-sm">
                                                <p className="font-bold">Error al actualizar contrato:</p>
                                                <p>{getErrorMessage(error)}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CustomForm>
                        </div>
                    </div>
                </div>
            )}
        </EntityLoader>
    );
}

export default EditarContrato;
