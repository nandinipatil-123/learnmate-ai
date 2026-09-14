import React, { useState, useMemo, useEffect } from 'react';
import {
  Palette,
  Sparkles,
  BookOpen,
  Search,
  ArrowRight,
  Database,
  ChevronRight,
  Layers,
  Filter,
} from 'lucide-react';
import { NavPage } from '../types';
import { DBMS_SYLLABUS, DBMSTopicItem, DBMSUnit } from '../data/dbmsSyllabus';
import {
  getTopicPoster,
  getVisualFormatBadge,
  determineVisualFormat,
} from '../data/dbmsPosterData';
import { getTopicPosterImage } from '../data/dbmsPosterImages';
import { TopicPosterCard } from '../components/TopicPosterCard';

interface PosterLearningPageProps {
  onNavigate: (page: NavPage) => void;
}

export const PosterLearningPage: React.FC<PosterLearningPageProps> = ({
  onNavigate,
}) => {
  // Selected Unit & Topic states
  const [selectedUnitId, setSelectedUnitId] = useState<
    'unit-1' | 'unit-2' | 'unit-3' | 'unit-4' | 'unit-5'
  >('unit-1');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Scroll to top when topic changes
  useEffect(() => {
    if (selectedTopicId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedTopicId]);

  // Current Unit object
  const currentUnit = useMemo<DBMSUnit>(() => {
    return (
      DBMS_SYLLABUS.find((u) => u.id === selectedUnitId) || DBMS_SYLLABUS[0]
    );
  }, [selectedUnitId]);

  // All topics flat list for searching
  const allTopics = useMemo<DBMSTopicItem[]>(() => {
    return DBMS_SYLLABUS.flatMap((u) => u.topics);
  }, []);

  // Filtered topics within selected unit (or across syllabus if search query provided)
  const displayedTopics = useMemo<DBMSTopicItem[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return currentUnit.topics;
    }
    return allTopics.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.shortDesc.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.unitTitle.toLowerCase().includes(q)
    );
  }, [currentUnit, searchQuery, allTopics]);

  // Selected topic object (if any)
  const currentTopic = useMemo<DBMSTopicItem | null>(() => {
    if (!selectedTopicId) return null;
    return allTopics.find((t) => t.id === selectedTopicId) || null;
  }, [selectedTopicId, allTopics]);

  // Generate poster data for selected topic
  const posterData = useMemo(() => {
    if (!currentTopic) return null;
    return getTopicPoster(currentTopic.unitId, currentTopic.name);
  }, [currentTopic]);

  // Stepper handlers (Next / Prev topic in syllabus)
  const currentTopicIndex = useMemo(() => {
    if (!currentTopic) return -1;
    return allTopics.findIndex((t) => t.id === currentTopic.id);
  }, [currentTopic, allTopics]);

  const hasPrev = currentTopicIndex > 0;
  const hasNext = currentTopicIndex >= 0 && currentTopicIndex < allTopics.length - 1;

  const handlePrev = () => {
    if (hasPrev) {
      const prev = allTopics[currentTopicIndex - 1];
      setSelectedUnitId(prev.unitId);
      setSelectedTopicId(prev.id);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      const next = allTopics[currentTopicIndex + 1];
      setSelectedUnitId(next.unitId);
      setSelectedTopicId(next.id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5 px-2 sm:px-4 py-2 sm:py-4">
      {/* -------------------------------------------------------------
          1. SUBJECT HEADER & BREADCRUMB
          ------------------------------------------------------------- */}
      <div
        id="poster-learning-header"
        className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/60 text-cyan-300 text-xs font-semibold">
              <Database className="w-3.5 h-3.5" />
              <span>Subject: CS-302 DBMS</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-medium">
              57 Syllabus Topics
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <span>🎨 Poster Learning</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Visual summary posters with smart diagrams, key rules, and high-yield exam takeaways for every syllabus topic.
          </p>
        </div>

        {/* Search Topic input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="poster-topic-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topic (e.g. BCNF, 2PL, ACID)..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-xs focus:outline-hidden focus:border-cyan-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* -------------------------------------------------------------
          2. IF A TOPIC IS SELECTED: SHOW INDIVIDUAL POSTER
          ------------------------------------------------------------- */}
      {currentTopic && posterData ? (
        <div className="space-y-4">
          {/* Breadcrumb Bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 px-1">
            <button
              onClick={() => setSelectedTopicId(null)}
              className="hover:text-cyan-400 transition-colors flex items-center gap-1"
            >
              <Database className="w-3.5 h-3.5" />
              <span>DBMS</span>
            </button>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <button
              onClick={() => setSelectedTopicId(null)}
              className="hover:text-cyan-400 transition-colors"
            >
              {posterData.unitTitle}
            </button>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="font-semibold text-cyan-300">
              {posterData.topicTitle}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
              🎨 Learning Poster
            </span>
          </div>

          {/* Reusable Poster Component */}
          <TopicPosterCard
            poster={posterData}
            onBack={() => setSelectedTopicId(null)}
            onPrevTopic={handlePrev}
            onNextTopic={handleNext}
            hasPrevTopic={hasPrev}
            hasNextTopic={hasNext}
          />
        </div>
      ) : (
        /* -------------------------------------------------------------
            3. HIERARCHICAL NAVIGATION: UNITS -> TOPICS
            ------------------------------------------------------------- */
        <div className="space-y-4">
          {/* Unit Selector Tabs (5 Units) */}
          {!searchQuery && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select Unit
                </span>
                <span className="text-[11px] text-slate-500">
                  5 Syllabus Units
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                {DBMS_SYLLABUS.map((unit) => {
                  const isSelected = unit.id === selectedUnitId;
                  return (
                    <button
                      key={unit.id}
                      id={`unit-selector-btn-${unit.id}`}
                      onClick={() => {
                        setSelectedUnitId(unit.id);
                        setSelectedTopicId(null);
                      }}
                      className={`p-3 rounded-xl text-left transition-all border ${
                        isSelected
                          ? 'bg-slate-850 border-cyan-500 shadow-md ring-1 ring-cyan-500/30'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700/80 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider ${
                            isSelected ? 'text-cyan-400' : 'text-slate-400'
                          }`}
                        >
                          {unit.title.split('–')[0]?.trim()}
                        </span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                          {unit.topics.length} Posters
                        </span>
                      </div>
                      <div className="font-bold text-xs text-slate-100 line-clamp-1">
                        {unit.title.split('–')[1]?.trim() || unit.title}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Topics List Header */}
          <div className="flex items-center justify-between px-1 pt-2 border-t border-slate-800/80">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                <span>
                  {searchQuery ? `Search Results (${displayedTopics.length})` : currentUnit.title}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {searchQuery
                  ? `Showing all syllabus topics matching "${searchQuery}"`
                  : currentUnit.subtitle}
              </p>
            </div>
            <span className="text-xs font-semibold text-cyan-400 hidden sm:block">
              {displayedTopics.length} Topics with Dedicated Posters
            </span>
          </div>

          {/* Topics Cards Grid */}
          <div
            id="poster-topics-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
          >
            {displayedTopics.map((topic) => {
              const visualFormat = determineVisualFormat(topic.name);
              const formatLabel = getVisualFormatBadge(visualFormat);
              const posterImgMeta = getTopicPosterImage(topic.name, topic.unitId);

              return (
                <div
                  key={topic.id}
                  id={`topic-poster-card-${topic.id}`}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-800/60 transition-all flex flex-col justify-between space-y-3 group shadow-xs"
                >
                  <div className="space-y-2.5">
                    {/* Visual Poster Thumbnail Preview */}
                    <div
                      className="w-full h-32 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 relative cursor-pointer"
                      onClick={() => {
                        setSelectedUnitId(topic.unitId);
                        setSelectedTopicId(topic.id);
                      }}
                      title={`Open AI Poster for ${topic.name}`}
                    >
                      <img
                        src={posterImgMeta.imageUrl}
                        alt={`Poster preview for ${topic.name}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                      />
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-slate-950/85 backdrop-blur-xs text-[10px] font-bold text-cyan-300 border border-cyan-800/60 shadow-xs">
                        AI Poster
                      </div>
                    </div>

                    {/* Category and Smart Visual Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700/60">
                        {topic.category}
                      </span>
                      <span className="text-[10px] font-semibold text-cyan-300 px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/50">
                        🎨 {formatLabel}
                      </span>
                    </div>

                    {/* Topic Title */}
                    <h3 className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors leading-snug">
                      {topic.name}
                    </h3>

                    {/* Topic Short Description */}
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {topic.shortDesc}
                    </p>
                  </div>

                  {/* Prominent Action Button: View Learning Poster */}
                  <button
                    id={`view-poster-btn-${topic.id}`}
                    onClick={() => {
                      setSelectedUnitId(topic.unitId);
                      setSelectedTopicId(topic.id);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-slate-700/60 cursor-pointer group-hover:border-cyan-500"
                  >
                    <span>🎨 View Learning Poster</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {displayedTopics.length === 0 && (
            <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <p className="text-slate-300 text-sm font-medium">
                No topics found matching "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-cyan-400 text-xs font-semibold hover:bg-slate-750"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
