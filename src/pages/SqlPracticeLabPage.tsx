import React, { useState, useEffect, useMemo } from 'react';
import {
  Database,
  Play,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Sparkles,
  BookOpen,
  Eye,
  Copy,
  Check,
  Code2,
  Table as TableIcon,
  Lightbulb,
  AlertCircle,
  Layers,
  Award,
} from 'lucide-react';
import {
  SQL_QUESTIONS,
  SqlQuestion,
  SqlTopicId,
  UNIVERSITY_SCHEMA,
} from '../data/sqlPracticeData';
import {
  executeSql,
  verifySqlQuery,
  resetActiveDatabase,
  SqlQueryResult,
  SqlVerificationResult,
} from '../utils/sqlRunner';
import { SqlCodeEditor } from '../components/sql/SqlCodeEditor';
import { SqlResultsTable } from '../components/sql/SqlResultsTable';
import { SqlSchemaModal } from '../components/sql/SqlSchemaModal';

const TOPIC_LIST: { id: SqlTopicId; label: string; icon: string }[] = [
  { id: 'ALL', label: 'All Topics', icon: '🌐' },
  { id: 'SELECT', label: 'SELECT', icon: '🔍' },
  { id: 'WHERE', label: 'WHERE', icon: '🎯' },
  { id: 'ORDER BY', label: 'ORDER BY', icon: '↕️' },
  { id: 'GROUP BY', label: 'GROUP BY', icon: '📊' },
  { id: 'JOIN', label: 'JOIN', icon: '🔗' },
  { id: 'INSERT', label: 'INSERT', icon: '➕' },
  { id: 'UPDATE', label: 'UPDATE', icon: '✏️' },
  { id: 'DELETE', label: 'DELETE', icon: '🗑️' },
];

