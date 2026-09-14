import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Download,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Award,
  Lightbulb,
  Table,
  CheckCircle2,
  Layers,
  ShieldAlert,
  ArrowRight,
  Code2,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RefreshCw,
  Info,
  Eye,
  X,
} from 'lucide-react';
import { TopicPosterData } from '../data/dbmsPosterData';
import { getTopicPosterImage, PosterImageMetadata } from '../data/dbmsPosterImages';

interface TopicPosterCardProps {
  poster: TopicPosterData;
  onBack?: () => void;
  onPrevTopic?: () => void;
  onNextTopic?: () => void;
  hasPrevTopic?: boolean;
  hasNextTopic?: boolean;
}

export const TopicPosterCard: React.FC<TopicPosterCardProps> = ({
  poster,
  onBack,
  onPrevTopic,
  onNextTopic,
  hasPrevTopic,
  hasNextTopic,
}) => {
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'poster_image' | 'both' | 'schematic'>('poster_image');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [modelNotice, setModelNotice] = useState<string | null>(null);
  const [promptCopied, setPromptCopied] = useState(false);

  const posterImageMeta: PosterImageMetadata = useMemo(() => {
    return getTopicPosterImage(poster.topicTitle, poster.unitId);
  }, [poster.topicTitle, poster.unitId]);

  const activeImageUrl = customImage || posterImageMeta.imageUrl;

  const handleDownloadImage = () => {
    const link = document.createElement('a');
    link.href = activeImageUrl;
    link.download = `${poster.topicTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}_poster.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(posterImageMeta.generationPrompt);
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 2000);
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    setModelNotice(null);
    try {
      const res = await fetch('/api/generate-poster-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicName: poster.topicTitle,
          unitTitle: poster.unitTitle,
          prompt: posterImageMeta.generationPrompt,
        }),
      });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        setCustomImage(data.imageUrl);
      } else {
        setModelNotice(
          data.modelInfo ||
            'Live Gemini image generation requires "gemini-3.1-flash-image" with a paid API key in Settings > Secrets. LearnMate provides high-resolution pre-rendered AI posters for all topics.'
        );
      }
    } catch (err: any) {
      setModelNotice(
        'Live Gemini image generation requires "gemini-3.1-flash-image". LearnMate provides authentic AI-generated posters for all syllabus topics.'
      );
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleCopy = () => {
    const text = `🎨 DBMS Learning Poster: ${poster.topicTitle} (${poster.unitTitle})

📖 Summary:
${poster.simpleExplanation}

🔑 Key Points:
${poster.keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}

💡 Remember This:
${poster.rememberThis}

🎯 Exam Focus:
• ${poster.examFocus.highYieldTip}
• Frequent Question: ${poster.examFocus.frequentQuestion}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id={`poster-container-${poster.topicId}`}
      className={`w-full transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-slate-950/95 overflow-y-auto p-4 sm:p-8 backdrop-blur-md'
          : 'relative'
      }`}
    >
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
        {/* Navigation & Action Bar */}
        <div className="flex items-center justify-between gap-2 p-3 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center gap-2 sm:gap-3">
            {onBack && (
              <button
                id="poster-back-btn"
                onClick={onBack}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700/60"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Topics</span>
              </button>
            )}

            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/60 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{poster.unitTitle}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Topic Steppers */}
            {onPrevTopic && (
              <button
                id="poster-prev-topic-btn"
                onClick={onPrevTopic}
                disabled={!hasPrevTopic}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 hover:text-white text-xs font-medium transition-colors border border-slate-700/60 flex items-center gap-1"
                title="Previous Topic"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden md:inline">Prev</span>
              </button>
            )}

            {onNextTopic && (
              <button
                id="poster-next-topic-btn"
                onClick={onNextTopic}
                disabled={!hasNextTopic}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 hover:text-white text-xs font-medium transition-colors border border-slate-700/60 flex items-center gap-1"
                title="Next Topic"
              >
                <span className="hidden md:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            <div className="h-4 w-px bg-slate-750 mx-1 hidden sm:block" />

            {/* Copy Summary */}
            <button
              id="poster-copy-summary-btn"
              onClick={handleCopy}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700/60"
              title="Copy Summary"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Copy</span>
                </>
              )}
            </button>

            {/* Print / Save PDF */}
            <button
              id="poster-print-btn"
              onClick={handlePrint}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700/60"
              title="Print Poster / Save PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PDF</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              id="poster-fullscreen-toggle-btn"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs transition-colors border border-slate-700/60"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* -------------------------------------------------------------
            MAIN POSTER CANVAS
            ------------------------------------------------------------- */}
        <div
          id="learning-poster-sheet"
          className="rounded-3xl bg-slate-900/95 border-2 border-slate-800 shadow-2xl p-5 sm:p-8 space-y-6 relative overflow-hidden"
        >
          {/* Subtle Decorative Background Aura */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* 1. POSTER TITLE & BADGES */}
          <div className="border-b border-slate-800/80 pb-5 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-950/70 border border-indigo-800/60 text-indigo-300 text-[11px] font-bold uppercase tracking-wider">
                {poster.unitTitle}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-cyan-950/70 border border-cyan-800/60 text-cyan-300 text-[11px] font-semibold flex items-center gap-1">
                <span>🎨 {poster.visualFormatLabel}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] font-medium">
                {poster.category}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-100 tracking-tight">
              {poster.topicTitle}
            </h1>
          </div>

          {/* 2. SIMPLE EXPLANATION */}
          <div
            id="poster-simple-explanation"
            className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5"
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Simple Explanation</span>
            </div>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              {poster.simpleExplanation}
            </p>
          </div>

          {/* 3. IMPORTANT CONCEPTS (Pills/Badges) */}
          <div id="poster-important-concepts" className="space-y-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Important Concepts
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {poster.importantConcepts.map((concept, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-850/80 border border-slate-750/70 space-y-1 hover:border-cyan-800/60 transition-colors"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-xs text-slate-100">
                      {concept.name}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">
                      {concept.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-snug">
                    {concept.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* VIEW SELECTOR TABS & ACTION BAR */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center gap-1.5">
              <button
                id="tab-poster-image"
                onClick={() => setActiveTab('poster_image')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'poster_image'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>🖼️ AI Poster Image</span>
              </button>
              <button
                id="tab-schematic"
                onClick={() => setActiveTab('schematic')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'schematic'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>📊 Schematic Diagram</span>
              </button>
              <button
                id="tab-both"
                onClick={() => setActiveTab('both')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'both'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>✨ Both Views</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-download-poster-img"
                onClick={handleDownloadImage}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700/60"
                title="Download Poster Image"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Download Poster</span>
              </button>
              <button
                id="btn-zoom-lightbox"
                onClick={() => {
                  setZoomLevel(1);
                  setIsLightboxOpen(true);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700/60"
                title="Zoom into Poster in HD"
              >
                <ZoomIn className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Zoom HD</span>
              </button>
            </div>
          </div>

          {/* 4A. AI EDUCATIONAL POSTER IMAGE HERO */}
          {(activeTab === 'poster_image' || activeTab === 'both') && (
            <div id="ai-poster-image-container" className="space-y-3">
              <div className="p-3 sm:p-5 rounded-3xl bg-slate-950 border-2 border-cyan-800/40 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Poster Image Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 text-xs font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{posterImageMeta.badge}</span>
                    </span>
                    <span className="text-xs text-slate-400 hidden sm:inline font-medium">
                      {posterImageMeta.archetype}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id="copy-prompt-btn"
                      onClick={handleCopyPrompt}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] font-medium flex items-center gap-1 border border-slate-800 transition-colors"
                      title="Copy AI Prompt"
                    >
                      {promptCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied Prompt</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-400" />
                          <span>Copy Prompt</span>
                        </>
                      )}
                    </button>
                    <button
                      id="regenerate-poster-btn"
                      onClick={handleRegenerate}
                      disabled={isRegenerating}
                      className="px-2.5 py-1 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 text-[11px] font-semibold flex items-center gap-1 border border-indigo-750/60 disabled:opacity-50 transition-colors"
                      title="Regenerate with Gemini Image"
                    >
                      <RefreshCw className={`w-3 h-3 ${isRegenerating ? 'animate-spin' : ''}`} />
                      <span>{isRegenerating ? 'Generating...' : 'Live AI Generate'}</span>
                    </button>
                  </div>
                </div>

                {/* Model / Quota Notice */}
                {modelNotice && (
                  <div className="mb-3 p-3 rounded-xl bg-indigo-950/40 border border-indigo-700/50 text-xs text-indigo-200 flex items-start gap-2">
                    <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-100">AI Image Model Status</p>
                      <p className="text-slate-300">{modelNotice}</p>
                    </div>
                  </div>
                )}

                {/* Actual AI-Generated Poster Image */}
                <div
                  className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center cursor-pointer shadow-inner"
                  onClick={() => {
                    setZoomLevel(1);
                    setIsLightboxOpen(true);
                  }}
                  title="Click to zoom in high-definition"
                >
                  <img
                    id="current-topic-poster-img"
                    src={activeImageUrl}
                    alt={`AI Educational Poster - ${poster.topicTitle}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto max-h-[640px] object-contain rounded-2xl transition-transform duration-300 hover:scale-[1.01]"
                  />

                  {/* Click to Zoom Overlay Indicator */}
                  <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-700/80 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg opacity-85 hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Click to Zoom HD</span>
                  </div>
                </div>

                {/* Visual Highlights of the Poster */}
                <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {posterImageMeta.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/60 text-xs text-slate-300 flex items-center gap-2"
                    >
                      <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                      <span className="line-clamp-1">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4B. APPROPRIATE SMART VISUAL DIAGRAM / FLOWCHART / COMPARISON */}
          {(activeTab === 'schematic' || activeTab === 'both') && (
            <div id="poster-smart-visual-section" className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Visual Diagram • {poster.visualData.title}</span>
              </h2>
              <span className="text-[11px] text-slate-400">
                {poster.visualFormatLabel}
              </span>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800/90 shadow-inner">
              {/* SUBTITLE */}
              {poster.visualData.subtitle && (
                <p className="text-xs text-slate-400 mb-4 text-center">
                  {poster.visualData.subtitle}
                </p>
              )}

              {/* RENDER DYNAMIC VISUAL FORMAT BASED ON TYPE */}
              {/* A. Comparison Format */}
              {poster.visualFormat === 'comparison' && poster.visualData.comparisonData && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-300 font-semibold bg-slate-900/80">
                        <th className="p-2.5 sm:p-3 w-1/4">Evaluation Feature</th>
                        <th className="p-2.5 sm:p-3 w-3/8 text-rose-300 bg-rose-950/20">
                          {poster.visualData.comparisonData.leftTitle}
                        </th>
                        <th className="p-2.5 sm:p-3 w-3/8 text-emerald-300 bg-emerald-950/20">
                          {poster.visualData.comparisonData.rightTitle}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {poster.visualData.comparisonData.rows.map((row, idx) => (
                        <tr
                          key={idx}
                          className={`hover:bg-slate-900/50 transition-colors ${
                            row.highlight ? 'bg-cyan-950/15' : ''
                          }`}
                        >
                          <td className="p-2.5 sm:p-3 font-semibold text-slate-200">
                            {row.feature}
                          </td>
                          <td className="p-2.5 sm:p-3 text-slate-300 bg-rose-950/10">
                            {row.left}
                          </td>
                          <td className="p-2.5 sm:p-3 text-slate-200 font-medium bg-emerald-950/10">
                            {row.right}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* B. Four-Part Format (e.g., ACID Properties) */}
              {poster.visualFormat === 'four_part' && poster.visualData.fourPartData && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {poster.visualData.fourPartData.parts.map((part, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-2 hover:border-cyan-700/60 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-black text-lg flex items-center justify-center">
                          {part.letter}
                        </span>
                        <span className="text-xl">{part.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-100 mt-1">
                          {part.name}
                        </h3>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
                          {part.tag}
                        </span>
                        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                          {part.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* C. ER Diagram Format */}
              {poster.visualFormat === 'er_diagram' && poster.visualData.erData && (
                <div className="space-y-4">
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                    {/* Entity 1 */}
                    <div className="w-full lg:w-1/3 p-3.5 rounded-xl border-2 border-cyan-500/60 bg-cyan-950/20 text-center space-y-2">
                      <div className="font-bold text-xs text-cyan-300 tracking-wider">
                        [ ENTITY: {poster.visualData.erData.entities[0]?.name} ]
                      </div>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {poster.visualData.erData.entities[0]?.attributes.map(
                          (attr, i) => (
                            <span
                              key={i}
                              className={`text-[10px] px-2 py-0.5 rounded-full border ${
                                attr.includes('(PK)')
                                  ? 'border-amber-500/70 bg-amber-950/40 text-amber-300 font-bold underline'
                                  : 'border-slate-700 bg-slate-800 text-slate-300'
                              }`}
                            >
                              ( {attr} )
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    {/* Diamond Relationship */}
                    <div className="flex flex-col items-center justify-center px-4 py-2">
                      <div className="w-24 h-24 rotate-45 border-2 border-indigo-500/70 bg-indigo-950/30 flex items-center justify-center">
                        <span className="-rotate-45 text-center font-bold text-[11px] text-indigo-300 leading-tight">
                          {poster.visualData.erData.relationship.name}
                          <br />
                          <span className="text-[9px] text-indigo-400 font-normal">
                            {poster.visualData.erData.relationship.cardinality}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Entity 2 */}
                    <div className="w-full lg:w-1/3 p-3.5 rounded-xl border-2 border-emerald-500/60 bg-emerald-950/20 text-center space-y-2">
                      <div className="font-bold text-xs text-emerald-300 tracking-wider">
                        [ ENTITY: {poster.visualData.erData.entities[1]?.name} ]
                      </div>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {poster.visualData.erData.entities[1]?.attributes.map(
                          (attr, i) => (
                            <span
                              key={i}
                              className={`text-[10px] px-2 py-0.5 rounded-full border ${
                                attr.includes('(PK)')
                                  ? 'border-amber-500/70 bg-amber-950/40 text-amber-300 font-bold underline'
                                  : 'border-slate-700 bg-slate-800 text-slate-300'
                              }`}
                            >
                              ( {attr} )
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-xs text-slate-300 text-center">
                    📌 {poster.visualData.erData.participation}
                  </div>
                </div>
              )}

              {/* D. Visual Flow Format (e.g. Normalization 1NF -> 2NF -> 3NF -> BCNF) */}
              {poster.visualFormat === 'visual_flow' && poster.visualData.flowData && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {poster.visualData.flowData.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-2 relative hover:border-cyan-800/60 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                          Step {step.stepNum}
                        </span>
                        {idx < 3 && (
                          <ArrowRight className="w-4 h-4 text-cyan-400 hidden lg:block" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-100">
                          {step.title}
                        </h4>
                        <p className="text-[11px] text-cyan-400 font-medium mt-0.5">
                          {step.subtitle}
                        </p>
                        <p className="text-xs text-slate-300 mt-1.5 leading-snug">
                          {step.condition}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-slate-800/80 text-[10px] text-emerald-400 font-medium">
                        ✓ {step.eliminatedAnomaly}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* E. SQL Syntax + Example + Result */}
              {poster.visualFormat === 'sql_syntax' && poster.visualData.sqlData && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {/* Syntax Block */}
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Command Syntax: {poster.visualData.sqlData.command}</span>
                      </div>
                      <pre className="p-2.5 rounded-lg bg-slate-950 font-mono text-[11px] sm:text-xs text-slate-200 overflow-x-auto leading-relaxed border border-slate-800/80">
                        {poster.visualData.sqlData.syntax}
                      </pre>
                    </div>

                    {/* Example SQL */}
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Example Schema & DDL/DML</span>
                      </div>
                      <pre className="p-2.5 rounded-lg bg-slate-950 font-mono text-[11px] sm:text-xs text-emerald-300 overflow-x-auto leading-relaxed border border-slate-800/80">
                        {poster.visualData.sqlData.exampleCode}
                      </pre>
                    </div>
                  </div>

                  {/* Sample Query Execution Output */}
                  {poster.visualData.sqlData.sampleResult && (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                        <span>Query Execution Result Table:</span>
                        <span className="text-[11px] text-slate-400">
                          {poster.visualData.sqlData.explanation}
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-800 text-slate-300 font-bold bg-slate-950">
                              {poster.visualData.sqlData.sampleResult.headers.map(
                                (h, i) => (
                                  <th key={i} className="p-2">
                                    {h}
                                  </th>
                                )
                              )}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                            {poster.visualData.sqlData.sampleResult.rows.map(
                              (row, i) => (
                                <tr key={i} className="hover:bg-slate-850">
                                  {row.map((cell, j) => (
                                    <td key={j} className="p-2 text-slate-200">
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* F. Relational Algebra (Table + Operator + Result) */}
              {poster.visualFormat === 'relational_algebra' && poster.visualData.algebraData && (
                <div className="space-y-4">
                  {/* Operator Formula Banner */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-cyan-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold text-lg flex items-center justify-center">
                        {poster.visualData.algebraData.operatorSymbol}
                      </span>
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-slate-100">
                          {poster.visualData.algebraData.operatorName}
                        </div>
                        <div className="font-mono text-xs text-cyan-400">
                          {poster.visualData.algebraData.formula}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {poster.visualData.algebraData.explanation}
                    </span>
                  </div>

                  {/* Input Tables & Result Table Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    {/* Relation R */}
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                      <div className="text-xs font-bold text-slate-300">
                        {poster.visualData.algebraData.relationR.name}
                      </div>
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950">
                            {poster.visualData.algebraData.relationR.headers.map(
                              (h, i) => (
                                <th key={i} className="p-1.5">
                                  {h}
                                </th>
                              )
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                          {poster.visualData.algebraData.relationR.rows.map(
                            (row, i) => (
                              <tr key={i}>
                                {row.map((c, j) => (
                                  <td key={j} className="p-1.5 text-slate-300">
                                    {c}
                                  </td>
                                ))}
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Relation S (if present) */}
                    {poster.visualData.algebraData.relationS && (
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                        <div className="text-xs font-bold text-slate-300">
                          {poster.visualData.algebraData.relationS.name}
                        </div>
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950">
                              {poster.visualData.algebraData.relationS.headers.map(
                                (h, i) => (
                                  <th key={i} className="p-1.5">
                                    {h}
                                  </th>
                                )
                              )}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                            {poster.visualData.algebraData.relationS.rows.map(
                              (row, i) => (
                                <tr key={i}>
                                  {row.map((c, j) => (
                                    <td key={j} className="p-1.5 text-slate-300">
                                      {c}
                                    </td>
                                  ))}
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Result Relation */}
                    <div className="p-3 rounded-xl bg-slate-900 border-2 border-cyan-800/70 space-y-1.5 bg-cyan-950/15">
                      <div className="text-xs font-bold text-cyan-300">
                        Output: {poster.visualData.algebraData.resultRelation.name}
                      </div>
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 text-cyan-200 font-semibold bg-slate-950">
                            {poster.visualData.algebraData.resultRelation.headers.map(
                              (h, i) => (
                                <th key={i} className="p-1.5">
                                  {h}
                                </th>
                              )
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                          {poster.visualData.algebraData.resultRelation.rows.map(
                            (row, i) => (
                              <tr key={i}>
                                {row.map((c, j) => (
                                  <td key={j} className="p-1.5 text-slate-100">
                                    {c}
                                  </td>
                                ))}
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* G. Process Flow (e.g. Transaction Processing) */}
              {poster.visualFormat === 'process_flow' && poster.visualData.processData && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                    {poster.visualData.processData.stages.map((stage, idx) => {
                      const colorClass =
                        stage.stateType === 'active'
                          ? 'border-cyan-500/70 bg-cyan-950/25 text-cyan-300'
                          : stage.stateType === 'success'
                          ? 'border-emerald-500/70 bg-emerald-950/25 text-emerald-300'
                          : stage.stateType === 'failure'
                          ? 'border-rose-500/70 bg-rose-950/25 text-rose-300'
                          : 'border-slate-700 bg-slate-900 text-slate-300';

                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border ${colorClass} flex flex-col justify-between space-y-1.5`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                              State #{stage.id}
                            </span>
                            <span className="w-2 h-2 rounded-full bg-current" />
                          </div>
                          <div className="font-bold text-xs">{stage.name}</div>
                          <p className="text-[11px] text-slate-300 leading-snug">
                            {stage.note}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 text-center">
                    🔄 {poster.visualData.processData.summary}
                  </div>
                </div>
              )}

              {/* H. Concurrency Control (Lock Protocol & Diagram) */}
              {poster.visualFormat === 'lock_diagram' && poster.visualData.lockData && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {/* Lock Types & Compatibility */}
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="text-xs font-bold text-slate-200">
                        Lock Types & Rules
                      </div>
                      <div className="space-y-2">
                        {poster.visualData.lockData.lockTypes.map((lt, i) => (
                          <div
                            key={i}
                            className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-0.5"
                          >
                            <span className="font-bold text-cyan-300">
                              {lt.name} Lock:
                            </span>{' '}
                            <span className="text-slate-300">{lt.rule}</span>
                            <div className="text-[10px] text-slate-400">
                              Compatibility: {lt.compatibility}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="text-xs font-bold text-slate-200">
                        2PL Execution Timeline
                      </div>
                      <div className="space-y-1.5 font-mono text-[11px]">
                        {poster.visualData.lockData.timelineSteps.map((step, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-1.5 rounded bg-slate-950 border border-slate-800/80 text-slate-300"
                          >
                            <span className="text-cyan-400 font-bold">
                              {step.time}
                            </span>
                            <span>T1: {step.actionT1}</span>
                            <span className="text-[10px] text-slate-400 font-sans">
                              ({step.status})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-800/50 text-xs text-cyan-300 text-center font-medium">
                    ⚡ {poster.visualData.lockData.phaseDesc}
                  </div>
                </div>
              )}

              {/* I. Disk Storage (Disk Block / Slotted Page Layout) */}
              {poster.visualFormat === 'disk_diagram' && poster.visualData.diskData && (
                <div className="space-y-4">
                  {/* Storage Hierarchy */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {poster.visualData.diskData.layers.map((layer, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-0.5"
                      >
                        <div className="font-bold text-xs text-slate-200">
                          {layer.label}
                        </div>
                        <div className="text-[10px] text-cyan-400 font-medium">
                          {layer.size} • {layer.subLabel}
                        </div>
                        <p className="text-[10px] text-slate-400">{layer.role}</p>
                      </div>
                    ))}
                  </div>

                  {/* Slotted Page Layout Box */}
                  <div className="p-4 rounded-xl border-2 border-slate-700 bg-slate-900 space-y-2">
                    <div className="p-2 rounded-lg bg-indigo-950/40 border border-indigo-800 text-center text-xs font-bold text-indigo-300">
                      {poster.visualData.diskData.blockLayout.header}
                    </div>

                    <div className="space-y-1 font-mono text-[11px]">
                      {poster.visualData.diskData.blockLayout.recordSlots.map(
                        (slot, i) => (
                          <div
                            key={i}
                            className="p-1.5 rounded bg-slate-950 border border-slate-800 text-slate-300 flex items-center justify-between"
                          >
                            <span>{slot}</span>
                            <span className="text-cyan-400 font-bold">
                              ▼ points to record
                            </span>
                          </div>
                        )
                      )}
                    </div>

                    <div className="py-2 text-center text-[10px] text-amber-400 font-bold border-y border-dashed border-slate-700">
                      {poster.visualData.diskData.blockLayout.freeSpace}
                    </div>
                  </div>
                </div>
              )}

              {/* J. Concept Grid (Fallback & Architectural Topics) */}
              {poster.visualFormat === 'concept_grid' && poster.visualData.conceptGridData && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {poster.visualData.conceptGridData.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 hover:border-cyan-800/60 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-100">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-snug">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          )}

          {/* 5. 4–6 KEY POINTS */}
          <div id="poster-key-points-section" className="space-y-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Key Points (High-Yield Takeaways)</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {poster.keyPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-850/60 border border-slate-800 flex items-start gap-2.5 hover:border-slate-700 transition-colors"
                >
                  <span className="w-5 h-5 rounded-full bg-cyan-500/15 text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-snug">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 6. SIMPLE EXAMPLE */}
          <div
            id="poster-simple-example"
            className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Table className="w-3.5 h-3.5" />
                <span>Simple Example: {poster.simpleExample.title}</span>
              </div>
              <span className="text-[11px] text-slate-400">
                {poster.simpleExample.context}
              </span>
            </div>

            <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed whitespace-pre-wrap">
              {poster.simpleExample.codeOrSample}
            </pre>

            <div className="text-xs text-slate-300 font-medium pt-1 flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">Key Insight:</span>
              <span>{poster.simpleExample.takeaway}</span>
            </div>
          </div>

          {/* 7. REMEMBER THIS (Callout Box) */}
          <div
            id="poster-remember-this"
            className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/20 border border-amber-500/40 flex items-start gap-3 shadow-md"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Remember This
              </span>
              <p className="text-sm font-semibold text-slate-100 mt-0.5 leading-relaxed">
                {poster.rememberThis}
              </p>
            </div>
          </div>

          {/* 8. EXAM FOCUS */}
          <div
            id="poster-exam-focus"
            className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-indigo-800/40 space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
                <Award className="w-3.5 h-3.5" />
                <span>Exam Focus & High-Yield Strategy</span>
              </div>
              {poster.examFocus.marksWeightage && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                  {poster.examFocus.marksWeightage}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="font-bold text-slate-200">
                  🎯 University Exam Tip:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {poster.examFocus.highYieldTip}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="font-bold text-slate-200">
                  ❓ Frequently Asked Question:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  "{poster.examFocus.frequentQuestion}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          HIGH-DEFINITION POSTER LIGHTBOX MODAL
          ------------------------------------------------------------- */}
      {isLightboxOpen && (
        <div
          id="poster-image-lightbox"
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-between p-3 sm:p-6"
        >
          {/* Lightbox Top Controls */}
          <div className="w-full max-w-5xl flex items-center justify-between p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-white z-10 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 text-xs font-bold border border-cyan-800">
                HD Poster Viewer
              </span>
              <span className="text-sm font-bold text-slate-100 hidden sm:inline truncate max-w-md">
                {poster.topicTitle}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold px-2 text-slate-300">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                title="Reset Zoom"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleDownloadImage}
                className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors"
                title="Download Poster Image"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-200 transition-colors ml-2"
                title="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Canvas */}
          <div className="w-full flex-1 overflow-auto flex items-center justify-center p-4 my-2">
            <img
              src={activeImageUrl}
              alt={`HD Educational Poster - ${poster.topicTitle}`}
              referrerPolicy="no-referrer"
              style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.15s ease-out' }}
              className="max-h-[85vh] max-w-full object-contain rounded-2xl shadow-2xl origin-center"
            />
          </div>

          {/* Lightbox Footer */}
          <div className="text-center text-xs text-slate-400 pb-2">
            Tip: Use the zoom controls or scroll to inspect diagram notations, symbols, and formulas in crystal-clear resolution.
          </div>
        </div>
      )}
    </div>
  );
};
