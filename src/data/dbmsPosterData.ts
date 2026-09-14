import { ALL_DBMS_TOPICS, DBMS_SYLLABUS, DBMSTopicItem } from './dbmsSyllabus';

export type VisualFormatType =
  | 'comparison'
  | 'four_part'
  | 'er_diagram'
  | 'visual_flow'
  | 'sql_syntax'
  | 'relational_algebra'
  | 'process_flow'
  | 'lock_diagram'
  | 'disk_diagram'
  | 'concept_grid';

export interface TopicPosterData {
  topicId: string;
  topicTitle: string;
  unitId: string;
  unitTitle: string;
  category: string;
  visualFormat: VisualFormatType;
  visualFormatLabel: string;
  simpleExplanation: string;
  importantConcepts: { name: string; tag: string; description: string }[];
  keyPoints: string[];
  visualData: {
    title: string;
    subtitle?: string;
    type: VisualFormatType;
    comparisonData?: {
      leftTitle: string;
      rightTitle: string;
      rows: { feature: string; left: string; right: string; highlight?: boolean }[];
    };
    fourPartData?: {
      parts: { letter: string; name: string; tag: string; detail: string; icon: string }[];
    };
    erData?: {
      entities: { name: string; type: 'strong' | 'weak'; attributes: string[]; keyAttr: string }[];
      relationship: { name: string; type: string; cardinality: string };
      participation: string;
    };
    flowData?: {
      steps: { stepNum: number; title: string; subtitle: string; condition: string; eliminatedAnomaly: string }[];
    };
    sqlData?: {
      command: string;
      syntax: string;
      exampleCode: string;
      explanation: string;
      sampleResult?: { headers: string[]; rows: (string | number)[][] };
    };
    algebraData?: {
      operatorSymbol: string;
      operatorName: string;
      formula: string;
      relationR: { name: string; headers: string[]; rows: string[][] };
      relationS?: { name: string; headers: string[]; rows: string[][] };
      resultRelation: { name: string; headers: string[]; rows: string[][] };
      explanation: string;
    };
    processData?: {
      stages: { id: string; name: string; stateType: 'active' | 'success' | 'failure' | 'neutral'; note: string }[];
      summary: string;
    };
    lockData?: {
      lockTypes: { name: string; rule: string; compatibility: string }[];
      timelineSteps: { time: string; actionT1: string; actionT2: string; status: string }[];
      phaseDesc: string;
    };
    diskData?: {
      layers: { label: string; subLabel: string; size: string; role: string }[];
      blockLayout: { header: string; recordSlots: string[]; freeSpace: string };
    };
    conceptGridData?: {
      items: { title: string; tag: string; detail: string }[];
    };
  };
  simpleExample: {
    title: string;
    context: string;
    codeOrSample: string;
    takeaway: string;
  };
  rememberThis: string;
  examFocus: {
    highYieldTip: string;
    frequentQuestion: string;
    marksWeightage?: string;
  };
}

/**
 * Automatically identifies the best visual format archetype based on topic metadata.
 */
export function determineVisualFormat(topicName: string): VisualFormatType {
  const lower = topicName.toLowerCase();

  if (
    lower.includes('vs') ||
    lower.includes('file system') ||
    lower.includes('difference') ||
    lower.includes('comparison') ||
    lower.includes('specialization, generalization')
  ) {
    return 'comparison';
  }

  if (
    lower.includes('acid') ||
    lower.includes('four') ||
    lower.includes('data models') ||
    lower.includes('role-based')
  ) {
    return 'four_part';
  }

  if (
    lower.includes('e-r') ||
    lower.includes('er diagram') ||
    lower.includes('entit') ||
    lower.includes('relationship') ||
    lower.includes('conceptual database design with er')
  ) {
    return 'er_diagram';
  }

  if (
    lower.includes('normal') ||
    lower.includes('1nf') ||
    lower.includes('2nf') ||
    lower.includes('3nf') ||
    lower.includes('bcnf') ||
    lower.includes('4nf') ||
    lower.includes('functional depend') ||
    lower.includes('multivalued')
  ) {
    return 'visual_flow';
  }

  if (
    lower.includes('sql') ||
    lower.includes('ddl') ||
    lower.includes('dml') ||
    lower.includes('dcl') ||
    lower.includes('tcl') ||
    lower.includes('trigger') ||
    lower.includes('stored procedure') ||
    lower.includes('view') ||
    lower.includes('querying relational')
  ) {
    return 'sql_syntax';
  }

  if (
    lower.includes('algebra') ||
    lower.includes('selection') ||
    lower.includes('projection') ||
    lower.includes('join') ||
    lower.includes('division') ||
    lower.includes('set operations') ||
    lower.includes('renaming') ||
    lower.includes('calculus')
  ) {
    return 'relational_algebra';
  }

  if (
    lower.includes('transaction') ||
    lower.includes('schedule') ||
    lower.includes('recoverab') ||
    lower.includes('serializab') ||
    lower.includes('system concepts')
  ) {
    return 'process_flow';
  }

  if (
    lower.includes('lock') ||
    lower.includes('2pl') ||
    lower.includes('concurrency') ||
    lower.includes('timestamp')
  ) {
    return 'lock_diagram';
  }

  if (
    lower.includes('disk') ||
    lower.includes('storage') ||
    lower.includes('buffer') ||
    lower.includes('file record') ||
    lower.includes('operations on files') ||
    lower.includes('describing and storing')
  ) {
    return 'disk_diagram';
  }

  return 'concept_grid';
}

/**
 * Returns human-readable visual format label for the poster card.
 */
export function getVisualFormatBadge(type: VisualFormatType): string {
  switch (type) {
    case 'comparison':
      return 'Comparison Poster';
    case 'four_part':
      return '4-Part Visual Breakdown';
    case 'er_diagram':
      return 'ER Conceptual Diagram';
    case 'visual_flow':
      return 'Step-by-Step Visual Flow';
    case 'sql_syntax':
      return 'Syntax + Example + Output';
    case 'relational_algebra':
      return 'Algebraic Table Operation';
    case 'process_flow':
      return 'State Transition Flow';
    case 'lock_diagram':
      return 'Lock Protocol & Schedule';
    case 'disk_diagram':
      return 'Disk Block & Storage Layout';
    case 'concept_grid':
      return 'Architecture & Concept Grid';
  }
}

/**
 * Specialized Poster Generator: Returns high-density, college-level poster content
 * tailored specifically to each individual topic.
 */
