// src/features/contratos/ContratosPage.tsx (o un nombre similar)
import { ContratoProvider } from "../contratos.context";
import Contratos from "../Contratos";

export default function ContratosPage() {
    return (
        <ContratoProvider>
            <Contratos />
        </ContratoProvider>
    );
}
