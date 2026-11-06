"""
LIFEINTEL — Structured Information Extractor
Extracts dates, deadlines, obligations, amounts, requirements, and entities from parsed text.
Provides calibrated confidence metrics and contextual snippets for complete provenance.
"""

import re
from datetime import datetime
from typing import List, Dict, Any, Optional
from services.document_parser import ParsedDocument

class ExtractedFactData:
    def __init__(
        self,
        fact_type: str,
        key: str,
        value: str,
        normalized_value: Optional[str] = None,
        confidence: float = 0.90,
        context: Optional[str] = None,
        page_number: int = 1,
    ):
        self.fact_type = fact_type
        self.key = key
        self.value = value
        self.normalized_value = normalized_value
        self.confidence = confidence
        self.context = context
        self.page_number = page_number

    def to_dict(self) -> Dict[str, Any]:
        return {
            "fact_type": self.fact_type,
            "key": self.key,
            "value": self.value,
            "normalized_value": self.normalized_value,
            "confidence": self.confidence,
            "context": self.context,
            "page_number": self.page_number,
        }

class InformationExtractor:
    """Heuristic and regex-based structured information extraction pipeline."""

    MONTHS = (
        r"(?:January|February|March|April|May|June|July|August|September|October|November|December|"
        r"Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)"
    )

    DATE_PATTERNS = [
        # November 10, 2026 or Nov 10, 2026
        rf"\b({MONTHS}\s+\d{{1,2}}(?:st|nd|rd|th)?(?:,?\s+\d{{4}})?)\b",
        # 10 November 2026
        rf"\b(\d{{1,2}}(?:st|nd|rd|th)?\s+{MONTHS}(?:,?\s+\d{{4}})?)\b",
        # 2026-11-10 or 2026/11/10
        r"\b(\d{4}[-/]\d{1,2}[-/]\d{1,2})\b",
    ]

    AMOUNT_PATTERN = (
        r"(?<!\w)(?:[\$€£₹]|Rs\.?|INR|USD)\s*\d+(?:,\d{3})*(?:\.\d{2})?(?:\s*(?:USD|INR|EUR))?"
        r"|(?<!\w)\d+(?:,\d{3})*(?:\.\d{2})?\s*(?:USD|INR|EUR)\b"
    )

    OBLIGATION_TRIGGERS = [
        "must submit", "deadline for", "required to", "submit before",
        "due date", "submission deadline", "mandatory to", "application deadline",
        "last date for", "scheduled for", "complete by", "complete before"
    ]

    REQUIREMENT_TRIGGERS = [
        "prerequisite", "eligible", "requirements:", "required documents:",
        "must provide", "mandatory submission of", "portfolio link", "transcript"
    ]

    @classmethod
    def extract_facts(cls, doc: ParsedDocument) -> List[ExtractedFactData]:
        facts: List[ExtractedFactData] = []

        for page in doc.pages:
            text = page.text
            lines = text.split("\n")

            for line in lines:
                line_clean = line.strip()
                if not line_clean or len(line_clean) < 5:
                    continue

                line_lower = line_clean.lower()

                # 1. Deadlines and Dates
                for pattern in cls.DATE_PATTERNS:
                    matches = re.finditer(pattern, line_clean, re.IGNORECASE)
                    for match in matches:
                        date_str = match.group(1)
                        is_deadline = any(trig in line_lower for trig in cls.OBLIGATION_TRIGGERS)

                        fact_type = "deadline" if is_deadline else "date"
                        key = "submission_deadline" if is_deadline else "mentioned_date"
                        confidence = 0.96 if is_deadline else 0.88

                        norm_date = cls._normalize_date(date_str)

                        facts.append(
                            ExtractedFactData(
                                fact_type=fact_type,
                                key=key,
                                value=date_str,
                                normalized_value=norm_date,
                                confidence=confidence,
                                context=line_clean[:250],
                                page_number=page.page_number,
                            )
                        )

                # 2. Financial Amounts
                amount_matches = re.finditer(cls.AMOUNT_PATTERN, line_clean)
                for am_match in amount_matches:
                    amount_str = am_match.group(0).strip()
                    key = "fee_amount" if any(w in line_lower for w in ["fee", "tuition", "cost", "charge", "surcharge"]) else "monetary_amount"
                    facts.append(
                        ExtractedFactData(
                            fact_type="amount",
                            key=key,
                            value=amount_str,
                            confidence=0.92,
                            context=line_clean[:250],
                            page_number=page.page_number,
                        )
                    )

                # 3. Requirements
                if any(trig in line_lower for trig in cls.REQUIREMENT_TRIGGERS):
                    facts.append(
                        ExtractedFactData(
                            fact_type="requirement",
                            key="document_requirement",
                            value=line_clean[:120],
                            confidence=0.90,
                            context=line_clean[:250],
                            page_number=page.page_number,
                        )
                    )

                # 4. Tasks & Obligations
                for trig in cls.OBLIGATION_TRIGGERS:
                    if trig in line_lower:
                        facts.append(
                            ExtractedFactData(
                                fact_type="task",
                                key="prescribed_obligation",
                                value=line_clean[:140],
                                confidence=0.94,
                                context=line_clean[:250],
                                page_number=page.page_number,
                            )
                        )
                        break

        # Deduplicate facts by fact_type + value
        seen = set()
        deduped: List[ExtractedFactData] = []
        for f in facts:
            sig = (f.fact_type, f.value.lower().strip())
            if sig not in seen:
                seen.add(sig)
                deduped.append(f)

        return deduped

    @classmethod
    def _normalize_date(cls, date_str: str) -> Optional[str]:
        cleaned = re.sub(r"(\d+)(?:st|nd|rd|th)", r"\1", date_str)
        cleaned = cleaned.replace(",", "")

        formats = [
            "%B %d %Y", "%b %d %Y", "%d %B %Y", "%d %b %Y",
            "%Y-%m-%d", "%Y/%m/%d", "%B %d", "%b %d"
        ]

        for fmt in formats:
            try:
                dt = datetime.strptime(cleaned.strip(), fmt)
                if "%Y" not in fmt:
                    dt = dt.replace(year=datetime.now().year)
                return dt.isoformat()
            except ValueError:
                pass
        return None
