"""
LIFEINTEL — Phase 2 & 3 Contextual Memory & Extraction Tests
"""

import os
import sys
from pathlib import Path
import pytest

backend_dir = str(Path(__file__).parent.parent)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi.testclient import TestClient
import pymupdf as fitz
import docx

from main import app
from services.document_parser import DocumentParser
from services.information_extractor import InformationExtractor
from services.change_detector import ChangeDetector
from services.contextual_memory import ContextualMemoryEngine
from database.connection import init_db
from seed import seed_database

@pytest.fixture(scope="session", autouse=True)
def setup_env():
    init_db()
    seed_database()

@pytest.fixture
def sample_pdf(tmp_path):
    pdf_path = str(tmp_path / "Semester_Notice_2026.pdf")
    doc = fitz.open()
    page = doc.new_page()
    text = (
        "AMET University Semester Directive\n"
        "All candidates must submit final project documentation before December 15, 2026.\n"
        "Late submission will incur a mandatory tuition fee surcharge of $75 USD.\n"
        "Required documents: Verification Form, Academic Transcript, and Mentor Signoff."
    )
    page.insert_text((50, 72), text)
    doc.save(pdf_path)
    doc.close()
    return pdf_path

@pytest.fixture
def sample_docx(tmp_path):
    docx_path = str(tmp_path / "Internship_Deliverable.docx")
    doc = docx.Document()
    doc.add_heading("Internship Final Milestones", level=1)
    doc.add_paragraph("Preliminary progress presentation scheduled for November 28, 2026.")
    doc.add_paragraph("Submission deadline for company evaluation rubric: December 05, 2026.")
    doc.save(docx_path)
    return docx_path

@pytest.fixture
def sample_txt(tmp_path):
    txt_path = str(tmp_path / "Personal_Notes.txt")
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write("Need to complete scholarship renewal form by October 30, 2026. Grant amount: $1200.")
    return txt_path

def test_parse_and_extract_pdf(sample_pdf):
    parsed = DocumentParser.parse(sample_pdf)
    assert parsed.file_type == "pdf"
    assert "AMET University" in parsed.full_text

    facts = InformationExtractor.extract_facts(parsed)
    assert len(facts) >= 2
    deadline_facts = [f for f in facts if f.fact_type == "deadline"]
    assert len(deadline_facts) >= 1
    assert "December 15" in deadline_facts[0].value

    amount_facts = [f for f in facts if f.fact_type == "amount"]
    assert len(amount_facts) >= 1
    assert "75" in amount_facts[0].value

def test_parse_and_extract_docx(sample_docx):
    parsed = DocumentParser.parse(sample_docx)
    assert parsed.file_type == "docx"
    assert "Internship Final Milestones" in parsed.full_text

    facts = InformationExtractor.extract_facts(parsed)
    assert len(facts) >= 1

def test_parse_and_extract_txt(sample_txt):
    parsed = DocumentParser.parse(sample_txt)
    assert parsed.file_type == "txt"

    facts = InformationExtractor.extract_facts(parsed)
    assert len(facts) >= 1
    amounts = [f for f in facts if f.fact_type == "amount"]
    assert len(amounts) >= 1
    assert "1200" in amounts[0].value

def test_upload_api_with_real_file(sample_pdf):
    client = TestClient(app)
    with open(sample_pdf, "rb") as f:
        response = client.post(
            "/api/documents/upload",
            files={"file": ("Direct_Upload_Notice.pdf", f, "application/pdf")},
        )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "processed"
    doc_id = data["id"]

    facts_res = client.get(f"/api/documents/{doc_id}/facts")
    assert facts_res.status_code == 200
    assert len(facts_res.json()) == data["facts_extracted"]

def test_duplicate_upload_detection(sample_pdf):
    client = TestClient(app)
    with open(sample_pdf, "rb") as f:
        res1 = client.post(
            "/api/documents/upload",
            files={"file": ("Duplicate_Test_Notice.pdf", f, "application/pdf")},
        )
    assert res1.status_code == 200

    with open(sample_pdf, "rb") as f:
        res2 = client.post(
            "/api/documents/upload",
            files={"file": ("Duplicate_Test_Notice.pdf", f, "application/pdf")},
        )
    assert res2.status_code == 200
    assert res2.json()["status"] == "duplicate"

def test_contextual_memory_similarity():
    """Verify semantic similarity and entity extraction."""
    text_1 = "AMET University Internship Application Notice with submission requirements"
    text_2 = "Nithin Resume Draft tailored for AMET University Internship Application"
    text_3 = "Unrelated medical appointment receipt for dental checkup"

    sim_1_2 = ContextualMemoryEngine.compute_similarity(text_1, text_2)
    sim_1_3 = ContextualMemoryEngine.compute_similarity(text_1, text_3)

    assert sim_1_2 > sim_1_3
    assert sim_1_2 > 0.40

    entities = ContextualMemoryEngine.extract_entities(text_1)
    assert any("University" in e["name"] for e in entities)

def test_memory_graph_api():
    """Verify /api/memory/graph endpoint returns connected entities and links."""
    client = TestClient(app)
    res = client.get("/api/memory/graph")
    assert res.status_code == 200
    data = res.json()
    assert "entities" in data
    assert "relationships" in data
    assert data["totalEntities"] >= 1
