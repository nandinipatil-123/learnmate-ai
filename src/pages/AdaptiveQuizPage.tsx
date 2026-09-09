import React, { useState } from 'react';
import {
  Gamepad2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Zap,
  RotateCcw,
  Trophy,
  Brain
} from 'lucide-react';
import { DEMO_QUIZ_QUESTIONS } from '../data/mockData';

export const AdaptiveQuizPage: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(3);

  const currentQ = DEMO_QUIZ_QUESTIONS[currentIdx] || DEMO_QUIZ_QUESTIONS[0];

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
    if (selectedOption === currentQ.correctIndex) {
      setScore((prev) => prev + 10);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    if (currentIdx < DEMO_QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Loop back or reset for demo
      setCurrentIdx(0);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Quiz Header & Adaptive Engine Status */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
            <Gamepad2 className="w-4 h-4" />
            <span>Adaptive Engine • Real-time Calibration</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">
            Concept Mastery Sprint
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Questions adapt in real-time based on your response time and accuracy.
          </p>
        </div>

        {/* Difficulty Indicator */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-750 text-right">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">
              Difficulty Indicator
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-bold text-amber-300">
                {currentQ.difficulty} (ELO 1450)
              </span>
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-750 text-right">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">
              Quiz Streak
            </div>
            <div className="text-xs font-bold text-cyan-300 flex items-center justify-end gap-1 mt-0.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
              <span>{streak} in a row</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-sm">
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
          <span>Question {currentIdx + 1} of {DEMO_QUIZ_QUESTIONS.length}</span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-400 font-medium">
            Topic: {currentQ.topic}
          </span>
        </div>

        <div className="text-base sm:text-lg font-bold text-slate-100 leading-snug">
          {currentQ.question}
        </div>

        {/* 4 Options */}
        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.correctIndex;

            let optionStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850';

            if (isSubmitted) {
              if (isSelected && isCorrect) {
                optionStyle = 'bg-emerald-950/50 border-emerald-500 text-emerald-300';
              } else if (isSelected && !isCorrect) {
                optionStyle = 'bg-rose-950/50 border-rose-500 text-rose-300';
              } else if (isCorrect) {
                optionStyle = 'bg-emerald-950/30 border-emerald-600/80 text-emerald-300';
              } else {
                optionStyle = 'bg-slate-950/60 border-slate-850 text-slate-500 opacity-60';
              }
            } else if (isSelected) {
              optionStyle = 'bg-cyan-500/10 border-cyan-500 text-cyan-300 shadow-xs shadow-cyan-500/10';
            }

            return (
              <button
                key={idx}
                id={`quiz-option-${idx}`}
                disabled={isSubmitted}
                onClick={() => setSelectedOption(idx)}
                className={`w-full p-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-between text-left ${optionStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-slate-400">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </div>

                {isSubmitted && isSelected && (
                  isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )
                )}
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {selectedOption === null
              ? 'Select an option to proceed'
              : !isSubmitted
              ? 'Ready to evaluate'
              : 'Result verified by LearnMate'}
          </div>

          {!isSubmitted ? (
            <button
              id="submit-answer-btn"
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center gap-2 transition-all shadow-sm hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40"
            >
              <span>Submit Answer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="next-question-btn"
              onClick={handleNext}
              className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm flex items-center gap-2 transition-all shadow-sm hover:scale-[1.01]"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Feedback Card after Submit */}
        {isSubmitted && (
          <div
            className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed space-y-1.5 ${
              selectedOption === currentQ.correctIndex
                ? 'bg-emerald-950/20 border-emerald-800/60 text-emerald-300'
                : 'bg-rose-950/20 border-rose-800/60 text-rose-300'
            }`}
          >
            <div className="font-bold flex items-center gap-2">
              {selectedOption === currentQ.correctIndex ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Correct! Dynamic Difficulty Increased (+10 pts)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>Incorrect. Calibrating review focus...</span>
                </>
              )}
            </div>
            <p className="text-slate-300 pt-1">
              <strong>Explanation:</strong> {currentQ.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
