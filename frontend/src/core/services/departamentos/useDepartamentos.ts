import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DepartamentosService } from "./services";
import type {
    DepartamentoCrearDTO,
    DepartamentoActualizarDTO,
    DepartamentoFiltrosDTO
} from "./schemas";
import { queryClient } from "@/core";

// ==========================================
// 1. QUERY KEYS (Gestión de Caché)
// ==========================================
export const DEPARTAMENTOS_KEYS = {
    all: ['departamentos'] as const,
    lists: () => [...DEPARTAMENTOS_KEYS.all, 'list'] as const,
    list: (filters: DepartamentoFiltrosDTO) => [...DEPARTAMENTOS_KEYS.lists(), filters] as const,
    detail: (id: string | undefined) => [...DEPARTAMENTOS_KEYS.all, 'detail', id] as const,
};

// ==========================================
// 2. HOOKS DE CONSULTA (Queries)
// ==========================================

export const useDepartamentos = (filters: DepartamentoFiltrosDTO) => {
    return useQuery({
        queryKey: DEPARTAMENTOS_KEYS.list(filters),
        queryFn: () => DepartamentosService.get(filters),
        // Útil para que la tabla no "parpadee" al cambiar de página o filtrar
        placeholderData: (previousData) => previousData,
        // Evita re-peticiones innecesarias si los datos están frescos (5 min)
        staleTime: 1000 * 60 * 5,
    });
};

// ========================================g==
// 3. HOOKS DE MUTACIÓN (Mutations)
// ==========================================

export const useCreateDepartamento = () => {
    const queryClientInternal = useQueryClient();

    return useMutation({
        mutationFn: (payload: DepartamentoCrearDTO) => DepartamentosService.create(payload),
        onSuccess: () => {
            // Invalidamos todas las listas para que la tabla se refresque
            queryClientInternal.invalidateQueries({ queryKey: DEPARTAMENTOS_KEYS.lists() });
        },
    }, queryClient); // Usamos tu queryClient global de @/core
};

export const useUpdateDepartamento = () => {
    const queryClientInternal = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: DepartamentoActualizarDTO }) =>
            DepartamentosService.update(id, payload),
        onSuccess: (response) => {
            // Refresca la lista general
            queryClientInternal.invalidateQueries({ queryKey: DEPARTAMENTOS_KEYS.lists() });
            // Actualiza el detalle específico por si hay un formulario de edición abierto
            queryClientInternal.invalidateQueries({
                queryKey: DEPARTAMENTOS_KEYS.detail(response.data.id)
            });
        },
    }, queryClient);
};

export const useDeleteDepartamento = () => {
    const queryClientInternal = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => DepartamentosService.delete(id),
        onSuccess: () => {
            // Tras borrar, todas las listas deben recargarse
            queryClientInternal.invalidateQueries({ queryKey: DEPARTAMENTOS_KEYS.lists() });
        },
    }, queryClient);
};
