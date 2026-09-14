import { TeachContent } from '../types';

export interface DBMSTopicItem {
  id: string;
  unitId: 'unit-1' | 'unit-2' | 'unit-3' | 'unit-4' | 'unit-5';
  unitTitle: string;
  name: string;
  shortDesc: string;
  category: string;
}

export interface DBMSUnit {
  id: 'unit-1' | 'unit-2' | 'unit-3' | 'unit-4' | 'unit-5';
  title: string;
  subtitle: string;
  topics: DBMSTopicItem[];
}

export const DBMS_SYLLABUS: DBMSUnit[] = [
  {
    id: 'unit-1',
    title: 'UNIT I – Overview of Database Systems',
    subtitle: 'Foundations, File Systems vs DBMS, ER Modeling, and Architecture',
    topics: [
      { id: 'u1-t1', unitId: 'unit-1', unitTitle: 'UNIT I', name: 'Managing Data', shortDesc: 'Evolution from manual ledgers to computerized centralized persistence', category: 'Overview' },
      { id: 'u1-t2', unitId: 'unit-1', unitTitle: 'UNIT I', name: 'File System vs DBMS', shortDesc: 'Redundancy, isolation, concurrent anomalies, and crash recovery comparison', category: 'Foundations' },
      { id: 'u1-t3', unitId: 'unit-1', unitTitle: 'UNIT I', name: 'Advantages of DBMS', shortDesc: 'Data independence, security, integrity constraints, and multi-user access', category: 'Foundations' },
      { id: 'u1-t4', unitId: 'unit-1', unitTitle: 'UNIT I', name: 'Describing and Storing Data in a DBMS', shortDesc: 'Schemas, physical/logical records, and 3-schema architecture (ANSI/SPARC)', category: 'Storage' },
      { id: 'u1-t5', unitId: 'unit-1', unitTitle: 'UNIT I', name: 'Queries in DBMS', shortDesc: 'Declarative query languages, parsing, optimization, and query execution plans', category: 'Queries' },
      { id: 'u1-t6', unitId: 'unit-1', unitTitle: 'UNIT I', name: 'Transaction Management', shortDesc: 'Managing logical units of work ensuring ACID guarantees under failures', category: 'Transactions' },
      { id: 'u1-t7', unitId: 'unit-1', unitTitle: 'UNIT I', name: 'Structure of DBMS', shortDesc: 'Storage manager, buffer manager, transaction manager, and query processor', category: 'Architecture' },
      { id: 'u1-t8', unitId: 'unit-1', unitTitle: 'UNIT I', name: 'Role-Based Access', shortDesc: 'Database administrators (DBA), application developers, and end-user privileges', category: 'Security' },
      { id: 'u1-t9', unitId: 'unit-1', unitTitle: 'UNIT I', name: 'Data Models', shortDesc: 'Relational, Hierarchical, Network, Object-Oriented, and Document models', category: 'Modeling' },
      { id: 'u1-t10', unitId: 'unit-1', unitTitle: 'UNIT I', name: 'E-R Diagrams', shortDesc: 'Graphical conceptual representation of real-world enterprise databases', category: 'ER Model' },
      { id: 'u1-t11', unitId: 'unit-1', unitTitle: 'UNIT I', name: 'Entities, Attributes and Entity Sets', shortDesc: 'Strong/weak entities, composite, multi-valued, and derived attributes', category: 'ER Model' },
      { id: 'u1-t12', unitId: 'unit-1', unitTitle: 'UNIT I', name: 'Relationships and Relationship Sets', shortDesc: 'Binary/ternary associations, mapping cardinalities (1:1, 1:N, N:M), and roles', category: 'ER Model' },
      { id: 'u1-t13', unitId: 'unit-1', unitTitle: 'UNIT I', name: 'Additional Features of ER Model', shortDesc: 'Specialization, Generalization, Aggregation, and Total/Partial Participation', category: 'Advanced ER' },
      { id: 'u1-t14', unitId: 'unit-1', unitTitle: 'UNIT I', name: 'Conceptual Database Design with ER Model', shortDesc: 'Step-by-step enterprise requirement translation into robust relational schemas', category: 'Design' },
    ],
  },
  {
    id: 'unit-2',
    title: 'UNIT II – Relational Model',
    subtitle: 'Relational Schemas, Integrity Constraints, Relational Algebra & Calculus',
    topics: [
      { id: 'u2-t1', unitId: 'unit-2', unitTitle: 'UNIT II', name: 'Introduction to Relational Model', shortDesc: 'Codd’s relational model: relations, tuples, domains, degrees, and cardinalities', category: 'Relational' },
      { id: 'u2-t2', unitId: 'unit-2', unitTitle: 'UNIT II', name: 'Integrity Constraints over Relations', shortDesc: 'Domain, Key, Entity Integrity, and Referential Integrity constraints', category: 'Constraints' },
      { id: 'u2-t3', unitId: 'unit-2', unitTitle: 'UNIT II', name: 'Enforcing Integrity Constraints', shortDesc: 'ON DELETE CASCADE, SET NULL, CHECK clauses, and foreign key enforcement', category: 'Constraints' },
      { id: 'u2-t4', unitId: 'unit-2', unitTitle: 'UNIT II', name: 'Querying Relational Data', shortDesc: 'Expressing database operations declaratively vs procedurally over tables', category: 'Queries' },
      { id: 'u2-t5', unitId: 'unit-2', unitTitle: 'UNIT II', name: 'Logical Database Design', shortDesc: 'Mapping ER diagrams to relational schemas without loss of constraints', category: 'Design' },
      { id: 'u2-t6', unitId: 'unit-2', unitTitle: 'UNIT II', name: 'Introduction to Views', shortDesc: 'Virtual tables, security abstraction, and dynamic query simplification', category: 'Views' },
      { id: 'u2-t7', unitId: 'unit-2', unitTitle: 'UNIT II', name: 'Destroying/Altering Tables and Views', shortDesc: 'DROP TABLE, ALTER TABLE ADD/MODIFY, CASCADE vs RESTRICT rules', category: 'DDL' },
      { id: 'u2-t8', unitId: 'unit-2', unitTitle: 'UNIT II', name: 'Relational Algebra', shortDesc: 'Procedural formal query language operating on relations producing relations', category: 'Algebra' },
      { id: 'u2-t9', unitId: 'unit-2', unitTitle: 'UNIT II', name: 'Selection and Projection', shortDesc: 'Sigma (σ) horizontal filtering and Pi (π) vertical attribute extraction', category: 'Algebra' },
      { id: 'u2-t10', unitId: 'unit-2', unitTitle: 'UNIT II', name: 'Set Operations', shortDesc: 'Union (∪), Intersection (∩), and Set Difference (−) with union compatibility', category: 'Algebra' },
      { id: 'u2-t11', unitId: 'unit-2', unitTitle: 'UNIT II', name: 'Renaming', shortDesc: 'Rho (ρ) operator for resolving attribute name collisions in self-joins', category: 'Algebra' },
      { id: 'u2-t12', unitId: 'unit-2', unitTitle: 'UNIT II', name: 'Joins', shortDesc: 'Theta join, Equi join, Natural join (⨝), Outer joins (Left, Right, Full)', category: 'Algebra' },
      { id: 'u2-t13', unitId: 'unit-2', unitTitle: 'UNIT II', name: 'Division', shortDesc: 'Division operator (÷) for queries requiring "FOR ALL" relationships', category: 'Algebra' },
      { id: 'u2-t14', unitId: 'unit-2', unitTitle: 'UNIT II', name: 'Examples of Relational Algebra Queries', shortDesc: 'Complex multi-relation query formulations and intermediate result trees', category: 'Algebra' },
      { id: 'u2-t15', unitId: 'unit-2', unitTitle: 'UNIT II', name: 'Tuple Relational Calculus', shortDesc: 'Non-procedural declarative calculus: { t | P(t) } using existential quantifiers', category: 'Calculus' },
      { id: 'u2-t16', unitId: 'unit-2', unitTitle: 'UNIT II', name: 'Domain Relational Calculus', shortDesc: 'Non-procedural calculus expressing queries using domain variables', category: 'Calculus' },
    ],
  },
  {
    id: 'unit-3',
    title: 'UNIT III – SQL and Normalization',
    subtitle: 'SQL Syntax, DDL/DML/DCL/TCL, Triggers, and Normal Forms (1NF to 4NF)',
    topics: [
      { id: 'u3-t1', unitId: 'unit-3', unitTitle: 'UNIT III', name: 'Overview of SQL', shortDesc: 'Declarative Structured Query Language standards (ANSI/ISO) and engines', category: 'SQL' },
      { id: 'u3-t2', unitId: 'unit-3', unitTitle: 'UNIT III', name: 'SQL Data Definition', shortDesc: 'CREATE TABLE, PRIMARY KEY, FOREIGN KEY, NOT NULL, and UNIQUE definitions', category: 'SQL' },
      { id: 'u3-t3', unitId: 'unit-3', unitTitle: 'UNIT III', name: 'Basic Structure of SQL Queries', shortDesc: 'SELECT - FROM - WHERE clause evaluation mechanics and filtering logic', category: 'SQL' },
      { id: 'u3-t4', unitId: 'unit-3', unitTitle: 'UNIT III', name: 'DDL', shortDesc: 'Data Definition Language commands: CREATE, ALTER, DROP, TRUNCATE, RENAME', category: 'SQL' },
      { id: 'u3-t5', unitId: 'unit-3', unitTitle: 'UNIT III', name: 'Additional Basic Operations', shortDesc: 'ORDER BY, GROUP BY, HAVING, LIKE pattern matching, and aggregate functions', category: 'SQL' },
      { id: 'u3-t6', unitId: 'unit-3', unitTitle: 'UNIT III', name: 'DML', shortDesc: 'Data Manipulation Language: INSERT INTO, UPDATE, DELETE FROM statements', category: 'SQL' },
      { id: 'u3-t7', unitId: 'unit-3', unitTitle: 'UNIT III', name: 'DCL', shortDesc: 'Data Control Language: GRANT and REVOKE permissions for role security', category: 'SQL' },
      { id: 'u3-t8', unitId: 'unit-3', unitTitle: 'UNIT III', name: 'TCL', shortDesc: 'Transaction Control Language: COMMIT, ROLLBACK, and SAVEPOINT commands', category: 'SQL' },
      { id: 'u3-t9', unitId: 'unit-3', unitTitle: 'UNIT III', name: 'Triggers', shortDesc: 'Event-Condition-Action procedural routines (BEFORE/AFTER/INSTEAD OF)', category: 'Advanced SQL' },
      { id: 'u3-t10', unitId: 'unit-3', unitTitle: 'UNIT III', name: 'Stored Procedures', shortDesc: 'Pre-compiled procedural programs executed directly inside database engine', category: 'Advanced SQL' },
      { id: 'u3-t11', unitId: 'unit-3', unitTitle: 'UNIT III', name: 'Functional Dependencies', shortDesc: 'X → Y Armstrong’s axioms, closures of attribute sets, and minimal covers', category: 'Normalization' },
      { id: 'u3-t12', unitId: 'unit-3', unitTitle: 'UNIT III', name: 'Normal Forms', shortDesc: 'Decomposition guidelines eliminating insertion, update, and deletion anomalies', category: 'Normalization' },
      { id: 'u3-t13', unitId: 'unit-3', unitTitle: 'UNIT III', name: '2NF', shortDesc: 'Second Normal Form: 1NF + elimination of partial functional dependencies', category: 'Normalization' },
      { id: 'u3-t14', unitId: 'unit-3', unitTitle: 'UNIT III', name: '3NF', shortDesc: 'Third Normal Form: 2NF + elimination of transitive functional dependencies', category: 'Normalization' },
      { id: 'u3-t15', unitId: 'unit-3', unitTitle: 'UNIT III', name: 'BCNF', shortDesc: 'Boyce-Codd Normal Form: for every X → Y, X must be a superkey', category: 'Normalization' },
      { id: 'u3-t16', unitId: 'unit-3', unitTitle: 'UNIT III', name: 'Multivalued Dependency', shortDesc: 'X ↠ Y independent multiple facts stored in a single relation', category: 'Normalization' },
      { id: 'u3-t17', unitId: 'unit-3', unitTitle: 'UNIT III', name: '4NF', shortDesc: 'Fourth Normal Form: BCNF + elimination of non-trivial multivalued dependencies', category: 'Normalization' },
    ],
  },
  {
    id: 'unit-4',
    title: 'UNIT IV – Transaction Processing',
    subtitle: 'ACID Guarantees, Transaction States, Schedules, and Serializability',
    topics: [
      { id: 'u4-t1', unitId: 'unit-4', unitTitle: 'UNIT IV', name: 'Introduction to Transaction Processing', shortDesc: 'Logical unit of database processing involving READ and WRITE operations', category: 'Transactions' },
      { id: 'u4-t2', unitId: 'unit-4', unitTitle: 'UNIT IV', name: 'Transaction and System Concepts', shortDesc: 'Active, Partially Committed, Committed, Failed, and Aborted state transitions', category: 'Transactions' },
      { id: 'u4-t3', unitId: 'unit-4', unitTitle: 'UNIT IV', name: 'ACID Properties', shortDesc: 'Atomicity, Consistency, Isolation, and Durability enforcement in DBMS', category: 'Transactions' },
      { id: 'u4-t4', unitId: 'unit-4', unitTitle: 'UNIT IV', name: 'Schedules and Recoverability', shortDesc: 'Conflict/View serializability, precedence graphs, cascading vs cascadeless schedules', category: 'Transactions' },
    ],
  },
  {
    id: 'unit-5',
    title: 'UNIT V – Concurrency Control and Disk Storage',
    subtitle: 'Locking Protocols, Timestamps, Disk Page Layout, and Block Buffering',
    topics: [
      { id: 'u5-t1', unitId: 'unit-5', unitTitle: 'UNIT V', name: 'Two-Phase Locking', shortDesc: '2PL protocol: Growing phase, Shrinking phase, Strict 2PL and Rigorous 2PL', category: 'Concurrency' },
      { id: 'u5-t2', unitId: 'unit-5', unitTitle: 'UNIT V', name: 'Timestamp Ordering', shortDesc: 'Thomas Write Rule, read/write timestamps, and lock-free concurrency control', category: 'Concurrency' },
      { id: 'u5-t3', unitId: 'unit-5', unitTitle: 'UNIT V', name: 'Secondary Storage Devices', shortDesc: 'Magnetic HDDs, SSDs, RAID levels, sectors, tracks, and seek/rotational latency', category: 'Storage' },
      { id: 'u5-t4', unitId: 'unit-5', unitTitle: 'UNIT V', name: 'Buffering of Blocks', shortDesc: 'Buffer pool, frame management, LRU, Clock, and write-ahead logging (WAL)', category: 'Storage' },
      { id: 'u5-t5', unitId: 'unit-5', unitTitle: 'UNIT V', name: 'Placing File Records on Disk', shortDesc: 'Fixed-length vs variable-length records, slotted page architecture, and pointers', category: 'Storage' },
      { id: 'u5-t6', unitId: 'unit-5', unitTitle: 'UNIT V', name: 'Operations on Files', shortDesc: 'Heap files, sequential files, hashing, and I/O cost analysis for scan/search', category: 'Storage' },
    ],
  },
];

