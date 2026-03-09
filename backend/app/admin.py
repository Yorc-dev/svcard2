import structlog
from sqladmin import Admin, ModelView
from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request
from sqlalchemy import select
from pydantic import TypeAdapter, EmailStr, ValidationError as PydanticValidationError

from app.core.db import engine, AsyncSessionLocal
from app.models.users import Users
from app.models.applications import Application
from app.models.organizations import Organization
from app.models.suppliers import Supplier
from app.models.loyalty_cards import LoyaltyCard
from app.repositories.users import UserRepository
from app.utils.choices import RoleChoices, LegalStatusChoices
from app.utils.jwt import verify_password
from decouple import config
from app.utils.jwt import hash_password
from app.i18n.i18n import t

logger = structlog.get_logger()
_email_validator = TypeAdapter(EmailStr)


def _get_admin_locale(request: Request) -> str:
    """Return admin UI locale from session (default: ru)."""
    return request.session.get("admin_locale", "ru")


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
    form_create_rules = ["full_name", "email", "phone_number", "tin", "legal_status", "is_active", "role", "password", "confirm_password"]

    column_labels = {
        "password": "Password",
        "confirm_password": "Confirm Password",
    }

    async def scaffold_form(self, rules=None):
        from wtforms import PasswordField
        from wtforms.validators import Optional
        form_class = await super().scaffold_form(rules)
        if rules is None or "confirm_password" in (rules or []):
            form_class.confirm_password = PasswordField("Confirm Password", validators=[Optional()])
        return form_class

    async def on_model_change(self, data: dict, model: Users, is_created: bool, request: Request) -> None:
        locale = _get_admin_locale(request)

        # Email format validation
        email = data.get("email", "")
        if email:
            try:
                _email_validator.validate_python(email)
            except PydanticValidationError:
                raise ValueError(t("admin.invalid_email", locale))

        # TIN validation: digits only, length 14
        tin = data.get("tin", "")
        if tin:
            if not tin.isdigit():
                raise ValueError(t("admin.tin_digits_only", locale))
            if len(tin) != 14:
                raise ValueError(t("admin.tin_length", locale))

        # Password handling
        raw = data.pop("password", None)
        confirm = data.pop("confirm_password", None)

        if is_created:
            if not raw:
                raise ValueError(t("errors.field_required", locale) + ": password")
            if len(raw) < 8:
                raise ValueError(t("admin.password_min_length", locale))
            if raw != confirm:
                raise ValueError(t("admin.passwords_mismatch", locale))
            data["password"] = hash_password(raw)
        else:
            if raw:
                if len(raw) < 8:
                    raise ValueError(t("admin.password_min_length", locale))
                data["password"] = hash_password(raw)
            # If no password given on edit, do not overwrite existing one
            # (keep the existing model password by removing from data dict)


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

    async def on_model_change(self, data: dict, model: Organization, is_created: bool, request: Request) -> None:
        locale = _get_admin_locale(request)

        user_id = data.get("user_id") or (model.user_id if not is_created else None)
        if user_id:
            async with AsyncSessionLocal() as session:
                result = await session.execute(select(Users).where(Users.id == int(user_id)))
                user = result.scalar_one_or_none()
            if user and user.legal_status != LegalStatusChoices.LEGAL_ENTITY:
                raise ValueError(t("admin.org_legal_only", locale))


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
        templates_dir="templates",
    )
    admin.add_view(UsersAdmin)
    admin.add_view(ApplicationAdmin)
    admin.add_view(OrganizationAdmin)
    admin.add_view(SupplierAdmin)
    admin.add_view(LoyaltyCardAdmin)

    # Language switcher endpoint
    from starlette.responses import RedirectResponse

    @app.route("/admin/set-locale", methods=["POST"])
    async def set_admin_locale(request: Request):
        form = await request.form()
        locale = form.get("locale", "ru")
        if locale not in ("ru", "en"):
            locale = "ru"
        request.session["admin_locale"] = locale
        referer = request.headers.get("referer", "/admin")
        return RedirectResponse(url=referer, status_code=303)

    return admin