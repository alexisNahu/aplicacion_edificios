from fastapi import Depends

from apps.contratos.contratos.services import ContratosService
from apps.finanzas.models import Pagos
from apps.finanzas.pagos.repository import PagosRepository
from apps.finanzas.pagos.schema import PagoRespuesta, PagoCrear, PagoFiltros, PagoActualizar
from core.base.services import Service
from apps.edificios.departamentos.services import DepartamentosService
from core.exceptions import NotFoundError


class PagosService(Service[PagoRespuesta, PagoCrear, PagoActualizar]):
    def __init__(
            self,
            repo: PagosRepository = Depends(),
            contratos_service: ContratosService = Depends(),
    ):
        super().__init__(
            repo=repo,
            schema_resp=PagoRespuesta,
            entity_name="Pagos"
        )

        self.contratos_service = contratos_service
        self.departamentos_service = DepartamentosService

    async def create(self, payload: PagoCrear) -> PagoRespuesta:
        con_res = await self.contratos_service.get(departamento__numero_departamento__icontains=payload.numero_departamento)

        if not con_res.get('data'):
            raise NotFoundError(f"El contrato {payload.numero_departamento} no existe.")

        contrato_relacionado = con_res.get('data')[0]

        cleaned_payload = payload.model_dump(exclude={
            "contrato_id",
        })

        cleaned_payload['contrato_id'] = contrato_relacionado.id

        new_reg = await self.repo.create(**cleaned_payload)

        return self.schema_resp.model_validate(new_reg)

    async def update(self, id: int, payload: PagoActualizar) -> Pagos:
        cleaned_payload = payload.model_dump(exclude_none=True)

        if "contrato_id" in cleaned_payload:
            await self.contratos_service.get(id=cleaned_payload["contrato_id"])

        new_reg = await self.repo.update(id, **cleaned_payload)
        return new_reg