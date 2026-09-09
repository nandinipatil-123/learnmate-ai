import React from 'react';
import {
  BrainCircuit,
  Target,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { NavPage } from '../types';

interface AIAnalysisPageProps {
  onNavigate: (page: NavPage) => void;
}

export const AIAnalysisPage: React.FC<AIAnalysisPageProps> = ({ onNavigate }) => {
  const topicsMastered = [
    { name: 'SQL Joins & Aggregations', score: 94, status: 'Mastered' },
    { name: 'Entity-Relationship Diagrams', score: 90, status: 'Mastered' },
    { name: 'Relational Algebra (σ, π, ⋈)', score: 86, status: 'Mastered' },
    { name: 'Basic File Structures & Records', score: 84, status: 'Mastered' },
  ];

  const topicsNeedingAttention = [
    {
      name: 'Normalization & 2NF Decompositions',
      score: 38,
      urgency: 'Critical Priority',
      action: 'Learn 2NF',
      note: 'Struggles with identifying partial functional dependencies on composite primary keys.'
    },
    {
      name: 'Conflict & View Serializability',
      score: 58,
      urgency: 'Moderate Priority',
      action: 'Practice Graph Method',
      note: 'Precedence graph cycle detection needs 2-3 additional review exercises.'
    },
    {
      name: 'B+ Tree Splitting & Insertion',
      score: 62,
      urgency: 'Review Needed',
      action: 'Visual Walkthrough',
      note: 'Root overflow node propagation needs reinforcement.'
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
            <BrainCircuit className="w-4 h-4" />
            <span>AI Diagnostic Engine</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">
            Cognitive Competency Analysis
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Synthesized across 68 questions, quiz runs, and practice attempts over the last 4 days.
          </p>
        </div>

        <button
          onClick={() => onNavigate('learn')}
          className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Generate Focus Drill</span>
        </button>
      </div>

      {/* Core Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Accuracy */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>Accuracy</span>
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-100">
            78.4%
          </div>
          <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+4.2% this week</span>
          </div>
        </div>

        {/* Questions Attempted */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>Questions Attempted</span>
            <Award className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-100">
            68
          </div>
          <div className="text-xs text-slate-400">
            Across 6 DBMS modules
          </div>
        </div>

        {/* Topics Mastered Count */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>Topics Mastered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">
            4 / 7
          </div>
          <div className="text-xs text-slate-400">
            57% syllabus completion
          </div>
        </div>

        {/* Topics Needing Attention Count */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>Needing Attention</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-rose-400">
            3 Topics
          </div>
          <div className="text-xs text-rose-300 font-medium">
            1 Critical (Normalization)
          </div>
        </div>
      </div>

      {/* Topics Mastered vs Needing Attention Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topics Mastered */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-slate-100 text-base">
                Topics Mastered
              </h3>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-medium">
              High Confidence
            </span>
          </div>

          <div className="space-y-3">
            {topicsMastered.map((topic, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-sm text-slate-200">
                    {topic.name}
                  </div>
                  <div className="text-xs text-emerald-400 font-medium">
                    Verified across multiple test runs
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-emerald-400">
                    {topic.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Topics Needing Attention */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <h3 className="font-bold text-slate-100 text-base">
                Topics Needing Attention
              </h3>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800/60 font-medium">
              Priority Fix
            </span>
          </div>

          <div className="space-y-3">
            {topicsNeedingAttention.map((topic, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-850 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-slate-200">
                    {topic.name}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      topic.urgency.includes('Critical')
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {topic.urgency}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {topic.note}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-400 font-mono">
                    Mastery: {topic.score}%
                  </span>
                  <button
                    onClick={() => onNavigate('learn')}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <span>{topic.action}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Recommendation Summary */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/30 to-slate-900 border border-indigo-800/40 space-y-3">
        <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>LearnMate AI Agent Summary & Recommendation</span>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          Your foundational SQL syntax and ER diagram competencies are in the top 10th percentile for standard DBMS syllabi. However, <strong>42% of exam marks</strong> in your upcoming test depend on schema normalization and transaction serializability. Spending 45 minutes on 2NF decomposition today will boost your estimated exam score from <strong>76% to 88%</strong>.
        </p>
      </div>
    </div>
  );
};
