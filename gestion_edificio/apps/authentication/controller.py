from django.contrib.auth.models import User
from fastapi import APIRouter, Depends, HTTPException, Body
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt, JWTError
from fastapi.responses import JSONResponse
from starlette import status
from starlette.requests import Request
from starlette.responses import Response

from apps.authentication.schema import LoginResponse, LoginRequest, RegisterRequest, UserPyantic
from apps.authentication.service import AuthService
from core import settings
from core.constants import AppRoutes
from core.schemas import ApiResponse

security = HTTPBearer()  # ← instancia arriba del router

router = APIRouter(tags=["authentication"])
@router.post(AppRoutes.LOGIN, status_code=status.HTTP_200_OK)
async def login(request: LoginRequest = Body(...), auth_service: AuthService = Depends(AuthService)):
    response_data: LoginResponse = await auth_service.login(
        username=request.username,
        password=request.password.get_secret_value()
    )

    response = JSONResponse(
        content=ApiResponse(
            msg="Usuario logeado correctamente",
            data=response_data,
            status_code=status.HTTP_200_OK
        ).model_dump()
    )

    response.set_cookie(
        key="access_token",
        value=response_data.access_token,
        httponly=True,
        secure=False,
        samesite="lax",
    )

    response.set_cookie(
        key="refresh_token",
        value=response_data.refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
    )

    return response  # ← devuelves el JSONResponse directamente, no lo envuelves en ApiResponse

@router.post(AppRoutes.REGISTER, response_model=ApiResponse[UserPyantic], status_code=status.HTTP_200_OK)
async def register(request: RegisterRequest = Body(...), auth_service: AuthService=Depends(AuthService)):
        response: User = await auth_service.register(email=request.email, username=request.username, password=request.password.get_secret_value())
        return ApiResponse(msg="Usuario registrado correctamente", data=response, status_code=status.HTTP_200_OK)


async def get_token_from_cookie(request: Request):
    token = request.cookies.get("access_token") # El nombre que le hayas puesto al loguear
    if not token:
        raise HTTPException(status_code=401, detail="No hay cookie de sesión")
    return token


@router.get(AppRoutes.ME, response_model=ApiResponse[UserPyantic], status_code=status.HTTP_200_OK)
async def me(
    token: str = Depends(get_token_from_cookie)
) -> ApiResponse:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])

        return ApiResponse(msg='Usuario logeado fetcheado correctamente', data=payload, status_code=status.HTTP_200_OK)
    except JWTError:
        return ApiResponse(msg='Usuario no valido',status_code=status.HTTP_400_BAD_REQUEST)

@router.post(AppRoutes.LOGOUT)
async def logout(response: Response):
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return ApiResponse(msg="Usuario deslogeado", status_code=status.HTTP_200_OK)


