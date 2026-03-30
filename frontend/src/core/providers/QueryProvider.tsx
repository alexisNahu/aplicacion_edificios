import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {type ReactNode, useEffect, useState} from "react";
import {queryClient} from "../httpClient";

export default function QueryProvider ({ children }: { children: ReactNode }) {

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};
