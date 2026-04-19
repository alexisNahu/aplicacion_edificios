// features/inquilinos/context/InquilinoContext.tsx
import React, { createContext, type ReactNode, useContext, useState } from 'react';
// Asumiendo que sigues la misma estructura de carpetas para tus esquemas
import type { InquilinoFiltrosDTO } from "@/core/services/inquilinos/schemas";

interface InquilinoContextType {
    dataFilters: InquilinoFiltrosDTO;
    setDataFilters: React.Dispatch<React.SetStateAction<InquilinoFiltrosDTO>>;
}

export const defaultInquilinoPagination: InquilinoFiltrosDTO = {
    page: 1,
    page_size: 5,
    // Aquí puedes agregar otros filtros por defecto si tu DTO los tiene
    // ej: activo: true
}

const InquilinoContext = createContext<InquilinoContextType | undefined>(undefined);

export const InquilinoProvider = ({ children }: { children: ReactNode }) => {
    const [dataFilters, setDataFilters] = useState<InquilinoFiltrosDTO>(defaultInquilinoPagination);

    return (
        <InquilinoContext.Provider value={{ dataFilters, setDataFilters }}>
            {children}
        </InquilinoContext.Provider>
    );
};

export const useInquilinoContext = () => {
    const context = useContext(InquilinoContext);
    if (!context) {
        throw new Error("useInquilinoContext debe usarse dentro de InquilinoProvider");
    }
    return context;
};
