"""fix model user

Revision ID: f62a3a0e7972
Revises: 7042e3d42dd5
Create Date: 2026-02-17 03:34:08.855047

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

from app.utils.choices import LegalStatusChoices, RoleChoices

# revision identifiers, used by Alembic.
revision: str = 'f62a3a0e7972'
down_revision: Union[str, Sequence[str], None] = '7042e3d42dd5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Drop old users table if exists
    op.drop_table('users')

    # Create new users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('full_name', sa.String(250), nullable=True),
        sa.Column('email', sa.String(250), unique=True, nullable=False),
        sa.Column('phone_number', sa.String(30), nullable=True),
        sa.Column('is_active', sa.Boolean, nullable=False, server_default=sa.sql.expression.false()),
        sa.Column('password', sa.String, nullable=False),
    )


def downgrade() -> None:
    # Drop the new users table
    op.drop_table('users')

    # Recreate the old users table (опционально)
    op.create_table(
        'users',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=False),
        sa.Column('full_name', sa.String(250), nullable=False),
        sa.Column('email', sa.String(250), unique=True, nullable=False),
        sa.Column('phone_number', sa.String(30), nullable=False),
        sa.Column('legal_status', sa.Enum(LegalStatusChoices, name='legalstatuschoices'), nullable=True),
        sa.Column('is_active', sa.Boolean, nullable=False, server_default=sa.sql.expression.false()),
        sa.Column('role', sa.Enum(RoleChoices, name='rolechoices'), nullable=True),
        sa.Column('password', sa.String, nullable=False),
    )
