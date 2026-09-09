import { LearningTopic, QuizQuestion, StudyDay } from '../types';

export const LEARNING_PROFILE_TOPICS: LearningTopic[] = [
  { id: 'sql', name: 'SQL', status: 'Strong', score: 92, category: 'Queries & DDL' },
  { id: 'er', name: 'ER Model', status: 'Strong', score: 88, category: 'Conceptual Design' },
  { id: 'transactions', name: 'Transactions', status: 'Average', score: 65, category: 'Concurrency' },
  { id: 'normalization', name: 'Normalization', status: 'Weak', score: 38, category: 'Schema Refinement' },
];

export const DEMO_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    topic: 'Normalization',
    difficulty: 'Medium',
    question: 'Which normal form addresses partial functional dependencies on a composite candidate key?',
    options: [
      'First Normal Form (1NF)',
      'Second Normal Form (2NF)',
      'Third Normal Form (3NF)',
      'Boyce-Codd Normal Form (BCNF)'
    ],
    correctIndex: 1,
    explanation: '2NF requires a relation to be in 1NF and ensure that every non-prime attribute is fully functionally dependent on the entire primary key, eliminating partial dependencies.'
  },
  {
    id: 'q2',
    topic: 'Transactions',
    difficulty: 'Hard',
    question: 'In DBMS, which ACID property is primarily maintained by the Concurrency Control component?',
    options: [
      'Atomicity',
      'Consistency',
      'Isolation',
      'Durability'
    ],
    correctIndex: 2,
    explanation: 'Isolation ensures that concurrently executing transactions do not interfere with each other. This is managed by concurrency control protocols such as 2PL or Timestamp ordering.'
  },
  {
    id: 'q3',
    topic: 'SQL & Relational Algebra',
    difficulty: 'Easy',
    question: 'Which relational algebra operation selects rows that satisfy a specified predicate condition?',
    options: [
      'Projection (π)',
      'Selection (σ)',
      'Cartesian Product (×)',
      'Natural Join (⋈)'
    ],
    correctIndex: 1,
    explanation: 'The Selection operator (represented by σ) filters tuples from a relation that satisfy a given boolean condition.'
  }
];

export const DBMS_STUDY_PLAN: StudyDay[] = [
  {
    day: 1,
    title: 'Relational Model & Advanced SQL',
    focus: 'Core syntax, nested subqueries, joins & aggregation',
    topics: ['Relational Algebra vs Calculus', 'Group By & Having', 'Complex Outer Joins', 'Views & Constraints'],
    estimatedHours: 3.5,
    status: 'completed',
    dateLabel: 'Day 1 (Completed)'
  },
  {
    day: 2,
    title: 'ER Modeling & Schema Design',
    focus: 'Conceptual modeling to relational schema mapping',
    topics: ['Entities & Weak Entities', 'Cardinality & Participation Constraints', 'Specialization & Generalization', 'Schema Transformation'],
    estimatedHours: 3.0,
    status: 'completed',
    dateLabel: 'Day 2 (Completed)'
  },
  {
    day: 3,
    title: 'Functional Dependencies & Normalization',
    focus: 'Anomalies elimination, 1NF, 2NF, 3NF, BCNF decomposition',
    topics: ['Closure of Attribute Sets', 'Finding Candidate Keys', 'Partial & Transitive Dependencies', 'Lossless Join & Dependency Preservation'],
    estimatedHours: 4.5,
    status: 'in-progress',
    dateLabel: 'Day 3 (Today • Priority)'
  },
  {
    day: 4,
    title: 'Transactions & Concurrency Control',
    focus: 'ACID guarantees, serializability, locking protocols',
    topics: ['Conflict vs View Serializability', 'Two-Phase Locking (2PL)', 'Deadlock Prevention & Recovery', 'Write-Ahead Logging (WAL)'],
    estimatedHours: 4.0,
    status: 'upcoming',
    dateLabel: 'Day 4 (Tomorrow)'
  },
  {
    day: 5,
    title: 'Storage, Indexing & Final Exam Simulation',
    focus: 'Physical organization, B+ Trees, timed mock exam',
    topics: ['B+ Tree Insertion & Search', 'Hashing & Bitmap Indexes', 'Query Optimization Basics', 'Full Mock Exam Simulation (100 Qs)'],
    estimatedHours: 5.0,
    status: 'upcoming',
    dateLabel: 'Day 5 (Final Prep)'
  }
];
