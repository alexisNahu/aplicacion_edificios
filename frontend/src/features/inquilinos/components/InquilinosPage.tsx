import Inquilinos from "../Inquilinos";
import { queryClient } from "@/core";
import { QueryClientProvider } from "@tanstack/react-query";
import {InquilinoProvider} from "@/features/inquilinos/components/inquilinos.context";

export default function InquilinosPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <InquilinoProvider>
                <Inquilinos />
            </InquilinoProvider>
        </QueryClientProvider>
    );
}
