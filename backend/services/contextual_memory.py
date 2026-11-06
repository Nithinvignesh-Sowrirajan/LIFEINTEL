"""
LIFEINTEL — Contextual Memory & Entity Relationship Engine
Constructs associative knowledge graphs, connects recurring entities,
discovers cross-document relationships, and provides semantic relevance retrieval.
"""

import math
import re
from typing import List, Dict, Any, Tuple, Optional
from collections import Counter
import numpy as np

class ContextualMemoryEngine:
    """CPU-friendly local semantic memory and entity relationship discovery engine."""

    # Stopwords list for semantic similarity computation
    STOPWORDS = set([
        "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
        "of", "with", "by", "from", "up", "about", "into", "over", "after",
        "is", "are", "was", "were", "be", "been", "being", "have", "has", "had",
        "it", "its", "they", "them", "their", "this", "that", "these", "those",
        "must", "should", "will", "can", "may", "all", "any", "before"
    ])

    @classmethod
    def tokenize(cls, text: str) -> List[str]:
        words = re.findall(r"\b[a-zA-Z0-9_-]{2,}\b", text.lower())
        return [w for w in words if w not in cls.STOPWORDS]

    @classmethod
    def compute_similarity(cls, text_a: str, text_b: str) -> float:
        """Compute cosine similarity between two text snippets using term frequency vectors."""
        tokens_a = cls.tokenize(text_a)
        tokens_b = cls.tokenize(text_b)

        if not tokens_a or not tokens_b:
            return 0.0

        counts_a = Counter(tokens_a)
        counts_b = Counter(tokens_b)

        all_words = list(set(counts_a.keys()).union(set(counts_b.keys())))
        vec_a = np.array([counts_a[w] for w in all_words], dtype=float)
        vec_b = np.array([counts_b[w] for w in all_words], dtype=float)

        norm_a = np.linalg.norm(vec_a)
        norm_b = np.linalg.norm(vec_b)

        if norm_a == 0 or norm_b == 0:
            return 0.0

        return float(np.dot(vec_a, vec_b) / (norm_a * norm_b))

    @classmethod
    def extract_entities(cls, text: str) -> List[Dict[str, Any]]:
        """Extract named entities and institutional topics from text."""
        entities = []

        # 1. University & Academic Entities
        uni_matches = re.findall(r"\b([A-Z][a-zA-Z0-9\s]+(?:University|College|Institute|Faculty|Department))\b", text)
        for m in uni_matches:
            entities.append({"name": m.strip(), "category": "organization"})

        # 2. Programs and Internships
        prog_matches = re.findall(r"\b([A-Z][a-zA-Z\s]+(?:Internship|Program|Fellowship|Course|Milestone))\b", text)
        for m in prog_matches:
            entities.append({"name": m.strip(), "category": "program"})

        # 3. Certifications
        cert_matches = re.findall(r"\b([A-Z][a-zA-Z0-9\s]+(?:Certificate|Certification|Practitioner|Cloud))\b", text)
        for m in cert_matches:
            entities.append({"name": m.strip(), "category": "certification"})

        # 4. Critical Artifacts & Requirements
        req_matches = re.findall(r"\b([A-Z][a-zA-Z0-9\s]+(?:Resume|Transcript|Portfolio|Signoff|Dossier))\b", text)
        for m in req_matches:
            entities.append({"name": m.strip(), "category": "requirement"})

        # Deduplicate
        seen = set()
        unique = []
        for e in entities:
            name_clean = e["name"].strip()
            if name_clean not in seen and len(name_clean) > 3:
                seen.add(name_clean)
                unique.append(e)

        return unique

    @classmethod
    def discover_relationships(cls, documents: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Discover bidirectional relationships between documents based on shared vocabulary and entities."""
        links = []
        n = len(documents)

        for i in range(n):
            for j in range(i + 1, n):
                doc_a = documents[i]
                doc_b = documents[j]

                sim = cls.compute_similarity(doc_a.get("text", ""), doc_b.get("text", ""))
                # If similarity exceeds meaningful threshold, record relationship
                if sim > 0.15:
                    links.append({
                        "source": doc_a["id"],
                        "target": doc_b["id"],
                        "source_name": doc_a.get("name", ""),
                        "target_name": doc_b.get("name", ""),
                        "strength": round(sim, 2),
                        "description": f"Shared contextual overlap ({round(sim * 100)}% lexical match)",
                    })

        return links

