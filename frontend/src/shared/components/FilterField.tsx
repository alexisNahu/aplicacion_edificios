import { useState, useEffect, type ReactNode } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";

interface Props {
    onFilter: (val: string) => void;
    label?: string;
    placeholder?: string;
    suggestions?: string[];
    renderSuggestion?: (name: string) => ReactNode;
    maxSuggestions?: number;
    value: string
}

function FilterField({
                         onFilter,
                         label,
                         placeholder = "Buscar...",
                         suggestions = [],
                         renderSuggestion,
                         maxSuggestions = 5,
                         value
                     }: Props) {
    const [term, setTerm] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);


    // Lógica de filtrado local para las sugerencias
    const filteredSuggestions = suggestions
        .filter(item => item.toLowerCase().includes(term.toLowerCase()))
        .slice(0, maxSuggestions);

    const handleSelectSuggestion = (value: string) => {
        setTerm(value);
        setShowSuggestions(false);
        onFilter(value);
    };

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
                onFocus={() => setShowSuggestions(true)}
                placeholder={placeholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                autoComplete="off"
            />

            {/* Lista de Sugerencias */}
            {showSuggestions && term && filteredSuggestions.length > 0 && (
                <ul className="absolute z-50 w-full top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto">
                    {filteredSuggestions.map((name) => (
                        <li
                            key={name}
                            onClick={() => handleSelectSuggestion(name)}
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 border-b last:border-b-0"
                        >
                            {renderSuggestion ? renderSuggestion(name) : name}
                        </li>
                    ))}
                </ul>
            )}

            {/* Overlay invisible para cerrar al hacer click fuera */}
            {showSuggestions && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowSuggestions(false)}
                />
            )}
        </div>
    );
}

export default FilterField;
