import React, { useState, useEffect, useMemo } from 'react';
import {
  Database,
  TrendingUp,
  Brain,
  ArrowRight,
  BookOpen,
  PenTool,
  Award,
  Target,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { NavPage } from '../types';
import {
  loadQuizPerformance,
  UnitPerformanceMap,
  UnitPerformanceRecord,
} from '../data/dbmsQuizQuestions';
import { ALL_DBMS_TOPICS } from '../data/dbmsSyllabus';
import {
  PRACTICE_QUESTIONS,
  loadPracticeAnswers,
  loadLearnedTopics,
} from '../data/practiceQuestions';

interface DashboardPageProps {
  onNavigate: (page: NavPage) => void;
}

interface UnitMeta {
  id: 'unit-1' | 'unit-2' | 'unit-3' | 'unit-4' | 'unit-5';
  title: string;
  shortName: string;
  topicsCount: number;
}

const DBMS_UNITS_META: UnitMeta[] = [
  {
    id: 'unit-1',
    title: 'Unit I – Database Systems & ER Model',
    shortName: 'Unit I: ER Model',
    topicsCount: 14,
  },
  {
    id: 'unit-2',
    title: 'Unit II – Relational Model, Algebra & Calculus',
    shortName: 'Unit II: Relational Algebra',
    topicsCount: 16,
  },
  {
    id: 'unit-3',
    title: 'Unit III – SQL & Normalization',
    shortName: 'Unit III: SQL & Normalization',
    topicsCount: 17,
  },
  {
    id: 'unit-4',
    title: 'Unit IV – Transaction Processing',
    shortName: 'Unit IV: Transactions',
    topicsCount: 4,
  },
  {
    id: 'unit-5',
    title: 'Unit V – Concurrency Control & Disk Storage',
    shortName: 'Unit V: Concurrency',
    topicsCount: 6,
  },
];

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  // Real student performance states
  const [quizPerformance, setQuizPerformance] = useState<UnitPerformanceMap>({});
  const [practiceAnswers, setPracticeAnswers] = useState<{ [qId: string]: string }>({});
  const [learnedTopics, setLearnedTopics] = useState<string[]>([]);

  // Load real student activity from localStorage and active session
  useEffect(() => {
    const liveQuiz = loadQuizPerformance();
    setQuizPerformance(liveQuiz);

    const livePractice = loadPracticeAnswers();
    setPracticeAnswers(livePractice);

    const liveLearned = loadLearnedTopics();
    setLearnedTopics(liveLearned);

    // Sync active learned topic from server if exists
    let isMounted = true;
    const syncCurrentLearnedTopic = async () => {
      try {
        const res = await fetch('/api/current-learned-topic');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data?.topicTitle) {
            setLearnedTopics((prev) =>
              prev.includes(data.topicTitle) ? prev : [...prev, data.topicTitle]
            );
          }
        }
      } catch (err) {
        console.warn('Could not sync current topic:', err);
      }
    };

    syncCurrentLearnedTopic();
    return () => {
      isMounted = false;
    };
  }, []);

  // 1. Real Quiz Questions Attempted
  const quizQuestionsAttempted = useMemo(() => {
    const records = Object.values(quizPerformance) as (UnitPerformanceRecord | undefined)[];
    return records.reduce<number>(
      (acc, r) => acc + (r?.totalQuestionsAnswered || 0),
      0
    );
  }, [quizPerformance]);

  // 2. Real Practice Questions Attempted
  const practiceQuestionsAttempted = useMemo(() => {
    return Object.values(practiceAnswers).filter(
      (ans) => typeof ans === 'string' && ans.trim().length > 0
    ).length;
  }, [practiceAnswers]);

  // 3. Real Learn Progress
  const totalSyllabusTopics = ALL_DBMS_TOPICS.length; // 57 topics
  const learnedCount = learnedTopics.length;
  const learnProgressPercentage = Math.min(
    100,
    Math.round((learnedCount / totalSyllabusTopics) * 100)
  );

  // 4. Unit-level Real Progress Calculation
  const unitCardsData = useMemo(() => {
    return DBMS_UNITS_META.map((unit) => {
      const quizRecord = quizPerformance[unit.id];
      const quizBestScore = quizRecord && quizRecord.attempts > 0 ? quizRecord.bestScore : 0;
      const quizPct = Math.min(100, Math.round((quizBestScore / 10) * 100));

      // Practice count for this unit
      const practiceAttemptedInUnit = PRACTICE_QUESTIONS.filter(
        (q) => q.unitId === unit.id && practiceAnswers[q.id]?.trim()?.length > 0
      ).length;
      const practicePct = Math.min(100, Math.round((practiceAttemptedInUnit / 10) * 100));

      // Learn count for this unit
      const learnedInUnit = ALL_DBMS_TOPICS.filter(
        (t) => t.unitId === unit.id && learnedTopics.some((lt) => lt.toLowerCase().includes(t.name.toLowerCase()))
      ).length;
      const learnPct = Math.min(100, Math.round((learnedInUnit / unit.topicsCount) * 100));

      const hasActivity =
        (quizRecord && quizRecord.attempts > 0) ||
        practiceAttemptedInUnit > 0 ||
        learnedInUnit > 0;

      let percentage = 0;
      if (hasActivity) {
        percentage = Math.min(
          100,
          Math.max(1, Math.round(quizPct * 0.45 + practicePct * 0.35 + learnPct * 0.2))
        );
      }

      return {
        ...unit,
        percentage,
        quizScore: quizBestScore,
        practiceAttempted: practiceAttemptedInUnit,
        learnedCount: learnedInUnit,
        hasActivity,
      };
    });
  }, [quizPerformance, practiceAnswers, learnedTopics]);

  // Overall DBMS Progress: Average of real unit percentages
  const overallProgress = useMemo(() => {
    const sum = unitCardsData.reduce((acc, u) => acc + u.percentage, 0);
    return Math.round(sum / unitCardsData.length);
  }, [unitCardsData]);

  // Check if any real student performance data exists
  const hasStudentData = useMemo(() => {
    return (
      quizQuestionsAttempted > 0 ||
      practiceQuestionsAttempted > 0 ||
      learnedCount > 0
    );
  }, [quizQuestionsAttempted, practiceQuestionsAttempted, learnedCount]);

  // AI Insight Recommendation based on real performance
  const aiInsight = useMemo(() => {
    if (!hasStudentData) {
      return null;
    }

    // Find the unit with lowest progress or lowest quiz score
    const sorted = [...unitCardsData].sort((a, b) => {
      // Prioritize units that have been touched but have lower scores
      if (a.hasActivity && !b.hasActivity) return -1;
      if (!a.hasActivity && b.hasActivity) return 1;
      return a.percentage - b.percentage;
    });

    const targetUnit = sorted[0];

    switch (targetUnit.id) {
      case 'unit-3':
        return {
          topic: 'Unit III – BCNF Decomposition & Lossless Joins',
          recommendation:
            'Focus on functional dependency closures and 3NF to eliminate update anomalies.',
        };
      case 'unit-4':
        return {
          topic: 'Unit IV – Conflict Serializability & Precedence Graphs',
          recommendation:
            'Review cycle detection in precedence graphs to verify serial schedule equivalence.',
        };
      case 'unit-5':
        return {
          topic: 'Unit V – Two-Phase Locking (2PL) & Deadlocks',
          recommendation:
            'Review growing and shrinking lock phases to avoid concurrency deadlocks.',
        };
      case 'unit-2':
        return {
          topic: 'Unit II – Relational Algebra Division & Joins',
          recommendation:
            'Practice formal query formulations with natural joins and relational division.',
        };
      default:
        return {
          topic: 'Unit I – Conceptual ER Design & Mapping',
          recommendation:
            'Solidify entity relationship mapping rules and multi-valued attribute translation.',
        };
    }
  }, [hasStudentData, unitCardsData]);

  return (
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-5 px-3 sm:px-4 py-3 sm:py-5">
      {/* ---------------------------------------------------------------------
          1. WELCOME SECTION
          --------------------------------------------------------------------- */}
      <div
        id="dashboard-welcome-banner"
        className="p-4 sm:p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            Welcome to LearnMate
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
            Your AI-powered DBMS learning companion
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/50 text-cyan-400 text-xs font-semibold">
            <Database className="w-3.5 h-3.5" />
            <span>DBMS Control Center</span>
          </span>
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          2. OVERALL PROGRESS (4 Compact Real-Data Statistics)
          --------------------------------------------------------------------- */}
      <div id="dashboard-overall-stats-section" className="space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            Overall Progress
          </span>
          <span className="text-[11px] text-slate-500">Real Activity</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {/* Stat 1: Overall DBMS Progress */}
          <div
            id="stat-overall-dbms-progress"
            className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700/80 transition-colors"
          >
            <span className="text-xs font-medium text-slate-400">
              Overall DBMS Progress
            </span>
            <div className="mt-2">
              <div className="text-2xl font-bold text-slate-100">
                {overallProgress}%
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                <div
                  className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stat 2: Learn Progress */}
          <div
            id="stat-learn-progress"
            className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700/80 transition-colors"
          >
            <span className="text-xs font-medium text-slate-400">
              Learn Progress
            </span>
            <div className="mt-2">
              <div className="text-2xl font-bold text-slate-100">
                {learnedCount}{' '}
                <span className="text-xs font-normal text-slate-400">
                  / {totalSyllabusTopics}
                </span>
              </div>
              <p className="text-[11px] text-cyan-400 mt-1 font-medium">
                {learnProgressPercentage}% syllabus covered
              </p>
            </div>
          </div>

          {/* Stat 3: Practice Questions Attempted */}
          <div
            id="stat-practice-attempted"
            className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700/80 transition-colors"
          >
            <span className="text-xs font-medium text-slate-400">
              Practice Questions Attempted
            </span>
            <div className="mt-2">
              <div className="text-2xl font-bold text-slate-100">
                {practiceQuestionsAttempted}{' '}
                <span className="text-xs font-normal text-slate-400">/ 50</span>
              </div>
              <p className="text-[11px] text-emerald-400 mt-1 font-medium">
                Subjective & SQL
              </p>
            </div>
          </div>

          {/* Stat 4: Quiz Questions Attempted */}
          <div
            id="stat-quiz-attempted"
            className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700/80 transition-colors"
          >
            <span className="text-xs font-medium text-slate-400">
              Quiz Questions Attempted
            </span>
            <div className="mt-2">
              <div className="text-2xl font-bold text-slate-100">
                {quizQuestionsAttempted}{' '}
                <span className="text-xs font-normal text-slate-400">/ 50</span>
              </div>
              <p className="text-[11px] text-indigo-400 mt-1 font-medium">
                Unit MCQs answered
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          3. DBMS UNITS (5 Compact Cards with Real Student Progress)
          --------------------------------------------------------------------- */}
      <div id="dashboard-units-section" className="space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            DBMS Units
          </span>
          <span className="text-[11px] text-slate-500">5 Syllabus Units</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3">
          {unitCardsData.map((unit) => (
            <div
              key={unit.id}
              id={`unit-card-${unit.id}`}
              className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[11px] font-semibold text-slate-400 truncate">
                    {unit.shortName}
                  </span>
                  <span className="text-xs font-bold text-slate-200">
                    {unit.percentage}%
                  </span>
                </div>

                <h3 className="text-xs font-bold text-slate-100 leading-snug line-clamp-2 min-h-[32px]">
                  {unit.title}
                </h3>

                {/* Small progress bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${unit.percentage}%` }}
                  />
                </div>
              </div>

              {/* Action buttons: Learn / Practice / Quiz */}
              <div className="grid grid-cols-3 gap-1 pt-1 border-t border-slate-800/80">
                <button
                  onClick={() => onNavigate('learn')}
                  className="py-1 px-1 rounded-md bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-slate-100 text-[11px] font-medium text-center transition-colors border border-slate-700/60"
                >
                  Learn
                </button>
                <button
                  onClick={() => onNavigate('practice')}
                  className="py-1 px-1 rounded-md bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-slate-100 text-[11px] font-medium text-center transition-colors border border-slate-700/60"
                >
                  Practice
                </button>
                <button
                  onClick={() => onNavigate('quiz')}
                  className="py-1 px-1 rounded-md bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 text-[11px] font-medium text-center transition-colors border border-cyan-800/50"
                >
                  Quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          4. QUICK ACCESS (One Compact Row of 5 Cards)
          --------------------------------------------------------------------- */}
      <div id="dashboard-quick-access-section" className="space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Quick Access
          </span>
          <span className="text-[11px] text-slate-500">Modules</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3">
          {/* 1. Learn */}
          <div
            id="quick-access-learn-card"
            className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-2.5"
          >
            <div>
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-2">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-100">
                Learn
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                Interactive AI concepts & analogies
              </p>
            </div>
            <button
              onClick={() => onNavigate('learn')}
              className="w-full py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-cyan-950/50 hover:text-cyan-300 hover:border-cyan-800/60 text-slate-200 text-xs font-medium text-center transition-all border border-slate-700/60 flex items-center justify-center gap-1"
            >
              <span>Open Learn</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* 2. Practice */}
          <div
            id="quick-access-practice-card"
            className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-2.5"
          >
            <div>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
                <PenTool className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-100">
                Practice
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                50 unit subjective & SQL problems
              </p>
            </div>
            <button
              onClick={() => onNavigate('practice')}
              className="w-full py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-emerald-950/50 hover:text-emerald-300 hover:border-emerald-800/60 text-slate-200 text-xs font-medium text-center transition-all border border-slate-700/60 flex items-center justify-center gap-1"
            >
              <span>Start Practice</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* 3. Quiz */}
          <div
            id="quick-access-quiz-card"
            className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-2.5"
          >
            <div>
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2">
                <Award className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-100">
                Quiz
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                50 unit MCQs with instant scoring
              </p>
            </div>
            <button
              onClick={() => onNavigate('quiz')}
              className="w-full py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-indigo-950/50 hover:text-indigo-300 hover:border-indigo-800/60 text-slate-200 text-xs font-medium text-center transition-all border border-slate-700/60 flex items-center justify-center gap-1"
            >
              <span>Take Quiz</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* 4. AI Analysis */}
          <div
            id="quick-access-analysis-card"
            className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-2.5"
          >
            <div>
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2">
                <Brain className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-100">
                AI Analysis
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                Mastery diagnostics & retention reports
              </p>
            </div>
            <button
              onClick={() => onNavigate('analysis')}
              className="w-full py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-purple-950/50 hover:text-purple-300 hover:border-purple-800/60 text-slate-200 text-xs font-medium text-center transition-all border border-slate-700/60 flex items-center justify-center gap-1"
            >
              <span>View Analysis</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* 5. Personalized Plan */}
          <div
            id="quick-access-plan-card"
            className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-2.5"
          >
            <div>
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2">
                <Target className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-100">
                Personalized Plan
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                Structured 5-day DBMS exam roadmap
              </p>
            </div>
            <button
              onClick={() => onNavigate('study-plan')}
              className="w-full py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-amber-950/50 hover:text-amber-300 hover:border-amber-800/60 text-slate-200 text-xs font-medium text-center transition-all border border-slate-700/60 flex items-center justify-center gap-1"
            >
              <span>View Plan</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          5. AI INSIGHT (ONLY One Small Compact Card)
          --------------------------------------------------------------------- */}
      <div
        id="dashboard-ai-insight-card"
        className="p-3.5 sm:p-4 rounded-xl bg-slate-900 border border-cyan-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
      >
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
            <Brain className="w-4 h-4" />
          </div>

          {hasStudentData && aiInsight ? (
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  AI Recommendation
                </span>
                <span className="text-xs font-semibold text-slate-200">
                  • {aiInsight.topic}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {aiInsight.recommendation}
              </p>
            </div>
          ) : (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                AI Insight
              </span>
              <p className="text-xs text-slate-300 mt-0.5">
                Start learning to generate personalized insights.
              </p>
            </div>
          )}
        </div>

        <button
          id="dashboard-insight-continue-btn"
          onClick={() => onNavigate('learn')}
          className="self-start sm:self-auto py-1.5 px-3.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
        >
          <span>Continue Learning</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
