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

app.include_router(app_router)