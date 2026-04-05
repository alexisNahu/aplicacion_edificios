import { APP_ROUTES, RegisterSchema, type RegisterSchemaDTO, useRegister } from "@/core";
import InputForm from '@/components/Form/components/CustomInput';
import CustomForm from "@/components/Form/CustomForm";
import { getErrorMessage } from '@/shared/utils';

function RegisterForm() {
    const { mutate: registerUser, isPending, isError, error } = useRegister();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform transition-all">
                <div className="h-2 bg-green-600" />

                <div className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Crear Cuenta</h1>
                        <p className="text-gray-500 mt-2 text-sm">Registrate para comenzar a gestionar tus edificios</p>
                    </div>

                    <CustomForm<RegisterSchemaDTO>
                        schema={RegisterSchema}
                        onSubmit={(data: RegisterSchemaDTO) => registerUser(data)}
                        isPending={isPending}
                        formMode="onTouched"
                    >
                        {({ control, errors }) => (
                            <div className="space-y-5">
                                <InputForm
                                    name="username"
                                    label="Usuario"
                                    placeholder="Ej: alexis_dev"
                                    control={control}
                                    error={errors.username}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <InputForm
                                        name="first_name"
                                        label="Nombre"
                                        placeholder="Alexis"
                                        control={control}
                                        error={errors.first_name}
                                    />
                                    <InputForm
                                        name="last_name"
                                        label="Apellido"
                                        placeholder="Idoyaga"
                                        control={control}
                                        error={errors.last_name}
                                    />
                                </div>

                                <InputForm
                                    name="email"
                                    label="Correo Electrónico"
                                    placeholder="ejemplo@correo.com"
                                    control={control}
                                    error={errors.email}
                                />

                                <InputForm
                                    name="password"
                                    label="Contraseña"
                                    type="password"
                                    placeholder="••••••••"
                                    control={control}
                                    error={errors.password}
                                />

                                <InputForm
                                    name="repeat_password"
                                    label="Confirmar Contraseña"
                                    type="password"
                                    placeholder="••••••••"
                                    control={control}
                                    error={errors.repeat_password}
                                />

                                {isError && (
                                    <div className="flex items-center gap-2 bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-r-lg text-sm animate-pulse">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <span className="font-medium">{getErrorMessage(error)}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </CustomForm>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200"></span></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400 font-medium">¿Ya tienes cuenta?</span></div>
                    </div>

                    <p className="text-sm text-center text-gray-500">
                        Regresar al{" "}
                        <a href={APP_ROUTES.auth.login} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                            Iniciar Sesión
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterForm;
