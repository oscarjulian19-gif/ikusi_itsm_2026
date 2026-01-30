from sqlalchemy import Column, String, Text, DateTime, Integer, Enum
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from pgvector.sqlalchemy import Vector
import uuid
from datetime import datetime
from app.db.session import Base

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(String, primary_key=True, index=True) # E.g., INC-1001
    title = Column(String, index=True)
    description = Column(Text)
    status = Column(String) # Nuevo, En Progreso, Resuelto
    priority = Column(String) # P1, P2, P3
    
    # Metadata
    client = Column(String)
    pep = Column(String, nullable=True)
    
    # AI Fields
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Vector Embedding for Semantic Search (RAG)
    # Using 768 dimensions (common for Google Embeddings)
    embedding = Column(Vector(768))

class KnowledgeArticle(Base):
    __tablename__ = "knowledge_articles"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String)
    content = Column(Text)
    category = Column(String)
    embedding = Column(Vector(768))
