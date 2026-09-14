import { DBMSQuizQuestion, UNIT_1_QUIZ_QUESTIONS } from './dbmsQuizQuestionsUnit1';
import { UNIT_2_QUIZ_QUESTIONS } from './dbmsQuizQuestionsUnit2';
import { UNIT_3_QUIZ_QUESTIONS } from './dbmsQuizQuestionsUnit3';
import { UNIT_4_QUIZ_QUESTIONS } from './dbmsQuizQuestionsUnit4';
import { UNIT_5_QUIZ_QUESTIONS } from './dbmsQuizQuestionsUnit5';

export { type DBMSQuizQuestion };

export interface DBMSQuizUnit {
  id: 'unit-1' | 'unit-2' | 'unit-3' | 'unit-4' | 'unit-5';
  unitNumber: 1 | 2 | 3 | 4 | 5;
  title: string;
  shortTitle: string;
  subtitle: string;
  questions: DBMSQuizQuestion[];
}

export const DBMS_QUIZ_UNITS: DBMSQuizUnit[] = [
  {
    id: 'unit-1',
    unitNumber: 1,
    title: 'UNIT I – Overview of Database Systems & ER Model',
    shortTitle: 'Unit I: Overview & ER Model',
    subtitle: 'Data Abstraction, Data Independence, System Catalog, ER Modeling & Extended ER',
    questions: UNIT_1_QUIZ_QUESTIONS,
  },
  {
    id: 'unit-2',
    unitNumber: 2,
    title: 'UNIT II – Relational Model, Relational Algebra & Calculus',
    shortTitle: 'Unit II: Relational Model & Algebra',
    subtitle: 'Integrity Constraints, Relational Algebra, Degree/Cardinality, TRC & Completeness',
    questions: UNIT_2_QUIZ_QUESTIONS,
  },
  {
    id: 'unit-3',
    unitNumber: 3,
    title: 'UNIT III – SQL, Functional Dependencies & Normalization',
    shortTitle: 'Unit III: SQL & Normalization',
    subtitle: 'SQL Clauses, Armstrong Axioms, 1NF, 2NF, 3NF, BCNF, Lossless Joins & 4NF',
    questions: UNIT_3_QUIZ_QUESTIONS,
  },
  {
    id: 'unit-4',
    unitNumber: 4,
    title: 'UNIT IV – Transaction Processing & ACID',
    shortTitle: 'Unit IV: Transactions & ACID',
    subtitle: 'Atomicity, Durability, State Transitions, Conflict Serializability, Recoverability & WAL',
    questions: UNIT_4_QUIZ_QUESTIONS,
  },
  {
    id: 'unit-5',
    unitNumber: 5,
    title: 'UNIT V – Concurrency Control & Disk Storage',
    shortTitle: 'Unit V: Concurrency & Storage',
    subtitle: 'Shared/Exclusive Locks, 2PL, Strict 2PL, Deadlock WFG, Timestamp Ordering & RAID 5',
    questions: UNIT_5_QUIZ_QUESTIONS,
  },
];

// All 50 DBMS Quiz Questions strictly aggregated
export const ALL_DBMS_QUIZ_QUESTIONS: DBMSQuizQuestion[] = [
  ...UNIT_1_QUIZ_QUESTIONS,
  ...UNIT_2_QUIZ_QUESTIONS,
  ...UNIT_3_QUIZ_QUESTIONS,
  ...UNIT_4_QUIZ_QUESTIONS,
  ...UNIT_5_QUIZ_QUESTIONS,
];

// LocalStorage key for persisting unit-wise quiz performance
const QUIZ_PERFORMANCE_STORAGE_KEY = 'learnmate_dbms_quiz_performance_v1';

export interface UnitPerformanceRecord {
  unitId: 'unit-1' | 'unit-2' | 'unit-3' | 'unit-4' | 'unit-5';
  unitNumber: number;
  unitTitle: string;
  attempts: number;
  bestScore: number; // out of 10
  lastScore: number; // out of 10
  lastPercentage: number;
  totalCorrect: number;
  totalQuestionsAnswered: number;
  lastAttemptDate: string;
}

export type UnitPerformanceMap = {
  [unitId in 'unit-1' | 'unit-2' | 'unit-3' | 'unit-4' | 'unit-5']?: UnitPerformanceRecord;
};

export function loadQuizPerformance(): UnitPerformanceMap {
  try {
    const raw = localStorage.getItem(QUIZ_PERFORMANCE_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to load quiz performance from localStorage:', err);
    return {};
  }
}

export function saveUnitQuizPerformance(
  unitId: 'unit-1' | 'unit-2' | 'unit-3' | 'unit-4' | 'unit-5',
  unitNumber: number,
  unitTitle: string,
  correctCount: number,
  totalCount: number
): UnitPerformanceMap {
  try {
    const current = loadQuizPerformance();
    const existing = current[unitId];

    const attempts = (existing?.attempts || 0) + 1;
    const bestScore = existing ? Math.max(existing.bestScore, correctCount) : correctCount;
    const totalCorrect = (existing?.totalCorrect || 0) + correctCount;
    const totalQuestionsAnswered = (existing?.totalQuestionsAnswered || 0) + totalCount;

    const updatedRecord: UnitPerformanceRecord = {
      unitId,
      unitNumber,
      unitTitle,
      attempts,
      bestScore,
      lastScore: correctCount,
      lastPercentage: Math.round((correctCount / totalCount) * 100),
      totalCorrect,
      totalQuestionsAnswered,
      lastAttemptDate: new Date().toISOString(),
    };

    current[unitId] = updatedRecord;
    localStorage.setItem(QUIZ_PERFORMANCE_STORAGE_KEY, JSON.stringify(current));
    return current;
  } catch (err) {
    console.warn('Failed to save quiz performance to localStorage:', err);
    return {};
  }
}
