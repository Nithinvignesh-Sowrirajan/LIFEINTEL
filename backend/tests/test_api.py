"""
LIFEINTEL — Backend Integration & Unit Tests
Tests core database schemas, API routes, security boundaries, and reasoning endpoints.
"""

import os
import sys
import pytest
from pathlib import Path

# Ensure backend directory is in python path
backend_dir = str(Path(__file__).parent.parent)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi.testclient import TestClient
from main import app
from database.connection import init_db
from seed import seed_database

@pytest.fixture(scope="session", autouse=True)
def setup_test_environment():
    init_db()
    seed_database()

@pytest.fixture
def client():
    return TestClient(app)

def test_health_check(client):
    """Verify system health and database connectivity."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database"] is True
    assert data["version"] == "0.1.0"

def test_system_stats(client):
    """Verify aggregated intelligence statistics."""
    response = client.get("/api/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["documentsTracked"] >= 1
    assert data["activeObligations"] >= 1
    assert data["detectedChanges"] >= 1
    assert data["systemStatus"] == "ready"

def test_list_documents(client):
    """Verify document catalog indexing and fact count derivation."""
    response = client.get("/api/documents")
    assert response.status_code == 200
    docs = response.json()
    assert isinstance(docs, list)
    assert len(docs) >= 1
    # Check that documents have required fields
    doc = docs[0]
    assert "name" in doc
    assert "file_type" in doc
    assert "extracted_fact_count" in doc
    assert "status" in doc

def test_obligations_and_patch(client):
    """Verify obligation retrieval and state transition."""
    response = client.get("/api/obligations")
    assert response.status_code == 200
    obs = response.json()
    assert len(obs) >= 1

    target = obs[0]
    target_id = target["id"]

    # Toggle status to completed
    patch_res = client.patch(f"/api/obligations/{target_id}", json={"status": "completed"})
    assert patch_res.status_code == 200
    assert patch_res.json()["status"] == "completed"

    # Revert back to upcoming
    revert_res = client.patch(f"/api/obligations/{target_id}", json={"status": "upcoming"})
    assert revert_res.status_code == 200
    assert revert_res.json()["status"] == "upcoming"

def test_change_intelligence(client):
    """Verify semantic change intelligence reports."""
    response = client.get("/api/changes")
    assert response.status_code == 200
    changes = response.json()
    assert len(changes) >= 1
    # Verify signature deadline shift exists
    deadline_change = next((c for c in changes if "deadline" in c["change_type"].lower()), None)
    assert deadline_change is not None
    assert "consequence" in deadline_change

def test_source_management(client):
    """Verify source permission toggling."""
    response = client.get("/api/sources")
    assert response.status_code == 200
    sources = response.json()
    assert len(sources) >= 1

    source_id = sources[0]["id"]
    initial_monitored = sources[0]["is_monitored"]

    # Toggle monitoring status
    toggle_res = client.patch(f"/api/sources/{source_id}", json={"status": "connected", "is_monitored": not initial_monitored})
    assert toggle_res.status_code == 200
    assert toggle_res.json()["is_monitored"] == (not initial_monitored)

    # Restore initial state
    client.patch(f"/api/sources/{source_id}", json={"status": "connected", "is_monitored": initial_monitored})

def test_ask_lifeintel_deadline_query(client):
    """Verify natural-language reasoning returns grounded sources and answers."""
    response = client.post("/api/ask", json={"question": "What deadlines are approaching?"})
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert "sources" in data
    assert len(data["sources"]) > 0
    assert "Internship" in data["answer"] or "deadline" in data["answer"].lower()

def test_transparency_summary(client):
    """Verify privacy guarantees and storage inspection."""
    response = client.get("/api/transparency/summary")
    assert response.status_code == 200
    data = response.json()
    assert "Local" in data["privacyMode"]
    assert data["cloudAISharing"] is False
    assert data["externalAPICalls"] == 0

def test_source_create_and_delete(client):
    """Verify dynamic folder authorization and revocation."""
    post_res = client.post("/api/sources", json={
        "name": "Test Folder Authorization",
        "type": "folder",
        "path": "C:/Test/Path",
        "is_monitored": True
    })
    assert post_res.status_code == 200
    new_src = post_res.json()
    src_id = new_src["id"]
    assert new_src["name"] == "Test Folder Authorization"

    # Delete source
    del_res = client.delete(f"/api/sources/{src_id}")
    assert del_res.status_code == 200

def test_obligation_create_and_delete(client):
    """Verify manual obligation creation and deletion."""
    create_res = client.post("/api/obligations", json={
        "title": "Review AI Thesis Outline",
        "description": "Prepare slides for department colloquium",
        "deadline": "2026-11-25T14:00:00",
        "urgency": "high",
        "category": "academic"
    })
    assert create_res.status_code == 200
    ob_id = create_res.json()["id"]

    del_res = client.delete(f"/api/obligations/{ob_id}")
    assert del_res.status_code == 200

