import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  FileText,
  Link as LinkIcon,
  Clock,
  CheckCircle2,
  Filter,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import api from '@/lib/api';

interface InsightItem {
  id: string;
  type: string;
  title: string;
  summary: string;
  consequence?: string;
  urgency: string;
  confidence: number;
  source_name: string;
  timestamp: string;
}

export default function IntelligenceFeed() {
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    async function load() {
      const res = await api.getInsights();
      if (res.success && res.data && res.data.length > 0) {
        setInsights(res.data);
      } else {
        setInsights([
          {
            id: 'ins-1',
            type: 'deadline_change',
            title: 'Internship Application Deadline Moved Earlier',
            summary: 'Application deadline moved forward from November 15 to November 10 (5 days earlier).',
            consequence: 'Resume milestone on Nov 12 is now past the deadline. Complete resume before Nov 8.',
            urgency: 'critical',
            confidence: 0.98,
            source_name: 'College_Notice_Updated.pdf',
            timestamp: '2 hours ago',
          },
          {
            id: 'ins-2',
            type: 'relationship_discovered',
            title: 'Resume Draft Connected to Notice Requirements',
            summary: 'Nithin_Resume_Draft_v3.docx matches submission specifications in College_Notice_Updated.pdf.',
            consequence: 'You must supply a public GitHub project link per section 3.2.',
            urgency: 'high',
            confidence: 0.94,
            source_name: 'Nithin_Resume_Draft_v3.docx',
            timestamp: '2 hours ago',
          },
          {
            id: 'ins-3',
            type: 'new_obligation',
            title: 'Capstone Milestone 1 Architecture Submission',
            summary: 'Formal architecture document and prototype evaluation due on November 20.',
            consequence: 'Review committee rubric requires explicit security threat modeling.',
            urgency: 'high',
            confidence: 0.96,
            source_name: 'Capstone_Project_Guidelines_2026.pdf',
            timestamp: '4 days ago',
          },
          {
            id: 'ins-4',
            type: 'reminder',
            title: 'AWS Cloud Practitioner Certification Expiration Window',
            summary: 'Credential renewal assessment opens this month. Complete before Dec 1.',
            consequence: 'Prevents credential lapse and exam re-take fee.',
            urgency: 'medium',
            confidence: 0.9,
            source_name: 'College_Notice_Original.pdf',
            timestamp: '7 days ago',
          },
        ]);
      }
    }
    load();
  }, []);

  const filtered = insights.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'deadline_change':
        return <AlertTriangle size={18} className="text-terracotta-600" />;
      case 'relationship_discovered':
        return <LinkIcon size={18} className="text-sage-600" />;
      case 'new_obligation':
        return <Clock size={18} className="text-amber-600" />;
      default:
        return <FileText size={18} className="text-warmgray-500" />;
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="border-b border-ivory-400/40 pb-6">
        <div className="flex items-center gap-3">
          <Activity size={26} className="text-sage-600" />
          <h1 className="font-heading text-h1 text-espresso-800">Intelligence Feed</h1>
        </div>
        <p className="text-body text-espresso-500 mt-1 max-w-3xl">
          Continuous stream of synthesized discoveries, deadline shifts, and relationship detections generated autonomously by your local intelligence engine.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-ivory-300 pb-2">
        <span className="text-caption text-warmgray-500 uppercase tracking-wider font-semibold mr-2">
          Filter Feed:
        </span>
        {[
          { key: 'all', label: `All Events (${insights.length})` },
          { key: 'deadline_change', label: 'Deadline Shifts' },
          { key: 'relationship_discovered', label: 'Connections' },
          { key: 'new_obligation', label: 'Obligations' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterType(tab.key)}
            className={`px-3 py-1.5 rounded-subtle text-caption font-medium transition-colors ${
              filterType === tab.key
                ? 'bg-espresso-800 text-white'
                : 'text-espresso-600 hover:bg-ivory-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Feed List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`bg-white border rounded-card p-5 shadow-surface transition-all ${
              item.urgency === 'critical'
                ? 'border-terracotta-300'
                : 'border-ivory-300'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-subtle bg-ivory-100 flex-shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`badge ${
                        item.urgency === 'critical'
                          ? 'badge-terracotta'
                          : item.urgency === 'high'
                          ? 'bg-amber-100 text-amber-800'
                          : 'badge-warmgray'
                      }`}
                    >
                      {item.urgency.toUpperCase()}
                    </span>
                    <h3 className="font-heading text-h3 text-espresso-800">{item.title}</h3>
                  </div>
                  <p className="text-body-sm text-espresso-700 leading-relaxed">{item.summary}</p>

                  {item.consequence && (
                    <div className="mt-2 p-3 bg-ivory-50 border border-ivory-300/80 rounded-subtle text-body-sm text-espresso-800">
                      <span className="font-semibold text-espresso-900 block text-caption uppercase tracking-wider mb-0.5">
                        Consequence Analysis
                      </span>
                      {item.consequence}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="text-caption text-warmgray-400 font-mono">{item.timestamp}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-ivory-200 flex items-center justify-between text-caption text-warmgray-500">
              <div className="flex items-center gap-1.5">
                <FileText size={13} className="text-sage-600" />
                <span>Derived from:</span>
                <span className="font-mono text-espresso-700 font-medium">{item.source_name}</span>
              </div>
              <span className="badge badge-sage">
                Confidence: {Math.round(item.confidence * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
