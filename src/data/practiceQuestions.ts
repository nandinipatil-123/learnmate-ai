import { PracticeQuestion } from '../types';
import { UNIT_1_QUESTIONS } from './practiceQuestionsUnit1';
import { UNIT_2_QUESTIONS } from './practiceQuestionsUnit2';
import { UNIT_3_QUESTIONS } from './practiceQuestionsUnit3';
import { UNIT_4_QUESTIONS } from './practiceQuestionsUnit4';
import { UNIT_5_QUESTIONS } from './practiceQuestionsUnit5';

export interface DBMSPracticeUnit {
  id: 'unit-1' | 'unit-2' | 'unit-3' | 'unit-4' | 'unit-5';
  unitNumber: 1 | 2 | 3 | 4 | 5;
  title: string;
  shortTitle: string;
  subtitle: string;
  questions: PracticeQuestion[];
}

export const DBMS_PRACTICE_UNITS: DBMSPracticeUnit[] = [
  {
    id: 'unit-1',
    unitNumber: 1,
    title: 'UNIT I – Overview of Database Systems & ER Model',
    shortTitle: 'Unit I: Overview & ER Model',
    subtitle: 'Foundations, File System vs DBMS, 3-Schema Architecture, and ER Modeling',
    questions: UNIT_1_QUESTIONS,
  },
  {
    id: 'unit-2',
    unitNumber: 2,
    title: 'UNIT II – Relational Model, Relational Algebra & Calculus',
    shortTitle: 'Unit II: Relational Model & Algebra',
    subtitle: 'Relational Schemas, Integrity Constraints, Relational Algebra, and Calculus',
    questions: UNIT_2_QUESTIONS,
  },
  {
    id: 'unit-3',
    unitNumber: 3,
    title: 'UNIT III – SQL, Functional Dependencies & Normalization',
    shortTitle: 'Unit III: SQL & Normalization',
    subtitle: 'SQL DDL/DML/TCL, Triggers, Stored Procedures, and Normal Forms 1NF to 4NF',
    questions: UNIT_3_QUESTIONS,
  },
  {
    id: 'unit-4',
    unitNumber: 4,
    title: 'UNIT IV – Transaction Processing & ACID',
    shortTitle: 'Unit IV: Transactions & ACID',
    subtitle: 'Transaction States, ACID Properties, Schedules, Serializability & Recoverability',
    questions: UNIT_4_QUESTIONS,
  },
  {
    id: 'unit-5',
    unitNumber: 5,
    title: 'UNIT V – Concurrency Control & Disk Storage',
    shortTitle: 'Unit V: Concurrency & Storage',
    subtitle: 'Two-Phase Locking (2PL), Deadlocks, Timestamp Ordering & Slotted Page Storage',
    questions: UNIT_5_QUESTIONS,
  },
];

// All 50 DBMS Practice Questions strictly aggregated across 5 units
export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  ...UNIT_1_QUESTIONS,
  ...UNIT_2_QUESTIONS,
  ...UNIT_3_QUESTIONS,
  ...UNIT_4_QUESTIONS,
  ...UNIT_5_QUESTIONS,
];

export interface SubjectTopicsMap {
  [subject: string]: string[];
}

export const SUBJECT_TOPICS: SubjectTopicsMap = {
  DBMS: [
    'Overview of Database Systems & ER Model',
    'Relational Model, Relational Algebra & Calculus',
    'SQL, Functional Dependencies & Normalization',
    'Transaction Processing & ACID',
    'Concurrency Control and Disk Storage',
  ],
};

export interface LearnedTopicResolution {
  subject: 'DBMS';
  unitId: 'unit-1' | 'unit-2' | 'unit-3' | 'unit-4' | 'unit-5';
  unitTitle: string;
  topic: string;
  displayTitle: string;
  matchedId: string;
}

/**
 * Resolves a topic from the Learn curriculum into the matching DBMS practice unit.
 */
