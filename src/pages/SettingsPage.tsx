import React, { useState } from 'react';
import {
  Settings,
  User,
  Sliders,
  Bell,
  Sparkles,
  Check,
  Zap,
  BookOpen,
  GraduationCap
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [name, setName] = useState('Nandini Patil');
  const [email, setEmail] = useState('nandinipatil8008@gmail.com');
  const [course, setCourse] = useState('CS-302: Database Management Systems');
  const [examDate, setExamDate] = useState('2026-05-14');
  const [explanationStyle, setExplanationStyle] = useState<'analogy' | 'academic' | 'practical'>('analogy');
  const [pace, setPace] = useState<'aggressive' | 'balanced' | 'deep'>('aggressive');
  const [autoAdapt, setAutoAdapt] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
            <Settings className="w-4 h-4" />
            <span>Configuration</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">
            Profile & Learning Preferences
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure how the LearnMate AI Agent customizes explanations, pacing, and exam tracking.
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-950 border border-emerald-800 text-xs font-semibold text-emerald-400">
            <Check className="w-3.5 h-3.5" />
            <span>Preferences Saved</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Profile Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-100 border-b border-slate-800 pb-3">
            <User className="w-4 h-4 text-cyan-400" />
            <span>Student Profile</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="settings-name" className="text-xs font-medium text-slate-300">
                Full Name
              </label>
              <input
                id="settings-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-200 text-sm outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="settings-email" className="text-xs font-medium text-slate-300">
                Email
              </label>
              <input
                id="settings-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-200 text-sm outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="settings-course" className="text-xs font-medium text-slate-300">
                Primary Course / Syllabus
              </label>
              <input
                id="settings-course"
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-200 text-sm outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="settings-exam-date" className="text-xs font-medium text-slate-300">
                Exam Date Target
              </label>
              <input
                id="settings-exam-date"
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-200 text-sm outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Learning Preferences UI */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-100 border-b border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Agent Cognitive Preferences</span>
          </div>

          {/* Explanation Style */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Default Explanation Style
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'analogy',
                  label: 'Real-World & Analogy-First',
                  desc: 'Uses everyday relatable stories, visual metaphors, and intuitive examples.'
                },
                {
                  id: 'academic',
                  label: 'Academic & Rigorous',
                  desc: 'Focuses on formal relational calculus, mathematical proofs, and textbooks.'
                },
                {
                  id: 'practical',
                  label: 'Code & Hands-on SQL',
                  desc: 'Emphasizes practical SQL schemas, DDL scripts, and execution plans.'
                }
              ].map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setExplanationStyle(style.id as any)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    explanationStyle === style.id
                      ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-xs text-slate-200 mb-1">
                    {style.label}
                  </div>
                  <div className="text-[11px] text-slate-400 leading-relaxed">
                    {style.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Learning Pace */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Exam Countdown Pace
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'aggressive',
                  label: '5-Day Intensive Sprint',
                  desc: 'Concentrated high-yield focus on weak spots and exam probability.'
                },
                {
                  id: 'balanced',
                  label: 'Balanced Review (2 Weeks)',
                  desc: 'Even distribution across all 6 DBMS modules.'
                },
                {
                  id: 'deep',
                  label: 'Deep Academic Mastery (1 Month)',
                  desc: 'Includes deep-dive research papers, advanced indexing, and query engines.'
                }
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPace(p.id as any)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    pace === p.id
                      ? 'bg-indigo-500/10 border-indigo-500 text-indigo-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-xs text-slate-200 mb-1">
                    {p.label}
                  </div>
                  <div className="text-[11px] text-slate-400 leading-relaxed">
                    {p.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Adaptive Auto-Tuning Toggle */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-sm font-semibold text-slate-200 block">
                Automatic Quiz Difficulty Recalibration
              </span>
              <span className="text-xs text-slate-400 block">
                Dynamically increase question difficulty when answering two consecutive questions correctly.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setAutoAdapt(!autoAdapt)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                autoAdapt ? 'bg-cyan-500' : 'bg-slate-750'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-slate-950 transition-transform absolute top-0.5 ${
                  autoAdapt ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            id="save-settings-btn"
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
