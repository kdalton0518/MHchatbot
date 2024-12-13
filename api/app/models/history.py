from sqlalchemy import Boolean, Column, String, ForeignKey, Integer, Text
from sqlalchemy.dialects.postgresql import UUID as PostgresUUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class History(Base):
    __tablename__ = "history"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_uuid = Column(PostgresUUID, nullable=False)
    user_message = Column(Text(length=None), nullable=False)  # Unlimited length
    llm_message = Column(Text(length=None), nullable=False)   # Unlimited length
