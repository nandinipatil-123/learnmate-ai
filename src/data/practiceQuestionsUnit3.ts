import { PracticeQuestion } from '../types';

export const UNIT_3_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'dbms-u3-q01',
    code: 'DBMS-U3-Q01',
    unitId: 'unit-3',
    unitNumber: 3,
    unitTitle: 'UNIT III – SQL, Functional Dependencies & Normalization',
    subject: 'DBMS',
    topic: 'DDL',
    difficulty: 'Easy',
    type: 'Conceptual',
    title: 'SQL Command Sublanguages: DDL, DML, DCL, and TCL',
    description: 'Classify SQL statements into their four foundational sublanguages with syntax examples.',
    statement: {
      context: 'SQL is divided into distinct functional sublanguages that govern schema definition, data manipulation, privilege authorization, and transaction boundaries.',
      tasks: [
        '1. Differentiate DDL, DML, DCL, and TCL, defining the exact purpose of each sublanguage.',
        '2. Provide at least two standard SQL commands for each of the four sublanguages.',
        '3. Explain the difference between DROP TABLE, TRUNCATE TABLE, and DELETE FROM table in terms of rollback capability and schema structure.'
      ]
    },
    tip: 'TRUNCATE is DDL (auto-commits, deallocates pages), while DELETE is DML (logged row-by-row).',
    expectedKeywords: ['ddl', 'dml', 'dcl', 'tcl', 'truncate', 'drop', 'delete', 'rollback', 'commit'],
    sampleSolution: `1. Classification of SQL Sublanguages:
• DDL (Data Definition Language): Defines and modifies the database structure, tables, indexes, and constraints. Operations implicitly commit and update the system catalog.
• DML (Data Manipulation Language): Retrieves, inserts, updates, and deletes records within existing relation instances without altering table structures.
• DCL (Data Control Language): Manages privileges, permissions, and security roles on database objects.
• TCL (Transaction Control Language): Manages logical transaction boundaries, committing modifications or rolling back changes to restore consistency.

2. Commands for each sublanguage:
• DDL: CREATE TABLE, ALTER TABLE, DROP TABLE, TRUNCATE TABLE.
• DML: SELECT, INSERT INTO, UPDATE, DELETE FROM.
• DCL: GRANT (give privileges), REVOKE (take back privileges).
• TCL: COMMIT (persist work), ROLLBACK (undo work), SAVEPOINT (intermediate marker).

3. DROP vs TRUNCATE vs DELETE:
• DROP TABLE: DDL command that removes both the table data AND the table schema from the database catalog permanently. Rollback is generally impossible.
• TRUNCATE TABLE: DDL command that quickly empties all rows by deallocating storage pages. Faster than DELETE because it avoids row-by-row logging. Cannot be rolled back in many database engines.
• DELETE FROM: DML command that removes rows one-by-one, checking WHERE conditions and triggers. Generates undo logs and can be rolled back using TCL ROLLBACK.`
  },
  {
    id: 'dbms-u3-q02',
    code: 'DBMS-U3-Q02',
    unitId: 'unit-3',
    unitNumber: 3,
    unitTitle: 'UNIT III – SQL, Functional Dependencies & Normalization',
    subject: 'DBMS',
    topic: 'Additional Basic Operations',
    difficulty: 'Medium',
    type: 'Problem-solving',
    title: 'Complex SQL Aggregations: GROUP BY, HAVING & Execution Order',
    description: 'Construct advanced aggregation queries and trace SQL query evaluation order.',
    statement: {
      context: 'Given the schema:\nOrders(OrderID, CustomerID, OrderDate, TotalAmount, Status)\nCustomers(CustomerID, CustomerName, City, Country)',
      tasks: [
        '1. State the standard conceptual execution order of an SQL query among clauses: FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY.',
        '2. Contrast the WHERE clause and the HAVING clause, explaining why aggregate functions (e.g. SUM, COUNT) cannot appear in the WHERE clause.',
        '3. Write an SQL query to retrieve the CustomerName, Country, and total spent for customers who have placed at least 3 completed orders (Status = "Completed") and whose total completed order spending exceeds $5,000, sorted descending by total spent.'
      ]
    },
    tip: 'WHERE filters rows before grouping; HAVING filters aggregated groups after grouping.',
    expectedKeywords: ['group by', 'having', 'where', 'execution order', 'aggregate function', 'order by'],
    sampleSolution: `1. Conceptual SQL Execution Order:
1. FROM (and JOINs): Identifies and combines source tables.
2. WHERE: Filters individual input rows before any grouping occurs.
3. GROUP BY: Partitions the filtered rows into groups sharing identical group key values.
4. HAVING: Filters the aggregated groups based on group-level predicates.
5. SELECT: Evaluates expressions, column projections, and aliases.
6. ORDER BY: Sorts the final projected result set.
7. LIMIT / OFFSET: Constrains the output row count.

2. WHERE vs HAVING:
• WHERE filters individual records before groups are formed. It cannot evaluate aggregate functions (like SUM or COUNT) because individual rows do not have access to group-wide summary statistics.
• HAVING operates on group aggregates after the GROUP BY phase has collapsed individual rows into aggregated buckets.

3. SQL Query:
SELECT c.CustomerName, c.Country, SUM(o.TotalAmount) AS TotalSpent
FROM Customers c
JOIN Orders o ON c.CustomerID = o.CustomerID
WHERE o.Status = 'Completed'
GROUP BY c.CustomerID, c.CustomerName, c.Country
HAVING COUNT(o.OrderID) >= 3 AND SUM(o.TotalAmount) > 5000
ORDER BY TotalSpent DESC;`
  },
  {
    id: 'dbms-u3-q03',
    code: 'DBMS-U3-Q03',
    unitId: 'unit-3',
    unitNumber: 3,
    unitTitle: 'UNIT III – SQL, Functional Dependencies & Normalization',
    subject: 'DBMS',
    topic: 'Triggers',
    difficulty: 'Hard',
    type: 'Application-based',
    title: 'Database Triggers: BEFORE, AFTER & INSTEAD OF Event Rules',
    description: 'Design procedural triggers to enforce business integrity rules and maintain audit trails.',
    statement: {
      context: 'An e-commerce database contains tables:\nProduct(ProductID, ProductName, StockQuantity, UnitPrice)\nInventoryAudit(AuditID, ProductID, OldQty, NewQty, ChangedAt, ChangedBy)',
      tasks: [
        '1. Differentiate Row-Level triggers from Statement-Level triggers (FOR EACH ROW vs statement execution).',
        '2. Differentiate BEFORE, AFTER, and INSTEAD OF triggers, explaining when each is appropriate.',
        '3. Write an SQL trigger that automatically prevents any UPDATE on Product that would set StockQuantity below 0, and for valid updates, logs the change into InventoryAudit.'
      ]
    },
    tip: 'Use :OLD and :NEW pseudorecords to inspect old and updated values.',
    expectedKeywords: ['trigger', 'before trigger', 'after trigger', 'row-level', 'for each row', 'new', 'old'],
    sampleSolution: `1. Row-Level vs Statement-Level Triggers:
• Row-Level Trigger (FOR EACH ROW): Executes once for each individual row modified by the triggering DML statement. If an UPDATE modifies 50 rows, the trigger executes 50 times. It has access to :OLD and :NEW tuple values.
• Statement-Level Trigger: Executes exactly once per DML statement regardless of how many rows are affected (even if 0 rows are modified). Suitable for global logging or table-wide security checks.

2. Timing of Triggers:
• BEFORE Trigger: Fires before the triggering operation is applied to the table. Used for input validation, sanitization, or default value assignment before writing to disk.
• AFTER Trigger: Fires after the operation and constraints have succeeded. Used for cascading side-effects, audit logging, and external notifications.
• INSTEAD OF Trigger: Replaces the triggering statement entirely. Primarily used on non-updatable views to route writes to underlying base tables.

3. Complete SQL Trigger Implementation:
CREATE OR REPLACE TRIGGER trg_validate_and_audit_stock
BEFORE UPDATE OF StockQuantity ON Product
FOR EACH ROW
BEGIN
  -- Prevent negative inventory
  IF :NEW.StockQuantity < 0 THEN
    RAISE_APPLICATION_ERROR(-20001, 'Stock quantity cannot be negative.');
  END IF;

  -- Audit log if quantity changed
  IF :OLD.StockQuantity <> :NEW.StockQuantity THEN
    INSERT INTO InventoryAudit (
      ProductID, OldQty, NewQty, ChangedAt, ChangedBy
    ) VALUES (
      :OLD.ProductID, :OLD.StockQuantity, :NEW.StockQuantity, SYSDATE, USER
    );
  END IF;
END;`
  },
  {
    id: 'dbms-u3-q04',
    code: 'DBMS-U3-Q04',
    unitId: 'unit-3',
    unitNumber: 3,
    unitTitle: 'UNIT III – SQL, Functional Dependencies & Normalization',
    subject: 'DBMS',
    topic: 'Stored Procedures',
    difficulty: 'Medium',
    type: 'Conceptual',
    title: 'Stored Procedures vs User-Defined Functions in SQL',
    description: 'Contrast stored procedures and functions in terms of return types, compilation, and performance.',
    statement: {
      context: 'Relational databases support procedural extensions (PL/SQL, T-SQL, pgSQL) to execute business logic directly on the database engine.',
      tasks: [
        '1. Compare Stored Procedures and User-Defined Functions across: Return values, Invocation in SQL statements (SELECT/WHERE), and Transaction Control (COMMIT/ROLLBACK).',
        '2. Explain two key operational advantages of stored procedures: Reduced Network Latency and Pre-compiled Execution Plans.'
      ]
    },
    tip: 'Functions must return a value and cannot execute DDL or transaction control commands in standard SQL.',
    expectedKeywords: ['stored procedure', 'function', 'pre-compiled', 'network latency', 'commit', 'rollback'],
    sampleSolution: `1. Stored Procedures vs Functions:
• Return Values:
  - Function: MUST return a single value or table. Cannot return void.
  - Stored Procedure: Can return zero, one, or multiple output parameters (OUT/INOUT), or return a result set cursor.
• Invocation Context:
  - Function: Can be called directly inside standard SQL queries (e.g., SELECT func(col) FROM Table WHERE func(col) > 10).
  - Stored Procedure: Cannot be used in SELECT or WHERE clauses; must be executed independently using EXECUTE / CALL.
• Transaction Control:
  - Function: Cannot execute transaction control statements (COMMIT, ROLLBACK) to maintain deterministic evaluation.
  - Stored Procedure: Can initiate, manage, commit, or abort transactions internally.

2. Operational Advantages of Stored Procedures:
• Reduced Network Latency: Instead of transmitting multiple round-trip SQL queries across the network between application server and database, a single procedure call executes the entire multi-step workflow locally inside the database engine.
• Pre-compiled Execution Plans: When created, the database parses, optimizes, and compiles the procedural code into an execution plan stored in the procedure cache. Subsequent invocations execute instantly without repetitive parsing and optimization overhead.`
  },
  {
    id: 'dbms-u3-q05',
    code: 'DBMS-U3-Q05',
    unitId: 'unit-3',
    unitNumber: 3,
    unitTitle: 'UNIT III – SQL, Functional Dependencies & Normalization',
    subject: 'DBMS',
    topic: 'Functional Dependencies',
    difficulty: 'Medium',
    type: 'Exam-oriented',
    title: 'Functional Dependencies & Proof of Armstrong’s Axioms',
    description: 'Formulate functional dependencies and prove Armstrong’s inference rules for attribute derivation.',
    statement: {
      context: 'Functional dependencies formalize relationships among attributes in relational database schema design.',
      tasks: [
        '1. Formally define a Functional Dependency X → Y over relation schema R.',
        '2. State the three primary Armstrong’s Axioms: Reflexivity, Augmentation, and Transitivity.',
        '3. Using Armstrong’s Axioms, mathematically prove the Union Rule: If X → Y and X → Z, then X → YZ.'
      ]
    },
    tip: 'To prove Union Rule, apply Augmentation to X → Y to get X → XY, then apply Augmentation to X → Z to get XY → YZ, then use Transitivity.',
    expectedKeywords: ['functional dependency', 'armstrongs axioms', 'reflexivity', 'augmentation', 'transitivity', 'union rule'],
    sampleSolution: `1. Formal Definition of Functional Dependency:
Given relation schema R, a Functional Dependency X → Y (where X ⊆ R and Y ⊆ R) holds on R if and only if for any legal relation instance r(R), whenever two tuples t1 and t2 agree on attributes X, they MUST also agree on attributes Y:
∀ t1, t2 ∈ r, if t1[X] = t2[X], then t1[Y] = t2[Y].

2. Armstrong’s Three Primary Axioms:
1. Reflexivity Rule: If Y ⊆ X, then X → Y. (Trivial dependency).
2. Augmentation Rule: If X → Y, then XZ → YZ for any attribute set Z.
3. Transitivity Rule: If X → Y and Y → Z, then X → Z.
(These rules are sound and complete for deriving all valid functional dependencies).

3. Mathematical Proof of the Union Rule:
Goal: Prove that if X → Y and X → Z, then X → YZ.
Proof:
Step 1: Given X → Y.
Step 2: By the Augmentation Rule (augmenting with X):
        XX → XY, which simplifies to X → XY.
Step 3: Given X → Z.
Step 4: By the Augmentation Rule (augmenting with Y):
        XY → YZ.
Step 5: By applying the Transitivity Rule to Step 2 (X → XY) and Step 4 (XY → YZ):
        X → YZ.
Hence, the Union Rule is proved.`
  },
  {
    id: 'dbms-u3-q06',
    code: 'DBMS-U3-Q06',
    unitId: 'unit-3',
    unitNumber: 3,
    unitTitle: 'UNIT III – SQL, Functional Dependencies & Normalization',
    subject: 'DBMS',
    topic: 'Functional Dependencies',
    difficulty: 'Hard',
    type: 'Problem-solving',
    title: 'Attribute Closure Algorithm and Finding All Candidate Keys',
    description: 'Compute attribute closures and determine all candidate keys for a given relational schema.',
    statement: {
      context: 'Consider the relational schema R(A, B, C, D, E) with the set of functional dependencies F:\nF = { A → BC, CD → E, B → D, E → A }',
      tasks: [
        '1. Compute the attribute closure (B)+ with respect to F.',
        '2. Compute the attribute closure (CD)+ with respect to F.',
        '3. Find ALL candidate keys of relation schema R, providing step-by-step justification.'
      ]
    },
    tip: 'A candidate key is a minimal superkey whose closure contains all attributes {A, B, C, D, E}.',
    expectedKeywords: ['attribute closure', 'candidate key', 'superkey', 'closure algorithm', 'minimal'],
    sampleSolution: `1. Computation of (B)+:
• Start: Closure = { B }
• B → D: Closure becomes { B, D }
• Check A → BC: Left side A not in {B, D}.
• Check CD → E: C is not in {B, D}.
• Check E → A: E not in {B, D}.
• No more FDs can be applied.
Result: (B)+ = { B, D }

2. Computation of (CD)+:
• Start: Closure = { C, D }
• CD → E: Closure becomes { C, D, E }
• E → A: Closure becomes { A, C, D, E }
• A → BC: Closure becomes { A, B, C, D, E }
• All attributes are generated!
Result: (CD)+ = { A, B, C, D, E } (Superkey).

3. Finding All Candidate Keys:
Attribute analysis:
- Attribute C appears only on the left side of FDs (never on the right side of any FD in F: A, BC, E, D, A).
- Therefore, C MUST be present in every candidate key!
Let's test combinations with C:
• Test (C)+: { C } (Not a key).
• Test (A, C)+:
  (AC)+: A → BC gives {A, B, C}. B → D gives {A, B, C, D}. CD → E gives {A, B, C, D, E}.
  Since (AC)+ contains all attributes, AC is a superkey. Subsets: (A)+ = {A, B, C, D, E} wait, let's check (A)+:
  (A)+ = {A} → BC → {A, B, C} → D → {A, B, C, D} → CD → E → {A, B, C, D, E}!
  Wait! A alone derives {A, B, C, D, E}!
  Let's verify (A)+:
  A → BC gives {A, B, C}. B → D gives {A, B, C, D}. CD → E gives {A, B, C, D, E}.
  Thus (A)+ = {A, B, C, D, E}. A is a candidate key!
• From E → A:
  Since A is a candidate key and E → A, (E)+ = {E, A, B, C, D}. E is a candidate key!
• From CD → E:
  Since E is a candidate key, (CD)+ derives all attributes. Subsets: (C)+ = {C}, (D)+ = {D}. Neither is a key.
  Therefore, CD is a candidate key!
• From B → D:
  Since CD is a candidate key and B → D, (BC)+:
  (BC)+: B → D gives {B, C, D}. CD derives all attributes!
  Subsets: (B)+ = {B, D}, (C)+ = {C}. Neither is a key.
  Therefore, BC is a candidate key!

Conclusion: The Candidate Keys of R are:
{ A }, { E }, { CD }, { BC }`
  },
  {
    id: 'dbms-u3-q07',
    code: 'DBMS-U3-Q07',
    unitId: 'unit-3',
    unitNumber: 3,
    unitTitle: 'UNIT III – SQL, Functional Dependencies & Normalization',
    subject: 'DBMS',
    topic: '2NF',
    difficulty: 'Medium',
    type: 'Problem-solving',
    title: 'First (1NF) & Second Normal Form (2NF) Schema Decomposition',
    description: 'Identify partial functional dependencies and decompose unnormalized relations into 2NF.',
    statement: {
      context: 'A student enrollment registry uses table:\nStudentCourse(StudentID, CourseID, StudentName, CourseTitle, InstructorName, Grade)\nPrimary Key: (StudentID, CourseID)\nFunctional Dependencies:\nFD1: (StudentID, CourseID) → Grade\nFD2: StudentID → StudentName\nFD3: CourseID → CourseTitle, InstructorName',
      tasks: [
        '1. State the formal requirements for a relation to be in 1NF and 2NF.',
        '2. Identify which functional dependencies violate 2NF in StudentCourse, explaining why.',
        '3. Decompose StudentCourse into a set of relations in 2NF, specifying the primary key and foreign keys of each decomposed relation.'
      ]
    },
    tip: '2NF requires that every non-prime attribute is fully functionally dependent on the primary key (no partial dependencies).',
    expectedKeywords: ['1nf', '2nf', 'partial dependency', 'prime attribute', 'decomposition', 'candidate key'],
    sampleSolution: `1. Formal Definitions:
• First Normal Form (1NF): A relation is in 1NF if and only if all underlying attribute domains contain only atomic (indivisible) values, and there are no repeating groups or arrays.
• Second Normal Form (2NF): A relation is in 2NF if and only if it is in 1NF and every non-prime attribute is fully functionally dependent on every candidate key (i.e., no partial dependencies exist).

2. Identification of 2NF Violations:
• Candidate Key: { StudentID, CourseID }
• Prime Attributes: { StudentID, CourseID }
• Non-prime Attributes: { StudentName, CourseTitle, InstructorName, Grade }
• Violations:
  - FD2: StudentID → StudentName is a Partial Dependency because non-prime attribute StudentName depends only on StudentID, which is a proper subset of the composite candidate key.
  - FD3: CourseID → CourseTitle, InstructorName is also a Partial Dependency because CourseTitle and InstructorName depend only on CourseID, another proper subset of the candidate key.

3. Lossless 2NF Decomposition:
Decompose the relation by separating the partially dependent attributes into their own relations:
• R1 (Student):
  Schema: Student (StudentID, StudentName)
  Primary Key: StudentID
• R2 (Course):
  Schema: Course (CourseID, CourseTitle, InstructorName)
  Primary Key: CourseID
• R3 (Enrollment):
  Schema: Enrollment (StudentID, CourseID, Grade)
  Primary Key: (StudentID, CourseID)
  Foreign Keys:
    - StudentID REFERENCES Student(StudentID)
    - CourseID REFERENCES Course(CourseID)
All relations are now in 2NF.`
  },
  {
    id: 'dbms-u3-q08',
    code: 'DBMS-U3-Q08',
    unitId: 'unit-3',
    unitNumber: 3,
    unitTitle: 'UNIT III – SQL, Functional Dependencies & Normalization',
    subject: 'DBMS',
    topic: '3NF',
    difficulty: 'Hard',
    type: 'Exam-oriented',
    title: 'Third Normal Form (3NF) vs Boyce-Codd Normal Form (BCNF)',
    description: 'Compare 3NF and BCNF definitions and analyze relations where 3NF is satisfied but BCNF is violated.',
    statement: {
      context: 'Consider a college advising relation:\nAdvising(StudentID, Subject, Advisor)\nConstraints:\n• Each advisor advises only one subject: Advisor → Subject\n• A student may take several subjects, but for each subject, they have at most one advisor: (StudentID, Subject) → Advisor',
      tasks: [
        '1. State the formal conditions for a relation to be in 3NF and BCNF.',
        '2. Identify the candidate keys of the Advising relation.',
        '3. Show that Advising is in 3NF but NOT in BCNF, explaining why BCNF is stricter.',
        '4. Explain why decomposing this relation into BCNF fails to preserve the dependency (StudentID, Subject) → Advisor.'
      ]
    },
    tip: 'In 3NF, the right-hand side can be a prime attribute (Y is prime). In BCNF, X must ALWAYS be a superkey.',
    expectedKeywords: ['3nf', 'bcnf', 'transitive dependency', 'superkey', 'prime attribute', 'dependency preservation'],
    sampleSolution: `1. Formal Definitions of 3NF and BCNF:
For every non-trivial functional dependency X → Y holding on schema R:
• 3NF Condition: At least one of the following must hold:
  1. X is a Superkey of R, OR
  2. Y is a Prime Attribute (member of some candidate key).
• BCNF Condition: X MUST be a Superkey of R (no exceptions for prime attributes).

2. Candidate Keys of Advising:
Given FDs:
1. (StudentID, Subject) → Advisor
2. Advisor → Subject
• Candidate Key 1: (StudentID, Subject)
• Candidate Key 2: (StudentID, Advisor) [since Advisor → Subject, (StudentID, Advisor)+ = {StudentID, Advisor, Subject}].
Prime Attributes: { StudentID, Subject, Advisor } (all attributes are prime!).

3. Why Advising is in 3NF but NOT in BCNF:
Evaluate the FD: Advisor → Subject
• Check BCNF: Is Advisor a superkey? No (Advisor alone does not derive StudentID). BCNF is VIOLATED!
• Check 3NF: Is Advisor a superkey? No. BUT is Subject a prime attribute? YES (Subject belongs to candidate key {StudentID, Subject}).
Therefore, the relation satisfies 3NF, but violates BCNF.

4. Dependency Preservation Trade-off:
To achieve BCNF, we decompose Advising into:
- R1 (Advisor, Subject) with PK = Advisor
- R2 (StudentID, Advisor) with PK = (StudentID, Advisor)
Both R1 and R2 are in BCNF. However, the original dependency (StudentID, Subject) → Advisor spans across R1 and R2. Enforcing it requires an expensive cross-table join. BCNF cannot always preserve all functional dependencies, whereas 3NF always guarantees both lossless join and dependency preservation.`
  },
  {
    id: 'dbms-u3-q09',
    code: 'DBMS-U3-Q09',
    unitId: 'unit-3',
    unitNumber: 3,
    unitTitle: 'UNIT III – SQL, Functional Dependencies & Normalization',
    subject: 'DBMS',
    topic: 'Normal Forms',
    difficulty: 'Hard',
    type: 'Problem-solving',
    title: 'Testing for Lossless-Join and Dependency-Preserving Decompositions',
    description: 'Verify mathematical properties of schema decompositions using Chase algorithm principles.',
    statement: {
      context: 'Let relation R(A, B, C) have functional dependencies F = { A → B }. A database designer decomposes R into R1(A, B) and R2(B, C).',
      tasks: [
        '1. State the formal mathematical theorem for testing whether a binary decomposition (R1, R2) of R is a Lossless-Join Decomposition.',
        '2. Determine whether the decomposition into R1(A, B) and R2(B, C) is Lossless-Join or Lossy, showing the formal test.',
        '3. State the formal definition of Dependency Preservation and explain why lossy decompositions produce phantom / spurious tuples.'
      ]
    },
    tip: 'A binary decomposition is lossless iff (R1 ∩ R2) → R1 or (R1 ∩ R2) → R2.',
    expectedKeywords: ['lossless-join', 'lossy decomposition', 'spurious tuples', 'dependency preservation', 'intersection', 'superkey'],
    sampleSolution: `1. Mathematical Theorem for Lossless-Join Decomposition:
A decomposition of relation R into two relations R1 and R2 is Lossless-Join with respect to a set of functional dependencies F if and only if the intersection of their attributes forms a superkey of at least one of the decomposed relations:
(R1 ∩ R2) → R1 ∈ F+   OR   (R1 ∩ R2) → R2 ∈ F+

2. Testing the Decomposition R1(A, B) and R2(B, C):
• R1 ∩ R2 = { B }
• R1 − R2 = { A }
• R2 − R1 = { C }
Now check if B is a superkey of R1 or R2:
- Does B → A hold? Compute (B)+: Under F = { A → B }, (B)+ = { B }. Does not derive A.
- Does B → C hold? Compute (B)+: { B }. Does not derive C.
Neither condition holds!
Conclusion: The decomposition R1(A, B) and R2(B, C) is LOSSY! Joining R1 and R2 will produce spurious (false) tuples that were not present in the original relation R.
(A valid lossless decomposition would be R1(A, B) and R2(A, C), where R1 ∩ R2 = {A}, and A → AB holds).

3. Dependency Preservation & Spurious Tuples:
• Dependency Preservation: A decomposition D = {R1, R2, ..., Rk} is dependency-preserving if (F1 ∪ F2 ∪ ... ∪ Fk)+ = F+, where Fi is the projection of F onto Ri. This ensures any valid update can be verified locally within individual tables without performing joins.
• Spurious Tuples: In a lossy decomposition, the join of decomposed tables creates extra phantom rows that falsely combine attributes that were never associated in reality, corrupting data integrity.`
  },
  {
    id: 'dbms-u3-q10',
    code: 'DBMS-U3-Q10',
    unitId: 'unit-3',
    unitNumber: 3,
    unitTitle: 'UNIT III – SQL, Functional Dependencies & Normalization',
    subject: 'DBMS',
    topic: '4NF',
    difficulty: 'Hard',
    type: 'Conceptual',
    title: 'Multivalued Dependencies (MVD) & Fourth Normal Form (4NF)',
    description: 'Analyze independent multi-valued facts in relations and decompose schemas to 4NF.',
    statement: {
      context: 'A university course table stores independent facts about instructors and recommended textbooks:\nCourseInfo(CourseName, Instructor, TextBook)\nAn instructor may teach multiple courses, and each course recommends multiple independent textbooks. If course "CS101" is taught by instructors {Smith, Jones} and uses textbooks {TextA, TextB}, the table contains:\n(CS101, Smith, TextA)\n(CS101, Smith, TextB)\n(CS101, Jones, TextA)\n(CS101, Jones, TextB)',
      tasks: [
        '1. Define a Multivalued Dependency (MVD) X ↠ Y.',
        '2. Identify the MVDs in CourseInfo and show why the table is in BCNF yet exhibits severe redundancy.',
        '3. State the formal definition of Fourth Normal Form (4NF) and decompose CourseInfo into 4NF relations.'
      ]
    },
    tip: 'MVD occurs when two independent multivalued attributes depend on the same key.',
    expectedKeywords: ['multivalued dependency', 'mvd', '4nf', 'fourth normal form', 'bcnf', 'redundancy', 'independent facts'],
    sampleSolution: `1. Definition of Multivalued Dependency:
Given relation schema R with subsets of attributes X and Y (and let Z = R − (X ∪ Y)).
The Multivalued Dependency X ↠ Y (X multidetermines Y) holds on R if and only if for any valid instance r(R), whenever two tuples t1 and t2 agree on X (t1[X] = t2[X]), there exist tuples t3 and t4 in r such that:
t3[X] = t1[X], t3[Y] = t1[Y], t3[Z] = t2[Z], and
t4[X] = t1[X], t4[Y] = t2[Y], t4[Z] = t1[Z].
In plain English: X determines a set of values for Y independently of the values of Z.

2. Analysis of CourseInfo:
• MVDs present:
  - CourseName ↠ Instructor
  - CourseName ↠ TextBook
• Functional Dependencies: None (no attribute is functionally determined by another).
• Candidate Key: All attributes together { CourseName, Instructor, TextBook }.
• Why in BCNF: Since there are no non-trivial functional dependencies, BCNF is vacuously satisfied!
• Redundancy: If a course has 3 instructors and 4 textbooks, 12 rows are required. Adding 1 instructor requires inserting 4 new rows.

3. Definition of 4NF & Decomposition:
• 4NF Definition: A relation schema R is in 4NF with respect to a set of dependencies D if, for every non-trivial multivalued dependency X ↠ Y, X is a Superkey of R.
• Decomposing CourseInfo into 4NF:
  Separate the independent multivalued facts into distinct relations:
  - CourseInstructors (CourseName, Instructor)
    Primary Key: (CourseName, Instructor)
  - CourseBooks (CourseName, TextBook)
    Primary Key: (CourseName, TextBook)
Both relations are in 4NF with zero redundancy.`
  }
];
