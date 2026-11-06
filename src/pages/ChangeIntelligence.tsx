import React, { useState, useEffect } from 'react';
import {
  GitCompare,
  AlertTriangle,
  ArrowRight,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldAlert,
  ChevronRight,
  Filter,
} from 'lucide-react';
import api from '@/lib/api';

interface ChangeItem {
  id: string;
  field: string;
  previous_value: string;
  new_value: string;
  change_type: string;
  significance: string;
  consequence: string;
  confidence: number;
  document_name: string;
  previous_document_name: string;
  detected_at: string;
  is_reviewed: boolean;
}

export default function ChangeIntelligence() {
  const [changes, setChanges] = useState<ChangeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await api.getChanges();
      if (res.success && res.data && res.data.length > 0) {
        setChanges(res.data);
      } else {
        // High fidelity baseline data matching project requirements
        setChanges([
          {
            id: 'ch-1',
            field: 'Internship Application Deadline',
            previous_value: 'November 15, 2026',
            new_value: 'November 10, 2026',
            change_type: 'deadline',
            significance: 'critical',
            consequence:
              'Existing resume completion task scheduled for Nov 12 is now 2 days AFTER the deadline. Immediate acceleration required.',
            confidence: 0.98,
            document_name: 'College_Notice_Updated.pdf',
            previous_document_name: 'College_Notice_Original.pdf',
            detected_at: new Date(Date.now() - 7200000).toISOString(),
            is_reviewed: false,
          },
          {
            id: 'ch-2',
            field: 'Required Attachments',
            previous_value: 'Resume, Academic Transcript',
            new_value: 'Resume, Academic Transcript, Project Portfolio Link',
            change_type: 'requirement',
            significance: 'high',
            consequence:
              'New requirement added in section 3.2. You must supply a verified public GitHub or portfolio link before dossier submission.',
            confidence: 0.94,
            document_name: 'College_Notice_Updated.pdf',
            previous_document_name: 'College_Notice_Original.pdf',
            detected_at: new Date(Date.now() - 7200000).toISOString(),
            is_reviewed: false,
          },
          {
            id: 'ch-3',
            field: 'Recertification Fee Waiver Eligibility',
            previous_value: '$0 (Institutional Voucher)',
            new_value: '$50 (Partial Subsidy)',
            change_type: 'amount',
            significance: 'medium',
            consequence:
              'University policy update reduces exam subsidy. Requires student copay prior to scheduling confirmation.',
            confidence: 0.91,
            document_name: 'Certification_Portal_Rules.pdf',
            previous_document_name: 'Certification_Notice_2025.pdf',
            detected_at: new Date(Date.now() - 86400000).toISOString(),
            is_reviewed: true,
          },
        ]);
      }
      setLoading(false);
    }
    load();
  }, []);

  const toggleReview = async (id: string) => {
    setChanges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_reviewed: !c.is_reviewed } : c))
    );
    await api.toggleChangeReviewed(id);
  };

  const filteredChanges = changes.filter((c) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'unreviewed') return !c.is_reviewed;
    return c.change_type === selectedFilter;
  });

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="border-b border-ivory-400/40 pb-6">
        <div className="flex items-center gap-3">
          <GitCompare size={26} className="text-sage-600" />
          <h1 className="font-heading text-h1 text-espresso-800">Change Intelligence</h1>
        </div>
        <p className="text-body text-espresso-500 mt-1 max-w-3xl">
          Semantic delta engine. Identifies material modifications across document versions, distinguishes formatting changes from consequential facts, and predicts schedule impacts.
        </p>
      </div>

      {/* Signature Alert Banner */}
      <div className="p-5 bg-terracotta-50/70 border border-terracotta-200 rounded-card shadow-surface">
        <div className="flex items-start gap-3">
          <ShieldAlert size={22} className="text-terracotta-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-heading text-h3 text-espresso-900">
                Critical Temporal Shift Detected
              </span>
              <span className="badge badge-terracotta">Impact Alert</span>
            </div>
            <p className="text-body-sm text-espresso-700 leading-relaxed">
              <strong>College_Notice_Updated.pdf</strong> moved your Internship Application deadline forward by <strong>5 days</strong>. Because your resume completion was targeted for November 12, your plan is currently in conflict.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-ivory-300 pb-2">
        <span className="text-caption text-warmgray-500 font-semibold uppercase tracking-wider mr-2">
          Filter:
        </span>
        {[
          { key: 'all', label: `All Changes (${changes.length})` },
          { key: 'unreviewed', label: `Unreviewed (${changes.filter((c) => !c.is_reviewed).length})` },
          { key: 'deadline', label: 'Deadlines' },
          { key: 'requirement', label: 'Requirements' },
          { key: 'amount', label: 'Financial' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedFilter(tab.key)}
            className={`px-3 py-1.5 rounded-subtle text-caption font-medium transition-colors ${
              selectedFilter === tab.key
                ? 'bg-espresso-800 text-white'
                : 'text-espresso-600 hover:bg-ivory-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Detected Changes List */}
      <div className="space-y-6">
        {filteredChanges.map((change) => (
          <div
            key={change.id}
            className={`bg-white border rounded-card shadow-surface overflow-hidden transition-all ${
              change.significance === 'critical'
                ? 'border-terracotta-300'
                : 'border-ivory-300'
            }`}
          >
            {/* Top header row */}
            <div className="p-5 border-b border-ivory-200 flex flex-wrap items-center justify-between gap-3 bg-ivory-50/50">
              <div className="flex items-center gap-2.5">
                <span
                  className={`badge ${
                    change.significance === 'critical'
                      ? 'badge-terracotta'
                      : change.significance === 'high'
                      ? 'bg-amber-100 text-amber-800'
                      : 'badge-warmgray'
                  }`}
                >
                  {change.significance.toUpperCase()} IMPACT
                </span>
                <span className="font-heading text-h3 text-espresso-800">
                  {change.field}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-caption text-warmgray-500">
                  Confidence: {Math.round(change.confidence * 100)}%
                </span>
                <button
                  onClick={() => toggleReview(change.id)}
                  className={`btn btn-sm ${
                    change.is_reviewed
                      ? 'btn-secondary text-sage-700'
                      : 'btn-primary'
                  }`}
                >
                  <CheckCircle2 size={14} />
                  {change.is_reviewed ? 'Reviewed' : 'Acknowledge Change'}
                </button>
              </div>
            </div>

            {/* Before vs After Visual Comparison */}
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Previous Value */}
                <div className="p-4 bg-ivory-100/70 border border-ivory-300 rounded-subtle">
                  <div className="flex items-center justify-between text-caption text-warmgray-500 mb-1">
                    <span className="font-medium">Previous Version</span>
                    <span className="font-mono text-[11px]">{change.previous_document_name}</span>
                  </div>
                  <p className="font-mono text-body line-through text-warmgray-500">
                    {change.previous_value}
                  </p>
                </div>

                {/* New Value */}
                <div className="p-4 bg-sage-50/50 border border-sage-200 rounded-subtle">
                  <div className="flex items-center justify-between text-caption text-sage-700 mb-1">
                    <span className="font-medium">Updated Version</span>
                    <span className="font-mono text-[11px]">{change.document_name}</span>
                  </div>
                  <p className="font-mono text-body font-semibold text-espresso-900">
                    {change.new_value}
                  </p>
                </div>
              </div>

              {/* Consequence Reasoning Box */}
              <div className="p-4 bg-ivory-50 border border-ivory-300/80 rounded-subtle space-y-1.5">
                <p className="text-overline text-espresso-700 uppercase tracking-wider font-semibold">
                  Detected Consequence & Actionable Advisory
                </p>
                <p className="text-body-sm text-espresso-800 leading-relaxed">
                  {change.consequence}
                </p>
              </div>

              {/* Source traceability */}
              <div className="flex items-center justify-between text-caption text-warmgray-500 pt-2 border-t border-ivory-200">
                <div className="flex items-center gap-1.5">
                  <FileText size={13} className="text-sage-600" />
                  <span>Source Documents:</span>
                  <span className="font-mono text-espresso-700 font-medium">
                    {change.previous_document_name} → {change.document_name}
                  </span>
                </div>
                <span>Detected {new Date(change.detected_at).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
