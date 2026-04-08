from fastapi import Depends

from apps.inquilinos.inquilinos.services import InquilinosService
from core.base.services import Service
from core.exceptions import handle_error, ConflictError, BadRequestError, NotFoundError
from apps.contratos.contratos.repository import ContratosRepository
from apps.contratos.contratos.schema import (
    ContratoRespuesta,
    ContratoCrear,
    ContratoActualizar
)
from apps.edificios.departamentos.services import DepartamentosService

class ContratosService(Service[ContratoRespuesta, ContratoCrear, ContratoActualizar]):
    def __init__(
            self,
            repo: ContratosRepository = Depends(),
            inquilinos_service: InquilinosService = Depends(),
            departamentos_service: DepartamentosService = Depends()
    ):
        super().__init__(
            repo=repo,
            schema_resp=ContratoRespuesta,
            entity_name="contratos",
        )
        self.inquilinos_service = inquilinos_service
        self.departamentos_service = departamentos_service

    async def create(self, payload: ContratoCrear):
        # 1. Buscar el departamento por su número (buscamos en el service de departamentos)
        dep_res = await self.departamentos_service.get(numero_departamento=payload.numero_departamento)
        # Validamos que exista y tomamos el primer resultado
        if not dep_res.get('data'):
            raise NotFoundError(f"El departamento {payload.numero_departamento} no existe.")
        departamento_relacionado = dep_res['data'][0]

        if departamento_relacionado.ocupado:
            raise ConflictError("El departamento {departamento_relacionado.numero_departamento} ya está ocupado.")
        # 2. Buscar el inquilino por su cédula
        inq_res = await self.inquilinos_service.get(numero_identificacion=payload.numero_identificacion)
        if not inq_res.get('data'):
            raise NotFoundError(f"El inquilino con ID {payload.numero_identificacion} no existe.")
        inquilino_relacionado = inq_res['data'][0]

        # 4. LIMPIEZA CRÍTICA:
        # Convertimos el payload a dict pero EXCLUIMOS los campos que NO existen en el modelo de Django
        data_for_repo = payload.model_dump(
            exclude={
                "numero_departamento",  # No existe en la tabla Contratos
                "numero_identificacion"  # No existe en la tabla Contratos
            },
            exclude_none=True
        )

        # 5. ASIGNAR LAS LLAVES FORÁNEAS (FK) reales
        # Django espera 'departamento_id' e 'inquilino_id' (o los objetos directamente)
        data_for_repo["departamento_id"] = departamento_relacionado.id
        data_for_repo["inquilino_id"] = inquilino_relacionado.id

        # 6. LLAMADA AL REPOSITORIO
        # Ahora data_for_repo solo tiene: frecuencia_pago, monto, dia_pago, fecha_inicio,
        # fecha_fin, descripcion, status, al_dia, departamento_id e inquilino_id.
        new_reg_django = await self.repo.create(**data_for_repo)

        # 7. RETORNAR VALIDADO POR EL SCHEMA DE RESPUESTA
        return self.schema_resp.model_validate(new_reg_django)


    async def update(self, id: int, payload: ContratoActualizar):
            cleaned_payload = payload.model_dump(exclude_none=True)
            if "departamento_id" in cleaned_payload:
                nuevo_depto = await self.departamentos_service.get(id=cleaned_payload["departamento_id"])

                if nuevo_depto.ocupado:
                    raise ConflictError(f"El departamento N° {nuevo_depto.numero_departamento} ya está ocupado.")

                if await self.repo.exists_reg(departamento_id=cleaned_payload["departamento_id"]):
                    raise ConflictError(
                        f"Ya existe un contrato para el departamento {nuevo_depto.numero_departamento}.")

            if "inquilino_id" in cleaned_payload:
                await self.inquilinos_service.get(id=cleaned_payload["inquilino_id"])

            new_reg = await self.repo.update(id, **cleaned_payload)
            return new_reg

