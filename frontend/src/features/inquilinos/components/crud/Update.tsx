import { useInquilinos, useUpdateInquilino } from "@/core/services/inquilinos/useInquilinos";
import { EntityLoader } from "@/components/PageLoaderLayout/PageLoaderLayout";
import { APP_ROUTES } from "@/core";
import { type InquilinoActualizarDTO, InquilinoActualizarSchema, TipoIdentificacionEnum } from "@/core/services/inquilinos/schemas";
import CustomForm from "@/components/Form/CustomForm";
import InputForm from '@/components/Form/components/CustomInput';
import { getErrorMessage } from '@/shared/utils';
import { navigate } from "astro:transitions/client";

function UpdateInquilino({ id }: { id: string }) {
    const query = useInquilinos({id: Number(id) });

    const { mutate: updateInquilino, isPending, isError, error } = useUpdateInquilino();

    const inquilinoQueryResult = {
        ...query,
        data: query.data?.data?.[0]
    };

    const onSubmit = (formData: InquilinoActualizarDTO) => {
        updateInquilino({ id: Number(id), payload: formData }, {
            onSuccess: () => {
                navigate(`${APP_ROUTES.inquilinos}/${id}`);
            }
        });
    };

    return (
        <EntityLoader
            queryResult={inquilinoQueryResult}
            redirectPath={APP_ROUTES.inquilinos}
            entityName="Inquilino"
        >
            {(inquilino) => (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">

                    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                        <div className="h-2 bg-emerald-600"/>

                        <div className="p-10">
                            <header className="mb-10">
                                <h1 className="text-3xl font-black text-gray-900">Actualizar Inquilino</h1>
                                <p className="text-gray-500 mt-2">
                                    Editando el perfil de <span className="font-bold text-emerald-600">
                                        {inquilino.nombre_completo}
                                    </span>
                                </p>
                            </header>

                            <CustomForm<InquilinoActualizarDTO>
                                schema={InquilinoActualizarSchema}
                                onSubmit={onSubmit}
                                isPending={isPending}
                                formMode="onBlur"
                                defaultValues={{
                                    nombre_completo: inquilino.nombre_completo,
                                    numero_identificacion: inquilino.numero_identificacion,
                                    tipo_identificacion: inquilino.tipo_identificacion as any,
                                    telefono: inquilino.telefono,
                                    email: inquilino.email,
                                    status: inquilino.status
                                }}
                            >
                                {({control, errors}) => (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 gap-6">
                                            <InputForm
                                                name="nombre_completo"
                                                label="Nombre Completo"
                                                placeholder="Ej: Juan Pérez"
                                                control={control}
                                                error={errors.nombre_completo}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-bold text-gray-700">Tipo de Documento</label>
                                                <select
                                                    {...control.register("tipo_identificacion")}
                                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                                >
                                                    {TipoIdentificacionEnum.options.map(option => (
                                                        <option key={option} value={option}>{option}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <InputForm
                                                name="numero_identificacion"
                                                label="N° de Identificación"
                                                control={control}
                                                error={errors.numero_identificacion}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <InputForm
                                                name="telefono"
                                                label="Teléfono / Celular"
                                                control={control}
                                                error={errors.telefono}
                                            />
                                            <InputForm
                                                name="email"
                                                label="Correo Electrónico"
                                                type="email"
                                                control={control}
                                                error={errors.email}
                                            />
                                        </div>

                                        {isError && (
                                            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-800 text-sm">
                                                <p className="font-bold">Error al actualizar inquilino:</p>
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

export default UpdateInquilino;
