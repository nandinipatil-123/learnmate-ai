export type QuizQuestionType = 'mcq' | 'true_false' | 'multiple_select';

export interface AdaptiveQuizQuestion {
  id: string;
  topic: string;
  subject: 'DBMS' | 'Java' | 'DSA';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: QuizQuestionType;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctAnswers: number[]; // indices of correct options
  explanation: string;
  conceptTag: string;
}

export interface QuizTopicMeta {
  id: string;
  name: string;
  subject: 'DBMS' | 'Java' | 'DSA';
  aliases: string[];
  description: string;
}

export const QUIZ_TOPICS: QuizTopicMeta[] = [
  {
    id: 'triggers',
    name: 'Database Triggers',
    subject: 'DBMS',
    aliases: ['sql triggers', 'triggers', 'database triggers', 'before trigger', 'after trigger', 'instead of trigger'],
    description: 'Event-driven database procedures executing automatically on INSERT, UPDATE, or DELETE operations.',
  },
  {
    id: 'normalization',
    name: 'Normalization & Schema Design',
    subject: 'DBMS',
    aliases: ['normalization', '1nf', '2nf', '3nf', 'bcnf', 'functional dependencies', 'dependencies', 'schema design'],
    description: 'Elimination of data redundancy and update anomalies through 1NF, 2NF, 3NF, and BCNF decomposition.',
  },
  {
    id: 'joins',
    name: 'SQL Joins & Queries',
    subject: 'DBMS',
    aliases: ['joins', 'sql joins', 'inner join', 'outer join', 'left join', 'right join', 'cross join', 'self join'],
    description: 'Relational data retrieval combining rows across tables based on related column predicates.',
  },
  {
    id: 'transactions',
    name: 'Transactions & ACID Properties',
    subject: 'DBMS',
    aliases: ['transactions', 'acid', 'concurrency control', 'serializability', '2pl', 'locking', 'deadlock', 'isolation'],
    description: 'Atomicity, Consistency, Isolation, and Durability guarantees and multi-user concurrency control.',
  },
  {
    id: 'indexing',
    name: 'Database Indexing & B-Trees',
    subject: 'DBMS',
    aliases: ['indexing', 'indexes', 'b-tree', 'b+ tree', 'clustered index', 'non-clustered index', 'hash index'],
    description: 'Balanced search tree structures and physical access paths accelerating query retrieval.',
  },
  {
    id: 'abstract_interface',
    name: 'Abstract Class vs Interface',
    subject: 'Java',
    aliases: ['abstract class', 'interface', 'abstract vs interface', 'default methods', 'abstraction', 'multiple inheritance'],
    description: 'Contract design, default and static methods, multiple interface implementation versus single class inheritance.',
  },
  {
    id: 'polymorphism',
    name: 'Polymorphism & Dynamic Dispatch',
    subject: 'Java',
    aliases: ['polymorphism', 'method overriding', 'method overloading', 'dynamic dispatch', 'runtime polymorphism', 'oop'],
    description: 'Compile-time overloading and runtime method table (vtable) resolution in object hierarchies.',
  },
  {
    id: 'garbage_collection',
    name: 'Java Garbage Collection & Memory Model',
    subject: 'Java',
    aliases: ['garbage collection', 'gc', 'jvm memory', 'heap', 'stack', 'mark and sweep', 'g1gc', 'memory leak'],
    description: 'Generational memory collection, Eden/Survivor spaces, object reachability, and memory deallocation.',
  },
  {
    id: 'multithreading',
    name: 'Multithreading & Concurrency',
    subject: 'Java',
    aliases: ['multithreading', 'threads', 'concurrency', 'synchronized', 'volatile', 'locks', 'race condition'],
    description: 'Thread lifecycles, intrinsic monitor locks, memory visibility, and race condition prevention.',
  },
  {
    id: 'collections_hashmap',
    name: 'Collections Framework & HashMap',
    subject: 'Java',
    aliases: ['hashmap', 'collections', 'arraylist', 'linkedlist', 'hashset', 'concurrenthashmap', 'map'],
    description: 'Hash bucket arrays, load factor rehashing, linked list to red-black tree bin treeification in Java 8+.',
  },
  {
    id: 'bst_balancing',
    name: 'Binary Search Tree Balancing',
    subject: 'DSA',
    aliases: ['binary search tree', 'bst', 'avl tree', 'red-black tree', 'tree balancing', 'rotations', 'avl'],
    description: 'Logarithmic search height maintenance via single and double AVL rotations and balance factors.',
  },
  {
    id: 'dijkstra_graphs',
    name: 'Dijkstra & Graph Traversal',
    subject: 'DSA',
    aliases: ['dijkstra', 'graph', 'bfs', 'dfs', 'shortest path', 'graph algorithms', 'priority queue'],
    description: 'Greedy single-source shortest path calculation and priority-queue relaxation on weighted directed graphs.',
  },
  {
    id: 'quicksort_mergesort',
    name: 'Quicksort vs Mergesort',
    subject: 'DSA',
    aliases: ['quicksort', 'mergesort', 'sorting', 'divide and conquer', 'sort algorithms', 'partitioning'],
    description: 'Divide-and-conquer sorting mechanics, pivot partitioning, cache locality, and worst-case complexities.',
  },
  {
    id: 'hash_collisions',
    name: 'Hash Collision Handling',
    subject: 'DSA',
    aliases: ['hash collision', 'hashing', 'chaining', 'open addressing', 'linear probing', 'quadratic probing'],
    description: 'Separate chaining, open addressing probe sequences, clustering phenomena, and primary vs secondary clusters.',
  },
  {
    id: 'dynamic_programming',
    name: 'Dynamic Programming & Recursion',
    subject: 'DSA',
    aliases: ['dynamic programming', 'dp', 'knapsack', 'memoization', 'tabulation', 'optimal substructure'],
    description: 'Overlapping subproblems, state recurrence relations, top-down memoization, and bottom-up space optimization.',
  },
];

