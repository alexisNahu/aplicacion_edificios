import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {useLogin} from "../../core/auth/useAuth";
import {LoginSchema, type LoginSchemaDTO} from "../../core/auth/schemas";

export default function LoginForm (){
    const { mutate: login, isPending, isError, error } = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginSchemaDTO>({
        resolver: zodResolver(LoginSchema),
    });

    const onSubmit = (data: LoginSchemaDTO) => {
        console.log(data)
        login(data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-8 rounded-xl shadow-lg bg-white">
                <h1 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Username</label>
                        <input
                            {...register("username")}
                            placeholder="Tu username"
                            className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.username && (
                            <span className="text-red-500 text-xs">{errors.username.message}</span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Contraseña</label>
                        <input
                            {...register("password")}
                            type="password"
                            placeholder="Tu contraseña"
                            className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.password && (
                            <span className="text-red-500 text-xs">{errors.password.message}</span>
                        )}
                    </div>

                    {isError && (
                        <span className="text-red-500 text-sm text-center">{error.message}</span>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {isPending ? "Iniciando sesión..." : "Iniciar sesión"}
                    </button>

                    <p className="text-sm text-center text-gray-500">
                        ¿No tenés cuenta?{" "}
                        <a href="/register" className="text-blue-600 hover:underline">
                            Registrate
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
};

