import {
    type Control,
    type DefaultValues,
    type FieldError,
    type FieldErrors,
    type FieldValues,
    useForm
} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import type {ReactNode} from "react";

interface Props<T extends FieldValues> {
    schema: z.ZodType<T, any, any>;
    onSubmit: (data: T) => void;
    isPending: boolean;
    children: (methods: {control: Control<T>; errors: FieldErrors<T>}) => ReactNode
    formMode: "onSubmit" | "onBlur" | "onChange" | "onTouched" | "all" | undefined
    defaultValues: DefaultValues<T>
}

const CustomForm = <T extends FieldValues>({isPending, schema, onSubmit, children, formMode, defaultValues}: Props<T>) => {
    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm<T>({
        resolver: zodResolver(schema),
        mode: formMode,
        defaultValues: defaultValues ?? {} as DefaultValues<T>
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {children({ control, errors })}

            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-blue-600 text-white rounded-xl py-3 text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none transition-all duration-200 flex justify-center items-center gap-2"
            >
                {isPending ? "Validando..." : "Entrar al Sistema"}
            </button>
        </form>
    )
}

export default CustomForm
