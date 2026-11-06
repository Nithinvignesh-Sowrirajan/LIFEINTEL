"""
LIFEINTEL — Proactive Folder Monitoring Service (Watchdog)
Continuously monitors explicitly authorized folders for new and modified documents.
Debounces rapid filesystem events and dispatches documents to the extraction pipeline.
"""

import os
import time
import threading
from pathlib import Path
from typing import Dict, List, Optional, Callable, Any

from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler, FileCreatedEvent, FileModifiedEvent

class DocumentEventHandler(FileSystemEventHandler):
    """Handles file system events for approved folders."""

    ALLOWED_EXTENSIONS = {".pdf", ".docx", ".doc", ".txt", ".png", ".jpg", ".jpeg"}

    def __init__(self, callback: Callable[[str], None], debounce_seconds: float = 2.0):
        super().__init__()
        self.callback = callback
        self.debounce_seconds = debounce_seconds
        self._last_processed: Dict[str, float] = {}
        self._lock = threading.Lock()

    def _should_process(self, file_path: str) -> bool:
        ext = os.path.splitext(file_path)[1].lower()
        if ext not in self.ALLOWED_EXTENSIONS:
            return False

        # Ignore temporary or hidden files (e.g. ~$Doc.docx or .tmp)
        file_name = os.path.basename(file_path)
        if file_name.startswith("~$") or file_name.startswith("."):
            return False

        now = time.time()
        with self._lock:
            last_time = self._last_processed.get(file_path, 0)
            if now - last_time < self.debounce_seconds:
                return False
            self._last_processed[file_path] = now
            return True

    def on_created(self, event):
        if not event.is_directory and self._should_process(event.src_path):
            self.callback(event.src_path)

    def on_modified(self, event):
        if not event.is_directory and self._should_process(event.src_path):
            self.callback(event.src_path)

class ProactiveFolderMonitor:
    """Manages active file observers for all authorized folders."""

    def __init__(self):
        self.observer: Optional[Observer] = None
        self.monitored_paths: Dict[str, Any] = {}
        self.is_running = False
        self._lock = threading.Lock()

    def start(self, folder_paths: List[str], on_file_detected: Callable[[str], None]):
        with self._lock:
            if self.is_running:
                return

            self.observer = Observer()
            handler = DocumentEventHandler(on_file_detected)

            valid_count = 0
            for folder in folder_paths:
                p = Path(folder)
                if p.exists() and p.is_dir():
                    self.observer.schedule(handler, str(p), recursive=False)
                    self.monitored_paths[str(p)] = True
                    valid_count += 1

            if valid_count > 0:
                self.observer.start()
                self.is_running = True

    def stop(self):
        with self._lock:
            if self.is_running and self.observer:
                self.observer.stop()
                self.observer.join(timeout=2.0)
                self.observer = None
                self.is_running = False
                self.monitored_paths.clear()

    def get_status(self) -> Dict[str, Any]:
        with self._lock:
            return {
                "is_running": self.is_running,
                "monitored_folders_count": len(self.monitored_paths),
                "monitored_paths": list(self.monitored_paths.keys()),
            }

folder_monitor = ProactiveFolderMonitor()

