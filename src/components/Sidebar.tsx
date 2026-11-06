import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  MessageCircle,
  Brain,
  FileText,
  Calendar,
  GitCompare,
  FolderKey,
  Radio,
  Shield,
  Settings,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import api from '@/lib/api';

// ─── Navigation Data ──────────────────────────────────

interface NavItemDef {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
}

interface NavSection {
  label: string;
  items: NavItemDef[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: 'MAIN',
    items: [
      { id: 'command-center', label: 'Command Center', icon: LayoutDashboard, path: '/command-center' },
      { id: 'intelligence-feed', label: 'Intelligence Feed', icon: Activity, path: '/intelligence-feed' },
      { id: 'ask', label: 'Ask LIFEINTEL', icon: MessageCircle, path: '/ask' },
    ],
  },
  {
    label: 'KNOWLEDGE',
    items: [
      { id: 'memory', label: 'Memory Explorer', icon: Brain, path: '/memory' },
      { id: 'documents', label: 'Documents', icon: FileText, path: '/documents' },
      { id: 'timeline', label: 'Life Timeline', icon: Calendar, path: '/timeline' },
      { id: 'changes', label: 'Change Intelligence', icon: GitCompare, path: '/changes' },
    ],
  },
  {
    label: 'AUTOMATION',
    items: [
      { id: 'sources', label: 'Sources & Permissions', icon: FolderKey, path: '/sources' },
      { id: 'monitoring', label: 'Monitoring Activity', icon: Radio, path: '/monitoring' },
    ],
  },
  {
    label: 'CONTROL',
    items: [
      { id: 'transparency', label: 'Transparency Center', icon: Shield, path: '/transparency' },
      { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
    ],
  },
];

// ─── Component ────────────────────────────────────────

export function Sidebar() {
  const location = useLocation();
  const [backendOnline, setBackendOnline] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        const res = await api.getHealth();
        if (mounted) {
          setBackendOnline(res.success && res.data?.status === 'healthy');
        }
      } catch {
        if (mounted) setBackendOnline(false);
      }
    };
    check();
    const interval = setInterval(check, 10000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <aside className="flex flex-col w-64 h-screen bg-ivory-50 border-r border-ivory-400/40 shrink-0">
      {/* Logo */}
      <div className="px-5 pt-6 pb-4">
        <NavLink to="/command-center" className="block select-none">
          <h1 className="text-h1 leading-none">
            <span className="font-heading text-sage-600">LIFE</span>
            <span className="font-heading text-espresso-800">INTEL</span>
          </h1>
          <p className="mt-1 text-overline uppercase text-warmgray-500 tracking-widest">
            Personal Intelligence
          </p>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-5">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            {/* Section label */}
            <p className="px-3 mb-1.5 text-overline uppercase text-warmgray-500 tracking-widest select-none">
              {section.label}
            </p>

            {/* Items */}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path === '/command-center' && location.pathname === '/');

                return (
                  <li key={item.id}>
                    <NavLink
                      to={item.path}
                      className={() =>
                        [
                          'flex items-center gap-3 py-2 px-4 rounded-subtle text-body-sm transition-colors duration-150',
                          isActive
                            ? 'bg-sage-50 text-sage-600 border-l-2 border-sage-600 font-medium'
                            : 'text-espresso-600 hover:bg-ivory-200 border-l-2 border-transparent',
                        ].join(' ')
                      }
                    >
                      <item.icon
                        size={18}
                        strokeWidth={isActive ? 2 : 1.75}
                        className="shrink-0"
                      />
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Orientation Quick Link */}
      <div className="px-5 py-2.5 border-t border-ivory-300/40">
        <NavLink
          to="/onboarding"
          className="flex items-center gap-2 text-caption text-warmgray-500 hover:text-sage-700 transition-colors"
        >
          <Sparkles size={14} className="text-sage-600" />
          <span>System Tour / Onboarding</span>
        </NavLink>
      </div>

      {/* System Status */}
      <div className="px-5 py-3 border-t border-ivory-300/60">
        <div className="flex items-center gap-2 text-caption text-warmgray-500">
          <span
            className={[
              'inline-block w-2 h-2 rounded-full shrink-0',
              backendOnline ? 'bg-sage-500' : 'bg-warmgray-400 animate-pulse-subtle',
            ].join(' ')}
          />
          <span className="font-medium text-espresso-700">
            {backendOnline ? 'Local Engine Active' : 'Checking Local Engine...'}
          </span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
