import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Upload,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FolderOpen,
  Eye,
  Trash2,
  Download,
  FileCode,
  Tag,
  Calendar,
  X,
  ExternalLink,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import api from '@/lib/api';

interface DocItem {
  id: string;
  name: string;
  file_type: string;
  file_size: number;
  status: string;
  version: number;
  source_name: string;
  imported_at: string;
  extracted_fact_count: number;
  original_path: string;
}

interface FactItem {
  id: string;
  fact_type: string;
  key: string;
  value: string;
  normalized_value?: string;
  confidence: number;
  context?: string;
  page_number: number;
  is_verified: boolean;
}

export default function Documents() {
  const [documents, setDocuments] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDoc, setSelectedDoc] = useState<DocItem | null>(null);
  const [docFacts, setDocFacts] = useState<FactItem[]>([]);
  const [factsLoading, setFactsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocs = async () => {
    setLoading(true);
    const res = await api.getDocuments();
    if (res.success && res.data) {
      setDocuments(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleInspectDoc = async (doc: DocItem) => {
    setSelectedDoc(doc);
    setFactsLoading(true);
    const res = await api.getDocumentFacts(doc.id);
    if (res.success && res.data) {
      setDocFacts(res.data);
    } else {
      setDocFacts([]);
    }
    setFactsLoading(false);
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadSuccess(null);
    const res = await api.uploadDocument(file);
    if (res.success && res.data) {
      setUploadSuccess(res.data.message || `Successfully ingested "${file.name}"`);
      await fetchDocs();
      setTimeout(() => setUploadSuccess(null), 5000);
    } else {
      alert(`Upload error: ${res.error || 'Failed to upload'}`);
    }
    setIsUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDeleteDoc = async (doc: DocItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm(`Are you sure you want to remove "${doc.name}" and all extracted facts from LIFEINTEL?`)) {
      return;
    }
    const res = await api.deleteDocument(doc.id);
    if (res.success) {
      if (selectedDoc?.id === doc.id) {
        setSelectedDoc(null);
      }
      await fetchDocs();
    } else {
      alert(`Failed to delete document: ${res.error}`);
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.source_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      selectedType === 'all' || doc.file_type.toLowerCase() === selectedType.toLowerCase();
    return matchesSearch && matchesType;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <div className="animate-fade-in space-y-8">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ivory-400/40 pb-6">
        <div>
          <h1 className="font-heading text-h1 text-espresso-800">Documents</h1>
          <p className="text-body text-espresso-500 mt-1">
            Universal ingestion repository. Real PDF, DOCX, and TXT parsing with structured provenance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchDocs()}
            className="btn btn-ghost btn-sm text-espresso-600 border border-ivory-300"
            title="Refresh repository"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="btn btn-primary"
          >
            <Upload size={16} />
            {isUploading ? 'Ingesting Document...' : 'Import Document'}
          </button>
        </div>
      </div>

      {uploadSuccess && (
        <div className="p-4 bg-sage-50 border border-sage-200 rounded-subtle text-sage-800 text-body-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-sage-600" />
            <span>{uploadSuccess}</span>
          </div>
          <button onClick={() => setUploadSuccess(null)} className="text-sage-600 hover:text-sage-800">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Repository Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-ivory-300 rounded-card shadow-surface">
          <p className="text-overline text-warmgray-500 uppercase tracking-wider">Indexed Documents</p>
          <p className="font-heading text-h2 text-espresso-800 mt-1">{documents.length}</p>
          <p className="text-caption text-warmgray-500 mt-1">Across approved sources</p>
        </div>
        <div className="p-4 bg-white border border-ivory-300 rounded-card shadow-surface">
          <p className="text-overline text-warmgray-500 uppercase tracking-wider">Facts Extracted</p>
          <p className="font-heading text-h2 text-espresso-800 mt-1">
            {documents.reduce((acc, d) => acc + (d.extracted_fact_count || 0), 0)}
          </p>
          <p className="text-caption text-warmgray-500 mt-1">Dates, requirements & obligations</p>
        </div>
        <div className="p-4 bg-white border border-ivory-300 rounded-card shadow-surface">
          <p className="text-overline text-warmgray-500 uppercase tracking-wider">Version Tracking</p>
          <p className="font-heading text-h2 text-espresso-800 mt-1">
            {documents.filter((d) => d.version > 1).length} Updated
          </p>
          <p className="text-caption text-warmgray-500 mt-1">Change intelligence active</p>
        </div>
        <div className="p-4 bg-white border border-ivory-300 rounded-card shadow-surface">
          <p className="text-overline text-warmgray-500 uppercase tracking-wider">Privacy Boundary</p>
          <p className="font-heading text-h2 text-sage-700 mt-1">100% Local</p>
          <p className="text-caption text-sage-600 mt-1">Zero unapproved directory scans</p>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-ivory-400/80 hover:border-sage-500 bg-ivory-50 hover:bg-sage-50/20 rounded-card p-6 text-center cursor-pointer transition-colors duration-200"
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-full bg-ivory-200 flex items-center justify-center text-espresso-600">
            <Upload size={18} />
          </div>
          <p className="text-body font-medium text-espresso-800">
            Drag and drop documents here, or <span className="text-sage-600 underline">browse your local drive</span>
          </p>
          <p className="text-caption text-warmgray-500">
            PyMuPDF & python-docx engine parses PDF, DOCX, and TXT files with zero cloud dependencies.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-warmgray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents or source paths..."
            className="input pl-9 text-body-sm"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={15} className="text-warmgray-400" />
          {['all', 'pdf', 'docx', 'txt'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-subtle text-caption font-medium transition-colors ${
                selectedType === type
                  ? 'bg-espresso-800 text-white'
                  : 'bg-ivory-200 text-espresso-600 hover:bg-ivory-300'
              }`}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white border border-ivory-300 rounded-card shadow-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-ivory-300 bg-ivory-50/70 text-overline text-warmgray-500 uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Document Name</th>
                <th className="py-3 px-4 font-semibold">Source</th>
                <th className="py-3 px-4 font-semibold">Size</th>
                <th className="py-3 px-4 font-semibold">Extracted Facts</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-300/60 text-body-sm text-espresso-800">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-warmgray-400">
                    No documents match your query.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr
                    key={doc.id}
                    onClick={() => handleInspectDoc(doc)}
                    className="hover:bg-ivory-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-medium flex items-center gap-2.5">
                      <FileText size={16} className="text-sage-600 flex-shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="hover:underline">{doc.name}</span>
                          {doc.version > 1 && (
                            <span className="px-1.5 py-0.2 bg-terracotta-100 text-terracotta-700 text-[10px] font-semibold rounded">
                              v{doc.version}
                            </span>
                          )}
                        </div>
                        <p className="text-caption text-warmgray-400 font-mono text-[11px] truncate max-w-xs">
                          {doc.original_path}
                        </p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-espresso-600">{doc.source_name}</td>
                    <td className="py-3.5 px-4 text-warmgray-500">{formatFileSize(doc.file_size)}</td>
                    <td className="py-3.5 px-4">
                      <span className="badge badge-sage">{doc.extracted_fact_count} facts</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 text-caption font-medium text-sage-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-sage-500" />
                        Processed
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInspectDoc(doc);
                          }}
                          className="btn btn-ghost btn-sm text-espresso-600"
                          title="Inspect facts"
                        >
                          <Eye size={15} />
                          Inspect
                        </button>
                        <button
                          onClick={(e) => handleDeleteDoc(doc, e)}
                          className="p-1.5 hover:bg-terracotta-50 hover:text-terracotta-600 text-warmgray-400 rounded-subtle transition-colors"
                          title="Delete document"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Inspection Drawer */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-espresso-950/30 backdrop-blur-xs flex justify-end z-50 animate-fade-in">
          <div className="w-full max-w-lg bg-white h-full shadow-overlay p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-ivory-300 pb-4">
              <div className="flex items-center gap-2">
                <FileText size={20} className="text-sage-600" />
                <h2 className="font-heading text-h3 text-espresso-800 truncate max-w-sm">
                  {selectedDoc.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-1 hover:bg-ivory-200 rounded-subtle text-warmgray-500"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-overline text-warmgray-500 uppercase tracking-wider">Metadata</p>
                <div className="mt-2 bg-ivory-50 p-3 rounded-subtle space-y-2 text-body-sm">
                  <div className="flex justify-between">
                    <span className="text-warmgray-500">File Type:</span>
                    <span className="font-mono uppercase">{selectedDoc.file_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-warmgray-500">File Size:</span>
                    <span>{formatFileSize(selectedDoc.file_size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-warmgray-500">Source:</span>
                    <span>{selectedDoc.source_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-warmgray-500">Version:</span>
                    <span>v{selectedDoc.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-warmgray-500">Imported:</span>
                    <span>{new Date(selectedDoc.imported_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <p className="text-overline text-warmgray-500 uppercase tracking-wider">
                    Extracted Structured Facts ({docFacts.length})
                  </p>
                  {factsLoading && <span className="text-caption text-warmgray-400">Loading...</span>}
                </div>

                <div className="mt-2 space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {docFacts.length === 0 && !factsLoading ? (
                    <div className="p-4 bg-ivory-50 text-center text-caption text-warmgray-400 rounded-subtle">
                      No extracted facts recorded for this document.
                    </div>
                  ) : (
                    docFacts.map((fact) => (
                      <div
                        key={fact.id}
                        className="p-3 bg-white border border-ivory-300 rounded-subtle space-y-1 shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-caption font-semibold text-espresso-800 uppercase font-mono text-[11px]">
                            {fact.key.replace(/_/g, ' ')}
                          </span>
                          <span
                            className={`badge ${
                              fact.fact_type === 'deadline'
                                ? 'badge-terracotta'
                                : fact.fact_type === 'amount'
                                ? 'bg-amber-100 text-amber-800'
                                : 'badge-sage'
                            }`}
                          >
                            {fact.fact_type.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-body-sm text-espresso-900 font-medium">{fact.value}</p>
                        {fact.context && (
                          <p className="text-caption text-warmgray-500 italic mt-0.5 border-l-2 border-ivory-300 pl-2">
                            "{fact.context}"
                          </p>
                        )}
                        <div className="flex items-center justify-between text-[11px] text-warmgray-400 pt-1 border-t border-ivory-200">
                          <span>Confidence: {Math.round(fact.confidence * 100)}%</span>
                          <span>Page {fact.page_number}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <p className="text-overline text-warmgray-500 uppercase tracking-wider">Local Storage Location</p>
                <p className="mt-1 font-mono text-caption bg-ivory-100 p-2.5 rounded-subtle text-espresso-700 break-all select-all">
                  {selectedDoc.original_path}
                </p>
              </div>

              <div className="pt-4 border-t border-ivory-300 flex items-center justify-between">
                <button
                  onClick={() => handleDeleteDoc(selectedDoc)}
                  className="btn btn-ghost btn-sm text-terracotta-600 hover:bg-terracotta-50 flex items-center gap-1.5"
                >
                  <Trash2 size={15} />
                  Delete
                </button>
                <div className="flex items-center gap-2">
                  <a
                    href={`/api/documents/${selectedDoc.id}/download`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm flex items-center gap-1.5"
                  >
                    <Download size={14} />
                    Download
                  </a>
                  <button onClick={() => setSelectedDoc(null)} className="btn btn-primary btn-sm">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
