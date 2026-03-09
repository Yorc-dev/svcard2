import structlog
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError

from decouple import config

from app.core.router import api_router

from app.routing.applications import router as application_router
from app.routing.users import router as users_router
from app.routing.organizations import router as organizations_router
from app.routing.suppliers import router as suppliers_router
from app.routing.loyalty_cards import router as loyalty_cards_router
from app.admin import create_admin

logger = structlog.get_logger()

app = FastAPI(root_path="/api")

origins = config("CORS_ORIGINS")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for err in exc.errors():
        field = ".".join(str(loc) for loc in err.get("loc", [])[1:]) or "body"
        errors.append({"field": field, "message": err.get("msg", "Validation error")})
    return JSONResponse(
        status_code=422,
        content={"detail": errors},
    )


@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    logger.error("Unhandled database error", exc_info=exc, path=str(request.url))
    return JSONResponse(
        status_code=500,
        content={"detail": "A database error occurred. Please try again later."},
    )


app.include_router(api_router)
app.include_router(application_router)
app.include_router(users_router)
app.include_router(organizations_router)
app.include_router(suppliers_router)
app.include_router(loyalty_cards_router)

create_admin(app)