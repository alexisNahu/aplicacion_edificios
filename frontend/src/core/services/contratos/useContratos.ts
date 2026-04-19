import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ContratosService } from "./services";
import type {
    ContratoCrearDTO,
    ContratoActualizarDTO,
    ContratoFiltrosDTO
} from "./schemas";
import {queryClient} from "@/core";

export const CONTRATOS_KEYS = {
    all: ['contratos'] as const,
    list: (filters: ContratoFiltrosDTO) => [...CONTRATOS_KEYS.all, 'list', filters] as const,
    detail: (id: number | undefined) => [...CONTRATOS_KEYS.all, 'detail', id] as const,
};

export const useContratos = (filters: ContratoFiltrosDTO) => {
    console.log(filters)
    return useQuery({
        queryKey: CONTRATOS_KEYS.list(filters),
        queryFn: () => ContratosService.get(filters),
        // Mantiene los datos anteriores mientras carga los nuevos (ideal para paginación)
        placeholderData: (previousData) => previousData,
    }, queryClient);
};

export const useCreateContrato = () => {

    return useMutation({
        mutationFn: (payload: ContratoCrearDTO) => ContratosService.create(payload),
        onSuccess: () => {
            // Refresca todas las listas de contratos cuando uno nuevo es creado
            queryClient.invalidateQueries({ queryKey: CONTRATOS_KEYS.all });
        },
    }, queryClient);
};

export const useUpdateContrato = () => {
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: ContratoActualizarDTO }) =>
            ContratosService.update(id, payload),
        onSuccess: (response) => {
            // Invalidamos la lista general
            queryClient.invalidateQueries({ queryKey: CONTRATOS_KEYS.all });
            // Y actualizamos la caché específica de ese contrato si existiera una vista detalle
            queryClient.invalidateQueries({ queryKey: CONTRATOS_KEYS.detail(response.data.id) });
        },
    }, queryClient);
};

export const useDeleteContrato = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => ContratosService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CONTRATOS_KEYS.all });
        },
    }, queryClient);
};
