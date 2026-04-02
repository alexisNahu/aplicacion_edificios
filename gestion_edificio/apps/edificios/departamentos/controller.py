from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Body, Path

from apps.edificios.departamentos.schema import DepartamentoRespuesta, DepartamentoCrear, DepartamentoActualizar, DepartamentoFiltros
from apps.edificios.departamentos.services import DepartamentosService
from apps.edificios.models import Departamentos
from core.constants import AppRoutes
from core.schemas import ApiResponse

router = APIRouter(tags=['departamentos'])
@router.get(AppRoutes.DEPARTAMENTOS, response_model=ApiResponse[list[DepartamentoRespuesta]], status_code=200)
async def get_departamentos(
        # Usamos el Schema que definimos antes para agrupar todo
        filtros: DepartamentoFiltros = Depends(),
        departamentos_service: DepartamentosService = Depends(DepartamentosService)
):
        # 1. Convertimos el schema a diccionario
        # exclude_none=True: Elimina los campos que el usuario no envió (los None)
        # by_alias=False: Convierte 'nombre_edificio' a 'edificio__nombre__iexact' para Django
        params = filtros.model_dump(exclude_none=True, by_alias=False)

        page = params.pop('page', 1)
        page_size = params.pop('page_size', 10)

        response = await departamentos_service.get(
            page=page,
            page_size=page_size,
            **params # Aquí ya van limpios: sin Nones y con los nombres correctos
        )

        return ApiResponse(
            msg="Departamentos obtenidos correctamente",
            data=response['data'],
            pagination=response['pagination'],
            status_code=200
        )

@router.post(AppRoutes.DEPARTAMENTOS, response_model=ApiResponse[DepartamentoRespuesta], status_code=201)
async def create_departamento(
        payload: DepartamentoCrear = Body(...),
        departamentos_service: DepartamentosService = Depends(DepartamentosService)
):
        departamento: Departamentos = await departamentos_service.create(payload)
        return ApiResponse(msg="Departamento creado", data=departamento, status_code=201)

@router.put(AppRoutes.DEPARTAMENTOS + "/{id}", response_model=ApiResponse[DepartamentoRespuesta], status_code=200)
async def update_departamento(
    id: int = Path(..., ge=1), # El nombre 'id' debe coincidir EXACTO con {id} arriba
    payload: DepartamentoActualizar = Body(...),
    departamentos_service: DepartamentosService = Depends(DepartamentosService)
):
    departamento = await departamentos_service.update(id, payload)
    return ApiResponse(msg="Departamento actualizado", data=departamento, status_code=200)

# 3. DELETE (Corregido el Path Parameter)
@router.delete(AppRoutes.DEPARTAMENTOS + "/{id}", response_model=ApiResponse[DepartamentoRespuesta], status_code=200)
async def delete_departamento(
    id: int = Path(..., ge=1), # Coincidencia exacta necesaria
    departamentos_service: DepartamentosService = Depends(DepartamentosService)
):
    response = await departamentos_service.delete(id)
    return ApiResponse(msg="Departamento eliminado correctamente", data=response, status_code=200)
