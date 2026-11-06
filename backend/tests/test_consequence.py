"""
LIFEINTEL — Phase 4 & 5 Consequence Reasoning & Watchdog Tests
Verifies temporal consequence reasoning, conflict gap detection,
and proactive folder monitoring mechanics.
"""

import sys
from pathlib import Path
import pytest

backend_dir = str(Path(__file__).parent.parent)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from services.consequence_reasoner import ConsequenceReasoner
from services.change_detector import ChangeDetector
from services.folder_monitor import ProactiveFolderMonitor, DocumentEventHandler

def test_deadline_moved_earlier_with_conflicting_task():
    """
    Test signature intelligence scenario:
    - Application deadline moves earlier: Nov 15 -> Nov 10
    - Existing task is scheduled for Nov 12 (2 days late!)
    - Consequence reasoner must flag critical impact, identify conflict, and recommend earlier completion.
    """
    existing_tasks = [
        {"id": "t1", "title": "Complete Resume Draft", "deadline": "2026-11-12T18:00:00"}
    ]

    assessment = ConsequenceReasoner.evaluate_deadline_shift(
        old_deadline_str="November 15, 2026",
        new_deadline_str="November 10, 2026",
        subject="Internship Application",
        existing_tasks=existing_tasks,
        source_doc="College_Notice_Updated.pdf",
        prev_doc="College_Notice_Original.pdf",
    )

    assert assessment.impact_level == "critical"
    assert "moved forward by 5 days" in assessment.explanation
    assert "2 days" in assessment.explanation
    assert "Complete Resume Draft" in assessment.affected_obligations
    assert "before November 08" in assessment.recommended_action
    assert assessment.confidence >= 0.95

def test_deadline_extended():
    """Verify consequence reasoning when deadline is extended."""
    assessment = ConsequenceReasoner.evaluate_deadline_shift(
        old_deadline_str="November 10, 2026",
        new_deadline_str="November 20, 2026",
        subject="Capstone Submission",
        existing_tasks=[],
        source_doc="Doc_v2.pdf",
        prev_doc="Doc_v1.pdf",
    )

    assert assessment.impact_level == "low"
    assert "extended by 10 days" in assessment.explanation

def test_requirement_addition():
    """Verify requirement alteration consequence."""
    assessment = ConsequenceReasoner.evaluate_requirement_change(
        new_requirements=["GitHub Project Showcase Link", "Mentor Signoff Form"],
        subject="Internship Application",
        source_doc="College_Notice_Updated.pdf",
    )

    assert assessment.impact_level == "high"
    assert "GitHub Project Showcase Link" in assessment.recommended_action

def test_proactive_folder_monitor_lifecycle(tmp_path):
    """Verify watchdog observer starts, schedules approved directory, and stops cleanly."""
    monitor = ProactiveFolderMonitor()
    events = []

    def on_event(path):
        events.append(path)

    # Start monitor on temporary directory
    monitor.start([str(tmp_path)], on_event)
    status = monitor.get_status()
    assert status["is_running"] is True
    assert status["monitored_folders_count"] == 1

    # Stop monitor
    monitor.stop()
    status_stopped = monitor.get_status()
    assert status_stopped["is_running"] is False

