// features/contratos/context/ContratoContext.tsx
import React, {createContext, type ReactNode, useContext, useState} from 'react';
import type {ContratoFiltrosDTO} from "@/core/services/contratos/schemas";

interface ContratoContextType {
    dataFilters: ContratoFiltrosDTO;
    setDataFilters: React.Dispatch<React.SetStateAction<ContratoFiltrosDTO>>;
}

const ContratoContext = createContext<ContratoContextType | undefined>(undefined);

export const ContratoProvider = ({ children }: { children: ReactNode }) => {
    const [dataFilters, setDataFilters] = useState<ContratoFiltrosDTO>({
        page: 1,
        page_size: 10,
    });

    return (
        <ContratoContext.Provider value={{ dataFilters, setDataFilters }}>
            {children}
        </ContratoContext.Provider>
);
};

export const useContratoContext = () => {
    const context = useContext(ContratoContext);
    if (!context) throw new Error("useContratoContext debe usarse dentro de ContratoProvider");
    return context;
};
