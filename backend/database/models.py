"""
LIFEINTEL Backend — Database Models
Core ORM models for LIFEINTEL SQLite storage.
Uses standardized timezone-neutral UTC timestamps.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    Boolean,
    Index,
)
from sqlalchemy.orm import relationship

from database.connection import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


def utc_now() -> datetime:
    """Return timezone-naive UTC datetime for clean SQLite storage."""
    return datetime.now(timezone.utc).replace(tzinfo=None)


class Source(Base):
    """An authorized data source (folder, email, calendar, manual)."""

    __tablename__ = "sources"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False)  # folder, email, calendar, manual
    path = Column(String(1024), nullable=True)  # File path for folder sources
    status = Column(String(50), default="disconnected")  # connected, disconnected, syncing, error
    is_monitored = Column(Boolean, default=False)
    last_sync_at = Column(DateTime, nullable=True)
    item_count = Column(Integer, default=0)
    config = Column(Text, nullable=True)  # JSON config for source-specific settings
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    documents = relationship("Document", back_populates="source", cascade="all, delete-orphan")


class Document(Base):
    """An imported document or file."""

    __tablename__ = "documents"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(512), nullable=False)
    file_type = Column(String(50), nullable=False)  # pdf, docx, txt, image, etc.
    file_size = Column(Integer, default=0)  # bytes
    file_hash = Column(String(64), nullable=True)  # SHA-256 for deduplication
    file_path = Column(String(1024), nullable=False)  # Storage path
    original_path = Column(String(1024), nullable=True)  # Original location
    status = Column(String(50), default="pending")  # pending, processing, processed, failed
    error_message = Column(Text, nullable=True)
    version = Column(Integer, default=1)
    parent_document_id = Column(String(36), ForeignKey("documents.id"), nullable=True)
    source_id = Column(String(36), ForeignKey("sources.id"), nullable=True)
    imported_at = Column(DateTime, default=utc_now)
    processed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    source = relationship("Source", back_populates="documents")
    parent_document = relationship("Document", remote_side="Document.id")
    extracted_facts = relationship("ExtractedFact", back_populates="document", cascade="all, delete-orphan")
    entities = relationship("Entity", back_populates="document", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_documents_hash", "file_hash"),
        Index("idx_documents_status", "status"),
        Index("idx_documents_source", "source_id"),
    )


class ExtractedFact(Base):
    """A fact extracted from a document."""

    __tablename__ = "extracted_facts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    document_id = Column(String(36), ForeignKey("documents.id"), nullable=False)
    fact_type = Column(String(100), nullable=False)  # date, deadline, amount, person, org, requirement, task, etc.
    key = Column(String(255), nullable=False)  # e.g. "deadline", "fee_amount"
    value = Column(Text, nullable=False)
    normalized_value = Column(Text, nullable=True)  # Parsed/normalized form
    confidence = Column(Float, default=0.0)  # 0.0 - 1.0
    context = Column(Text, nullable=True)  # Surrounding text for reference
    page_number = Column(Integer, nullable=True)
    position = Column(String(255), nullable=True)  # Location in document
    is_verified = Column(Boolean, default=False)  # User-verified
    created_at = Column(DateTime, default=utc_now)

    document = relationship("Document", back_populates="extracted_facts")

    __table_args__ = (
        Index("idx_facts_type", "fact_type"),
        Index("idx_facts_document", "document_id"),
    )


class Entity(Base):
    """A recognized entity (person, organization, topic)."""

    __tablename__ = "entities"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    entity_type = Column(String(100), nullable=False)  # person, organization, topic, location, etc.
    document_id = Column(String(36), ForeignKey("documents.id"), nullable=False)
    metadata_json = Column(Text, nullable=True)
    mention_count = Column(Integer, default=1)
    first_seen_at = Column(DateTime, default=utc_now)
    last_seen_at = Column(DateTime, default=utc_now)
    created_at = Column(DateTime, default=utc_now)

    document = relationship("Document", back_populates="entities")

    __table_args__ = (
        Index("idx_entities_type", "entity_type"),
        Index("idx_entities_name", "name"),
    )


class Obligation(Base):
    """A detected obligation or deadline."""

    __tablename__ = "obligations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(512), nullable=False)
    description = Column(Text, nullable=True)
    deadline = Column(DateTime, nullable=True)
    status = Column(String(50), default="upcoming")  # upcoming, overdue, completed, dismissed
    urgency = Column(String(50), default="medium")  # critical, high, medium, low, info
    confidence = Column(Float, default=0.0)
    category = Column(String(100), nullable=True)  # academic, professional, personal, financial, medical
    source_document_id = Column(String(36), ForeignKey("documents.id"), nullable=True)
    source_fact_id = Column(String(36), ForeignKey("extracted_facts.id"), nullable=True)
    is_user_created = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    __table_args__ = (
        Index("idx_obligations_status", "status"),
        Index("idx_obligations_deadline", "deadline"),
    )


class DetectedChange(Base):
    """A meaningful change detected between document versions."""

    __tablename__ = "detected_changes"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    document_id = Column(String(36), ForeignKey("documents.id"), nullable=False)
    previous_document_id = Column(String(36), ForeignKey("documents.id"), nullable=True)
    field = Column(String(255), nullable=False)
    previous_value = Column(Text, nullable=False)
    new_value = Column(Text, nullable=False)
    change_type = Column(String(100), nullable=False)  # deadline, amount, requirement, schedule, condition, other
    significance = Column(String(50), default="medium")  # critical, high, medium, low
    consequence = Column(Text, nullable=True)
    confidence = Column(Float, default=0.0)
    is_reviewed = Column(Boolean, default=False)
    detected_at = Column(DateTime, default=utc_now)
    created_at = Column(DateTime, default=utc_now)

    __table_args__ = (
        Index("idx_changes_document", "document_id"),
        Index("idx_changes_type", "change_type"),
    )


class Notification(Base):
    """A user notification / alert."""

    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(512), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="info")  # info, warning, success, error
    is_read = Column(Boolean, default=False)
    action_url = Column(String(1024), nullable=True)
    related_document_id = Column(String(36), ForeignKey("documents.id"), nullable=True)
    related_obligation_id = Column(String(36), ForeignKey("obligations.id"), nullable=True)
    created_at = Column(DateTime, default=utc_now)

    __table_args__ = (
        Index("idx_notifications_read", "is_read"),
        Index("idx_notifications_created", "created_at"),
    )


class ActivityLog(Base):
    """System activity log for transparency."""

    __tablename__ = "activity_log"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    action_type = Column(String(100), nullable=False)  # import, extraction, change_detected, alert, user_action, system
    title = Column(String(512), nullable=False)
    description = Column(Text, nullable=True)
    source_id = Column(String(36), ForeignKey("sources.id"), nullable=True)
    document_id = Column(String(36), ForeignKey("documents.id"), nullable=True)
    metadata_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    __table_args__ = (
        Index("idx_activity_type", "action_type"),
        Index("idx_activity_created", "created_at"),
    )


class ProcessingJob(Base):
    """Background processing job tracker."""

    __tablename__ = "processing_jobs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    job_type = Column(String(100), nullable=False)  # extraction, embedding, change_detection, ocr
    document_id = Column(String(36), ForeignKey("documents.id"), nullable=True)
    status = Column(String(50), default="queued")  # queued, running, completed, failed
    progress = Column(Float, default=0.0)  # 0.0 - 1.0
    error_message = Column(Text, nullable=True)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    __table_args__ = (
        Index("idx_jobs_status", "status"),
    )
