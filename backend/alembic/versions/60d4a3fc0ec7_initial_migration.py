"""Initial migration

Revision ID: 60d4a3fc0ec7
Revises: None
Create Date: 2024-06-28 17:33:00.103130

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '60d4a3fc0ec7'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Drop existing tables
    op.drop_table('Comment')
    op.drop_table('Video')
    op.drop_table('User')

    # Recreate tables with new schema
    op.create_table('User',
        sa.Column('id', sa.Integer(), nullable=False, primary_key=True, autoincrement=True),
        sa.Column('email', sa.String(), nullable=False, unique=True),
        sa.Column('username', sa.String(), nullable=False, unique=True),
        sa.Column('icon', sa.String(), nullable=True)
    )

    op.create_table('Video',
        sa.Column('id', sa.Integer(), nullable=False, primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('User.id'), nullable=False),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('video_url', sa.String(), nullable=True),
        sa.Column('title', sa.String(), nullable=True)
    )

    op.create_table('Comment',
        sa.Column('id', sa.Integer(), nullable=False, primary_key=True, autoincrement=True),
        sa.Column('video_id', sa.Integer(), sa.ForeignKey('Video.id'), nullable=False),
        sa.Column('content', sa.String(), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=False)
    )

def downgrade():
    op.drop_table('Comment')
    op.drop_table('Video')
    op.drop_table('User')
