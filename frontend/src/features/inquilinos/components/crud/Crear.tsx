import { useCreateInquilino } from "@/core/services/inquilinos/useInquilinos";
import {
    type InquilinoCrearDTO,
    InquilinoCrearSchema,
    TipoIdentificacionEnum
} from "@/core/services/inquilinos/schemas";
import { EntityLoader } from "@/components/PageLoaderLayout/PageLoaderLayout";
import { APP_ROUTES } from "@/core";
import CustomForm from "@/components/Form/CustomForm";
import InputForm from '@/components/Form/components/CustomInput';
import { getErrorMessage } from '@/shared/utils';
import { navigate } from "astro:transitions/client";

function Create() {
    const { mutate: createInquilino, isPending, isError, error } = useCreateInquilino();

    const onSubmit = (data: InquilinoCrearDTO) => {
        createInquilino(data, {
            onSuccess: () => {
                navigate(APP_ROUTES.inquilinos);
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="h-2 bg-emerald-600" />

                <div className="p-10">
                    <header className="mb-10">
                        <h1 className="text-3xl font-black text-gray-900">Nuevo Inquilino</h1>
                        <p className="text-gray-500 mt-2">
                            Registra los datos personales y de contacto del nuevo residente.
                        </p>
                    </header>

                    <CustomForm<InquilinoCrearDTO>
                        schema={InquilinoCrearSchema}
                        onSubmit={onSubmit}
                        isPending={isPending}
                        formMode="onBlur"
                        defaultValues={{
                            nombre_completo: '',
                            numero_identificacion: '',
                            tipo_identificacion: 'Cedula', // Valor inicial por defecto
                            telefono: '',
                            email: '',
                        }}
                    >
                        {({ control, errors }) => (
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

                                {/* Identificación: Tipo y Número */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-gray-700">
                                            Tipo de Documento
                                        </label>
                                        <select
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                        >
                                            {TipoIdentificacionEnum.options.map(option => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.tipo_identificacion && (
                                            <span className="text-xs text-red-500">{errors.tipo_identificacion.message}</span>
                                        )}
                                    </div>

                                    <InputForm
                                        name="numero_identificacion"
                                        label="N° de Identificación"
                                        placeholder="Ej: 1234567"
                                        control={control}
                                        error={errors.numero_identificacion}
                                    />
                                </div>

                                {/* Contacto: Teléfono y Email */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputForm
                                        name="telefono"
                                        label="Teléfono / Celular"
                                        placeholder="Ej: 0981123456"
                                        control={control}
                                        error={errors.telefono}
                                    />

                                    <InputForm
                                        name="email"
                                        label="Correo Electrónico"
                                        type="email"
                                        placeholder="juan.perez@example.com"
                                        control={control}
                                        error={errors.email}
                                    />
                                </div>

                                {/* Mensaje de Error del Servidor */}
                                {isError && (
                                    <div className="flex items-center gap-3 bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded-r-xl text-sm shadow-sm transition-all animate-in fade-in slide-in-from-left-2">
                                        <div className="flex flex-col">
                                            <span className="font-bold">Error al guardar</span>
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

export default Create;