export const SqlPracticeLabPage: React.FC = () => {
  // Navigation & Filtering
  const [selectedTopic, setSelectedTopic] = useState<SqlTopicId>('ALL');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  // Schema Modal
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);

  // Question State
  const [userQuery, setUserQuery] = useState<string>('');
  const [showHints, setShowHints] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [solutionCopied, setSolutionCopied] = useState<boolean>(false);

  // Execution & Verification State
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [queryResult, setQueryResult] = useState<SqlQueryResult | null>(null);
  const [verificationResult, setVerificationResult] = useState<SqlVerificationResult | null>(null);
  const [activeTab, setActiveTab] = useState<'result' | 'solution' | 'expected'>('result');

  // Solved Questions Tracker (Persisted in localStorage)
  const [solvedQuestionIds, setSolvedQuestionIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('learnmate_sql_solved');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Database reset notice
  const [dbResetMessage, setDbResetMessage] = useState<string | null>(null);

  // Filter questions based on selected topic
  const filteredQuestions = useMemo(() => {
    if (selectedTopic === 'ALL') return SQL_QUESTIONS;
    return SQL_QUESTIONS.filter((q) => q.topic === selectedTopic);
  }, [selectedTopic]);

  // Current question safe accessor
  const currentQuestion: SqlQuestion =
    filteredQuestions[currentQuestionIndex] || filteredQuestions[0] || SQL_QUESTIONS[0];

  // Sync userQuery with starterQuery when switching questions
  useEffect(() => {
    if (currentQuestion) {
      setUserQuery(currentQuestion.starterQuery);
      setQueryResult(null);
      setVerificationResult(null);
      setShowHints(false);
      setShowSolution(false);
      setActiveTab('result');
    }
  }, [currentQuestion?.id]);

  // Handle Topic Change
  const handleTopicSelect = (topicId: SqlTopicId) => {
    setSelectedTopic(topicId);
    setCurrentQuestionIndex(0);
  };

  // Next Question Handler
  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Loop or go to next
      setCurrentQuestionIndex(0);
    }
  };

  // Previous Question Handler
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Reset to starter query
  const handleResetStarter = () => {
    if (currentQuestion) {
      setUserQuery(currentQuestion.starterQuery);
      setQueryResult(null);
      setVerificationResult(null);
    }
  };

  // Run SQL Handler (Executes in-memory database)
  const handleRunSql = () => {
    setIsExecuting(true);
    setTimeout(() => {
      const result = executeSql(userQuery);
      setQueryResult(result);
      setActiveTab('result');
      setIsExecuting(false);
    }, 50);
  };

  // Submit Answer Handler (Validates against expected canonical output)
  const handleSubmitAnswer = () => {
    setIsExecuting(true);
    setTimeout(() => {
      // 1. Run live query first to show results
      const runRes = executeSql(userQuery);
      setQueryResult(runRes);

      // 2. Verify answer in isolated test databases
      const verifyRes = verifySqlQuery(userQuery, currentQuestion);
      setVerificationResult(verifyRes);

      if (verifyRes.isCorrect) {
        // Mark as solved
        if (!solvedQuestionIds.includes(currentQuestion.id)) {
          const updated = [...solvedQuestionIds, currentQuestion.id];
          setSolvedQuestionIds(updated);
          try {
            localStorage.setItem('learnmate_sql_solved', JSON.stringify(updated));
          } catch {}
        }
        setShowSolution(true);
      } else {
        setActiveTab('result');
      }

      setIsExecuting(false);
    }, 60);
  };

  // Reset In-Memory Database
  const handleResetDatabase = () => {
    resetActiveDatabase();
    setDbResetMessage('In-memory database has been restored to pristine seed state.');
    setTimeout(() => setDbResetMessage(null), 3000);
    // Refresh query result if present
    if (queryResult) {
      const refreshed = executeSql(userQuery);
      setQueryResult(refreshed);
    }
  };

  // Copy Solution to Clipboard
  const handleCopySolution = () => {
    if (currentQuestion) {
      navigator.clipboard.writeText(currentQuestion.expectedQuery);
      setSolutionCopied(true);
      setTimeout(() => setSolutionCopied(false), 2000);
    }
  };

  // Apply solution to editor
  const handleApplySolutionToEditor = () => {
    if (currentQuestion) {
      setUserQuery(currentQuestion.expectedQuery);
    }
  };

  const isCurrentSolved = solvedQuestionIds.includes(currentQuestion.id);

  return (
    <div id="sql-practice-lab-container" className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* -------------------------------------------------------------
          TOP BAR & STATS HEADER
          ------------------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-500/10">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
                SQL Practice Lab
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60 text-xs font-bold">
                In-Memory DB
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Interactive sandbox with live table execution, auto-evaluator & university exam solutions.
            </p>
          </div>
        </div>

        {/* Global Action Tools */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="btn-view-schema"
            onClick={() => setIsSchemaModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700/80 transition-all cursor-pointer shadow-xs hover:border-cyan-500/50"
          >
            <TableIcon className="w-4 h-4 text-cyan-400" />
            <span>View Schema</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-900 text-cyan-300 font-mono text-[10px]">
              5 Tables
            </span>
          </button>

          <button
            id="btn-reset-db"
            onClick={handleResetDatabase}
            className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-300 text-xs font-medium flex items-center gap-1.5 border border-slate-700/60 transition-colors cursor-pointer"
            title="Restore in-memory tables to original sample data"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Reset DB</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-semibold">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Solved:</span>
            <span className="text-emerald-400 font-mono font-bold">
              {solvedQuestionIds.length} / {SQL_QUESTIONS.length}
            </span>
          </div>
        </div>
      </div>

      {/* Database Reset Alert Banner */}
      {dbResetMessage && (
        <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs flex items-center gap-2 transition-all">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{dbResetMessage}</span>
        </div>
      )}

      {/* -------------------------------------------------------------
          TOPIC SELECTOR TABS
          ------------------------------------------------------------- */}
      <div className="p-2 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-1.5 overflow-x-auto">
        {TOPIC_LIST.map((topic) => {
          const isSelected = selectedTopic === topic.id;
          const count =
            topic.id === 'ALL'
              ? SQL_QUESTIONS.length
              : SQL_QUESTIONS.filter((q) => q.topic === topic.id).length;

          return (
            <button
              key={topic.id}
              id={`topic-filter-${topic.id}`}
              onClick={() => handleTopicSelect(topic.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              <span>{topic.icon}</span>
              <span>{topic.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* -------------------------------------------------------------
          QUESTION NAVIGATION & BREADCRUMB
          ------------------------------------------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Questions ({currentQuestionIndex + 1} of {filteredQuestions.length}):
          </span>

          <div className="flex items-center gap-1.5 overflow-x-auto max-w-md py-1">
            {filteredQuestions.map((q, idx) => {
              const isSelected = idx === currentQuestionIndex;
              const isSolved = solvedQuestionIds.includes(q.id);

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 shadow-sm scale-105'
                      : isSolved
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
                  }`}
                  title={`${q.title} (${q.topic})`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Previous / Next Question Navigation */}
        <div className="flex items-center gap-2">
          <button
            id="btn-prev-question"
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-900 text-slate-300 text-xs font-semibold flex items-center gap-1 border border-slate-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          <button
            id="btn-next-question"
            onClick={handleNextQuestion}
            className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1 transition-colors shadow-sm cursor-pointer"
          >
            <span>Next Question</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------
          MAIN SPLIT WORKSPACE: PROMPT & CODE EDITOR
          ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: QUESTION CARD & DETAILS (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Question Card */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 relative">
            {/* Header: Topic, Difficulty, Solved Badge */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-800/60 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                  {currentQuestion.topic}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                    currentQuestion.difficulty === 'Easy'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                      : currentQuestion.difficulty === 'Medium'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800/60'
                      : 'bg-rose-950 text-rose-400 border border-rose-800/60'
                  }`}
                >
                  {currentQuestion.difficulty}
                </span>
              </div>

              {isCurrentSolved && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Solved</span>
                </div>
              )}
            </div>

            {/* Question Title & Description */}
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-slate-100 leading-snug">
                {currentQuestion.title}
              </h2>
              <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                {currentQuestion.description}
              </div>
            </div>

            {/* Target Tables Reference */}
            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Target Tables:</span>
              {currentQuestion.targetTables.map((t) => (
                <button
                  key={t}
                  onClick={() => setIsSchemaModalOpen(true)}
                  className="px-2 py-0.5 rounded-md bg-slate-950 hover:bg-slate-800 text-cyan-300 font-mono text-xs border border-slate-800 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Click to view schema"
                >
                  <TableIcon className="w-3 h-3 text-cyan-400" />
                  <span>{t}</span>
                </button>
              ))}
            </div>

            {/* Hints Toggle */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <button
                onClick={() => setShowHints(!showHints)}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{showHints ? 'Hide Hints' : 'Need a hint?'}</span>
              </button>

              {showHints && (
                <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-800/50 space-y-1.5 text-xs text-amber-200/90">
                  {currentQuestion.hints.map((hint, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{hint}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Verification Alert Banner (if submitted) */}
            {verificationResult && (
              <div
                className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 transition-all ${
                  verificationResult.isCorrect
                    ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-700/60 text-rose-200'
                }`}
              >
                {verificationResult.isCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1 flex-1">
                  <div className="font-bold text-slate-100 flex items-center justify-between">
                    <span>
                      {verificationResult.isCorrect ? 'Correct Query!' : 'Incorrect Output'}
                    </span>
                    {verificationResult.isCorrect && (
                      <button
                        onClick={handleNextQuestion}
                        className="px-2 py-0.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] transition-colors"
                      >
                        Next Question →
                      </button>
                    )}
                  </div>
                  <p className="text-slate-300 leading-normal">{verificationResult.feedback}</p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Schema Table Peek */}
          <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <TableIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>Quick Table Quick-Look</span>
              </span>
              <button
                onClick={() => setIsSchemaModalOpen(true)}
                className="text-cyan-400 hover:underline text-[11px] font-medium cursor-pointer"
              >
                Full Schema View →
              </button>
            </div>
            <p className="text-slate-400 text-[11px]">
              Querying over the university database: <code className="text-cyan-300">students</code> (ID, name, dept_id, gpa, semester, email), <code className="text-cyan-300">departments</code> (dept_id, dept_name, budget), <code className="text-cyan-300">courses</code>, <code className="text-cyan-300">enrollments</code>.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: CODE EDITOR & OUTPUT/TABS (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* SQL Code Editor */}
          <SqlCodeEditor
            value={userQuery}
            onChange={setUserQuery}
            onRun={handleRunSql}
            onResetStarter={handleResetStarter}
            isExecuting={isExecuting}
          />

          {/* Action Button Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
            <div className="flex items-center gap-2">
              <button
                id="btn-run-sql"
                onClick={handleRunSql}
                disabled={isExecuting}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/10 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Run SQL</span>
              </button>

              <button
                id="btn-submit-answer"
                onClick={handleSubmitAnswer}
                disabled={isExecuting}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/10 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-toggle-solution"
                onClick={() => {
                  setShowSolution(!showSolution);
                  if (!showSolution) setActiveTab('solution');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  showSolution
                    ? 'bg-indigo-950 text-indigo-300 border-indigo-700/80'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700/60'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span>{showSolution ? 'Hide Solution' : 'Show Solution'}</span>
              </button>

              <span className="text-[11px] text-slate-500 hidden sm:inline">
                Ctrl+Enter to Run
              </span>
            </div>
          </div>

          {/* Results & Solution Tabs Bar */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-1">
            <button
              onClick={() => setActiveTab('result')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'result'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Query Result</span>
            </button>

            {showSolution && (
              <button
                onClick={() => setActiveTab('solution')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'solution'
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Correct Query & Explanation</span>
              </button>
            )}
          </div>

          {/* TAB 1: QUERY RESULTS TABLE */}
          {activeTab === 'result' && (
            <SqlResultsTable result={queryResult} isExecuting={isExecuting} />
          )}

          {/* TAB 2: SOLUTION & EXPLANATION CARD */}
          {activeTab === 'solution' && showSolution && (
            <div
              id="sql-solution-explanation-card"
              className="p-5 rounded-3xl bg-slate-900 border border-indigo-800/50 shadow-2xl space-y-4"
            >
              {/* Header with Copy & Apply */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-950 border border-indigo-800/60 text-indigo-300 text-xs font-bold">
                    Canonical SQL Solution
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {currentQuestion.topic} Topic Breakdown
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleApplySolutionToEditor}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium flex items-center gap-1 border border-slate-700/60 transition-colors"
                    title="Insert canonical solution into editor"
                  >
                    <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Try in Editor</span>
                  </button>

                  <button
                    onClick={handleCopySolution}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium flex items-center gap-1 border border-slate-700/60 transition-colors"
                  >
                    {solutionCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Code Box */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto select-all">
                {currentQuestion.expectedQuery}
              </div>

              {/* Simple Explanation Overview */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Simple Explanation
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentQuestion.explanation.overview}
                </p>
              </div>

              {/* Key Clauses Breakdown */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Key Clauses Breakdown
                </h4>
                <div className="space-y-1 text-xs text-slate-300">
                  {currentQuestion.explanation.keyClauses.map((clause, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-1.5 rounded-lg bg-slate-950/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>{clause}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Mistakes */}
              {currentQuestion.explanation.commonMistakes.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">
                    Common Mistakes to Avoid
                  </h4>
                  <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 pl-1">
                    {currentQuestion.explanation.commonMistakes.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* University Exam Tip */}
              <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-100">University DBMS Exam Tip: </span>
                  <span>{currentQuestion.explanation.examTip}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* -------------------------------------------------------------
          SCHEMA MODAL DIALOG
          ------------------------------------------------------------- */}
      <SqlSchemaModal
        isOpen={isSchemaModalOpen}
        onClose={() => setIsSchemaModalOpen(false)}
        initialTable={currentQuestion.targetTables[0] || 'students'}
      />
    </div>
  );
};
