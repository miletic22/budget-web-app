"""Add updated_at and deleted_at columns to users table

Revision ID: c66dfe1f99b8
Revises: 90923eb66251
Create Date: 2024-02-02 15:46:03.534964

"""
from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = 'c66dfe1f99b8'
down_revision: Union[str, None] = '90923eb66251'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('budgets', 'user_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.alter_column('categories', 'budget_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.alter_column('transactions', 'category_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.add_column('users', sa.Column('updated_at', sa.TIMESTAMP(timezone=True), nullable=True))
    op.add_column('users', sa.Column('deleted_at', sa.TIMESTAMP(timezone=True), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('users', 'deleted_at')
    op.drop_column('users', 'updated_at')
    op.alter_column('transactions', 'category_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.alter_column('categories', 'budget_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.alter_column('budgets', 'user_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    # ### end Alembic commands ###
