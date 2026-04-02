from typing import Optional, Literal
from fastapi import APIRouter, Depends, Query, Path, Body
from apps.inquilinos.inquilinos.schema import InquilinoRespuesta, InquilinoCrear, InquilinoActualizar, InquilinoFiltros
from apps.inquilinos.inquilinos.services import InquilinosService
from core.constants import AppRoutes
from core.schemas import ApiResponse

router = APIRouter(tags=['inquilinos'])

@router.get(AppRoutes.INQUILINOS, response_model=ApiResponse[list[InquilinoRespuesta]])
async def get_inquilinos(
    query_params: InquilinoFiltros = Depends(InquilinoFiltros),
    inquilinos_service: InquilinosService = Depends(InquilinosService)
):
    # La lógica de filtrado y paginación ya ocurre en el Service
    cleaned = query_params.model_dump(exclude_none=True, by_alias=False)

    page = cleaned.pop('page', 1)
    page_size = cleaned.pop('page_size', 10)

    response = await inquilinos_service.get(
        page=page,
        page_size=page_size,
        **cleaned
    )



    return ApiResponse(
        msg="Inquilinos obtenidos correctamente",
        data=response['data'],
        pagination=response['pagination'],
        status_code=200
    )

@router.post(AppRoutes.INQUILINOS, response_model=ApiResponse[InquilinoRespuesta], status_code=201)
async def create_inquilino(
    payload: InquilinoCrear = Body(...),
    inquilinos_service: InquilinosService = Depends(InquilinosService)
):
    inquilino = await inquilinos_service.create(payload)
    return ApiResponse(msg="Inquilino creado", data=inquilino, status_code=201)

@router.put(f"{AppRoutes.INQUILINOS}/{{id}}", response_model=ApiResponse[InquilinoRespuesta])
async def update_inquilino(
    id: int = Path(..., ge=1),
    payload: InquilinoActualizar = Body(...),
    inquilinos_service: InquilinosService = Depends(InquilinosService)
):
    inquilino = await inquilinos_service.update(id, payload)
    return ApiResponse(msg="Inquilino actualizado", data=inquilino, status_code=200)

@router.delete(f"{AppRoutes.INQUILINOS}/{{id}}", response_model=ApiResponse[InquilinoRespuesta])
async def delete_inquilino(
    id: int = Path(..., ge=1),
    inquilinos_service: InquilinosService = Depends(InquilinosService)
):
    inquilino = await inquilinos_service.delete(id)
    return ApiResponse(msg="Inquilino eliminado correctamente", data=inquilino, status_code=200)