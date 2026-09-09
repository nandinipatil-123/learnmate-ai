import React from 'react';
import {
  TrendingUp,
  Calendar,
  CheckCircle2,
  Flame,
  Brain,
  ArrowRight,
  Sparkles,
  BookOpen,
  AlertCircle,
  Clock,
  ChevronRight,
  ShieldAlert,
  Play
} from 'lucide-react';
import { NavPage } from '../types';
import { LEARNING_PROFILE_TOPICS } from '../data/mockData';

interface DashboardPageProps {
  onNavigate: (page: NavPage) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 relative overflow-hidden shadow-sm">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/50 text-cyan-400 text-xs font-medium">
              <Sparkles className="w-3 h-3" />
              <span>Adaptive Agent Initialized</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Good evening 👋
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-medium">
              Let’s make your DBMS exam easier.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="dashboard-resume-btn"
              onClick={() => onNavigate('learn')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-slate-950 font-semibold text-sm flex items-center gap-2 shadow-sm shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Resume Learning</span>
            </button>
            <button
              id="dashboard-quiz-btn"
              onClick={() => onNavigate('quiz')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <span>Daily Adaptive Quiz</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Progress: 72% */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700/80 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Overall Progress
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-100 mb-1">
              72%
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full rounded-full" style={{ width: '72%' }} />
            </div>
          </div>
        </div>

        {/* Exam Countdown: 5 Days */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700/80 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Exam Countdown
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-100 mb-1">
              5 Days
            </div>
            <p className="text-xs text-indigo-300 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              May 14, 2026 • Finals
            </p>
          </div>
        </div>

        {/* Questions Completed: 24 */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700/80 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Questions Completed
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-100 mb-1">
              24
            </div>
            <p className="text-xs text-emerald-400 font-medium">
              +8 since yesterday
            </p>
          </div>
        </div>

        {/* Learning Streak: 4 Days */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700/80 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Learning Streak
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-100 mb-1 flex items-center gap-2">
              <span>4 Days</span>
              <span className="text-lg">🔥</span>
            </div>
            <p className="text-xs text-amber-300 font-medium">
              Target: 7-day streak
            </p>
          </div>
        </div>
      </div>

      {/* Main Split: Learning Profile & Key Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Learning Profile (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Learning Profile Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <span>Learning Profile</span>
                  <span className="text-xs font-normal text-slate-400">
                    (Real-time Cognitive Mastery)
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Calibrated across quizzes, practice sets, and review sessions.
                </p>
              </div>
              <button
                onClick={() => onNavigate('analysis')}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
              >
                <span>Full Analysis</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Topics List */}
            <div className="space-y-3.5">
              {LEARNING_PROFILE_TOPICS.map((topic) => {
                const isStrong = topic.status === 'Strong';
                const isAvg = topic.status === 'Average';
                const isWeak = topic.status === 'Weak';

                return (
                  <div
                    key={topic.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isWeak
                        ? 'bg-rose-950/15 border-rose-800/40 hover:border-rose-700/60'
                        : isAvg
                        ? 'bg-amber-950/15 border-amber-800/40 hover:border-amber-700/60'
                        : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isStrong
                              ? 'bg-emerald-400'
                              : isAvg
                              ? 'bg-amber-400'
                              : 'bg-rose-400'
                          }`}
                        />
                        <div>
                          <span className="font-semibold text-slate-200 text-sm">
                            {topic.name}
                          </span>
                          <span className="text-[11px] text-slate-500 ml-2">
                            • {topic.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            isStrong
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : isAvg
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {topic.status}
                        </span>
                        <span className="text-xs font-semibold text-slate-400 w-9 text-right">
                          {topic.score}%
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isStrong
                            ? 'bg-emerald-400'
                            : isAvg
                            ? 'bg-amber-400'
                            : 'bg-rose-400'
                        }`}
                        style={{ width: `${topic.score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Insight Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-cyan-950/40 border border-cyan-800/40 relative overflow-hidden shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                <Brain className="w-5 h-5" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                      AI Insight
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                      High Impact
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">Updated today</span>
                </div>
                <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
                  “Normalization is currently your weakest topic. Focus on Functional Dependencies and 2NF before moving to advanced questions.”
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    id="insight-start-normalization-btn"
                    onClick={() => onNavigate('learn')}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-300 hover:text-cyan-200 bg-cyan-900/40 hover:bg-cyan-900/60 px-3 py-1.5 rounded-lg border border-cyan-700/50 transition-colors"
                  >
                    <span>Start Normalization Breakdown</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onNavigate('practice')}
                    className="text-xs font-medium text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Practice 2NF Questions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Continue Learning & Action Cards */}
        <div className="space-y-6">
          {/* Continue Learning Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                Continue Learning
              </span>
              <span className="text-xs font-medium text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50">
                Weak Priority
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-100">
                Database Normalization
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Module 3 • Schema Refinement & Lossless Joins
              </p>
            </div>

            {/* Progress: 38% */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Progress</span>
                <span className="font-semibold text-slate-200">38%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-400 h-full rounded-full" style={{ width: '38%' }} />
              </div>
            </div>

            {/* Next: Understand 2NF */}
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">
                Next Up
              </div>
              <div className="text-sm font-semibold text-slate-200 flex items-center justify-between">
                <span>Understand 2NF</span>
                <span className="text-xs text-cyan-400 font-normal">~8 mins</span>
              </div>
            </div>

            <button
              id="dashboard-continue-learning-btn"
              onClick={() => onNavigate('learn')}
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <span>Resume Topic</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Study Plan Snapshot */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Today's Goal (Day 3 of 5)
              </span>
              <button
                onClick={() => onNavigate('study-plan')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Plan View
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
              <div className="text-xs font-semibold text-slate-200">
                Functional Dependencies & 2NF/3NF
              </div>
              <p className="text-[11px] text-slate-400">
                Complete 1 interactive lesson & 5 adaptive quiz questions.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Est. 45 mins remaining</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('study-plan')}
              className="w-full py-2 px-3 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-medium text-center transition-colors"
            >
              View Complete 5-Day Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
