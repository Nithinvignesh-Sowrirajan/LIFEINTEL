import React, { useState, useEffect } from 'react';
import {
  FolderKey,
  Folder,
  Mail,
  Calendar,
  Shield,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Plus,
  Trash2,
  HardDrive,
  RefreshCw,
  X,
} from 'lucide-react';
import api from '@/lib/api';

interface SourceItem {
  id: string;
  name: string;
  type: string;
  path?: string;
  status: string;
  is_monitored: boolean;
  item_count: number;
  last_sync?: string;
}

export default function SourcesPermissions() {
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [processingMode, setProcessingMode] = useState<'hybrid' | 'automatic' | 'manual'>('hybrid');
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderPath, setNewFolderPath] = useState('');

  const loadSources = async () => {
    const res = await api.getSources();
    if (res.success && res.data && res.data.length > 0) {
      setSources(res.data);
    } else {
      setSources([
        {
          id: 'src-documents',
          name: 'Academic Documents Folder',
          type: 'folder',
          path: 'C:/Users/User/Documents/Academic',
          status: 'connected',
          is_monitored: true,
          item_count: 12,
          last_sync: '15 mins ago',
        },
        {
          id: 'src-downloads',
          name: 'Browser Downloads Folder',
          type: 'folder',
          path: 'C:/Users/User/Downloads',
          status: 'connected',
          is_monitored: true,
          item_count: 8,
          last_sync: '45 mins ago',
        },
        {
          id: 'src-email',
          name: 'University Email (Exchange / Outlook)',
          type: 'email',
          status: 'disconnected',
          is_monitored: false,
          item_count: 0,
        },
        {
          id: 'src-calendar',
          name: 'Google Calendar (Academic Timetable)',
          type: 'calendar',
          status: 'disconnected',
          is_monitored: false,
          item_count: 0,
        },
      ]);
    }
  };

  useEffect(() => {
    loadSources();
  }, []);

  const handleToggle = async (id: string, currentMonitored: boolean) => {
    const nextMonitored = !currentMonitored;
    const nextStatus = nextMonitored ? 'connected' : 'disconnected';
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_monitored: nextMonitored, status: nextStatus } : s))
    );
    await api.toggleSource(id, nextStatus, nextMonitored);
  };

  const handleAddCustomFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim() || !newFolderPath.trim()) return;
    const res = await api.createSource({
      name: newFolderName.trim(),
      type: 'folder',
      path: newFolderPath.trim(),
      is_monitored: true,
    });
    if (res.success) {
      await loadSources();
      setNewFolderName('');
      setNewFolderPath('');
      setShowAddFolder(false);
    } else {
      alert(`Failed to authorize folder: ${res.error}`);
    }
  };

  const handleDeleteSource = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to revoke authorization for "${name}"?`)) {
      return;
    }
    const res = await api.deleteSource(id);
    if (res.success) {
      await loadSources();
    } else {
      alert(`Failed to remove source: ${res.error}`);
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ivory-400/40 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <FolderKey size={26} className="text-sage-600" />
            <h1 className="font-heading text-h1 text-espresso-800">Sources & Permissions</h1>
          </div>
          <p className="text-body text-espresso-500 mt-1 max-w-2xl">
            Adaptive Data Acquisition engine. Full control over what LIFEINTEL monitors. Revoke or grant source access at any time.
          </p>
        </div>
        <button
          onClick={() => setShowAddFolder(true)}
          className="btn btn-primary btn-sm"
        >
          <Plus size={15} />
          Authorize Local Folder
        </button>
      </div>

      {/* Acquisition Mode Selector */}
      <div className="bg-white border border-ivory-300 rounded-card p-6 shadow-surface space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-h3 text-espresso-800">Acquisition Operating Mode</h2>
            <p className="text-caption text-warmgray-500 mt-0.5">
              Choose your balance between proactive automation and manual privacy gating.
            </p>
          </div>
          <span className="badge badge-sage">Active: {processingMode.toUpperCase()}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {[
            {
              id: 'automatic',
              title: 'Automatic Intelligence',
              desc: 'Continuous background monitoring of all authorized folders. Detects modifications and new attachments in real-time.',
            },
            {
              id: 'hybrid',
              title: 'Hybrid Intelligence (Default)',
              desc: 'Monitors designated local folders on a scheduled interval. Explicit confirmation requested for sensitive discoveries.',
            },
            {
              id: 'manual',
              title: 'Privacy-First Manual Mode',
              desc: 'Zero background directory monitoring. Ingests content only when files are explicitly dragged or pasted.',
            },
          ].map((mode) => (
            <div
              key={mode.id}
              onClick={() => setProcessingMode(mode.id as any)}
              className={`p-4 rounded-subtle border cursor-pointer transition-all ${
                processingMode === mode.id
                  ? 'border-sage-600 bg-sage-50/30 ring-1 ring-sage-600/30'
                  : 'border-ivory-300 hover:border-ivory-400 bg-ivory-50/50'
              }`}
            >
              <span className="font-semibold text-body-sm text-espresso-800 block">
                {mode.title}
              </span>
              <p className="text-caption text-warmgray-500 mt-1.5 leading-relaxed">{mode.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Authorized Local Directories */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-h2 text-espresso-800">Authorized Local Folders</h2>
          <span className="text-caption text-warmgray-500">
            {sources.filter((s) => s.type === 'folder' && s.is_monitored).length} active directories
          </span>
        </div>

        <div className="space-y-3">
          {sources
            .filter((s) => s.type === 'folder')
            .map((source) => (
              <div
                key={source.id}
                className="bg-white border border-ivory-300 rounded-card p-5 shadow-surface flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-subtle bg-ivory-100 flex-shrink-0 mt-0.5">
                    <Folder size={18} className="text-sage-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-body text-espresso-800">{source.name}</h3>
                      <span
                        className={`badge ${
                          source.is_monitored ? 'badge-sage' : 'badge-warmgray'
                        }`}
                      >
                        {source.is_monitored ? 'Active Watchdog' : 'Monitoring Paused'}
                      </span>
                    </div>
                    <p className="font-mono text-caption text-warmgray-500 mt-1 select-all">
                      {source.path}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-caption text-warmgray-400">
                      <span>{source.item_count} documents indexed</span>
                      <span>Last scan: {source.last_sync}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <button
                    onClick={() => handleToggle(source.id, source.is_monitored)}
                    className={`btn btn-sm ${
                      source.is_monitored ? 'btn-secondary text-espresso-700' : 'btn-primary'
                    }`}
                  >
                    {source.is_monitored ? 'Pause Scan' : 'Resume Scan'}
                  </button>
                  <button
                    onClick={() => handleDeleteSource(source.id, source.name)}
                    className="p-2 hover:bg-terracotta-50 hover:text-terracotta-600 text-warmgray-400 rounded-subtle transition-colors"
                    title="Revoke and remove folder"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Cloud & Account Integrations */}
      <div className="space-y-4">
        <div>
          <h2 className="font-heading text-h2 text-espresso-800">Explicit Connected Accounts</h2>
          <p className="text-caption text-warmgray-500 mt-0.5">
            Strict OAuth authorization. Never accesses personal communications without explicit opt-in.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sources
            .filter((s) => s.type !== 'folder')
            .map((source) => (
              <div
                key={source.id}
                className="bg-white border border-ivory-300 rounded-card p-5 shadow-surface space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-ivory-100 rounded-subtle text-espresso-700">
                      {source.type === 'email' ? <Mail size={18} /> : <Calendar size={18} />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-body-sm text-espresso-800">{source.name}</h3>
                      <span className="text-caption text-warmgray-400 font-mono">
                        {source.status === 'connected' ? 'Authorized' : 'Disconnected'}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      source.status === 'connected' ? 'bg-sage-600' : 'bg-warmgray-300'
                    }`}
                  />
                </div>

                <p className="text-caption text-warmgray-500 leading-relaxed">
                  {source.type === 'email'
                    ? 'Scans syllabus updates and deadline notices received from university faculty.'
                    : 'Correlates calendar exam slots with document assignment obligations.'}
                </p>

                <div className="pt-2 border-t border-ivory-200 flex justify-end">
                  <button
                    onClick={() => handleToggle(source.id, source.is_monitored)}
                    className="btn btn-secondary btn-sm"
                  >
                    {source.status === 'connected' ? 'Revoke Access' : 'Authorize Connection'}
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Add Folder Modal */}
      {showAddFolder && (
        <div className="fixed inset-0 bg-espresso-950/30 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-card shadow-overlay max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-ivory-300 pb-3">
              <h3 className="font-heading text-h3 text-espresso-800">Authorize Local Folder</h3>
              <button onClick={() => setShowAddFolder(false)} className="text-warmgray-400 hover:text-espresso-700">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddCustomFolder} className="space-y-4">
              <div>
                <label className="text-caption font-semibold text-espresso-700 block mb-1">Folder Display Name</label>
                <input
                  type="text"
                  required
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="e.g. Capstone Research Docs"
                  className="input"
                />
              </div>
              <div>
                <label className="text-caption font-semibold text-espresso-700 block mb-1">Local Directory Path</label>
                <input
                  type="text"
                  required
                  value={newFolderPath}
                  onChange={(e) => setNewFolderPath(e.target.value)}
                  placeholder="e.g. D:/University/Capstone/Notices"
                  className="input font-mono text-body-sm"
                />
              </div>
              <p className="text-caption text-warmgray-500">
                LIFEINTEL will monitor only files in this directory. Subfolders must be explicitly authorized.
              </p>
              <div className="flex justify-end gap-2 pt-2 border-t border-ivory-200">
                <button
                  type="button"
                  onClick={() => setShowAddFolder(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Grant Authorization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
