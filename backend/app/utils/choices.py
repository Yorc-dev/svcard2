from enum import Enum


class LegalStatusChoices(str, Enum):
    INDIVIDUAL = "individual"
    LEGAL_ENTITY = "legal_entity" 


class RoleChoices(str, Enum):
    ADMIN = "admin"
    MODERATOR = "moderator"
    USER = "user"
    EMPLOYEE = "employee"


class LoyaltyCardStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    BLOCKED = "blocked"
    