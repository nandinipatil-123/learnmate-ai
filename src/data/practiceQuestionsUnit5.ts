import { PracticeQuestion } from '../types';

export const UNIT_5_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'dbms-u5-q01',
    code: 'DBMS-U5-Q01',
    unitId: 'unit-5',
    unitNumber: 5,
    unitTitle: 'UNIT V – Concurrency Control and Disk Storage',
    subject: 'DBMS',
    topic: 'Two-Phase Locking',
    difficulty: 'Easy',
    type: 'Conceptual',
    title: 'Shared (S) and Exclusive (X) Locks & Lock Compatibility Matrix',
    description: 'Analyze lock granularity, distinguish shared from exclusive locks, and evaluate lock conversion.',
    statement: {
      context: 'Lock-based concurrency control protocols regulate concurrent access to database items by requiring transactions to acquire locks before performing reads or writes.',
      tasks: [
        '1. Differentiate Shared Locks (S-locks / Read locks) from Exclusive Locks (X-locks / Write locks).',
        '2. Construct the 2x2 Lock Compatibility Matrix for Shared and Exclusive locks.',
        '3. Explain Lock Conversion: differentiate Lock Upgrade (S → X) from Lock Downgrade (X → S).'
      ]
    },
    tip: 'Multiple transactions can hold Shared locks concurrently, but only one can hold an Exclusive lock.',
    expectedKeywords: ['shared lock', 'exclusive lock', 'compatibility matrix', 'lock upgrade', 'lock downgrade', 'concurrency'],
    sampleSolution: `1. Shared vs Exclusive Locks:
• Shared Lock (S-lock / Read Lock): Acquired when a transaction only needs to READ a data item X. Multiple concurrent transactions are permitted to hold shared locks on the same data item simultaneously, since concurrent reads do not interfere with each other.
• Exclusive Lock (X-lock / Write Lock): Acquired when a transaction needs to WRITE (insert/update/delete) a data item X. Only one transaction can hold an exclusive lock on X at any given moment. No other transaction can hold either an S-lock or an X-lock on X until the exclusive lock is released.

2. Lock Compatibility Matrix:
                 Requested Lock
Current Lock |  Shared (S)   |  Exclusive (X)
-------------+---------------+----------------
Shared (S)   |  Compatible   |  Incompatible (Wait)
Exclusive (X)|  Incompatible |  Incompatible (Wait)

3. Lock Conversion:
• Lock Upgrade (S → X): A transaction holding an S-lock on item X requests to convert it to an X-lock so it can modify X. If other transactions also hold S-locks on X, the upgrade must wait until they release their S-locks.
• Lock Downgrade (X → S): A transaction holding an X-lock converts it to an S-lock when it finishes modifying X and only needs to read it further, allowing other transactions to acquire S-locks concurrently.`
  },
  {
    id: 'dbms-u5-q02',
    code: 'DBMS-U5-Q02',
    unitId: 'unit-5',
    unitNumber: 5,
    unitTitle: 'UNIT V – Concurrency Control and Disk Storage',
    subject: 'DBMS',
    topic: 'Two-Phase Locking',
    difficulty: 'Medium',
    type: 'Exam-oriented',
    title: 'Two-Phase Locking (2PL) Protocol: Phases, Lock Point & Proof',
    description: 'Detail the two phases of 2PL and explain why 2PL guarantees conflict serializability.',
    statement: {
      context: 'The Two-Phase Locking (2PL) protocol is the gold standard locking protocol implemented in commercial database engines.',
      tasks: [
        '1. State the fundamental rule of the Two-Phase Locking (2PL) protocol.',
        '2. Define the Growing Phase (Expanding Phase), the Lock Point, and the Shrinking Phase (Contracting Phase).',
        '3. Explain why Basic 2PL guarantees Conflict Serializability, and explain why Basic 2PL does NOT prevent deadlocks.'
      ]
    },
    tip: 'Once a transaction releases a single lock, it enters the shrinking phase and can never acquire another lock.',
    expectedKeywords: ['two-phase locking', '2pl', 'growing phase', 'shrinking phase', 'lock point', 'conflict serializability', 'deadlock'],
    sampleSolution: `1. The Fundamental Rule of 2PL:
In a Two-Phase Locking protocol, every transaction must acquire all locks before releasing any lock. Once a transaction releases any lock, it is strictly forbidden from acquiring any further locks on any data item.

2. Phases and Lock Point:
• Growing (Expanding) Phase: The transaction may acquire new locks (S or X) and upgrade locks, but CANNOT release any lock.
• Lock Point: The instantaneous moment when the transaction has acquired the final lock required for its execution. This point marks the end of the growing phase.
• Shrinking (Contracting) Phase: The transaction may release existing locks and downgrade locks, but CANNOT acquire any new lock.

3. Serializability Guarantee & Deadlock Susceptibility:
• Why 2PL Guarantees Conflict Serializability:
Transactions can be serialized in order of their Lock Points. If transaction T1 conflicts with T2 and reaches its lock point first, T2 must wait for T1 to release locks. Therefore, no cycle can form in the precedence graph, guaranteeing conflict serializability.
• Why 2PL Does NOT Prevent Deadlocks:
Basic 2PL allows dynamic, incremental lock acquisitions during the growing phase. If T1 holds a lock on A and requests B, while T2 holds a lock on B and requests A, both transactions wait indefinitely, forming a classic deadlock cycle.`
  },
  {
    id: 'dbms-u5-q03',
    code: 'DBMS-U5-Q03',
    unitId: 'unit-5',
    unitNumber: 5,
    unitTitle: 'UNIT V – Concurrency Control and Disk Storage',
    subject: 'DBMS',
    topic: 'Two-Phase Locking',
    difficulty: 'Hard',
    type: 'Exam-oriented',
    title: 'Strict 2PL vs Rigorous 2PL Protocols & Eliminating Cascading Aborts',
    description: 'Compare variants of 2PL and evaluate their protection against cascading rollback.',
    statement: {
      context: 'While Basic 2PL guarantees conflict serializability, it still permits cascading aborts. Commercial systems adopt Strict or Rigorous 2PL.',
      tasks: [
        '1. Define Strict 2PL and Rigorous 2PL, specifying exactly when locks are released in each variant.',
        '2. Explain how Strict 2PL eliminates cascading rollbacks (cascading aborts).',
        '3. Compare Basic 2PL, Strict 2PL, and Rigorous 2PL in terms of concurrency level versus implementation simplicity.'
      ]
    },
    tip: 'Strict 2PL holds exclusive locks until commit/abort; Rigorous 2PL holds BOTH shared and exclusive locks until commit/abort.',
    expectedKeywords: ['strict 2pl', 'rigorous 2pl', 'cascading aborts', 'exclusive lock', 'shared lock', 'commit'],
    sampleSolution: `1. Strict 2PL vs Rigorous 2PL:
• Strict 2PL: Follows 2PL with the additional requirement that all EXCLUSIVE (X) locks held by the transaction must be retained until the transaction COMMITS or ABORTS. Shared (S) locks may be released earlier during the shrinking phase.
• Rigorous 2PL: Requires that ALL locks (both Shared S-locks AND Exclusive X-locks) held by the transaction must be retained until the transaction COMMITS or ABORTS. There is no independent shrinking phase before commit.

2. How Strict 2PL Eliminates Cascading Aborts:
In Strict 2PL, no transaction releases an exclusive lock until it has safely committed. This means no other transaction can read or write modified data while the modifying transaction is still active.
Consequently:
- No transaction ever reads uncommitted ("dirty") data.
- If a transaction aborts, no other active transaction has read its updates.
- Therefore, cascading rollbacks are 100% prevented, and all schedules are guaranteed to be Strict (and Cascadeless).

3. Comparison of Variants:
• Basic 2PL: Highest concurrency (locks released as early as possible), but suffers from cascading aborts and complex recovery.
• Strict 2PL: Slightly lower concurrency than Basic 2PL, but completely eliminates cascading aborts. This is the industry standard in RDBMS engines (PostgreSQL, SQL Server, Oracle).
• Rigorous 2PL: Lowest concurrency (reads held until commit), but easiest to implement because serialization order directly mirrors transaction commit order.`
  },
  {
    id: 'dbms-u5-q04',
    code: 'DBMS-U5-Q04',
    unitId: 'unit-5',
    unitNumber: 5,
    unitTitle: 'UNIT V – Concurrency Control and Disk Storage',
    subject: 'DBMS',
    topic: 'Two-Phase Locking',
    difficulty: 'Medium',
    type: 'Problem-solving',
    title: 'Deadlock Detection in DBMS: Wait-For Graph (WFG) & Victim Selection',
    description: 'Detect deadlocks using directed wait-for graphs and analyze criteria for victim selection and abort.',
    statement: {
      context: 'In a lock-based system, four transactions T1, T2, T3, and T4 are active:\n• T1 holds a lock on X and requests a lock on Y (held by T2)\n• T2 requests a lock on Z (held by T3)\n• T3 requests a lock on W (held by T4)\n• T4 requests a lock on X (held by T1)',
      tasks: [
        '1. Define a Deadlock in DBMS and explain the role of the Wait-For Graph (WFG).',
        '2. Draw or trace the directed edges of the Wait-For Graph for the scenario and determine if a deadlock exists.',
        '3. If a deadlock is detected, state the three major criteria used in Victim Selection to determine which transaction to abort and roll back.'
      ]
    },
    tip: 'A deadlock exists in lock-based concurrency control if and only if the Wait-For Graph contains a directed cycle.',
    expectedKeywords: ['deadlock', 'wait-for graph', 'wfg', 'victim selection', 'cycle', 'rollback', 'starvation'],
    sampleSolution: `1. Definition of Deadlock and the Wait-For Graph (WFG):
• Deadlock: A state where two or more transactions are in a simultaneous circular wait condition, each waiting for a lock held by another transaction in the cycle, such that none can ever proceed.
• Wait-For Graph (WFG): A directed graph G = (V, E) where vertices V represent active transactions and a directed edge T_i → T_j indicates that T_i is waiting for a lock currently held by T_j. A deadlock exists if and only if the WFG contains a directed cycle.

2. Scenario Analysis:
• Edges in the WFG:
  - T1 → T2 (T1 waiting for item Y held by T2)
  - T2 → T3 (T2 waiting for item Z held by T3)
  - T3 → T4 (T3 waiting for item W held by T4)
  - T4 → T1 (T4 waiting for item X held by T1)
• Cycle Analysis:
  Cycle exists: T1 → T2 → T3 → T4 → T1.
  A circular wait exists among all four transactions. The system is in a Deadlock!

3. Victim Selection Criteria:
To break the cycle, the DBMS background deadlock detector must abort one or more "victim" transactions. Selection factors:
1. Transaction Cost / Progress: Select a younger transaction that has performed few updates, minimizing wasted rollback work.
2. Resource Locks Held: Prefer a transaction holding few locks whose release will unblock multiple waiting transactions.
3. Starvation Prevention: Avoid repeatedly choosing the same transaction as the victim by tracking abort counts; otherwise, a transaction may starve and never complete.`
  },
  {
    id: 'dbms-u5-q05',
    code: 'DBMS-U5-Q05',
    unitId: 'unit-5',
    unitNumber: 5,
    unitTitle: 'UNIT V – Concurrency Control and Disk Storage',
    subject: 'DBMS',
    topic: 'Two-Phase Locking',
    difficulty: 'Hard',
    type: 'Exam-oriented',
    title: 'Deadlock Prevention Protocols: Wait-Die vs Wound-Wait',
    description: 'Compare non-preemptive Wait-Die and preemptive Wound-Wait timestamp-based deadlock prevention schemes.',
    statement: {
      context: 'Deadlock prevention protocols use transaction start timestamps TS(Ti) to decide whether a transaction waits or aborts when a lock conflict occurs. Assume smaller timestamps denote older transactions (TS(T_old) < TS(T_young)).',
      tasks: [
        '1. State the decision rules for the Wait-Die Scheme when transaction Ti requests a lock held by Tj.',
        '2. State the decision rules for the Wound-Wait Scheme when transaction Ti requests a lock held by Tj.',
        '3. Contrast Wait-Die (non-preemptive) and Wound-Wait (preemptive) in terms of transaction restarts and explain why neither can ever form a deadlock cycle.'
      ]
    },
    tip: 'Wait-Die: Older waits, younger dies. Wound-Wait: Older wounds (preempts), younger waits.',
    expectedKeywords: ['wait-die', 'wound-wait', 'deadlock prevention', 'timestamp', 'preemptive', 'non-preemptive'],
    sampleSolution: `1. Wait-Die Scheme (Non-preemptive):
When T_i requests a data item currently held by T_j:
• If T_i is OLDER than T_j (TS(T_i) < TS(T_j)):
  T_i is allowed to WAIT.
• If T_i is YOUNGER than T_j (TS(T_i) > TS(T_j)):
  T_i DIES (aborts and restarts with its original timestamp).
(Rule of thumb: "Older waits; younger dies").

2. Wound-Wait Scheme (Preemptive):
When T_i requests a data item currently held by T_j:
• If T_i is OLDER than T_j (TS(T_i) < TS(T_j)):
  T_i WOUNDS T_j (T_j is preempted, aborted, and rolls back, giving the lock to older T_i).
• If T_i is YOUNGER than T_j (TS(T_i) > TS(T_j)):
  T_i is allowed to WAIT.
(Rule of thumb: "Older wounds; younger waits").

3. Comparison and Deadlock-Free Guarantee:
• Why Both Prevent Deadlocks:
In both schemes, directed edges in any hypothetical wait graph can only point in one chronological direction (either always from older to younger, or from younger to older). It is mathematically impossible to form a directed cycle, guaranteeing zero deadlocks!
• Operational Differences:
- Wait-Die is non-preemptive; an older transaction holding a lock is never preempted. However, younger transactions may repeatedly abort and restart multiple times while waiting for an older transaction to finish.
- Wound-Wait is preemptive; younger transactions holding locks are preempted immediately when an older transaction needs the resource. Wound-Wait generally experiences far fewer total transaction aborts.`
  },
  {
    id: 'dbms-u5-q06',
    code: 'DBMS-U5-Q06',
    unitId: 'unit-5',
    unitNumber: 5,
    unitTitle: 'UNIT V – Concurrency Control and Disk Storage',
    subject: 'DBMS',
    topic: 'Timestamp Ordering',
    difficulty: 'Hard',
    type: 'Problem-solving',
    title: 'Basic Timestamp Ordering (TO) Protocol & The Thomas Write Rule',
    description: 'Apply read/write timestamp checks and evaluate how the Thomas Write Rule permits obsolete writes safely.',
    statement: {
      context: 'Each transaction T is assigned a unique timestamp TS(T). Each data item X maintains two timestamps:\n• R-TS(X): Largest timestamp of any transaction that successfully executed read(X)\n• W-TS(X): Largest timestamp of any transaction that successfully executed write(X)',
      tasks: [
        '1. State the validation checks and actions when transaction T issues a read(X) under the Basic Timestamp Ordering protocol.',
        '2. State the validation checks and actions when transaction T issues a write(X) under the Basic Timestamp Ordering protocol.',
        '3. Explain the Thomas Write Rule modification for write(X) when TS(T) < W-TS(X), and explain why it produces view serializable schedules that Basic TO rejects.'
      ]
    },
    tip: 'Thomas Write Rule: If TS(T) < W-TS(X), ignore the obsolete write instead of aborting T.',
    expectedKeywords: ['timestamp ordering', 'r-ts', 'w-ts', 'thomas write rule', 'obsolete write', 'view serializable'],
    sampleSolution: `1. read(X) in Basic Timestamp Ordering:
When transaction T issues read(X):
• Condition 1: If TS(T) < W-TS(X):
  An operation from a younger transaction has already overwritten X. T needs to read an older value that was overwritten. Therefore, T is REJECTED, ABORTED, and rolled back.
• Condition 2: If TS(T) ≥ W-TS(X):
  The read is ALLOWED. R-TS(X) is updated to max(R-TS(X), TS(T)).

2. write(X) in Basic Timestamp Ordering:
When transaction T issues write(X):
• Condition 1: If TS(T) < R-TS(X):
  A younger transaction has already read the older value of X and assumed no subsequent write would occur. T is REJECTED, ABORTED, and rolled back.
• Condition 2: If TS(T) < W-TS(X):
  A younger transaction has already written an updated value of X. T is attempting to write an obsolete value. Under Basic TO, T is REJECTED, ABORTED, and rolled back.
• Otherwise:
  The write is ALLOWED. W-TS(X) is set to TS(T).

3. The Thomas Write Rule:
• Modification:
Under the Thomas Write Rule, when T issues write(X) and TS(T) < W-TS(X), instead of aborting T, the DBMS simply IGNORES the write!
• Why it is Safe:
Because a younger transaction with timestamp W-TS(X) > TS(T) has already overwritten X, T's write is obsolete. Any transaction with a timestamp between TS(T) and W-TS(X) that needed to read T's write has either already done so or would have been aborted. Ignoring the obsolete write preserves View Serializability while eliminating an unnecessary transaction rollback.`
  },
  {
    id: 'dbms-u5-q07',
    code: 'DBMS-U5-Q07',
    unitId: 'unit-5',
    unitNumber: 5,
    unitTitle: 'UNIT V – Concurrency Control and Disk Storage',
    subject: 'DBMS',
    topic: 'Secondary Storage Devices',
    difficulty: 'Medium',
    type: 'Problem-solving',
    title: 'Disk Storage Architecture: Seek Time, Rotational Latency & I/O Costs',
    description: 'Calculate average block access time for magnetic disks and analyze RAID storage configurations.',
    statement: {
      context: 'A magnetic hard disk drive (HDD) has the following physical specifications:\n• Rotational speed: 7,200 RPM\n• Average seek time: 8 ms\n• Transfer rate: 100 MB/sec\n• Database page block size: 8 KB',
      tasks: [
        '1. Calculate the Average Rotational Latency of this disk in milliseconds.',
        '2. Calculate the Transfer Time for reading one 8 KB database block in milliseconds.',
        '3. Compute the Total Time required to access and read a random 8 KB block, and explain why sequential disk access is orders of magnitude faster than random I/O.'
      ]
    },
    tip: 'Average rotational latency is the time for half a revolution (0.5 / (RPM / 60)).',
    expectedKeywords: ['seek time', 'rotational latency', 'transfer time', 'block access time', 'sequential i/o', 'random i/o'],
    sampleSolution: `1. Calculation of Average Rotational Latency:
• Rotational speed: 7,200 RPM = 7,200 / 60 = 120 revolutions per second.
• Time for one full 360° revolution = 1 / 120 sec ≈ 8.333 milliseconds.
• Average Rotational Latency (time for disk head to wait for target sector to rotate underneath, average half a turn):
  Average Latency = 8.333 ms / 2 ≈ 4.167 ms.

2. Calculation of Transfer Time:
• Block Size = 8 KB = 8 × 10^3 bytes (or 8,192 bytes).
• Transfer Rate = 100 MB/sec = 100,000 KB/sec.
• Transfer Time = (8 KB) / (100,000 KB/sec) = 0.00008 seconds = 0.08 ms.

3. Total Random Block Access Time:
Total Time = Average Seek Time + Average Rotational Latency + Transfer Time
Total Time = 8.0 ms + 4.167 ms + 0.08 ms ≈ 12.247 ms (approx 12.25 ms).
• Why Sequential Access is Much Faster:
In random I/O, every single 8 KB block access requires a physical seek (8 ms) and rotational delay (4.17 ms), meaning ~12.25 ms per block (only ~82 blocks/sec).
In sequential I/O, the disk head seeks once to the track, and all contiguous blocks on the track/cylinder are transferred continuously at the full 100 MB/s transfer rate without repeated seek and rotational penalties.`
  },
  {
    id: 'dbms-u5-q08',
    code: 'DBMS-U5-Q08',
    unitId: 'unit-5',
    unitNumber: 5,
    unitTitle: 'UNIT V – Concurrency Control and Disk Storage',
    subject: 'DBMS',
    topic: 'Buffering of Blocks',
    difficulty: 'Medium',
    type: 'Application-based',
    title: 'Buffer Pool Management: Frame Table, Dirty Bits & Replacement (LRU, Clock)',
    description: 'Examine buffer pool frame allocation, pin counts, dirty page flushing, and page replacement policies.',
    statement: {
      context: 'The DBMS Buffer Manager maintains a pool of memory frames in RAM to cache disk pages and avoid expensive disk I/O.',
      tasks: [
        '1. Explain the purpose of the Buffer Pool Directory (Frame Table), Pin Count (Reference Count), and Dirty Bit for each buffer frame.',
        '2. Explain why a page with Pin Count > 0 cannot be chosen for replacement when a new disk block must be brought into RAM.',
        '3. Compare the Least Recently Used (LRU) and the Clock (Second Chance) page replacement algorithms.'
      ]
    },
    tip: 'Pin count indicates active transactions currently reading/writing that memory frame.',
    expectedKeywords: ['buffer pool', 'frame table', 'pin count', 'dirty bit', 'lru', 'clock algorithm', 'page replacement'],
    sampleSolution: `1. Buffer Pool Components:
• Frame Table / Directory: An in-memory hash table mapping <PageID → FrameNumber>, tracking which disk pages currently reside in which RAM buffer frames.
• Pin Count (Reference Count): A counter tracking how many active transactions are currently using/reading/writing that memory page. When a transaction requests a page, Pin Count increments; when finished, Pin Count decrements.
• Dirty Bit: A 1-bit boolean flag indicating whether the page in RAM has been modified (written to) since it was read from disk. If dirty = 1, the page must be written back to disk before the frame can be reused.

2. Why Pinned Pages Cannot Be Replaced:
If Pin Count > 0, an active transaction is currently reading memory pointers or executing modifications within that frame. Evicting a pinned page would corrupt the transaction's memory pointers and crash the query. A frame is eligible for replacement only when Pin Count = 0.

3. LRU vs Clock Replacement Algorithm:
• Least Recently Used (LRU):
  Maintains a doubly linked list or timestamp for all unpinned frames. When a page must be evicted, it selects the frame that has not been accessed for the longest time.
  Limitation: High lock overhead on every single memory access to update linked-list pointers.
• Clock Algorithm (Second Chance):
  Approximates LRU with low overhead using an array of frames and a circular hand pointer. Each frame has a 1-bit Usage Flag (set to 1 on access). When looking for a replacement, the hand sweeps frames with Pin Count = 0:
  - If Usage Bit = 1, clear it to 0 and advance the hand.
  - If Usage Bit = 0, select this frame for eviction!`
  },
  {
    id: 'dbms-u5-q09',
    code: 'DBMS-U5-Q09',
    unitId: 'unit-5',
    unitNumber: 5,
    unitTitle: 'UNIT V – Concurrency Control and Disk Storage',
    subject: 'DBMS',
    topic: 'Placing File Records on Disk',
    difficulty: 'Hard',
    type: 'Exam-oriented',
    title: 'Record Placement on Disk: Fixed vs Variable & Slotted-Page Architecture',
    description: 'Examine disk page layout and detail how the Slotted Page Architecture manages variable-length records without fragmentation.',
    statement: {
      context: 'Database tables contain tuples of varying lengths (e.g. VARCHAR, BLOB, NULL attributes). Storing them requires careful page layout.',
      tasks: [
        '1. Differentiate Fixed-Length Records from Variable-Length Records in terms of record offset calculations and deletion handling (free list).',
        '2. Draw or trace the Slotted Page Architecture used to store variable-length records within a database page block.',
        '3. Explain how the Slotted Page Architecture allows records to be moved or compacted within a page without invalidating external Record IDs (RIDs).'
      ]
    },
    tip: 'Record ID (RID) = (Page Number, Slot Number). The external pointer points to the slot entry in the page header.',
    expectedKeywords: ['slotted page', 'record id', 'rid', 'variable-length records', 'slot directory', 'fragmentation', 'page header'],
    sampleSolution: `1. Fixed vs Variable-Length Records:
• Fixed-Length Records: Every record occupies an identical byte length (e.g., 64 bytes). The byte offset of record i on a page is simply calculated as (base_address + i × record_length). Deletions are managed with an in-page bitmap or free linked list.
• Variable-Length Records: Records have varying byte sizes due to VARCHAR columns, NULL values, and repeating fields. Direct offset multiplication is impossible; an indirection directory is required.

2. Slotted Page Architecture:
Within an 8 KB page block, the layout is organized into two growing ends:
+-------------------------------------------------------------------+
| PAGE HEADER (PageID, LSN, Free Space Pointer, Slot Count)         |
+-------------------------------------------------------------------+
| SLOT DIRECTORY:                                                   |
| [Slot 0: Offset, Length] [Slot 1: Offset, Length] [Slot 2: ...]   |
| (Slot directory grows DOWNWARDS ↓)                                |
+-------------------------------------------------------------------+
|                       FREE SPACE GAP                              |
+-------------------------------------------------------------------+
| (Record data bytes grow UPWARDS ↑ from the bottom of the page)    |
| [Record 2 Data...]                                                |
| [Record 1 Data...]                                                |
| [Record 0 Data...]                                                |
+-------------------------------------------------------------------+

3. Invariant Record IDs (RIDs) and Zero Fragmentation:
• An external Record Identifier (RID) is represented as a pair: RID = (PageNumber, SlotNumber).
• The external RID points to the Slot Directory entry in the page header—NOT to the physical byte offset of the data itself!
• If record 1 grows or is deleted, other records on the page can be shifted, compacted, and reorganized to reclaim contiguous free space. The slot directory entry for Slot 1 is simply updated with the new byte offset.
• Because the external RID (PageNumber, SlotNumber) remains completely unchanged, external indexes (B-trees, hash tables) do not need to update their pointers!`
  },
  {
    id: 'dbms-u5-q10',
    code: 'DBMS-U5-Q10',
    unitId: 'unit-5',
    unitNumber: 5,
    unitTitle: 'UNIT V – Concurrency Control and Disk Storage',
    subject: 'DBMS',
    topic: 'Operations on Files',
    difficulty: 'Hard',
    type: 'Problem-solving',
    title: 'File Organization Comparison: Heap, Sorted Sequential & Hash Files',
    description: 'Analyze disk I/O costs across primary file structures for scan, equality search, range query, insert, and delete.',
    statement: {
      context: 'Consider a file with B data blocks and R records. The choice of file organization dramatically affects the number of disk page I/O operations required.',
      tasks: [
        '1. Define Heap File, Sorted Sequential File, and Hash File organizations.',
        '2. Compare the disk I/O cost (in terms of number of block transfers B) for: (a) Scan all records, (b) Equality search on key, (c) Range search on key, and (d) Insert a new record.',
        '3. Explain why hash files excel at equality lookups but perform poorly on range queries.'
      ]
    },
    tip: 'Heap file equality search: B/2 on average; Sorted file equality search: log2(B) via binary search; Hash file: 1 I/O on average.',
    expectedKeywords: ['heap file', 'sorted file', 'hash file', 'disk i/o', 'binary search', 'equality search', 'range query'],
    sampleSolution: `1. Definitions of File Organizations:
• Heap File: Unordered collection of records placed on pages in arbitrary arrival order wherever free space exists.
• Sorted Sequential File: Records are physically ordered on disk pages based on a search key attribute (e.g. sorted by StudentID).
• Hash File: Records are partitioned into buckets based on a hash function h(K) applied to the hash key attribute.

2. Disk I/O Cost Comparison (Cost in Block Transfers):
Operation           | Heap File     | Sorted File           | Hash File (No Overflow)
--------------------+---------------+-----------------------+-------------------------
(a) Scan All Records| B             | B                     | 1.25 × B (due to loading factor)
(b) Equality Search | B / 2 (avg)   | log2(B) (binary search)| 1 (instant bucket jump)
(c) Range Search    | B (full scan) | log2(B) + matching B  | 1.25 × B (must scan all buckets)
(d) Insert Record   | 2 (read+write)| log2(B) + B/2 (shift) | 2 (read bucket + write)
(e) Delete Record   | Search + 1    | Search + B/2 (shift)  | Search + 1

3. Why Hash Files Excel at Equality but Fail on Range Queries:
• Equality Search: The hash function h(K) maps an exact search key directly to a specific bucket address: BucketNumber = h('Alice'). The disk head jumps straight to that bucket in 1 I/O operation.
• Range Queries (e.g. Salary BETWEEN 50000 AND 80000):
A good cryptographic or pseudo-random hash function deliberately scatters consecutive numerical keys across completely random buckets to avoid collisions. Because physical proximity on disk has zero correlation with key ordering, finding keys in a range requires reading almost EVERY bucket in the entire file (cost = full scan B).`
  }
];
