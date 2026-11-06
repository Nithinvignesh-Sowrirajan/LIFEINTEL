import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Filter,
  FileText,
  Tag,
  ChevronRight,
  Trash2,
  X,
} from 'lucide-react';
import api from '@/lib/api';

interface ObligationItem {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: string;
  urgency: string;
  confidence: number;
  category: string;
  source_document_name: string;
}

export default function LifeTimeline() {
  const [obligations, setObligations] = useState<ObligationItem[]>([]);
  const [viewMode, setViewMode] = useState<'timeline' | 'list'>('timeline');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newCategory, setNewCategory] = useState('academic');

  const loadObligations = async () => {
    const res = await api.getObligations();
    if (res.success && res.data && res.data.length > 0) {
      setObligations(res.data);
    } else {
      setObligations([
        {
          id: 'obl-internship',
          title: 'Internship Application Dossier',
          description: 'Submit resume, transcript, and project portfolio link via college portal.',
          deadline: '2026-11-10T23:59:59',
          status: 'upcoming',
          urgency: 'critical',
          confidence: 0.98,
          category: 'academic',
          source_document_name: 'College_Notice_Updated.pdf',
        },
        {
          id: 'obl-medical',
          title: 'Annual Health & Dental Checkup',
          description: 'Scheduled preventive consultation at City Medical Centre.',
          deadline: '2026-11-14T10:30:00',
          status: 'upcoming',
          urgency: 'medium',
          confidence: 0.88,
          category: 'personal',
          source_document_name: 'Direct Entry',
        },
        {
          id: 'obl-capstone',
          title: 'Capstone Milestone 1 Submission',
          description: 'Upload architecture document and prototype evaluation artifacts.',
          deadline: '2026-11-20T17:00:00',
          status: 'upcoming',
          urgency: 'high',
          confidence: 0.96,
          category: 'academic',
          source_document_name: 'Capstone_Project_Guidelines_2026.pdf',
        },
        {
          id: 'obl-cert',
          title: 'Cloud Certification Renewal',
          description: 'Complete recertification assessment before the expiration window closes.',
          deadline: '2026-12-01T23:59:59',
          status: 'upcoming',
          urgency: 'medium',
          confidence: 0.9,
          category: 'professional',
          source_document_name: 'College_Notice_Original.pdf',
        },
      ]);
    }
  };

  useEffect(() => {
    loadObligations();
  }, []);

  const handleToggleComplete = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'completed' ? 'upcoming' : 'completed';
    setObligations((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: nextStatus } : o))
    );
    await api.updateObligation(id, { status: nextStatus });
  };

  const handleDeleteObligation = async (id: string, title: string) => {
    if (!window.confirm(`Delete obligation "${title}"?`)) return;
    const res = await api.deleteObligation(id);
    if (res.success) {
      setObligations((prev) => prev.filter((o) => o.id !== id));
    } else {
      alert(`Failed to delete obligation: ${res.error}`);
    }
  };

  const handleAddObligation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const deadlineVal = newDeadline ? new Date(newDeadline).toISOString() : new Date(Date.now() + 86400000 * 5).toISOString();
    const res = await api.createObligation({
      title: newTitle,
      description: 'Manually added personal commitment',
      deadline: deadlineVal,
      urgency: 'medium',
      category: newCategory,
    });
    const newItem: ObligationItem = {
      id: res.success && res.data?.id ? res.data.id : `obl-custom-${Date.now()}`,
      title: newTitle,
      description: 'Manually added personal commitment',
      deadline: deadlineVal,
      status: 'upcoming',
      urgency: 'medium',
      confidence: 1.0,
      category: newCategory,
      source_document_name: 'Manual Entry',
    };
    setObligations((prev) => [newItem, ...prev]);
    setNewTitle('');
    setNewDeadline('');
    setShowAddModal(false);
  };

  const filtered = obligations.filter((o) => {
    if (filterCategory === 'all') return true;
    return o.category.toLowerCase() === filterCategory.toLowerCase();
  });

  const getDaysRemaining = (deadlineStr: string) => {
    const diff = new Date(deadlineStr).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return `${Math.abs(days)} days ago`;
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `In ${days} days`;
  };

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ivory-400/40 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <CalendarIcon size={26} className="text-sage-600" />
            <h1 className="font-heading text-h1 text-espresso-800">Life Timeline & Obligations</h1>
          </div>
          <p className="text-body text-espresso-500 mt-1">
            Chronological life registry synthesized automatically from notices, bills, appointments, and requirements.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-ivory-200 p-0.5 rounded-subtle flex items-center">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-subtle text-caption font-medium transition-colors ${
                viewMode === 'timeline'
                  ? 'bg-white text-espresso-900 shadow-xs'
                  : 'text-espresso-600'
              }`}
            >
              Timeline View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-subtle text-caption font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-espresso-900 shadow-xs'
                  : 'text-espresso-600'
              }`}
            >
              List View
            </button>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary btn-sm"
          >
            <Plus size={15} />
            Add Obligation
          </button>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex items-center gap-2">
        <Filter size={14} className="text-warmgray-400" />
        {['all', 'academic', 'professional', 'personal'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1 rounded-subtle text-caption font-medium transition-colors ${
              filterCategory === cat
                ? 'bg-espresso-800 text-white'
                : 'bg-ivory-200 text-espresso-600 hover:bg-ivory-300'
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Timeline View */}
      {viewMode === 'timeline' ? (
        <div className="relative border-l-2 border-ivory-400/80 ml-4 pl-6 space-y-8 my-6">
          {filtered.map((item) => {
            const isCompleted = item.status === 'completed';
            return (
              <div key={item.id} className="relative group">
                {/* Node indicator */}
                <div
                  className={`absolute -left-[31px] top-4 w-4 h-4 rounded-full border-2 border-white transition-colors ${
                    isCompleted
                      ? 'bg-warmgray-400'
                      : item.urgency === 'critical'
                      ? 'bg-terracotta-600 ring-4 ring-terracotta-100'
                      : item.urgency === 'high'
                      ? 'bg-amber-500'
                      : 'bg-sage-600'
                  }`}
                />

                <div
                  className={`bg-white border rounded-card p-5 shadow-surface transition-all ${
                    isCompleted
                      ? 'opacity-60 bg-ivory-50 border-ivory-300'
                      : item.urgency === 'critical'
                      ? 'border-terracotta-300'
                      : 'border-ivory-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-ivory-200 pb-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleComplete(item.id, item.status)}
                        className="text-warmgray-400 hover:text-sage-700"
                        title={isCompleted ? 'Mark upcoming' : 'Mark completed'}
                      >
                        <CheckCircle2
                          size={18}
                          className={isCompleted ? 'text-sage-600 fill-sage-100' : ''}
                        />
                      </button>
                      <h3
                        className={`font-heading text-h3 text-espresso-800 ${
                          isCompleted ? 'line-through text-warmgray-500' : ''
                        }`}
                      >
                        {item.title}
                      </h3>
                      <span className="badge badge-warmgray uppercase text-[10px]">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-caption">
                      <span
                        className={`font-semibold ${
                          item.urgency === 'critical'
                            ? 'text-terracotta-700 font-mono'
                            : 'text-espresso-700 font-mono'
                        }`}
                      >
                        {new Date(item.deadline).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="badge badge-terracotta">
                        {getDaysRemaining(item.deadline)}
                      </span>
                      <button
                        onClick={() => handleDeleteObligation(item.id, item.title)}
                        className="p-1 hover:text-terracotta-600 text-warmgray-400 rounded transition-colors ml-1"
                        title="Delete obligation"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <p className="text-body-sm text-espresso-600 mt-3 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-ivory-200 text-caption text-warmgray-500">
                    <div className="flex items-center gap-1.5">
                      <FileText size={13} className="text-sage-600" />
                      <span>Origin:</span>
                      <span className="font-mono text-espresso-700 font-medium">
                        {item.source_document_name}
                      </span>
                    </div>
                    <span>Confidence: {Math.round(item.confidence * 100)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white border border-ivory-300 rounded-card shadow-surface overflow-hidden">
          <table className="w-full text-left border-collapse text-body-sm">
            <thead>
              <tr className="border-b border-ivory-300 bg-ivory-50/70 text-overline text-warmgray-500 uppercase tracking-wider">
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Obligation</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Deadline</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-300/60 text-espresso-800">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-ivory-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleComplete(item.id, item.status)}
                      className="text-warmgray-400 hover:text-sage-700"
                    >
                      <CheckCircle2
                        size={17}
                        className={item.status === 'completed' ? 'text-sage-600 fill-sage-100' : ''}
                      />
                    </button>
                  </td>
                  <td className="py-3.5 px-4 font-medium">
                    <span className={item.status === 'completed' ? 'line-through text-warmgray-400' : ''}>
                      {item.title}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="badge badge-warmgray text-[10px] uppercase">{item.category}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium">
                    {new Date(item.deadline).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-caption text-warmgray-500 font-mono">
                    {item.source_document_name}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDeleteObligation(item.id, item.title)}
                      className="p-1 hover:text-terracotta-600 text-warmgray-400 rounded transition-colors"
                      title="Delete obligation"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Obligation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-espresso-950/30 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-card shadow-overlay max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-ivory-300 pb-3">
              <h3 className="font-heading text-h3 text-espresso-800">Add Manual Obligation</h3>
              <button onClick={() => setShowAddModal(false)} className="text-warmgray-400 hover:text-espresso-700">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddObligation} className="space-y-4">
              <div>
                <label className="text-caption font-semibold text-espresso-700 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Complete Coursework Registration"
                  className="input"
                />
              </div>
              <div>
                <label className="text-caption font-semibold text-espresso-700 block mb-1">Deadline Date</label>
                <input
                  type="date"
                  required
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label className="text-caption font-semibold text-espresso-700 block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="input"
                >
                  <option value="academic">Academic</option>
                  <option value="professional">Professional</option>
                  <option value="personal">Personal</option>
                  <option value="financial">Financial</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-ivory-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Obligation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
