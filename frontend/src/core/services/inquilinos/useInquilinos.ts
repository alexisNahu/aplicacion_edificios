// features/inquilinos/hooks/useInquilinos.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import { InquilinosService } from "@/core/services/inquilinos/services";
import type {
    InquilinoCrearDTO,
    InquilinoActualizarDTO,
    InquilinoFiltrosDTO
} from "@/core/services/inquilinos/schemas";
// Importamos la instancia centralizada
import { queryClient } from "@/core";

// 1. KEYS
export const INQUILINOS_KEYS = {
    all: ['inquilinos'] as const,
    lists: () => [...INQUILINOS_KEYS.all, 'list'] as const,
    list: (filters: InquilinoFiltrosDTO) => [...INQUILINOS_KEYS.lists(), filters] as const,
    detail: (id: number) => [...INQUILINOS_KEYS.all, 'detail', id] as const,
};

// 2. QUERY
// 2. QUERY (CORREGIDO)
export const useInquilinos = (filters: InquilinoFiltrosDTO) => {
    return useQuery({
        queryKey: INQUILINOS_KEYS.list(filters),
        queryFn: () => InquilinosService.get(filters),
        // IMPORTANTE: Solo usar placeholder para la LISTA general (paginación),
        // NUNCA para un detalle individual por ID.
        placeholderData: filters.id ? undefined : (previousData) => previousData,
        // Forzamos a que si es un ID específico, la data se considere vieja de inmediato
        staleTime: filters.id ? 0 : 1000 * 60 * 5,
    }, queryClient);
};
// 3. CREAR
export const useCreateInquilino = () => {
    return useMutation({
        mutationFn: (payload: InquilinoCrearDTO) => InquilinosService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: INQUILINOS_KEYS.lists() });
        },
    }, queryClient); // <--- Inyectado aquí
};

// 4. ACTUALIZAR
export const useUpdateInquilino = () => {
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: InquilinoActualizarDTO }) =>
            InquilinosService.update(id, payload),
        onSuccess: (response) => {
            // Refrescamos las listas y el detalle específico
            queryClient.invalidateQueries({ queryKey: INQUILINOS_KEYS.lists() });
            queryClient.invalidateQueries({
                queryKey: INQUILINOS_KEYS.detail(response.data.id)
            });
        },
    }, queryClient);
};

// 5. ELIMINAR
export const useDeleteInquilino = () => {
    return useMutation({
        mutationFn: (id: number) => InquilinosService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: INQUILINOS_KEYS.lists() });
        },
    }, queryClient); // <--- Inyectado aquí
};
