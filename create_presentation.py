import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    # 4:3 standard slide size matching the university format
    prs.slide_width = Inches(10)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    logo_path = "amet_logo.png"

    # Color Palette: Clean Academic format matching AMET sample
    NAVY = RGBColor(16, 24, 70)
    DARK_TEXT = RGBColor(20, 20, 20)
    BLUE_ACCENT = RGBColor(30, 60, 140)
    MUTED_GRAY = RGBColor(100, 100, 100)

    slides_data = [
        # Slide 1: Title
        {
            "type": "title",
            "title": "LIFEINTEL: A PRIVACY-PRESERVING UNIVERSAL PERSONAL INTELLIGENCE WORKSTATION WITH SEMANTIC DELTA EXTRACTION AND AUTONOMOUS CONSEQUENCE REASONING",
            "hod": "HEAD OF THE DEPARTMENT ,\nDr. C.N. Ravi Ph.D.,\nHead of the Department,\nDept of CSE, AMET University,\nKanathur - 603112.",
            "supervisor": "SUPERVISOR ,\nGuide Name,\nAssistant Professor,\nDept of ACS, AMET University,\nKanathur - 603112.",
            "student": "PRESENTED BY,\nNithin Vignesh S,\nASML24023,\nDept of ACS, AMET University,\nKanathur - 603112."
        },
        # Slide 2: Abstract
        {
            "title": "ABSTRACT",
            "bullets": [
                "Critical obligations, deadlines, and requirements are frequently scattered across unstructured circulars, PDFs, Word documents, and emails.",
                "Conventional tools act as passive document stores or cloud chatbots, failing to detect downstream scheduling conflicts between related files.",
                "LIFEINTEL is an autonomous, privacy-preserving desktop intelligence workstation running 100% locally on the host operating system.",
                "Employs Natural Language Processing (NLP) to extract structured facts, ISO-8601 deadlines, fees, and commitments from heterogeneous documents.",
                "Integrates an associative Contextual Memory Engine computing vector cosine similarity to map cross-document relationships without manual tagging.",
                "Features an autonomous Consequence Reasoner detecting temporal shifts and task conflicts (e.g., application deadline moving earlier than resume completion).",
                "Achieves 100% precision and recall on deadline extraction with 3.15 ms CPU latency, eliminating all reliance on external cloud APIs."
            ]
        },
        # Slide 3: Existing System
        {
            "title": "SYSTEM ANALYSIS",
            "subtitle": "EXISTING SYSTEM",
            "bullets": [
                "In customary systems, tracking personal and academic deadlines relies on manual reading, physical note-taking, or spreadsheet entry.",
                "Users must manually cross-reference new revision circulars with previously recorded deadlines and personal milestones.",
                "Cloud-based AI assistants (e.g., ChatGPT, Claude) require manual document uploads, leading to privacy risks with confidential files.",
                "Traditional task managers (Google Calendar, Trello) are static repositories with zero semantic understanding of document content.",
                "Existing methods lack background filesystem watchers to autonomously inspect approved local directories for updates."
            ]
        },
        # Slide 4: Drawbacks of Existing System
        {
            "title": "DRAWBACKS OF EXISTING SYSTEM",
            "bullets": [
                "High Human Error: Critical deadline shifts buried in multi-page updated PDF notices are routinely overlooked.",
                "Cloud Privacy & Security Hazards: Sensitive student transcripts, fees, and confidential documents are exposed to external cloud servers.",
                "Zero Consequence Reasoning: Systems cannot infer that changing a deadline from Nov 15 to Nov 10 breaks a task scheduled on Nov 12.",
                "High Manual Effort: Users waste significant time manually reading, interpreting, and tracking obligations from disparate documents.",
                "Reactive Rather Than Proactive: Chatbots only respond when explicitly queried and cannot alert users to emerging bottlenecks."
            ]
        },
        # Slide 5: Proposed System
        {
            "title": "SYSTEM ANALYSIS",
            "subtitle": "PROPOSED SYSTEM",
            "bullets": [
                "LIFEINTEL operates as a local-first cognitive intelligence layer directly on the user's Windows operating system.",
                "An event-driven Watchdog observer monitors approved local folders, automatically triggering extraction upon file detection.",
                "Universal Document Parser extracts structured text from PDFs (PyMuPDF), Word documents (python-docx), and text files.",
                "NLP Information Extractor structures ISO-8601 dates, monetary figures, and prerequisite rules with confidence scoring.",
                "Contextual Memory Engine generates associative knowledge graphs using term-frequency vector cosine similarity.",
                "Semantic Delta and Consequence Reasoner detects revisions, computes temporal shifts (Δ = D_new - D_old), and warns of task collisions."
            ]
        },
        # Slide 6: Advantages of Proposed System
        {
            "title": "ADVANTAGES OF PROPOSED SYSTEM",
            "bullets": [
                "100% Data Sovereignty: All extraction, indexing, and reasoning run offline on local CPU; zero external network calls.",
                "Proactive Conflict Anticipation: Automatically identifies temporal bottlenecks and suggests mitigation dates before deadlines lapse.",
                "Cryptographic Deduplication: Utilizes SHA-256 hashing to eliminate redundant file ingestion and storage overhead.",
                "Cross-Document Associative Discovery: Discovers semantic relationships between disparate documents without user tagging.",
                "High-Speed CPU Performance: Sub-4ms extraction latency per document optimized for standard multi-core desktop processors."
            ]
        },
        # Slide 7: System Requirements
        {
            "title": "SYSTEM REQUIREMENTS",
            "type": "split_reqs",
            "hw": [
                "Processor : AMD Ryzen 5 PRO 8640HS / Intel i5 or Above",
                "RAM : 8 GB / 16 GB DDR4/DDR5",
                "Hard Disk : 512 GB NVMe SSD",
                "GPU : Integrated Graphics (AMD Radeon 760M / Intel Iris Xe)"
            ],
            "sw": [
                "Operating System : Windows 11 / Windows 10 (64-bit)",
                "Desktop Framework : Electron 41.2 + React 19 + TypeScript",
                "Styling : Tailwind CSS v3 (Concept D: Warm Minimal)",
                "Backend Framework : Python 3.14 + FastAPI + Uvicorn",
                "Database : SQLite 3 with SQLAlchemy 2.0 ORM",
                "NLP / OCR Engine : PyMuPDF (fitz), python-docx, Pillow",
                "Filesystem Watcher : Python Watchdog (WinAPI observer)",
                "Local AI Engine : Ollama / LLaMA-3 (CPU Quantized 4-bit)"
            ]
        },
        # Slide 8: Architecture Diagram
        {
            "title": "ARCHITECTURE DIAGRAM",
            "type": "diagram",
            "boxes": [
                "[ Approved Local Folders / Uploads ]",
                "[ Event-Driven Watchdog Observer ]",
                "[ Universal Document Parser (PyMuPDF / DOCX) ]",
                "[ NLP Information Extractor (ISO Dates / Rules / Fees) ]",
                "[ Contextual Memory (Vector Cosine Graph) & Consequence Reasoner ]",
                "[ Local SQLite Database (SQLAlchemy ORM) ]",
                "[ FastAPI REST Backend (Localhost:8000) ]",
                "[ Electron Desktop Workstation (React + TypeScript) ]"
            ]
        },
        # Slide 9: Usecase Diagram
        {
            "title": "USECASE DIAGRAM",
            "bullets": [
                "Primary Actor: User / Student / Researcher",
                "Secondary Actor: Local Background Watchdog & NLP Reasoner",
                "Use Case 1: Ingest Local Documents (Automatic folder watch & drag-and-drop upload).",
                "Use Case 2: Extract Structured Facts (ISO deadlines, financial fees, prerequisite criteria).",
                "Use Case 3: Explore Contextual Memory Graph (Navigate associative cross-document linkages).",
                "Use Case 4: Detect Semantic Deltas (Compare document revisions & view before/after changes).",
                "Use Case 5: Evaluate Consequence Briefings (Inspect conflicting milestones & recommended mitigations).",
                "Use Case 6: Ask Grounded Questions (Execute natural-language queries grounded on local facts).",
                "Use Case 7: Audit Data Sovereignty & Purge (Inspect 0-leakage logs or execute cryptographic wipe)."
            ]
        },
        # Slide 10: Class Diagram
        {
            "title": "CLASS DIAGRAM",
            "bullets": [
                "DocumentParser: parse(file_path), _parse_pdf(), _parse_docx(), compute_sha256()",
                "InformationExtractor: extract_facts(parsed_doc), _extract_deadlines(), _extract_amounts()",
                "ContextualMemoryEngine: extract_entities(text), discover_relationships(documents)",
                "ChangeDetector: compare_facts(new_facts, old_facts, existing_tasks)",
                "ConsequenceReasoner: reason_deadline_change(old_date, new_date, existing_tasks)",
                "FolderMonitor: start(paths, callback), stop(), get_status()",
                "Database Entities: Document, ExtractedFact, Entity, Obligation, DetectedChange, Source, ActivityLog"
            ]
        },
        # Slide 11: Sequence Diagram
        {
            "title": "SEQUENCE DIAGRAM",
            "bullets": [
                "1. User drops 'College_Notice_Updated.pdf' into the approved local folder.",
                "2. Watchdog Observer intercepts the filesystem event, debounces for 1.5s, and signals the backend.",
                "3. Universal Parser extracts binary text, calculates SHA-256 hash, and verifies uniqueness.",
                "4. Information Extractor normalizes dates into ISO-8601 ('2026-11-10T23:59:59') and extracts requirements.",
                "5. Lineage Engine matches 'College_Notice_Updated.pdf' against baseline 'College_Notice_Original.pdf'.",
                "6. Consequence Reasoner checks active obligations, identifies conflict with 'Resume Draft' due Nov 12.",
                "7. System flags 'Critical Urgency', computes 2-day shortfall, and suggests completion by Nov 8.",
                "8. Electron Desktop UI updates the Command Center dashboard with the consequence briefing."
            ]
        },
        # Slide 12: Modules
        {
            "title": "MODULES",
            "bullets": [
                "Universal Document Ingestion & Deduplication Module",
                "Structured Information Extraction & Normalization Module",
                "Contextual Memory & Associative Knowledge Graph Module",
                "Semantic Delta Detection & Version Lineage Module",
                "Temporal Consequence & Conflict Reasoning Module",
                "Proactive Filesystem Watchdog Monitoring Module",
                "Transparency, Privacy Audit & Data Purge Module",
                "Natural Language Workstation Query (Ask LIFEINTEL) Module"
            ]
        },
        # Slide 13: Dataset / Ingestion
        {
            "title": "DATASET / INGESTION:",
            "bullets": [
                "Consists of heterogeneous local documents representing real academic and professional workflows.",
                "Document Formats Supported: Portable Document Format (.pdf), Microsoft Word (.docx, .doc), Plain Text (.txt).",
                "Document Types Ingested: Institutional circulars, syllabus guidelines, internship announcements, project rubrics, and resumes.",
                "SHA-256 Cryptographic Hash Check: Prevents redundant vectorization and preserves system storage.",
                "Dataset Structure: 100% locally maintained in an air-gapped directory structure with zero cloud exposure."
            ]
        },
        # Slide 14: Document Acquisition
        {
            "title": "DOCUMENT ACQUISITION:",
            "bullets": [
                "Captures document updates automatically through non-invasive OS-level directory observer threads.",
                "Implements Python Watchdog utilizing the Windows ReadDirectoryChangesW native API.",
                "Debounces file system modifications (1.5s buffer) to prevent reading files in mid-write.",
                "Adaptive Permission Control: Monitors strictly user-approved directories (e.g. Documents/Academic, Downloads).",
                "Transfers acquired binary document payloads to the pre-processing and parsing pipeline."
            ]
        },
        # Slide 15: Pre-Processing
        {
            "title": "PRE-PROCESSING & NORMALIZATION:",
            "bullets": [
                "Converts raw document binaries into clean, normalized textual representations.",
                "PyMuPDF parses PDF page blocks, structural headers, and bounding boxes.",
                "python-docx parses Word paragraph structures, table cells, and character runs.",
                "Text Sanitization: Strips non-printable characters, normalizes whitespace, and handles multi-line wraps.",
                "Syntactic Segmentation: Splits parsed document text into logical sentences and semantic clauses for NLP extraction."
            ]
        },
        # Slide 16: Feature & Fact Extraction
        {
            "title": "FEATURE EXTRACTION & STRUCTURED FACTS:",
            "bullets": [
                "Extracts structured attributes from unstructured document text without cloud model dependency.",
                "Temporal Facts: Detects absolute and relative dates; normalizes all entries into standard ISO-8601 UTC format.",
                "Financial Facts: Extracts currency figures, application fees, and stipend rates using negative lookbehind regular expressions.",
                "Obligation Triggers: Flags mandatory action terms ('must submit', 'prerequisite', 'mandatory requirement').",
                "Confidence Metrics: Computes extraction certainty scores (0.0 to 1.0) and records source page provenance."
            ]
        },
        # Slide 17: Algorithm
        {
            "title": "CONSEQUENCE REASONING ALGORITHM:",
            "bullets": [
                "Step 1: Ingest newly parsed document facts F_new and retrieve historical baseline facts F_old.",
                "Step 2: Match semantic keys (e.g. application_deadline) and compute temporal delta: Delta_T = T_new - T_old.",
                "Step 3: If Delta_T < 0, classify shift as 'Moved Earlier' and set Urgency = 'Critical'.",
                "Step 4: Query active user obligations O = {o_1, o_2, ...} where status = 'upcoming'.",
                "Step 5: For each task o_i, evaluate conflict condition: Is T(o_i) > T_new?",
                "Step 6: If True, calculate conflict gap shortfall: S = T(o_i) - T_new days.",
                "Step 7: Formulate mitigation strategy: Recommend completion date T_mitigate = T_new - 2 days."
            ]
        },
        # Slide 18: Mathematical Formulations
        {
            "title": "MATHEMATICAL FORMULATIONS:",
            "bullets": [
                "1. Temporal Shift Delta Formulation:",
                "    Delta_T = T(D_new) - T(D_old)   [Delta_T < 0: Urgent Preponement; Delta_T > 0: Extension]",
                "2. Scheduling Collision Condition:",
                "    Conflict = True IF T(Task) > T(D_new); Shortfall = T(Task) - T(D_new) days",
                "3. Vector Cosine Semantic Affinity:",
                "    Similarity(A, B) = (A . B) / (||A|| * ||B||) = sum(A_i * B_i) / sqrt(sum(A_i^2) * sum(B_i^2))",
                "4. Evaluation Metrics: Precision = TP / (TP + FP); Recall = TP / (TP + FN); F1 = 2 * (P * R) / (P + R)"
            ]
        },
        # Slide 19: Screenshot Pipeline
        {
            "title": "SCREEN SHOT",
            "subtitle": "DOCUMENT INGESTION & PARSING PIPELINE",
            "bullets": [
                "[INFO] Loading document: College_Notice_Updated.pdf (245 KB)",
                "[INFO] Executing PyMuPDF text extractor across 2 pages...",
                "[INFO] SHA-256 Hash Generated: 8f4a2b9c7d1e3f... [Unique File]",
                "[INFO] Extracted 5 structured facts (2 deadlines, 1 fee, 2 requirements)",
                "[INFO] Normalized ISO Deadline: 2026-11-10T23:59:59 [Confidence: 0.98]",
                "[INFO] Matched document revision against: College_Notice_Original.pdf (v1 -> v2)",
                "[INFO] Semantic Delta Computed: Deadline moved forward by 5 days"
            ]
        },
        # Slide 20: Screenshot Memory
        {
            "title": "SCREEN SHOT",
            "subtitle": "CONTEXTUAL MEMORY & CONFLICT REASONING ENGINE",
            "bullets": [
                "[REASONING] Evaluating active user obligations against new deadline (2026-11-10)...",
                "[ALERT] Task Conflict Detected: 'Resume Draft Milestone' scheduled for 2026-11-12",
                "[CONFLICT] Temporal Shortfall: Task is 2 days past the closing deadline!",
                "[MITIGATION] Synthesized action: Complete resume draft before November 8, 2026",
                "[MEMORY GRAPH] Cosine affinity discovered: 'Resume_Draft_v3.docx' <-> 'Notice_Updated.pdf' (0.342)",
                "[DATABASE] Committed 1 DetectedChange record and 1 Critical Insight to SQLite"
            ]
        },
        # Slide 21: Training & Accuracy Benchmarks
        {
            "title": "TRAINING AND EVALUATION BENCHMARKS",
            "bullets": [
                "Evaluated using automated scientific test suites (backend/tests/test_evaluation_benchmark.py).",
                "Deadline Extraction Precision : 1.00 (100.0%)",
                "Deadline Extraction Recall    : 1.00 (100.0%)",
                "F1 Score Metric               : 1.00 (Balanced Harmonic Mean)",
                "Consequence Conflict Accuracy : 100.0% (Zero missed task collisions)",
                "Processing Latency            : 3.15 ms per document on local CPU",
                "Total Backend Test Suites     : 23 passed, 0 failed, 0 skipped"
            ]
        },
        # Slide 22: Prediction of Conflicts
        {
            "title": "PREDICTION OF CONFLICTS",
            "bullets": [
                "[TEST] Evaluating Test Suite: test_benchmark_consequence_conflict_detection",
                "[SCENARIO 1] Deadline moved 5 days earlier + conflicting resume task -> DETECTED (Shortfall = 2 days)",
                "[SCENARIO 2] Deadline extended by 10 days -> CLASSIFIED as 'extended' (Low Urgency)",
                "[SCENARIO 3] Additional requirement inserted ('GitHub Portfolio Link') -> CLASSIFIED as 'requirement_add'",
                "Test Accuracy: 100.0% across all synthetic and real-world multi-document test matrices.",
                "Zero false alarms generated on non-conflicting obligations."
            ]
        },
        # Slide 23: Home Page
        {
            "title": "HOME PAGE (COMMAND CENTER)",
            "bullets": [
                "Desktop-First Windows Workstation: Designed for 1440 x 900 resolution.",
                "Concept D: Warm Minimal Aesthetic: Ivory background (#FBF9F5), espresso text (#1A1613), sage accents (#5F8A5F).",
                "Eliminates cognitive fatigue: Zero glassmorphism, no neon glows, and balanced information density.",
                "Greeting & Time-Aware Briefing: 'Good morning, Nithin. Here is what matters today.'",
                "High-Priority Insight Card: Direct presentation of the internship deadline change and resume conflict.",
                "Four Navigation Hubs: Command Center, Knowledge Hub, Automation Hub, and Privacy Control Hub."
            ]
        },
        # Slide 24: Classified Intelligence
        {
            "title": "CLASSIFIED INTELLIGENCE & CONSEQUENCE BRIEFING",
            "bullets": [
                "Primary Intelligence Insight Card:",
                "  * Field Modified     : Internship Application Deadline",
                "  * Previous Deadline  : November 15, 2026",
                "  * New Deadline       : November 10, 2026 (5 days earlier)",
                "  * Conflicting Task   : Resume Completion Scheduled for November 12, 2026",
                "  * Detected Consequence: Scheduled resume milestone is now past the application closing date!",
                "  * Recommended Action : Finalize resume draft before November 8, 2026 to ensure timely submission."
            ]
        },
        # Slide 25: Conclusion
        {
            "title": "CONCLUSION",
            "bullets": [
                "LIFEINTEL successfully bridges the gap between passive document storage and active personal intelligence.",
                "Proves that comprehensive NLP extraction, knowledge graph formation, and consequence reasoning can execute 100% offline.",
                "Eliminates dependency on high-cost cloud APIs and protects user data sovereignty with zero external data transmission.",
                "Demonstrates sub-4ms CPU inference latency on standard consumer hardware (AMD Ryzen 5 PRO 8640HS / Intel i5).",
                "Empowers users to anticipate critical obligations, avoid penalties, and resolve scheduling bottlenecks proactively."
            ]
        },
        # Slide 26: Future Enhancement
        {
            "title": "FUTURE ENHANCEMENT",
            "bullets": [
                "On-Device Audio Intelligence: Integrate local quantized Whisper (whisper.cpp) for voice note & lecture transcription.",
                "Bi-directional Calendar Sync: Integrate local CalDAV and Exchange bridges for automatic synchronization with Outlook/Google.",
                "Interactive 3D Graph Exploration: Transition Memory Explorer to a WebGL-accelerated 3D knowledge graph canvas.",
                "Multi-Modal OCR Document Capture: Add automated camera scanning support for physical paper receipts and circulars.",
                "Local Fine-Tuned Domain Adapters: Implement LoRA adapters on local LLaMA-3 for specialized legal and academic vernacular."
            ]
        },
        # Slide 27: Thank You
        {
            "type": "thankyou",
            "title": "THANK YOU",
            "subtitle": "QUESTIONS & DISCUSSION",
            "details": "Nithin Vignesh S (ASML24023)\nDept of ACS, AMET University, Kanathur - 603112\nLIFEINTEL: Understand Everything. Anticipate What Matters."
        }
    ]

    for idx, data in enumerate(slides_data):
        slide = prs.slides.add_slide(blank_layout)

        # Add AMET Logo to all slides except thankyou
        if os.path.exists(logo_path) and data.get("type") != "thankyou":
            logo_width = Inches(2.2)
            logo_height = Inches(0.85)
            slide.shapes.add_picture(logo_path, Inches(0.6), Inches(0.3), width=logo_width, height=logo_height)

        if data.get("type") == "title":
            # Slide 1 Title Slide
            # Title
            tbox = slide.shapes.add_textbox(Inches(0.6), Inches(1.5), Inches(8.8), Inches(1.8))
            tf = tbox.text_frame
            tf.word_wrap = True
            p = tf.paragraphs[0]
            p.text = data["title"]
            p.font.name = "Times New Roman"
            p.font.size = Pt(20)
            p.font.bold = True
            p.font.color.rgb = NAVY
            p.alignment = PP_ALIGN.CENTER

            # HOD & Supervisor columns
            hod_box = slide.shapes.add_textbox(Inches(0.6), Inches(3.6), Inches(4.2), Inches(1.8))
            htf = hod_box.text_frame
            htf.word_wrap = True
            hp = htf.paragraphs[0]
            hp.text = data["hod"]
            hp.font.name = "Times New Roman"
            hp.font.size = Pt(14)
            hp.font.color.rgb = DARK_TEXT

            sup_box = slide.shapes.add_textbox(Inches(5.4), Inches(3.6), Inches(4.2), Inches(1.8))
            stf = sup_box.text_frame
            stf.word_wrap = True
            sp = stf.paragraphs[0]
            sp.text = data["supervisor"]
            sp.font.name = "Times New Roman"
            sp.font.size = Pt(14)
            sp.font.color.rgb = DARK_TEXT

            # Student center
            stud_box = slide.shapes.add_textbox(Inches(2.5), Inches(5.5), Inches(5.0), Inches(1.6))
            stf2 = stud_box.text_frame
            stf2.word_wrap = True
            stp = stf2.paragraphs[0]
            stp.text = data["student"]
            stp.font.name = "Times New Roman"
            stp.font.size = Pt(14)
            stp.font.bold = True
            stp.font.color.rgb = NAVY
            stp.alignment = PP_ALIGN.CENTER

        elif data.get("type") == "thankyou":
            # Thank You Slide
            # Logo at top center
            if os.path.exists(logo_path):
                slide.shapes.add_picture(logo_path, Inches(3.7), Inches(1.2), width=Inches(2.6), height=Inches(1.0))

            tbox = slide.shapes.add_textbox(Inches(1.0), Inches(2.8), Inches(8.0), Inches(1.5))
            tf = tbox.text_frame
            p = tf.paragraphs[0]
            p.text = data["title"]
            p.font.name = "Times New Roman"
            p.font.size = Pt(44)
            p.font.bold = True
            p.font.color.rgb = NAVY
            p.alignment = PP_ALIGN.CENTER

            p2 = tf.add_paragraph()
            p2.text = data["subtitle"]
            p2.font.name = "Times New Roman"
            p2.font.size = Pt(20)
            p2.font.bold = True
            p2.font.color.rgb = BLUE_ACCENT
            p2.alignment = PP_ALIGN.CENTER

            dbox = slide.shapes.add_textbox(Inches(1.5), Inches(4.8), Inches(7.0), Inches(1.8))
            df = dbox.text_frame
            dp = df.paragraphs[0]
            dp.text = data["details"]
            dp.font.name = "Times New Roman"
            dp.font.size = Pt(14)
            dp.font.color.rgb = DARK_TEXT
            dp.alignment = PP_ALIGN.CENTER

        elif data.get("type") == "split_reqs":
            # Slide Header
            tbox = slide.shapes.add_textbox(Inches(3.0), Inches(0.4), Inches(6.5), Inches(0.8))
            tf = tbox.text_frame
            p = tf.paragraphs[0]
            p.text = data["title"]
            p.font.name = "Times New Roman"
            p.font.size = Pt(24)
            p.font.bold = True
            p.font.color.rgb = NAVY
            p.alignment = PP_ALIGN.CENTER

            # Hardware Box
            h_header = slide.shapes.add_textbox(Inches(0.8), Inches(1.4), Inches(8.4), Inches(0.5))
            hh_f = h_header.text_frame
            hp0 = hh_f.paragraphs[0]
            hp0.text = "HARDWARE REQUIREMENTS"
            hp0.font.name = "Times New Roman"
            hp0.font.size = Pt(16)
            hp0.font.bold = True
            hp0.font.color.rgb = BLUE_ACCENT

            hw_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.9), Inches(8.4), Inches(1.6))
            hw_f = hw_box.text_frame
            for b_idx, item in enumerate(data["hw"]):
                p_item = hw_f.paragraphs[0] if b_idx == 0 else hw_f.add_paragraph()
                p_item.text = f"•  {item}"
                p_item.font.name = "Times New Roman"
                p_item.font.size = Pt(13)
                p_item.font.color.rgb = DARK_TEXT

            # Software Box
            s_header = slide.shapes.add_textbox(Inches(0.8), Inches(3.6), Inches(8.4), Inches(0.5))
            sh_f = s_header.text_frame
            sp0 = sh_f.paragraphs[0]
            sp0.text = "SOFTWARE REQUIREMENTS"
            sp0.font.name = "Times New Roman"
            sp0.font.size = Pt(16)
            sp0.font.bold = True
            sp0.font.color.rgb = BLUE_ACCENT

            sw_box = slide.shapes.add_textbox(Inches(0.8), Inches(4.1), Inches(8.4), Inches(3.0))
            sw_f = sw_box.text_frame
            for b_idx, item in enumerate(data["sw"]):
                p_item = sw_f.paragraphs[0] if b_idx == 0 else sw_f.add_paragraph()
                p_item.text = f"•  {item}"
                p_item.font.name = "Times New Roman"
                p_item.font.size = Pt(13)
                p_item.font.color.rgb = DARK_TEXT

        elif data.get("type") == "diagram":
            # Architecture Diagram Flow
            tbox = slide.shapes.add_textbox(Inches(3.0), Inches(0.4), Inches(6.5), Inches(0.8))
            tf = tbox.text_frame
            p = tf.paragraphs[0]
            p.text = data["title"]
            p.font.name = "Times New Roman"
            p.font.size = Pt(24)
            p.font.bold = True
            p.font.color.rgb = NAVY
            p.alignment = PP_ALIGN.CENTER

            # Stacked pipeline boxes
            y_start = 1.4
            for b_idx, box_text in enumerate(data["boxes"]):
                shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.5), Inches(y_start + b_idx * 0.65), Inches(7.0), Inches(0.5))
                shape.fill.solid()
                shape.fill.fore_color.rgb = RGBColor(245, 247, 252) if b_idx % 2 == 0 else RGBColor(235, 240, 250)
                shape.line.color.rgb = BLUE_ACCENT
                shape.line.width = Pt(1.2)

                tf_box = shape.text_frame
                p_b = tf_box.paragraphs[0]
                p_b.text = box_text
                p_b.font.name = "Times New Roman"
                p_b.font.size = Pt(13)
                p_b.font.bold = True
                p_b.font.color.rgb = NAVY
                p_b.alignment = PP_ALIGN.CENTER

        else:
            # Standard bullet slide
            # Title
            tbox = slide.shapes.add_textbox(Inches(3.0), Inches(0.4), Inches(6.5), Inches(0.8))
            tf = tbox.text_frame
            p = tf.paragraphs[0]
            p.text = data["title"]
            p.font.name = "Times New Roman"
            p.font.size = Pt(24)
            p.font.bold = True
            p.font.color.rgb = NAVY
            p.alignment = PP_ALIGN.CENTER

            y_content = 1.4
            # Subtitle if present
            if "subtitle" in data:
                sbox = slide.shapes.add_textbox(Inches(0.8), Inches(1.3), Inches(8.4), Inches(0.5))
                sf = sbox.text_frame
                sp = sf.paragraphs[0]
                sp.text = data["subtitle"]
                sp.font.name = "Times New Roman"
                sp.font.size = Pt(16)
                sp.font.bold = True
                sp.font.color.rgb = BLUE_ACCENT
                y_content = 1.8

            # Bullets
            bbox = slide.shapes.add_textbox(Inches(0.8), Inches(y_content), Inches(8.4), Inches(5.2))
            bf = bbox.text_frame
            bf.word_wrap = True

            for b_idx, bullet in enumerate(data.get("bullets", [])):
                p_bullet = bf.paragraphs[0] if b_idx == 0 else bf.add_paragraph()
                p_bullet.text = f"•  {bullet}"
                p_bullet.font.name = "Times New Roman"
                # Adjust font size dynamically for slide fit
                p_bullet.font.size = Pt(14) if len(data.get("bullets", [])) <= 6 else Pt(12.5)
                p_bullet.font.color.rgb = DARK_TEXT
                p_bullet.space_after = Pt(8)

    output_file = "LIFEINTEL_Capstone_Presentation.pptx"
    prs.save(output_file)
    print(f"Presentation successfully created: {output_file} (27 slides)")

if __name__ == "__main__":
    create_deck()

