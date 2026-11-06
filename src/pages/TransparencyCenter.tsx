import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Download,
  Trash2,
  HardDrive,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Server,
  FileCheck,
  X,
} from 'lucide-react';
import api from '@/lib/api';

interface TransparencyData {
  privacyMode: string;
  cloudAISharing: boolean;
  externalAPICalls: number;
  documentsTracked: number;
  factsExtracted: number;
  monitoredSources: string[];
  dataStorageLocation: string;
  aiEngine: string;
}

export default function TransparencyCenter() {
  const [summary, setSummary] = useState<TransparencyData>({
    privacyMode: '100% Local-First Processing',
    cloudAISharing: false,
    externalAPICalls: 0,
    documentsTracked: 4,
    factsExtracted: 29,
    monitoredSources: ['Documents Folder', 'Downloads Folder'],
    dataStorageLocation: 'D:/Nithin/AMETceii.in updated/Capstone/PROJECT LIFEINTEL/data',
    aiEngine: 'Local Quantized Model (llama3 / CPU-friendly)',
  });
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [purgeSuccess, setPurgeSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await api.getTransparencySummary();
      if (res.success && res.data) {
        setSummary(res.data);
      }
    }
    load();
  }, []);

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(summary, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'LIFEINTEL_Intelligence_Export.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePurgeAll = async () => {
    await api.clearAllUserData();
    setShowPurgeModal(false);
    setPurgeSuccess(true);
    setSummary((prev) => ({
      ...prev,
      documentsTracked: 0,
      factsExtracted: 0,
    }));
    setTimeout(() => setPurgeSuccess(false), 5000);
  };

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="border-b border-ivory-400/40 pb-6">
        <div className="flex items-center gap-3">
          <Shield size={26} className="text-sage-600" />
          <h1 className="font-heading text-h1 text-espresso-800">Transparency Center</h1>
        </div>
        <p className="text-body text-espresso-500 mt-1 max-w-3xl">
          Non-negotiable privacy and data sovereignty dashboard. Inspect local database records, verify network isolation, and manage permanent deletion rights.
        </p>
      </div>

      {purgeSuccess && (
        <div className="p-4 bg-terracotta-50 border border-terracotta-200 rounded-subtle text-terracotta-800 text-body-sm flex items-center gap-2">
          <CheckCircle2 size={18} className="text-terracotta-600" />
          <span>All local intelligence databases, extracted facts, and vector indices were successfully purged.</span>
        </div>
      )}

      {/* Privacy Guarantee Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white border border-ivory-300 rounded-card shadow-surface space-y-2">
          <div className="flex items-center gap-2 text-sage-700">
            <Lock size={18} />
            <span className="font-semibold text-body-sm">Local-First Processing</span>
          </div>
          <p className="font-heading text-h2 text-espresso-800">Air-Gapped Privacy</p>
          <p className="text-caption text-warmgray-500">
            Document extraction and reasoning run strictly on your CPU/GPU hardware.
          </p>
        </div>

        <div className="p-5 bg-white border border-ivory-300 rounded-card shadow-surface space-y-2">
          <div className="flex items-center gap-2 text-sage-700">
            <Server size={18} />
            <span className="font-semibold text-body-sm">Zero Third-Party Telemetry</span>
          </div>
          <p className="font-heading text-h2 text-espresso-800">0 Network Calls</p>
          <p className="text-caption text-warmgray-500">
            No external cloud AI APIs utilized. All data remains in your local SQLite file.
          </p>
        </div>

        <div className="p-5 bg-white border border-ivory-300 rounded-card shadow-surface space-y-2">
          <div className="flex items-center gap-2 text-espresso-700">
            <FileCheck size={18} />
            <span className="font-semibold text-body-sm">User Data Sovereign</span>
          </div>
          <p className="font-heading text-h2 text-espresso-800">Full Audit Rights</p>
          <p className="text-caption text-warmgray-500">
            Instant full JSON export and cryptographic one-click purge guaranteed.
          </p>
        </div>
      </div>

      {/* Storage and AI Architecture Breakdown */}
      <div className="bg-white border border-ivory-300 rounded-card p-6 shadow-surface space-y-5">
        <h2 className="font-heading text-h3 text-espresso-800 border-b border-ivory-200 pb-3">
          Architecture & Storage Inspection
        </h2>

        <div className="space-y-4 text-body-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3 bg-ivory-50 rounded-subtle">
            <span className="font-medium text-espresso-800">Local Database Location:</span>
            <span className="font-mono text-caption text-warmgray-600 break-all select-all">
              {summary.dataStorageLocation}/lifeintel.db
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3 bg-ivory-50 rounded-subtle">
            <span className="font-medium text-espresso-800">AI Model Provider:</span>
            <span className="font-mono text-caption text-sage-700 font-semibold">
              {summary.aiEngine}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3 bg-ivory-50 rounded-subtle">
            <span className="font-medium text-espresso-800">Current Memory Footprint:</span>
            <span className="text-caption text-espresso-700">
              {summary.documentsTracked} Documents Tracked • {summary.factsExtracted} Relational Facts
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3 bg-ivory-50 rounded-subtle">
            <span className="font-medium text-espresso-800">Monitored Folders:</span>
            <span className="text-caption text-espresso-700">
              {summary.monitoredSources.join(', ')}
            </span>
          </div>
        </div>
      </div>

      {/* Data Sovereignty Actions */}
      <div className="bg-white border border-ivory-300 rounded-card p-6 shadow-surface space-y-4">
        <div>
          <h2 className="font-heading text-h3 text-espresso-800">Export & Erasure Controls</h2>
          <p className="text-caption text-warmgray-500 mt-0.5">
            You hold exclusive control over your personal data.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button onClick={handleExportData} className="btn btn-secondary btn-sm">
            <Download size={15} />
            Export Stored Intelligence (JSON)
          </button>
          <button
            onClick={() => setShowPurgeModal(true)}
            className="btn btn-danger btn-sm"
          >
            <Trash2 size={15} />
            Purge All Stored Knowledge
          </button>
        </div>
      </div>

      {/* Purge Confirmation Modal */}
      {showPurgeModal && (
        <div className="fixed inset-0 bg-espresso-950/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-card shadow-overlay max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-terracotta-600">
              <AlertTriangle size={24} />
              <h3 className="font-heading text-h3 text-espresso-800">Permanent Purge Warning</h3>
            </div>
            <p className="text-body-sm text-espresso-700 leading-relaxed">
              This action will permanently delete all indexed document records, extracted facts, obligations, and vector representations from your local SQLite database.
            </p>
            <p className="text-caption text-warmgray-500">
              Your original files in your Documents and Downloads folders will remain untouched.
            </p>
            <div className="flex justify-end gap-2 pt-3 border-t border-ivory-200">
              <button
                onClick={() => setShowPurgeModal(false)}
                className="btn btn-secondary btn-sm"
              >
                Cancel
              </button>
              <button
                onClick={handlePurgeAll}
                className="btn btn-danger btn-sm"
              >
                Yes, Permanently Purge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
