"""
LIFEINTEL — Consequence Reasoning Engine
Signature intelligence feature: evaluates how detected changes, shifted deadlines,
and new requirements affect existing obligations, schedules, and prerequisites.
"""

from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional

class ConsequenceAssessment:
    def __init__(
        self,
        title: str,
        impact_level: str,  # critical, high, medium, low
        explanation: str,
        recommended_action: str,
        affected_obligations: List[str],
        supporting_sources: List[str],
        confidence: float,
    ):
        self.title = title
        self.impact_level = impact_level
        self.explanation = explanation
        self.recommended_action = recommended_action
        self.affected_obligations = affected_obligations
        self.supporting_sources = supporting_sources
        self.confidence = confidence

    def to_dict(self) -> Dict[str, Any]:
        return {
            "title": self.title,
            "impact_level": self.impact_level,
            "explanation": self.explanation,
            "recommended_action": self.recommended_action,
            "affected_obligations": self.affected_obligations,
            "supporting_sources": self.supporting_sources,
            "confidence": self.confidence,
        }

class ConsequenceReasoner:
    """Temporal and contextual reasoning engine for personal consequence derivation."""

    @classmethod
    def evaluate_deadline_shift(
        cls,
        old_deadline_str: str,
        new_deadline_str: str,
        subject: str,
        existing_tasks: List[Dict[str, Any]],
        source_doc: str,
        prev_doc: str,
    ) -> ConsequenceAssessment:
        """
        Reason about consequences when a deadline moves:
        1. Calculate shift delta (days earlier or later)
        2. Detect conflicts with existing scheduled tasks
        3. Formulate recommended action with buffer days
        """
        old_dt = cls._parse_date(old_deadline_str)
        new_dt = cls._parse_date(new_deadline_str)

        if not old_dt or not new_dt:
            return ConsequenceAssessment(
                title=f"{subject} Deadline Changed",
                impact_level="medium",
                explanation=f"Deadline was updated from {old_deadline_str} to {new_deadline_str}.",
                recommended_action=f"Review your commitments for {subject} before {new_deadline_str}.",
                affected_obligations=[],
                supporting_sources=[source_doc, prev_doc],
                confidence=0.88,
            )

        delta_days = (new_dt - old_dt).days
        is_earlier = delta_days < 0
        days_count = abs(delta_days)

        # Check for conflicting tasks scheduled after new deadline
        conflicting_tasks = []
        for task in existing_tasks:
            task_deadline_str = task.get("deadline")
            if task_deadline_str:
                task_dt = cls._parse_date(task_deadline_str)
                if task_dt and task_dt > new_dt:
                    conflicting_tasks.append({
                        "id": task.get("id"),
                        "title": task.get("title", "Task"),
                        "days_late": (task_dt - new_dt).days,
                        "date_str": task_dt.strftime("%B %d"),
                    })

        if is_earlier:
            if conflicting_tasks:
                task_names = ", ".join([f"'{t['title']}' (scheduled {t['date_str']})" for t in conflicting_tasks])
                days_late = conflicting_tasks[0]["days_late"]
                suggested_dt = new_dt - timedelta(days=2)
                suggested_str = suggested_dt.strftime("%B %d")

                explanation = (
                    f"Your {subject} deadline moved forward by {days_count} days (from {old_dt.strftime('%B %d')} "
                    f"to {new_dt.strftime('%B %d')}). Current scheduled preparation task {task_names} is "
                    f"{days_late} days AFTER the new application deadline."
                )
                recommended_action = (
                    f"Accelerate your schedule: Complete {conflicting_tasks[0]['title']} "
                    f"before {suggested_str} to ensure time for final review and submission."
                )
                impact_level = "critical"
            else:
                suggested_dt = new_dt - timedelta(days=1)
                explanation = (
                    f"{subject} deadline moved forward by {days_count} days to {new_dt.strftime('%B %d')}."
                )
                recommended_action = f"Complete final prerequisites before {suggested_dt.strftime('%B %d')}."
                impact_level = "high"
        else:
            explanation = (
                f"{subject} deadline was extended by {days_count} days to {new_dt.strftime('%B %d')}."
            )
            recommended_action = "You have additional preparation time. Use it to refine submission materials."
            impact_level = "low"

        return ConsequenceAssessment(
            title=f"{subject} Deadline Shift",
            impact_level=impact_level,
            explanation=explanation,
            recommended_action=recommended_action,
            affected_obligations=[t["title"] for t in conflicting_tasks],
            supporting_sources=[source_doc, prev_doc],
            confidence=0.98,
        )

    @classmethod
    def evaluate_requirement_change(
        cls,
        new_requirements: List[str],
        subject: str,
        source_doc: str,
    ) -> ConsequenceAssessment:
        req_list = ", ".join(new_requirements)
        return ConsequenceAssessment(
            title=f"New Mandatory Requirements for {subject}",
            impact_level="high",
            explanation=f"Updated document specifies new mandatory prerequisites: {req_list}.",
            recommended_action=f"Verify all new items ({req_list}) are assembled and validated before submission.",
            affected_obligations=[],
            supporting_sources=[source_doc],
            confidence=0.94,
        )

    @staticmethod
    def _parse_date(date_str: str) -> Optional[datetime]:
        for fmt in ["%Y-%m-%dT%H:%M:%S", "%Y-%m-%d", "%B %d, %Y", "%B %d %Y", "%b %d, %Y", "%b %d %Y"]:
            try:
                return datetime.strptime(date_str.split(".")[0], fmt)
            except ValueError:
                pass
        return None

