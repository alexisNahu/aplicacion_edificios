// src/shared/hooks/useTableFilters.ts
import { useState, useCallback } from 'react';

export function useTableFilters<T>(initialFilters: T) {
    const [filters, setFilters] = useState<T>(initialFilters);

    const updateFilters = useCallback((newFilters: Partial<T>) => {
        setFilters((prev) => ({
            ...prev,
            ...newFilters,
            page: 1,
        }));
    }, []);

    const goToPage = useCallback((page: number) => {
        setFilters((prev) => ({
            ...prev,
            page,
        }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters(initialFilters);
    }, [initialFilters]);

    return {
        filters,
        updateFilters,
        goToPage,
        resetFilters
    };
}
