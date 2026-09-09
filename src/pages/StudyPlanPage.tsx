import React, { useState } from 'react';
import {
  Target,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { DBMS_STUDY_PLAN } from '../data/mockData';
import { NavPage } from '../types';

interface StudyPlanPageProps {
  onNavigate: (page: NavPage) => void;
}

export const StudyPlanPage: React.FC<StudyPlanPageProps> = ({ onNavigate }) => {
  const [activeDay, setActiveDay] = useState<number>(3);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
            <Target className="w-4 h-4" />
            <span>Structured Path • 5 Days to Finals</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">
            5-Day DBMS Exam Study Plan
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Calibrated daily modules covering 100% of standard university DBMS syllabi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-700/60 text-xs font-bold text-cyan-400">
            Day 3 of 5 • In Progress
          </div>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="space-y-4">
        {DBMS_STUDY_PLAN.map((plan) => {
          const isCompleted = plan.status === 'completed';
          const isInProgress = plan.status === 'in-progress';
          const isSelected = activeDay === plan.day;

          return (
            <div
              key={plan.day}
              className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                isInProgress
                  ? 'bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-cyan-500/40 shadow-sm ring-1 ring-cyan-500/20'
                  : isCompleted
                  ? 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                  : 'bg-slate-900/40 border-slate-850 opacity-80 hover:opacity-100 hover:border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : isInProgress
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <span>D{plan.day}</span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-bold text-slate-100 text-base">
                        Day {plan.day}: {plan.title}
                      </h3>
                      {isInProgress && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500 text-slate-950">
                          Today
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {plan.focus}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:self-center">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {plan.estimatedHours} hrs
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      isCompleted
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                        : isInProgress
                        ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/50'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {plan.status === 'completed'
                      ? 'Completed'
                      : plan.status === 'in-progress'
                      ? 'In Progress'
                      : 'Upcoming'}
                  </span>
                </div>
              </div>

              {/* Day Topics Tags */}
              <div className="pt-2 border-t border-slate-800/60">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Key Focus Deliverables:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {plan.topics.map((topic, tIdx) => (
                    <div
                      key={tIdx}
                      className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                        isCompleted
                          ? 'bg-slate-800/40 text-slate-300 border border-slate-750'
                          : isInProgress
                          ? 'bg-slate-800/80 text-slate-100 border border-slate-700'
                          : 'bg-slate-850/50 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      )}
                      <span className="truncate">{topic}</span>
                    </div>
                  ))}
                </div>

                {isInProgress && (
                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800">
                    <div className="text-xs text-cyan-400 font-medium">
                      Recommended: Master 2NF decompositions before moving to BCNF.
                    </div>
                    <button
                      onClick={() => onNavigate('learn')}
                      className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <span>Study Day 3 Module</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
