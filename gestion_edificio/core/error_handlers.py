import os
import traceback

from fastapi import FastAPI, Request
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from starlette.responses import JSONResponse
from core.exceptions import ApiError

def register_exception_handlers(app: FastAPI):
    """
    Registra todos los manejadores de excepciones globales para la aplicación.
    """

    @app.exception_handler(ApiError)
    async def api_error_handler(request: Request, exc: ApiError):
        return JSONResponse(
            status_code=exc.status_code,
            content=jsonable_encoder({
                "msg": exc.detail,
                "status_code": exc.status_code,
                "success": False
            }),
        )

    @app.exception_handler(RequestValidationError)
    async def validation_error_handler(request: Request, exc: RequestValidationError):
        return JSONResponse(
            status_code=422,
            content=jsonable_encoder({
                "msg": "Error de validación",
                "details": exc.errors(),
                "status_code": 422,
                "success": False
            }),
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception):
        debug = os.environ.get("DEBUG", "True") == "True"
        content = {"msg": "Error interno del servidor", "success": False}
        if debug:
            content["error"] = str(exc)
            content["traceback"] = traceback.format_exc()
        return JSONResponse(status_code=500, content=jsonable_encoder(content))
