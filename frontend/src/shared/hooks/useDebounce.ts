import { useEffect, useState } from 'react';

/**
 * Hook para retrasar la actualización de un valor.
 * @param value El valor que cambia rápidamente (ej. el input de búsqueda).
 * @param delay El tiempo de espera en milisegundos (por defecto 500ms).
 * @returns El valor "debounced" que solo se actualiza tras el delay.
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}
