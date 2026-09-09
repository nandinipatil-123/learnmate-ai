/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NavPage } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardPage } from './pages/DashboardPage';
import { LearnPage } from './pages/LearnPage';
import { PracticePage } from './pages/PracticePage';
import { AdaptiveQuizPage } from './pages/AdaptiveQuizPage';
import { AIAnalysisPage } from './pages/AIAnalysisPage';
import { StudyPlanPage } from './pages/StudyPlanPage';
import { ProgressPage } from './pages/ProgressPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavPage>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage} />;
      case 'learn':
        return <LearnPage />;
      case 'practice':
        return <PracticePage />;
      case 'quiz':
        return <AdaptiveQuizPage />;
      case 'analysis':
        return <AIAnalysisPage onNavigate={setCurrentPage} />;
      case 'study-plan':
        return <StudyPlanPage onNavigate={setCurrentPage} />;
      case 'progress':
        return <ProgressPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Persistent Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen w-full">
        {/* Top Header */}
        <Header
          currentPage={currentPage}
          onOpenMobile={() => setMobileSidebarOpen(true)}
          onQuickTeach={() => setCurrentPage('learn')}
        />

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
}
