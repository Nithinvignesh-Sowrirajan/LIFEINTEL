"""
LIFEINTEL — Semantic Change Intelligence & Consequence Engine
Compares document versions, detects shifted deadlines, requirement alterations, and fee updates.
Computes actionable consequence assessments across connected obligations.
"""

from datetime import datetime
from typing import List, Dict, Any, Optional
from services.information_extractor import ExtractedFactData
from services.consequence_reasoner import ConsequenceReasoner

class DetectedChangeData:
    def __init__(
        self,
        field: str,
        previous_value: str,
        new_value: str,
        change_type: str,
        significance: str,
        consequence: str,
        confidence: float,
        previous_document_id: Optional[str] = None,
        recommended_action: Optional[str] = None,
    ):
        self.field = field
        self.previous_value = previous_value
        self.new_value = new_value
        self.change_type = change_type
        self.significance = significance
        self.consequence = consequence
        self.confidence = confidence
        self.previous_document_id = previous_document_id
        self.recommended_action = recommended_action

class ChangeDetector:
    """Semantic comparison engine for document revisions."""

    @classmethod
    def compare_facts(
        cls,
        new_facts: List[ExtractedFactData],
        old_facts: List[Any],  # SQLAlchemy models or dicts
        new_doc_name: str,
        old_doc_name: str,
        previous_doc_id: Optional[str] = None,
        existing_tasks: Optional[List[Dict[str, Any]]] = None,
    ) -> List[DetectedChangeData]:
        changes: List[DetectedChangeData] = []
        tasks = existing_tasks or []

        # Map old facts by (fact_type, key)
        old_map: Dict[str, Any] = {}
        for f in old_facts:
            key = f"{f.fact_type}_{f.key}"
            old_map[key] = f

        for new_f in new_facts:
            lookup_key = f"{new_f.fact_type}_{new_f.key}"
            if lookup_key in old_map:
                old_f = old_map[lookup_key]

                # Check if values differ meaningfully
                if new_f.value.strip().lower() != old_f.value.strip().lower():
                    # 1. Deadline Shift with Consequence Reasoning
                    if new_f.fact_type == "deadline":
                        assessment = ConsequenceReasoner.evaluate_deadline_shift(
                            old_deadline_str=old_f.value,
                            new_deadline_str=new_f.value,
                            subject="Internship Application" if "internship" in new_doc_name.lower() else "Submission",
                            existing_tasks=tasks,
                            source_doc=new_doc_name,
                            prev_doc=old_doc_name,
                        )

                        changes.append(
                            DetectedChangeData(
                                field="Application / Submission Deadline",
                                previous_value=old_f.value,
                                new_value=new_f.value,
                                change_type="deadline",
                                significance=assessment.impact_level,
                                consequence=f"{assessment.explanation} {assessment.recommended_action}",
                                confidence=assessment.confidence,
                                previous_document_id=previous_doc_id,
                                recommended_action=assessment.recommended_action,
                            )
                        )

                    # 2. Fee or Amount Change
                    elif new_f.fact_type == "amount":
                        consequence = (
                            f"Monetary figure changed from {old_f.value} to {new_f.value}. "
                            "Review personal budget or student reimbursement allocation."
                        )
                        changes.append(
                            DetectedChangeData(
                                field="Associated Fee / Amount",
                                previous_value=old_f.value,
                                new_value=new_f.value,
                                change_type="amount",
                                significance="high",
                                consequence=consequence,
                                confidence=0.93,
                                previous_document_id=previous_doc_id,
                            )
                        )

            # Check for newly added requirements
            elif new_f.fact_type == "requirement":
                changes.append(
                    DetectedChangeData(
                        field="New Submission Requirement Added",
                        previous_value="Not previously mandated",
                        new_value=new_f.value,
                        change_type="requirement",
                        significance="high",
                        consequence=f"New requirement introduced in '{new_doc_name}': {new_f.value}. Verify compliance before deadline.",
                        confidence=0.92,
                        previous_document_id=previous_doc_id,
                    )
                )

        return changes
