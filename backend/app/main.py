from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from decouple import config

from app.core.router import api_router

from app.routing.applications import router as application_router
from app.routing.users import router as users_router
from app.admin import create_admin

app = FastAPI(root_path="/api")

origins = config("CORS_ORIGINS")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(api_router)
app.include_router(application_router)
app.include_router(users_router)

create_admin(app)