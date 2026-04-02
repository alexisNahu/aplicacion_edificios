// features/inquilinos/hooks/useInquilinos.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InquilinosService } from "@/core/services/inquilinos/services";
import type {
    InquilinoCrearDTO,
    InquilinoActualizarDTO,
    InquilinoFiltrosDTO
} from "@/core/services/inquilinos/schemas";
import { queryClient as globalQueryClient } from "@/core";

// 1. DEFINICIÓN DE KEYS PARA CACHÉ
export const INQUILINOS_KEYS = {
    all: ['inquilinos'] as const,
    lists: () => [...INQUILINOS_KEYS.all, 'list'] as const,
    list: (filters: InquilinoFiltrosDTO) => [...INQUILINOS_KEYS.lists(), filters] as const,
    detail: (id: string | undefined) => [...INQUILINOS_KEYS.all, 'detail', id] as const,
};

// 2. HOOK PARA OBTENER LISTADO (QUERY)
export const useInquilinos = (filters: InquilinoFiltrosDTO) => {
    return useQuery({
        queryKey: INQUILINOS_KEYS.list(filters),
        queryFn: () => InquilinosService.get(filters),
        // Mantenemos los datos previos para evitar el "salto" visual en la paginación
        placeholderData: (previousData) => previousData,
    });
};

// 3. HOOK PARA CREAR (MUTATION)
export const useCreateInquilino = () => {
    return useMutation({
        mutationFn: (payload: InquilinoCrearDTO) => InquilinosService.create(payload),
        onSuccess: () => {
            // Invalidamos todas las listas de inquilinos para forzar el refetch
            globalQueryClient.invalidateQueries({ queryKey: INQUILINOS_KEYS.lists() });
        },
    }, globalQueryClient);
};

// 4. HOOK PARA ACTUALIZAR (MUTATION)
export const useUpdateInquilino = () => {
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: InquilinoActualizarDTO }) =>
            InquilinosService.update(id, payload),
        onSuccess: (response) => {
            // Invalidamos listas y el detalle específico del inquilino editado
            globalQueryClient.invalidateQueries({ queryKey: INQUILINOS_KEYS.lists() });
            globalQueryClient.invalidateQueries({
                queryKey: INQUILINOS_KEYS.detail(response.data.id)
            });
        },
    }, globalQueryClient);
};

// 5. HOOK PARA ELIMINAR (MUTATION)
export const useDeleteInquilino = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => InquilinosService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: INQUILINOS_KEYS.lists() });
        },
    });
};
