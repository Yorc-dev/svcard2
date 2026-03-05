"""add organizations suppliers loyalty_cards

Revision ID: a1b2c3d4e5f6
Revises: e798d4a5cfc9
Create Date: 2026-03-05 04:15:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

from app.utils.choices import LoyaltyCardStatus

# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = 'e798d4a5cfc9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'suppliers',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('name', sa.String(250), nullable=False),
        sa.Column('contract_number', sa.String(100), nullable=True),
        sa.Column('discount', sa.Numeric(5, 2), nullable=True, server_default='0.00'),
    )
    op.create_index(op.f('ix_suppliers_id'), 'suppliers', ['id'], unique=False)

    op.create_table(
        'organizations',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), unique=True, nullable=False),
        sa.Column('name', sa.String(250), nullable=False),
        sa.Column('inn', sa.String(20), unique=True, nullable=True),
        sa.Column('contact_phone', sa.String(30), nullable=True),
        sa.Column('contact_person', sa.String(250), nullable=True),
        sa.Column('discount', sa.Numeric(5, 2), nullable=True, server_default='1.00'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.sql.expression.true()),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index(op.f('ix_organizations_id'), 'organizations', ['id'], unique=False)

    op.create_table(
        'loyalty_cards',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('supplier_id', sa.Integer(), sa.ForeignKey('suppliers.id'), nullable=False),
        sa.Column('organization_id', sa.Integer(), sa.ForeignKey('organizations.id'), nullable=False),
        sa.Column('card_number', sa.String(100), unique=True, nullable=False),
        sa.Column('balance', sa.Numeric(12, 2), nullable=True, server_default='0.00'),
        sa.Column('status', sa.Enum(LoyaltyCardStatus, name='loyaltycardstatus'), nullable=False, server_default=LoyaltyCardStatus.ACTIVE.value),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column('assigned_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index(op.f('ix_loyalty_cards_id'), 'loyalty_cards', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_loyalty_cards_id'), table_name='loyalty_cards')
    op.drop_table('loyalty_cards')

    op.drop_index(op.f('ix_organizations_id'), table_name='organizations')
    op.drop_table('organizations')

    op.drop_index(op.f('ix_suppliers_id'), table_name='suppliers')
    op.drop_table('suppliers')

    op.execute("DROP TYPE IF EXISTS loyaltycardstatus")
