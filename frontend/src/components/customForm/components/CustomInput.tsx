import { type Control, Controller, type FieldError, type FieldValues, type Path } from "react-hook-form";

interface Props<T extends FieldValues> {
    name: Path<T>;          // Path<T> asegura que el 'name' exista en tu esquema
    control: Control<T>;     // El control ahora coincide exactamente con el del formulario
    label: string;
    type?: string;
    error?: FieldError;
    placeholder?: string;
}

// Pasamos el genérico al componente
const InputForm = <T extends FieldValues>({
                                              name,
                                              control,
                                              label,
                                              type,
                                              error,
                                              placeholder
                                          }: Props<T>) => {
    return (
        <div className="space-y-1">
            <label htmlFor={name} className="text-xs font-semibold text-gray-600 uppercase tracking-wider ml-1">
                {label}
            </label>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <>
                        <input
                            {...field}
                            value={field.value ?? ''}
                            id={name}
                            type={type}
                            placeholder={placeholder}
                            className={`w-full px-4 py-3 rounded-xl text-sm border outline-none transition-all duration-200 
                            ${error
                                ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
                                : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                            }`}
                        />
                        {error && (
                            <p className="text-red-500 text-xs mt-1 ml-1 font-medium italic">
                                {error.message}
                            </p>
                        )}
                    </>
                )}
            />
        </div>
    );
};

export default InputForm
