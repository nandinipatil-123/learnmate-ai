import React from 'react';
import {
  LineChart,
  Flame,
  Target,
  Award,
  TrendingUp,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { LEARNING_PROFILE_TOPICS } from '../data/mockData';

export const ProgressPage: React.FC = () => {
  const syllabusModules = [
    { name: 'Module 1: Relational Model & SQL Fundamentals', progress: 95, hours: 8.2 },
    { name: 'Module 2: Advanced SQL & Complex Queries', progress: 88, hours: 7.5 },
    { name: 'Module 3: ER Diagrams & Schema Mapping', progress: 90, hours: 6.0 },
    { name: 'Module 4: Functional Dependencies & Normalization', progress: 38, hours: 4.1 },
    { name: 'Module 5: Transaction Management & Concurrency', progress: 65, hours: 5.4 },
    { name: 'Module 6: Indexing, B+ Trees & File Storage', progress: 50, hours: 3.8 },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
            <LineChart className="w-4 h-4" />
            <span>Mastery Diagnostics</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">
            Learning Progress & Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Continuous evaluation of your retention and topic-level mastery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300">
            Current Grade Estimate: <span className="font-bold text-emerald-400">A- (86%)</span>
          </div>
        </div>
      </div>

      {/* Highlights Grid: Accuracy, Streak, Overall */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Streak */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>Learning Streak</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-100">4 Days</span>
            <span className="text-xs text-amber-400 font-bold">🔥 On Fire</span>
          </div>
          {/* Day dots */}
          <div className="flex items-center gap-1.5 pt-1">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
              const isActive = idx < 4;
              return (
                <div key={day} className="flex-1 text-center">
                  <div
                    className={`h-2 rounded-full mb-1 ${
                      isActive ? 'bg-amber-400' : 'bg-slate-850'
                    }`}
                  />
                  <span className="text-[10px] text-slate-500">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Accuracy */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>Overall Accuracy</span>
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-100">78.4%</span>
            <span className="text-xs text-emerald-400 font-medium">+5% vs avg</span>
          </div>
          <p className="text-xs text-slate-400">
            Highest accuracy in Relational Algebra (94%)
          </p>
        </div>

        {/* Total Time */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>Study Velocity</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-100">35.0 hrs</span>
            <span className="text-xs text-indigo-300 font-medium">Logged</span>
          </div>
          <p className="text-xs text-slate-400">
            Average 2.8 hours per session
          </p>
        </div>
      </div>

      {/* Progress Bars Section */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-100">
            DBMS Syllabus Progress Bars
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            Overall Completion: 72%
          </span>
        </div>

        <div className="space-y-4">
          {syllabusModules.map((mod, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">
                  {mod.name}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">{mod.hours} hrs</span>
                  <span className="font-bold text-cyan-400 w-10 text-right">
                    {mod.progress}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    mod.progress >= 80
                      ? 'bg-emerald-400'
                      : mod.progress >= 60
                      ? 'bg-cyan-400'
                      : mod.progress >= 40
                      ? 'bg-amber-400'
                      : 'bg-rose-400'
                  }`}
                  style={{ width: `${mod.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Topic Mastery Grid */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-100">
            Topic Mastery Matrix
          </h3>
          <span className="text-xs text-slate-400">
            Status based on adaptive quizzes
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {LEARNING_PROFILE_TOPICS.map((topic) => (
            <div
              key={topic.id}
              className="p-4 rounded-xl bg-slate-850 border border-slate-750 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400">{topic.category}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      topic.status === 'Strong'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : topic.status === 'Average'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}
                  >
                    {topic.status}
                  </span>
                </div>
                <div className="text-base font-bold text-slate-100 mt-1">
                  {topic.name}
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Mastery</span>
                <span className="font-bold text-slate-200">{topic.score}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
