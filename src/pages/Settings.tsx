import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Cpu,
  Bell,
  Eye,
  Sliders,
  CheckCircle2,
  HardDrive,
  Info,
  Save,
} from 'lucide-react';

export default function Settings() {
  const [modelProvider, setModelProvider] = useState<'local' | 'cloud'>(() => {
    return (localStorage.getItem('lifeintel_model_provider') as 'local' | 'cloud') || 'local';
  });
  const [localModelName, setLocalModelName] = useState(() => {
    return localStorage.getItem('lifeintel_local_model_name') || 'llama3:8b-instruct-q4_K_M';
  });
  const [ollamaUrl, setOllamaUrl] = useState(() => {
    return localStorage.getItem('lifeintel_ollama_url') || 'http://127.0.0.1:11434';
  });
  const [reasoningThreshold, setReasoningThreshold] = useState(() => {
    const val = localStorage.getItem('lifeintel_reasoning_threshold');
    return val ? parseInt(val, 10) : 85;
  });
  const [desktopToasts, setDesktopToasts] = useState(() => {
    const val = localStorage.getItem('lifeintel_desktop_toasts');
    return val !== null ? val === 'true' : true;
  });
  const [advanceWarningDays, setAdvanceWarningDays] = useState(() => {
    const val = localStorage.getItem('lifeintel_advance_warning_days');
    return val ? parseInt(val, 10) : 5;
  });
  const [saveMessage, setSaveMessage] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('lifeintel_model_provider', modelProvider);
    localStorage.setItem('lifeintel_local_model_name', localModelName);
    localStorage.setItem('lifeintel_ollama_url', ollamaUrl);
    localStorage.setItem('lifeintel_reasoning_threshold', reasoningThreshold.toString());
    localStorage.setItem('lifeintel_desktop_toasts', desktopToasts.toString());
    localStorage.setItem('lifeintel_advance_warning_days', advanceWarningDays.toString());
    setSaveMessage(true);
    setTimeout(() => setSaveMessage(false), 3000);
  };

  return (
    <div className="animate-fade-in max-w-4xl space-y-8">
      {/* Header */}
      <div className="border-b border-ivory-400/40 pb-6">
        <div className="flex items-center gap-3">
          <SettingsIcon size={26} className="text-sage-600" />
          <h1 className="font-heading text-h1 text-espresso-800">Settings & Configuration</h1>
        </div>
        <p className="text-body text-espresso-500 mt-1">
          Tune local AI inference, reasoning sensitivity, background notifications, and hardware acceleration profiles.
        </p>
      </div>

      {saveMessage && (
        <div className="p-4 bg-sage-50 border border-sage-200 rounded-subtle text-sage-800 text-body-sm flex items-center gap-2">
          <CheckCircle2 size={18} className="text-sage-600" />
          <span>Application settings saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Visual Identity Section */}
        <div className="bg-white border border-ivory-300 rounded-card p-6 shadow-surface space-y-4">
          <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
            <h2 className="font-heading text-h3 text-espresso-800">Visual Identity System</h2>
            <span className="badge badge-sage">Mandatory Direction</span>
          </div>

          <div className="p-4 bg-ivory-50 rounded-subtle border border-ivory-300 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-ivory-300 flex items-center justify-center flex-shrink-0">
              <Eye size={20} className="text-espresso-700" />
            </div>
            <div>
              <p className="font-medium text-body-sm text-espresso-900">Concept D: Warm Minimal</p>
              <p className="text-caption text-warmgray-500 mt-1 leading-relaxed">
                Ivory background, dark espresso typography, restrained sage green accents, and DM Serif Display headings. Designed for calm clarity, zero neon effects, and balanced high-density information architecture.
              </p>
            </div>
          </div>
        </div>

        {/* AI & Inference Engine Section */}
        <div className="bg-white border border-ivory-300 rounded-card p-6 shadow-surface space-y-5">
          <div className="border-b border-ivory-200 pb-3 flex items-center justify-between">
            <div>
              <h2 className="font-heading text-h3 text-espresso-800">AI / LLM Engine Settings</h2>
              <p className="text-caption text-warmgray-500 mt-0.5">
                Local-first inference parameters for temporal reasoning and fact extraction.
              </p>
            </div>
            <span className="badge badge-warmgray font-mono text-[10px]">PyTorch / ONNX / Ollama</span>
          </div>

          {/* Dev Machine Hardware Detection */}
          <div className="p-4 bg-ivory-50/80 border border-ivory-300 rounded-subtle space-y-2">
            <div className="flex items-center gap-2 text-espresso-800 font-medium text-body-sm">
              <Cpu size={16} className="text-sage-600" />
              <span>Target Machine Profile Detected</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-caption font-mono text-espresso-700">
              <div>Processor: AMD Ryzen 5 PRO 8640HS</div>
              <div>Graphics: AMD Radeon 760M (Integrated)</div>
              <div>Execution Mode: CPU AVX-512 Quantized (4-bit)</div>
              <div>Memory Limit: 8 GB Context Buffer</div>
            </div>
          </div>

          <div className="space-y-4 text-body-sm">
            <div>
              <label className="font-medium text-espresso-800 block mb-1">Inference Provider</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="provider"
                    checked={modelProvider === 'local'}
                    onChange={() => setModelProvider('local')}
                    className="accent-sage-600"
                  />
                  <span>Local LLaMA / Ollama (Zero data leaves PC)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="provider"
                    checked={modelProvider === 'cloud'}
                    onChange={() => setModelProvider('cloud')}
                    className="accent-sage-600"
                  />
                  <span>Optional Cloud Provider (Explicit key required)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="font-medium text-espresso-800 block mb-1">Local Model Identifier</label>
              <input
                type="text"
                value={localModelName}
                onChange={(e) => setLocalModelName(e.target.value)}
                className="input font-mono text-body-sm"
              />
            </div>

            <div>
              <label className="font-medium text-espresso-800 block mb-1">Ollama / Server Endpoint URL</label>
              <input
                type="text"
                value={ollamaUrl}
                onChange={(e) => setOllamaUrl(e.target.value)}
                className="input font-mono text-body-sm"
              />
            </div>
          </div>
        </div>

        {/* Temporal Reasoning & Consequence Parameters */}
        <div className="bg-white border border-ivory-300 rounded-card p-6 shadow-surface space-y-5">
          <div className="border-b border-ivory-200 pb-3">
            <h2 className="font-heading text-h3 text-espresso-800">Consequence Reasoning Sensitivity</h2>
            <p className="text-caption text-warmgray-500 mt-0.5">
              Governs confidence thresholds before alerting you of potential conflicts.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-body-sm mb-1">
                <span className="font-medium text-espresso-800">Minimum Alert Confidence Score</span>
                <span className="font-mono font-semibold text-sage-700">{reasoningThreshold}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="99"
                value={reasoningThreshold}
                onChange={(e) => setReasoningThreshold(Number(e.target.value))}
                className="w-full accent-sage-600"
              />
              <p className="text-caption text-warmgray-400 mt-1">
                Higher values suppress speculative warnings. Lower values catch edge-case schedule overlaps.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-body-sm mb-1">
                <span className="font-medium text-espresso-800">Proactive Alert Advance Horizon</span>
                <span className="font-mono font-semibold text-sage-700">{advanceWarningDays} days</span>
              </div>
              <input
                type="range"
                min="1"
                max="14"
                value={advanceWarningDays}
                onChange={(e) => setAdvanceWarningDays(Number(e.target.value))}
                className="w-full accent-sage-600"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end gap-3 pt-4">
          <button type="submit" className="btn btn-primary">
            <Save size={16} />
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
