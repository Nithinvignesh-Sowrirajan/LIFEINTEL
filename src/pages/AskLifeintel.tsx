import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  FileText,
  ShieldCheck,
  Clock,
  Compass,
  AlertTriangle,
  HelpCircle,
  Copy,
  Check,
  Send,
} from 'lucide-react';
import api from '@/lib/api';

interface Message {
  id: string;
  sender: 'user' | 'lifeintel';
  text: string;
  sources?: string[];
  confidence?: number;
  timestamp: string;
}

const SUGGESTIONS = [
  'What deadlines are approaching?',
  'What changed this week?',
  'Find everything about my internship',
  'Do I have any conflicting commitments?',
  'What should I prioritize today?',
  'What am I forgetting?',
];

export default function AskLifeintel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-welcome',
      sender: 'lifeintel',
      text: "I am ready. I reason across your authorized local documents, notes, and commitments to identify deadlines, hidden obligations, and consequences. What would you like to know?",
      timestamp: 'Just now',
    },
  ]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const qParam = searchParams.get('q');
    if (qParam && qParam.trim()) {
      handleSubmit(qParam.trim());
      setSearchParams({});
    }
  }, [searchParams]);

  const handleSubmit = async (queryText?: string) => {
    const q = (queryText || inputQuery).trim();
    if (!q || loading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await api.askQuestion(q);
      if (res.success && res.data) {
        const intelMsg: Message = {
          id: `li-${Date.now()}`,
          sender: 'lifeintel',
          text: res.data.answer,
          sources: res.data.sources,
          confidence: res.data.confidence,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, intelMsg]);
      } else {
        const errorMsg: Message = {
          id: `li-err-${Date.now()}`,
          sender: 'lifeintel',
          text: "I couldn't process this query against the local knowledge base. Please check backend connection.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (e) {
      const errorMsg: Message = {
        id: `li-err-${Date.now()}`,
        sender: 'lifeintel',
        text: "Error communicating with local intelligence engine.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
    setLoading(false);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 border-b border-ivory-400/40 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-sage-50 border border-sage-200/80 rounded-full text-caption font-medium text-sage-800">
          <ShieldCheck size={14} className="text-sage-600" />
          <span>Local Contextual Reasoner — Zero Hallucinations</span>
        </div>
        <h1 className="font-heading text-display text-espresso-800">Ask LIFEINTEL</h1>
        <p className="text-body text-espresso-500 max-w-xl mx-auto">
          Query your life’s information. Cross-references documents, detects shifts, and highlights real obligations.
        </p>
      </div>

      {/* Suggested Query Chips */}
      <div className="space-y-2">
        <p className="text-overline text-warmgray-500 uppercase tracking-wider text-center">
          Inquire About Your Current Obligations & Changes
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {SUGGESTIONS.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputQuery(chip);
                handleSubmit(chip);
              }}
              className="px-3.5 py-1.5 bg-white hover:bg-ivory-200 border border-ivory-300 rounded-subtle text-caption text-espresso-700 hover:text-espresso-900 transition-colors shadow-xs"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation Thread */}
      <div className="space-y-4 min-h-[340px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-2xl rounded-card p-5 shadow-surface transition-all ${
                msg.sender === 'user'
                  ? 'bg-espresso-800 text-ivory-50'
                  : 'bg-white border border-ivory-300 text-espresso-800'
              }`}
            >
              {/* Header inside message */}
              <div className="flex items-center justify-between gap-4 mb-2">
                <span
                  className={`text-caption font-semibold ${
                    msg.sender === 'user' ? 'text-ivory-300' : 'text-sage-700'
                  }`}
                >
                  {msg.sender === 'user' ? 'You' : 'LIFEINTEL Context Engine'}
                </span>
                <span
                  className={`text-[11px] ${
                    msg.sender === 'user' ? 'text-ivory-400' : 'text-warmgray-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {/* Body */}
              <div className="text-body-sm whitespace-pre-line leading-relaxed">
                {msg.text}
              </div>

              {/* Grounded Sources & Actions for LIFEINTEL messages */}
              {msg.sender === 'lifeintel' && (
                <div className="mt-4 pt-3 border-t border-ivory-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="flex items-center gap-1.5 text-caption text-warmgray-500">
                        <FileText size={13} className="text-sage-600" />
                        <span>Sources:</span>
                        {msg.sources.map((s, idx) => (
                          <span
                            key={idx}
                            className="bg-ivory-200 text-espresso-700 px-2 py-0.5 rounded text-[11px] font-mono font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                    {msg.confidence && (
                      <span className="badge badge-sage text-[10px]">
                        {Math.round(msg.confidence * 100)}% Confidence
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => copyToClipboard(msg.text, msg.id)}
                    className="text-warmgray-400 hover:text-espresso-700 text-caption flex items-center gap-1"
                    title="Copy briefing"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check size={12} className="text-sage-600" />
                        <span className="text-sage-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 p-4 bg-white/70 border border-ivory-300 rounded-card max-w-sm">
            <div className="w-2 h-2 rounded-full bg-sage-600 animate-ping" />
            <span className="text-caption text-espresso-600 font-medium">
              Reasoning across local documents & temporal links...
            </span>
          </div>
        )}
      </div>

      {/* Query Input Box */}
      <div className="sticky bottom-6 bg-ivory-100 pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about a deadline, obligation, change, or connected topic..."
            className="input pr-24 py-3 text-body bg-white shadow-elevated border-ivory-400 focus:border-sage-600"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="absolute right-2 btn btn-primary btn-sm"
          >
            <Send size={14} />
            Ask
          </button>
        </form>
        <p className="text-center text-caption text-warmgray-400 mt-2">
          LIFEINTEL synthesizes verified stored documents only. Never transmits to external LLM servers without approval.
        </p>
      </div>
    </div>
  );
}
