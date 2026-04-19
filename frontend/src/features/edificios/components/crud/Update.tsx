import { useEdificios, useUpdateEdificio } from "@/core/services/edificios/useEdificios";
import { EntityLoader } from "@/components/PageLoaderLayout/PageLoaderLayout";
import { APP_ROUTES } from "@/core";
import CustomForm from "@/components/Form/CustomForm";
import InputForm from '@/components/Form/components/CustomInput';
import { getErrorMessage } from '@/shared/utils';
import { navigate } from "astro:transitions/client";
import { Controller } from "react-hook-form";
import {type EdificioActualizarDTO, EdificioActualizarSchema} from "@/core/services/edificios/schemas";

function EditarEdificio({ id }: { id: string }) {
    const query = useEdificios({ id: Number(id) });

    const { mutate: updateEdificio, isPending, isError, error } = useUpdateEdificio();

    const edificioQueryResult = {
        ...query,
        data: query.data?.data?.[0]
    };

    const onSubmit = (formData: EdificioActualizarDTO) => {
        updateEdificio({ id: Number(id), payload: formData }, {
            onSuccess: () => {
                navigate(APP_ROUTES.edificios);
            }
        });
    };

    return (
        <EntityLoader
            queryResult={edificioQueryResult}
            redirectPath={APP_ROUTES.edificios}
            entityName="Edificio"
        >
            {(edificio) => (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                        <div className="h-2 bg-emerald-600"/>

                        <div className="p-10">
                            <header className="mb-10">
                                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Editar Edificio</h1>
                                <p className="text-gray-500 mt-2">
                                    Actualizando la información de <span className="font-bold text-emerald-600">
                                        {edificio.nombre}
                                    </span>
                                </p>
                            </header>

                            <CustomForm<EdificioActualizarDTO>
                                schema={EdificioActualizarSchema}
                                onSubmit={onSubmit}
                                isPending={isPending}
                                formMode="onBlur"
                                defaultValues={{
                                    nombre: edificio.nombre,
                                    direccion: edificio.direccion || '',
                                    descripcion: edificio.descripcion || '',
                                    status: edificio.status
                                }}
                            >
                                {({control, errors}) => (
                                    <div className="space-y-6">
                                        {/* Nombre */}
                                        <InputForm
                                            name="nombre"
                                            label="Nombre del Edificio"
                                            control={control}
                                        />

                                        {/* Dirección */}
                                        <InputForm
                                            name="direccion"
                                            label="Dirección"
                                            control={control}
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Descripción */}
                                            <InputForm
                                                name="descripcion"
                                                label="Descripción / Nota"
                                                control={control}
                                            />

                                        </div>

                                        {isError && (
                                            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-800 text-sm animate-in fade-in">
                                                <p className="font-bold">Error al actualizar:</p>
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

export default EditarEdificio;
