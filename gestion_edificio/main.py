from starlette.middleware.cors import CORSMiddleware

from core.error_handlers import register_exception_handlers
from core.setup_django import init_django

init_django()

from core.router import app_router

from fastapi import FastAPI
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4321",  # Astro
        "http://localhost:5173",  # Vite
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_exception_handlers(app)

from fastapi.exceptions import ResponseValidationError
from fastapi.responses import JSONResponse

# Agregá este decorador en tu main.py o router para ver el detalle real
@app.exception_handler(ResponseValidationError)
async def validation_exception_handler(request, exc):
    print(f"Errores de validación: {exc.errors()}") # Esto imprimirá el campo exacto en la consola
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )
app.include_router(app_router)