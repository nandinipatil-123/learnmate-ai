import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Boxes,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Layers,
  MessageSquareQuote,
  Zap,
  Loader2,
  AlertCircle,
  Database,
  Search,
  ChevronDown,
  ChevronUp,
  Bookmark,
  ExternalLink,
} from 'lucide-react';
import { TeachContent, AdaptiveTeachResponse } from '../types';
import {
  DBMS_SYLLABUS,
  ALL_DBMS_TOPICS,
  generateTopicPoster,
  InteractivePosterData,
  DBMSTopicItem,
} from '../data/dbmsSyllabus';
import { InteractivePosterModal } from '../components/InteractivePosterModal';
import { recordLearnedTopic } from '../data/practiceQuestions';

const INITIAL_NORMALIZATION_CONTENT: TeachContent = {
  topicTitle: 'DBMS Normalization (1NF → 2NF → 3NF → BCNF)',
  simpleExplanation: {
    headline: 'Normalization is organizing database tables to eliminate redundancy and avoid data modification anomalies.',
    paragraphs: [
      'Normalization is the formal process of decomposing relational tables to eliminate data redundancy and ensure data dependencies make logical sense.',
      'In a university or enterprise database, unnormalized tables cause three severe anomalies: Insertion anomalies (unable to record data without unneeded foreign attributes), Update anomalies (inconsistent data across rows), and Deletion anomalies (accidental loss of essential facts).',
    ],
    keyPoints: [
      'Eliminate data redundancy (storing customer addresses or instructor offices in exactly one relational boundary).',
      'Prevent Update, Insertion, and Deletion anomalies across concurrent database transactions.',
      'Ensure lossless-join decomposition: joining decomposed tables reproduces the original table with zero spurious tuples.',
      'Preserve functional dependencies whenever possible across normal forms.',
    ],
    rulesOfThumb: [
      { label: '1NF', rule: 'Atomic values only (no multi-valued lists or repeating groups in a single attribute).' },
      { label: '2NF', rule: '1NF + No partial functional dependency on composite candidate keys.' },
      { label: '3NF', rule: '2NF + No transitive functional dependencies (X → Y → Z where Z is non-prime).' },
      { label: 'BCNF', rule: 'Strict: For every non-trivial dependency X → Y, X must be a superkey.' },
    ],
  },
  realWorldAnalogy: {
    analogyTitle: 'The "Single Giant E-Commerce Spreadsheet" Disaster',
    story: "Imagine an online retail company recording customer names, phone numbers, home addresses, product categories, warehouse addresses, and shipping details inside one single 500,000-row spreadsheet table.",
    breakdownPoints: [
      {
        title: 'Update Anomaly',
        description: 'When a customer updates their phone number, 80 past order rows must be manually updated. Missing one row leads to conflicting data.',
      },
      {
        title: 'Insert Anomaly',
        description: "You cannot enter a newly introduced warehouse into the database until a customer actually orders an item stored there.",
      },
      {
        title: 'Delete Anomaly',
        description: 'If you delete the only past order for a discontinued product, you accidentally purge the warehouse location and supplier records forever.',
      },
    ],
    solutionTakeaway: 'Decompose into 4 clean relations: Customers, Orders, OrderItems, and Warehouses connected via foreign keys. That is Normalization.',
  },
  visualExplanation: {
    subtitle: 'Relational Schema Decomposition (Unnormalized → 2NF & 3NF)',
    diagramAscii: `Problematic 1NF Table: Student_Enrollment
Composite Primary Key: (StudentID, CourseID)
+-----------+----------+-------------+-----------------------------+------------+
| StudentID | CourseID | StudentName | CourseTitle (Partial Dep!)  | FinalGrade |
+-----------+----------+-------------+-----------------------------+------------+
| S101      | CS302    | Nandini     | DBMS                        | A          |
| S102      | CS302    | Alex        | DBMS (Duplicated)           | B+         |
+-----------+----------+-------------+-----------------------------+------------+
⚠️ CourseTitle depends only on CourseID, violating 2NF!

         ⬇ Decompose into 2NF relations via Lossless Natural Join ⬇

[ Table 1: Courses ]                      [ Table 2: Enrollments ]
PK: CourseID                              PK: (StudentID, CourseID)
+----------+-------------+                +-----------+----------+------------+
| CourseID | CourseTitle |                | StudentID | CourseID | FinalGrade |
+----------+-------------+                +-----------+----------+------------+
| CS302    | DBMS        |                | S101      | CS302    | A          |
+----------+-------------+                | S102      | CS302    | B+         |
                                          +-----------+----------+------------+`,
    diagramExplanation: 'CourseTitle is decoupled into Courses table, while Enrollments preserves grades mapped strictly to (StudentID, CourseID).',
  },
  simpleExample: {
    subtitle: 'Step-by-step mathematical formalization',
    context: 'Relation Schema R(EmpID, ProjectID, EmpName, ProjectBudget, HoursWorked) with FDs: EmpID → EmpName, ProjectID → ProjectBudget, (EmpID, ProjectID) → HoursWorked.',
    codeOrData: `Relation: R(EmpID, ProjectID, EmpName, ProjectBudget, HoursWorked)
Candidate Key: (EmpID, ProjectID)
FD 1: EmpID → EmpName           (Partial dependency - violates 2NF)
FD 2: ProjectID → ProjectBudget (Partial dependency - violates 2NF)
FD 3: (EmpID, ProjectID) → HoursWorked (Full dependency)`,
    stepsOrBreakdown: [
      'Candidate Key: (EmpID, ProjectID).',
      'Why it fails 2NF: Non-prime attributes EmpName and ProjectBudget depend on proper subsets of the candidate key.',
      'Decomposition into 2NF: Employee(EmpID, EmpName), Project(ProjectID, ProjectBudget), Assignment(EmpID, ProjectID, HoursWorked).',
    ],
    conclusion: 'All resulting tables satisfy 2NF and 3NF, ensuring zero redundant storage of employee names or project budgets.',
  },
  checkUnderstanding: {
    question: 'In relation R(A, B, C) with Primary Key (A, B), which Functional Dependency directly causes a violation of 2NF?',
    options: [
      'A → C (Attribute C depends only on A, a proper subset of the key)',
      '(A, B) → C (Attribute C depends on the entire candidate key)',
      'C → (A, B) (Attribute C determines candidate key)',
      'None of the above',
    ],
    correctIndex: 0,
    explanation: 'A → C is a partial dependency because C depends on attribute A, which is only a part of the composite primary key (A, B). 2NF strictly prohibits non-prime attributes from depending on a proper subset of a composite candidate key.',
  },
  alternateExplanation: {
    title: 'The Single Source of Truth Rule',
    text: "Think of an enterprise CRM: If a customer's phone number is written in 50 order rows, modifying it requires updating all 50 rows. If one update fails, your data becomes contradictory. Normalization simply means: 'Every fact in your database should be recorded in exactly one place.' When you need multiple facts together, use SQL JOINs to reconnect them on the fly.",
  },
};

