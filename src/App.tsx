import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Layout
import AppLayout from '@/layouts/AppLayout';

// Lazy-loaded pages
const CommandCenter = React.lazy(() => import('@/pages/CommandCenter'));
const IntelligenceFeed = React.lazy(() => import('@/pages/IntelligenceFeed'));
const AskLifeintel = React.lazy(() => import('@/pages/AskLifeintel'));
const MemoryExplorer = React.lazy(() => import('@/pages/MemoryExplorer'));
const Documents = React.lazy(() => import('@/pages/Documents'));
const LifeTimeline = React.lazy(() => import('@/pages/LifeTimeline'));
const ChangeIntelligence = React.lazy(() => import('@/pages/ChangeIntelligence'));
const SourcesPermissions = React.lazy(() => import('@/pages/SourcesPermissions'));
const MonitoringActivity = React.lazy(() => import('@/pages/MonitoringActivity'));
const TransparencyCenter = React.lazy(() => import('@/pages/TransparencyCenter'));
const Settings = React.lazy(() => import('@/pages/Settings'));
const Onboarding = React.lazy(() => import('@/pages/Onboarding'));

// Loading fallback
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full min-h-[320px]">
      <Loader2 size={28} className="animate-spin text-sage-500" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Onboarding — outside main layout */}
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Main application layout */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/command-center" replace />} />
          <Route path="command-center" element={<CommandCenter />} />
          <Route path="intelligence-feed" element={<IntelligenceFeed />} />
          <Route path="ask" element={<AskLifeintel />} />
          <Route path="memory" element={<MemoryExplorer />} />
          <Route path="documents" element={<Documents />} />
          <Route path="timeline" element={<LifeTimeline />} />
          <Route path="changes" element={<ChangeIntelligence />} />
          <Route path="sources" element={<SourcesPermissions />} />
          <Route path="monitoring" element={<MonitoringActivity />} />
          <Route path="transparency" element={<TransparencyCenter />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
