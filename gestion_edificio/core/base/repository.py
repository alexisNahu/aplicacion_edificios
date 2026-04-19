# core/repositories.py
from asgiref.sync import sync_to_async
from core.interfaces import IRepository, T
from core.exceptions import NotFoundError

class Repository(IRepository[T]):
    _select_related: list[str] = []

    def _get_objects(self):
        if self._select_related:
            return self._objects.select_related(*self._select_related)
        return self._objects

    async def select(self, **kwargs):
        print(kwargs)
        filtros = {}
        for clave, valor in kwargs.items():
            if isinstance(valor, str) and "__" not in clave:
                filtros[f"{clave}__icontains"] = valor
            else:
                filtros[clave] = valor

        queryset = self._get_objects().filter(**filtros) if filtros else self._get_objects().all()
        result = await sync_to_async(list)(queryset)

        return result

    async def create(self, **kwargs):
        instance = await sync_to_async(self._objects.create)(**kwargs)
        if self._select_related:
            instance = await sync_to_async(self._get_objects().get)(pk=instance.pk)
        return instance

    async def update(self, id: int, **kwargs) -> T:
        instance = await sync_to_async(self._objects.filter(id=id).first)()

        if not instance:
            raise NotFoundError(f"Registro con ID {id} no encontrado en {self._table}")

        for clave, valor in kwargs.items():
            if hasattr(instance, clave):
                setattr(instance, clave, valor)

        await sync_to_async(instance.save)()

        if self._select_related:
            instance = await sync_to_async(self._get_objects().get)(pk=instance.pk)
        return instance

    async def delete_by_id(self, id: int) -> bool:  # ← faltaba
        instance = await sync_to_async(self._objects.filter(id=id).first)()
        if instance:
            await sync_to_async(instance.delete)()
            return True
        return False

    async def exists_reg(self, **kwargs) -> bool:  # ← faltaba
        queryset = self._objects.filter(**kwargs)
        return await sync_to_async(queryset.exists)()