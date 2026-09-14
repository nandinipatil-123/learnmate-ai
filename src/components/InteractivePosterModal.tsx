import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Download,
  Copy,
  Check,
  Share2,
  Maximize2,
  Minimize2,
  Database,
  Layers,
  ShieldCheck,
  Cpu,
  Info,
} from 'lucide-react';
import { InteractivePosterData } from '../data/dbmsSyllabus';

interface InteractivePosterModalProps {
  poster: InteractivePosterData;
  onClose: () => void;
}

export const InteractivePosterModal: React.FC<InteractivePosterModalProps> = ({ poster, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activePillarIndex, setActivePillarIndex] = useState<number | null>(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleCopySummary = () => {
    const text = `📚 ${poster.topicTitle} — ${poster.unitTitle}
${poster.subtitle}

🔑 Core Concepts:
${poster.pillars.map((p) => `• ${p.title} (${p.badge}): ${p.summary}`).join('\n')}

🌐 Real-World Example (${poster.realWorldExample.domain}):
${poster.realWorldExample.dbmsSolution}

📌 Key Takeaway:
${poster.keyTakeaway}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="interactive-poster-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="interactive-poster-container"
        className={`w-full bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all my-auto ${
          isFullscreen ? 'max-w-7xl h-[95vh]' : 'max-w-5xl max-h-[90vh]'
        }`}
      >
        {/* Poster Top Bar Controls */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Interactive Learning Poster • {poster.unitTitle}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="copy-poster-summary-btn"
              type="button"
              onClick={handleCopySummary}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
              title="Copy Concept Summary"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Summary</span>
                </>
              )}
            </button>

            <button
              id="print-poster-btn"
              type="button"
              onClick={handlePrint}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700 hidden sm:flex"
              title="Print / Save PDF"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700 hidden sm:flex"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              id="close-poster-btn"
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer border border-slate-700"
              title="Close Poster"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Poster Printable & Scrollable Canvas */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
          {/* Header Banner */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-950 via-cyan-950/40 to-slate-950 border border-cyan-500/30 relative overflow-hidden shadow-lg">
            <div className="absolute right-4 -top-8 text-cyan-500/10 pointer-events-none select-none">
              <Database className="w-48 h-48" />
            </div>

            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-600/50 text-cyan-300 text-xs font-semibold">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span>DBMS MASTER INFOGRAPHIC • {poster.unitTitle}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {poster.topicTitle}
              </h1>

              <p className="text-sm sm:text-base text-cyan-200/90 max-w-3xl leading-relaxed">
                {poster.subtitle}
              </p>
            </div>
          </div>

          {/* Core Concept Pillars (Interactive Grid) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Core Concept Pillars (Click to Inspect)</span>
              </h3>
              <span className="text-[11px] text-slate-500">Interactive Architecture</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {poster.pillars.map((pillar, idx) => {
                const isActive = activePillarIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setActivePillarIndex(isActive ? null : idx)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer text-left space-y-2.5 ${
                      isActive
                        ? 'bg-slate-850 border-cyan-400 shadow-md ring-1 ring-cyan-400/40'
                        : 'bg-slate-950/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{pillar.iconSymbol}</span>
                        <span className="font-bold text-sm text-slate-100">{pillar.title}</span>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 shrink-0">
                        {pillar.badge}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {pillar.summary}
                    </p>

                    {isActive && (
                      <div className="pt-2 border-t border-slate-750 text-xs text-cyan-300 bg-cyan-950/30 p-2.5 rounded-lg">
                        <strong className="block text-[11px] uppercase tracking-wider text-cyan-400 mb-0.5">
                          Technical Invariant:
                        </strong>
                        {pillar.keyDetail}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Two Columns: Visual Architecture Diagram & Real-World Case Study */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Visual Flow / ASCII Diagram Card */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  <Cpu className="w-4 h-4" />
                  <span>Visual Architecture Flow</span>
                </div>
                <span className="text-[11px] text-slate-500">Relational Mechanics</span>
              </div>

              <pre className="p-4 rounded-xl bg-slate-900 border border-slate-850 font-mono text-xs text-cyan-300 overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                {poster.visualDiagram.asciiArt}
              </pre>

              <p className="text-xs text-slate-400 leading-relaxed">
                {poster.visualDiagram.explanation}
              </p>
            </div>

            {/* Real-World DBMS Implementation Card */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    <Database className="w-4 h-4" />
                    <span>Real-World DBMS Production Scenario</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                    {poster.realWorldExample.domain}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40">
                    <strong className="text-rose-400 block mb-1">Production Challenge:</strong>
                    <span className="text-slate-300">{poster.realWorldExample.problem}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-900/40">
                    <strong className="text-cyan-400 block mb-1">Relational Solution:</strong>
                    <span className="text-slate-300">{poster.realWorldExample.dbmsSolution}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40">
                    <strong className="text-emerald-400 block mb-1">Measured Engineering Impact:</strong>
                    <span className="text-slate-300">{poster.realWorldExample.impact}</span>
                  </div>
                </div>
              </div>

              {/* Exam Formula & Key Takeaway */}
              <div className="pt-3 border-t border-slate-850 space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Exam Rule / Condition:</span>
                </div>
                <p className="text-xs text-slate-300 font-mono bg-slate-900 p-2.5 rounded-lg border border-slate-850">
                  {poster.examFormula.rule}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Takeaway Ribbon */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-slate-950 border border-cyan-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-cyan-300">
              <Info className="w-4 h-4 shrink-0 text-cyan-400" />
              <span>
                <strong>Key Takeaway:</strong> {poster.keyTakeaway}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors cursor-pointer shrink-0"
            >
              Done & Return to Topic
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
