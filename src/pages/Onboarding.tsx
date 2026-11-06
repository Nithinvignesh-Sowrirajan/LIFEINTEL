import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  Shield,
  FileText,
  Activity,
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  FolderOpen,
} from 'lucide-react';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [authorizedFolder, setAuthorizedFolder] = useState('Documents/Academic');
  const navigate = useNavigate();

  const handleFinish = () => {
    localStorage.setItem('lifeintel_onboarding_completed', 'true');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-ivory-100 flex flex-col justify-center items-center p-6 animate-fade-in">
      {/* Container */}
      <div className="max-w-2xl w-full bg-white border border-ivory-300 rounded-card shadow-elevated p-8 sm:p-12 space-y-8">
        {/* Step Progress Dots */}
        <div className="flex items-center justify-between border-b border-ivory-200 pb-4">
          <div className="flex items-center gap-2">
            <span className="font-heading text-h3 text-sage-600">LIFE</span>
            <span className="font-heading text-h3 text-espresso-800">INTEL</span>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  step === i
                    ? 'bg-sage-600 w-6'
                    : step > i
                    ? 'bg-sage-300'
                    : 'bg-ivory-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: WELCOME */}
        {step === 1 && (
          <div className="space-y-6 text-center animate-fade-in py-4">
            <div className="w-16 h-16 rounded-full bg-sage-50 border border-sage-200 flex items-center justify-center mx-auto text-sage-600">
              <Brain size={32} />
            </div>
            <div className="space-y-2">
              <h1 className="font-heading text-display text-espresso-800">
                Understand Everything.
                <br />
                Anticipate What Matters.
              </h1>
              <p className="text-body text-espresso-600 max-w-md mx-auto leading-relaxed">
                Welcome to <strong>LIFEINTEL</strong> — your universal personal intelligence system. An intelligent layer between you and everyday information scattered across documents, notices, and emails.
              </p>
            </div>
            <div className="pt-4">
              <button onClick={() => setStep(2)} className="btn btn-primary btn-lg">
                <span>Begin Orientation</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: HOW IT WORKS */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <span className="badge badge-sage">Cognitive Architecture</span>
              <h2 className="font-heading text-h2 text-espresso-800">How LIFEINTEL Thinks</h2>
              <p className="text-body-sm text-espresso-600">
                Unlike normal chatbots or static dashboards, LIFEINTEL operates as an autonomous reasoner:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-ivory-50 border border-ivory-300 rounded-subtle space-y-1.5">
                <div className="flex items-center gap-2 text-sage-700 font-semibold text-body-sm">
                  <FileText size={16} />
                  <span>1. Understands Context</span>
                </div>
                <p className="text-caption text-espresso-600">
                  Extracts dates, fees, prerequisites, and commitments from PDFs, Word docs, and receipts.
                </p>
              </div>

              <div className="p-4 bg-ivory-50 border border-ivory-300 rounded-subtle space-y-1.5">
                <div className="flex items-center gap-2 text-sage-700 font-semibold text-body-sm">
                  <Activity size={16} />
                  <span>2. Connects Information</span>
                </div>
                <p className="text-caption text-espresso-600">
                  Links notices to your resume drafts, assignments, and calendar appointments.
                </p>
              </div>

              <div className="p-4 bg-ivory-50 border border-ivory-300 rounded-subtle space-y-1.5">
                <div className="flex items-center gap-2 text-terracotta-700 font-semibold text-body-sm">
                  <Sparkles size={16} />
                  <span>3. Detects Meaningful Shifts</span>
                </div>
                <p className="text-caption text-espresso-600">
                  Spots when a deadline moves forward, an amount changes, or a condition is altered.
                </p>
              </div>

              <div className="p-4 bg-ivory-50 border border-ivory-300 rounded-subtle space-y-1.5">
                <div className="flex items-center gap-2 text-espresso-800 font-semibold text-body-sm">
                  <CheckCircle2 size={16} />
                  <span>4. Consequence Reasoning</span>
                </div>
                <p className="text-caption text-espresso-600">
                  Warns you if an updated deadline renders your current timeline obsolete.
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-ivory-200">
              <button onClick={() => setStep(1)} className="btn btn-ghost text-espresso-600">
                Back
              </button>
              <button onClick={() => setStep(3)} className="btn btn-primary">
                Next: Privacy Guarantee
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PRIVACY & AIR-GAP GUARANTEE */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <span className="badge badge-sage">Non-Negotiable</span>
              <h2 className="font-heading text-h2 text-espresso-800">Your Privacy is Sovereign</h2>
              <p className="text-body-sm text-espresso-600">
                LIFEINTEL processes personal documents. Our foundational contract guarantees:
              </p>
            </div>

            <div className="space-y-3 bg-ivory-50 p-4 rounded-card border border-ivory-300 text-body-sm text-espresso-800">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-sage-600 flex-shrink-0 mt-0.5" />
                <span><strong>100% Local Processing:</strong> Models run on your PC. No cloud transmissions.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-sage-600 flex-shrink-0 mt-0.5" />
                <span><strong>Zero Unapproved Directory Scans:</strong> Watches only explicitly authorized folders.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-sage-600 flex-shrink-0 mt-0.5" />
                <span><strong>Never Silently Listens:</strong> No microphone, webcam, or background clipboard polling.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-sage-600 flex-shrink-0 mt-0.5" />
                <span><strong>Permanent Purge:</strong> One click deletes all SQLite tables, derived facts, and vectors.</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-ivory-200">
              <button onClick={() => setStep(2)} className="btn btn-ghost text-espresso-600">
                Back
              </button>
              <button onClick={() => setStep(4)} className="btn btn-primary">
                I Understand & Agree
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: FIRST SOURCE SELECTION */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <span className="badge badge-sage">Final Setup</span>
              <h2 className="font-heading text-h2 text-espresso-800">Authorize Initial Source</h2>
              <p className="text-body-sm text-espresso-600">
                Confirm which folder LIFEINTEL should monitor for academic documents, syllabus notices, and commitments:
              </p>
            </div>

            <div className="p-4 bg-white border border-ivory-300 rounded-subtle space-y-3">
              <label className="text-caption font-semibold text-espresso-700 block">
                Approved Monitored Directory
              </label>
              <div className="flex items-center gap-2 p-2.5 bg-ivory-100 rounded-subtle border border-ivory-300">
                <FolderOpen size={18} className="text-sage-600 flex-shrink-0" />
                <span className="font-mono text-body-sm text-espresso-800">
                  C:/Users/User/{authorizedFolder}
                </span>
              </div>
              <p className="text-caption text-warmgray-500">
                LIFEINTEL will index PDF notices, DOCX drafts, and deadline schedules in this directory.
              </p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-ivory-200">
              <button onClick={() => setStep(3)} className="btn btn-ghost text-espresso-600">
                Back
              </button>
              <button onClick={handleFinish} className="btn btn-primary btn-lg">
                Enter Command Center
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