const DBMS_QUICK_PROMPTS = [
  'Normalization (1NF → BCNF)',
  'File System vs DBMS',
  'ACID Properties',
  'Two-Phase Locking',
  'Relational Algebra Joins',
  'E-R Diagrams',
  'Triggers',
  'Integrity Constraints over Relations',
];

export const LearnPage: React.FC = () => {
  const [topicInput, setTopicInput] = useState('Normalization (1NF → 2NF → 3NF → BCNF)');
  const [content, setContent] = useState<TeachContent>(INITIAL_NORMALIZATION_CONTENT);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alternateMode, setAlternateMode] = useState(false);
  const [isAdaptiveLoading, setIsAdaptiveLoading] = useState(false);
  const [adaptiveAttempt, setAdaptiveAttempt] = useState(0);
  const [usedStrategies, setUsedStrategies] = useState<string[]>([]);
  const [adaptiveError, setAdaptiveError] = useState<string | null>(null);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Syllabus state
  const [selectedUnitId, setSelectedUnitId] = useState<string>('all');
  const [syllabusSearch, setSyllabusSearch] = useState('');
  const [isSyllabusCollapsed, setIsSyllabusCollapsed] = useState(false);

  // Interactive Poster modal state
  const [posterData, setPosterData] = useState<InteractivePosterData | null>(null);
  const [showPosterModal, setShowPosterModal] = useState(false);

  const selectedSubject = 'DBMS';

  const handleOpenPoster = () => {
    const poster = generateTopicPoster(content.topicTitle, content);
    setPosterData(poster);
    setShowPosterModal(true);
  };

  const executeTeach = async (rawTopic: string, subjectOverride?: 'DBMS' | 'Java' | 'DSA') => {
    const topicToLearn = rawTopic.trim();
    if (!topicToLearn) {
      setError('Please enter a question, topic, or concept to learn.');
      return;
    }

    const currentSubject = subjectOverride || selectedSubject;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/teach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topicToLearn,
          subject: currentSubject,
          previousTopic: content?.topicTitle,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error || `Request failed with status ${response.status}`);
      }

      const data: TeachContent = await response.json();
      setContent(data);
      if (data?.topicTitle) {
        recordLearnedTopic(data.topicTitle);
      }
      setQuizSelected(null);
      setQuizSubmitted(false);
      setAlternateMode(false);
      setAdaptiveAttempt(0);
      setUsedStrategies([]);
      setAdaptiveError(null);
    } catch (err: any) {
      console.error('Teach Me request error:', err);
      setError(err.message || 'Unable to generate explanation right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeachMe = (e: React.FormEvent) => {
    e.preventDefault();
    executeTeach(topicInput);
  };

  const handleStillDontGetIt = async () => {
    if (isAdaptiveLoading) return;

    setIsAdaptiveLoading(true);
    setAdaptiveError(null);
    setAlternateMode(true);

    const nextAttempt = adaptiveAttempt + 1;

    try {
      const response = await fetch('/api/adaptive-teach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: content.topicTitle,
          subject: selectedSubject,
          previousExplanation: {
            headline: content.simpleExplanation?.headline,
            analogyTitle: content.realWorldAnalogy?.analogyTitle,
            previousAlternate: content.alternateExplanation?.text,
          },
          attemptCount: nextAttempt,
          usedStrategies: usedStrategies,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error || `Adaptive explanation failed with status ${response.status}`);
      }

      const data: AdaptiveTeachResponse = await response.json();
      setAdaptiveAttempt(nextAttempt);
      setUsedStrategies((prev) => [...prev, data.strategy]);
      setContent((prev) => ({
        ...prev,
        alternateExplanation: {
          title: data.title,
          text: data.text,
          strategy: data.strategy,
          attemptNumber: nextAttempt,
        },
      }));
    } catch (err: any) {
      console.error('Adaptive teaching request error:', err);
      setAdaptiveError(err.message || 'Unable to adapt explanation right now. Please try again.');
    } finally {
      setIsAdaptiveLoading(false);
    }
  };

  const filteredTopics = ALL_DBMS_TOPICS.filter((topic) => {
    const matchesUnit = selectedUnitId === 'all' || topic.unitId === selectedUnitId;
    const matchesSearch =
      !syllabusSearch.trim() ||
      topic.name.toLowerCase().includes(syllabusSearch.toLowerCase()) ||
      topic.shortDesc.toLowerCase().includes(syllabusSearch.toLowerCase()) ||
      topic.category.toLowerCase().includes(syllabusSearch.toLowerCase());
    return matchesUnit && matchesSearch;
  });

  const handleSelectTopic = (topicName: string) => {
    setTopicInput(topicName);
    executeTeach(topicName);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Syllabus Explorer Component */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  Official Curriculum
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  5 Units • 57 Core Topics
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
                DATABASE MANAGEMENT SYSTEMS (DBMS)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSyllabusCollapsed(!isSyllabusCollapsed)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
            >
              {isSyllabusCollapsed ? (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span>Browse Syllabus ({ALL_DBMS_TOPICS.length})</span>
                </>
              ) : (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span>Minimize Syllabus</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Syllabus Body */}
        {!isSyllabusCollapsed && (
          <div className="space-y-4 pt-1 animate-in fade-in duration-200">
            {/* Unit Filter Tabs & Search Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedUnitId('all')}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedUnitId === 'all'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  All Units ({ALL_DBMS_TOPICS.length})
                </button>
                {DBMS_SYLLABUS.map((unit) => (
                  <button
                    key={unit.id}
                    type="button"
                    onClick={() => setSelectedUnitId(unit.id)}
                    className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                      selectedUnitId === unit.id
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    {unit.id.toUpperCase().replace('-', ' ')} ({unit.topics.length})
                  </button>
                ))}
              </div>

              {/* Search Within Syllabus */}
              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={syllabusSearch}
                  onChange={(e) => setSyllabusSearch(e.target.value)}
                  placeholder="Filter syllabus topics..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:border-cyan-500 outline-none"
                />
              </div>
            </div>

            {/* Topics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[300px] overflow-y-auto p-1 pr-2">
              {filteredTopics.map((topic) => {
                const isActive = content.topicTitle.toLowerCase().includes(topic.name.toLowerCase());
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => handleSelectTopic(topic.name)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                      isActive
                        ? 'bg-cyan-950/50 border-cyan-500 ring-1 ring-cyan-500/40 text-cyan-200'
                        : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-xs leading-snug line-clamp-1">{topic.name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-850 text-slate-400 border border-slate-750 shrink-0">
                        {topic.unitTitle}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{topic.shortDesc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Concept Deconstruct & Search Area */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/50 text-cyan-400 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DBMS AI Deconstruct & Re-teaching Engine</span>
            </div>

            <span className="text-xs font-semibold text-slate-400">
              Subject: <strong className="text-cyan-400">Database Management Systems</strong>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            What DBMS concept would you like to master?
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Type any question or concept from the 5 DBMS units (e.g. Normalization, SQL Joins, Triggers, ACID, 2PL). LearnMate provides full 5-perspective mastery.
          </p>
        </div>

        <form onSubmit={handleTeachMe} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                id="struggle-input"
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="e.g. Explain Normalization (1NF to BCNF), SQL Joins, Two-Phase Locking..."
                disabled={isLoading}
                className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-750 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-100 placeholder-slate-500 text-sm sm:text-base outline-none transition-all shadow-inner disabled:opacity-60"
              />
            </div>
            <button
              id="teach-me-btn"
              type="submit"
              disabled={isLoading}
              className={`px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all shrink-0 cursor-pointer ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>🧠 Teach Me</span>
                </>
              )}
            </button>
          </div>

          {/* Quick DBMS prompt chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-400">Quick Study Topics:</span>
            {DBMS_QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setTopicInput(prompt);
                  executeTeach(prompt);
                }}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700/60 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Loading state indicator */}
      {isLoading && (
        <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/50 flex items-center gap-3 text-cyan-300 text-sm animate-pulse">
          <Loader2 className="w-5 h-5 animate-spin text-cyan-400 shrink-0" />
          <span>
            LearnMate is analyzing <strong>"{topicInput.trim() || 'your concept'}"</strong> and generating your 5-layer DBMS explanation...
          </span>
        </div>
      )}

      {/* Error Banner with Retry Option */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => executeTeach(topicInput)}
            disabled={isLoading}
            className="px-3.5 py-1.5 rounded-lg bg-rose-900 hover:bg-rose-800 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Active Topic Banner with Visible "Generate Interactive Poster" Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active DBMS Topic:
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
              DATABASE SYSTEMS
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-cyan-400 mt-0.5">
            {content.topicTitle}
          </h3>
        </div>

        {/* Visible "Generate Interactive Poster" Button */}
        <button
          id="generate-interactive-poster-btn"
          type="button"
          onClick={handleOpenPoster}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-400 hover:from-cyan-300 hover:to-indigo-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0 border border-cyan-300/40"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>Generate Interactive Poster</span>
        </button>
      </div>

      {/* 5 Learning Cards Container */}
      <div className="space-y-6">
        {/* Card 1: Simple Explanation */}
        <div
          id="card-simple-explanation"
          className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-750 transition-colors shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">
                  1. Simple Explanation
                </h3>
                <p className="text-xs text-slate-400">The core theoretical foundation in plain English</p>
              </div>
            </div>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60">
              Foundational
            </span>
          </div>

          <div className="text-sm text-slate-300 leading-relaxed space-y-3 pt-1">
            <p className="text-slate-100 font-medium">
              {content.simpleExplanation.headline}
            </p>

            {content.simpleExplanation.paragraphs?.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}

            {content.simpleExplanation.keyPoints && content.simpleExplanation.keyPoints.length > 0 && (
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                {content.simpleExplanation.keyPoints.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            )}

            {content.simpleExplanation.rulesOfThumb && content.simpleExplanation.rulesOfThumb.length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-750 text-xs space-y-2">
                <div className="font-semibold text-cyan-300">Quick Rules of Thumb:</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-300">
                  {content.simpleExplanation.rulesOfThumb.map((rule, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="font-bold text-slate-100">{rule.label}:</span> {rule.rule}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Real-World Analogy */}
        <div
          id="card-real-world-analogy"
          className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-750 transition-colors shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">
                  2. Real-World Analogy
                </h3>
                <p className="text-xs text-slate-400">How to conceptualize this in everyday life</p>
              </div>
            </div>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800/60">
              Mental Model
            </span>
          </div>

          <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-800/30 text-sm text-slate-200 leading-relaxed space-y-3">
            <div className="flex items-start gap-2.5">
              <MessageSquareQuote className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-slate-100 mb-1">
                  {content.realWorldAnalogy.analogyTitle}:
                </p>
                <p className="text-slate-300 text-xs sm:text-sm">
                  {content.realWorldAnalogy.story}
                </p>
              </div>
            </div>

            {content.realWorldAnalogy.breakdownPoints && content.realWorldAnalogy.breakdownPoints.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs pt-1">
                {content.realWorldAnalogy.breakdownPoints.map((point, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                    <span className="font-bold text-rose-400 block mb-1">{point.title}</span>
                    <span className="text-slate-300">{point.description}</span>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs sm:text-sm text-indigo-300 font-medium">
              👉 <strong>Solution:</strong> {content.realWorldAnalogy.solutionTakeaway}
            </p>
          </div>
        </div>

        {/* Card 3: Visual Explanation */}
        <div
          id="card-visual-explanation"
          className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-750 transition-colors shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">
                  3. Visual Explanation
                </h3>
                <p className="text-xs text-slate-400">{content.visualExplanation.subtitle}</p>
              </div>
            </div>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60">
              Visual Architecture
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <pre className="p-4 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs sm:text-sm text-cyan-300 overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
              {content.visualExplanation.diagramAscii}
            </pre>

            {content.visualExplanation.diagramExplanation && (
              <p className="text-xs text-slate-400 pt-1">
                {content.visualExplanation.diagramExplanation}
              </p>
            )}

            {content.visualExplanation.visualBlocks && content.visualExplanation.visualBlocks.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {content.visualExplanation.visualBlocks.map((block, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-xs font-semibold text-cyan-400 mb-1">{block.title}</div>
                    <pre className="text-[11px] font-mono text-slate-300 bg-slate-950 p-2 rounded border border-slate-850 overflow-x-auto whitespace-pre-wrap">
                      {block.codeOrSchema}
                    </pre>
                    {block.annotation && (
                      <p className="text-[10px] text-slate-400 mt-1">{block.annotation}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Card 4: Simple Example */}
        <div
          id="card-simple-example"
          className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-750 transition-colors shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Boxes className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">
                  4. Simple Example
                </h3>
                <p className="text-xs text-slate-400">{content.simpleExample.subtitle}</p>
              </div>
            </div>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800/60">
              Exam Ready
            </span>
          </div>

          <div className="space-y-3 text-sm text-slate-300">
            <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-750 space-y-2">
              <div className="text-xs font-bold text-amber-300">Scenario / Context:</div>
              <p className="text-xs text-slate-200">
                {content.simpleExample.context}
              </p>

              {content.simpleExample.codeOrData && (
                <div className="pt-1">
                  <pre className="font-mono text-xs text-slate-200 bg-slate-900 p-2.5 rounded border border-slate-800 overflow-x-auto whitespace-pre-wrap">
                    {content.simpleExample.codeOrData}
                  </pre>
                </div>
              )}
            </div>

            {content.simpleExample.stepsOrBreakdown && content.simpleExample.stepsOrBreakdown.length > 0 && (
              <div className="text-xs leading-relaxed space-y-1.5 text-slate-300 pt-1">
                {content.simpleExample.stepsOrBreakdown.map((step, idx) => (
                  <p key={idx}>{step}</p>
                ))}
              </div>
            )}

            {content.simpleExample.conclusion && (
              <p className="text-xs font-medium text-amber-300/90 pt-1">
                📌 {content.simpleExample.conclusion}
              </p>
            )}
          </div>
        </div>

        {/* Card 5: Check Your Understanding */}
        <div
          id="card-check-understanding"
          className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-750 transition-colors shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">
                  5. Check Your Understanding
                </h3>
                <p className="text-xs text-slate-400">Interactive sanity check to lock in the concept</p>
              </div>
            </div>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60">
              Self-Test
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-850 border border-slate-750 space-y-3">
            <p className="text-sm font-semibold text-slate-100">
              Question: {content.checkUnderstanding.question}
            </p>

            <div className="space-y-2">
              {content.checkUnderstanding.options.map((optText, optIdx) => {
                const isSelected = quizSelected === optIdx;
                const isCorrect = optIdx === content.checkUnderstanding.correctIndex;

                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => {
                      setQuizSelected(optIdx);
                      setQuizSubmitted(true);
                    }}
                    className={`w-full text-left p-3 rounded-xl text-xs sm:text-sm font-medium border transition-all flex items-center justify-between cursor-pointer ${
                      quizSubmitted && isSelected
                        ? isCorrect
                          ? 'bg-emerald-950/40 border-emerald-600 text-emerald-300'
                          : 'bg-rose-950/40 border-rose-600 text-rose-300'
                        : quizSubmitted && isCorrect
                        ? 'bg-emerald-950/20 border-emerald-700/60 text-emerald-300'
                        : isSelected
                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span>{optText}</span>
                    {quizSubmitted && isSelected && (
                      isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer and explanation revealed ONLY after selecting an option */}
            {quizSubmitted && (
              <div
                className={`p-3 rounded-lg text-xs leading-relaxed mt-2 ${
                  quizSelected === content.checkUnderstanding.correctIndex
                    ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800'
                    : 'bg-rose-950/40 text-rose-300 border border-rose-800'
                }`}
              >
                {quizSelected === content.checkUnderstanding.correctIndex ? (
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                    <div>
                      <strong className="block mb-0.5">Correct!</strong>
                      <span>{content.checkUnderstanding.explanation}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                    <div>
                      <strong className="block mb-0.5">Not quite.</strong>
                      <span>{content.checkUnderstanding.explanation}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Prominent Section: I STILL DON'T GET IT */}
        {content && (
          <div className="pt-4 pb-2 text-center space-y-3">
            <button
              id="still-dont-get-it-btn"
              type="button"
              onClick={handleStillDontGetIt}
              disabled={isAdaptiveLoading}
              className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-black text-base sm:text-lg shadow-lg shadow-rose-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-rose-400/30 ${
                isAdaptiveLoading ? 'opacity-80 cursor-wait' : ''
              }`}
            >
              {isAdaptiveLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>ADAPTING EXPLANATION...</span>
                </>
              ) : (
                <>
                  <span className="text-xl">😭</span>
                  <span>I STILL DON'T GET IT</span>
                </>
              )}
            </button>
            <p className="text-sm sm:text-base font-semibold text-slate-300">
              {isAdaptiveLoading
                ? 'Switching teaching strategy and simplifying for you...'
                : '“Don’t worry — I’ll explain it differently.”'}
            </p>

            {/* Alternate Mode Reveal */}
            {alternateMode && (
              <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-pink-500/40 text-left space-y-3 shadow-md">
                {isAdaptiveLoading ? (
                  <div className="flex items-center gap-3 text-pink-400 text-sm py-4 animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    <span>Gemini is rethinking this concept using a new strategy and simplifying...</span>
                  </div>
                ) : adaptiveError ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>Could not load alternative explanation</span>
                    </div>
                    <p className="text-sm text-slate-300">{adaptiveError}</p>
                    <button
                      type="button"
                      onClick={handleStillDontGetIt}
                      className="px-3 py-1.5 rounded-lg bg-rose-900 hover:bg-rose-800 text-white text-xs font-semibold cursor-pointer"
                    >
                      Try Again
                    </button>
                  </div>
                ) : content.alternateExplanation ? (
                  <>
                    <div className="flex items-center gap-2 text-pink-400 font-bold text-sm">
                      <Zap className="w-4 h-4" />
                      <span>{content.alternateExplanation.title}</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {content.alternateExplanation.text}
                    </p>
                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setAlternateMode(false)}
                        className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                      >
                        Hide alternate explanation
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Interactive Poster Modal */}
      {showPosterModal && posterData && (
        <InteractivePosterModal
          poster={posterData}
          onClose={() => setShowPosterModal(false)}
        />
      )}
    </div>
  );
};
