/**
 * LIFEINTEL — Backend API Client
 * 
 * Handles all communication with the Python FastAPI backend.
 * Routes through Vite proxy to http://127.0.0.1:8000.
 */

import type { ApiResponse, HealthStatus } from './types';

const API_BASE = '/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        return {
          success: false,
          error: `HTTP ${response.status}: ${errorBody || response.statusText}`,
          timestamp: new Date().toISOString(),
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Network error: ${message}`,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Health & Stats
  async getHealth(): Promise<ApiResponse<HealthStatus>> {
    return this.request<HealthStatus>('/health');
  }

  async getStats(): Promise<ApiResponse<{
    documentsTracked: number;
    factsExtracted: number;
    activeObligations: number;
    detectedChanges: number;
    activeSources: number;
    systemStatus: string;
    lastScan: string;
  }>> {
    return this.request('/stats');
  }

  // Documents
  async uploadDocument(file: File): Promise<ApiResponse<{ id: string; name: string; status: string; message: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const url = `${this.baseUrl}/documents/upload`;
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const text = await response.text();
        return { success: false, error: text, timestamp: new Date().toISOString() };
      }
      const data = await response.json();
      return { success: true, data, timestamp: new Date().toISOString() };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      return { success: false, error: msg, timestamp: new Date().toISOString() };
    }
  }

  async getDocuments(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/documents');
  }

  async getDocument(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/documents/${id}`);
  }

  async getDocumentFacts(id: string): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/documents/${id}/facts`);
  }

  async deleteDocument(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/documents/${id}`, {
      method: 'DELETE',
    });
  }

  // Intelligence
  async getInsights(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/intelligence/insights');
  }

  // Memory Graph
  async getMemoryGraph(): Promise<ApiResponse<{ entities: any[]; relationships: any[]; totalEntities: number; crossDocumentLinks: number }>> {
    return this.request('/memory/graph');
  }

  // Changes
  async getChanges(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/changes');
  }

  async toggleChangeReviewed(id: string): Promise<ApiResponse<{ id: string; is_reviewed: boolean }>> {
    return this.request(`/changes/${id}`, {
      method: 'PATCH',
    });
  }

  // Obligations
  async getObligations(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/obligations');
  }

  async createObligation(data: { title: string; description?: string; deadline?: string; urgency?: string; category?: string }): Promise<ApiResponse<any>> {
    return this.request('/obligations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateObligation(id: string, updates: { status?: string; urgency?: string }): Promise<ApiResponse<any>> {
    return this.request<any>(`/obligations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteObligation(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/obligations/${id}`, {
      method: 'DELETE',
    });
  }

  // Sources
  async getSources(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/sources');
  }

  async createSource(data: { name: string; type?: string; path?: string; is_monitored?: boolean }): Promise<ApiResponse<any>> {
    return this.request('/sources', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteSource(sourceId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/sources/${sourceId}`, {
      method: 'DELETE',
    });
  }

  async toggleSource(sourceId: string, status: string, isMonitored: boolean): Promise<ApiResponse<any>> {
    return this.request<any>(`/sources/${sourceId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, is_monitored: isMonitored }),
    });
  }

  // Monitoring
  async getMonitoringStatus(): Promise<ApiResponse<{ is_running: boolean; monitored_folders_count: number; monitored_paths: string[] }>> {
    return this.request('/monitoring/status');
  }

  async toggleMonitoring(): Promise<ApiResponse<{ is_running: boolean; message: string }>> {
    return this.request('/monitoring/toggle', { method: 'POST' });
  }

  // Search
  async search(query: string): Promise<ApiResponse<{ query: string; documents: any[]; facts: any[]; obligations: any[] }>> {
    return this.request(`/search?q=${encodeURIComponent(query)}`);
  }

  // Ask LIFEINTEL
  async askQuestion(question: string): Promise<ApiResponse<{ answer: string; sources: string[]; confidence: number }>> {
    return this.request('/ask', {
      method: 'POST',
      body: JSON.stringify({ question }),
    });
  }

  // Transparency
  async getTransparencySummary(): Promise<ApiResponse<any>> {
    return this.request('/transparency/summary');
  }

  async getTransparencyActivity(): Promise<ApiResponse<any[]>> {
    return this.request('/transparency/activity');
  }

  async clearAllUserData(): Promise<ApiResponse<{ message: string }>> {
    return this.request('/transparency/clear-data', {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient();
export default api;