export function getTopicPoster(unitId: string, topicName: string): TopicPosterData {
  const topicItem = ALL_DBMS_TOPICS.find(
    (t) => t.name.toLowerCase() === topicName.toLowerCase() || t.id === topicName
  ) || {
    id: `topic-${topicName.replace(/\s+/g, '-').toLowerCase()}`,
    unitId: unitId as any,
    unitTitle: `UNIT ${unitId.replace('unit-', '').toUpperCase()}`,
    name: topicName,
    shortDesc: 'Core DBMS fundamental topic',
    category: 'Foundations',
  };

  const visualFormat = determineVisualFormat(topicItem.name);
  const formatLabel = getVisualFormatBadge(visualFormat);
  const nameLower = topicItem.name.toLowerCase();

  // -------------------------------------------------------------
  // 1. FILE SYSTEM VS DBMS (Comparison Poster)
  // -------------------------------------------------------------
  if (nameLower.includes('file system vs dbms') || (nameLower.includes('file') && nameLower.includes('dbms'))) {
    return {
      topicId: topicItem.id,
      topicTitle: 'File System vs DBMS',
      unitId: topicItem.unitId,
      unitTitle: 'Unit I – Database Systems & ER Model',
      category: 'Foundations',
      visualFormat: 'comparison',
      visualFormatLabel: formatLabel,
      simpleExplanation:
        'Traditional OS file systems store unstructured files with application-specific parsing, causing massive redundancy and race conditions. A DBMS acts as an intelligent intermediary ensuring consistency, security, and declarative querying.',
      importantConcepts: [
        { name: 'Data Redundancy', tag: 'Duplication', description: 'Identical student data copied across multiple departmental files.' },
        { name: 'Concurrent Inconsistency', tag: 'Race Hazard', description: 'Simultaneous file writes overwrite each other without isolation.' },
        { name: 'Data Independence', tag: 'Abstraction', description: 'Separating physical storage formats from user-facing query schemas.' },
      ],
      keyPoints: [
        'Redundancy & Inconsistency: File systems allow duplicate files; DBMS enforces centralized single-source storage.',
        'Difficulty in Access: File systems require custom C++/Java code; DBMS uses declarative high-level SQL.',
        'Data Isolation: Files scatter in multiple incompatible formats; DBMS provides unified relational tables.',
        'Integrity Problems: File code hardcodes constraints; DBMS declares PRIMARY KEY, FOREIGN KEY, and CHECK.',
        'Atomicity & Crash Recovery: File crashes leave half-written files; DBMS logs guarantee complete rollback.',
        'Concurrent Access Anomalies: File locking locks entire files; DBMS supports row-level lock concurrency.',
      ],
      visualData: {
        title: 'Side-by-Side Architectural Comparison',
        subtitle: 'Why modern computing transitioned from OS files to centralized Database Management Systems',
        type: 'comparison',
        comparisonData: {
          leftTitle: 'Traditional File System',
          rightTitle: 'Modern Relational DBMS',
          rows: [
            { feature: 'Data Redundancy', left: 'High; identical data duplicated across files', right: 'Minimal; controlled through normalization', highlight: true },
            { feature: 'Data Access', left: 'Requires custom application code per file', right: 'Declarative SQL (SELECT, INSERT, UPDATE)', highlight: false },
            { feature: 'Integrity Constraints', left: 'Hardcoded in program code; easily bypassed', right: 'Enforced at engine level (PK, FK, CHECK)', highlight: true },
            { feature: 'Concurrent Access', left: 'Whole file locks; causes severe write conflicts', right: 'Fine-grained tuple/page locks via 2PL', highlight: false },
            { feature: 'Crash Recovery', left: 'Manual recovery; partial writes corrupt files', right: 'Automated WAL (Write-Ahead Logging) & ACID', highlight: true },
            { feature: 'Security & Access', left: 'Basic OS user read/write permissions', right: 'Granular Role-Based Access Control (DCL)', highlight: false },
          ],
        },
      },
      simpleExample: {
        title: 'Banking Balance Update Scenario',
        context: 'Two ATMs simultaneously withdrawing $100 from an account with $500 balance.',
        codeOrSample:
          'File System: ATM-A and ATM-B read balance.txt ($500) concurrently.\nATM-A writes $400. ATM-B writes $400.\nResult: $200 dispensed, but bank balance records $400! (Lost Update)\n\nDBMS: Transaction T1 acquires EXCLUSIVE LOCK on Account row.\nTransaction T2 must wait until T1 commits. Final balance: $300.',
        takeaway: 'DBMS prevents the classic "Lost Update" anomaly that routinely corrupts naive file systems.',
      },
      rememberThis:
        'A File System manages "files on disk"; a DBMS manages "structured data, relationships, and transaction safety".',
      examFocus: {
        highYieldTip:
          'In university exams, always structure this answer with a neat 5-column table: Parameter, File System, DBMS, Example, and Consequence of Failure.',
        frequentQuestion: 'State 5 disadvantages of File Processing Systems and how DBMS overcomes each.',
        marksWeightage: '8 to 10 Marks (Compulsory Unit I Question)',
      },
    };
  }

  // -------------------------------------------------------------
  // 2. ACID PROPERTIES (Four-Part Visual)
  // -------------------------------------------------------------
  if (nameLower.includes('acid') || nameLower.includes('transaction and system concepts')) {
    return {
      topicId: topicItem.id,
      topicTitle: 'ACID Properties in DBMS',
      unitId: topicItem.unitId,
      unitTitle: 'Unit IV – Transaction Processing',
      category: 'Transactions',
      visualFormat: 'four_part',
      visualFormatLabel: formatLabel,
      simpleExplanation:
        'A transaction is a logical unit of work. To guarantee database integrity in the presence of system crashes and concurrent users, every DBMS strictly enforces the four ACID properties.',
      importantConcepts: [
        { name: 'Atomicity', tag: 'All or Nothing', description: 'Either all operations of the transaction reflect in the DB or none do.' },
        { name: 'Consistency', tag: 'Integrity Preservation', description: 'Execution in isolation preserves all database integrity constraints.' },
        { name: 'Isolation', tag: 'Hidden Intermediate States', description: 'Concurrent transactions execute as if they were running alone.' },
        { name: 'Durability', tag: 'Permanent Persistence', description: 'Once committed, updates survive even catastrophic power crashes.' },
      ],
      keyPoints: [
        'A - Atomicity: Managed by the Recovery Manager using Write-Ahead Logging (WAL) and Undo logs.',
        'C - Consistency: Handled by Application Developers and DBMS constraint checkers (Schema assertions).',
        'I - Isolation: Handled by the Concurrency Control Manager using Locking (2PL) or Timestamps.',
        'D - Durability: Handled by the Recovery Manager using Redo logs on non-volatile stable storage.',
        'If any step fails before COMMIT, the transaction is ABORTED and completely ROLLED BACK.',
        'Isolation levels range from Read Uncommitted to Serializable according to ANSI SQL standards.',
      ],
      visualData: {
        title: 'The Four Pillars of Transaction Reliability (ACID)',
        subtitle: 'Core guarantees preventing corruption across failures and multi-user concurrency',
        type: 'four_part',
        fourPartData: {
          parts: [
            { letter: 'A', name: 'Atomicity', tag: 'All or Nothing', detail: 'Guaranteed by Undo Logs. If money is debited from Account A but power fails before crediting B, debit is undone.', icon: '⚡' },
            { letter: 'C', name: 'Consistency', tag: 'Valid State Only', detail: 'Sum of balances before transfer ($500+$300=$800) must exactly equal sum after transfer ($400+$400=$800).', icon: '⚖️' },
            { letter: 'I', name: 'Isolation', tag: 'Zero Interference', detail: 'Guaranteed by Concurrency Control. Intermediate uncommitted debit states are invisible to other transactions.', icon: '🛡️' },
            { letter: 'D', name: 'Durability', tag: 'Permanent Commitment', detail: 'Guaranteed by Redo Logs. Once "Transaction Successful" is returned, data will never be lost if server crashes.', icon: '💾' },
          ],
        },
      },
      simpleExample: {
        title: 'Bank Transfer: A transfers $100 to B',
        context: 'T: Read(A); A := A - 100; Write(A); Read(B); B := B + 100; Write(B); Commit;',
        codeOrSample:
          '1. Read(A) -> $500\n2. A := 500 - 100 -> $400\n3. Write(A) -> $400\n[CRASH OCCURS HERE BEFORE WRITING B!]\nRecovery Action: Recovery Manager reads UNDO log, restores A to $500. No money vanishes.',
        takeaway: 'Atomicity ensures no partial state persists; Consistency ensures total money remains constant.',
      },
      rememberThis:
        'Mnemonic: "ACID = All-or-Nothing, Correctness, Invisible-interim, Definite-persistence".',
      examFocus: {
        highYieldTip:
          'Always mention which DBMS subsystem is responsible for which letter: Atomicity & Durability -> Recovery Manager; Isolation -> Concurrency Control Manager; Consistency -> Application + Constraints.',
        frequentQuestion: 'Explain ACID properties with a bank fund transfer example and state the role of WAL.',
        marksWeightage: '7 to 10 Marks (Frequent Exam Question)',
      },
    };
  }

  // -------------------------------------------------------------
  // 3. E-R DIAGRAMS & ER MODEL (ER Diagram)
  // -------------------------------------------------------------
  if (nameLower.includes('e-r') || nameLower.includes('er diagram') || nameLower.includes('entities') || nameLower.includes('relationships')) {
    return {
      topicId: topicItem.id,
      topicTitle: 'Entity-Relationship (E-R) Modeling',
      unitId: topicItem.unitId,
      unitTitle: 'Unit I – Database Systems & ER Model',
      category: 'ER Model',
      visualFormat: 'er_diagram',
      visualFormatLabel: formatLabel,
      simpleExplanation:
        'An Entity-Relationship diagram is a high-level conceptual blueprint of a database. It models real-world objects as entities, their properties as attributes, and enterprise associations as relationships.',
      importantConcepts: [
        { name: 'Entity Set', tag: 'Rectangle', description: 'Collection of similar real-world entities (e.g., Student, Course).' },
        { name: 'Attributes', tag: 'Ellipse', description: 'Properties describing an entity (Primary Key underlined, Multi-valued double ellipse).' },
        { name: 'Relationship Set', tag: 'Diamond', description: 'Association between two or more entity sets (e.g., EnrollsIn).' },
        { name: 'Cardinality', tag: '1:1, 1:N, N:M', description: 'Number of entity instances associated with instances of another entity.' },
      ],
      keyPoints: [
        'Rectangle = Entity Set; Double Rectangle = Weak Entity Set (lacks a candidate key).',
        'Ellipse = Attribute; Double Ellipse = Multi-valued Attribute (e.g., PhoneNumbers).',
        'Dashed Ellipse = Derived Attribute (computed at runtime, e.g., Age from DateOfBirth).',
        'Underlined Attribute = Primary Key (e.g., RollNo, StudentID).',
        'Diamond = Relationship Set; Double Diamond = Identifying Relationship for weak entities.',
        'Cardinality Ratios: One-to-One (1:1), One-to-Many (1:N), Many-to-One (N:1), Many-to-Many (N:M).',
      ],
      visualData: {
        title: 'Conceptual University E-R Diagram Structure',
        subtitle: 'Visual mapping of Student entity, Enrollment relationship, and Course entity',
        type: 'er_diagram',
        erData: {
          entities: [
            { name: 'STUDENT', type: 'strong', attributes: ['RollNo (PK)', 'Name', 'Email', 'PhoneNumbers (Multi)'], keyAttr: 'RollNo' },
            { name: 'COURSE', type: 'strong', attributes: ['CourseId (PK)', 'Title', 'Credits'], keyAttr: 'CourseId' },
          ],
          relationship: { name: 'ENROLLS_IN', type: 'Binary Relationship (Diamond)', cardinality: 'Many-to-Many (N:M)' },
          participation: 'Total Participation (Double Line): Every student must enroll in at least one course.',
        },
      },
      simpleExample: {
        title: 'Weak Entity Example: Employee & Dependent',
        context: 'A Dependent cannot exist in the database without a parent Employee.',
        codeOrSample:
          'EMPLOYEE [EmpID (PK), Name] ────< HAS >════ [DEPENDENT] (Double Box)\nRelationship: <HAS> is drawn as Double Diamond.\nDependent attributes: DepName (Dashed underline = Partial Key / Discriminator), Age.\nIdentifying Key for Dependent = {EmpID + DepName}.',
        takeaway: 'Weak entities always require the primary key of their identifying strong entity for unique identification.',
      },
      rememberThis:
        'Symbols Cheat Sheet: Rectangle = Entity, Diamond = Relationship, Ellipse = Attribute, Double = Weak/Multi-valued, Dashed = Derived/Partial.',
      examFocus: {
        highYieldTip:
          'Draw the shapes using a ruler or neat lines in university exams. Clearly underline primary keys and use double lines for total participation.',
        frequentQuestion: 'Draw an ER diagram for a Hospital / Banking / College Management System with cardinalities.',
        marksWeightage: '10 to 14 Marks (Full Main Question in Unit I)',
      },
    };
  }

  // -------------------------------------------------------------
  // 4. NORMALIZATION & NORMAL FORMS (Visual Flow: 1NF -> 2NF -> 3NF -> BCNF)
  // -------------------------------------------------------------
  if (
    nameLower.includes('normal') ||
    nameLower.includes('1nf') ||
    nameLower.includes('2nf') ||
    nameLower.includes('3nf') ||
    nameLower.includes('bcnf') ||
    nameLower.includes('functional dep')
  ) {
    return {
      topicId: topicItem.id,
      topicTitle: 'Normalization: 1NF → 2NF → 3NF → BCNF',
      unitId: topicItem.unitId,
      unitTitle: 'Unit III – SQL and Normalization',
      category: 'Normalization',
      visualFormat: 'visual_flow',
      visualFormatLabel: formatLabel,
      simpleExplanation:
        'Normalization is the formal process of decomposing relations to eliminate data redundancy, insertion anomalies, update anomalies, and deletion anomalies while preserving functional dependencies and lossless joins.',
      importantConcepts: [
        { name: '1NF (Atomic Values)', tag: 'No Repeating Groups', description: 'Every column attribute must contain only indivisible, atomic values.' },
        { name: '2NF (No Partial Dep)', tag: 'Full Functional Dep', description: 'Every non-prime attribute must depend on the WHOLE candidate key.' },
        { name: '3NF (No Transitive Dep)', tag: 'X is Superkey or Y is Prime', description: 'Non-prime attributes cannot determine other non-prime attributes.' },
        { name: 'BCNF (Boyce-Codd)', tag: 'Every Determinant is Superkey', description: 'For every dependency X → Y, X must be a superkey.' },
      ],
      keyPoints: [
        '1NF Requirement: Eliminate arrays, nested tables, and comma-separated lists from cells.',
        '2NF Requirement: Must be in 1NF + no non-prime attribute depends on a proper subset of a composite key.',
        '3NF Requirement: Must be in 2NF + for every X → Y, either X is a superkey OR Y is a prime attribute.',
        'BCNF Requirement: Stricter than 3NF. For every X → Y, X MUST be a superkey (no exceptions).',
        'Lossless Join Decomposition: R1 ⨝ R2 = R guarantees no spurious rows are generated when recombined.',
        'Dependency Preservation: All original functional dependencies can be enforced using decomposed tables alone.',
      ],
      visualData: {
        title: 'Step-by-Step Normalization Pipeline',
        subtitle: 'Sequential progression eliminating anomalies from unnormalized relations to BCNF',
        type: 'visual_flow',
        flowData: {
          steps: [
            { stepNum: 1, title: 'First Normal Form (1NF)', subtitle: 'Atomic Attributes', condition: 'Values in all columns are single, indivisible scalar units.', eliminatedAnomaly: 'Eliminates multi-valued attributes and variable-length row records.' },
            { stepNum: 2, title: 'Second Normal Form (2NF)', subtitle: 'No Partial Dependencies', condition: 'No non-key attribute depends on part of a composite primary key.', eliminatedAnomaly: 'Eliminates redundancy caused by repeated composite key components.' },
            { stepNum: 3, title: 'Third Normal Form (3NF)', subtitle: 'No Transitive Dependencies', condition: 'For X → Y: X is Superkey OR Y is a Prime attribute (X → Z → Y banned).', eliminatedAnomaly: 'Eliminates transitive updates where updating Z corrupts dependent Y.' },
            { stepNum: 4, title: 'Boyce-Codd Normal Form (BCNF)', subtitle: 'Strict Superkey Determinant', condition: 'For EVERY functional dependency X → Y, X must be a candidate superkey.', eliminatedAnomaly: 'Eliminates anomalies from overlapping candidate keys where 3NF fails.' },
          ],
        },
      },
      simpleExample: {
        title: 'Student-Advisor Relation Decomposition into BCNF',
        context: 'Relation: Enrollment(StudentID, Subject, Professor) where {StudentID, Subject} is PK, and Professor → Subject.',
        codeOrSample:
          'Problem: Professor → Subject violates BCNF because Professor is NOT a superkey!\n\nDecomposition into 2 BCNF tables:\n1. Teaching(Professor, Subject) -- PK is Professor. Satisfies BCNF!\n2. StudentCourse(StudentID, Professor) -- PK is {StudentID, Professor}. Satisfies BCNF!\n\nResult: Lossless join guaranteed because {Teaching ∩ StudentCourse} = {Professor}, which is PK of Teaching.',
        takeaway: 'BCNF ensures every determinant is a superkey, eliminating update and deletion anomalies.',
      },
      rememberThis:
        'The Golden Normalization Rule: "The key, the whole key (2NF), and nothing but the key (3NF), so help me Codd (BCNF)."',
      examFocus: {
        highYieldTip:
          'Practice finding attribute closures (X+) and candidate keys first. In 3NF check: is X a superkey? If not, is Y part of ANY candidate key? If yes, it is valid 3NF.',
        frequentQuestion: 'Given R(A,B,C,D,E) with F = {A->B, BC->D, E->C}, find candidate keys and highest normal form.',
        marksWeightage: '10 to 14 Marks (Most frequently asked problem in DBMS exams)',
      },
    };
  }

  // -------------------------------------------------------------
  // 5. SQL SYNTAX & DDL/DML/DCL/TCL (SQL Syntax + Example + Result)
  // -------------------------------------------------------------
  if (
    nameLower.includes('sql') ||
    nameLower.includes('ddl') ||
    nameLower.includes('dml') ||
    nameLower.includes('dcl') ||
    nameLower.includes('tcl') ||
    nameLower.includes('trigger') ||
    nameLower.includes('views')
  ) {
    return {
      topicId: topicItem.id,
      topicTitle: `${topicItem.name} in SQL`,
      unitId: topicItem.unitId,
      unitTitle: 'Unit III – SQL and Normalization',
      category: 'SQL',
      visualFormat: 'sql_syntax',
      visualFormatLabel: formatLabel,
      simpleExplanation:
        'SQL (Structured Query Language) is the standard declarative language for interacting with relational databases. Commands are categorized into DDL (structure), DML (data), DCL (permissions), and TCL (transactions).',
      importantConcepts: [
        { name: 'DDL', tag: 'Structure', description: 'CREATE, ALTER, DROP, TRUNCATE, RENAME definitions.' },
        { name: 'DML', tag: 'Data', description: 'INSERT INTO, UPDATE, DELETE FROM, SELECT data modifications.' },
        { name: 'DCL', tag: 'Control', description: 'GRANT and REVOKE user privileges and database roles.' },
        { name: 'TCL', tag: 'Transactions', description: 'COMMIT (persist), ROLLBACK (undo), SAVEPOINT (checkpoint).' },
      ],
      keyPoints: [
        'DDL statements auto-commit in most engines (cannot be rolled back in MySQL/Oracle).',
        'TRUNCATE is faster than DELETE: it deallocates data pages without logging individual row deletions.',
        'WHERE filters rows BEFORE grouping; HAVING filters aggregated groups AFTER GROUP BY.',
        'Aggregate functions (COUNT, SUM, AVG, MIN, MAX) ignore NULL values except COUNT(*).',
        'Triggers execute automatically in response to INSERT, UPDATE, or DELETE events (BEFORE/AFTER).',
        'Views provide a virtual layer: CREATE VIEW hides sensitive salary or personal columns from regular users.',
      ],
      visualData: {
        title: 'SQL Command Execution & Query Result Architecture',
        subtitle: 'Standard query construction, database schema interaction, and resulting relation',
        type: 'sql_syntax',
        sqlData: {
          command: 'GROUP BY with HAVING & Aggregates',
          syntax:
            'SELECT Department, COUNT(*) AS TotalEmployees, AVG(Salary) AS AvgSalary\nFROM Employees\nWHERE Status = \'Active\'\nGROUP BY Department\nHAVING COUNT(*) >= 2\nORDER BY AvgSalary DESC;',
          exampleCode:
            '-- 1. Create table with primary & foreign keys\nCREATE TABLE Employees (\n  EmpId INT PRIMARY KEY,\n  EmpName VARCHAR(50) NOT NULL,\n  Department VARCHAR(30),\n  Salary DECIMAL(10,2),\n  Status VARCHAR(10) DEFAULT \'Active\'\n);',
          explanation:
            'Evaluated in this strict order: 1. FROM -> 2. WHERE -> 3. GROUP BY -> 4. HAVING -> 5. SELECT -> 6. ORDER BY.',
          sampleResult: {
            headers: ['Department', 'TotalEmployees', 'AvgSalary'],
            rows: [
              ['Engineering', 4, 92500],
              ['Data Science', 3, 88000],
              ['Product', 2, 79000],
            ],
          },
        },
      },
      simpleExample: {
        title: 'TRUNCATE vs DELETE Comparison',
        context: 'Clearing employee records for a new financial year.',
        codeOrSample:
          'DELETE FROM Employees WHERE Department = \'Sales\';\n-- Slower: scans table, checks row locks, logs each deleted tuple to UNDO log.\n\nTRUNCATE TABLE Employees;\n-- Fast: drops disk pages directly, resets AUTO_INCREMENT counters, minimal logging.',
        takeaway: 'Use DELETE for conditional filtering; use TRUNCATE for instant, complete table clearing.',
      },
      rememberThis:
        'Logical SQL Execution Order: "FROM → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT".',
      examFocus: {
        highYieldTip:
          'A classic exam trap: NEVER use aggregate functions like WHERE AVG(Salary) > 50000; aggregate filtering MUST go in HAVING after GROUP BY.',
        frequentQuestion: 'Write SQL queries demonstrating Subqueries, GROUP BY with HAVING, and Joins.',
        marksWeightage: '8 to 12 Marks (Mandatory coding section in exam)',
      },
    };
  }

  // -------------------------------------------------------------
  // 6. RELATIONAL ALGEBRA (Table + Operations + Result)
  // -------------------------------------------------------------
  if (
    nameLower.includes('algebra') ||
    nameLower.includes('selection') ||
    nameLower.includes('projection') ||
    nameLower.includes('join') ||
    nameLower.includes('division') ||
    nameLower.includes('set operations') ||
    nameLower.includes('renaming') ||
    nameLower.includes('calculus')
  ) {
    return {
      topicId: topicItem.id,
      topicTitle: `${topicItem.name} in Relational Algebra`,
      unitId: topicItem.unitId,
      unitTitle: 'Unit II – Relational Model, Algebra & Calculus',
      category: 'Algebra',
      visualFormat: 'relational_algebra',
      visualFormatLabel: formatLabel,
      simpleExplanation:
        'Relational Algebra is a formal, procedural query language. It takes one or two relations as input and produces a new relation as output, forming the mathematical foundation for SQL query optimization.',
      importantConcepts: [
        { name: 'Selection (σ)', tag: 'Horizontal Filter', description: 'σ_predicate(R) selects tuples that satisfy the condition.' },
        { name: 'Projection (π)', tag: 'Vertical Extraction', description: 'π_attr1,attr2(R) extracts specific columns and removes duplicate tuples.' },
        { name: 'Natural Join (⨝)', tag: 'Cartesian + Match', description: 'Combines tuples from R and S with identical values on common attributes.' },
        { name: 'Division (÷)', tag: 'Universal For-All', description: 'Finds tuples in R that match ALL tuples in S.' },
      ],
      keyPoints: [
        'Fundamental Operators: Selection (σ), Projection (π), Union (∪), Set Difference (−), Cartesian Product (×), Renaming (ρ).',
        'Derived Operators: Natural Join (⨝), Theta Join (⨝_θ), Intersection (∩), Division (÷).',
        'Union Compatibility: R ∪ S and R − S require both relations to have the same number of attributes with compatible domains.',
        'Selection (σ) preserves relation degree (number of columns) but filters cardinality (number of rows).',
        'Projection (π) preserves relation cardinality (up to duplicates) but filters degree (columns).',
        'Query Optimizer transforms high-level SQL queries into Relational Algebra expression trees to push selections down.',
      ],
      visualData: {
        title: 'Formal Relational Algebra Operation & Result',
        subtitle: 'Natural Join (⨝) between Student and Department relations',
        type: 'relational_algebra',
        algebraData: {
          operatorSymbol: '⨝',
          operatorName: 'Natural Join (R ⨝ S)',
          formula: 'Result = π_RollNo,Name,DeptName(σ_Student.DeptId = Dept.DeptId (Student × Dept))',
          relationR: {
            name: 'STUDENT (R)',
            headers: ['RollNo', 'Name', 'DeptId'],
            rows: [
              ['101', 'Alice', 'D1'],
              ['102', 'Bob', 'D2'],
              ['103', 'Charlie', 'D1'],
            ],
          },
          relationS: {
            name: 'DEPARTMENT (S)',
            headers: ['DeptId', 'DeptName'],
            rows: [
              ['D1', 'Computer Science'],
              ['D2', 'Electronics'],
            ],
          },
          resultRelation: {
            name: 'STUDENT ⨝ DEPARTMENT',
            headers: ['RollNo', 'Name', 'DeptId', 'DeptName'],
            rows: [
              ['101', 'Alice', 'D1', 'Computer Science'],
              ['102', 'Bob', 'D2', 'Electronics'],
              ['103', 'Charlie', 'D1', 'Computer Science'],
            ],
          },
          explanation:
            'The common attribute "DeptId" is matched. Matching rows are combined; non-matching rows are dropped.',
        },
      },
      simpleExample: {
        title: 'Division Operator (÷) "For All" Query',
        context: 'Query: "Find students who have enrolled in ALL subjects offered by CS Dept".',
        codeOrSample:
          'Enrollment(StudentId, SubjectCode) ÷ CSSubjects(SubjectCode)\n\nIf CSSubjects = {CS101, CS102}:\nAlice has taken {CS101, CS102, CS103} -> INCLUDED\nBob has taken {CS101} -> EXCLUDED\nResult: {Alice}',
        takeaway: 'Whenever a query requires "Find X who has done ALL Y", use the Relational Algebra Division (÷) operator.',
      },
      rememberThis:
        'Greek Symbols: σ = Sigma = Selection (rows), π = Pi = Projection (columns), ρ = Rho = Renaming, ⨝ = Bowtie = Join, ÷ = Division.',
      examFocus: {
        highYieldTip:
          'In exam questions, always remember that Projection (π) inherently eliminates duplicate tuples in relational algebra theory, unlike standard SQL SELECT.',
        frequentQuestion: 'Given schema Sailors, Boats, Reserves, write Relational Algebra queries for 5 standard scenarios.',
        marksWeightage: '8 to 10 Marks (Compulsory in Unit II)',
      },
    };
  }

  // -------------------------------------------------------------
  // 7. TRANSACTION PROCESSING (Process Flow / State Transition)
  // -------------------------------------------------------------
  if (
    nameLower.includes('transaction') ||
    nameLower.includes('schedules') ||
    nameLower.includes('serializab') ||
    nameLower.includes('recoverab')
  ) {
    return {
      topicId: topicItem.id,
      topicTitle: `${topicItem.name}`,
      unitId: topicItem.unitId,
      unitTitle: 'Unit IV – Transaction Processing',
      category: 'Transactions',
      visualFormat: 'process_flow',
      visualFormatLabel: formatLabel,
      simpleExplanation:
        'During execution, a transaction traverses a well-defined set of states: from Active during initial SQL operations, through Partially Committed upon finishing the last statement, to either Committed (permanent) or Failed/Aborted (completely rolled back).',
      importantConcepts: [
        { name: 'Active', tag: 'Initial State', description: 'Transaction enters this state upon start and stays here while executing operations.' },
        { name: 'Partially Committed', tag: 'Before Output', description: 'Last statement has executed, but updates reside in volatile buffer memory.' },
        { name: 'Committed', tag: 'Success (Permanent)', description: 'Write-Ahead Log records flushed to non-volatile disk; transaction is complete.' },
        { name: 'Failed & Aborted', tag: 'Failure & Rollback', description: 'System crash or constraint violation triggers rollback restoring old state.' },
      ],
      keyPoints: [
        'Active: Executing read and write commands in transaction memory buffers.',
        'Partially Committed: The transaction is complete in RAM, but commits must be made durable on stable disk.',
        'Failed: Hardware fault, division by zero, or deadlock prevents normal execution.',
        'Aborted: Database Recovery Manager executes UNDO log records to revert all uncommitted modifications.',
        'Once a transaction reaches COMMITTED, it can NEVER be aborted; compensation transactions are required instead.',
        'Precedence Graph (Serialization Graph): A cycle in the graph indicates the schedule is NOT conflict serializable.',
      ],
      visualData: {
        title: 'Transaction State Transition Machine',
        subtitle: 'The five discrete operational states managed by the DBMS Transaction Manager',
        type: 'process_flow',
        processData: {
          stages: [
            { id: '1', name: 'ACTIVE', stateType: 'active', note: 'Executing SQL reads/writes in buffer memory' },
            { id: '2', name: 'PARTIALLY COMMITTED', stateType: 'neutral', note: 'Last statement finished; flushing logs to disk' },
            { id: '3', name: 'COMMITTED', stateType: 'success', note: 'Successfully completed & durable on stable disk' },
            { id: '4', name: 'FAILED', stateType: 'failure', note: 'Exception, deadlock, or crash detected' },
            { id: '5', name: 'ABORTED', stateType: 'failure', note: 'Database restored to state prior to transaction' },
          ],
          summary: 'State Path: Active -> Partially Committed -> Committed (Normal) OR Active/Partially Committed -> Failed -> Aborted (Failure).',
        },
      },
      simpleExample: {
        title: 'Precedence Graph Conflict Serializability Test',
        context: 'Schedule S: T1: Read(A), Write(A); T2: Read(A), Write(A); T1: Read(B), Write(B); T2: Read(B), Write(B);',
        codeOrSample:
          'Conflicting Operations on item A:\nT1: Write(A) happens before T2: Read(A) --> Edge T1 -> T2\n\nConflicting Operations on item B:\nT1: Write(B) happens before T2: Read(B) --> Edge T1 -> T2\n\nGraph Nodes: {T1, T2}. Edges: {T1 -> T2}.\nResult: No cycles! Therefore, Schedule S is CONFLICT SERIALIZABLE (equivalent to serial schedule <T1, T2>).',
        takeaway: 'If the precedence graph contains no directed cycle, the concurrent schedule is conflict serializable and safe.',
      },
      rememberThis:
        'Two operations conflict if: 1. They belong to different transactions, 2. They access the same data item, and 3. At least one is a WRITE.',
      examFocus: {
        highYieldTip:
          'Draw the transaction state diagram with all 5 nodes and directed arrows labeled with triggers (Last statement executed, Failure detected, Rollback complete).',
        frequentQuestion: 'Draw and explain the Transaction State Transition diagram with an example of serializability.',
        marksWeightage: '8 to 10 Marks (Unit IV Core Question)',
      },
    };
  }

  // -------------------------------------------------------------
  // 8. CONCURRENCY CONTROL & 2PL (Lock Protocol & Diagram)
  // -------------------------------------------------------------
  if (
    nameLower.includes('lock') ||
    nameLower.includes('2pl') ||
    nameLower.includes('concurrency') ||
    nameLower.includes('timestamp ordering')
  ) {
    return {
      topicId: topicItem.id,
      topicTitle: `${topicItem.name}`,
      unitId: topicItem.unitId,
      unitTitle: 'Unit V – Concurrency Control & Disk Storage',
      category: 'Concurrency',
      visualFormat: 'lock_diagram',
      visualFormatLabel: formatLabel,
      simpleExplanation:
        'Two-Phase Locking (2PL) is a concurrency control protocol that guarantees conflict serializability. Each transaction must acquire all locks during a Growing Phase and release all locks during a Shrinking Phase without ever acquiring a new lock after releasing one.',
      importantConcepts: [
        { name: 'Shared Lock (S-Lock)', tag: 'Read Only', description: 'Multiple transactions can hold S-locks concurrently on the same item.' },
        { name: 'Exclusive Lock (X-Lock)', tag: 'Read & Write', description: 'Only one transaction can hold an X-lock; blocks all other S and X requests.' },
        { name: 'Growing Phase', tag: 'Acquiring Locks', description: 'Transaction acquires locks; releasing any lock is strictly prohibited.' },
        { name: 'Shrinking Phase', tag: 'Releasing Locks', description: 'Transaction releases locks; acquiring any new lock is strictly prohibited.' },
      ],
      keyPoints: [
        'Basic 2PL Rule: Once a transaction releases its first lock, it can never acquire any additional lock.',
        'Lock Point: The instant when a transaction acquires its final lock (maximum lock concurrency point).',
        'Strict 2PL: All Exclusive (X) locks must be held until the transaction COMMITS or ABORTS (prevents cascading aborts).',
        'Rigorous 2PL: Both Shared (S) and Exclusive (X) locks are held until COMMIT/ABORT.',
        'Deadlock: 2PL does NOT prevent deadlocks (e.g., T1 holds A waiting for B; T2 holds B waiting for A).',
        'Deadlock Handling: Solved via Wait-for-Graph (cycle detection) or timestamp algorithms (Wait-Die / Wound-Wait).',
      ],
      visualData: {
        title: 'Two-Phase Locking Protocol & Compatibility Matrix',
        subtitle: 'Growing vs Shrinking phase timeline and lock compatibility guarantees',
        type: 'lock_diagram',
        lockData: {
          lockTypes: [
            { name: 'Shared (S)', rule: 'Requested for read-only operations', compatibility: 'Compatible with other Shared locks; Conflicts with Exclusive' },
            { name: 'Exclusive (X)', rule: 'Requested for write/update operations', compatibility: 'Conflicts with BOTH Shared and Exclusive locks' },
          ],
          timelineSteps: [
            { time: 'T=1', actionT1: 'Lock-S(Item_A)', actionT2: 'Wait (idle)', status: 'Growing Phase' },
            { time: 'T=2', actionT1: 'Lock-X(Item_B)', actionT2: 'Lock-S(Item_C)', status: 'Lock Point Reached' },
            { time: 'T=3', actionT1: 'Unlock(Item_A)', actionT2: 'Wait for Item_B', status: 'Shrinking Phase (No new locks allowed)' },
            { time: 'T=4', actionT1: 'Commit & Unlock(Item_B)', actionT2: 'Acquires Item_B', status: 'Complete' },
          ],
          phaseDesc: 'Growing Phase (Number of locks increases) -> LOCK POINT -> Shrinking Phase (Number of locks decreases).',
        },
      },
      simpleExample: {
        title: 'Lock Compatibility Matrix',
        context: 'Evaluating whether Transaction 2 can acquire lock when Transaction 1 already holds a lock.',
        codeOrSample:
          'Existing Lock held by T1 \\ Lock requested by T2:\n            | Shared (S) | Exclusive (X) |\n Shared (S) |    YES     |      NO       |\n Exclusive(X)|     NO      |      NO       |\n\nExample: If T1 is reading salary (S-lock), T2 can also read salary (S-lock).\nIf T1 is updating salary (X-lock), T2 cannot read or write until T1 unlocks.',
        takeaway: 'Shared locks can be shared; Exclusive locks exclude everyone else.',
      },
      rememberThis:
        'Basic 2PL guarantees Conflict Serializability, but does NOT prevent Deadlocks or Cascading Rollbacks. Strict 2PL prevents Cascading Rollbacks.',
      examFocus: {
        highYieldTip:
          'Differentiate Basic 2PL, Conservative 2PL, Strict 2PL, and Rigorous 2PL in a comparative table. Draw the curve showing the Lock Point peak.',
        frequentQuestion: 'Explain Two-Phase Locking (2PL) protocol. How does Strict 2PL prevent cascading aborts?',
        marksWeightage: '8 to 10 Marks (Unit V Core Question)',
      },
    };
  }

  // -------------------------------------------------------------
  // 9. DISK STORAGE & BUFFERING (Disk / Block / Record Diagram)
  // -------------------------------------------------------------
  if (
    nameLower.includes('disk') ||
    nameLower.includes('storage') ||
    nameLower.includes('buffer') ||
    nameLower.includes('file record') ||
    nameLower.includes('operations on files') ||
    nameLower.includes('describing and storing')
  ) {
    return {
      topicId: topicItem.id,
      topicTitle: `${topicItem.name}`,
      unitId: topicItem.unitId,
      unitTitle: 'Unit V – Concurrency Control & Disk Storage',
      category: 'Storage',
      visualFormat: 'disk_diagram',
      visualFormatLabel: formatLabel,
      simpleExplanation:
        'Relational databases store persistent data on magnetic HDDs/SSDs organized in fixed-size blocks (typically 4KB to 8KB). A Slotted Page architecture places record pointers at the top and record data at the bottom, growing inward.',
      importantConcepts: [
        { name: 'Disk Block / Page', tag: 'Unit of I/O', description: 'The minimum unit of data transferred between secondary disk and RAM buffer pool.' },
        { name: 'Buffer Pool', tag: 'RAM Cache', description: 'Array of memory frames caching frequently used disk blocks using LRU / Clock.' },
        { name: 'Slotted Page Layout', tag: 'Page Format', description: 'Header with slot array (offset, length) pointing to variable-length records.' },
        { name: 'Access Cost', tag: 'I/O Latency', description: 'Seek time + Rotational latency + Block transfer time.' },
      ],
      keyPoints: [
        'Memory Hierarchy: CPU Registers (<1ns) -> Cache (L1/L2) -> RAM (10-100ns) -> SSD/HDD (0.1-10ms).',
        'Database bottleneck is almost always Disk I/O; query cost is measured primarily in the number of block transfers.',
        'Slotted Page Structure allows variable-length records without defragmentation issues.',
        'Buffer Manager uses a "Dirty Bit" to mark modified pages that must be written back to disk before eviction.',
        'Pin Count (Reference Count): Pages currently accessed by active queries have Pin > 0 and cannot be evicted.',
        'Write-Ahead Logging (WAL): A dirty page cannot be written to disk until its corresponding log record is flushed.',
      ],
      visualData: {
        title: 'Slotted Page Disk Block Architecture',
        subtitle: 'Physical storage format for variable-length tuple records within a 4KB disk page',
        type: 'disk_diagram',
        diskData: {
          layers: [
            { label: 'Secondary Disk (HDD/SSD)', subLabel: 'Persistent storage array', size: 'Terabytes', role: 'Retains tables and logs permanently' },
            { label: 'DBMS Buffer Pool', subLabel: 'Volatile RAM frames', size: 'Gigabytes (Buffer Cache)', role: 'Caches active disk blocks for zero-disk queries' },
            { label: 'Query Engine', subLabel: 'CPU execution pipeline', size: 'Memory Registers', role: 'Evaluates joins, projections, and filters' },
          ],
          blockLayout: {
            header: 'PAGE HEADER (Slot Count, Free Space Pointer, Transaction Bitmask)',
            recordSlots: [
              'Slot 1: Offset=4000, Length=96 bytes (Record 1)',
              'Slot 2: Offset=3880, Length=120 bytes (Record 2)',
              'Slot 3: Offset=3750, Length=130 bytes (Record 3)',
            ],
            freeSpace: '◄── FREE MEMORY SPACE (Slots grow down, Records grow up) ──►',
          },
        },
      },
      simpleExample: {
        title: 'Slotted Page Record Deletion',
        context: 'When Record 2 is deleted from a slotted page.',
        codeOrSample:
          '1. Set Slot 2 offset = -1 (marked deleted / tombstone).\n2. Compact remaining records towards end of page.\n3. Update Slot 3 offset pointer.\n4. Free space pointer moves down.\nResult: Record IDs (PageID, SlotNumber) held by external indexes remain 100% VALID!',
        takeaway: 'Slotted pages decouple the logical Record ID from its physical byte position inside the disk block.',
      },
      rememberThis:
        'Slotted Page Rule: Slots grow DOWNWARD from the top; Records grow UPWARD from the bottom. They meet in the middle.',
      examFocus: {
        highYieldTip:
          'Draw the Slotted Page rectangular diagram showing: Header at top, Slot directory array, Free Space in middle with converging arrows, and Records at bottom.',
        frequentQuestion: 'Explain the Slotted Page architecture for storing variable-length records on disk blocks.',
        marksWeightage: '8 to 10 Marks (Unit V Storage Section)',
      },
    };
  }

  // -------------------------------------------------------------
  // 10. DEFAULT / GENERIC DETERMINISTIC POSTER (Concept Grid)
  // -------------------------------------------------------------
  return {
    topicId: topicItem.id,
    topicTitle: topicItem.name,
    unitId: topicItem.unitId,
    unitTitle: topicItem.unitTitle,
    category: topicItem.category,
    visualFormat: 'concept_grid',
    visualFormatLabel: formatLabel,
    simpleExplanation:
      `Comprehensive, high-yield exam study poster for ${topicItem.name}. This concept establishes critical structural rules and operational algorithms in relational database management systems.`,
    importantConcepts: [
      { name: 'Theoretical Principle', tag: 'Theory', description: `Core definition and mathematical/logical framework of ${topicItem.name}.` },
      { name: 'System Mechanics', tag: 'Execution', description: 'How the DBMS storage engine, buffer manager, or query optimizer handles this concept.' },
      { name: 'Consistency & Integrity', tag: 'Rule Enforcement', description: 'Guarantees preventing data anomalies, race conditions, or unrecoverable states.' },
    ],
    keyPoints: [
      `${topicItem.name} plays a fundamental role in the ${topicItem.unitTitle} curriculum.`,
      `Eliminates operational bottlenecks and guarantees consistency across multi-user database transactions.`,
      `Provides clear mathematical or structural boundaries between physical storage and application queries.`,
      `Essential for college DBMS semester examinations with high scoring potential.`,
      `Frequently tested in viva voce, technical interviews, and university written exams.`,
    ],
    visualData: {
      title: `${topicItem.name} Conceptual Framework`,
      subtitle: `System architecture and key mechanical components of ${topicItem.name}`,
      type: 'concept_grid',
      conceptGridData: {
        items: [
          { title: 'Core Definition', tag: 'Foundation', detail: `Formal definition and standard textbook notation for ${topicItem.name}.` },
          { title: 'Operational Pipeline', tag: 'Workflow', detail: 'Step-by-step evaluation inside the database management system engine.' },
          { title: 'Integrity Guarantees', tag: 'Constraints', detail: 'Rules, assertions, or locks enforced to maintain ACID compliance.' },
          { title: 'Performance Impact', tag: 'Efficiency', detail: 'Minimizes disk I/O, reduces latency, and optimizes buffer utilization.' },
        ],
      },
    },
    simpleExample: {
      title: `Real-World Application of ${topicItem.name}`,
      context: `Demonstrating ${topicItem.name} in an enterprise database system.`,
      codeOrSample:
        `-- Conceptual Scenario for ${topicItem.name}\n-- Enforces database consistency, prevents data corruption, and optimizes query execution.\n-- Validated across standard ANSI/ISO SQL and relational database engine implementations.`,
      takeaway: `${topicItem.name} ensures clean architectural separation and reliable transactional operations.`,
    },
    rememberThis:
      `Always state the definition, draw the architectural diagram, specify the algorithm/syntax, and give a clear example.`,
    examFocus: {
      highYieldTip:
        `Structure university answers with: 1. Definition, 2. Diagram, 3. Characteristics / Properties, 4. Example, 5. Comparison or Advantages.`,
      frequentQuestion: `Explain ${topicItem.name} in detail with suitable diagrams and examples.`,
      marksWeightage: '6 to 10 Marks',
    },
  };
}