export function resolveLearnedTopic(topicInput: string): LearnedTopicResolution {
  const lower = (topicInput || '').toLowerCase();

  // Unit 5 matches
  if (
    lower.includes('lock') ||
    lower.includes('2pl') ||
    lower.includes('deadlock') ||
    lower.includes('timestamp') ||
    lower.includes('buffer') ||
    lower.includes('disk') ||
    lower.includes('storage') ||
    lower.includes('slotted') ||
    lower.includes('unit v') ||
    lower.includes('unit 5')
  ) {
    return {
      subject: 'DBMS',
      unitId: 'unit-5',
      unitTitle: 'UNIT V – Concurrency Control and Disk Storage',
      topic: 'Concurrency Control and Disk Storage',
      displayTitle: 'Unit V: Concurrency Control & Disk Storage',
      matchedId: 'unit-5',
    };
  }

  // Unit 4 matches
  if (
    lower.includes('transaction') ||
    lower.includes('acid') ||
    lower.includes('schedule') ||
    lower.includes('serializ') ||
    lower.includes('recoverab') ||
    lower.includes('cascad') ||
    lower.includes('wal') ||
    lower.includes('unit iv') ||
    lower.includes('unit 4')
  ) {
    return {
      subject: 'DBMS',
      unitId: 'unit-4',
      unitTitle: 'UNIT IV – Transaction Processing & ACID',
      topic: 'Transaction Processing & ACID',
      displayTitle: 'Unit IV: Transaction Processing & ACID',
      matchedId: 'unit-4',
    };
  }

  // Unit 3 matches
  if (
    lower.includes('sql') ||
    lower.includes('trigger') ||
    lower.includes('procedure') ||
    lower.includes('normal') ||
    lower.includes('1nf') ||
    lower.includes('2nf') ||
    lower.includes('3nf') ||
    lower.includes('bcnf') ||
    lower.includes('4nf') ||
    lower.includes('functional depend') ||
    lower.includes('closure') ||
    lower.includes('unit iii') ||
    lower.includes('unit 3')
  ) {
    return {
      subject: 'DBMS',
      unitId: 'unit-3',
      unitTitle: 'UNIT III – SQL, Functional Dependencies & Normalization',
      topic: 'SQL, Functional Dependencies & Normalization',
      displayTitle: 'Unit III: SQL & Normalization',
      matchedId: 'unit-3',
    };
  }

  // Unit 2 matches
  if (
    lower.includes('relational model') ||
    lower.includes('algebra') ||
    lower.includes('calculus') ||
    lower.includes('selection') ||
    lower.includes('projection') ||
    lower.includes('join') ||
    lower.includes('division') ||
    lower.includes('view') ||
    lower.includes('integrity constraint') ||
    lower.includes('unit ii') ||
    lower.includes('unit 2')
  ) {
    return {
      subject: 'DBMS',
      unitId: 'unit-2',
      unitTitle: 'UNIT II – Relational Model, Relational Algebra & Calculus',
      topic: 'Relational Model, Relational Algebra & Calculus',
      displayTitle: 'Unit II: Relational Model & Algebra',
      matchedId: 'unit-2',
    };
  }

  // Default to Unit 1
  return {
    subject: 'DBMS',
    unitId: 'unit-1',
    unitTitle: 'UNIT I – Overview of Database Systems & ER Model',
    topic: 'Overview of Database Systems & ER Model',
    displayTitle: 'Unit I: Overview of Database Systems & ER Model',
    matchedId: 'unit-1',
  };
}

export const PRACTICE_ANSWERS_STORAGE_KEY = 'learnmate_dbms_practice_answers_v1';
export const LEARNED_TOPICS_STORAGE_KEY = 'learnmate_dbms_learned_topics_v1';

export function loadPracticeAnswers(): { [qId: string]: string } {
  try {
    const raw = localStorage.getItem(PRACTICE_ANSWERS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export function savePracticeAnswers(answers: { [qId: string]: string }): void {
  try {
    localStorage.setItem(PRACTICE_ANSWERS_STORAGE_KEY, JSON.stringify(answers));
  } catch {
    // ignore
  }
}

export function loadLearnedTopics(): string[] {
  try {
    const raw = localStorage.getItem(LEARNED_TOPICS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function recordLearnedTopic(topic: string): void {
  try {
    const current = loadLearnedTopics();
    if (topic && !current.includes(topic)) {
      localStorage.setItem(LEARNED_TOPICS_STORAGE_KEY, JSON.stringify([...current, topic]));
    }
  } catch {
    // ignore
  }
}
