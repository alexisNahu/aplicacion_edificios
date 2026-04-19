// features/contratos/context/ContratoContext.tsx
import React, {createContext, type ReactNode, useContext, useState} from 'react';
import type {ContratoFiltrosDTO} from "@/core/services/contratos/schemas";
import type {EdificioFiltrosDTO} from "@/core/services/edificios/schemas";

interface EdificiosContextType {
    dataFilters: EdificioFiltrosDTO;
    setDataFilters: React.Dispatch<React.SetStateAction<EdificioFiltrosDTO>>;
}

export const defaultPaginationOptions: EdificioFiltrosDTO = {
    page: 1,
    page_size: 5
}

const EdificioContext = createContext<EdificiosContextType | undefined>(undefined);

export const EdificioProvider = ({ children }: { children: ReactNode }) => {
    const [dataFilters, setDataFilters] = useState<EdificioFiltrosDTO>(defaultPaginationOptions);

    return (
        <EdificioContext.Provider value={{ dataFilters, setDataFilters }}>
            {children}
        </EdificioContext.Provider>

    );
};

export const useEdificioContext = () => {
    const context = useContext(EdificioContext);
    if (!context) throw new Error("useContratoContext debe usarse dentro de EdificioProvider");
    return context;
};
