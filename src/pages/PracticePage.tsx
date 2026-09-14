import React, { useState, useMemo, useEffect } from 'react';
import {
  PenTool,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Lightbulb,
  FileCode,
  Award,
  AlertTriangle,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sliders,
  ChevronRight,
  BookOpen,
  Target,
  Layers,
  Zap,
  GraduationCap,
  Eye,
  EyeOff,
  ArrowLeft,
  Check,
  HelpCircle,
} from 'lucide-react';
import { PracticeQuestion, PracticeEvaluation, PracticeQuestionType } from '../types';
import {
  PRACTICE_QUESTIONS,
  DBMS_PRACTICE_UNITS,
  DBMSPracticeUnit,
  resolveLearnedTopic,
  LearnedTopicResolution,
  loadPracticeAnswers,
  savePracticeAnswers,
} from '../data/practiceQuestions';
import { evaluateStudentPracticeAnswer } from '../utils/practiceEvaluator';

export const PracticePage: React.FC = () => {
  // Practice Setup State: strictly DBMS Unit-wise
  const [selectedUnitId, setSelectedUnitId] = useState<'unit-1' | 'unit-2' | 'unit-3' | 'unit-4' | 'unit-5'>('unit-1');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');

  // Track the resolved Learn topic context if coming from Learn
  const [learnContext, setLearnContext] = useState<LearnedTopicResolution>({
    subject: 'DBMS',
    unitId: 'unit-1',
    unitTitle: 'UNIT I – Overview of Database Systems & ER Model',
    topic: 'Overview of Database Systems & ER Model',
    displayTitle: 'Unit I: Overview of Database Systems & ER Model',
    matchedId: 'unit-1',
  });
  const [isSyncingLearn, setIsSyncingLearn] = useState(false);

  // Session State
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [activePool, setActivePool] = useState<PracticeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState<{ [qId: string]: string }>(() => loadPracticeAnswers());
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<PracticeEvaluation | null>(null);
  const [evalError, setEvalError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Keep practice answers saved in localStorage
  useEffect(() => {
    savePracticeAnswers(studentAnswers);
  }, [studentAnswers]);

  // Synchronize with the current topic studied on the Learn page
  useEffect(() => {
    let isMounted = true;
    const fetchCurrentLearnedTopic = async () => {
      setIsSyncingLearn(true);
      try {
        const res = await fetch('/api/current-learned-topic');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data) {
            const rawTopic = data.topicTitle || data.topicInput || '';
            const resolved = resolveLearnedTopic(rawTopic);
            setLearnContext(resolved);
            setSelectedUnitId(resolved.unitId);
          }
        }
      } catch (err) {
        console.warn('Could not fetch current learned topic from server:', err);
      } finally {
        if (isMounted) setIsSyncingLearn(false);
      }
    };

    fetchCurrentLearnedTopic();
    return () => {
      isMounted = false;
    };
  }, []);

  // Selected Unit Info
  const activeUnitInfo = useMemo(() => {
    return DBMS_PRACTICE_UNITS.find((u) => u.id === selectedUnitId) || DBMS_PRACTICE_UNITS[0];
  }, [selectedUnitId]);

  // Filter pool strictly for the chosen unit and difficulty
  const unitQuestions = useMemo(() => {
    return PRACTICE_QUESTIONS.filter((q) => q.unitId === selectedUnitId);
  }, [selectedUnitId]);

  const matchingQuestions = useMemo(() => {
    if (selectedDifficulty === 'All') {
      return unitQuestions;
    }
    return unitQuestions.filter((q) => q.difficulty === selectedDifficulty);
  }, [unitQuestions, selectedDifficulty]);

  // Start Practice Workflow
  const handleStartPractice = (unitIdToStart?: 'unit-1' | 'unit-2' | 'unit-3' | 'unit-4' | 'unit-5') => {
    const targetUnit = unitIdToStart || selectedUnitId;
    if (unitIdToStart) {
      setSelectedUnitId(unitIdToStart);
    }

    const pool = selectedDifficulty === 'All'
      ? PRACTICE_QUESTIONS.filter((q) => q.unitId === targetUnit)
      : PRACTICE_QUESTIONS.filter((q) => q.unitId === targetUnit && q.difficulty === selectedDifficulty);

    const finalPool = pool.length > 0
      ? pool
      : PRACTICE_QUESTIONS.filter((q) => q.unitId === targetUnit);

    setActivePool(finalPool);
    setCurrentIndex(0);
    setShowModelAnswer(false);
    setEvaluationResult(null);
    setEvalError(null);
    setIsCompleted(false);
    setIsSessionActive(true);
  };

  // Current active question (strictly ONE at a time)
  const currentQuestion: PracticeQuestion | undefined = activePool[currentIndex];
  const currentAnswer = currentQuestion ? (studentAnswers[currentQuestion.id] || '') : '';

  const handleAnswerChange = (val: string) => {
    if (!currentQuestion) return;
    setStudentAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: val,
    }));
  };

  // Check / Evaluate Answer Workflow
  const handleEvaluate = async () => {
    if (!currentQuestion || !currentAnswer.trim() || isEvaluating) return;

    setIsEvaluating(true);
    setEvalError(null);

    try {
      // First attempt server-side evaluation with Gemini
      const res = await fetch('/api/evaluate-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion,
          answer: currentAnswer,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setEvaluationResult(data);
      } else {
        // Fallback to client evaluator
        const evaluation = evaluateStudentPracticeAnswer(currentQuestion, currentAnswer);
        setEvaluationResult(evaluation);
      }
    } catch (err: any) {
      console.warn('Evaluation fallback engaged:', err);
      const evaluation = evaluateStudentPracticeAnswer(currentQuestion, currentAnswer);
      setEvaluationResult(evaluation);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Jump to specific question
  const handleJumpToQuestion = (index: number) => {
    if (index >= 0 && index < activePool.length) {
      setCurrentIndex(index);
      setShowModelAnswer(false);
      setEvaluationResult(null);
      setEvalError(null);
    }
  };

  // Next Question Workflow (Replaces current question in place)
  const handleNextQuestion = () => {
    if (currentIndex + 1 < activePool.length) {
      setCurrentIndex((prev) => prev + 1);
      setShowModelAnswer(false);
      setEvaluationResult(null);
      setEvalError(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsCompleted(true);
    }
  };

  // Previous Question Workflow
  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setShowModelAnswer(false);
      setEvaluationResult(null);
      setEvalError(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Reset to Practice Setup
  const handleResetSetup = () => {
    setIsSessionActive(false);
    setEvaluationResult(null);
    setShowModelAnswer(false);
    setIsCompleted(false);
  };

  // Restart same pool
  const handleRestartPool = () => {
    setCurrentIndex(0);
    setShowModelAnswer(false);
    setEvaluationResult(null);
    setEvalError(null);
    setIsCompleted(false);
  };

  // Type badge styling helper
  const getTypeBadgeClass = (type: PracticeQuestionType) => {
    switch (type) {
      case 'Conceptual':
        return 'bg-indigo-950 text-indigo-300 border-indigo-800/60';
      case 'Problem-solving':
        return 'bg-cyan-950 text-cyan-300 border-cyan-800/60';
      case 'Scenario-based':
        return 'bg-purple-950 text-purple-300 border-purple-800/60';
      case 'SQL/coding':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800/60';
      case 'Exam-oriented':
        return 'bg-amber-950 text-amber-300 border-amber-800/60';
      case 'Application-based':
        return 'bg-rose-950 text-rose-300 border-rose-800/60';
      case 'Calculation/derivation':
        return 'bg-sky-950 text-sky-300 border-sky-800/60';
      case 'Compare-and-explain':
        return 'bg-teal-950 text-teal-300 border-teal-800/60';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  // Status visual themes for evaluation results
  const statusTheme =
    evaluationResult?.status === 'correct'
      ? {
          border: 'border-emerald-800/40',
          badge: 'bg-emerald-950 text-emerald-300 border-emerald-800/50',
          score: 'text-emerald-400',
          icon: 'text-emerald-400',
        }
      : evaluationResult?.status === 'partially_correct'
      ? {
          border: 'border-amber-800/40',
          badge: 'bg-amber-950 text-amber-300 border-amber-800/50',
          score: 'text-amber-400',
          icon: 'text-amber-400',
        }
      : {
          border: 'border-rose-800/40',
          badge: 'bg-rose-950 text-rose-300 border-rose-800/50',
          score: 'text-rose-400',
          icon: 'text-rose-400',
        };

  // =========================================================================
  // VIEW 1: PRACTICE SETUP (Exclusively DBMS organized Unit-wise I to V)
  // =========================================================================
  if (!isSessionActive) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
        {/* Header Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 border border-cyan-800/40 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Database Management Systems (DBMS)</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-900/60 text-cyan-200 text-[10px] font-semibold border border-cyan-700/50">
                50 Important Questions (10 per Unit)
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-100">
              DBMS Unit-Wise Practice
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Strictly organized according to the 5-unit DBMS syllabus. Type your answer to each question, then use <span className="text-cyan-300 font-semibold">Show Answer</span> or <span className="text-cyan-300 font-semibold">Check Answer</span> to compare with the model solution.
            </p>
          </div>

          <button
            type="button"
            id="start-default-practice-btn"
            onClick={() => handleStartPractice(selectedUnitId)}
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer shrink-0"
          >
            <span>Practice {activeUnitInfo.shortTitle.split(':')[0]}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 5 Units Syllabus Navigation Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Select DBMS Unit to Practice (10 Questions per Unit)</span>
            </label>
            <span className="text-xs text-slate-400">
              Selected: <span className="text-cyan-300 font-medium">{activeUnitInfo.shortTitle}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {DBMS_PRACTICE_UNITS.map((unit) => {
              const isSelected = selectedUnitId === unit.id;
              const answeredCount = unit.questions.filter((q) => Boolean(studentAnswers[q.id]?.trim())).length;
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
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        isSelected ? 'bg-cyan-500 text-slate-950 font-extrabold' : 'bg-slate-800 text-slate-300'
                      }`}>
                        UNIT {unit.unitNumber}
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold">
                        10 Qs
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
                    <span className="text-slate-500 text-[11px]">
                      {answeredCount > 0 ? `${answeredCount}/10 answered` : '10 questions ready'}
                    </span>
                    {isSelected ? (
                      <span className="text-cyan-400 font-bold flex items-center gap-1">
                        Selected <Check className="w-3.5 h-3.5" />
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

        {/* Unit Breakdown & Question List Preview */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  Unit {activeUnitInfo.unitNumber} Overview
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">10 Important Syllabus Questions</span>
              </div>
              <h2 className="text-lg font-bold text-slate-100 mt-1">
                {activeUnitInfo.title}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {activeUnitInfo.subtitle}
              </p>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-1.5 self-start sm:self-center">
              {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    selectedDifficulty === diff
                      ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* 10 Questions Grid for the active unit */}
          <div className="space-y-2.5">
            {matchingQuestions.map((q, idx) => {
              const isAnswered = Boolean(studentAnswers[q.id]?.trim());
              return (
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
                          {q.title}
                        </span>
                        <span className={`text-[10px] px-2 py-0.2 rounded-md font-semibold border ${getTypeBadgeClass(q.type)}`}>
                          {q.type}
                        </span>
                        <span className={`text-[10px] px-2 py-0.2 rounded-md font-semibold border ${
                          q.difficulty === 'Easy'
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                            : q.difficulty === 'Medium'
                            ? 'bg-amber-950/60 text-amber-400 border-amber-800/40'
                            : 'bg-rose-950/60 text-rose-400 border-rose-800/40'
                        }`}>
                          {q.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                        {q.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {isAnswered && (
                      <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Answered
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        handleStartPractice(selectedUnitId);
                        setCurrentIndex(idx);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Practice
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Start Unit Practice Button */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                Ready to practice <span className="font-semibold text-slate-200">{matchingQuestions.length}</span> DBMS questions in{' '}
                <span className="text-cyan-300 font-semibold">{activeUnitInfo.title}</span>.
              </span>
            </div>

            <button
              id="start-practice-btn"
              type="button"
              onClick={() => handleStartPractice(selectedUnitId)}
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <span>Start Unit Practice Session</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: PRACTICE SESSION (ONE Question at a time → Answer → Show Answer / Check Answer → Compare)
  // =========================================================================
  if (isCompleted || !currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-800/60 text-emerald-400 flex items-center justify-center mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-100">
            {activeUnitInfo.shortTitle} Completed!
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            You have reviewed all 10 practice questions for <span className="text-cyan-300 font-semibold">{activeUnitInfo.title}</span>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={handleRestartPool}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restart Unit Questions</span>
            </button>
            <button
              type="button"
              onClick={handleResetSetup}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sliders className="w-4 h-4" />
              <span>Choose Another DBMS Unit</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Session Top Bar: Unit, Progress, Question Jumpers & Change Unit */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
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

            <h2 className="text-lg sm:text-xl font-bold text-slate-100">
              {currentQuestion.title}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {currentQuestion.description}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
            <div className="text-right text-xs">
              <div className="text-slate-500">Question</div>
              <div className="font-bold text-slate-200 text-sm">
                {currentIndex + 1} <span className="text-slate-500 font-normal">/ {activePool.length}</span>
              </div>
            </div>
            <button
              id="back-to-setup-btn"
              type="button"
              onClick={handleResetSetup}
              title="Return to Unit Selector"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all cursor-pointer border border-slate-700"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 10-Question Quick Jumper Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Unit Questions:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {activePool.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const hasAnswer = Boolean(studentAnswers[q.id]?.trim());
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => handleJumpToQuestion(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                    isCurrent
                      ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-500/40'
                      : hasAnswer
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                  }`}
                  title={`Question ${idx + 1}: ${q.title}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Problem Statement Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Problem Statement
            </span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-md font-semibold border ${getTypeBadgeClass(
                currentQuestion.type
              )}`}
            >
              {currentQuestion.type}
            </span>
          </div>
          <span className="text-xs text-cyan-400 font-mono font-medium">
            {currentQuestion.code}
          </span>
        </div>

        <div className="space-y-3 text-sm text-slate-200">
          <p className="font-medium text-slate-100 leading-relaxed">
            {currentQuestion.statement.context}
          </p>

          {/* Optional Code / Schema Snippet */}
          {currentQuestion.statement.schemaOrCode && (
            <div className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 border border-slate-800 whitespace-pre-wrap leading-relaxed">
              {currentQuestion.statement.schemaOrCode}
            </div>
          )}

          {/* Tasks List */}
          <div className="text-slate-300 space-y-1.5 pt-1">
            {currentQuestion.statement.tasks.map((task, idx) => (
              <p key={idx} className="leading-relaxed">
                {task}
              </p>
            ))}
          </div>

          {/* Hint / Tip */}
          {currentQuestion.tip && (
            <div className="pt-2 flex items-start gap-2 text-xs text-slate-400">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>{currentQuestion.tip}</span>
            </div>
          )}
        </div>
      </div>

      {/* Student Answer Input Box (Empty by default - no pre-filled answer) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <label
            htmlFor="practice-answer-box"
            className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2"
          >
            <FileCode className="w-4 h-4 text-cyan-400" />
            <span>Your Answer (Type here, then compare or check)</span>
          </label>
          <span className="text-xs text-slate-500 font-mono">
            {currentAnswer.length} characters
          </span>
        </div>

        <textarea
          id="practice-answer-box"
          rows={7}
          value={currentAnswer}
          onChange={(e) => handleAnswerChange(e.target.value)}
          placeholder="Type your answer, derivations, SQL queries, or conceptual explanation here..."
          className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-200 font-mono text-sm leading-relaxed outline-none transition-all resize-y"
        />

        {/* Action Buttons: Show Answer / Check Answer */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Show / Hide Model Answer Button */}
          <button
            type="button"
            id="show-answer-btn"
            onClick={() => setShowModelAnswer((prev) => !prev)}
            className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              showModelAnswer
                ? 'bg-amber-950/40 text-amber-300 border-amber-700/60 hover:bg-amber-950/60'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-750 hover:text-white'
            }`}
          >
            {showModelAnswer ? (
              <>
                <EyeOff className="w-4 h-4 text-amber-400" />
                <span>Hide Correct Answer</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>Show Answer / Model Solution</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-3">
            {/* Check / Evaluate Answer Button */}
            <button
              id="evaluate-answer-btn"
              type="button"
              onClick={handleEvaluate}
              disabled={isEvaluating || !currentAnswer.trim()}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {isEvaluating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Checking Answer...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Check Answer with AI</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Model Answer / Correct Answer Display (Revealed on Show Answer) */}
      {showModelAnswer && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-amber-800/40 space-y-4 shadow-md animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-slate-100 text-sm sm:text-base">
                Model Answer & Correct Solution
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800/50 font-semibold">
                Official DBMS Syllabus Solution
              </span>
            </div>
            <span className="text-xs text-slate-400">
              Compare with your typed response
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Student's Typed Answer */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5" />
                <span>Your Typed Answer</span>
              </div>
              <div className="font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto pr-1">
                {currentAnswer.trim() ? currentAnswer : (
                  <span className="italic text-slate-600">You haven't typed an answer yet. Type your answer in the box above to compare.</span>
                )}
              </div>
            </div>

            {/* Correct Model Answer */}
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-900/30 space-y-2">
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>Correct Model Answer</span>
              </div>
              <div className="font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto pr-1">
                {currentQuestion.sampleSolution}
              </div>
            </div>
          </div>

          {currentQuestion.expectedKeywords && (
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold">Key syllabus terms:</span>
              {currentQuestion.expectedKeywords.map((kw, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono text-[11px]">
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Error display if evaluation encountered an issue */}
      {evalError && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{evalError}</span>
          </div>
          <button
            type="button"
            onClick={handleEvaluate}
            className="px-2.5 py-1 rounded-lg bg-rose-900 text-white hover:bg-rose-800 shrink-0 font-medium cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* AI Evaluation Report (Rendered after Check Answer) */}
      {evaluationResult && (
        <div
          className={`p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-850 border ${statusTheme.border} space-y-5 shadow-sm`}
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Award className={`w-5 h-5 ${statusTheme.icon}`} />
              <span className="font-bold text-slate-100 text-sm">Evaluation Report</span>
              <span className={`text-xs px-2.5 py-0.5 rounded-md border ${statusTheme.badge}`}>
                {evaluationResult.verdict}
              </span>
            </div>
            <div className="text-right">
              <span className={`text-xl font-black ${statusTheme.score}`}>
                {evaluationResult.score}/100
              </span>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-300">
            {/* Feedback Summary */}
            <p className="leading-relaxed text-slate-200">
              {evaluationResult.feedback}
            </p>

            {/* What the student understood correctly */}
            {evaluationResult.understoodCorrectly && evaluationResult.understoodCorrectly.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>What You Understood Correctly</span>
                </div>
                <div className="space-y-1">
                  {evaluationResult.understoodCorrectly.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What is missing or incorrect */}
            {evaluationResult.missingOrIncorrect && evaluationResult.missingOrIncorrect.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>What is Missing or Needs Detail</span>
                </div>
                <div className="space-y-1">
                  {evaluationResult.missingOrIncorrect.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Explanation of the mistake */}
            {evaluationResult.mistakeExplanation && (
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Technical Analysis
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {evaluationResult.mistakeExplanation}
                </p>
              </div>
            )}

            {/* How the student can improve */}
            {evaluationResult.howToImprove && (
              <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-900/40 space-y-1">
                <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>How You Can Improve</span>
                </div>
                <p className="text-xs text-cyan-200/90 leading-relaxed">
                  {evaluationResult.howToImprove}
                </p>
              </div>
            )}

            {/* Rubric Breakdown */}
            {evaluationResult.rubric && evaluationResult.rubric.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Rubric Breakdown
                </div>
                {evaluationResult.rubric.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Footer (Previous Question / Next Question) */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrevQuestion}
          disabled={currentIndex === 0}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous Question</span>
        </button>

        <div className="text-xs text-slate-400">
          Question <span className="text-slate-200 font-bold">{currentIndex + 1}</span> of <span className="text-slate-200 font-bold">{activePool.length}</span>
        </div>

        <button
          id="next-question-btn"
          type="button"
          onClick={handleNextQuestion}
          className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          <span>
            {currentIndex + 1 < activePool.length ? 'Next Question' : 'Finish Unit Practice'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
