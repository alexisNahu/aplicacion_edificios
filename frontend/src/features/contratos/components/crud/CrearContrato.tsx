import InputForm from '@/components/Form/components/CustomInput';
import CustomForm from "@/components/Form/CustomForm";
import { getErrorMessage } from '@/shared/utils';
import { useCreateContrato } from "@/core/services/contratos/useContratos";
import { type ContratoCrearDTO, ContratoCrearSchema } from "@/core/services/contratos/schemas";
import { navigate } from "astro:transitions/client";
import { APP_ROUTES } from "@/core";

function CreateContrato() {
    const { mutate: createContrato, isPending, isError, error } = useCreateContrato();

    const onSubmit = (data: ContratoCrearDTO) => {
        createContrato(data, {
            onSuccess: () => {navigate(APP_ROUTES.contratos_crear);}
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="h-2 bg-indigo-600" />

                <div className="p-10">
                    <div className="mb-10">
                        <h1 className="text-3xl font-black text-gray-900">Nuevo Contrato</h1>
                        <p className="text-gray-500 mt-2">Registra la vinculación de un inquilino con un departamento.</p>
                    </div>

                    <CustomForm<ContratoCrearDTO>
                        schema={ContratoCrearSchema}
                        onSubmit={onSubmit}
                        isPending={isPending}
                        formMode="onBlur"
                        defaultValues={{
                            numero_departamento: '1018', // Valor inicial solicitado
                            numero_identificacion: '1234567890',
                            monto: 20,
                            frecuencia_pago: 'mensual',
                            dia_pago: 5,
                            fecha_inicio: new Date().toISOString().split('T')[0],
                            fecha_fin: '2029-05-05',
                            status: true,
                            al_dia: true
                        }}
                    >
                        {({ control, errors }) => (
                            <div className="space-y-6">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputForm
                                        name="numero_departamento"
                                        label="N° Departamento"
                                        placeholder="Ej: 1018"
                                        control={control}
                                        error={errors.numero_departamento}
                                    />

                                    <InputForm
                                        name="numero_identificacion"
                                        label="Cédula Inquilino"
                                        placeholder="Ej: 4567890"
                                        control={control}
                                        error={errors.numero_identificacion}
                                    />
                                </div>

                                <hr className="border-gray-100" />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputForm
                                        name="monto"
                                        label="Monto Mensual"
                                        type="number"
                                        placeholder="0.00"
                                        control={control}
                                        error={errors.monto}
                                    />

                                    <InputForm
                                        name="dia_pago"
                                        label="Día de cobro"
                                        type="number"
                                        placeholder="Ej: 5"
                                        control={control}
                                        error={errors.dia_pago}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputForm
                                        name="fecha_inicio"
                                        label="Fecha de Inicio"
                                        type="date"
                                        control={control}
                                        error={errors.fecha_inicio}
                                    />

                                    <InputForm
                                        name="fecha_fin"
                                        label="Fecha de Finalización"
                                        type="date"
                                        control={control}
                                        error={errors.fecha_fin}
                                    />

                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-gray-700">Frecuencia</label>
                                        <select
                                            {...control.register("frecuencia_pago")}
                                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        >
                                            <option value="semanal">Semanal</option>
                                            <option value="quincenal">Quincenal</option>
                                            <option value="mensual">Mensual</option>
                                            <option value="bimestral">Bimestral</option>
                                            <option value="trimestral">Trimestral</option>
                                            <option value="semestral">Semestral</option>
                                            <option value="anual">Anual</option>
                                        </select>
                                        {errors.frecuencia_pago && (
                                            <span
                                                className="text-xs text-red-500">{errors.frecuencia_pago.message}</span>
                                        )}
                                    </div>
                                </div>

                                {isError && (
                                    <div className="flex items-center gap-3 bg-amber-50 border-l-4 border-amber-500 text-amber-800 p-4 rounded-r-xl text-sm shadow-sm">
                                        <div className="flex flex-col">
                                            <span className="font-bold">Error</span>
                                            <span>{getErrorMessage(error)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </CustomForm>
                </div>
            </div>
        </div>
    );
}

export default CreateContrato;
