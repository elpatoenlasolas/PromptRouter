"""Add DeepSeek and Mistral providers

Revision ID: 003_add_new_providers
Revises: 002_add_chat_messages_fields
Create Date: 2026-01-17

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '003_add_new_providers'
down_revision = '002_add_chat_messages_fields'
branch_labels = None
depends_on = None


def upgrade():
    """Add new provider types to the enum"""
    # For PostgreSQL, we need to add new values to the existing enum
    # This is a safe operation that doesn't affect existing data
    op.execute("ALTER TYPE providertype ADD VALUE IF NOT EXISTS 'deepseek'")
    op.execute("ALTER TYPE providertype ADD VALUE IF NOT EXISTS 'mistral'")


def downgrade():
    """
    Note: PostgreSQL doesn't support removing enum values directly.
    To downgrade, you would need to:
    1. Create a new enum without the values
    2. Update the column to use the new enum
    3. Drop the old enum
    
    For safety, we leave this as a no-op.
    """
    pass
