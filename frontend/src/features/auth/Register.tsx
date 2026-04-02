import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {APP_ROUTES, RegisterSchema, type RegisterSchemaDTO, useRegister} from "@/core";
import { useEffect, useState } from "react";
import InputForm from '../../components/customForm/components/CustomInput';

function Register() {
    const { mutate: registerUser, isPending, isError, error } = useRegister();
    const [response, setResponse] = useState<string>('');

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterSchemaDTO>({
        resolver: zodResolver(RegisterSchema),
        mode: "onTouched"
    });

    useEffect(() => {
        const statusCode = (error as any)?.response?.status;

        if (statusCode === 409) setResponse('El nombre de usuario o email ya existe');
        else if (statusCode === 400) setResponse('Los datos enviados son inválidos');
        else if (isError) setResponse('Ocurrió un error al intentar registrarse');
    }, [error, isError]);

    const onSubmit = (data: RegisterSchemaDTO) => {
        registerUser(data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform transition-all">
                {/* Cambiamos el color de la barra a verde para diferenciarlo visualmente del Login */}
                <div className="h-2 bg-green-600" />

                <div className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Crear Cuenta</h1>
                        <p className="text-gray-500 mt-2 text-sm">Registrate para comenzar a gestionar tus edificios</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                        <InputForm
                            name="username"
                            label="Usuario"
                            placeholder="Ej: alexis_dev"
                            control={control}
                            error={errors.username}
                        />

                        <InputForm
                            name="first_name"
                            label="Primer nombre"
                            placeholder="Ej: alexis"
                            control={control}
                            error={errors.first_name}
                        />

                        <InputForm
                            name="last_name"
                            label="Apellido"
                            placeholder="Ej: idoyaga"
                            control={control}
                            error={errors.last_name}
                        />

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
                                <span className="font-medium">{response}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-green-600 text-white rounded-xl py-3 text-sm font-bold shadow-lg shadow-green-200 hover:bg-green-700 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none transition-all duration-200 flex justify-center items-center gap-2"
                        >
                            {isPending ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Procesando...
                                </>
                            ) : "Registrarme"}
                        </button>

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
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
