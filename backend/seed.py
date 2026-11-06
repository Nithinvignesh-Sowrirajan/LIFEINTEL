"""
LIFEINTEL Backend — Database Seeder
Seeds realistic baseline data into SQLite if the database is newly initialized.
Uses timezone-neutral UTC timestamps for reliable storage.
"""

from datetime import datetime, timedelta, timezone
from database.connection import SessionLocal
from database.models import (
    Source, Document, ExtractedFact, Entity, Obligation,
    DetectedChange, Notification, ActivityLog
)

def seed_database():
    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(Source).first():
            return

        now = datetime.now(timezone.utc).replace(tzinfo=None)

        # 1. Sources
        src_docs = Source(
            id="src-documents",
            name="Documents Folder",
            type="folder",
            path="C:/Users/User/Documents/Academic",
            status="connected",
            is_monitored=True,
            last_sync_at=now - timedelta(minutes=15),
            item_count=12
        )
        src_downloads = Source(
            id="src-downloads",
            name="Downloads Folder",
            type="folder",
            path="C:/Users/User/Downloads",
            status="connected",
            is_monitored=True,
            last_sync_at=now - timedelta(minutes=45),
            item_count=8
        )
        src_email = Source(
            id="src-email",
            name="University Email (Outlook)",
            type="email",
            status="disconnected",
            is_monitored=False,
            item_count=0
        )
        src_cal = Source(
            id="src-calendar",
            name="Google Calendar",
            type="calendar",
            status="disconnected",
            is_monitored=False,
            item_count=0
        )
        db.add_all([src_docs, src_downloads, src_email, src_cal])
        db.flush()

        # 2. Documents
        doc1 = Document(
            id="doc-notice-v2",
            name="College_Notice_Updated.pdf",
            file_type="pdf",
            file_size=245800,
            file_hash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            file_path="storage/College_Notice_Updated.pdf",
            original_path="C:/Users/User/Documents/Academic/College_Notice_Updated.pdf",
            status="processed",
            version=2,
            source_id=src_docs.id,
            imported_at=now - timedelta(hours=2),
            processed_at=now - timedelta(hours=2, seconds=-15),
        )
        doc2 = Document(
            id="doc-notice-v1",
            name="College_Notice_Original.pdf",
            file_type="pdf",
            file_size=238100,
            file_hash="d41d8cd98f00b204e9800998ecf8427e",
            file_path="storage/College_Notice_Original.pdf",
            original_path="C:/Users/User/Documents/Academic/College_Notice_Original.pdf",
            status="processed",
            version=1,
            source_id=src_docs.id,
            imported_at=now - timedelta(days=7),
            processed_at=now - timedelta(days=7, seconds=-20),
        )
        doc3 = Document(
            id="doc-resume",
            name="Nithin_Resume_Draft_v3.docx",
            file_type="docx",
            file_size=112400,
            file_hash="9f83c605d4a85f8c6fb2f68851f4be47054744c61180ebd075d130b1",
            file_path="storage/Nithin_Resume_Draft_v3.docx",
            original_path="C:/Users/User/Documents/Academic/Nithin_Resume_Draft_v3.docx",
            status="processed",
            version=3,
            source_id=src_docs.id,
            imported_at=now - timedelta(days=1),
            processed_at=now - timedelta(days=1, seconds=-10),
        )
        doc4 = Document(
            id="doc-capstone-brief",
            name="Capstone_Project_Guidelines_2026.pdf",
            file_type="pdf",
            file_size=524000,
            file_hash="675971adef324e90",
            file_path="storage/Capstone_Project_Guidelines_2026.pdf",
            original_path="C:/Users/User/Downloads/Capstone_Project_Guidelines_2026.pdf",
            status="processed",
            version=1,
            source_id=src_downloads.id,
            imported_at=now - timedelta(days=4),
            processed_at=now - timedelta(days=4, seconds=-35),
        )
        db.add_all([doc1, doc2, doc3, doc4])
        db.flush()

        # Link doc1 parent to doc2
        doc1.parent_document_id = doc2.id

        # 3. Extracted Facts
        fact1 = ExtractedFact(
            document_id=doc1.id,
            fact_type="deadline",
            key="internship_application_deadline",
            value="November 10, 2026",
            normalized_value="2026-11-10T23:59:59",
            confidence=0.98,
            context="All interested candidates must submit their application dossier by November 10, 2026, 23:59 IST.",
            page_number=1,
            is_verified=True
        )
        fact2 = ExtractedFact(
            document_id=doc2.id,
            fact_type="deadline",
            key="internship_application_deadline",
            value="November 15, 2026",
            normalized_value="2026-11-15T23:59:59",
            confidence=0.95,
            context="Preliminary deadline for industry internship submission: November 15, 2026.",
            page_number=1,
            is_verified=True
        )
        fact3 = ExtractedFact(
            document_id=doc3.id,
            fact_type="task",
            key="resume_target_completion",
            value="Complete final revisions by November 12, 2026",
            normalized_value="2026-11-12T18:00:00",
            confidence=0.92,
            context="Review pending projects section and export finalized PDF by Nov 12.",
            page_number=1,
            is_verified=False
        )
        fact4 = ExtractedFact(
            document_id=doc4.id,
            fact_type="deadline",
            key="capstone_milestone_1",
            value="November 20, 2026",
            normalized_value="2026-11-20T17:00:00",
            confidence=0.96,
            context="Phase 1 submission deadline: Architecture and prototype evaluation on Nov 20, 2026.",
            page_number=3,
            is_verified=True
        )
        db.add_all([fact1, fact2, fact3, fact4])
        db.flush()

        # 4. Entities
        e1 = Entity(name="AMET University", entity_type="organization", document_id=doc1.id, mention_count=5)
        e2 = Entity(name="Industry Internship Program", entity_type="program", document_id=doc1.id, mention_count=4)
        e3 = Entity(name="Capstone Review Committee", entity_type="organization", document_id=doc4.id, mention_count=3)
        e4 = Entity(name="AWS Cloud Practitioner Certificate", entity_type="certification", document_id=doc2.id, mention_count=2)
        db.add_all([e1, e2, e3, e4])

        # 5. Detected Changes
        change1 = DetectedChange(
            document_id=doc1.id,
            previous_document_id=doc2.id,
            field="Internship Application Deadline",
            previous_value="November 15, 2026",
            new_value="November 10, 2026",
            change_type="deadline",
            significance="critical",
            consequence="Existing resume completion date (Nov 12) is 2 days AFTER the new deadline. Must finalize resume before Nov 8.",
            confidence=0.97,
            is_reviewed=False,
            detected_at=now - timedelta(hours=2)
        )
        change2 = DetectedChange(
            document_id=doc1.id,
            previous_document_id=doc2.id,
            field="Required Attachments",
            previous_value="Resume, Academic Transcript",
            new_value="Resume, Academic Transcript, Project Portfolio Link",
            change_type="requirement",
            significance="high",
            consequence="Added portfolio requirement. Check your GitHub repository showcase link.",
            confidence=0.94,
            is_reviewed=False,
            detected_at=now - timedelta(hours=2)
        )
        db.add_all([change1, change2])

        # 6. Obligations
        ob1 = Obligation(
            id="obl-internship",
            title="Internship Application Dossier",
            description="Submit resume, transcript, and project portfolio via university portal.",
            deadline=now + timedelta(days=8),
            status="upcoming",
            urgency="critical",
            confidence=0.98,
            category="academic",
            source_document_id=doc1.id,
            source_fact_id=fact1.id
        )
        ob2 = Obligation(
            id="obl-capstone",
            title="Capstone Milestone 1 Submission",
            description="Upload prototype architecture document and testing artifacts.",
            deadline=now + timedelta(days=18),
            status="upcoming",
            urgency="high",
            confidence=0.96,
            category="academic",
            source_document_id=doc4.id,
            source_fact_id=fact4.id
        )
        ob3 = Obligation(
            id="obl-cert",
            title="Cloud Certification Renewal",
            description="Complete the recertification assessment before the expiration window closes.",
            deadline=now + timedelta(days=29),
            status="upcoming",
            urgency="medium",
            confidence=0.90,
            category="professional",
            source_document_id=doc2.id
        )
        ob4 = Obligation(
            id="obl-medical",
            title="Annual Health & Dental Checkup",
            description="Scheduled consultation at City Medical Centre.",
            deadline=now + timedelta(days=12),
            status="upcoming",
            urgency="medium",
            confidence=0.88,
            category="personal"
        )
        db.add_all([ob1, ob2, ob3, ob4])

        # 7. Notifications
        notif1 = Notification(
            title="Deadline Moved Earlier",
            message="Internship application deadline shifted from Nov 15 to Nov 10 in College_Notice_Updated.pdf.",
            type="warning",
            is_read=False,
            action_url="/changes",
            related_document_id=doc1.id
        )
        db.add(notif1)

        # 8. Activity Log
        logs = [
            ActivityLog(action_type="import", title="Document Analyzed", description="Processed College_Notice_Updated.pdf (245 KB)", document_id=doc1.id, source_id=src_docs.id, created_at=now - timedelta(hours=2)),
            ActivityLog(action_type="change_detected", title="Critical Change Detected", description="Deadline shifted: Nov 15 -> Nov 10", document_id=doc1.id, source_id=src_docs.id, created_at=now - timedelta(hours=2)),
            ActivityLog(action_type="extraction", title="Obligation Derived", description="Created obligation: Internship Application Dossier (Due Nov 10)", document_id=doc1.id, created_at=now - timedelta(hours=2)),
            ActivityLog(action_type="import", title="Document Analyzed", description="Processed Nithin_Resume_Draft_v3.docx (112 KB)", document_id=doc3.id, source_id=src_docs.id, created_at=now - timedelta(days=1)),
            ActivityLog(action_type="system", title="Background Scan Completed", description="Scanned 2 authorized local folders; 20 files indexed.", created_at=now - timedelta(minutes=15)),
        ]
        db.add_all(logs)

        db.commit()
    finally:
        db.close()
