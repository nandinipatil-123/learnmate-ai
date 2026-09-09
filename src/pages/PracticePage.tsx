import React, { useState } from 'react';
import {
  PenTool,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Lightbulb,
  FileCode,
  ArrowRight,
  Award
} from 'lucide-react';

export const PracticePage: React.FC = () => {
  const [answer, setAnswer] = useState(
    'The candidate key is (StudentID, CourseID). CourseTitle depends solely on CourseID which is a partial key. Therefore, decompose into R1(StudentID, CourseID, Grade) and R2(CourseID, CourseTitle).'
  );
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<null | {
    score: number;
    verdict: string;
    rubric: string[];
    feedback: string;
  }>({
    score: 95,
    verdict: 'Excellent Breakdown',
    rubric: [
      'Correct Candidate Key Identification: (StudentID, CourseID)',
      'Identified Partial Dependency: CourseID → CourseTitle',
      'Lossless Join Decomposition Preserved'
    ],
    feedback: 'Your answer is mathematically sound and directly addresses 2NF rules. You correctly identified that CourseTitle violates 2NF due to partial dependency.'
  });

  const handleEvaluate = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);
      setEvaluationResult({
        score: 95,
        verdict: 'Excellent Breakdown',
        rubric: [
          'Correct Candidate Key Identification: (StudentID, CourseID)',
          'Identified Partial Dependency: CourseID → CourseTitle',
          'Lossless Join Decomposition Preserved'
        ],
        feedback: 'Your answer is mathematically sound and directly addresses 2NF rules. You correctly identified that CourseTitle violates 2NF due to partial dependency.'
      });
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
            <PenTool className="w-3.5 h-3.5" />
            <span>Practice Sandbox • Active Problem #12</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">
            Decomposition into Second Normal Form (2NF)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Write your answer below. The LearnMate evaluation engine checks your logic, key derivations, and formal notation.
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300 shrink-0">
          Difficulty: <span className="font-semibold text-amber-400">Medium</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Problem Statement
          </span>
          <span className="text-xs text-cyan-400 font-mono">DBMS-NORM-204</span>
        </div>

        <div className="space-y-3 text-sm text-slate-200">
          <p className="font-medium text-slate-100">
            Consider the relation schema <code className="text-cyan-300 font-mono">R(StudentID, CourseID, CourseTitle, Grade)</code> with functional dependencies:
          </p>
          <div className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 border border-slate-800 space-y-1">
            <div>(StudentID, CourseID) → Grade</div>
            <div>CourseID → CourseTitle</div>
          </div>
          <p className="text-slate-300">
            1. State the candidate key(s) of relation <code className="text-cyan-300 font-mono">R</code>.<br />
            2. Explain why <code className="text-cyan-300 font-mono">R</code> is not in 2NF.<br />
            3. Decompose <code className="text-cyan-300 font-mono">R</code> into 2NF relations while preserving dependencies.
          </p>
        </div>
      </div>

      {/* Answer Box */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="practice-answer-box" className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <FileCode className="w-4 h-4 text-cyan-400" />
            <span>Your Solution</span>
          </label>
          <span className="text-xs text-slate-500">
            {answer.length} characters
          </span>
        </div>

        <textarea
          id="practice-answer-box"
          rows={6}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your reasoning, key calculations, and final decomposed schemas here..."
          className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-200 font-mono text-sm leading-relaxed outline-none transition-all resize-y"
        />

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Tip: Ensure all non-prime attributes are fully functionally dependent.</span>
          </div>

          <button
            id="evaluate-answer-btn"
            onClick={handleEvaluate}
            disabled={isEvaluating || !answer.trim()}
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {isEvaluating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Evaluating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Evaluate Answer</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Evaluation Output Section */}
      {evaluationResult && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-850 border border-emerald-800/40 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-slate-100 text-sm">Evaluation Report</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                {evaluationResult.verdict}
              </span>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-emerald-400">{evaluationResult.score}/100</span>
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-300">
            <p className="leading-relaxed text-slate-200">
              {evaluationResult.feedback}
            </p>

            <div className="space-y-1.5 pt-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Rubric Breakdown
              </div>
              {evaluationResult.rubric.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
