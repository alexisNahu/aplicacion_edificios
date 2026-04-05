interface Props {
    onFilter: (val: string) => void;
    label?: string;
    placeholder?: string;
    value: string
}

function InputField({
                         onFilter,
                         label,
                         placeholder = "Buscar...",
                         value
                     }: Props) {
    return (
        <div className="flex flex-col gap-1.5 relative">
            {label && (
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {label}
                </label>
            )}

            <input
                value={value}
                onChange={(e) => onFilter(e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                autoComplete="off"
            />
        </div>
    );
}

export default InputField;
