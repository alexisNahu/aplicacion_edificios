from http import HTTPStatus
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, Path, Body

from apps.contratos.contratos.schema import (
    ContratoRespuesta,
    ContratoCrear,
    ContratoActualizar, ContratoFiltros
)
from apps.contratos.contratos.services import ContratosService
from core.constants import AppRoutes
from core.schemas import ApiResponse

router = APIRouter(tags=['contratos'])

@router.get(
    AppRoutes.CONTRATOS,
    response_model=ApiResponse[List[ContratoRespuesta]],
    status_code=HTTPStatus.OK
)
async def get_contratos(
    query_filters: ContratoFiltros = Depends(ContratoFiltros),
    contratos_service: ContratosService = Depends(ContratosService)
):
    """
    Obtiene la lista de contratos con filtros individuales por Query Parameters.
    """
    params = query_filters.model_dump(exclude_none=True, by_alias=False)
    page = params.pop('page', 1)
    page_size = params.pop('page_size', 10)

    response = await contratos_service.get(
        page=page,
        page_size=page_size,
        **params
    )

    return ApiResponse(
        msg="Contratos obtenidos correctamente",
        data=response['data'],
        pagination=response['pagination'],
        status_code=HTTPStatus.OK
    )

@router.post(
    AppRoutes.CONTRATOS,
    response_model=ApiResponse[ContratoRespuesta],
    status_code=HTTPStatus.CREATED
)
async def create_contrato(
    payload: ContratoCrear = Body(...),
    contratos_service: ContratosService = Depends(ContratosService)
):
    contrato = await contratos_service.create(payload)
    return ApiResponse(
        msg="Contrato creado exitosamente",
        data=contrato,
        status_code=HTTPStatus.CREATED
    )


# ... (imports permanecen igual)


@router.put(
    AppRoutes.CONTRATOS+"/{id}", # <--- Corregido: Doble llave si es un f-string o solo {id}
    response_model=ApiResponse[ContratoRespuesta],
    status_code=HTTPStatus.OK
)
async def update_contrato(
    id: int = Path(..., ge=1), # Este 'id' debe matchear con el {id} de arriba
    payload: ContratoActualizar = Body(...),
    contratos_service: ContratosService = Depends(ContratosService)
):
    contrato = await contratos_service.update(id, payload)
    return ApiResponse(
        msg="Contrato actualizado correctamente",
        data=contrato,
        status_code=HTTPStatus.OK
    )

@router.delete(
    AppRoutes.CONTRATOS+"/id", # <--- Corregido
    response_model=ApiResponse[ContratoRespuesta],
    status_code=HTTPStatus.OK
)
async def delete_contrato(
    id: int = Path(..., ge=1),
    contratos_service: ContratosService = Depends(ContratosService)
):
    contrato = await contratos_service.delete(id)
    return ApiResponse(
        msg="Contrato eliminado correctamente",
        data=contrato,
        status_code=HTTPStatus.OK
    )