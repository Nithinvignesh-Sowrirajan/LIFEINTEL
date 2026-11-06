"""
LIFEINTEL — Capstone Research Benchmark & Evaluation Suite
Empirical quantitative evaluation for Section 10:
Context-Aware Obligation and Change Reasoning Engine.
Calculates extraction accuracy, temporal reasoning precision, recall, and latency.
"""

import sys
import time
from pathlib import Path
import pytest

backend_dir = str(Path(__file__).parent.parent)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from services.document_parser import DocumentParser, ParsedDocument, ParsedPage
from services.information_extractor import InformationExtractor
from services.change_detector import ChangeDetector
from services.consequence_reasoner import ConsequenceReasoner
from services.contextual_memory import ContextualMemoryEngine

# Benchmark Dataset of Synthetic and Realistic Test Notices
BENCHMARK_CORPUS = [
    {
        "text": "Academic Council Directive: Final internship submission deadline is November 10, 2026. Required documents: Resume and GitHub portfolio link.",
        "ground_truth_deadlines": ["November 10, 2026"],
        "ground_truth_requirements": ["Resume", "portfolio"],
    },
    {
        "text": "All project groups must submit draft report before December 15, 2026. Late submission fee is $50 USD.",
        "ground_truth_deadlines": ["December 15, 2026"],
        "ground_truth_amounts": ["$50"],
    },
    {
        "text": "Certification exam registration closes on October 25, 2026. Mandatory examination voucher cost is $150.",
        "ground_truth_deadlines": ["October 25, 2026"],
        "ground_truth_amounts": ["$150"],
    },
    {
        "text": "Routine campus announcement: library will be closed this Sunday. No submissions due.",
        "ground_truth_deadlines": [],
    },
]

def test_benchmark_deadline_extraction_accuracy():
    """Evaluate precision and recall of temporal deadline extraction."""
    true_positives = 0
    false_positives = 0
    false_negatives = 0

    start_time = time.time()
    for item in BENCHMARK_CORPUS:
        doc = ParsedDocument(
            file_path="bench.txt",
            file_name="bench.txt",
            file_type="txt",
            file_size=len(item["text"]),
            file_hash="test",
            full_text=item["text"],
            pages=[ParsedPage(page_number=1, text=item["text"])],
            metadata={},
        )
        facts = InformationExtractor.extract_facts(doc)
        extracted_dates = [f.value for f in facts if f.fact_type in ["deadline", "date"]]

        expected = item.get("ground_truth_deadlines", [])

        if expected:
            for exp in expected:
                if any(exp in ext for ext in extracted_dates):
                    true_positives += 1
                else:
                    false_negatives += 1
        else:
            if extracted_dates:
                false_positives += len(extracted_dates)

    latency_ms = (time.time() - start_time) * 1000 / len(BENCHMARK_CORPUS)

    precision = true_positives / (true_positives + false_positives) if (true_positives + false_positives) > 0 else 1.0
    recall = true_positives / (true_positives + false_negatives) if (true_positives + false_negatives) > 0 else 1.0
    f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0

    print(f"\n[BENCHMARK] Deadline Extraction -> Precision: {precision:.2f}, Recall: {recall:.2f}, F1: {f1:.2f}, Latency: {latency_ms:.2f}ms/doc")

    assert precision >= 0.85
    assert recall >= 0.85
    assert f1 >= 0.85
    assert latency_ms < 50.0  # Ultra-fast CPU execution

def test_benchmark_consequence_conflict_detection():
    """Evaluate consequence reasoning accuracy on shifted deadlines and task conflicts."""
    # Test 5 temporal shift scenarios
    scenarios = [
        # (old_deadline, new_deadline, task_date, should_conflict)
        ("November 15, 2026", "November 10, 2026", "2026-11-12T18:00:00", True),
        ("November 15, 2026", "November 20, 2026", "2026-11-12T18:00:00", False),
        ("December 01, 2026", "November 25, 2026", "2026-11-28T10:00:00", True),
        ("December 01, 2026", "November 25, 2026", "2026-11-20T10:00:00", False),
    ]

    correct_predictions = 0
    for old_d, new_d, task_d, expect_conflict in scenarios:
        tasks = [{"id": "t", "title": "Milestone Task", "deadline": task_d}]
        assessment = ConsequenceReasoner.evaluate_deadline_shift(
            old_deadline_str=old_d,
            new_deadline_str=new_d,
            subject="Academic Milestone",
            existing_tasks=tasks,
            source_doc="Doc_v2.pdf",
            prev_doc="Doc_v1.pdf",
        )

        has_conflict = assessment.impact_level == "critical"
        if has_conflict == expect_conflict:
            correct_predictions += 1

    accuracy = correct_predictions / len(scenarios)
    print(f"\n[BENCHMARK] Consequence Reasoning Accuracy: {accuracy * 100:.1f}%")
    assert accuracy == 1.0

