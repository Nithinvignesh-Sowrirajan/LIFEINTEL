import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, X, ShieldAlert, Minus, Square, X as CloseIcon } from 'lucide-react';

interface TopBarProps {
  title: string;
}

declare global {
  interface Window {
    electronAPI?: {
      minimize: () => void;
      maximize: () => void;
      close: () => void;
    };
  }
}

export function TopBar({ title }: TopBarProps) {
  const [searchVal, setSearchVal] = useState('');
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/ask?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal('');
    }
  };

  const isElectron = typeof window !== 'undefined' && !!window.electronAPI;

  return (
    <header className="flex items-center h-14 px-8 bg-ivory-100 border-b border-ivory-300/70 shrink-0 relative z-20">
      {/* Page Title */}
      <div className="flex-shrink-0">
        <h2 className="font-heading text-h2 text-espresso-800">{title}</h2>
      </div>

      {/* Center: Global Search */}
      <div className="flex-1 flex justify-center px-6">
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-lg">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-warmgray-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search everything or ask a question (Press Enter)..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-ivory-300 rounded-subtle
                       text-body-sm text-espresso-800 placeholder:text-warmgray-400
                       focus:outline-none focus:border-sage-500 focus:ring-1 focus:ring-sage-500/30
                       transition-colors duration-150"
          />
        </form>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4 shrink-0 relative">
        {/* Notification Bell */}
        <button
          onClick={() => setShowNotifDropdown(!showNotifDropdown)}
          className="relative p-2 rounded-subtle text-espresso-500 hover:bg-ivory-200 transition-colors duration-150"
          aria-label="Notifications"
        >
          <Bell size={20} strokeWidth={1.75} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-terracotta-500 rounded-full ring-2 ring-ivory-100" />
        </button>

        {/* Notification Dropdown Panel */}
        {showNotifDropdown && (
          <div className="absolute right-0 top-12 w-80 bg-white border border-ivory-300 rounded-card shadow-overlay p-4 space-y-3 animate-fade-in z-50">
            <div className="flex items-center justify-between border-b border-ivory-200 pb-2">
              <span className="font-semibold text-body-sm text-espresso-800">Alerts & Proactive Notices</span>
              <button onClick={() => setShowNotifDropdown(false)} className="text-warmgray-400 hover:text-espresso-700">
                <X size={15} />
              </button>
            </div>
            <div
              onClick={() => {
                setShowNotifDropdown(false);
                navigate('/changes');
              }}
              className="p-3 bg-terracotta-50/60 border border-terracotta-200/80 rounded-subtle cursor-pointer hover:bg-terracotta-50 transition-colors"
            >
              <div className="flex items-center gap-1.5 text-terracotta-700 text-caption font-semibold">
                <ShieldAlert size={14} />
                <span>Deadline Shift Advisory</span>
              </div>
              <p className="text-caption text-espresso-800 mt-1">
                Internship application moved to Nov 10. Resume task is scheduled for Nov 12.
              </p>
              <p className="text-[10px] text-warmgray-400 mt-1 font-mono">2 hours ago • Click to review</p>
            </div>
          </div>
        )}

        {/* Profile */}
        <div
          onClick={() => navigate('/onboarding')}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-sage-100 text-sage-700 text-caption font-semibold select-none cursor-pointer hover:ring-2 hover:ring-sage-400 transition-all"
          title="Nithin (Click to view Welcome / Onboarding tour)"
        >
          N
        </div>

        {/* Window controls if inside Electron */}
        {isElectron && (
          <div className="flex items-center border-l border-ivory-300 pl-3 gap-1">
            <button
              onClick={() => window.electronAPI?.minimize()}
              className="p-1.5 hover:bg-ivory-200 rounded text-warmgray-500 hover:text-espresso-800"
              title="Minimize"
            >
              <Minus size={14} />
            </button>
            <button
              onClick={() => window.electronAPI?.maximize()}
              className="p-1.5 hover:bg-ivory-200 rounded text-warmgray-500 hover:text-espresso-800"
              title="Maximize"
            >
              <Square size={12} />
            </button>
            <button
              onClick={() => window.electronAPI?.close()}
              className="p-1.5 hover:bg-terracotta-100 rounded text-warmgray-500 hover:text-terracotta-700"
              title="Close"
            >
              <CloseIcon size={14} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default TopBar;
