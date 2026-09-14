import { PracticeQuestion } from '../types';

export const UNIT_2_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'dbms-u2-q01',
    code: 'DBMS-U2-Q01',
    unitId: 'unit-2',
    unitNumber: 2,
    unitTitle: 'UNIT II – Relational Model, Relational Algebra & Calculus',
    subject: 'DBMS',
    topic: 'Introduction to Relational Model',
    difficulty: 'Easy',
    type: 'Conceptual',
    title: 'Relational Model Foundations: Relations, Tuples, Domains & Degrees',
    description: 'Understand the mathematical foundations of Codd’s relational model and attribute semantics.',
    statement: {
      context: 'In relational database theory, data is organized as a collection of relations grounded in first-order predicate logic and set theory.',
      tasks: [
        '1. Formally define: Relation Schema, Relation Instance, Tuple, Attribute, and Domain.',
        '2. Define Degree (Arity) and Cardinality of a relation, and explain why duplicate tuples are forbidden in formal relational set theory.'
      ]
    },
    tip: 'A relation is mathematically a subset of the Cartesian product of attribute domains.',
    expectedKeywords: ['relation schema', 'relation instance', 'tuple', 'domain', 'degree', 'cardinality', 'set theory'],
    sampleSolution: `1. Formal Relational Model Definitions:
• Domain (D): A set of atomic, indivisible values of a specific data type (e.g., set of all valid 10-digit phone numbers).
• Attribute (A): The named role played by a domain in a relation schema (e.g., 'CustomerPhone').
• Relation Schema R(A1, A2, ..., An): The structural blueprint specifying the relation name and its list of attributes with associated domains: R = (A1:D1, A2:D2, ..., An:Dn).
• Relation Instance (r): A mathematical relation defined as a finite set of n-tuples: r ⊆ (dom(A1) × dom(A2) × ... × dom(An)).
• Tuple: A single ordered list of n attribute values corresponding to one row/record in the relation instance.

2. Degree, Cardinality, and Uniqueness:
• Degree (Arity): The number of attributes (columns) comprising the relation schema.
• Cardinality: The total number of tuples (rows) currently present in the relation instance.
• Why Duplicate Tuples are Disallowed:
Mathematically, a relation instance is a set of tuples. In set theory, elements of a set are distinct by definition; duplicate elements cannot exist. Every tuple must be uniquely distinguishable by at least one candidate key.`
  },
  {
    id: 'dbms-u2-q02',
    code: 'DBMS-U2-Q02',
    unitId: 'unit-2',
    unitNumber: 2,
    unitTitle: 'UNIT II – Relational Model, Relational Algebra & Calculus',
    subject: 'DBMS',
    topic: 'Integrity Constraints over Relations',
    difficulty: 'Medium',
    type: 'Exam-oriented',
    title: 'Integrity Constraints: Domain, Entity, Key & Referential Integrity',
    description: 'Formulate the rules governing database integrity and specify referential action policies.',
    statement: {
      context: 'A schema contains tables `Department(DeptID, DeptName)` and `Employee(EmpID, Name, DeptID, Salary)` where `Employee.DeptID` references `Department.DeptID`.',
      tasks: [
        '1. Define Domain Constraint, Key Constraint, Entity Integrity, and Referential Integrity.',
        '2. Explain the behavior of referential actions: ON DELETE CASCADE, ON DELETE SET NULL, and ON DELETE RESTRICT (NO ACTION) when a department record is deleted.'
      ]
    },
    tip: 'Entity integrity guarantees primary keys are never NULL; referential integrity prevents dangling foreign key pointers.',
    expectedKeywords: ['domain constraint', 'key constraint', 'entity integrity', 'referential integrity', 'on delete cascade', 'set null', 'restrict'],
    sampleSolution: `1. Four Fundamental Integrity Constraints:
• Domain Constraint: Specifies that every attribute value must belong to the allowable atomic domain of that attribute (e.g., Salary > 0, Age between 18 and 70).
• Key Constraint: Specifies that no two distinct tuples in any valid relation state can have the same values for a Superkey/Candidate Key.
• Entity Integrity Constraint: States that no primary key attribute value can ever be NULL. This ensures every individual entity is unambiguously addressable.
• Referential Integrity Constraint: Stated between two relations. If foreign key FK in relation R1 references primary key PK in relation R2, then for every tuple in R1, either FK is NULL or FK matches the PK of an existing tuple in R2.

2. Referential Action Policies on Parent Record Deletion:
• ON DELETE RESTRICT / NO ACTION: The DBMS rejects the delete command on Department if any child Employee records currently reference that DeptID, raising an error.
• ON DELETE CASCADE: When a Department tuple is deleted, the DBMS automatically deletes all child Employee tuples referencing that DeptID.
• ON DELETE SET NULL: When a Department tuple is deleted, the DBMS automatically updates DeptID in all referencing Employee tuples to NULL (valid only if DeptID in Employee allows NULL).`
  },
  {
    id: 'dbms-u2-q03',
    code: 'DBMS-U2-Q03',
    unitId: 'unit-2',
    unitNumber: 2,
    unitTitle: 'UNIT II – Relational Model, Relational Algebra & Calculus',
    subject: 'DBMS',
    topic: 'Logical Database Design',
    difficulty: 'Hard',
    type: 'Problem-solving',
    title: 'ER to Relational Schema Mapping Methodology',
    description: 'Systematically transform ER constructs (entities, weak entities, 1:N, M:N, multivalued attributes) into normalized tables.',
    statement: {
      context: 'During logical database design, conceptual ER models must be mapped into relational schemas while preserving all constraints and avoiding unnecessary NULLs.',
      tasks: [
        '1. State the step-by-step mapping rules for converting: (a) Strong Entity Sets, (b) Weak Entity Sets, (c) 1:N Binary Relationships, (d) M:N Binary Relationships, and (e) Multivalued Attributes.',
        '2. For an M:N relationship "Enrollment" between Student(StudentID) and Course(CourseID) with attribute Grade, specify the mapped relational schema and its primary key.'
      ]
    },
    tip: 'M:N relationships always require creating a separate junction table.',
    expectedKeywords: ['mapping rules', 'foreign key', 'junction table', 'multivalued attribute', 'composite key', 'weak entity'],
    sampleSolution: `1. ER-to-Relational Mapping Rules:
• Strong Entity Set E: Create relation R containing all simple attributes of E. Choose one candidate key as Primary Key.
• Weak Entity Set W (owner E): Create relation R containing all simple attributes of W. Include the Primary Key of owner E as a Foreign Key. The Composite Primary Key of R is { Owner_PK, Discriminator_PartialKey }.
• 1:N Binary Relationship (Parent 1 ↔ Child N): Add the Primary Key of the "1" side as a Foreign Key attribute into the relation schema of the "N" side, along with any descriptive attributes of the relationship.
• M:N Binary Relationship: Create a separate junction relation (cross-reference table). Include the primary keys of both participating entities as foreign keys. The Composite Primary Key is { Entity1_PK, Entity2_PK } plus any distinguishing relationship attributes.
• Multivalued Attribute A of entity E: Create a new relation R consisting of { A, Entity_PK }. The primary key of R is { Entity_PK, A }, with Entity_PK being a Foreign Key referencing E.

2. M:N Relationship "Enrollment" Schema:
• Relation Schema: Enrollment (StudentID, CourseID, Grade, EnrollmentDate)
• Primary Key: Composite Key { StudentID, CourseID }
• Foreign Keys:
  - StudentID REFERENCES Student(StudentID) ON DELETE CASCADE
  - CourseID REFERENCES Course(CourseID) ON DELETE CASCADE`
  },
  {
    id: 'dbms-u2-q04',
    code: 'DBMS-U2-Q04',
    unitId: 'unit-2',
    unitNumber: 2,
    unitTitle: 'UNIT II – Relational Model, Relational Algebra & Calculus',
    subject: 'DBMS',
    topic: 'Selection and Projection',
    difficulty: 'Easy',
    type: 'Problem-solving',
    title: 'Relational Algebra Operators: Selection (σ) and Projection (π)',
    description: 'Formulate basic relational algebra expressions using horizontal selection and vertical projection.',
    statement: {
      context: 'Given the relation schema:\nEmployee(EmpId, EmpName, Department, Salary, City)',
      tasks: [
        '1. Formally define the Selection operator (σ) and Projection operator (π), explaining how duplicate elimination applies.',
        '2. Write a relational algebra expression to retrieve the EmpName and Salary of all employees who work in the "IT" department and earn more than $75,000.',
        '3. Write a relational algebra expression to find the distinct cities where employees reside.'
      ]
    },
    tip: 'Selection filters rows horizontally; projection extracts columns vertically.',
    expectedKeywords: ['selection', 'projection', 'sigma', 'pi', 'duplicate elimination', 'horizontal', 'vertical'],
    sampleSolution: `1. Formal Definitions:
• Selection (σ_condition): A unary operator that selects tuples satisfying a specified predicate condition (horizontal slicing).
  Notation: σ_θ(R) = { t | t ∈ R and θ(t) is true }
• Projection (π_attribute_list): A unary operator that outputs a new relation containing only the specified attributes (vertical slicing).
  In formal relational algebra, since the result is a mathematical set, duplicate tuples resulting from omitted key attributes are automatically eliminated.

2. Algebraic Expression for IT Employees earning > $75,000:
π_{EmpName, Salary} ( σ_{Department = 'IT' ∧ Salary > 75000} (Employee) )

3. Algebraic Expression for Distinct Cities:
π_{City} (Employee)
(Note: In relational algebra, duplicate city names are eliminated by definition of the projection set operator).`
  },
  {
    id: 'dbms-u2-q05',
    code: 'DBMS-U2-Q05',
    unitId: 'unit-2',
    unitNumber: 2,
    unitTitle: 'UNIT II – Relational Model, Relational Algebra & Calculus',
    subject: 'DBMS',
    topic: 'Set Operations',
    difficulty: 'Medium',
    type: 'Problem-solving',
    title: 'Relational Algebra Set Operations: Union, Intersection & Difference',
    description: 'Apply set operations to relations and verify union compatibility requirements.',
    statement: {
      context: 'A college has two relations:\nGradStudent(StudentID, StudentName, Department)\nTeachingAssistant(StudentID, StudentName, Department)',
      tasks: [
        '1. State the two mathematical requirements for two relations to be Union-Compatible (Type-Compatible).',
        '2. Write relational algebra expressions for: (a) Students who are either Grad students OR TAs, (b) Students who are BOTH Grad students and TAs, and (c) Grad students who are NOT TAs.',
        '3. Express the Intersection operator (∩) in terms of the Set Difference operator (−).'
      ]
    },
    tip: 'R ∩ S = R − (R − S).',
    expectedKeywords: ['union compatibility', 'union', 'intersection', 'set difference', 'arity', 'domain'],
    sampleSolution: `1. Union Compatibility Requirements:
Two relations R and S are union-compatible if and only if:
1. They have the same degree (arity), meaning both relations have the exact same number of attributes: degree(R) = degree(S) = n.
2. The domain of the i-th attribute of R is compatible with the domain of the i-th attribute of S for all 1 ≤ i ≤ n: dom(Ai) = dom(Bi).

2. Relational Algebra Expressions:
(a) Students who are either Grad students OR TAs (Union):
GradStudent ∪ TeachingAssistant

(b) Students who are BOTH Grad students and TAs (Intersection):
GradStudent ∩ TeachingAssistant

(c) Grad students who are NOT Teaching Assistants (Set Difference):
GradStudent − TeachingAssistant

3. Intersection in terms of Set Difference:
The intersection can be expressed using set difference as:
R ∩ S = R − (R − S)`
  },
  {
    id: 'dbms-u2-q06',
    code: 'DBMS-U2-Q06',
    unitId: 'unit-2',
    unitNumber: 2,
    unitTitle: 'UNIT II – Relational Model, Relational Algebra & Calculus',
    subject: 'DBMS',
    topic: 'Joins',
    difficulty: 'Hard',
    type: 'Problem-solving',
    title: 'Relational Joins: Theta, Equi, Natural (⨝), and Outer Joins',
    description: 'Distinguish inner join variants and analyze outer joins with NULL preservation.',
    statement: {
      context: 'Given schemas:\nCustomer(CustID, Name, City)\nOrders(OrderID, CustID, Amount)',
      tasks: [
        '1. Formally differentiate Theta Join (⨝_θ), Equi Join, and Natural Join (⨝).',
        '2. Explain Left Outer Join (⟕), Right Outer Join (⟖), and Full Outer Join (⟗). Why are outer joins non-loss operators when handling customers without orders?',
        '3. Show how a Natural Join can be expressed using Cartesian Product (×), Selection (σ), and Projection (π).'
      ]
    },
    tip: 'Natural join automatically joins on common attribute names and removes duplicate join columns.',
    expectedKeywords: ['natural join', 'theta join', 'equi join', 'left outer join', 'right outer join', 'cartesian product', 'null'],
    sampleSolution: `1. Comparison of Join Operators:
• Theta Join (R ⨝_θ S): Cartesian product of R and S followed by a selection condition θ: σ_θ (R × S), where θ is any boolean condition (<, ≤, =, >, ≥, ≠).
• Equi Join: A specialized Theta Join where the condition θ contains exclusively equality operators (=) between attributes (e.g., R.A = S.B). Both join columns appear in the result.
• Natural Join (R ⨝ S): An Equi Join performed on all identically named attributes between R and S, where duplicate join columns are automatically projected out.

2. Outer Joins and NULL Preservation:
• Left Outer Join (Customer ⟕ Orders): Returns all matching tuples from Customer and Orders PLUS all unmatched tuples from Customer (padded with NULL for Orders attributes). Customers without orders are preserved.
• Right Outer Join (Customer ⟖ Orders): Returns all matching tuples PLUS all unmatched orders (padded with NULL for customer info).
• Full Outer Join (Customer ⟗ Orders): Preserves all tuples from both relations, padding missing attributes with NULL on either side.
Why Non-loss: Standard inner joins discard tuples without matches (e.g., newly registered customers who haven't placed an order yet). Outer joins prevent information loss.

3. Natural Join via Cartesian Product:
If R(A, B, C) and S(B, C, D) share attributes {B, C}:
R ⨝ S = π_{R.A, R.B, R.C, S.D} ( σ_{R.B = S.B ∧ R.C = S.C} (R × S) )`
  },
  {
    id: 'dbms-u2-q07',
    code: 'DBMS-U2-Q07',
    unitId: 'unit-2',
    unitNumber: 2,
    unitTitle: 'UNIT II – Relational Model, Relational Algebra & Calculus',
    subject: 'DBMS',
    topic: 'Division',
    difficulty: 'Hard',
    type: 'Problem-solving',
    title: 'The Relational Algebra Division Operator (÷) for Universal Queries',
    description: 'Formulate queries requiring "FOR ALL" logic using the algebraic division operator.',
    statement: {
      context: 'Consider relations:\nTakes(StudentID, CourseID)\nCSCoreCourses(CourseID)',
      tasks: [
        '1. Explain what mathematical condition the Division operator (R ÷ S) evaluates, and specify the schemas of R, S, and the result relation.',
        '2. Write the relational algebra query to find all StudentIDs who have taken ALL courses listed in CSCoreCourses.',
        '3. Show how Division (R ÷ S) can be expressed using fundamental relational algebra operators (×, π, −).'
      ]
    },
    tip: 'Division is used for universal quantification: "find entities related to ALL items in set S".',
    expectedKeywords: ['division operator', 'universal quantification', 'cartesian product', 'set difference', 'for all'],
    sampleSolution: `1. Mathematical Definition of Division:
Let relation R have schema (A, B) and relation S have schema (B).
The division R ÷ S produces a relation with schema (A) containing all values of A that are paired with EVERY value of B present in S:
R ÷ S = { t[A] | ∀ s ∈ S, ∃ r ∈ R such that r[A] = t[A] ∧ r[B] = s[B] }

2. Query Formulation:
Takes ÷ CSCoreCourses
Result Schema: (StudentID)
Outputs the StudentIDs of students who have an entry in 'Takes' matching every CourseID present in 'CSCoreCourses'.

3. Expressing Division with Fundamental Operators:
Let R have attributes (A, B) and S have attribute (B):
Step 1: Find all possible combinations of students with all courses in S:
T1 = π_A(R) × S
Step 2: Find combinations that did NOT happen (courses the student did NOT take):
T2 = T1 − R
Step 3: Project the students who missed at least one course:
T3 = π_A(T2)
Step 4: Subtract those who missed a course from all students:
R ÷ S = π_A(R) − T3
Complete formula:
R ÷ S = π_A(R) − π_A( (π_A(R) × S) − R )`
  },
  {
    id: 'dbms-u2-q08',
    code: 'DBMS-U2-Q08',
    unitId: 'unit-2',
    unitNumber: 2,
    unitTitle: 'UNIT II – Relational Model, Relational Algebra & Calculus',
    subject: 'DBMS',
    topic: 'Examples of Relational Algebra Queries',
    difficulty: 'Hard',
    type: 'Application-based',
    title: 'Complex Relational Algebra: Sailors, Boats & Reservations',
    description: 'Solve multi-relation query formulations over the classic textbook Sailors-Boats-Reserves schema.',
    statement: {
      context: 'Given the relational schema:\nSailors(sid: integer, sname: string, rating: integer, age: real)\nBoats(bid: integer, bname: string, color: string)\nReserves(sid: integer, bid: integer, day: date)',
      tasks: [
        '1. Write a relational algebra query to find the names of sailors who have reserved at least one RED boat.',
        '2. Write a relational algebra query to find the sids of sailors who have reserved BOTH a RED boat AND a GREEN boat.',
        '3. Write a relational algebra query to find the names of sailors who have reserved ALL boats.'
      ]
    },
    tip: 'For query 2, compute sailors who reserved red, sailors who reserved green, and intersect their sids.',
    expectedKeywords: ['sailors', 'boats', 'reserves', 'relational algebra', 'natural join', 'division', 'intersection'],
    sampleSolution: `1. Sailors who reserved at least one RED boat:
Step 1: Filter red boats:
RedBoats = σ_{color = 'red'} (Boats)
Step 2: Join with Reserves and Sailors, then project sname:
π_{sname} ( Sailors ⨝ (Reserves ⨝ RedBoats) )

2. Sailors who reserved BOTH a RED boat AND a GREEN boat:
Step 1: Find sids of sailors who reserved red boats:
RedSailorIDs = π_{sid} ( Reserves ⨝ σ_{color = 'red'} (Boats) )
Step 2: Find sids of sailors who reserved green boats:
GreenSailorIDs = π_{sid} ( Reserves ⨝ σ_{color = 'green'} (Boats) )
Step 3: Intersect the two sid sets:
Result = RedSailorIDs ∩ GreenSailorIDs

3. Sailors who have reserved ALL boats:
Step 1: Project the pairs of (sid, bid) from Reserves:
SailorBoatPairs = π_{sid, bid} (Reserves)
Step 2: Project all available boat bids:
AllBoats = π_{bid} (Boats)
Step 3: Apply Division operator:
SailorsWithAll = SailorBoatPairs ÷ AllBoats
Step 4: Join with Sailors to retrieve sname:
Result = π_{sname} ( Sailors ⨝ SailorsWithAll )`
  },
  {
    id: 'dbms-u2-q09',
    code: 'DBMS-U2-Q09',
    unitId: 'unit-2',
    unitNumber: 2,
    unitTitle: 'UNIT II – Relational Model, Relational Algebra & Calculus',
    subject: 'DBMS',
    topic: 'Tuple Relational Calculus',
    difficulty: 'Medium',
    type: 'Exam-oriented',
    title: 'Tuple Relational Calculus (TRC) Formulations and Safety',
    description: 'Express queries using declarative predicate calculus and define what makes a calculus query safe.',
    statement: {
      context: 'Given the relation schema `Instructor(ID, Name, DeptName, Salary)`. TRC specifies queries declaratively as `{ t | P(t) }` without specifying the procedural procedural steps.',
      tasks: [
        '1. Write a Tuple Relational Calculus (TRC) expression to find the names of all instructors whose salary is greater than 80,000.',
        '2. Write a TRC expression to find all instructors who work in the same department as instructor "Einstein".',
        '3. Define what is meant by an Unsafe Query in relational calculus with an example, and state the Domain of Formula requirement that ensures safety.'
      ]
    },
    tip: 'Unsafe queries can generate infinite relations (e.g. { t | not (t in R) }).',
    expectedKeywords: ['tuple relational calculus', 'trc', 'predicate', 'existential quantifier', 'unsafe query', 'domain of formula'],
    sampleSolution: `1. TRC Expression for High-Salary Instructors:
{ t | ∃ i ∈ Instructor ( t[Name] = i[Name] ∧ i[Salary] > 80000 ) }
or in full tuple predicate notation:
{ t | ∃ i ( Instructor(i) ∧ t[Name] = i[Name] ∧ i[Salary] > 80000 ) }

2. Instructors in Einstein's Department:
{ t | ∃ i ∈ Instructor, ∃ e ∈ Instructor (
    Instructor(t) ∧
    e[Name] = 'Einstein' ∧
    t[DeptName] = e[DeptName] ∧
    t[Name] ≠ 'Einstein'
) }

3. Unsafe Queries and Safety Guarantee:
• Definition of Unsafe Query: A relational calculus query is unsafe if it can evaluate to an infinite number of tuples that are not bounded by constants appearing in the database or query.
  Example of Unsafe Query: { t | ¬(t ∈ Instructor) }
  This query returns all imaginable tuples in the universe that are NOT in the Instructor table, which is mathematically infinite and cannot be materialized.
• Safety Condition (Domain of Formula):
A calculus expression is guaranteed to be safe if all values appearing in the result tuple t are strictly members of the domain of the formula (dom(ψ)), which is the finite set of all constants appearing explicitly in the database relations and query predicates.`
  },
  {
    id: 'dbms-u2-q10',
    code: 'DBMS-U2-Q10',
    unitId: 'unit-2',
    unitNumber: 2,
    unitTitle: 'UNIT II – Relational Model, Relational Algebra & Calculus',
    subject: 'DBMS',
    topic: 'Introduction to Views',
    difficulty: 'Easy',
    type: 'Conceptual',
    title: 'Relational Database Views: Definition, Security & Updatability',
    description: 'Analyze virtual tables, evaluate their security advantages, and explain criteria for view updates.',
    statement: {
      context: 'In SQL/RDBMS, views act as saved query definitions presented to client applications as virtual tables.',
      tasks: [
        '1. Define a View and explain how it differs from a Base Table in terms of persistent storage.',
        '2. Explain two major advantages of views: Logical Data Independence and Role-Based Security/Access Control.',
        '3. State the necessary conditions under which an SQL view is Updatable (INSERT/UPDATE/DELETE allowed).'
      ]
    },
    tip: 'Views that contain aggregates (SUM, COUNT) or GROUP BY are not updatable.',
    expectedKeywords: ['view', 'base table', 'virtual table', 'updatable view', 'logical data independence', 'security'],
    sampleSolution: `1. View vs Base Table:
• Base Table: Physically stored on persistent disk pages with real rows, columns, and indexes.
• View: A virtual table whose contents are not materialized on disk. It stores only an SQL SELECT query definition in the system catalog. When queried, the DBMS combines the view definition with the user query via query modification (rewriting).

2. Advantages of Views:
• Role-Based Security: Restricts sensitive columns or rows from unauthorized users without modifying underlying tables.
  Example: A view 'FacultyPublic' exposing only (Name, Email, Office) while hiding (Salary, SocialSecurityNumber).
• Logical Data Independence: If the underlying base table schema changes (e.g., splitting a table), views can preserve the original schema interface, preventing client application breakage.

3. Conditions for an Updatable View:
In standard SQL, a view is updatable if modifications translate unambiguously to the underlying base table:
1. The FROM clause references exactly one base table.
2. The SELECT list does NOT contain aggregate functions (SUM, AVG, COUNT, MIN, MAX).
3. The query does NOT contain DISTINCT, GROUP BY, or HAVING clauses.
4. The query does NOT involve UNION, INTERSECT, or EXCEPT set operations.
5. All non-nullable columns of the base table are included in the view (or have DEFAULT values).`
  }
];
