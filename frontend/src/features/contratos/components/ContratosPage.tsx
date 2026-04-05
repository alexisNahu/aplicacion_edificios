// src/features/contratos/ContratosPage.tsx (o un nombre similar)
import { ContratoProvider } from "../contratos.context";
import Contratos from "../Contratos";
import {queryClient} from "@/core";
import {QueryClientProvider} from "@tanstack/react-query";

export default function ContratosPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <ContratoProvider>
                <Contratos />
            </ContratoProvider>
        </QueryClientProvider>

    );
}
