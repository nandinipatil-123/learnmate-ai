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
  ArrowRight,
  Split,
  MessageSquareQuote,
  Zap
} from 'lucide-react';

export const LearnPage: React.FC = () => {
  const [topicInput, setTopicInput] = useState("I don't understand normalization...");
  const [isGenerated, setIsGenerated] = useState(true);
  const [alternateMode, setAlternateMode] = useState(false);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleTeachMe = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerated(true);
  };

  const samplePrompts = [
    "I don't understand normalization...",
    "What is partial functional dependency in 2NF?",
    "Why is BCNF stricter than 3NF?",
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Search & Prompt Area */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/50 text-cyan-400 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Conceptual Deconstruct Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            What are you struggling with?
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Type any DBMS concept, question, or confusion. LearnMate breaks it down across 5 cognitive layers.
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
                placeholder="I don't understand normalization..."
                className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-750 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-100 placeholder-slate-500 text-sm sm:text-base outline-none transition-all shadow-inner"
              />
            </div>
            <button
              id="teach-me-btn"
              type="submit"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all shrink-0"
            >
              <span>🧠 Teach Me</span>
            </button>
          </div>

          {/* Prompt chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-400">Try asking:</span>
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setTopicInput(prompt);
                  setIsGenerated(true);
                }}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700/60 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Active Topic Banner */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Active Study Topic:
          </span>
          <span className="text-sm font-bold text-cyan-400">
            DBMS Normalization (1NF → 2NF → 3NF)
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>5 Learning Perspectives Loaded</span>
        </div>
      </div>

      {/* 5 Learning Cards Container */}
      {isGenerated && (
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
              <p>
                <strong>Normalization</strong> is the process of organizing data in a relational database to achieve two primary objectives:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                <li>
                  <strong className="text-slate-100">Eliminate data redundancy</strong> (stop recording the exact same student address or course title in 100 rows).
                </li>
                <li>
                  <strong className="text-slate-100">Prevent data anomalies</strong> (specifically Insertion, Update, and Deletion anomalies when modifying tables).
                </li>
              </ul>
              <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-750 text-xs space-y-2">
                <div className="font-semibold text-cyan-300">Quick Rules of Thumb:</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-300">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-bold text-slate-100">1NF:</span> Atomic values only (no multi-valued lists in one cell).
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-bold text-slate-100">2NF:</span> 1NF + No partial dependency on candidate keys.
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-bold text-slate-100">3NF:</span> 2NF + No transitive dependencies (A → B → C).
                  </div>
                </div>
              </div>
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
                    The "Single Giant Grocery Spreadsheet" Dilemma:
                  </p>
                  <p className="text-slate-300 text-xs sm:text-sm">
                    Imagine keeping a single notebook where every time you buy milk, you write down your name, phone number, home address, the store name, the store manager's cell number, and the price of milk.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs pt-1">
                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                  <span className="font-bold text-rose-400 block mb-1">Update Anomaly</span>
                  If the store manager changes their phone number, you have to edit 200 receipt lines. Miss one, and your data is contradictory!
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                  <span className="font-bold text-rose-400 block mb-1">Insert Anomaly</span>
                  You can't add a new store to your list until someone actually buys an item there.
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                  <span className="font-bold text-rose-400 block mb-1">Delete Anomaly</span>
                  If you delete your only purchase at Store B, you accidentally erase the store manager's entire record.
                </div>
              </div>

              <p className="text-xs sm:text-sm text-indigo-300 font-medium">
                👉 <strong>Solution:</strong> Separate them into three clean notebooks: <code className="text-slate-100 bg-slate-900 px-1 py-0.5 rounded">Customers</code>, <code className="text-slate-100 bg-slate-900 px-1 py-0.5 rounded">Stores</code>, and <code className="text-slate-100 bg-slate-900 px-1 py-0.5 rounded">Purchases</code>. That is Normalization.
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
                  <p className="text-xs text-slate-400">Schema decomposition mapping (Unnormalized → 2NF)</p>
                </div>
              </div>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                Visual Architecture
              </span>
            </div>

            {/* Visual Schema Decomposition */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              {/* Before Decomposition */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-rose-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    Problematic 1NF Table: Student_Enrollment
                  </span>
                  <span className="text-slate-500">Composite Primary Key: (StudentID, CourseID)</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-300 border border-slate-800 rounded-lg overflow-hidden">
                    <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="p-2 border-r border-slate-800 text-cyan-300 font-mono">🔑 StudentID</th>
                        <th className="p-2 border-r border-slate-800 text-cyan-300 font-mono">🔑 CourseID</th>
                        <th className="p-2 border-r border-slate-800">StudentName</th>
                        <th className="p-2 border-r border-slate-800 bg-rose-950/30 text-rose-300">CourseTitle (Partial Dep!)</th>
                        <th className="p-2">FinalGrade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      <tr>
                        <td className="p-2 border-r border-slate-800 font-mono">S101</td>
                        <td className="p-2 border-r border-slate-800 font-mono">CS302</td>
                        <td className="p-2 border-r border-slate-800">Nandini</td>
                        <td className="p-2 border-r border-slate-800 text-rose-300">DBMS</td>
                        <td className="p-2">A</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-r border-slate-800 font-mono">S102</td>
                        <td className="p-2 border-r border-slate-800 font-mono">CS302</td>
                        <td className="p-2 border-r border-slate-800">Alex</td>
                        <td className="p-2 border-r border-slate-800 text-rose-300">DBMS (Duplicated)</td>
                        <td className="p-2">B+</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-[11px] text-rose-400/90 mt-1.5">
                  ⚠️ <code>CourseTitle</code> depends <em>only</em> on <code>CourseID</code>, not on the whole key <code>(StudentID, CourseID)</code>. This partial dependency violates 2NF!
                </p>
              </div>

              {/* Decomposition Flow Indicator */}
              <div className="flex items-center justify-center gap-2 py-1 text-xs text-slate-400 font-semibold">
                <Split className="w-4 h-4 text-cyan-400 rotate-90" />
                <span>Decompose into 2NF relations via Lossless Join</span>
              </div>

              {/* After Decomposition: Two Clean Tables */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Table 1 */}
                <div className="p-3 rounded-lg bg-slate-900 border border-emerald-900/50">
                  <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 mb-1.5">
                    <span>Table 1: Courses</span>
                    <span className="text-[10px] text-slate-500">PK: CourseID</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-300 bg-slate-950 p-2 rounded border border-slate-800">
                    Courses(<u>CourseID</u>, CourseTitle)
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">CourseTitle fully depends on CourseID.</p>
                </div>

                {/* Table 2 */}
                <div className="p-3 rounded-lg bg-slate-900 border border-emerald-900/50">
                  <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 mb-1.5">
                    <span>Table 2: Enrollments</span>
                    <span className="text-[10px] text-slate-500">PK: (StudentID, CourseID)</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-300 bg-slate-950 p-2 rounded border border-slate-800">
                    Enrollments(<u>StudentID</u>, <u>CourseID</u>, FinalGrade)
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Grade strictly requires both student & course.</p>
                </div>
              </div>
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
                  <p className="text-xs text-slate-400">Step-by-step mathematical formalization</p>
                </div>
              </div>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800/60">
                Exam Ready
              </span>
            </div>

            <div className="space-y-3 text-sm text-slate-300">
              <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-750 space-y-2">
                <div className="text-xs font-bold text-amber-300">Relation Schema:</div>
                <p className="font-mono text-xs text-slate-200">
                  R(EmpID, ProjectID, EmpName, ProjectBudget, HoursWorked)
                </p>
                <div className="text-xs font-bold text-slate-300 pt-1">Functional Dependencies (FDs):</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs text-slate-300">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    EmpID → EmpName
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    ProjectID → ProjectBudget
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    (EmpID, ProjectID) → HoursWorked
                  </div>
                </div>
              </div>

              <div className="text-xs leading-relaxed space-y-2 text-slate-300">
                <p>
                  <strong>Candidate Key:</strong> <code className="text-cyan-300 font-mono">(EmpID, ProjectID)</code>
                </p>
                <p>
                  <strong>Why it fails 2NF:</strong> Both <code className="text-rose-400 font-mono">EmpName</code> and <code className="text-rose-400 font-mono">ProjectBudget</code> depend on only <em>part</em> of the candidate key (EmpID and ProjectID individually).
                </p>
                <p>
                  <strong>Decomposition into 2NF:</strong>
                  <br />
                  • <code>Employee(<u>EmpID</u>, EmpName)</code>
                  <br />
                  • <code>Project(<u>ProjectID</u>, ProjectBudget)</code>
                  <br />
                  • <code>Assignment(<u>EmpID</u>, <u>ProjectID</u>, HoursWorked)</code>
                </p>
              </div>
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
                Question: In relation <code className="text-cyan-300 font-mono">R(A, B, C)</code> with Primary Key <code className="text-cyan-300 font-mono">(A, B)</code>, which Functional Dependency directly causes a violation of 2NF?
              </p>

              <div className="space-y-2">
                {[
                  { id: 0, text: 'A → C (Attribute C depends only on A, a proper subset of the key)' },
                  { id: 1, text: '(A, B) → C (Attribute C depends on the entire candidate key)' },
                  { id: 2, text: 'C → (A, B) (Attribute C determines candidate key)' },
                  { id: 3, text: 'None of the above' }
                ].map((opt) => {
                  const isSelected = quizSelected === opt.id;
                  const isCorrect = opt.id === 0;

                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setQuizSelected(opt.id);
                        setQuizSubmitted(true);
                      }}
                      className={`w-full text-left p-3 rounded-xl text-xs sm:text-sm font-medium border transition-all flex items-center justify-between ${
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
                      <span>{opt.text}</span>
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

              {quizSubmitted && (
                <div
                  className={`p-3 rounded-lg text-xs leading-relaxed ${
                    quizSelected === 0
                      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800'
                      : 'bg-rose-950/40 text-rose-300 border border-rose-800'
                  }`}
                >
                  {quizSelected === 0 ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span><strong>Correct!</strong> A → C is a partial dependency because C depends on attribute A, which is only a part of the composite primary key (A, B).</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 shrink-0" />
                      <span><strong>Not quite.</strong> A → C violates 2NF because 2NF prohibits any non-prime attribute (C) from depending on a proper subset (A) of a composite candidate key (A, B).</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Prominent Section: I STILL DON'T GET IT */}
          <div className="pt-4 pb-2 text-center space-y-3">
            <button
              id="still-dont-get-it-btn"
              onClick={() => setAlternateMode(!alternateMode)}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-black text-base sm:text-lg shadow-lg shadow-rose-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-rose-400/30"
            >
              <span className="text-xl">😭</span>
              <span>I STILL DON'T GET IT</span>
            </button>
            <p className="text-sm sm:text-base font-semibold text-slate-300">
              “Don’t worry — I’ll explain it differently.”
            </p>

            {/* Alternate Mode Reveal */}
            {alternateMode && (
              <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-pink-500/40 text-left space-y-3 shadow-md">
                <div className="flex items-center gap-2 text-pink-400 font-bold text-sm">
                  <Zap className="w-4 h-4" />
                  <span>Alternate Explanation: The Spotify Playlist Rule</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Think of Spotify: If Spotify saved the artist's full home phone number on <strong>every single track</strong> in your playlist, whenever Taylor Swift changed her phone, Spotify's servers would have to rewrite 10 million song records.
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Instead, Spotify keeps one master list of <strong>Artists</strong>, one master list of <strong>Tracks</strong>, and a tiny connection list linking which Track is in which Playlist. That's all Normalization is: <em>"Never repeat a fact in two places."</em>
                </p>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setAlternateMode(false)}
                    className="text-xs text-slate-400 hover:text-slate-200"
                  >
                    Hide alternate explanation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
