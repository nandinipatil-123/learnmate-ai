// AI-generated educational poster image assets
import acidPosterImg from '../assets/images/dbms_acid_poster_1789118276332.jpg';
import fileSysPosterImg from '../assets/images/dbms_file_sys_poster_1789118292822.jpg';
import erDiagramPosterImg from '../assets/images/dbms_er_diagram_poster_1789118307760.jpg';
import relAlgebraPosterImg from '../assets/images/dbms_rel_algebra_poster_1789118323696.jpg';
import normalPosterImg from '../assets/images/dbms_normal_poster_1789118346386.jpg';
import sqlPosterImg from '../assets/images/dbms_sql_query_poster_1789118360717.jpg';
import lockPosterImg from '../assets/images/dbms_2pl_lock_poster_1789118376273.jpg';

export interface PosterImageMetadata {
  imageUrl: string;
  badge: string;
  archetype: string;
  generationPrompt: string;
  highlights: string[];
}

/**
 * Returns the authentic AI-generated educational poster image for any syllabus topic.
 * Each topic is mapped to its domain-specific educational poster illustration.
 */
export function getTopicPosterImage(topicName: string, unitId?: string): PosterImageMetadata {
  const lower = topicName.toLowerCase();

  // 1. File System vs DBMS & Architecture Topics (Unit 1)
  if (
    lower.includes('file system') ||
    lower.includes('advantages of dbms') ||
    lower.includes('file system vs') ||
    lower.includes('vs file system')
  ) {
    return {
      imageUrl: fileSysPosterImg,
      badge: 'AI Comparative Infographic',
      archetype: 'File System vs DBMS Architecture',
      generationPrompt:
        'Educational poster comparing File System vs DBMS. Split screen visual comparison infographic with modern dark tech background. Left column showing File System with red accent: data redundancy, file isolation, concurrency anomalies. Right column showing DBMS with emerald green accent: centralized control, ACID transactions, query optimizer, data independence.',
      highlights: [
        'Side-by-side architecture comparison',
        'Data redundancy vs central catalog',
        'Concurrency anomalies & recovery protection',
        'College engineering exam high-yield reference',
      ],
    };
  }

  // 2. ER Diagrams & Data Modeling (Unit 1 & 2)
  if (
    lower.includes('e-r') ||
    lower.includes('er diagram') ||
    lower.includes('entity') ||
    lower.includes('relationship') ||
    lower.includes('attribute') ||
    lower.includes('cardinality') ||
    lower.includes('specialization') ||
    lower.includes('generalization') ||
    lower.includes('aggregation')
  ) {
    return {
      imageUrl: erDiagramPosterImg,
      badge: 'AI Conceptual Schema Poster',
      archetype: 'Entity-Relationship Diagram & Schema',
      generationPrompt:
        'Educational poster for Entity-Relationship ER Diagrams in DBMS. Conceptual database design infographic with dark modern canvas. Displaying rectangular Entity boxes, diamond Relationship symbols with cardinality 1:1, 1:N, M:N, oval Attribute shapes with underlined Primary Key. Showing practical University Student Enrollment ER schema with clean arrows and visual connections.',
      highlights: [
        'Entity rectangles, diamond relationships, attribute ovals',
        'Cardinality constraints (1:1, 1:N, M:N)',
        'Primary key notation & multi-valued attributes',
        'University enrollment working schema example',
      ],
    };
  }

  // 3. Relational Algebra & Calculus (Unit 2)
  if (
    lower.includes('relational algebra') ||
    lower.includes('select') && lower.includes('project') ||
    lower.includes('cartesian product') ||
    lower.includes('natural join') ||
    lower.includes('division operator') ||
    lower.includes('tuple relational calculus') ||
    lower.includes('domain relational calculus') ||
    lower.includes('relational operations')
  ) {
    return {
      imageUrl: relAlgebraPosterImg,
      badge: 'AI Mathematical Operations Poster',
      archetype: 'Relational Algebra & Set Operations',
      generationPrompt:
        'Educational poster for Relational Algebra in DBMS. Mathematical relational database operations infographic on dark background. Visualizing Select sigma, Project pi, Cartesian Product cross, Natural Join bowtie, and Set Union operators with clear before-and-after tables and row/column filtering diagrams.',
      highlights: [
        'Mathematical Greek symbols: σ (Select), π (Project), ⨝ (Join), ÷ (Divide)',
        'Row filtering vs vertical attribute projection',
        'Before and after relation evaluation tables',
        'Formal procedural query language blueprint',
      ],
    };
  }

  // 4. Normalization & Functional Dependencies (Unit 3)
  if (
    lower.includes('normalization') ||
    lower.includes('normal form') ||
    lower.includes('1nf') ||
    lower.includes('2nf') ||
    lower.includes('3nf') ||
    lower.includes('bcnf') ||
    lower.includes('4nf') ||
    lower.includes('5nf') ||
    lower.includes('functional dependenc') ||
    lower.includes('lossless') ||
    lower.includes('dependency preservation')
  ) {
    return {
      imageUrl: normalPosterImg,
      badge: 'AI Normalization Pipeline Poster',
      archetype: 'Normalization (1NF → 2NF → 3NF → BCNF)',
      generationPrompt:
        'Educational poster for Database Normalization (1NF to 2NF to 3NF to BCNF). Visual step-by-step pipeline infographic on dark background. Displaying 4 progressive stages: Unnormalized Table with multi-valued attributes, 1NF with atomic values, 2NF removing partial dependency, 3NF removing transitive dependency, and BCNF with superkey determinants.',
      highlights: [
        'Sequential normal form progression: 1NF → 2NF → 3NF → BCNF',
        'Eliminated anomalies: Insertion, Update, Deletion',
        'Partial vs Transitive vs Non-trivial functional dependencies',
        'Decomposition tables with atomic attributes',
      ],
    };
  }

  // 5. ACID Properties & Transactions (Unit 4)
  if (
    lower.includes('acid') ||
    lower.includes('transaction') ||
    lower.includes('atomicity') ||
    lower.includes('consistency') ||
    lower.includes('isolation') ||
    lower.includes('durability') ||
    lower.includes('commit') ||
    lower.includes('rollback') ||
    lower.includes('savepoint')
  ) {
    return {
      imageUrl: acidPosterImg,
      badge: 'AI 4-Part Quadrant Poster',
      archetype: 'ACID Properties & Transaction Flow',
      generationPrompt:
        'Educational poster explaining ACID Properties in DBMS (Atomicity, Consistency, Isolation, Durability). Clear visual infographic layout with dark modern background, 4 distinct color-coded quadrants for A-C-I-D with clean icons, database transaction flow diagrams, clear legible typography, college computer science infographic style.',
      highlights: [
        '4-Quadrant breakdown: Atomicity, Consistency, Isolation, Durability',
        'State transition lifecycle: Active → Committed / Aborted',
        'WAL (Write-Ahead Logging) & Checkpoint guarantees',
        'All-or-Nothing execution invariant',
      ],
    };
  }

  // 6. Two-Phase Locking & Concurrency Control (Unit 4 & 5)
  if (
    lower.includes('lock') ||
    lower.includes('two-phase') ||
    lower.includes('2pl') ||
    lower.includes('concurrency') ||
    lower.includes('deadlock') ||
    lower.includes('timestamp') ||
    lower.includes('serializab') ||
    lower.includes('conflict serial') ||
    lower.includes('view serial') ||
    lower.includes('schedule')
  ) {
    return {
      imageUrl: lockPosterImg,
      badge: 'AI Protocol Flow Poster',
      archetype: 'Two-Phase Locking (2PL) & Concurrency',
      generationPrompt:
        'Educational poster for Two-Phase Locking (2PL) Protocol and Concurrency Control in DBMS. Visual infographic on dark background illustrating Growing Phase where locks are acquired, Lock Point peak, and Shrinking Phase where locks are released. Shared (S) and Exclusive (X) lock compatibility matrix, Strict 2PL timeline.',
      highlights: [
        'Growing Phase (Lock Acquisition) vs Shrinking Phase (Lock Release)',
        'Shared S-Lock vs Exclusive X-Lock compatibility matrix',
        'Strict 2PL prevention of cascading aborts',
        'Conflict serializability guarantee',
      ],
    };
  }

  // 7. SQL, Queries & Storage Architecture (Unit 2 & 5)
  if (
    lower.includes('sql') ||
    lower.includes('ddl') ||
    lower.includes('dml') ||
    lower.includes('query') ||
    lower.includes('view') ||
    lower.includes('trigger') ||
    lower.includes('join') ||
    lower.includes('index') ||
    lower.includes('b-tree') ||
    lower.includes('hashing') ||
    lower.includes('raid') ||
    lower.includes('storage') ||
    lower.includes('disk')
  ) {
    return {
      imageUrl: sqlPosterImg,
      badge: 'AI Syntax & Query Execution Poster',
      archetype: 'SQL Language & Database Engine',
      generationPrompt:
        'Educational poster for SQL (Structured Query Language) and Relational Database Queries. Visual infographic layout on dark background displaying DDL, DML, DCL, TCL command categories, SQL SELECT query clause execution order, and a relational database table with foreign key relations and query result output.',
      highlights: [
        'Command Taxonomy: DDL, DML, DCL, TCL',
        'Physical clause execution: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY',
        'Relational integrity constraints & foreign key references',
        'Executable code syntax and query result table',
      ],
    };
  }

  // Default fallback based on Unit
  if (unitId === 'unit-1') {
    return {
      imageUrl: fileSysPosterImg,
      badge: 'AI Architectural Poster',
      archetype: 'DBMS Architecture & Foundation',
      generationPrompt:
        'Educational poster explaining DBMS Architecture, Schemas, and Data Independence. Clear visual diagram showing 3-Schema Architecture with External, Conceptual, and Internal levels.',
      highlights: [
        '3-Schema Architecture (Physical, Logical, View)',
        'Physical and Logical Data Independence',
        'Database Engine query processor and storage manager',
      ],
    };
  }

  if (unitId === 'unit-2') {
    return {
      imageUrl: sqlPosterImg,
      badge: 'AI Relational Model Poster',
      archetype: 'Relational Model & Query Language',
      generationPrompt:
        'Educational poster for Relational Model and SQL queries with relational tables and foreign key constraints.',
      highlights: [
        'Relational Schema and Domain Integrity Constraints',
        'Referential Integrity with Foreign Keys',
        'Structured Query Language execution',
      ],
    };
  }

  if (unitId === 'unit-3') {
    return {
      imageUrl: normalPosterImg,
      badge: 'AI Normalization Poster',
      archetype: 'Schema Refinement & Normalization',
      generationPrompt:
        'Educational poster for Schema Design and Normalization in DBMS with decomposition flowcharts and functional dependency tables.',
      highlights: [
        'Redundancy reduction and lossless join decomposition',
        'Dependency preservation algorithms',
        'Boyce-Codd and Third Normal Forms',
      ],
    };
  }

  if (unitId === 'unit-4') {
    return {
      imageUrl: acidPosterImg,
      badge: 'AI Transaction Poster',
      archetype: 'Transaction Processing & ACID Properties',
      generationPrompt:
        'Educational poster for Transaction Management and ACID guarantees in DBMS.',
      highlights: [
        'Atomicity, Consistency, Isolation, Durability',
        'Write-ahead logging and recovery checkpoints',
        'Concurrent schedule execution',
      ],
    };
  }

  // Default Unit 5
  return {
    imageUrl: lockPosterImg,
    badge: 'AI Concurrency & Storage Poster',
    archetype: 'Concurrency Control & Storage Structures',
    generationPrompt:
      'Educational poster for Concurrency Control Protocols and Physical Storage Indexing in DBMS.',
    highlights: [
      'Locking protocols and conflict serializability',
      'Deadlock detection and avoidance graphs',
      'Physical page organization and B+ Tree indexing',
    ],
  };
}
