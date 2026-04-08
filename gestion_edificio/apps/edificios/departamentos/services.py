from fastapi import Depends
from core.base.services import Service
from apps.edificios.departamentos.repository import DepartamentosRepository
from apps.edificios.departamentos.schema import (
    DepartamentoRespuesta,
    DepartamentoCrear,
    DepartamentoActualizar
)
from apps.edificios.edificios.services import EdificiosService


class DepartamentosService(Service[DepartamentoRespuesta, DepartamentoCrear, DepartamentoActualizar]):
    def __init__(
            self,
            repo: DepartamentosRepository = Depends(),
            edificios_service: EdificiosService = Depends()
    ):
        super().__init__(
            repo=repo,
            schema_resp=DepartamentoRespuesta,
            entity_name="departamentos",
        )
        self.edificios_service = edificios_service

    async def create(self, payload: DepartamentoCrear):
        # Validación de la FK
        await self.edificios_service.get(id=payload.edificio_id)

        cleaned_payload = payload.model_dump(exclude_none=True)

        instance = await self.repo.create(**cleaned_payload)
        # 1. El repo crea el registro (devuelve modelo de Django)
        return  self.schema_resp.model_validate(instance)


    async def update(self, id: int, payload: DepartamentoActualizar):
        cleaned_payload = payload.model_dump(exclude_none=True)

        if "edificio_id" in cleaned_payload:
            await self.edificios_service.get(id=cleaned_payload["edificio_id"])

        # 1. El repo actualiza (devuelve modelo de Django)
        new_reg_django = await self.repo.update(id, **cleaned_payload)

        # 2. ✅ CORRECCIÓN: Validar con Pydantic antes de retornar
        return self.schema_resp.model_validate(new_reg_django)