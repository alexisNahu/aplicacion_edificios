import { APP_ROUTES } from "@/core";
import CustomForm from "@/components/Form/CustomForm";
import InputForm from '@/components/Form/components/CustomInput';
import { getErrorMessage } from '@/shared/utils';
import { navigate } from "astro:transitions/client";
import {useCreateEdificio} from "@/core/services/edificios/useEdificios";
import {type EdificioCrearDTO, EdificioCrearSchema} from "@/core/services/edificios/schemas";

function CreateEdificio() {
    const { mutate: createEdificio, isPending, isError, error } = useCreateEdificio();

    const onSubmit = (data: EdificioCrearDTO) => {
        createEdificio(data, {
            onSuccess: () => {
                navigate(APP_ROUTES.edificios);
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="h-2 bg-emerald-600" />

                <div className="p-10">
                    <header className="mb-10">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Nuevo Edificio</h1>
                        <p className="text-gray-500 mt-2">
                            Registra una nueva propiedad. Por defecto, se creará en estado **Activo**.
                        </p>
                    </header>

                    <CustomForm<EdificioCrearDTO>
                        schema={EdificioCrearSchema}
                        onSubmit={onSubmit}
                        isPending={isPending}
                        formMode="onBlur"
                        defaultValues={{
                            nombre: 'si',
                            direccion: 'si',
                            descripcion: 'si',
                        }}
                    >
                        {({ control, errors }) => (
                            <div className="space-y-6">
                                {/* Nombre */}
                                <InputForm
                                    name="nombre"
                                    label="Nombre del Edificio"
                                    placeholder="Ej: Torre San Lorenzo I"
                                    control={control}
                                    error={errors.nombre}
                                />

                                {/* Dirección */}
                                <InputForm
                                    name="direccion"
                                    label="Dirección Exacta"
                                    placeholder="Ej: Avda. Mariscal López casi Tte. Benítez"
                                    control={control}
                                    error={errors.direccion}
                                />

                                {/* Descripción (Ancho completo al no haber selector de estado) */}
                                <InputForm
                                    name="descripcion"
                                    label="Descripción / Nota adicional"
                                    placeholder="Ej: Edificio de 4 pisos, zona céntrica..."
                                    control={control}
                                    error={errors.descripcion}
                                />

                                {isError && (
                                    <div className="flex items-center gap-3 bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded-r-xl text-sm shadow-sm animate-in fade-in slide-in-from-left-2">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-xs uppercase tracking-wider">Error de registro</span>
                                            <span className="opacity-90">{getErrorMessage(error)}</span>
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

export default CreateEdificio;
