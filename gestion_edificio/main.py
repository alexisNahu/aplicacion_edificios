import os

from starlette.middleware.cors import CORSMiddleware

from core.error_handlers import register_exception_handlers
from core.setup_django import init_django

init_django()

from core.router import app_router

from fastapi import FastAPI
app = FastAPI()

dev_origins = [
    "http://localhost:4321",  # Astro
    "http://localhost:5173",  # Vite
    "http://localhost:3000",
]
extra_origins = [
    origin.strip()
    for origin in os.environ.get("CORS_ALLOWED_ORIGINS", "").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=dev_origins + extra_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_exception_handlers(app)

app.include_router(app_router)