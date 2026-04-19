import {queryClient} from "@/core";
import {QueryClientProvider} from "@tanstack/react-query";
import Edificios from "@/features/edificios/Edificios";
import {EdificioProvider} from "@/features/edificios/components/context"

export default function ContratosPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <EdificioProvider>
                <Edificios />
            </EdificioProvider>
        </QueryClientProvider>

    );
}
