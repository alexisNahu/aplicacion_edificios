import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {type ApiResponse, APP_ROUTES, LoginSchema, type LoginSchemaDTO, useLogin} from "@/core";
import {useEffect, useState} from "react";
import InputForm from '../../components/customForm/components/CustomInput'

function Login() {
    const { mutate: login, isPending, isError, error } = useLogin();
    const [response, setResponse] = useState<string>('');

    const {
        control, // 👈 Extraemos control para pasarlo a los InputForm
        handleSubmit,
        formState: { errors },
    } = useForm<LoginSchemaDTO>({
        resolver: zodResolver(LoginSchema),
        mode: "onTouched"
    });

    useEffect(() => {
        const statusCode = (error as any)?.response?.status;
        if (statusCode === 401) setResponse('Credenciales inválidas');
        else if (statusCode === 403) setResponse('No tienes permisos');
        else if (isError) setResponse('Ocurrió un error inesperado');
    }, [error, isError]);

    const onSubmit = (data: LoginSchemaDTO) => {
        login(data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform transition-all">
                <div className="h-2 bg-blue-600" />

                <div className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Bienvenido</h1>
                        <p className="text-gray-500 mt-2 text-sm">Ingresá tus credenciales para gestionar tus edificios</p>
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
                            name="password"
                            label="Contraseña"
                            type="password"
                            placeholder="••••••••"
                            control={control}
                            error={errors.password}
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
                            className="w-full bg-blue-600 text-white rounded-xl py-3 text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none transition-all duration-200 flex justify-center items-center gap-2"
                        >
                            {isPending ? "Validando..." : "Entrar al Sistema"}
                        </button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200"></span></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400">O también</span></div>
                        </div>

                        <p className="text-sm text-center text-gray-500">
                            ¿Nuevo en la plataforma?{" "}
                            <a href={APP_ROUTES.auth.register} className="text-blue-600 font-bold hover:text-blue-800 transition-colors">
                                Crea una cuenta
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
