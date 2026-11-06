import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  AlertTriangle,
  Link as LinkIcon,
  Clock,
  FolderOpen,
  Download,
  Mail,
  Calendar,
  ChevronRight,
  ArrowRight,
  Activity,
  Shield,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import api from '@/lib/api';

// ─── Helpers ────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

const urgencyDot: Record<string, string> = {
  critical: 'bg-terracotta-500',
  high: 'bg-terracotta-400',
  medium: 'bg-sage-500',
  low: 'bg-warmgray-400',
  info: 'bg-warmgray-300',
};

// ─── Component ──────────────────────────────────────

export default function CommandCenter() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    documentsTracked: 4,
    factsExtracted: 29,
    activeObligations: 4,
    detectedChanges: 2,
    activeSources: 2,
    systemStatus: 'ready',
    lastScan: 'Just now',
  });
  const [obligations, setObligations] = useState<any[]>([
    {
      id: '1',
      title: 'Internship Application',
      deadline: 'Nov 10',
      source: 'College_Notice_Updated.pdf',
      urgency: 'critical',
    },
    {
      id: '2',
      title: 'Dental Appointment',
      deadline: 'Nov 14',
      source: 'Email — HealthPlus Clinic',
      urgency: 'medium',
    },
    {
      id: '3',
      title: 'Project Submission',
      deadline: 'Nov 20',
      source: 'Course_Syllabus.pdf',
      urgency: 'medium',
    },
    {
      id: '4',
      title: 'Certificate Renewal',
      deadline: 'Dec 1',
      source: 'Certification_Portal.pdf',
      urgency: 'low',
    },
  ]);

  const [intelligenceItems, setIntelligenceItems] = useState<any[]>([
    {
      id: '1',
      icon: FileText,
      title: 'New document analyzed',
      description: 'College_Notice_Updated.pdf',
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      icon: AlertTriangle,
      title: 'Deadline change detected',
      description: 'Internship deadline moved to Nov 10',
      timestamp: '2 hours ago',
    },
    {
      id: '3',
      icon: LinkIcon,
      title: 'Related information discovered',
      description: 'Resume connects to internship application',
      timestamp: '1 day ago',
    },
    {
      id: '4',
      icon: Clock,
      title: 'New obligation identified',
      description: 'Certificate renewal by Dec 1',
      timestamp: '2 days ago',
    },
  ]);

  const [sourcesList, setSourcesList] = useState<any[]>([
    { id: '1', name: 'Documents folder', icon: FolderOpen, status: 'connected', detail: '12 files' },
    { id: '2', name: 'Downloads folder', icon: Download, status: 'connected', detail: '8 files' },
    { id: '3', name: 'Email', icon: Mail, status: 'disconnected', detail: null },
    { id: '4', name: 'Calendar', icon: Calendar, status: 'disconnected', detail: null },
  ]);

  useEffect(() => {
    async function loadData() {
      // 1. Fetch stats
      const statsRes = await api.getStats();
      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }

      // 2. Fetch obligations
      const obsRes = await api.getObligations();
      if (obsRes.success && obsRes.data && obsRes.data.length > 0) {
        setObligations(
          obsRes.data.slice(0, 4).map((o: any) => ({
            id: o.id,
            title: o.title,
            deadline: o.deadline ? new Date(o.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Pending',
            source: o.source_document_name,
            urgency: o.urgency,
          }))
        );
      }

      // 3. Fetch sources
      const srcRes = await api.getSources();
      if (srcRes.success && srcRes.data && srcRes.data.length > 0) {
        setSourcesList(
          srcRes.data.map((s: any) => ({
            id: s.id,
            name: s.name,
            icon: s.type === 'folder' ? FolderOpen : s.type === 'email' ? Mail : Calendar,
            status: s.status,
            detail: s.item_count ? `${s.item_count} files` : null,
          }))
        );
      }
    }
    loadData();
  }, []);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[72rem] mx-auto px-8 py-8 space-y-8 animate-fade-in">

        {/* ═══ ROW 1 — Welcome + Primary Intelligence | Upcoming Obligations ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.65fr] gap-8 items-start">

          {/* Left — Greeting + Primary Insight */}
          <div className="space-y-5">
            {/* Greeting */}
            <div>
              <h1 className="font-heading text-h1 text-espresso-800">
                {getGreeting()}, Nithin.
              </h1>
              <p className="text-secondary text-body-lg mt-1">
                Here&rsquo;s what matters today.
              </p>
            </div>

            {/* Primary Intelligence Insight */}
            <div className="bg-white rounded-card shadow-elevated p-6 space-y-4 border border-ivory-300/60">
              {/* Badge row */}
              <div className="flex items-center gap-3">
                <span className="badge-terracotta">Deadline Change Detected</span>
                <span className="text-caption text-warmgray-500">
                  High confidence
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-sage-500 ml-1.5 relative -top-px" />
                </span>
              </div>

              {/* Title */}
              <h2 className="font-heading text-h3 text-espresso-800">
                Your internship application deadline has changed.
              </h2>

              {/* Comparison block */}
              <div className="bg-ivory-100/70 rounded-subtle p-4 space-y-2.5">
                <div className="flex items-baseline justify-between text-body-sm">
                  <span className="text-warmgray-500">Previous deadline:</span>
                  <span className="line-through text-warmgray-400 font-medium">November 15</span>
                </div>
                <div className="flex items-baseline justify-between text-body-sm">
                  <span className="text-espresso-700 font-medium">New deadline:</span>
                  <span className="font-semibold text-terracotta-600">November 10</span>
                </div>
                <div className="flex items-baseline justify-between text-caption text-warmgray-500 pt-1 border-t border-ivory-300/60">
                  <span>Days moved:</span>
                  <span className="font-medium text-terracotta-600">5 days earlier</span>
                </div>
              </div>

              {/* Related task + Consequence */}
              <div className="space-y-1.5 text-body-sm text-espresso-700">
                <p>
                  <span className="text-warmgray-500">Related task:&nbsp;</span>
                  Resume completion is scheduled for&nbsp;
                  <span className="font-medium text-espresso-800">November 12</span>
                  &nbsp;— this is now 2 days after the new application deadline.
                </p>
                <p className="text-espresso-600">
                  <span className="font-medium text-terracotta-600">Consequence:&nbsp;</span>
                  Existing resume deadline is now too late. Complete your resume before November 8.
                </p>
              </div>

              {/* Action + Source */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <button
                  onClick={() => navigate('/changes')}
                  className="btn-primary btn-sm self-start"
                >
                  Review and adjust timeline
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-caption text-warmgray-500">
                  Detected from: <span className="text-warmgray-600 font-mono">College_Notice_Updated.pdf</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right — Upcoming Obligations */}
          <div className="pt-1">
            <h3 className="text-overline uppercase tracking-wide text-warmgray-500 mb-4">
              Upcoming Obligations
            </h3>

            <div className="space-y-0">
              {obligations.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => navigate('/timeline')}
                  className={`flex items-start gap-3 py-3.5 cursor-pointer hover:bg-ivory-200/50 px-2 rounded-subtle transition-colors ${
                    idx < obligations.length - 1 ? 'border-b border-ivory-300/80' : ''
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${urgencyDot[item.urgency] || 'bg-sage-500'}`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-body-sm font-medium text-espresso-800 truncate">
                        {item.title}
                      </span>
                      <span className="text-caption text-warmgray-500 shrink-0 font-mono">
                        {item.deadline}
                      </span>
                    </div>
                    <p className="text-caption text-warmgray-400 mt-0.5 truncate font-mono">
                      {item.source}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/timeline')}
              className="inline-flex items-center gap-1 text-caption text-sage-600 hover:text-sage-700 mt-3 transition-colors font-medium"
            >
              View all obligations
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* ═══ ROW 2 — Recent Intelligence | Source Status ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 items-start">

          {/* Left — Recent Intelligence */}
          <div>
            <h3 className="text-overline uppercase tracking-wide text-warmgray-500 mb-4">
              Recent Intelligence
            </h3>

            <div className="space-y-0">
              {intelligenceItems.map((entry, idx) => {
                const Icon = entry.icon;
                return (
                  <div
                    key={entry.id}
                    onClick={() => navigate('/intelligence-feed')}
                    className={`flex items-start gap-3.5 py-3.5 cursor-pointer hover:bg-ivory-200/50 px-2 rounded-subtle transition-colors ${
                      idx < intelligenceItems.length - 1
                        ? 'border-b border-ivory-300/80'
                        : ''
                    }`}
                  >
                    <div className="w-8 h-8 rounded-subtle bg-ivory-200 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-espresso-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-body-sm font-medium text-espresso-800 truncate">
                          {entry.title}
                        </span>
                        <span className="text-caption text-warmgray-400 shrink-0 font-mono">
                          {entry.timestamp}
                        </span>
                      </div>
                      <p className="text-caption text-warmgray-500 mt-0.5 truncate">
                        {entry.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => navigate('/intelligence-feed')}
              className="inline-flex items-center gap-1 text-caption text-sage-600 hover:text-sage-700 mt-3 transition-colors font-medium"
            >
              View intelligence feed
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Right — Source Status */}
          <div>
            <h3 className="text-overline uppercase tracking-wide text-warmgray-500 mb-4">
              Source Status
            </h3>

            <div className="space-y-0">
              {sourcesList.map((source, idx) => {
                const Icon = source.icon;
                const isConnected = source.status === 'connected';
                return (
                  <div
                    key={source.id}
                    className={`flex items-center justify-between py-3.5 ${
                      idx < sourcesList.length - 1
                        ? 'border-b border-ivory-300/80'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-subtle bg-ivory-200 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-espresso-500" />
                      </div>
                      <span className="text-body-sm font-medium text-espresso-800 truncate">
                        {source.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 ml-3">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isConnected ? 'bg-sage-500' : 'bg-warmgray-300'
                        }`}
                      />
                      {isConnected ? (
                        <span className="text-caption text-warmgray-500">
                          Connected {source.detail && `\u2014 ${source.detail}`}
                        </span>
                      ) : (
                        <button
                          onClick={() => navigate('/sources')}
                          className="text-caption text-sage-600 hover:text-sage-700 transition-colors font-medium"
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => navigate('/sources')}
              className="inline-flex items-center gap-1 text-caption text-sage-600 hover:text-sage-700 mt-3 transition-colors font-medium"
            >
              Manage sources
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* ═══ BOTTOM STRIP — System Intelligence Status ═══ */}
        <div className="pt-4 border-t border-ivory-300/60">
          <div className="flex flex-wrap items-center justify-between gap-4 text-caption text-warmgray-500">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-sage-600" />
              <span>Last scan: {stats.lastScan}</span>
              <span className="text-warmgray-300">&bull;</span>
              <span>{stats.documentsTracked} documents tracked</span>
              <span className="text-warmgray-300">&bull;</span>
              <span>{stats.activeObligations} obligations active</span>
              <span className="text-warmgray-300">&bull;</span>
              <span>{stats.detectedChanges} changes detected</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-sage-600" />
              <span className="text-sage-700 font-medium">System ready (100% Local-First)</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
