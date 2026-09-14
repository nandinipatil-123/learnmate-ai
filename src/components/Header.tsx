import React from 'react';
import { Menu, Bell, BookMarked, Sparkles } from 'lucide-react';
import { NavPage } from '../types';

interface HeaderProps {
  currentPage: NavPage;
  onOpenMobile: () => void;
  onQuickTeach?: () => void;
}

const PAGE_TITLES: Record<NavPage, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Overview of your DBMS exam readiness' },
  learn: { title: 'Learn with AI Agent', subtitle: 'Adaptive multi-layered topic breakdowns' },
  practice: { title: 'Practice Sandbox', subtitle: 'Solve real exam scenarios with step-by-step guidance' },
  'sql-lab': { title: 'SQL Practice Lab', subtitle: 'Interactive in-browser SQL query execution & auto-evaluator' },
  quiz: { title: 'DBMS Unit-Wise Quiz', subtitle: '50 targeted exam MCQs organized across all 5 DBMS units' },
  analysis: { title: 'AI Cognitive Analysis', subtitle: 'Real-time diagnostic on concepts, accuracy & velocity' },
  'study-plan': { title: '5-Day Study Plan', subtitle: 'Structured timeline leading to exam day' },
  progress: { title: 'Learning Progress & Mastery', subtitle: 'Granular topic proficiency tracking' },
  settings: { title: 'Preferences & Settings', subtitle: 'Agent behavior, study pacing and notification rules' },
  posters: { title: 'Poster Learning', subtitle: 'Visual summary posters for every DBMS syllabus topic' },
};

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onOpenMobile,
  onQuickTeach,
}) => {
  const current = PAGE_TITLES[currentPage] || { title: 'LearnMate', subtitle: '' };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          id="mobile-menu-open-btn"
          onClick={onOpenMobile}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 lg:hidden border border-slate-700/60"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <span>{current.title}</span>
          </h1>
          <p className="text-xs text-slate-400 hidden sm:block">
            {current.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        {onQuickTeach && currentPage !== 'learn' && (
          <button
            onClick={onQuickTeach}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-medium transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Agent</span>
          </button>
        )}

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
          <BookMarked className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-slate-200">CS-302 DBMS</span>
        </div>

        <button
          id="notifications-btn"
          aria-label="Notifications"
          className="relative p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/50 transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-slate-900" />
        </button>

        <div className="flex items-center gap-2.5 pl-1.5 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[1.5px]">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-cyan-300">
              NP
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
