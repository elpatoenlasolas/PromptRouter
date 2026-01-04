"""add messages and message_count fields to prompt_executions

Revision ID: add_chat_messages
Revises: add_api_tokens
Create Date: 2026-01-04

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_chat_messages'
down_revision = 'add_api_tokens'
branch_labels = None
depends_on = None


def upgrade():
    # Add messages JSON field for storing chat message arrays
    op.add_column('prompt_executions', 
        sa.Column('messages', sa.JSON(), nullable=True)
    )
    
    # Add message_count field for analytics
    op.add_column('prompt_executions',
        sa.Column('message_count', sa.Integer(), nullable=True)
    )


def downgrade():
    op.drop_column('prompt_executions', 'message_count')
    op.drop_column('prompt_executions', 'messages')