// Flat list of all 57 syllabus topics
export const ALL_DBMS_TOPICS: DBMSTopicItem[] = DBMS_SYLLABUS.flatMap((u) => u.topics);

export interface InteractivePosterData {
  topicTitle: string;
  unitTitle: string;
  subtitle: string;
  accentColor: string; // 'cyan' | 'indigo' | 'emerald' | 'amber' | 'rose'
  pillars: {
    title: string;
    badge: string;
    summary: string;
    keyDetail: string;
    iconSymbol: string;
  }[];
  realWorldExample: {
    domain: string;
    problem: string;
    dbmsSolution: string;
    impact: string;
  };
  visualDiagram: {
    title: string;
    asciiArt: string;
    explanation: string;
  };
  examFormula: {
    rule: string;
    mnemonicOrCheck: string;
  };
  keyTakeaway: string;
}

/**
 * Dynamically generates an authentic, visually stunning interactive poster customized
 * exclusively to the selected DBMS topic.
 */
export function generateTopicPoster(topicTitle: string, content?: TeachContent): InteractivePosterData {
  const lower = topicTitle.toLowerCase();

  // 1. Normalization Poster (1NF, 2NF, 3NF, BCNF)
  if (lower.includes('normal') || lower.includes('2nf') || lower.includes('3nf') || lower.includes('bcnf') || lower.includes('functional dep')) {
    return {
      topicTitle: 'DBMS Normalization & Functional Dependencies',
      unitTitle: 'UNIT III – SQL and Normalization',
      subtitle: 'Eliminating Redundancy, Ensuring Lossless Joins & Preserving Dependencies',
      accentColor: 'cyan',
      pillars: [
        {
          title: 'Redundancy & Anomalies',
          badge: 'The Core Danger',
          summary: 'Duplicated attributes cause Insertion, Update, and Deletion anomalies across tables.',
          keyDetail: 'Modifying a customer address requires editing 100 rows; missing one breaks data consistency.',
          iconSymbol: '⚠️',
        },
        {
          title: '1NF (Atomic Attributes)',
          badge: 'Rule 1',
          summary: 'Each column must hold only single, indivisible scalar values.',
          keyDetail: 'No comma-separated lists, nested tables, or repeating groups in a single cell.',
          iconSymbol: '🧱',
        },
        {
          title: '2NF (No Partial Dependency)',
          badge: 'Rule 2',
          summary: 'Table must be in 1NF and no non-prime attribute depends on part of a composite key.',
          keyDetail: 'If PK is (StudentID, CourseID), CourseName depending only on CourseID violates 2NF.',
          iconSymbol: '⚖️',
        },
        {
          title: '3NF (No Transitive Dependency)',
          badge: 'Rule 3',
          summary: 'Table must be in 2NF and non-prime attributes must depend only on candidate keys.',
          keyDetail: 'Eliminates chains like A → B → C (e.g., StudentID → DeptCode → DeptHOD).',
          iconSymbol: '🔗',
        },
        {
          title: 'BCNF (Boyce-Codd Normal Form)',
          badge: 'Strict Determinant',
          summary: 'For every non-trivial functional dependency X → Y, X must be a candidate/super key.',
          keyDetail: 'Stricter than 3NF; ensures determinants have zero non-key overlapping overlap.',
          iconSymbol: '🛡️',
        },
      ],
      realWorldExample: {
        domain: 'Global E-Commerce Order System',
        problem: 'Storing CustomerAddress, WarehouseZip, and ItemPrice in a flat Orders table caused 42GB of duplicate rows.',
        dbmsSolution: 'Decomposed into Customers, Orders, OrderItems, and Warehouses with foreign key joins.',
        impact: 'Reduced table footprint by 78%, eliminated dirty updates, and ensured zero orphaned records.',
      },
      visualDiagram: {
        title: 'Decomposition Architecture (Unnormalized → 3NF)',
        asciiArt: `[ Unnormalized Student_Course Table ] (Violates 2NF & 3NF)
(StudentID, CourseID, StudentName, CourseTitle, InstructorID, InstructorOffice)
         │
         ├──► Decompose Partial Dependencies (2NF):
         │    Courses(CourseID, CourseTitle, InstructorID)
         │
         └──► Decompose Transitive Dependencies (3NF):
              Instructors(InstructorID, InstructorOffice)
              Enrollments(StudentID, CourseID, Grade)`,
        explanation: 'Each fact is recorded in exactly one place. Tables are joined back seamlessly via lossless natural joins.',
      },
      examFormula: {
        rule: '3NF Condition: For every X → Y, either X is a superkey OR Y is a prime attribute (part of candidate key).',
        mnemonicOrCheck: 'Mnemonic: "The key, the whole key (2NF), and nothing but the key (3NF), so help me Codd."',
      },
      keyTakeaway: 'Normalization guarantees data integrity by storing every real-world entity in its own relational boundary.',
    };
  }

  // 2. SQL Joins Poster
  if (lower.includes('join') || lower.includes('cartesian') || lower.includes('cross product')) {
    return {
      topicTitle: 'Relational Joins in DBMS & SQL',
      unitTitle: 'UNIT II – Relational Model & UNIT III – SQL',
      subtitle: 'Combining Relations via Cross-Product, Theta Filtering & Hash/Merge Algorithms',
      accentColor: 'indigo',
      pillars: [
        {
          title: 'Cartesian Cross-Product (R × S)',
          badge: 'Foundation',
          summary: 'Pairs every single tuple in R with every single tuple in S.',
          keyDetail: 'Result size is |R| × |S|. Joins are essentially filtered cross-products.',
          iconSymbol: '✖️',
        },
        {
          title: 'INNER JOIN (⨝)',
          badge: 'Intersection',
          summary: 'Returns only records where matching join predicates evaluate to TRUE.',
          keyDetail: 'Omits non-matching rows from both tables entirely.',
          iconSymbol: '🤝',
        },
        {
          title: 'LEFT / RIGHT OUTER JOIN (⟕ / ⟖)',
          badge: 'Preservation',
          summary: 'Preserves all rows from one table, filling non-matching sides with NULL.',
          keyDetail: 'Essential for finding unassigned entities (e.g. customers with zero orders).',
          iconSymbol: '◀️',
        },
        {
          title: 'FULL OUTER JOIN (⟗)',
          badge: 'Union of Sets',
          summary: 'Preserves all records from both relations regardless of matches.',
          keyDetail: 'Generates NULL on both left and right whenever keys are absent.',
          iconSymbol: '🌐',
        },
        {
          title: 'Physical Join Execution',
          badge: 'Engine Internals',
          summary: 'Nested Loop Join vs Hash Join vs Sort-Merge Join.',
          keyDetail: 'Query optimizer chooses Hash Join for large tables and Nested Loop when indexes exist.',
          iconSymbol: '⚡',
        },
      ],
      realWorldExample: {
        domain: 'FinTech Banking Transaction Ledger',
        problem: 'Auditing active accounts against credit fraud alerts without dropping silent inactive accounts.',
        dbmsSolution: 'LEFT OUTER JOIN Accounts ON Alerts.AccountID WHERE Alerts.Severity IS NOT NULL.',
        impact: 'Detects 100% of compromised accounts while keeping zero-balance accounts in daily reconciliations.',
      },
      visualDiagram: {
        title: 'Venn & Relation Mapping of SQL Joins',
        asciiArt: `[ Table A: Customers ]        [ Table B: Orders ]
+-----+------------+          +---------+-----+--------+
| ID  | Name       |          | OrderID | CID | Amount |
+-----+------------+          +---------+-----+--------+
| 101 | Alice      |          | 9001    | 101 | $240   |
| 102 | Bob        |          | 9002    | 101 | $85    |
| 103 | Charlie    |          | 9003    | 999 | $500   |
+-----+------------+          +---------+-----+--------+

INNER JOIN: Returns (Alice - 9001), (Alice - 9002)
LEFT JOIN:  Returns Alice (2 orders), Bob (NULL amount), Charlie (NULL amount)`,
        explanation: 'Join predicates determine which tuples satisfy the logical intersection or preservation criteria.',
      },
      examFormula: {
        rule: 'Equi-Join: R ⨝_{R.A = S.A} S = σ_{R.A = S.A}(R × S)',
        mnemonicOrCheck: 'Inner joins drop unmatched; Outer joins preserve with NULLs; Cross product multiplies counts.',
      },
      keyTakeaway: 'Joins reconstruct fragmented normalized relations into rich query results at execution time.',
    };
  }

  // 3. ACID Properties Poster
  if (lower.includes('acid') || lower.includes('transaction') || lower.includes('schedule') || lower.includes('recoverab')) {
    return {
      topicTitle: 'ACID Properties & Transaction Processing',
      unitTitle: 'UNIT IV – Transaction Processing',
      subtitle: 'The 4 Invariants Guaranteeing Reliable Enterprise Database Operations',
      accentColor: 'emerald',
      pillars: [
        {
          title: 'Atomicity (All-or-Nothing)',
          badge: 'Undo Log',
          summary: 'A transaction executes completely to COMMIT, or has zero effect via ROLLBACK.',
          keyDetail: 'Enforced by Write-Ahead Logging (WAL) and undo segment recovery rollback.',
          iconSymbol: '⚛️',
        },
        {
          title: 'Consistency (State Invariant)',
          badge: 'Constraints',
          summary: 'Database transitions from one legally valid state to another valid state.',
          keyDetail: 'Integrity constraints (Primary keys, Foreign keys, CHECK) must hold true post-commit.',
          iconSymbol: '📐',
        },
        {
          title: 'Isolation (Concurrency Fence)',
          badge: 'Locking / MVCC',
          summary: 'Concurrent transactions execute as if they were running in serial sequence.',
          keyDetail: 'Prevents Dirty Reads, Non-Repeatable Reads, and Phantom Rows using lock protocols.',
          iconSymbol: '🛡️',
        },
        {
          title: 'Durability (Permanent Write)',
          badge: 'Redo Log',
          summary: 'Once a transaction commits, its writes survive power loss, crashes, or reboots.',
          keyDetail: 'Flushed to non-volatile disk/SSD journal before acknowledging commit to client.',
          iconSymbol: '💾',
        },
      ],
      realWorldExample: {
        domain: 'Bank Account Wire Transfer ($500 from Account A to Account B)',
        problem: 'Server crashes right after deducting $500 from A, before adding $500 to B.',
        dbmsSolution: 'Atomicity rolls back deduction on reboot using UNDO log; total money in bank remains invariant.',
        impact: 'Zero financial discrepancies, zero lost customer funds during cloud infrastructure outages.',
      },
      visualDiagram: {
        title: 'ACID Transaction Lifecycle State Machine',
        asciiArt: `[ Active State ] ───(Read / Write Operations)───┐
       │                                         │
       ▼                                         ▼
[ Partially Committed ]                     [ Failed State ]
       │ (Log Flushed to Disk)                   │
       ▼                                         ▼
[ Committed State ] ──(Permanent Durability)   [ Aborted State ] (UNDO Rollback)`,
        explanation: 'Write-Ahead Logging guarantees transactions can be redone or undone regardless of crash timing.',
      },
      examFormula: {
        rule: 'WAL Protocol: A log record for an update must be flushed to disk before the data page itself reaches disk.',
        mnemonicOrCheck: 'Remember: A-Atomicity (Undo), C-Consistency (Rules), I-Isolation (Locks/MVCC), D-Durability (Redo).',
      },
      keyTakeaway: 'ACID guarantees make relational databases the gold standard for mission-critical financial systems.',
    };
  }

  // 4. Two-Phase Locking & Concurrency Control Poster
  if (lower.includes('lock') || lower.includes('two-phase') || lower.includes('timestamp') || lower.includes('concurrency')) {
    return {
      topicTitle: 'Two-Phase Locking (2PL) & Concurrency Control',
      unitTitle: 'UNIT V – Concurrency Control and Disk Storage',
      subtitle: 'Serializability Guarantees via Growing & Shrinking Lock Acquisition Phases',
      accentColor: 'rose',
      pillars: [
        {
          title: 'Phase 1: Growing Phase',
          badge: 'Acquisition Only',
          summary: 'Transaction may acquire Shared (S) or Exclusive (X) locks, but cannot release any.',
          keyDetail: 'Lock point is reached when the transaction holds all necessary resource locks.',
          iconSymbol: '📈',
        },
        {
          title: 'Phase 2: Shrinking Phase',
          badge: 'Release Only',
          summary: 'Transaction may release locks, but can NEVER acquire any new lock.',
          keyDetail: 'Guarantees conflict serializability of all concurrent schedules.',
          iconSymbol: '📉',
        },
        {
          title: 'Strict 2PL Protocol',
          badge: 'Industrial Standard',
          summary: 'Exclusive (X) locks are held until COMMIT or ABORT.',
          keyDetail: 'Completely avoids cascading rollbacks and dirty read anomalies.',
          iconSymbol: '🔒',
        },
        {
          title: 'Deadlock Handling',
          badge: 'Resolution',
          summary: 'Wait-For-Graphs (WFG), Timeout, and Wait-Die / Wound-Wait prevention.',
          keyDetail: 'Cycles in WFG indicate deadlocks; engine aborts the youngest victim transaction.',
          iconSymbol: '🛑',
        },
      ],
      realWorldExample: {
        domain: 'Airline Seat Reservation System',
        problem: 'Two passengers book Seat 14A simultaneously; both see it as available and charge credit cards.',
        dbmsSolution: 'Exclusive lock on Seat 14A acquired by Transaction 1; Transaction 2 waits until T1 commits.',
        impact: 'Eliminates double-booking with 100% mathematical certainty without human supervisor intervention.',
      },
      visualDiagram: {
        title: 'Two-Phase Locking (2PL) Timeline',
        asciiArt: `Lock Count
   ▲             [ Lock Point ]
   │                 /\
   │   GROWING      /  \      SHRINKING
   │    PHASE      /    \       PHASE
   │  (Acquire)   /      \    (Release)
   │             /        \
   └────────────┴──────────┴──────────────► Time
   (Cannot release yet)   (Cannot acquire any new locks)`,
        explanation: 'The strict separation between growing and shrinking phases enforces equivalent serial ordering.',
      },
      examFormula: {
        rule: 'Basic 2PL Theorem: Any schedule permitted under Two-Phase Locking is Conflict Serializable.',
        mnemonicOrCheck: 'Rigorous 2PL holds BOTH S and X locks until commit; Strict 2PL holds only X locks until commit.',
      },
      keyTakeaway: '2PL provides the mathematical foundation that allows thousands of concurrent users to access data simultaneously.',
    };
  }

  // 5. E-R Diagrams & Conceptual Design Poster
  if (lower.includes('e-r') || lower.includes('entity') || lower.includes('attribute') || lower.includes('relationship') || lower.includes('cardinality')) {
    return {
      topicTitle: 'Entity-Relationship (E-R) Modeling in DBMS',
      unitTitle: 'UNIT I – Overview of Database Systems',
      subtitle: 'From Enterprise Requirements to Normalized Conceptual Schemas',
      accentColor: 'amber',
      pillars: [
        {
          title: 'Entities & Entity Sets',
          badge: 'Rectangles',
          summary: 'Real-world distinguishable objects (e.g. Student, Employee, Department).',
          keyDetail: 'Weak entities lack a key and rely on an identifying owner entity via double rectangles.',
          iconSymbol: '📦',
        },
        {
          title: 'Attributes & Keys',
          badge: 'Ellipses',
          summary: 'Properties describing entities (Simple, Composite, Multivalued, Derived).',
          keyDetail: 'Primary key is underlined; multivalued is double ellipse; derived is dashed ellipse.',
          iconSymbol: '🏷️',
        },
        {
          title: 'Relationships & Roles',
          badge: 'Diamonds',
          summary: 'Associations between entities with explicit role labels and degree (binary/ternary).',
          keyDetail: 'Represented by diamonds connecting entity rectangles with mapping lines.',
          iconSymbol: '💎',
        },
        {
          title: 'Mapping Cardinalities',
          badge: '1:1, 1:N, N:M',
          summary: 'Limits on the number of relationship instances an entity can participate in.',
          keyDetail: '1:N relations place the foreign key in the N-side relation during schema mapping.',
          iconSymbol: '🔢',
        },
        {
          title: 'Enhanced ER (EER)',
          badge: 'Advanced',
          summary: 'Specialization (top-down), Generalization (bottom-up), and Aggregation.',
          keyDetail: 'Total participation (double line) vs partial participation (single line).',
          iconSymbol: '🏗️',
        },
      ],
      realWorldExample: {
        domain: 'Hospital Patient Care Management',
        problem: 'Mapping doctors, patients, wards, medications, and insurance policies without duplicate records.',
        dbmsSolution: 'Doctor (1) treats (M) Patients; Patient (M) receives (N) Medications mapped to Prescription table.',
        impact: 'Eliminates medication prescription mix-ups and enables automated regulatory compliance reporting.',
      },
      visualDiagram: {
        title: 'Standard Peter Chen E-R Notation Symbols',
        asciiArt: `[ Entity ]          ( Attribute )         < Relationship >
┌───────────┐         ╭─────────╮             ╱╲
│  STUDENT  │         │  Name   │            ╱  ╲  Enrolled_In
└───────────┘         ╰─────────╯            ╲  ╱
      │                    │                  ╲╱
      └────────────────────┴───────────────────┘
Double Rectangle = Weak Entity | Dashed Ellipse = Derived | Double Diamond = Identifying Rel`,
        explanation: 'E-R modeling bridges human business logic with concrete mathematical relational structures.',
      },
      examFormula: {
        rule: 'Mapping N:M to Tables: Always creates a separate junction table containing (PK1, PK2) as composite primary key.',
        mnemonicOrCheck: 'Entity = Noun, Attribute = Adjective/Detail, Relationship = Verb.',
      },
      keyTakeaway: 'Clear conceptual ER modeling prevents costly structural schema redesigns after deployment.',
    };
  }

  // 6. Generic/Universal DBMS Topic Poster Generator for any of the 57 syllabus topics
  const matchingSyllabus = ALL_DBMS_TOPICS.find((t) => t.name.toLowerCase() === lower || lower.includes(t.name.toLowerCase()));
  const topicName = matchingSyllabus?.name || content?.topicTitle || topicTitle;
  const unitName = matchingSyllabus?.unitTitle || 'DATABASE MANAGEMENT SYSTEMS';
  const headline = content?.simpleExplanation.headline || `Comprehensive core study guide for ${topicName} in relational database systems.`;
  const keyPoints = content?.simpleExplanation.keyPoints || [
    'Core theoretical foundation in relational database architecture.',
    'Guarantees consistency, ACID properties, and optimal query throughput.',
    'Essential university syllabus concept with high practical exam weighting.',
  ];

  return {
    topicTitle: topicName,
    unitTitle: unitName,
    subtitle: headline,
    accentColor: 'cyan',
    pillars: [
      {
        title: 'Core Architecture',
        badge: 'Fundamental Principle',
        summary: keyPoints[0] || 'Primary mechanical foundation in relational database systems.',
        keyDetail: 'Structures how data, records, or operations are managed by the storage engine.',
        iconSymbol: '🏛️',
      },
      {
        title: 'Integrity & Enforcement',
        badge: 'System Rules',
        summary: keyPoints[1] || 'Maintains strict consistency across concurrent operations.',
        keyDetail: 'Enforces constraints and avoids data anomalies during table modifications.',
        iconSymbol: '🛡️',
      },
      {
        title: 'Execution Lifecycle',
        badge: 'Operational Pipeline',
        summary: keyPoints[2] || 'Step-by-step query optimization and transaction scheduling.',
        keyDetail: 'Processes client commands through storage engine, buffer manager, and logs.',
        iconSymbol: '⚙️',
      },
      {
        title: 'Optimization & Scaling',
        badge: 'Performance',
        summary: 'Balances I/O cost, memory footprints, and disk access patterns.',
        keyDetail: 'Optimized for high-throughput enterprise relational workloads.',
        iconSymbol: '⚡',
      },
    ],
    realWorldExample: {
      domain: 'Enterprise Cloud Database Architecture',
      problem: `Ensuring robust, anomaly-free performance for ${topicName} under multi-tenant enterprise traffic.`,
      dbmsSolution: content?.realWorldAnalogy?.solutionTakeaway || `Relational DBMS engine coordinates catalog metadata, buffers, and transactions to isolate and optimize ${topicName}.`,
      impact: 'Guarantees 99.999% data consistency, eliminates race conditions, and lowers query execution latency.',
    },
    visualDiagram: {
      title: `${topicName} Structural Flow Diagram`,
      asciiArt: content?.visualExplanation?.diagramAscii || `+-------------------------------------------------------------+
|               RELATIONAL DATABASE MANAGEMENT SYSTEM         |
+-------------------------------------------------------------+
|  User Queries / Applications ──► [ Query Processor ]       |
|                                         │                   |
|                                         ▼                   |
|  [ Transaction & Concurrency ] ──► [ Storage & Buffer Mgr ] |
|                                         │                   |
|                                         ▼                   |
|  [ Data Files on Disk ] ◄────────► [ Write-Ahead Logs WAL ] |
+-------------------------------------------------------------+`,
      explanation: content?.visualExplanation?.diagramExplanation || `Illustrates how ${topicName} operates across database engine components and memory tiers.`,
    },
    examFormula: {
      rule: content?.simpleExplanation?.rulesOfThumb?.[0]?.rule || `Key Rule: Always verify primary keys, foreign keys, and transaction boundary guarantees for ${topicName}.`,
      mnemonicOrCheck: 'Exam Tip: Structure your answer around Definition, Architecture, Real-World Example, and SQL/Algebra Syntax.',
    },
    keyTakeaway: content?.realWorldAnalogy?.solutionTakeaway || `${topicName} provides the theoretical and operational backbone for reliable database systems.`,
  };
}