export const ADAPTIVE_QUIZ_QUESTIONS: AdaptiveQuizQuestion[] = [
  // =========================================================================
  // 1. DATABASE TRIGGERS (DBMS)
  // =========================================================================
  {
    id: 'trig-e1',
    topic: 'Database Triggers',
    subject: 'DBMS',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'What is the primary trigger event in a relational database?',
    options: [
      'A scheduled operating system cron job executing backups',
      'An explicit DML statement such as INSERT, UPDATE, or DELETE on a table',
      'A user logging out of their client database session',
      'An automated rebuild of non-clustered indexes',
    ],
    correctAnswers: [1],
    explanation: 'Database triggers fire automatically in response to DML operations (INSERT, UPDATE, DELETE) or specific DDL/database events on a target table.',
    conceptTag: 'Trigger Activation Event',
  },
  {
    id: 'trig-e2',
    topic: 'Database Triggers',
    subject: 'DBMS',
    difficulty: 'Easy',
    type: 'true_false',
    question: 'A database trigger must be explicitly invoked by an application with an `EXECUTE TRIGGER` command.',
    options: ['True', 'False'],
    correctAnswers: [1],
    explanation: 'False. Triggers are event-driven and invoke implicitly and automatically when the defined database event occurs; they cannot be called directly.',
    conceptTag: 'Implicit Execution',
  },
  {
    id: 'trig-m1',
    topic: 'Database Triggers',
    subject: 'DBMS',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'When should a `BEFORE INSERT` trigger be chosen over an `AFTER INSERT` trigger?',
    options: [
      'When you want to log the generated auto-increment primary key ID to an audit table',
      'When you need to validate or sanitize input columns and abort the insertion before disk write',
      'When you want to refresh a materialized view across another database instance',
      'When updating multiple child tables in a distributed microservice',
    ],
    correctAnswers: [1],
    explanation: 'A `BEFORE` trigger executes before the new row is written to the table, allowing the trigger to validate constraints, modify `NEW` values, or raise an error before the row is committed to storage.',
    conceptTag: 'BEFORE vs AFTER Timing',
  },
  {
    id: 'trig-m2',
    topic: 'Database Triggers',
    subject: 'DBMS',
    difficulty: 'Medium',
    type: 'multiple_select',
    question: 'Which pseudo-record qualifiers are available inside an `UPDATE` trigger? (Select all that apply)',
    options: [
      ':OLD (representing values before the modification)',
      ':NEW (representing proposed replacement values)',
      ':DELTA (representing the arithmetic difference between numbers)',
      ':PREV (representing the previous committed transaction state)',
    ],
    correctAnswers: [0, 1],
    explanation: 'In SQL triggers, `:OLD` holds column values before the update, and `:NEW` holds the incoming replacement values. `:DELTA` and `:PREV` are not standard SQL pseudo-records.',
    conceptTag: 'Pseudo-Records :OLD & :NEW',
  },
  {
    id: 'trig-m3',
    topic: 'Database Triggers',
    subject: 'DBMS',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'What is the primary role of an `INSTEAD OF` trigger in SQL?',
    options: [
      'To speed up index rebuilds during off-peak hours',
      'To allow DML operations on complex non-updatable database Views',
      'To automatically convert PostgreSQL queries into MySQL syntax',
      'To bypass primary key unique constraints safely',
    ],
    correctAnswers: [1],
    explanation: 'Views created with joins or aggregations cannot be updated directly. An `INSTEAD OF` trigger intercepts the INSERT/UPDATE/DELETE on the view and performs the appropriate operations on underlying base tables.',
    conceptTag: 'INSTEAD OF Triggers on Views',
  },
  {
    id: 'trig-h1',
    topic: 'Database Triggers',
    subject: 'DBMS',
    difficulty: 'Hard',
    type: 'multiple_select',
    question: 'What are known architectural drawbacks of excessive database trigger usage? (Select all that apply)',
    options: [
      'Hidden control flow making application debugging and tracing difficult',
      'Cascading trigger loops causing performance bottlenecks or recursive deadlocks',
      'Triggers preventing the database from supporting B-Tree indexes entirely',
      'Transaction lock amplification extending row/table lock holding durations',
    ],
    correctAnswers: [0, 1, 3],
    explanation: 'Triggers run inside the caller transaction and can hide side effects, cause cascading execution loops, and prolong lock durations. They do not prevent B-Tree index creation.',
    conceptTag: 'Trigger Architectural Pitfalls',
  },
  {
    id: 'trig-h2',
    topic: 'Database Triggers',
    subject: 'DBMS',
    difficulty: 'Hard',
    type: 'true_false',
    question: 'If an exception is raised inside a trigger, the parent transaction is automatically rolled back unless handled explicitly.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'True. In transactional relational databases (PostgreSQL, Oracle, SQL Server), an unhandled error inside a trigger causes the triggering DML statement and enclosing transaction to fail and rollback.',
    conceptTag: 'Trigger Atomicity & Rollback',
  },

  // =========================================================================
  // 2. NORMALIZATION & SCHEMA DESIGN (DBMS)
  // =========================================================================
  {
    id: 'norm-e1',
    topic: 'Normalization & Schema Design',
    subject: 'DBMS',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'What is the fundamental requirement for a relational table to satisfy First Normal Form (1NF)?',
    options: [
      'Every column must have an index',
      'All attributes must contain atomic (indivisible) values, with no repeating groups',
      'Every non-key column must be fully dependent on the composite primary key',
      'Foreign keys must point only to single-column primary keys',
    ],
    correctAnswers: [1],
    explanation: '1NF mandates that each column contains atomic values, each row is unique, and there are no repeating groups or nested arrays.',
    conceptTag: '1NF Atomicity',
  },
  {
    id: 'norm-e2',
    topic: 'Normalization & Schema Design',
    subject: 'DBMS',
    difficulty: 'Easy',
    type: 'true_false',
    question: 'If a table has a single-column primary key and is in 1NF, it is automatically in 2NF.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'True. 2NF prohibits partial dependencies (dependencies on a proper subset of a composite primary key). If the primary key consists of only one column, partial dependencies cannot exist.',
    conceptTag: '2NF Single Column Key Rule',
  },
  {
    id: 'norm-m1',
    topic: 'Normalization & Schema Design',
    subject: 'DBMS',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'A relation R(StudentID, CourseID, StudentName, CourseFee) has primary key (StudentID, CourseID). StudentID → StudentName exists. Which normal form is violated?',
    options: [
      '1NF',
      '2NF',
      '3NF',
      'BCNF only',
    ],
    correctAnswers: [1],
    explanation: 'StudentName depends solely on StudentID (a subset of the composite key {StudentID, CourseID}). This is a partial dependency, violating 2NF.',
    conceptTag: 'Partial Dependency Elimination',
  },
  {
    id: 'norm-m2',
    topic: 'Normalization & Schema Design',
    subject: 'DBMS',
    difficulty: 'Medium',
    type: 'multiple_select',
    question: 'Which of the following conditions satisfy Third Normal Form (3NF) for every non-trivial functional dependency X → Y? (Select all that apply)',
    options: [
      'X is a superkey of the relation',
      'Y is a prime attribute (part of a candidate key)',
      'X contains only numeric integer values',
      'Y contains no foreign key references',
    ],
    correctAnswers: [0, 1],
    explanation: 'For a relation to be in 3NF, for every functional dependency X → Y, either X is a superkey OR Y is a prime attribute (part of candidate key), which eliminates transitive dependencies.',
    conceptTag: '3NF Conditions',
  },
  {
    id: 'norm-h1',
    topic: 'Normalization & Schema Design',
    subject: 'DBMS',
    difficulty: 'Hard',
    type: 'mcq',
    question: 'How does Boyce-Codd Normal Form (BCNF) differ strictly from Third Normal Form (3NF)?',
    options: [
      'BCNF allows multi-valued dependencies whereas 3NF does not',
      'BCNF strictly requires X to be a superkey for EVERY non-trivial dependency X → Y, removing the "Y is prime" allowance',
      'BCNF only applies to tables without foreign keys',
      'BCNF allows partial dependencies if lossless decomposition is guaranteed',
    ],
    correctAnswers: [1],
    explanation: '3NF allows non-trivial dependencies X → Y where Y is a prime attribute even if X is not a superkey. BCNF strictly eliminates that exception: X MUST be a superkey for every non-trivial functional dependency.',
    conceptTag: 'BCNF vs 3NF Difference',
  },
  {
    id: 'norm-h2',
    topic: 'Normalization & Schema Design',
    subject: 'DBMS',
    difficulty: 'Hard',
    type: 'true_false',
    question: 'Every relation in 3NF can always be decomposed into BCNF while simultaneously preserving all functional dependencies.',
    options: ['True', 'False'],
    correctAnswers: [1],
    explanation: 'False. While a 3NF decomposition is always guaranteed to be lossless and preserve dependencies, a BCNF decomposition is always lossless but is NOT always dependency-preserving.',
    conceptTag: 'BCNF Dependency Preservation',
  },

  // =========================================================================
  // 3. SQL JOINS & QUERIES (DBMS)
  // =========================================================================
  {
    id: 'join-e1',
    topic: 'SQL Joins & Queries',
    subject: 'DBMS',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'Which SQL join returns only rows where matching values exist in both connected tables?',
    options: [
      'LEFT OUTER JOIN',
      'INNER JOIN',
      'FULL OUTER JOIN',
      'CROSS JOIN',
    ],
    correctAnswers: [1],
    explanation: 'INNER JOIN selects all records from both tables that satisfy the specified join predicate, omitting unmatched rows from both sides.',
    conceptTag: 'INNER JOIN Semantics',
  },
  {
    id: 'join-e2',
    topic: 'SQL Joins & Queries',
    subject: 'DBMS',
    difficulty: 'Easy',
    type: 'true_false',
    question: 'A LEFT JOIN guarantees that every row from the left table will appear in the result set at least once.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'True. A LEFT JOIN preserves all rows from the left table; if no matching row exists in the right table, columns from the right table are populated with NULL.',
    conceptTag: 'LEFT JOIN Guarantees',
  },
  {
    id: 'join-m1',
    topic: 'SQL Joins & Queries',
    subject: 'DBMS',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'Table A has 10 rows and Table B has 5 rows. No WHERE or ON clause is provided. How many rows does `SELECT * FROM A, B;` return?',
    options: ['15', '5', '10', '50'],
    correctAnswers: [3],
    explanation: 'A comma-separated join without a WHERE condition is a Cartesian Product (CROSS JOIN), yielding 10 × 5 = 50 rows.',
    conceptTag: 'Cartesian Product',
  },
  {
    id: 'join-m2',
    topic: 'SQL Joins & Queries',
    subject: 'DBMS',
    difficulty: 'Medium',
    type: 'multiple_select',
    question: 'Which techniques identify rows in Table A that have NO corresponding record in Table B? (Select all that apply)',
    options: [
      'LEFT JOIN A and B where B.id IS NULL',
      'WHERE A.id NOT IN (SELECT B.id FROM B WHERE B.id IS NOT NULL)',
      'WHERE NOT EXISTS (SELECT 1 FROM B WHERE B.id = A.id)',
      'INNER JOIN A and B on A.id = B.id',
    ],
    correctAnswers: [0, 1, 2],
    explanation: 'LEFT JOIN with `IS NULL`, `NOT IN` (with null-safe check), and `NOT EXISTS` are standard SQL anti-join patterns. An INNER JOIN only returns matching records.',
    conceptTag: 'Anti-Join Techniques',
  },
  {
    id: 'join-h1',
    topic: 'SQL Joins & Queries',
    subject: 'DBMS',
    difficulty: 'Hard',
    type: 'mcq',
    question: 'In query optimization, what is the primary prerequisite for the database engine to choose a Merge Join over a Hash Join?',
    options: [
      'Both inputs must already be ordered on the join attributes (via index or explicit sort)',
      'Both tables must fit completely in volatile RAM cache',
      'The join predicate must use a `LIKE` pattern match',
      'The left table must have at least 10x more rows than the right table',
    ],
    correctAnswers: [0],
    explanation: 'Merge Join requires both input record streams to be ordered by the join keys. When indexes provide pre-sorted streams, Merge Join runs with high performance and O(N + M) scanning.',
    conceptTag: 'Merge Join Prerequisite',
  },

  // =========================================================================
  // 4. TRANSACTIONS & ACID PROPERTIES (DBMS)
  // =========================================================================
  {
    id: 'tx-e1',
    topic: 'Transactions & ACID Properties',
    subject: 'DBMS',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'Which ACID property guarantees that all operations in a transaction succeed completely or none take effect?',
    options: [
      'Atomicity',
      'Consistency',
      'Isolation',
      'Durability',
    ],
    correctAnswers: [0],
    explanation: 'Atomicity ensures an "all-or-nothing" execution; if any statement fails, the entire transaction is rolled back.',
    conceptTag: 'Atomicity Definition',
  },
  {
    id: 'tx-m1',
    topic: 'Transactions & ACID Properties',
    subject: 'DBMS',
    difficulty: 'Medium',
    type: 'multiple_select',
    question: 'Which concurrency anomalies are prohibited under the SQL standard `SERIALIZABLE` isolation level? (Select all that apply)',
    options: [
      'Dirty Read (reading uncommitted data)',
      'Non-repeatable Read (rereading a row returns different values)',
      'Phantom Read (a range query returns newly inserted rows)',
      'Index Fragmentation',
    ],
    correctAnswers: [0, 1, 2],
    explanation: '`SERIALIZABLE` is the highest isolation level and prevents Dirty Reads, Non-repeatable Reads, and Phantom Reads. Index fragmentation is a physical storage phenomenon, not a concurrency anomaly.',
    conceptTag: 'Isolation Anomalies',
  },
  {
    id: 'tx-h1',
    topic: 'Transactions & ACID Properties',
    subject: 'DBMS',
    difficulty: 'Hard',
    type: 'true_false',
    question: 'Strict Two-Phase Locking (Strict 2PL) guarantees conflict serializability and produces schedules that are completely free from deadlocks.',
    options: ['True', 'False'],
    correctAnswers: [1],
    explanation: 'False. Strict 2PL guarantees conflict serializability and avoids cascading aborts, but it DOES NOT prevent deadlocks. Transactions can still block each other cyclically waiting for locks.',
    conceptTag: '2PL & Deadlock Vulnerability',
  },

  // =========================================================================
  // 5. DATABASE INDEXING & B-TREES (DBMS)
  // =========================================================================
  {
    id: 'idx-e1',
    topic: 'Database Indexing & B-Trees',
    subject: 'DBMS',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'How many clustered indexes can exist on a single database table in MySQL InnoDB or SQL Server?',
    options: ['Exactly 1', 'Up to 16', 'Unlimited', '0 (clustered indexes are optional in all engines)'],
    correctAnswers: [0],
    explanation: 'Because a clustered index dictates the physical on-disk sort order of data rows, a table can only have exactly ONE clustered index.',
    conceptTag: 'Clustered Index Uniqueness',
  },
  {
    id: 'idx-m1',
    topic: 'Database Indexing & B-Trees',
    subject: 'DBMS',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'In a B+ Tree index, where are the actual data pointers or table record rows stored?',
    options: [
      'Exclusively in leaf nodes, which are linked together in a doubly-linked list',
      'Evenly distributed across the root node and internal nodes',
      'In a separate unorganized hash bucket table',
      'Inside the database transaction journal',
    ],
    correctAnswers: [0],
    explanation: 'In a B+ Tree (unlike a standard B-Tree), internal nodes contain only routing keys, while leaf nodes hold all data record pointers and are linked sequentially for fast range scans.',
    conceptTag: 'B+ Tree Leaf Node Organization',
  },
  {
    id: 'idx-h1',
    topic: 'Database Indexing & B-Trees',
    subject: 'DBMS',
    difficulty: 'Hard',
    type: 'multiple_select',
    question: 'Given a composite index on `(department_id, salary, hire_date)`, which query filters can leverage this index via the leftmost prefix rule? (Select all that apply)',
    options: [
      'WHERE department_id = 10 AND salary > 50000',
      'WHERE salary > 50000 AND hire_date > \'2024-01-01\'',
      'WHERE department_id = 20',
      'WHERE hire_date = \'2025-01-01\'',
    ],
    correctAnswers: [0, 2],
    explanation: 'Composite indexes follow the Leftmost Prefix rule: queries must filter on the leading columns (department_id). Queries omitting department_id cannot use the B-Tree index prefix.',
    conceptTag: 'Leftmost Prefix Rule',
  },

  // =========================================================================
  // 6. ABSTRACT CLASS VS INTERFACE (Java)
  // =========================================================================
  {
    id: 'abs-e1',
    topic: 'Abstract Class vs Interface',
    subject: 'Java',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'How many classes can a Java class directly extend versus how many interfaces can it implement?',
    options: [
      'Extends at most 1 class; implements multiple interfaces',
      'Extends multiple classes; implements at most 1 interface',
      'Extends unlimited classes; implements unlimited interfaces',
      'Extends at most 2 classes; implements up to 5 interfaces',
    ],
    correctAnswers: [0],
    explanation: 'Java enforces single implementation inheritance for classes (extends 1 class) but supports multiple type inheritance through interfaces (implements N interfaces).',
    conceptTag: 'Inheritance Multiplicity',
  },
  {
    id: 'abs-e2',
    topic: 'Abstract Class vs Interface',
    subject: 'Java',
    difficulty: 'Easy',
    type: 'true_false',
    question: 'An abstract class can contain instance variables (state) and constructors, whereas an interface cannot have constructors.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'True. Abstract classes can declare instance state and constructors (invoked via `super()`). Interfaces cannot have constructors and their fields are implicitly `public static final`.',
    conceptTag: 'Constructors & State',
  },
  {
    id: 'abs-m1',
    topic: 'Abstract Class vs Interface',
    subject: 'Java',
    difficulty: 'Medium',
    type: 'multiple_select',
    question: 'Which features were introduced to Java Interfaces in Java 8 and Java 9? (Select all that apply)',
    options: [
      '`default` methods with concrete implementation bodies (Java 8)',
      '`static` utility methods in interfaces (Java 8)',
      '`private` helper methods for code reuse across default methods (Java 9)',
      'Protected instance fields storing mutable object state',
    ],
    correctAnswers: [0, 1, 2],
    explanation: 'Java 8 introduced default and static methods in interfaces. Java 9 added private interface methods. Interfaces still cannot declare protected mutable instance variables.',
    conceptTag: 'Modern Interface Features',
  },
  {
    id: 'abs-h1',
    topic: 'Abstract Class vs Interface',
    subject: 'Java',
    difficulty: 'Hard',
    type: 'mcq',
    question: 'Class C implements Interface A and Interface B. Both A and B define identical `default void ping()`. How does the Java compiler resolve this conflict?',
    options: [
      'The compiler picks Interface A because it is declared first in `implements A, B`',
      'Compilation fails with duplicate default methods error unless Class C explicitly overrides `ping()`',
      'The JVM resolves the call randomly at runtime using reflection',
      'The compiler deletes both default implementations automatically',
    ],
    correctAnswers: [1],
    explanation: 'To prevent the "diamond problem" ambiguity with default methods, Java fails compilation unless the implementing class explicitly overrides the conflicting method (e.g. `A.super.ping()`).',
    conceptTag: 'Default Method Diamond Conflict',
  },

  // =========================================================================
  // 7. POLYMORPHISM & DYNAMIC DISPATCH (Java)
  // =========================================================================
  {
    id: 'poly-e1',
    topic: 'Polymorphism & Dynamic Dispatch',
    subject: 'Java',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'Method Overloading represents compile-time polymorphism. Which of the following differentiates overloaded methods?',
    options: [
      'Only the method return type',
      'The parameter list (number, types, or order of arguments)',
      'Only the `throws` exception signature',
      'Only the `public` or `private` access modifier',
    ],
    correctAnswers: [1],
    explanation: 'Overloaded methods must have different parameter lists (arities or types). Differing only by return type or access modifier causes a compilation error.',
    conceptTag: 'Method Overloading Signatures',
  },
  {
    id: 'poly-m1',
    topic: 'Polymorphism & Dynamic Dispatch',
    subject: 'Java',
    difficulty: 'Medium',
    type: 'true_false',
    question: 'In Java, `static` methods can be overridden polymorphically at runtime by child classes.',
    options: ['True', 'False'],
    correctAnswers: [1],
    explanation: 'False. Static methods belong to the class, not instances. Re-declaring a static method in a subclass is "method hiding", bound statically at compile time, not dynamic dispatch.',
    conceptTag: 'Method Hiding vs Overriding',
  },
  {
    id: 'poly-h1',
    topic: 'Polymorphism & Dynamic Dispatch',
    subject: 'Java',
    difficulty: 'Hard',
    type: 'mcq',
    question: 'Given `Animal a = new Dog();` where `Dog` overrides `makeSound()`. How does the JVM dynamically bind `a.makeSound()` at runtime?',
    options: [
      'By reading the declared variable type `Animal` in the constant pool',
      'Via `invokevirtual` inspecting the runtime instance\'s virtual method table (vtable)',
      'By recompiling the bytecode using a temporary JIT classloader',
      'By cloning the Dog instance on the stack',
    ],
    correctAnswers: [1],
    explanation: 'The JVM issues the `invokevirtual` bytecode instruction, which looks up the actual object header on the heap to inspect its class vtable and invoke Dog\'s implementation.',
    conceptTag: 'JVM invokevirtual & vtable',
  },

  // =========================================================================
  // 8. JAVA GARBAGE COLLECTION & MEMORY MODEL (Java)
  // =========================================================================
  {
    id: 'gc-e1',
    topic: 'Java Garbage Collection & Memory Model',
    subject: 'Java',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'In Java, where are new object instances allocated in memory by default?',
    options: [
      'In the Thread Execution Stack',
      'In the Heap Memory',
      'In the CPU L1 Cache register',
      'In the Native Code segment',
    ],
    correctAnswers: [1],
    explanation: 'All objects created with `new` are allocated on the Heap. Stack frames hold only primitive local variables and object reference pointers.',
    conceptTag: 'Heap vs Stack Allocation',
  },
  {
    id: 'gc-m1',
    topic: 'Java Garbage Collection & Memory Model',
    subject: 'Java',
    difficulty: 'Medium',
    type: 'multiple_select',
    question: 'Which of the following serve as "GC Roots" during the Garbage Collector mark phase? (Select all that apply)',
    options: [
      'Active local variables and parameters in current stack frames',
      'Classes loaded by the system classloader and static class variables',
      'JNI (Java Native Interface) global and local references',
      'Objects residing on the dead circular reference graph',
    ],
    correctAnswers: [0, 1, 2],
    explanation: 'GC Roots include stack frame variables, static variables, active threads, and JNI references. Circular references with no path to a GC Root are eligible for collection.',
    conceptTag: 'GC Roots Identification',
  },
  {
    id: 'gc-h1',
    topic: 'Java Garbage Collection & Memory Model',
    subject: 'Java',
    difficulty: 'Hard',
    type: 'mcq',
    question: 'What is the "Weak Generational Hypothesis" that motivates Java\'s split into Young and Old (Tenured) generations?',
    options: [
      'Most objects live indefinitely across the entire application runtime',
      'Most allocated objects become unreachable and die very shortly after creation',
      'Garbage collection can only run when CPU utilization drops below 10%',
      'Older objects generate more memory leaks than newly instantiated objects',
    ],
    correctAnswers: [1],
    explanation: 'The Generational Hypothesis observes that most objects have extremely short lifetimes (e.g. method-local buffers). The Young generation allows fast, lightweight Minor GCs.',
    conceptTag: 'Generational Hypothesis',
  },

  // =========================================================================
  // 9. MULTITHREADING & CONCURRENCY (Java)
  // =========================================================================
  {
    id: 'mt-e1',
    topic: 'Multithreading & Concurrency',
    subject: 'Java',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'Which method should be called on a `Thread` object to start concurrent asynchronous execution in Java?',
    options: ['`thread.run()`', '`thread.start()`', '`thread.execute()`', '`thread.fork()`'],
    correctAnswers: [1],
    explanation: 'Calling `start()` allocates a new OS native thread and invokes `run()` asynchronously. Calling `run()` directly simply executes in the caller\'s thread synchronously.',
    conceptTag: 'Thread start() vs run()',
  },
  {
    id: 'mt-m1',
    topic: 'Multithreading & Concurrency',
    subject: 'Java',
    difficulty: 'Medium',
    type: 'true_false',
    question: 'Declaring a variable as `volatile` in Java guarantees both memory visibility across threads and atomic execution of compound operations like `count++`.',
    options: ['True', 'False'],
    correctAnswers: [1],
    explanation: 'False. `volatile` guarantees visibility (flushing CPU caches) and prevents instruction reordering, but DOES NOT guarantee atomicity for compound read-modify-write operations like `count++`. Use AtomicInteger for atomicity.',
    conceptTag: 'Volatile vs Atomicity',
  },
  {
    id: 'mt-h1',
    topic: 'Multithreading & Concurrency',
    subject: 'Java',
    difficulty: 'Hard',
    type: 'multiple_select',
    question: 'What are the four necessary Coffman conditions required for a Deadlock to occur? (Select all that apply)',
    options: [
      'Mutual Exclusion (resources cannot be shared)',
      'Hold and Wait (processes holding resources request new ones)',
      'No Preemption (resources cannot be forcibly taken away)',
      'Circular Wait (a closed chain of threads waiting on each other)',
    ],
    correctAnswers: [0, 1, 2, 3],
    explanation: 'All four conditions—Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait—must be simultaneously present for a deadlock to exist.',
    conceptTag: 'Coffman Deadlock Conditions',
  },

  // =========================================================================
  // 10. COLLECTIONS FRAMEWORK & HASHMAP (Java)
  // =========================================================================
  {
    id: 'col-e1',
    topic: 'Collections Framework & HashMap',
    subject: 'Java',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'What is the default initial capacity and load factor of a standard Java `HashMap`?',
    options: [
      'Capacity: 16, Load Factor: 0.75',
      'Capacity: 10, Load Factor: 0.50',
      'Capacity: 32, Load Factor: 1.00',
      'Capacity: 8, Load Factor: 0.85',
    ],
    correctAnswers: [0],
    explanation: 'Standard `HashMap` defaults to an initial capacity of 16 buckets and a load factor of 0.75 (rehashing when 12 items are inserted).',
    conceptTag: 'HashMap Default Parameters',
  },
  {
    id: 'col-m1',
    topic: 'Collections Framework & HashMap',
    subject: 'Java',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'In Java 8+, when a single HashMap bucket reaches 8 elements (and total table capacity >= 64), what structure does the bucket convert to?',
    options: [
      'A Doubly-Linked Skip List',
      'A Balanced Red-Black Tree',
      'A Secondary Hash Table',
      'An unmodifiable Array',
    ],
    correctAnswers: [1],
    explanation: 'Java 8 treeifies overloaded bins with >= 8 entries into Red-Black Trees (TreeNode), improving worst-case search complexity from O(N) to O(log N).',
    conceptTag: 'HashMap Treeification',
  },
  {
    id: 'col-h1',
    topic: 'Collections Framework & HashMap',
    subject: 'Java',
    difficulty: 'Hard',
    type: 'true_false',
    question: 'If two objects have equal `hashCode()`, they are guaranteed to be equal according to `equals()`.',
    options: ['True', 'False'],
    correctAnswers: [1],
    explanation: 'False. Equal objects MUST have equal hashCodes, but different objects CAN share the same hashCode (known as a hash collision).',
    conceptTag: 'equals() and hashCode() Contract',
  },

  // =========================================================================
  // 11. BINARY SEARCH TREE BALANCING (DSA)
  // =========================================================================
  {
    id: 'bst-e1',
    topic: 'Binary Search Tree Balancing',
    subject: 'DSA',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'What is the worst-case search time complexity in an unbalanced, skewed Binary Search Tree?',
    options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
    correctAnswers: [2],
    explanation: 'When inserted in sorted order, an unbalanced BST degenerates into a linear linked list with O(N) worst-case search time.',
    conceptTag: 'Degenerate BST Complexity',
  },
  {
    id: 'bst-m1',
    topic: 'Binary Search Tree Balancing',
    subject: 'DSA',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'In an AVL Tree, what are the only permissible Balance Factor values (height(left) - height(right)) for any valid node?',
    options: ['-1, 0, or +1', '0 only', '-2, 0, or +2', 'Any positive integer'],
    correctAnswers: [0],
    explanation: 'An AVL tree strictly requires that the balance factor of every node satisfies |height(left) - height(right)| <= 1, meaning values must be in {-1, 0, +1}.',
    conceptTag: 'AVL Balance Factor',
  },
  {
    id: 'bst-h1',
    topic: 'Binary Search Tree Balancing',
    subject: 'DSA',
    difficulty: 'Hard',
    type: 'multiple_select',
    question: 'Which rotation sequence restores balance when an insertion occurs in the Right subtree of a Left child (Left-Right imbalance)? (Select all that apply)',
    options: [
      'Left rotation on the Left child, followed by Right rotation on the root node',
      'Single Right rotation directly on the root',
      'Double rotation (LR rotation)',
      'Zig-Zag splay rotation',
    ],
    correctAnswers: [0, 2],
    explanation: 'An LR imbalance is resolved by a double rotation: first a Left rotation on the left child, followed by a Right rotation on the parent/root.',
    conceptTag: 'AVL Double Rotations',
  },

  // =========================================================================
  // 12. DIJKSTRA & GRAPH TRAVERSAL (DSA)
  // =========================================================================
  {
    id: 'dijk-e1',
    topic: 'Dijkstra & Graph Traversal',
    subject: 'DSA',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'What fundamental restriction does Dijkstra\'s Algorithm have regarding edge weights?',
    options: [
      'All edge weights must be strictly non-negative (>= 0)',
      'The graph must be a tree with no cycles',
      'All edge weights must be identical integers',
      'The graph must have an even number of vertices',
    ],
    correctAnswers: [0],
    explanation: 'Dijkstra\'s greedy relaxation assumes visited nodes have finalized minimum distances; negative edge weights invalidate this assumption. Use Bellman-Ford for negative weights.',
    conceptTag: 'Non-Negative Edge Weight Constraint',
  },
  {
    id: 'dijk-m1',
    topic: 'Dijkstra & Graph Traversal',
    subject: 'DSA',
    difficulty: 'Medium',
    type: 'true_false',
    question: 'Breadth-First Search (BFS) computes the shortest path on unweighted graphs in O(V + E) time.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'True. On unweighted graphs (or graphs where all edges have unit weight), BFS discovers vertices by distance level and finds shortest paths in O(V + E).',
    conceptTag: 'BFS Shortest Path',
  },
  {
    id: 'dijk-h1',
    topic: 'Dijkstra & Graph Traversal',
    subject: 'DSA',
    difficulty: 'Hard',
    type: 'mcq',
    question: 'What is the optimal time complexity of Dijkstra\'s algorithm implemented with a Min-Heap (Binary Priority Queue)?',
    options: [
      'O(V^2)',
      'O((V + E) log V)',
      'O(E log E + V^2)',
      'O(V * E)',
    ],
    correctAnswers: [1],
    explanation: 'With a min-heap priority queue, extracting minimum distances takes O(V log V) and edge relaxations take O(E log V), giving O((V + E) log V).',
    conceptTag: 'Dijkstra Min-Heap Complexity',
  },

  // =========================================================================
  // 13. QUICKSORT VS MERGESORT (DSA)
  // =========================================================================
  {
    id: 'sort-e1',
    topic: 'Quicksort vs Mergesort',
    subject: 'DSA',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'What is the guaranteed worst-case time complexity of Mergesort on any input array of size N?',
    options: ['O(N log N)', 'O(N^2)', 'O(N)', 'O(log N)'],
    correctAnswers: [0],
    explanation: 'Mergesort guarantees O(N log N) time complexity in worst, average, and best cases because it consistently divides arrays in half and merges linearly.',
    conceptTag: 'Mergesort Worst Case Guarantee',
  },
  {
    id: 'sort-m1',
    topic: 'Quicksort vs Mergesort',
    subject: 'DSA',
    difficulty: 'Medium',
    type: 'multiple_select',
    question: 'Why is Quicksort frequently preferred in-practice over Mergesort for sorting in-memory primitive arrays? (Select all that apply)',
    options: [
      'Quicksort operates in-place with O(log N) auxiliary stack space, avoiding Mergesort\'s O(N) allocation',
      'Quicksort exhibits excellent CPU cache locality due to sequential array partitioning',
      'Quicksort has O(1) worst-case time complexity',
      'Quicksort is mathematically stable without any extra code',
    ],
    correctAnswers: [0, 1],
    explanation: 'Quicksort sorts in-place (O(log N) stack memory) with superior hardware cache locality. Standard Quicksort is not stable and has O(N^2) worst case.',
    conceptTag: 'In-Place & Cache Locality',
  },
  {
    id: 'sort-h1',
    topic: 'Quicksort vs Mergesort',
    subject: 'DSA',
    difficulty: 'Hard',
    type: 'true_false',
    question: 'Standard Lomuto or Hoare partitioning in Quicksort is a stable sorting algorithm.',
    options: ['True', 'False'],
    correctAnswers: [1],
    explanation: 'False. Standard Quicksort partitioning swaps elements across distant pivot positions, which can reorder duplicate keys, making standard Quicksort unstable.',
    conceptTag: 'Stability in Partitioning',
  },

  // =========================================================================
  // 14. HASH COLLISION HANDLING (DSA)
  // =========================================================================
  {
    id: 'hash-e1',
    topic: 'Hash Collision Handling',
    subject: 'DSA',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'In Separate Chaining, how are colliding keys handled?',
    options: [
      'By probing subsequent slots linearly until an empty bucket is found',
      'By storing collided entries in an auxiliary linked list or tree attached to that bucket',
      'By discarding older entries and keeping only the latest key',
      'By resizing the table on every collision',
    ],
    correctAnswers: [1],
    explanation: 'Separate Chaining keeps a linked list or secondary search tree at each index bucket to hold all key-value entries with identical hash slots.',
    conceptTag: 'Separate Chaining Mechanism',
  },
  {
    id: 'hash-m1',
    topic: 'Hash Collision Handling',
    subject: 'DSA',
    difficulty: 'Medium',
    type: 'mcq',
    question: 'What severe performance issue affects Linear Probing (Open Addressing) as the table load factor increases?',
    options: [
      'Primary Clustering, where long contiguous runs of occupied slots merge into giant clusters',
      'Stack overflow in the CPU instruction pointer',
      'Negative hash code generation',
      'Reversal of string comparison ordering',
    ],
    correctAnswers: [0],
    explanation: 'Primary Clustering occurs in linear probing because any collision creates or expands a contiguous block of occupied slots, dramatically increasing average search lengths.',
    conceptTag: 'Primary Clustering',
  },
  {
    id: 'hash-h1',
    topic: 'Hash Collision Handling',
    subject: 'DSA',
    difficulty: 'Hard',
    type: 'multiple_select',
    question: 'Which open addressing techniques mitigate primary and secondary clustering? (Select all that apply)',
    options: [
      'Quadratic Probing (uses quadratic polynomial offsets like i^2)',
      'Double Hashing (uses a secondary hash function h2(k) * i for stride length)',
      'Linear Probing with step 1',
      'Modulo division with zero',
    ],
    correctAnswers: [0, 1],
    explanation: 'Quadratic Probing eliminates primary clustering (though subject to secondary clustering), and Double Hashing generates distinct probe sequences per key, avoiding both clustering types.',
    conceptTag: 'Double Hashing & Quadratic Probing',
  },

  // =========================================================================
  // 15. DYNAMIC PROGRAMMING & RECURSION (DSA)
  // =========================================================================
  {
    id: 'dp-e1',
    topic: 'Dynamic Programming & Recursion',
    subject: 'DSA',
    difficulty: 'Easy',
    type: 'mcq',
    question: 'What two core properties must a computational problem exhibit to be effectively solved by Dynamic Programming?',
    options: [
      'Optimal Substructure and Overlapping Subproblems',
      'Greedy Choice Property and Randomness',
      'NP-Hardness and Directed Acyclic Graph topology',
      'Exponential Base Cases and Disjoint Domains',
    ],
    correctAnswers: [0],
    explanation: 'Dynamic programming requires (1) Optimal Substructure (optimal solution formed from optimal sub-solutions) and (2) Overlapping Subproblems (subproblems recomputed repeatedly).',
    conceptTag: 'Core DP Properties',
  },
  {
    id: 'dp-m1',
    topic: 'Dynamic Programming & Recursion',
    subject: 'DSA',
    difficulty: 'Medium',
    type: 'true_false',
    question: 'Top-down DP (Memoization) uses recursive calls with cache lookup, while Bottom-up DP (Tabulation) iteratively fills a table.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'True. Memoization executes recursively and caches solutions on demand. Tabulation starts from base cases and fills the DP table iteratively without recursion stack overhead.',
    conceptTag: 'Memoization vs Tabulation',
  },
  {
    id: 'dp-h1',
    topic: 'Dynamic Programming & Recursion',
    subject: 'DSA',
    difficulty: 'Hard',
    type: 'mcq',
    question: 'In the 0/1 Knapsack Problem with N items and maximum weight W, what is the standard 2D DP time and space complexity?',
    options: [
      'Time: O(N * W), Space: O(N * W) (reducible to O(W) space)',
      'Time: O(2^N), Space: O(1)',
      'Time: O(N log W), Space: O(N)',
      'Time: O(W^2), Space: O(N^2)',
    ],
    correctAnswers: [0],
    explanation: '0/1 Knapsack takes pseudo-polynomial O(N * W) time and O(N * W) table space. Because row i depends only on row i-1, space can be optimized to a single 1D array of size O(W).',
    conceptTag: '0/1 Knapsack Space Optimization',
  },
];

/**
 * Intelligent topic lookup matching search queries, aliases, and partial matches.
 */
export function findMatchingQuizTopic(query: string): QuizTopicMeta | null {
  if (!query || !query.trim()) return null;
  const q = query.trim().toLowerCase();

  // 1. Direct exact alias or name match
  for (const topic of QUIZ_TOPICS) {
    if (topic.name.toLowerCase() === q || topic.id.toLowerCase() === q) {
      return topic;
    }
    if (topic.aliases.some((alias) => alias.toLowerCase() === q)) {
      return topic;
    }
  }

  // 2. Contains match
  for (const topic of QUIZ_TOPICS) {
    if (topic.name.toLowerCase().includes(q) || q.includes(topic.name.toLowerCase())) {
      return topic;
    }
    if (topic.aliases.some((alias) => alias.toLowerCase().includes(q) || q.includes(alias.toLowerCase()))) {
      return topic;
    }
  }

  // 3. Subject match fallback (e.g. user typed 'dbms' or 'java')
  const subjectMatch = QUIZ_TOPICS.find((t) => t.subject.toLowerCase() === q);
  if (subjectMatch) return subjectMatch;

  return null;
}
