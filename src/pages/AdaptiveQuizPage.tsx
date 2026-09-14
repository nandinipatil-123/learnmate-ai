import React, { useState, useEffect, useMemo } from 'react';
import {
  Gamepad2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  RotateCcw,
  Trophy,
  BookOpen,
  Sliders,
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Award,
  ChevronRight,
  Check,
  Layers,
  Target,
  BarChart3,
  Flame,
  Info,
} from 'lucide-react';
import {
  DBMS_QUIZ_UNITS,
  DBMSQuizUnit,
  DBMSQuizQuestion,
  loadQuizPerformance,
  saveUnitQuizPerformance,
  UnitPerformanceMap,
} from '../data/dbmsQuizQuestions';
import { resolveLearnedTopic } from '../data/practiceQuestions';

export const AdaptiveQuizPage: React.FC = () => {
  // ---------------------------------------------------------------------------
  // Unit Selection State (Strictly DBMS Units 1 through 5)
  // ---------------------------------------------------------------------------
  const [selectedUnitId, setSelectedUnitId] = useState<'unit-1' | 'unit-2' | 'unit-3' | 'unit-4' | 'unit-5'>('unit-1');
  const [performanceHistory, setPerformanceHistory] = useState<UnitPerformanceMap>({});

  // ---------------------------------------------------------------------------
  // Active Quiz State
  // ---------------------------------------------------------------------------
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [activeQuestions, setActiveQuestions] = useState<DBMSQuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  // For each question (by ID), track student's chosen option index (0..3)
  const [studentAnswers, setStudentAnswers] = useState<{ [qId: string]: number }>({});
  // Track whether feedback is currently revealed for the current question
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  // Detailed option explanation expansion toggle
  const [showAllOptionExplanations, setShowAllOptionExplanations] = useState(false);

  // ---------------------------------------------------------------------------
  // Quiz Completion State
  // ---------------------------------------------------------------------------
  const [isCompleted, setIsCompleted] = useState(false);

  // Load saved performance from localStorage on mount
  useEffect(() => {
    const saved = loadQuizPerformance();
    setPerformanceHistory(saved);
  }, []);

  // Synchronize with currently studied topic on Learn page
  useEffect(() => {
    let isMounted = true;
    const fetchLearnedTopic = async () => {
      try {
        const res = await fetch('/api/current-learned-topic');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data && (data.topicTitle || data.topicInput)) {
            const rawTopic = data.topicTitle || data.topicInput || '';
            const resolved = resolveLearnedTopic(rawTopic);
            setSelectedUnitId(resolved.unitId);
          }
        }
      } catch (err) {
        console.warn('Could not sync current learned topic for quiz:', err);
      }
    };

    fetchLearnedTopic();
    return () => {
      isMounted = false;
    };
  }, []);

  // Selected Unit Info
  const activeUnitInfo: DBMSQuizUnit = useMemo(() => {
    return DBMS_QUIZ_UNITS.find((u) => u.id === selectedUnitId) || DBMS_QUIZ_UNITS[0];
  }, [selectedUnitId]);

  // Current Question
  const currentQuestion: DBMSQuizQuestion | undefined = activeQuestions[currentIdx];
  const selectedOptionIndex: number | undefined = currentQuestion ? studentAnswers[currentQuestion.id] : undefined;
  const isCurrentQuestionAnswered = selectedOptionIndex !== undefined;
  const isCurrentCorrect = isCurrentQuestionAnswered && currentQuestion && selectedOptionIndex === currentQuestion.correctIndex;

  // ---------------------------------------------------------------------------
  // Quiz Actions
  // ---------------------------------------------------------------------------
  const handleStartQuiz = (unitIdToStart?: 'unit-1' | 'unit-2' | 'unit-3' | 'unit-4' | 'unit-5') => {
    const targetUnitId = unitIdToStart || selectedUnitId;
    if (unitIdToStart) {
      setSelectedUnitId(unitIdToStart);
    }

    const unit = DBMS_QUIZ_UNITS.find((u) => u.id === targetUnitId) || DBMS_QUIZ_UNITS[0];
    setActiveQuestions(unit.questions);
    setCurrentIdx(0);
    setStudentAnswers({});
    setIsAnswerRevealed(false);
    setShowAllOptionExplanations(false);
    setIsCompleted(false);
    setIsQuizActive(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOption = (optionIndex: number) => {
    if (!currentQuestion) return;
    // If already answered for this question, allow clicking or keep selected
    if (!isAnswerRevealed) {
      setStudentAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: optionIndex,
      }));
      setIsAnswerRevealed(true);
      setShowAllOptionExplanations(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < activeQuestions.length) {
      const nextIndex = currentIdx + 1;
      setCurrentIdx(nextIndex);
      const nextQ = activeQuestions[nextIndex];
      // Check if already answered previously
      const alreadyAnswered = nextQ && studentAnswers[nextQ.id] !== undefined;
      setIsAnswerRevealed(alreadyAnswered);
      setShowAllOptionExplanations(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Complete quiz and compute final results
      handleFinishQuiz();
    }
  };

  const handlePrevQuestion = () => {
    if (currentIdx > 0) {
      const prevIndex = currentIdx - 1;
      setCurrentIdx(prevIndex);
      const prevQ = activeQuestions[prevIndex];
      const alreadyAnswered = prevQ && studentAnswers[prevQ.id] !== undefined;
      setIsAnswerRevealed(alreadyAnswered);
      setShowAllOptionExplanations(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleJumpToQuestion = (targetIndex: number) => {
    if (targetIndex >= 0 && targetIndex < activeQuestions.length) {
      setCurrentIdx(targetIndex);
      const targetQ = activeQuestions[targetIndex];
      const alreadyAnswered = targetQ && studentAnswers[targetQ.id] !== undefined;
      setIsAnswerRevealed(alreadyAnswered);
      setShowAllOptionExplanations(false);
    }
  };

  const handleFinishQuiz = () => {
    // Calculate final score
    let correctCount = 0;
    activeQuestions.forEach((q) => {
      if (studentAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    // Save performance to localStorage
    const updated = saveUnitQuizPerformance(
      activeUnitInfo.id,
      activeUnitInfo.unitNumber,
      activeUnitInfo.title,
      correctCount,
      activeQuestions.length
    );
    setPerformanceHistory(updated);

    setIsCompleted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetToSetup = () => {
    setIsQuizActive(false);
    setIsCompleted(false);
    setIsAnswerRevealed(false);
    setShowAllOptionExplanations(false);
  };

  // ---------------------------------------------------------------------------
  // Summary Metrics Computation
  // ---------------------------------------------------------------------------
  const quizSummary = useMemo(() => {
    if (!activeQuestions.length) {
      return { total: 0, correct: 0, wrong: 0, percentage: 0 };
    }
    let correct = 0;
    let wrong = 0;
    activeQuestions.forEach((q) => {
      const ans = studentAnswers[q.id];
      if (ans !== undefined) {
        if (ans === q.correctIndex) {
          correct += 1;
        } else {
          wrong += 1;
        }
      } else {
        wrong += 1;
      }
    });
    const total = activeQuestions.length;
    const percentage = Math.round((correct / total) * 100);
    return { total, correct, wrong, percentage };
  }, [activeQuestions, studentAnswers]);

  // =========================================================================
  // VIEW 1: QUIZ SETUP SCREEN (Select DBMS Unit 1 to 5)
  // =========================================================================
  if (!isQuizActive) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
        {/* Header Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 border border-cyan-800/40 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
              <Gamepad2 className="w-4 h-4" />
              <span>Database Management Systems (DBMS)</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-900/60 text-cyan-200 text-[10px] font-semibold border border-cyan-700/50">
                50 Exam MCQs (10 per Unit)
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-100">
              DBMS Unit-Wise Quiz
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Organized strictly by the 5-unit DBMS syllabus. Each unit features 10 exam-oriented MCQs. Receive instant step-by-step concept explanations for why the correct answer is right and why your selected choice is wrong.
            </p>
          </div>

          <button
            type="button"
            id="start-default-quiz-btn"
            onClick={() => handleStartQuiz(selectedUnitId)}
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer shrink-0"
          >
            <span>Start {activeUnitInfo.shortTitle.split(':')[0]} Quiz</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 5 Units Selector Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Select DBMS Unit to Test (10 Questions per Unit)</span>
            </label>
            <span className="text-xs text-slate-400">
              Selected: <span className="text-cyan-300 font-medium">{activeUnitInfo.shortTitle}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {DBMS_QUIZ_UNITS.map((unit) => {
              const isSelected = selectedUnitId === unit.id;
              const history = performanceHistory[unit.id];
              return (
                <button
                  key={unit.id}
                  type="button"
                  onClick={() => setSelectedUnitId(unit.id)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between relative group ${
                    isSelected
                      ? 'bg-slate-850 border-cyan-500 ring-2 ring-cyan-500/30 shadow-lg'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                          isSelected ? 'bg-cyan-500 text-slate-950 font-extrabold' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        UNIT {unit.unitNumber}
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold">
                        10 MCQs
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-100 line-clamp-2 leading-snug">
                      {unit.shortTitle.split(': ')[1] || unit.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                      {unit.subtitle}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    {history ? (
                      <span className="text-emerald-400 text-[11px] font-medium flex items-center gap-1">
                        <Trophy className="w-3 h-3" /> Best: {history.bestScore}/10 ({history.lastPercentage}%)
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">
                        Not attempted yet
                      </span>
                    )}
                    {isSelected ? (
                      <span className="text-cyan-400 font-bold flex items-center gap-1">
                        Active <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="text-slate-400 group-hover:text-slate-200 flex items-center gap-0.5">
                        Select <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Unit Overview & 10 Questions Preview */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  Unit {activeUnitInfo.unitNumber} Syllabus Coverage
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">10 Targeted Examination MCQs</span>
              </div>
              <h2 className="text-lg font-bold text-slate-100 mt-1">
                {activeUnitInfo.title}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {activeUnitInfo.subtitle}
              </p>
            </div>

            {performanceHistory[activeUnitInfo.id] && (
              <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Past Best Score</div>
                  <div className="text-sm font-bold text-emerald-400">
                    {performanceHistory[activeUnitInfo.id]?.bestScore}/10 ({performanceHistory[activeUnitInfo.id]?.lastPercentage}%)
                  </div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800/60 text-emerald-400 flex items-center justify-center">
                  <Trophy className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>

          {/* 10 Questions Topics List */}
          <div className="space-y-2.5">
            {activeUnitInfo.questions.map((q, idx) => (
              <div
                key={q.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-100">
                        {q.topic}
                      </span>
                      <span className="text-[10px] px-2 py-0.2 rounded-md font-semibold border bg-slate-800 text-slate-300 border-slate-700">
                        {q.conceptTag}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.2 rounded-md font-semibold border ${
                          q.difficulty === 'Easy'
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                            : q.difficulty === 'Medium'
                            ? 'bg-amber-950/60 text-amber-400 border-amber-800/40'
                            : 'bg-rose-950/60 text-rose-400 border-rose-800/40'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {q.question}
                    </p>
                  </div>
                </div>

                <span className="text-xs text-slate-500 font-medium shrink-0 self-end sm:self-center">
                  4 Options
                </span>
              </div>
            ))}
          </div>

          {/* Start Quiz Footer Button */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                Ready to take the 10-question MCQ quiz on{' '}
                <span className="text-cyan-300 font-semibold">{activeUnitInfo.title}</span>.
              </span>
            </div>

            <button
              id="start-unit-quiz-btn"
              type="button"
              onClick={() => handleStartQuiz(selectedUnitId)}
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <span>Begin Unit Quiz (10 Questions)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Unit-Wise Overall Performance Overview (if any attempts exist) */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                Overall Syllabus Unit-Wise Mastery
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              5 Units • 50 Total MCQs
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {DBMS_QUIZ_UNITS.map((u) => {
              const record = performanceHistory[u.id];
              const pct = record ? record.lastPercentage : 0;
              return (
                <div
                  key={u.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">
                      Unit {u.unitNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        !record
                          ? 'bg-slate-800 text-slate-400'
                          : pct >= 80
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                          : pct >= 60
                          ? 'bg-amber-950 text-amber-400 border border-amber-800/40'
                          : 'bg-rose-950 text-rose-400 border border-rose-800/40'
                      }`}
                    >
                      {record ? `${record.bestScore}/10` : 'Untested'}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 line-clamp-1 font-medium">
                    {u.shortTitle.split(': ')[1]}
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mt-1">
                    <div
                      className={`h-full rounded-full transition-all ${
                        pct >= 80 ? 'bg-emerald-400' : pct >= 60 ? 'bg-amber-400' : 'bg-rose-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: QUIZ COMPLETED SCREEN (Score, Correct/Wrong, Unit Performance)
  // =========================================================================
  if (isCompleted || !currentQuestion) {
    const { total, correct, wrong, percentage } = quizSummary;
    const isPassing = percentage >= 60;

    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
        {/* Score & Summary Card */}
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-6">
          <div
            className={`w-16 h-16 rounded-2xl border flex items-center justify-center mx-auto ${
              percentage >= 80
                ? 'bg-emerald-950 border-emerald-800/60 text-emerald-400'
                : percentage >= 60
                ? 'bg-amber-950 border-amber-800/60 text-amber-400'
                : 'bg-rose-950 border-rose-800/60 text-rose-400'
            }`}
          >
            {percentage >= 80 ? (
              <Trophy className="w-8 h-8" />
            ) : percentage >= 60 ? (
              <Award className="w-8 h-8" />
            ) : (
              <Target className="w-8 h-8" />
            )}
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              {activeUnitInfo.title}
            </span>
            <h2 className="text-2xl font-bold text-slate-100">
              Quiz Completed!
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              {percentage >= 80
                ? 'Outstanding performance! You have demonstrated strong mastery of this DBMS unit.'
                : percentage >= 60
                ? 'Good effort! You passed this unit, but reviewing the missed concepts will strengthen your exam readiness.'
                : 'Unit needs review. Revisit the concepts below to solidify your understanding of these core DBMS principles.'}
            </p>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Questions</div>
              <div className="text-2xl font-bold text-slate-100 mt-1">{total}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-900/40 text-center">
              <div className="text-xs text-emerald-400 uppercase tracking-wider font-semibold flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Correct
              </div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{correct}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-rose-900/40 text-center">
              <div className="text-xs text-rose-400 uppercase tracking-wider font-semibold flex items-center justify-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> Wrong
              </div>
              <div className="text-2xl font-bold text-rose-400 mt-1">{wrong}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-cyan-900/40 text-center">
              <div className="text-xs text-cyan-400 uppercase tracking-wider font-semibold flex items-center justify-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Score
              </div>
              <div className="text-2xl font-bold text-cyan-300 mt-1">{percentage}%</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => handleStartQuiz(selectedUnitId)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake This Unit Quiz</span>
            </button>
            <button
              type="button"
              onClick={handleResetToSetup}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sliders className="w-4 h-4" />
              <span>Select Another DBMS Unit</span>
            </button>
          </div>
        </div>

        {/* Detailed Question-by-Question Review */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-slate-100 text-sm">
                10-Question Comprehensive Review
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Click any question to view full DBMS explanation
            </span>
          </div>

          <div className="space-y-3">
            {activeQuestions.map((q, idx) => {
              const studentOpt = studentAnswers[q.id];
              const isRight = studentOpt === q.correctIndex;
              const hasAnswered = studentOpt !== undefined;

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isRight
                      ? 'bg-slate-950/90 border-emerald-800/40'
                      : 'bg-slate-950/90 border-rose-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-xs text-slate-400">
                          {q.topic}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                            isRight
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                              : 'bg-rose-950 text-rose-400 border border-rose-800/50'
                          }`}
                        >
                          {isRight ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {isRight ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-200 mt-1">
                        {q.question}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                          Your Selected Option:
                        </span>
                        <span className={isRight ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
                          {hasAnswered ? `${String.fromCharCode(65 + studentOpt)}. ${q.options[studentOpt]}` : 'Not answered'}
                        </span>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-900 border border-emerald-900/40">
                        <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-0.5">
                          Correct Option:
                        </span>
                        <span className="text-emerald-300 font-medium">
                          {String.fromCharCode(65 + q.correctIndex)}. {q.options[q.correctIndex]}
                        </span>
                      </div>
                    </div>

                    {/* Conceptual Explanations */}
                    <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80 space-y-2">
                      <div>
                        <span className="font-bold text-emerald-400 flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Why Correct:
                        </span>
                        <p className="text-slate-300 mt-0.5 leading-relaxed text-[11px]">
                          {q.correctExplanation}
                        </p>
                      </div>

                      {!isRight && hasAnswered && (
                        <div className="pt-2 border-t border-slate-800/80">
                          <span className="font-bold text-rose-400 flex items-center gap-1 text-[11px]">
                            <AlertTriangle className="w-3.5 h-3.5" /> Why Option {String.fromCharCode(65 + studentOpt)} was incorrect:
                          </span>
                          <p className="text-slate-300 mt-0.5 leading-relaxed text-[11px]">
                            {q.optionExplanations[studentOpt]}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Unit-Wise Overall Performance Comparison */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-slate-100 text-sm uppercase tracking-wider">
                Full DBMS Syllabus Performance Tracker
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              5 Units • 50 Questions
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {DBMS_QUIZ_UNITS.map((u) => {
              const record = performanceHistory[u.id];
              const isThisUnit = u.id === selectedUnitId;
              const pct = record ? record.lastPercentage : 0;

              return (
                <div
                  key={u.id}
                  className={`p-3.5 rounded-xl border text-left flex flex-col justify-between ${
                    isThisUnit
                      ? 'bg-slate-850 border-cyan-500 ring-1 ring-cyan-500/30'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-200">
                        UNIT {u.unitNumber}
                      </span>
                      {record ? (
                        <span className="text-[11px] font-bold text-emerald-400">
                          {record.bestScore}/10
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500">
                          Untested
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                      {u.shortTitle.split(': ')[1]}
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          pct >= 80 ? 'bg-emerald-400' : pct >= 60 ? 'bg-amber-400' : 'bg-rose-400'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-500 text-right mt-1 font-semibold">
                      {record ? `${pct}%` : '0%'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: ACTIVE QUIZ (1 Question at a time → Answer → Instant Concept Feedback)
  // =========================================================================
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Quiz Top Navigation Bar */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800/60 text-xs font-bold uppercase tracking-wider">
                UNIT {currentQuestion.unitNumber}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-semibold text-slate-200">{currentQuestion.unitTitle}</span>
              <span className="text-slate-600">•</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-md font-semibold border ${
                  currentQuestion.difficulty === 'Easy'
                    ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                    : currentQuestion.difficulty === 'Medium'
                    ? 'bg-amber-950/60 text-amber-400 border-amber-800/40'
                    : 'bg-rose-950/60 text-rose-400 border-rose-800/40'
                }`}
              >
                {currentQuestion.difficulty}
              </span>
            </div>

            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>{currentQuestion.topic}</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-normal">
                {currentQuestion.conceptTag}
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
            <div className="text-right text-xs">
              <div className="text-slate-500">Question</div>
              <div className="font-bold text-slate-200 text-sm">
                {currentIdx + 1} <span className="text-slate-500 font-normal">/ {activeQuestions.length}</span>
              </div>
            </div>

            <button
              id="exit-quiz-btn"
              type="button"
              onClick={handleResetToSetup}
              title="Exit to Unit Selector"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all cursor-pointer border border-slate-700"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 10-Question Jumper Pills */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Questions:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {activeQuestions.map((q, idx) => {
              const isCurrent = idx === currentIdx;
              const hasAns = studentAnswers[q.id] !== undefined;
              const isCorrect = hasAns && studentAnswers[q.id] === q.correctIndex;

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => handleJumpToQuestion(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                    isCurrent
                      ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-500/40'
                      : hasAns
                      ? isCorrect
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                        : 'bg-rose-950 text-rose-400 border border-rose-800/60'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                  }`}
                  title={`Question ${idx + 1}: ${q.topic}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Question {currentIdx + 1} of {activeQuestions.length}</span>
          </span>
          <span className="text-xs text-slate-500">
            Select one of 4 options
          </span>
        </div>

        <p className="text-base sm:text-lg font-semibold text-slate-100 leading-relaxed">
          {currentQuestion.question}
        </p>

        {currentQuestion.codeSnippet && (
          <div className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 border border-slate-800 whitespace-pre-wrap leading-relaxed">
            {currentQuestion.codeSnippet}
          </div>
        )}
      </div>

      {/* 4 Interactive Options */}
      <div className="space-y-3">
        {currentQuestion.options.map((optionText, optIdx) => {
          const isSelected = selectedOptionIndex === optIdx;
          const isThisOptionCorrect = optIdx === currentQuestion.correctIndex;

          // Compute option card styling depending on whether answer is revealed
          let optionStyle = 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850/70 text-slate-200';
          let badgeStyle = 'bg-slate-800 text-slate-400 group-hover:text-slate-200';

          if (isAnswerRevealed) {
            if (isThisOptionCorrect) {
              optionStyle = 'bg-emerald-950/60 border-emerald-600 text-emerald-200 shadow-md ring-1 ring-emerald-500/40';
              badgeStyle = 'bg-emerald-500 text-slate-950 font-black';
            } else if (isSelected) {
              // Student selected this option, but it was WRONG
              optionStyle = 'bg-rose-950/60 border-rose-600 text-rose-200 shadow-md ring-1 ring-rose-500/40';
              badgeStyle = 'bg-rose-500 text-white font-black';
            } else {
              // Unselected incorrect option
              optionStyle = 'bg-slate-900/60 border-slate-850 text-slate-500 opacity-60';
              badgeStyle = 'bg-slate-800/80 text-slate-600';
            }
          }

          const optionLetter = String.fromCharCode(65 + optIdx); // A, B, C, D

          return (
            <button
              key={optIdx}
              type="button"
              id={`quiz-option-${optIdx}`}
              onClick={() => handleSelectOption(optIdx)}
              disabled={isAnswerRevealed}
              className={`w-full p-4 rounded-xl border text-left transition-all flex items-start justify-between gap-3 cursor-pointer group ${optionStyle} ${
                isAnswerRevealed ? 'cursor-default' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${badgeStyle}`}
                >
                  {optionLetter}
                </span>
                <span className="text-sm font-medium leading-relaxed mt-0.5">
                  {optionText}
                </span>
              </div>

              {isAnswerRevealed && (
                <div className="shrink-0 pt-0.5">
                  {isThisOptionCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : isSelected ? (
                    <XCircle className="w-5 h-5 text-rose-400" />
                  ) : null}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Answer Feedback Panel (Revealed immediately after student selects an option) */}
      {isAnswerRevealed && (
        <div
          className={`p-6 rounded-2xl border space-y-4 shadow-sm animate-in fade-in duration-200 ${
            isCurrentCorrect
              ? 'bg-gradient-to-br from-slate-900 via-emerald-950/20 to-slate-900 border-emerald-800/50'
              : 'bg-gradient-to-br from-slate-900 via-rose-950/20 to-slate-900 border-rose-800/50'
          }`}
        >
          {/* Feedback Status Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              {isCurrentCorrect ? (
                <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-800/60 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-lg bg-rose-950 border border-rose-800/60 text-rose-400 flex items-center justify-center">
                  <XCircle className="w-4 h-4" />
                </div>
              )}

              <div>
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isCurrentCorrect ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isCurrentCorrect ? 'Correct Answer!' : 'Incorrect Answer'}
                </span>
                <div className="text-xs text-slate-300 font-medium">
                  {isCurrentCorrect
                    ? 'Well done! You correctly identified the right DBMS concept.'
                    : `Correct option is ${String.fromCharCode(65 + currentQuestion.correctIndex)}: ${currentQuestion.options[currentQuestion.correctIndex]}`}
                </div>
              </div>
            </div>

            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                isCurrentCorrect
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800/60'
                  : 'bg-rose-950 text-rose-300 border-rose-800/60'
              }`}
            >
              {isCurrentCorrect ? '+1 Point' : '0 Points'}
            </span>
          </div>

          {/* Conceptual Feedback Body */}
          <div className="space-y-3 text-xs sm:text-sm text-slate-200">
            {/* If Student Answered Wrong: Explain WHY selected option was wrong */}
            {!isCurrentCorrect && selectedOptionIndex !== undefined && (
              <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-900/40 space-y-1">
                <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Why your chosen Option ({String.fromCharCode(65 + selectedOptionIndex)}) is Wrong:</span>
                </div>
                <p className="text-xs text-rose-200/90 leading-relaxed">
                  {currentQuestion.optionExplanations[selectedOptionIndex]}
                </p>
              </div>
            )}

            {/* Always explain WHY the correct answer is correct */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  Why Option {String.fromCharCode(65 + currentQuestion.correctIndex)} is Correct:
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentQuestion.correctExplanation}
              </p>
            </div>

            {/* Toggle Full Options Breakdown for in-depth revision */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowAllOptionExplanations((prev) => !prev)}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Info className="w-3.5 h-3.5" />
                <span>
                  {showAllOptionExplanations ? 'Hide all options breakdown' : 'View breakdown of all 4 options'}
                </span>
              </button>

              {showAllOptionExplanations && (
                <div className="mt-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Syllabus Concept Review for All Options:
                  </div>
                  {currentQuestion.options.map((opt, i) => (
                    <div key={i} className="text-xs space-y-0.5 border-l-2 pl-2.5 border-slate-800">
                      <span className="font-semibold text-slate-200">
                        {String.fromCharCode(65 + i)}. {opt} {i === currentQuestion.correctIndex ? '(CORRECT)' : ''}
                      </span>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        {currentQuestion.optionExplanations[i]}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Controls (Previous / Next / Finish) */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrevQuestion}
          disabled={currentIdx === 0}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous Question</span>
        </button>

        <div className="text-xs text-slate-400">
          Question <span className="text-slate-200 font-bold">{currentIdx + 1}</span> of{' '}
          <span className="text-slate-200 font-bold">{activeQuestions.length}</span>
        </div>

        <button
          id="next-quiz-question-btn"
          type="button"
          onClick={handleNextQuestion}
          disabled={!isAnswerRevealed}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        >
          <span>
            {currentIdx + 1 < activeQuestions.length ? 'Next Question' : 'Finish Unit Quiz'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
