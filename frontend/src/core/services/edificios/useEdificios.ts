// features/edificios/hooks/useEdificios.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import { EdificiosService } from "@/core/services/edificios/services";
import type {
    EdificioCrearDTO,
    EdificioActualizarDTO,
    EdificioFiltrosDTO
} from "@/core/services/edificios/schemas";
// Importamos la instancia centralizada
import { queryClient } from "@/core";

// 1. KEYS (Estructura jerárquica para invalidación precisa)
export const EDIFICIOS_KEYS = {
    all: ['edificios'] as const,
    lists: () => [...EDIFICIOS_KEYS.all, 'list'] as const,
    list: (filters: EdificioFiltrosDTO) => [...EDIFICIOS_KEYS.lists(), filters] as const,
    detail: (id: number) => [...EDIFICIOS_KEYS.all, 'detail', id] as const,
};

// 2. QUERY (Con lógica de protección de caché para IDs)
export const useEdificios = (filters: EdificioFiltrosDTO) => {
    return useQuery({
        queryKey: EDIFICIOS_KEYS.list(filters),
        queryFn: () => EdificiosService.get(filters),

        /** * Si buscamos un ID específico (detalle/edición), NO usamos placeholderData.
         * Esto evita que al navegar entre edificios se vea la información del anterior.
         */
        placeholderData: filters.id ? undefined : (previousData) => previousData,

        // Si es un detalle, lo consideramos "stale" (viejo) de inmediato para asegurar frescura
        staleTime: filters.id ? 0 : 1000 * 60 * 5,
    }, queryClient);
};

// 3. CREAR
export const useCreateEdificio = () => {
    return useMutation({
        mutationFn: (payload: EdificioCrearDTO) => EdificiosService.create(payload),
        onSuccess: () => {
            // Invalidamos todas las listas de edificios
            queryClient.invalidateQueries({ queryKey: EDIFICIOS_KEYS.lists() });
        },
    }, queryClient);
};

// 4. ACTUALIZAR
export const useUpdateEdificio = () => {
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: EdificioActualizarDTO }) =>
            EdificiosService.update(id, payload),
        onSuccess: (response) => {
            // Refrescamos las listas para que se vea el cambio en tablas
            queryClient.invalidateQueries({ queryKey: EDIFICIOS_KEYS.lists() });

            // Refrescamos el detalle específico del edificio actualizado
            queryClient.invalidateQueries({
                queryKey: EDIFICIOS_KEYS.detail(response.data.id)
            });
        },
    }, queryClient);
};

// 5. ELIMINAR
export const useDeleteEdificio = () => {
    return useMutation({
        mutationFn: (id: number) => EdificiosService.delete(id),
        onSuccess: () => {
            // Al eliminar, solo necesitamos refrescar las listas
            queryClient.invalidateQueries({ queryKey: EDIFICIOS_KEYS.lists() });
        },
    }, queryClient);
};
