from sqladmin import Admin, ModelView
from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request

from app.core.db import engine, AsyncSessionLocal
from app.models.users import Users
from app.models.applications import Application
from app.models.organizations import Organization
from app.models.suppliers import Supplier
from app.models.loyalty_cards import LoyaltyCard
from app.repositories.users import UserRepository
from app.utils.choices import RoleChoices
from app.utils.jwt import verify_password
from decouple import config
from app.utils.jwt import hash_password


class AdminAuth(AuthenticationBackend):
    async def login(self, request: Request) -> bool:
        form = await request.form()
        email = form.get("username")
        password = form.get("password")

        if not email or not password:
            return False

        async with AsyncSessionLocal() as session:
            repo = UserRepository(session)
            user = await repo.get_by_email(str(email))

        if not user or not verify_password(str(password), user.password):
            return False

        if user.role != RoleChoices.ADMIN:
            return False

        request.session.update({"admin_user": user.email})
        return True

    async def logout(self, request: Request) -> bool:
        request.session.clear()
        return True

    async def authenticate(self, request: Request) -> bool:
        return bool(request.session.get("admin_user"))


class UsersAdmin(ModelView, model=Users):
    column_list = [Users.id, Users.full_name, Users.email, Users.role, Users.is_active]
    column_searchable_list = [Users.email, Users.full_name]
    column_sortable_list = [Users.id, Users.email, Users.role, Users.is_active]
    name = "User"
    name_plural = "Users"
    icon = "fa-solid fa-user"
    form_edit_rules = ["full_name", "email", "phone_number", "tin", "legal_status", "is_active", "role"]
    # а при создании — добавить password:
    form_create_rules = ["full_name", "email", "phone_number", "tin", "legal_status", "is_active", "role", "password"]

    column_labels = {"password": "Password"}

    async def on_model_change(self, data: dict, model: Users, is_created: bool, request) -> None:
        # Если password пришёл с формы — хешируем
        raw = data.get("password")
        if raw:
            data["password"] = hash_password(raw)
        else:
            # если редактируем и пароль не ввели — не трогаем его вообще
            data.pop("password", None)


class ApplicationAdmin(ModelView, model=Application):
    column_list = [Application.id, Application.first_name, Application.phone_number]
    column_searchable_list = [Application.first_name, Application.phone_number]
    column_sortable_list = [Application.id, Application.first_name]
    name = "Application"
    name_plural = "Applications"
    icon = "fa-solid fa-file"


class OrganizationAdmin(ModelView, model=Organization):
    column_list = [Organization.id, Organization.name, Organization.inn, Organization.is_active, Organization.created_at]
    column_searchable_list = [Organization.name, Organization.inn]
    column_sortable_list = [Organization.id, Organization.name, Organization.is_active]
    name = "Organization"
    name_plural = "Organizations"
    icon = "fa-solid fa-building"


class SupplierAdmin(ModelView, model=Supplier):
    column_list = [Supplier.id, Supplier.name, Supplier.contract_number, Supplier.discount]
    column_searchable_list = [Supplier.name, Supplier.contract_number]
    column_sortable_list = [Supplier.id, Supplier.name]
    name = "Supplier"
    name_plural = "Suppliers"
    icon = "fa-solid fa-truck"


class LoyaltyCardAdmin(ModelView, model=LoyaltyCard):
    column_list = [LoyaltyCard.id, LoyaltyCard.card_number, LoyaltyCard.balance, LoyaltyCard.status, LoyaltyCard.created_at]
    column_searchable_list = [LoyaltyCard.card_number]
    column_sortable_list = [LoyaltyCard.id, LoyaltyCard.card_number, LoyaltyCard.status]
    name = "Loyalty Card"
    name_plural = "Loyalty Cards"
    icon = "fa-solid fa-credit-card"


def create_admin(app) -> Admin:
    admin_secret = config("ADMIN_SECRET_KEY", default=config("SECRET_KEY"))
    authentication_backend = AdminAuth(secret_key=admin_secret)
    admin = Admin(
        app=app,
        engine=engine,
        authentication_backend=authentication_backend,
        base_url="/admin",
    )
    admin.add_view(UsersAdmin)
    admin.add_view(ApplicationAdmin)
    admin.add_view(OrganizationAdmin)
    admin.add_view(SupplierAdmin)
    admin.add_view(LoyaltyCardAdmin)
    return admin