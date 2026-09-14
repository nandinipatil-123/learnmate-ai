import { PracticeQuestion } from '../types';

export const UNIT_4_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'dbms-u4-q01',
    code: 'DBMS-U4-Q01',
    unitId: 'unit-4',
    unitNumber: 4,
    unitTitle: 'UNIT IV – Transaction Processing & ACID',
    subject: 'DBMS',
    topic: 'Introduction to Transaction Processing',
    difficulty: 'Easy',
    type: 'Conceptual',
    title: 'Transaction Concept, Read/Write Operations & State Transitions',
    description: 'Understand the formal definition of a database transaction and trace its state transition diagram.',
    statement: {
      context: 'A database transaction is an atomic program unit that accesses and possibly updates various data items.',
      tasks: [
        '1. Formally define a Database Transaction and specify its primitive database operations (READ, WRITE).',
        '2. Draw or trace the Transaction State Transition Diagram, detailing the five states: Active, Partially Committed, Committed, Failed, and Aborted.',
        '3. Explain the difference between Partially Committed and Committed states.'
      ]
    },
    tip: 'A transaction is Partially Committed when its final operation has executed, but log buffers may still reside in volatile RAM.',
    expectedKeywords: ['transaction', 'read', 'write', 'active', 'partially committed', 'committed', 'failed', 'aborted'],
    sampleSolution: `1. Definition of a Database Transaction:
A transaction is a logical unit of database processing that includes one or more database access operations (READ, WRITE, INSERT, DELETE).
• READ(X): Transfers the data item X from persistent disk storage into the transaction's private local memory buffer.
• WRITE(X): Copies the modified value of data item X from local memory buffer back into the database system buffer pool.

2. Transaction State Transition Lifecycle:
• Active: The initial state; the transaction remains in this state while executing read and write operations.
• Partially Committed: Entered after the final statement of the transaction has executed, but modifications still reside in volatile memory buffers.
• Committed: Entered after all updates and write-ahead log (WAL) records have been flushed to non-volatile disk. The transaction has successfully completed.
• Failed: Entered when normal execution can no longer proceed due to hardware error, software failure, or integrity constraint violation.
• Aborted: Entered after the transaction has been rolled back, and the database has been restored to its pre-transaction state.
• Terminated: The transaction departs the system (either committed or aborted).

3. Partially Committed vs Committed:
• In the Partially Committed state, the final program instruction has executed in RAM, but changes might not have reached persistent storage. A sudden power outage at this instant can still cause the transaction to fail.
• The transaction transitions to the Committed state only after the commit log record is safely written to non-volatile disk. Once in the Committed state, its changes can never be lost.`
  },
  {
    id: 'dbms-u4-q02',
    code: 'DBMS-U4-Q02',
    unitId: 'unit-4',
    unitNumber: 4,
    unitTitle: 'UNIT IV – Transaction Processing & ACID',
    subject: 'DBMS',
    topic: 'ACID Properties',
    difficulty: 'Medium',
    type: 'Exam-oriented',
    title: 'ACID Properties: Guarantees and DBMS Implementation Mechanisms',
    description: 'Examine Atomicity, Consistency, Isolation, and Durability and identify the underlying database subsystems responsible for each.',
    statement: {
      context: 'In financial banking systems, funds transfer between accounts (e.g. debited from Account A, credited to Account B) requires strict ACID compliance.',
      tasks: [
        '1. Define each of the four ACID properties (Atomicity, Consistency, Isolation, Durability) in the context of a $500 bank transfer.',
        '2. Identify which DBMS subsystem or architectural mechanism guarantees each of the four properties.'
      ]
    },
    tip: 'Remember the acronym A-C-I-D and map them to Recovery, Schema/Constraints, Concurrency Control, and WAL.',
    expectedKeywords: ['atomicity', 'consistency', 'isolation', 'durability', 'acid', 'wal', 'concurrency control', 'recovery manager'],
    sampleSolution: `1. ACID Properties in a $500 Bank Transfer:
• Atomicity ("All or Nothing"): Either both the debit of $500 from Account A AND the credit of $500 to Account B occur successfully, or neither does. If the server crashes after debiting A, the debit is completely rolled back.
• Consistency: The transfer preserves database invariants. If total assets before the transfer are $10,000, they must equal $10,000 after. Furthermore, constraints like (Balance ≥ 0) are preserved.
• Isolation: Intermediate, uncommitted states of the transfer are invisible to concurrent transactions. A third party querying total bank balances concurrently will never see the $500 "in transit" (debited from A but not yet in B).
• Durability: Once the transaction receives a success confirmation (COMMIT), the transfer results will persist even if an catastrophic hardware crash or power blackout occurs immediately afterward.

2. Underlying DBMS Subsystems Responsible:
• Atomicity: Recovery Manager using Undo Logging or Shadow Paging.
• Consistency: Application logic + Integrity Constraint subsystem (CHECK constraints, triggers, primary/foreign keys).
• Isolation: Concurrency Control Manager using Locking protocols (2PL), Timestamp Ordering, or Multiversion Concurrency Control (MVCC).
• Durability: Recovery Manager using Write-Ahead Logging (WAL), redo logs, and non-volatile disk flushing.`
  },
  {
    id: 'dbms-u4-q03',
    code: 'DBMS-U4-Q03',
    unitId: 'unit-4',
    unitNumber: 4,
    unitTitle: 'UNIT IV – Transaction Processing & ACID',
    subject: 'DBMS',
    topic: 'Transaction and System Concepts',
    difficulty: 'Medium',
    type: 'Scenario-based',
    title: 'Concurrency Anomalies: Dirty Read, Lost Update & Unrepeatable Read',
    description: 'Trace interleaved transaction operations that produce concurrency bugs when isolation is breached.',
    statement: {
      context: 'Without concurrency control, simultaneous execution of transactions causes anomalous data corruption.',
      tasks: [
        '1. Explain the Lost Update Problem (Write-Write conflict) with a step-by-step trace of two transactions updating the same bank account.',
        '2. Explain the Dirty Read / Temporary Update Problem (Write-Read conflict) when a transaction aborts.',
        '3. Explain the Unrepeatable Read Problem (Read-Write conflict) when a transaction reads the same item twice.'
      ]
    },
    tip: 'Pair each anomaly with its conflict type: Lost Update = WW, Dirty Read = WR, Unrepeatable Read = RW.',
    expectedKeywords: ['lost update', 'dirty read', 'unrepeatable read', 'concurrency anomaly', 'rollback', 'interleaved'],
    sampleSolution: `1. Lost Update Problem (WW Conflict):
Scenario: Account X initially holds $1,000. T1 wants to deposit $100; T2 wants to withdraw $200.
• Step 1: T1 reads X = 1000.
• Step 2: T2 reads X = 1000 (concurrently).
• Step 3: T1 computes 1000 + 100 = 1100 and writes X = 1100.
• Step 4: T2 computes 1000 − 200 = 800 and writes X = 800 (overwriting T1's deposit).
Result: T1's update is completely lost. Balance is $800 instead of the correct $900.

2. Dirty Read / Temporary Update Problem (WR Conflict):
Scenario: Account X initially holds $500. T1 deposits $500; T2 checks balance.
• Step 1: T1 reads X = 500, writes X = 1000.
• Step 2: T2 reads X = 1000 (an uncommitted value written by T1).
• Step 3: T1 encounters an error or aborts, issuing ROLLBACK. X is restored to $500.
Result: T2 read and acted upon data that "never officially existed" in the persistent database.

3. Unrepeatable Read / Inconsistent Analysis (RW Conflict):
Scenario: Account X holds $400.
• Step 1: T1 reads X = 400.
• Step 2: T2 updates X to 900 and commits.
• Step 3: T1 reads X a second time within the same transaction and finds X = 900.
Result: T1 observed two different values for the exact same data item within a single transaction.`
  },
  {
    id: 'dbms-u4-q04',
    code: 'DBMS-U4-Q04',
    unitId: 'unit-4',
    unitNumber: 4,
    unitTitle: 'UNIT IV – Transaction Processing & ACID',
    subject: 'DBMS',
    topic: 'Schedules and Recoverability',
    difficulty: 'Medium',
    type: 'Conceptual',
    title: 'Conflict Operations and Conflict Serializability Conditions',
    description: 'Determine when two operations in a concurrent schedule conflict and state the conflict serializability criterion.',
    statement: {
      context: 'A schedule S represents the chronological execution sequence of operations from a set of concurrent transactions.',
      tasks: [
        '1. State the three precise conditions required for two operations I_i and I_j in a schedule to be in Conflict.',
        '2. Define Conflict Equivalence between two schedules S and S\'.',
        '3. Formally define Conflict Serializability and explain why a conflict serializable schedule preserves consistency.'
      ]
    },
    tip: 'Two operations on different items or by the same transaction never conflict.',
    expectedKeywords: ['conflict operations', 'conflict equivalence', 'conflict serializability', 'serial schedule', 'swapping'],
    sampleSolution: `1. The Three Conditions for Conflicting Operations:
Two operations I_i and I_j (where I_i belongs to transaction T_i and I_j belongs to transaction T_j) conflict if and only if:
1. They belong to different transactions (i ≠ j).
2. They access the exact same data item (e.g., both operate on item X).
3. At least one of the two operations is a WRITE operation (i.e., Read-Write, Write-Read, or Write-Write).
(Note: Read-Read operations never conflict).

2. Conflict Equivalence:
Two schedules S and S' are conflict equivalent if S can be transformed into S' by a series of swaps of non-conflicting consecutive operations. In conflict equivalent schedules, all pairs of conflicting operations execute in the exact same relative order.

3. Conflict Serializability:
A concurrent schedule S is Conflict Serializable if and only if it is conflict equivalent to some purely serial schedule S_serial (where transactions execute one after the other without interleaving).
Why it Preserves Consistency:
Because a serial schedule executes transactions in complete isolation, each transaction transitions the database from one consistent state to another. Since S preserves the exact order of all conflicting operations as the serial schedule, S produces the identical final database state and view, preserving consistency.`
  },
  {
    id: 'dbms-u4-q05',
    code: 'DBMS-U4-Q05',
    unitId: 'unit-4',
    unitNumber: 4,
    unitTitle: 'UNIT IV – Transaction Processing & ACID',
    subject: 'DBMS',
    topic: 'Schedules and Recoverability',
    difficulty: 'Hard',
    type: 'Problem-solving',
    title: 'Precedence Graph (Serialization Graph) Conflict Analysis',
    description: 'Construct the precedence graph for a concurrent schedule and test for cycle detection.',
    statement: {
      context: 'Consider the concurrent schedule S involving three transactions T1, T2, and T3:\nS: r1(A); r2(A); w1(A); r2(B); w2(B); r3(B); w3(B); r1(B);',
      tasks: [
        '1. Explain the algorithm for constructing a Precedence Graph G = (V, E) from a schedule.',
        '2. List all conflicting operation pairs in schedule S and draw/derive the directed edges in E.',
        '3. Determine whether schedule S is conflict serializable. If yes, provide an equivalent serial order; if no, identify the directed cycle.'
      ]
    },
    tip: 'A schedule is conflict serializable if and only if its precedence graph contains NO directed cycles.',
    expectedKeywords: ['precedence graph', 'serialization graph', 'conflict serializable', 'cycle', 'topological sort'],
    sampleSolution: `1. Precedence Graph Construction Algorithm:
• Nodes V: Each participating transaction T_i is represented as a vertex.
• Directed Edges E: A directed edge T_i → T_j is added if an operation in T_i precedes and conflicts with an operation in T_j on the same data item X (i.e., r_i(X) before w_j(X), or w_i(X) before r_j(X), or w_i(X) before w_j(X)).

2. Conflicting Operation Pairs in S:
Given: r1(A); r2(A); w1(A); r2(B); w2(B); r3(B); w3(B); r1(B);
• Conflicts on item A:
  - r2(A) occurs before w1(A): Since T2 reads A before T1 writes A, we have an edge T2 → T1.
• Conflicts on item B:
  - r2(B) occurs before w3(B): Edge T2 → T3.
  - w2(B) occurs before r3(B) and w3(B): Edge T2 → T3.
  - w2(B) occurs before r1(B): Since T2 writes B before T1 reads B, we have an edge T2 → T1.
  - w3(B) occurs before r1(B): Since T3 writes B before T1 reads B, we have an edge T3 → T1.

3. Cycle Detection & Serializability:
• Summary of Edges:
  - T2 → T1 (from r2(A) before w1(A))
  - T2 → T3 (from w2(B) before r3(B))
  - T3 → T1 (from w3(B) before r1(B))
• Check for cycles:
  Paths: T2 → T3 → T1, T2 → T1.
  There are NO backward edges (no path from T1 back to T2 or T3).
  The graph is a Directed Acyclic Graph (DAG) with zero cycles!

Conclusion:
Schedule S is Conflict Serializable!
By performing a Topological Sort on the DAG, an equivalent serial schedule is:
Serial Order: T2 → T3 → T1`
  },
  {
    id: 'dbms-u4-q06',
    code: 'DBMS-U4-Q06',
    unitId: 'unit-4',
    unitNumber: 4,
    unitTitle: 'UNIT IV – Transaction Processing & ACID',
    subject: 'DBMS',
    topic: 'Schedules and Recoverability',
    difficulty: 'Hard',
    type: 'Exam-oriented',
    title: 'View Serializability, View Equivalence & The Role of Blind Writes',
    description: 'Analyze view serializability conditions and explain why view serializability is NP-complete.',
    statement: {
      context: 'View serializability is a broader notion of serializability that includes schedules not covered by conflict serializability.',
      tasks: [
        '1. State the three formal conditions required for two schedules S and S\' to be View Equivalent.',
        '2. Define a Blind Write with an example, explaining how blind writes enable a schedule to be view serializable without being conflict serializable.',
        '3. Contrast Conflict Serializability and View Serializability in terms of computational complexity (P vs NP-complete).'
      ]
    },
    tip: 'Blind write: w(X) without an earlier r(X) in the same transaction.',
    expectedKeywords: ['view serializable', 'view equivalence', 'blind write', 'initial read', 'final write', 'np-complete'],
    sampleSolution: `1. The Three Conditions for View Equivalence:
Two schedules S and S' over the same set of transactions are View Equivalent if and only if:
1. Initial Read: For each data item X, if transaction T_i reads the initial value of X in S, then T_i must also read the initial value of X in S'.
2. Read-From: For each data item X, if transaction T_i reads a value of X written by transaction T_j in S, then T_i must also read the value of X written by T_j in S'.
3. Final Write: For each data item X, if transaction T_i performs the final write on X in S, then T_i must also perform the final write on X in S'.

2. Blind Writes and View Serializability:
• Blind Write: A write operation w(X) performed by a transaction without first reading X (i.e. overwriting X blindly).
• Role in View Serializability:
Consider schedule S: r1(A); w2(A); w1(A); w3(A);
The precedence graph has cycles: T1 → T2 (from r1(A) before w2(A)) and T2 → T1 (from w2(A) before w1(A)), so S is NOT conflict serializable.
However, because T3 performs a blind write w3(A) overwriting both T1 and T2, T3 performs the final write. S is view equivalent to serial schedule T1 → T2 → T3. Thus, blind writes allow view serializability where conflict serializability fails.

3. Computational Complexity:
• Conflict Serializability: Can be tested in polynomial time O(V + E) by detecting cycles in the Precedence Graph using Depth First Search (DFS).
• View Serializability: Testing whether an arbitrary schedule is view serializable is an NP-Complete problem because checking all possible view-equivalent permutations requires exponential time.`
  },
  {
    id: 'dbms-u4-q07',
    code: 'DBMS-U4-Q07',
    unitId: 'unit-4',
    unitNumber: 4,
    unitTitle: 'UNIT IV – Transaction Processing & ACID',
    subject: 'DBMS',
    topic: 'Schedules and Recoverability',
    difficulty: 'Medium',
    type: 'Problem-solving',
    title: 'Recoverable Schedules vs Non-Recoverable Schedules',
    description: 'Examine commit order constraints and explain why non-recoverable schedules violate durability.',
    statement: {
      context: 'Consider the following schedule S involving transactions T1 and T2:\nS: r1(A); w1(A); r2(A); w2(A); c2; a1;\n(where c2 denotes commit of T2, and a1 denotes abort of T1).',
      tasks: [
        '1. Formally define a Recoverable Schedule.',
        '2. Explain why schedule S is Non-Recoverable and analyze what serious consistency failure occurs when T1 aborts.',
        '3. Show how schedule S can be rewritten into a recoverable schedule.'
      ]
    },
    tip: 'If T2 reads from T1, T1 MUST commit before T2 commits.',
    expectedKeywords: ['recoverable schedule', 'non-recoverable', 'commit order', 'abort', 'durability'],
    sampleSolution: `1. Definition of a Recoverable Schedule:
A schedule S is Recoverable if, for every pair of transactions T_i and T_j in S, whenever T_j reads a data item previously written by T_i, the commit operation of T_i MUST occur before the commit operation of T_j:
Commit(T_i) < Commit(T_j)

2. Why Schedule S is Non-Recoverable:
• In schedule S:
  - T1 writes to A at w1(A).
  - T2 subsequently reads A at r2(A) (reading uncommitted data from T1).
  - T2 commits at c2.
  - T1 then aborts at a1.
• Why this is a Critical Failure:
T2 has committed and received confirmation of durability. But T1 aborted, meaning all modifications by T1 must be erased. However, T2's computation was based on T1's invalid dirty data!
Because T2 has already committed, the DBMS CANNOT roll back T2 without violating the Durability guarantee of ACID. The database is trapped in an unrecoverable, inconsistent state.

3. Rewriting S into a Recoverable Schedule:
Delay the commit of T2 until T1 commits:
Recoverable Schedule: r1(A); w1(A); r2(A); w2(A); c1; c2;
If T1 aborts instead, T2 has not yet committed, allowing the DBMS to abort and roll back T2 safely.`
  },
  {
    id: 'dbms-u4-q08',
    code: 'DBMS-U4-Q08',
    unitId: 'unit-4',
    unitNumber: 4,
    unitTitle: 'UNIT IV – Transaction Processing & ACID',
    subject: 'DBMS',
    topic: 'Schedules and Recoverability',
    difficulty: 'Medium',
    type: 'Exam-oriented',
    title: 'Cascading Rollback vs Cascadeless Schedules (Avoid Cascading Aborts)',
    description: 'Analyze cascading abort chains and evaluate protocols that guarantee cascadeless execution.',
    statement: {
      context: 'In a recoverable schedule, the failure of one transaction may cause a chain reaction where dozens of dependent transactions must also be rolled back.',
      tasks: [
        '1. Define Cascading Rollback (Cascading Abort) with a concrete example illustrating a domino effect across T1, T2, and T3.',
        '2. Formally define a Cascadeless Schedule (Avoid Cascading Aborts / ACA).',
        '3. State the operational rule that a DBMS must enforce to guarantee that every schedule is cascadeless.'
      ]
    },
    tip: 'Cascadeless rule: Read only committed data.',
    expectedKeywords: ['cascading rollback', 'cascading abort', 'cascadeless schedule', 'avoid cascading aborts', 'dirty read'],
    sampleSolution: `1. Cascading Rollback (Cascading Abort):
A cascading rollback occurs when the failure or abort of a single transaction leads to the forced abort of multiple other active transactions because they read uncommitted data written by the failing transaction.
Example:
• T1 writes X.
• T2 reads X from T1 and writes Y.
• T3 reads Y from T2 and writes Z.
• T1 experiences an unexpected divide-by-zero error and aborts.
Because T2 read dirty data from T1, T2 must be aborted. Because T3 read dirty data from T2, T3 must also be aborted. This domino effect wastes substantial CPU and I/O resources.

2. Cascadeless Schedule (Avoid Cascading Aborts - ACA):
A schedule S is Cascadeless if, for every pair of transactions T_i and T_j, whenever T_j reads a data item written by T_i, the commit operation of T_i MUST precede the read operation of T_j:
Commit(T_i) < Read_j(X)

3. Rule to Guarantee Cascadelessness:
A transaction is only permitted to read COMMITTED data items. Any attempt to read an item written by an active, uncommitted transaction is blocked until that transaction commits or aborts. (Every cascadeless schedule is automatically recoverable).`
  },
  {
    id: 'dbms-u4-q09',
    code: 'DBMS-U4-Q09',
    unitId: 'unit-4',
    unitNumber: 4,
    unitTitle: 'UNIT IV – Transaction Processing & ACID',
    subject: 'DBMS',
    topic: 'Schedules and Recoverability',
    difficulty: 'Hard',
    type: 'Conceptual',
    title: 'Strict Schedules & The Recoverability Hierarchy',
    description: 'Contrast Strict, Cascadeless, and Recoverable schedules and diagram their strictness hierarchy.',
    statement: {
      context: 'Modern relational database recovery algorithms (such as ARIES) require schedules that support simple, independent undo operations.',
      tasks: [
        '1. Formally define a Strict Schedule.',
        '2. Explain why Strict schedules make undo recovery trivial (restoring before-images without side-effects).',
        '3. Draw or describe the strict containment hierarchy relating All Schedules, Recoverable, Cascadeless, and Strict schedules.'
      ]
    },
    tip: 'Strict rule: Do not read OR overwrite uncommitted writes.',
    expectedKeywords: ['strict schedule', 'cascadeless', 'recoverable', 'containment hierarchy', 'before-image', 'undo'],
    sampleSolution: `1. Definition of a Strict Schedule:
A schedule S is Strict if, for any data item X written by transaction T_i, no other transaction T_j can either READ or WRITE X until T_i has committed or aborted:
Commit(T_i) / Abort(T_i) < Read_j(X)   AND
Commit(T_i) / Abort(T_i) < Write_j(X)

2. Why Strict Schedules Enable Trivial Undo Recovery:
In a strict schedule, no other transaction has read or overwritten the value written by T_i.
If T_i aborts:
The recovery manager can restore the value of X simply by writing back its original "before-image" (the value prior to T_i's write) from the log. It does not have to worry that another transaction modified X in the interim.

3. Strict Containment Hierarchy:
Strict ⊂ Cascadeless ⊂ Recoverable ⊂ All Schedules
• Every Strict schedule is Cascadeless.
• Every Cascadeless schedule is Recoverable.
• Not every Recoverable schedule is Cascadeless (e.g., if a transaction reads uncommitted data but delays its commit).
• Not every Cascadeless schedule is Strict (e.g., if T2 blindly overwrites T1's uncommitted write without reading it).`
  },
  {
    id: 'dbms-u4-q10',
    code: 'DBMS-U4-Q10',
    unitId: 'unit-4',
    unitNumber: 4,
    unitTitle: 'UNIT IV – Transaction Processing & ACID',
    subject: 'DBMS',
    topic: 'ACID Properties',
    difficulty: 'Hard',
    type: 'Exam-oriented',
    title: 'Write-Ahead Logging (WAL) Protocol & Checkpointing for Durability',
    description: 'Detail the WAL protocol rules and explain how fuzzy checkpointing accelerates database crash recovery.',
    statement: {
      context: 'To ensure Atomicity and Durability across system crashes, database engines utilize Write-Ahead Logging (WAL) and periodic Checkpointing.',
      tasks: [
        '1. State the two cardinal rules of the Write-Ahead Logging (WAL) protocol.',
        '2. Explain why a dirty data page in the RAM buffer pool must NOT be written to disk before its corresponding log record is flushed.',
        '3. Explain the purpose of a Checkpoint in reducing the time required for crash recovery.'
      ]
    },
    tip: 'Log records must precede data page writes to non-volatile disk.',
    expectedKeywords: ['write-ahead logging', 'wal', 'checkpoint', 'crash recovery', 'redo log', 'undo log', 'dirty page'],
    sampleSolution: `1. The Two Cardinal Rules of WAL:
1. Before a dirty database page in volatile RAM is flushed to persistent disk storage, all log records associated with that page (containing the before-image and after-image) must be flushed to non-volatile log disk.
2. A transaction is not officially considered COMMITTED until its commit log record has been synchronously written to non-volatile disk.

2. Why Log Records Must Precede Dirty Data Pages:
If a dirty database page were written to disk before its log record reached non-volatile disk, and the system crashed immediately afterward:
- The disk contains the modified data.
- But the log disk has NO record of what the previous value was (before-image).
- The recovery engine is unable to UNDO the aborted transaction's modifications, permanently corrupting database consistency!
Writing the log record first guarantees the recovery manager has the necessary before-images (to UNDO incomplete transactions) and after-images (to REDO committed ones).

3. Role of Checkpointing in Crash Recovery:
Without checkpoints, the database recovery engine would have to scan the entire log file from the very beginning of database creation after a crash, which could take hours.
• A Checkpoint periodically flushes all dirty buffer pages to disk and writes a <CHECKPOINT> record to the log.
• During crash recovery, the DBMS only needs to scan log records from the latest checkpoint forward, dramatically speeding up recovery time from hours to seconds.`
  }
];
