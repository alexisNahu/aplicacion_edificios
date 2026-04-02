from pydantic import BaseModel, Field
from typing import Optional

from core.utils import AsList

class EdificiosMinimo(BaseModel):
    id: int
    nombre: str
    descripcion: Optional[str]

    model_config = {
        "from_attributes": True
    }


class DepartamentoCrear(BaseModel):
    numero_departamento: str = Field(min_length=1, max_length=20)
    piso: int = Field(ge=0, le=3)
    descripcion: Optional[str] = Field(default=None, max_length=100)
    edificio_id: int = Field(ge=1)
    status: bool = Field(default=True)
    ocupado: bool = Field(default=False)


class DepartamentoActualizar(BaseModel):
    edificio_id: Optional[int]
    numero_departamento: Optional[str] = Field(default=None, min_length=1, max_length=20)
    piso: Optional[int] = Field(default=None, ge=0, le=3)
    descripcion: Optional[str] = Field(default=None, max_length=100)
    status: Optional[bool] = None
    ocupado: Optional[bool] = None


class DepartamentoRespuesta(BaseModel):
    id: int
    numero_departamento: str
    piso: int
    descripcion: Optional[str] = None
    edificio: AsList[EdificiosMinimo]
    status: bool
    ocupado: bool

    model_config = {
        "from_attributes": True
    }


class DepartamentoFiltros(BaseModel):
    id: Optional[int] = Field(default=None, ge=1)
    numero_departamento: Optional[str] = Field(default=None, max_length=20)
    piso: Optional[int] = Field(default=None, ge=0, le=3)
    status: Optional[bool] = None
    ocupado: Optional[bool] = None
    edificio__nombre__icontains: Optional[str] = Field(None, alias='nombre_edificio')
    page: Optional[int] = Field(default=1)
    page_size: Optional[int] = Field(default=10)