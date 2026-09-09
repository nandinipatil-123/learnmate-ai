import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  PenTool,
  Gamepad2,
  BrainCircuit,
  Target,
  LineChart,
  Settings,
  Sparkles,
  Flame,
  X
} from 'lucide-react';
import { NavPage } from '../types';

interface SidebarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  mobileOpen,
  onCloseMobile,
}) => {
  const navItems: { id: NavPage; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'practice', label: 'Practice', icon: PenTool },
    { id: 'quiz', label: 'Adaptive Quiz', icon: Gamepad2, badge: 'Live' },
    { id: 'analysis', label: 'AI Analysis', icon: BrainCircuit },
    { id: 'study-plan', label: 'Study Plan', icon: Target },
    { id: 'progress', label: 'Progress', icon: LineChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          id="mobile-sidebar-backdrop"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        id="main-sidebar"
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-900 border-r border-slate-800/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {
              onNavigate('dashboard');
              onCloseMobile();
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <span className="text-xl">🧠</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-100 tracking-tight text-lg">LearnMate</span>
                <span className="px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                  Agent
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Adaptive AI Learning</p>
            </div>
          </div>

          <button
            id="sidebar-close-btn"
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 lg:hidden"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Focus Course Badge */}
        <div className="px-4 pt-4 pb-2">
          <div className="px-3 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-medium">Target: DBMS Exam</span>
            </div>
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              4d Streak
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Agent Status Card at Bottom */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-gradient-to-b from-slate-800/80 to-slate-850 border border-slate-700/60">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Adaptive Agent Active</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Monitoring 4 weak spots. Tailoring questions to your 5-day goal.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
