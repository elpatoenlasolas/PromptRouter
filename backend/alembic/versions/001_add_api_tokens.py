"""add api tokens table

Revision ID: add_api_tokens
Revises: 
Create Date: 2026-01-02

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_api_tokens'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Create api_tokens table
    op.create_table(
        'api_tokens',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('token', sa.String(length=128), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('last_used_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_api_tokens_token'), 'api_tokens', ['token'], unique=True)


def downgrade():
    op.drop_index(op.f('ix_api_tokens_token'), table_name='api_tokens')
    op.drop_table('api_tokens')
