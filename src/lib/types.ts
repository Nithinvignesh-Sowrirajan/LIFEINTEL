/**
 * LIFEINTEL — Shared TypeScript types
 */

// ─── Navigation ────────────────────────────────────
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  section: 'main' | 'knowledge' | 'automation' | 'control';
}

// ─── Source Status ─────────────────────────────────
export type SourceStatus = 'connected' | 'disconnected' | 'syncing' | 'error';

export interface SourceConnection {
  id: string;
  name: string;
  type: 'folder' | 'email' | 'calendar' | 'manual';
  status: SourceStatus;
  lastSync: string | null;
  itemCount: number;
  path?: string;
}

// ─── Intelligence ──────────────────────────────────
export type IntelligenceType = 
  | 'deadline_change'
  | 'new_obligation'
  | 'conflict_detected'
  | 'document_analyzed'
  | 'relationship_discovered'
  | 'consequence_identified'
  | 'reminder';

export type UrgencyLevel = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface IntelligenceInsight {
  id: string;
  type: IntelligenceType;
  title: string;
  summary: string;
  urgency: UrgencyLevel;
  confidence: ConfidenceLevel;
  timestamp: string;
  sourceDocuments: string[];
  details?: Record<string, unknown>;
  suggestedAction?: string;
  isRead: boolean;
}

// ─── Obligations ───────────────────────────────────
export type ObligationStatus = 'upcoming' | 'overdue' | 'completed' | 'dismissed';

export interface Obligation {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: ObligationStatus;
  urgency: UrgencyLevel;
  confidence: ConfidenceLevel;
  sourceDocumentId: string;
  sourceDocumentName: string;
  category: string;
  relatedObligations: string[];
  createdAt: string;
  completedAt?: string;
}

// ─── Documents ─────────────────────────────────────
export type DocumentStatus = 'pending' | 'processing' | 'processed' | 'failed';

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  status: DocumentStatus;
  sourceId: string;
  sourceName: string;
  importedAt: string;
  processedAt?: string;
  extractedFactCount: number;
  path: string;
  hash: string;
  versions: number;
}

// ─── Change Detection ──────────────────────────────
export interface DetectedChange {
  id: string;
  documentId: string;
  documentName: string;
  field: string;
  previousValue: string;
  newValue: string;
  changeType: 'deadline' | 'amount' | 'requirement' | 'schedule' | 'condition' | 'other';
  significance: UrgencyLevel;
  detectedAt: string;
  consequence?: string;
  relatedDocuments: string[];
}

// ─── Activity Log ──────────────────────────────────
export interface ActivityEntry {
  id: string;
  type: 'import' | 'extraction' | 'change_detected' | 'alert' | 'user_action' | 'system';
  title: string;
  description: string;
  timestamp: string;
  sourceId?: string;
  documentId?: string;
}

// ─── API ───────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  database: boolean;
  aiModel: boolean;
  uptime: number;
}

// ─── Notifications ─────────────────────────────────
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

// ─── Settings ──────────────────────────────────────
export interface AppSettings {
  theme: 'warm-minimal';
  monitoringEnabled: boolean;
  monitoringIntervalMinutes: number;
  notificationsEnabled: boolean;
  desktopNotifications: boolean;
  aiModelProvider: 'local' | 'cloud';
  localModelName: string;
  processingMode: 'automatic' | 'manual' | 'hybrid';
  maxConcurrentProcessing: number;
}

