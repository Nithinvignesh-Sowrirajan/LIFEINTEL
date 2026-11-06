import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';

// Map route paths to page titles
const PAGE_TITLES: Record<string, string> = {
  '/': 'Command Center',
  '/command-center': 'Command Center',
  '/intelligence-feed': 'Intelligence Feed',
  '/ask': 'Ask LIFEINTEL',
  '/memory': 'Memory Explorer',
  '/documents': 'Documents',
  '/timeline': 'Life Timeline',
  '/changes': 'Change Intelligence',
  '/sources': 'Sources & Permissions',
  '/monitoring': 'Monitoring Activity',
  '/transparency': 'Transparency Center',
  '/settings': 'Settings',
};

export default function AppLayout() {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] ?? 'LIFEINTEL';

  return (
    <div className="flex h-screen bg-ivory-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top bar */}
        <TopBar title={title} />

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
