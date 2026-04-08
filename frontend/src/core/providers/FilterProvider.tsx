import React, { createContext, useContext, useState, useMemo, type ReactNode } from 'react';

export interface BaseFilterState {
    page: number;
    page_size: number;
    search?: string;
}

interface FilterContextType<T extends BaseFilterState> {
    filters: T;
    setFilters: (newFilters: Partial<T>) => void;
}

export function createFilterContext<T extends BaseFilterState>(initialState: T) {
    const FilterContext = createContext<FilterContextType<T> | undefined>(undefined);

    const FilterProvider = ({ children }: { children: ReactNode }) => {
        const [filters, _setFilters] = useState<T>(initialState);

        // Actualización parcial simple
        const setFilters = (newFilters: Partial<T>) => {
            _setFilters(prev => ({ ...prev, ...newFilters }));
        };

        const value = useMemo(() => ({
            filters,
            setFilters,
        }), [filters]);

        return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
    };

    const useFilterContext = () => {
        const context = useContext(FilterContext);
        if (!context) throw new Error("useFilterContext debe usarse dentro de un Provider");
        return context;
    };

    return { FilterProvider, useFilterContext };
}
