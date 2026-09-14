import { TeachContent } from '../types.js';
import { TopicIntent } from './tutorEngine.js';

/**
 * Returns authentic, high-yield educational breakdowns for core university CS concepts.
 * These ensure technical accuracy, zero generic filler, and rich subject-specific diagrams and code.
 */
export function getCurriculumTopic(intent: TopicIntent): TeachContent | null {
  const lower = intent.cleanTopic.toLowerCase();

  // 1. DATABASE TRIGGERS
  if (/\b(trigger|triggers)\b/i.test(lower)) {
    return {
      topicTitle: intent.extractedTopic || 'Database Triggers (BEFORE, AFTER & INSTEAD OF)',
      simpleExplanation: {
        headline:
          'A database trigger is an event-driven procedural routine stored in the database catalog that executes automatically whenever a specified Data Manipulation Language (DML) event—INSERT, UPDATE, or DELETE—occurs on a table or view.',
        paragraphs: [
          'Triggers follow the Event-Condition-Action (ECA) architectural pattern. Unlike stored procedures which must be called explicitly by application code, triggers fire implicitly within the database transaction lifecycle. The database engine monitors table modifications and synchronously invokes the trigger function when matching events take place.',
          'Relational database engines categorize triggers by timing and target: BEFORE triggers execute before the proposed row modification is written to disk storage (ideal for input validation, sanitization, and pre-computing default fields), AFTER triggers execute immediately after the physical row write (ideal for append-only audit ledgers, change notifications, and synchronizing secondary tables), and INSTEAD OF triggers intercept modifications on complex non-updatable views to perform custom routing.',
          'Within trigger logic, engineers access row state through transition pseudo-records: OLD contains the existing column values before the modification (available during UPDATE and DELETE), while NEW contains proposed incoming values (available during INSERT and UPDATE). Because triggers execute within the initiating transaction, raising an unhandled exception inside a trigger automatically rolls back the entire transaction.',
        ],
        keyPoints: [
          'DML Trigger Events: Fires automatically on INSERT, UPDATE, or DELETE events without explicit client calls.',
          'Execution Timings: BEFORE (input validation and value modification), AFTER (audit trails and external notifications), INSTEAD OF (routing updates on views).',
          'Row-Level vs Statement-Level: FOR EACH ROW executes once per modified tuple; FOR EACH STATEMENT executes once per query regardless of row count.',
          'Transition Variables: Inspect historical data via OLD.column and incoming data via NEW.column.',
          'Transactional Safety: Triggers participate directly in the parent ACID transaction; any trigger error causes an atomic rollback.',
        ],
        rulesOfThumb: [
          {
            label: 'Keep Triggers Lightweight',
            rule: 'Avoid complex cross-table joins, heavy string processing, or remote HTTP calls inside triggers, as they block the client transaction synchronously.',
          },
          {
            label: 'Guard Against Cascades',
            rule: 'Never allow Trigger A on Table 1 to update Table 2 if Table 2 has a trigger updating Table 1, which causes an infinite recursive loop.',
          },
          {
            label: 'The Audit Trail Pattern',
            rule: 'Use AFTER UPDATE triggers to record tamper-proof audit history (logging who changed which row, when, and prior values) that application code cannot bypass.',
          },
        ],
      },
      realWorldAnalogy: {
        analogyTitle: 'The Automated Bank Teller Counterfeit Scanner',
        story:
          'Imagine a teller window at a high-security bank. When a customer hands over cash for deposit, an automated ultraviolet scanner scans every bill before it enters the cash drawer. If a counterfeit note is spotted, the machine immediately beeps and rejects the deposit on the spot (a BEFORE trigger). Once genuine bills are safely inside the vault safe, an automated receipt is printed and a high-resolution snapshot is logged to the bank security audit server (an AFTER trigger). The teller does not have to remember to perform these safety steps—the checks are hardwired directly into the cash drawer mechanism.',
        breakdownPoints: [
          {
            title: 'Cash Deposit (DML Event)',
            description: 'The customer depositing cash represents an INSERT or UPDATE query on an account balance.',
          },
          {
            title: 'UV Scanner (BEFORE Trigger)',
            description: 'Validates input before it touches permanent storage, rejecting invalid transactions before damage occurs.',
          },
          {
            title: 'Security Vault Log (AFTER Trigger)',
            description: 'Captures permanent audit history and telemetry after the physical bills are safely locked inside.',
          },
        ],
        solutionTakeaway:
          'Triggers eliminate human error by baking validation and auditing directly into the database engine rather than trusting client-side applications to remember them.',
      },
      visualExplanation: {
        subtitle: 'Database Trigger Execution Lifecycle: BEFORE vs AFTER',
        diagramAscii: `    [ CLIENT APPLICATION ]  ---> Sends: UPDATE employees SET salary = 95000 ...
              |
              v
+-------------------------------------------------------------+
| 1. BEFORE UPDATE TRIGGER                                    |
|    - Inspects OLD.salary ($80,000) & NEW.salary ($95,000)   |
|    - Validates business rules (e.g. check NEW.salary > 0)   |
|    - If rule fails: RAISE EXCEPTION & ROLLBACK              |
+-------------------------------------------------------------+
              |  (Passed Validation)
              v
+-------------------------------------------------------------+
| 2. ROW-LEVEL STORAGE ENGINE WRITE                           |
|    - Updates row data on disk buffer page                   |
|    - Records modification to Write-Ahead Log (WAL)          |
+-------------------------------------------------------------+
              |  (Row Written to Disk)
              v
+-------------------------------------------------------------+
| 3. AFTER UPDATE TRIGGER                                     |
|    - Inserts historical audit record into salary_audit_log  |
|    - Captures: emp_id, old_salary, new_salary, NOW(), USER  |
+-------------------------------------------------------------+
              |
              v
[ TRANSACTION COMMIT & SUCCESS ACK RETURNED TO CLIENT ]`,
        diagramExplanation:
          'This architectural pipeline illustrates how the DBMS engine sandwiches physical storage updates between BEFORE triggers (for input validation and alteration) and AFTER triggers (for audit logging).',
        visualBlocks: [
          {
            title: 'OLD vs NEW Transition State Availability',
            codeOrSchema:
              'INSERT: NEW is populated, OLD is NULL\nUPDATE: Both OLD (prior state) and NEW (incoming state) are available\nDELETE: OLD is populated, NEW is NULL',
            annotation: 'Available within FOR EACH ROW trigger procedures.',
          },
        ],
      },
      simpleExample: {
        subtitle: 'Production PostgreSQL / MySQL Trigger for Salary Auditing',
        context:
          'We create an employee table and attach a trigger that enforces salary rules and automatically records every adjustment into a dedicated audit ledger.',
        codeOrData: `-- 1. Base table and audit ledger
CREATE TABLE employees (
    emp_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    salary NUMERIC(10, 2) NOT NULL CHECK (salary >= 0)
);

CREATE TABLE salary_audit_log (
    audit_id SERIAL PRIMARY KEY,
    emp_id INT NOT NULL,
    old_salary NUMERIC(10, 2),
    new_salary NUMERIC(10, 2),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by VARCHAR(50) DEFAULT CURRENT_USER
);

-- 2. Trigger function to validate bounds and log change
CREATE OR REPLACE FUNCTION process_salary_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Reject single-step salary cuts over 50%
    IF NEW.salary < (OLD.salary * 0.50) THEN
        RAISE EXCEPTION 'Salary cut cannot exceed 50%% in a single update.';
    END IF;

    -- Record immutable audit log
    INSERT INTO salary_audit_log (emp_id, old_salary, new_salary)
    VALUES (OLD.emp_id, OLD.salary, NEW.salary);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Attach trigger to employees table
CREATE TRIGGER trg_salary_audit
BEFORE UPDATE OF salary ON employees
FOR EACH ROW
EXECUTE FUNCTION process_salary_update();`,
        stepsOrBreakdown: [
          '1. An UPDATE query modifies an employee salary column.',
          '2. The DBMS pauses execution and invokes process_salary_update() for each updated tuple.',
          '3. The function checks NEW.salary against OLD.salary; if invalid, an exception aborts the update.',
          '4. If valid, an audit row is appended to salary_audit_log with prior and new values.',
          '5. The row write commits atomically with the audit log in a single transaction.',
        ],
        conclusion:
          'Because the trigger is wired directly into the database catalog, audit records can never be skipped or bypassed, even when updating data via direct SQL scripts.',
      },
      checkUnderstanding: {
        question: 'In a relational database, which pseudo-record is accessible during an INSERT trigger?',
        options: [
          'NEW only, because no prior record existed before the INSERT',
          'OLD only, because the new row has not yet been committed to disk',
          'Both OLD and NEW with identical column values',
          'Neither, triggers cannot inspect row column data directly',
        ],
        correctIndex: 0,
        explanation:
          'Option 0 is correct: During an INSERT event, only NEW is accessible because the row is brand new and has no previous state. During an UPDATE, both OLD and NEW are available. During a DELETE, only OLD is accessible.',
      },
      alternateExplanation: {
        title: 'The Invisible Tripwire Mental Model',
        text: 'Think of a trigger as an invisible tripwire attached directly to a database table. The moment an INSERT, UPDATE, or DELETE steps over that tripwire, the database pauses the operation, runs your custom safety logic, and only lets the query finish if all checks pass.',
      },
    };
  }

  // 2. DATABASE NORMALIZATION
  if (lower.includes('normaliz') || lower.includes('normalis') || /\b(1nf|2nf|3nf|bcnf|normal\s*form)\b/i.test(lower)) {
    return {
      topicTitle: intent.extractedTopic || 'Database Normalization (1NF, 2NF, 3NF & BCNF)',
      simpleExplanation: {
        headline:
          'Database normalization is the systematic technique of organizing relational database schemas to eliminate data redundancy and prevent insertion, update, and deletion anomalies through functional dependency analysis.',
        paragraphs: [
          'In poorly designed relational schemas, storing related facts in a single wide table causes data redundancy. When the same customer address or course title is duplicated across hundreds of rows, any update requires modifying every copy. If a single row is missed, data becomes inconsistent. Normalization breaks large unnormalized tables into smaller, cohesive relations connected via foreign keys.',
          'Normalization progresses through progressive stages called Normal Forms: 1NF (First Normal Form) ensures atomic column values with no repeating groups or comma-separated lists; 2NF (Second Normal Form) requires 1NF and removes partial dependencies, ensuring every non-prime attribute depends on the whole primary key (critical when using composite keys); 3NF (Third Normal Form) requires 2NF and removes transitive dependencies, ensuring non-prime attributes depend ONLY on candidate keys; and BCNF (Boyce-Codd Normal Form) strictly enforces that every determinant must be a candidate key.',
          'Normalizing to 3NF or BCNF eliminates three major data corruption vectors: Insertion Anomalies (inability to record a fact without creating an unrelated entity), Deletion Anomalies (unintentionally losing critical data when deleting a related record), and Update Anomalies (inconsistent state caused by updating only some duplicates).',
        ],
        keyPoints: [
          'Primary Goal: Eliminates duplicate data and protects referential integrity against data corruption.',
          '1NF (Atomicity): Every cell contains exactly one scalar value; no multi-valued attributes or repeating groups.',
          '2NF (Full Functional Dependency): No non-key column may depend on only part of a composite primary key.',
          '3NF (No Transitive Dependencies): Non-key columns must depend strictly on the primary key, never on other non-key columns.',
          'BCNF (Boyce-Codd): A stricter version of 3NF where every functional determinant (X in X -> Y) must be a candidate key.',
        ],
        rulesOfThumb: [
          {
            label: 'The 3NF Mantra',
            rule: 'Every non-key attribute must provide a fact about "the key, the whole key, and nothing but the key, so help me Codd".',
          },
          {
            label: 'When to Denormalize',
            rule: 'In OLTP (transactional) systems, normalize to 3NF/BCNF. In OLAP (read-heavy reporting/data warehousing) systems, selective denormalization (star schema) is acceptable for query speed.',
          },
          {
            label: 'Spotting 2NF Violations',
            rule: 'If your table has a composite primary key (e.g. {StudentID, CourseID}) and an attribute depends on only StudentID (like StudentName), 2NF is violated.',
          },
        ],
      },
      realWorldAnalogy: {
        analogyTitle: 'The Messy Junk Drawer vs Labeled Tool Organizers',
        story:
          'Imagine keeping all your tools, nails, screws, and paint cans tossed into one giant wooden crate. Whenever you buy a new box of screws, you have to write down the store address on a tag attached to every single screw. If the hardware store changes its phone number, you have to find and update 500 individual tags! If you use your last screw, you throw away the tag and accidentally delete the store address forever (a deletion anomaly). Normalization is like organizing that mess into labeled toolboxes: one bin holds screws, a separate catalog lists hardware stores, and each screw bin simply has a label referencing Store #4.',
        breakdownPoints: [
          {
            title: 'The Junk Crate (Unnormalized Table)',
            description: 'Mixing student info, course info, and instructor phone numbers into one wide table.',
          },
          {
            title: 'Dedicated Bins (Normalized Relations)',
            description: 'Separate tables for Students, Courses, and Instructors, each storing facts about only that entity.',
          },
          {
            title: 'Bin Labels (Foreign Keys)',
            description: 'Clean integer IDs connecting enrollments to students and courses without duplicating names.',
          },
        ],
        solutionTakeaway:
          'Store each fact in exactly one place. When information changes, you update a single row, and the rest of the database automatically reflects the update.',
      },
      visualExplanation: {
        subtitle: 'Progressive Normalization Pipeline: Unnormalized to 3NF',
        diagramAscii: `UNNORMALIZED TABLE (Redundant Data & Multiple Anomalies):
[ StudentID | Name   | CourseID | CourseName | Instructor | InstOffice ]
   101      | Alice  | CS101    | Databases  | Dr. Stone  | Hall 302
   101      | Alice  | CS102    | Algorithms | Dr. Vance  | Hall 108  <-- Alice duplicated!

STEP 1: FIRST NORMAL FORM (1NF)
- Enforce atomic values per cell (no lists like "CS101, CS102" in one cell).
- Define composite primary key: {StudentID, CourseID}.

STEP 2: SECOND NORMAL FORM (2NF) - Eliminate Partial Dependencies
- Name depends only on StudentID (partial dependency on composite key).
- Split into:
  * STUDENTS(StudentID [PK], Name)
  * STUDENT_COURSES(StudentID [FK], CourseID [FK], Grade)
  * COURSES(CourseID [PK], CourseName, Instructor, InstOffice)

STEP 3: THIRD NORMAL FORM (3NF) - Eliminate Transitive Dependencies
- In COURSES: InstOffice depends on Instructor, which depends on CourseID.
- Split into:
  * COURSES(CourseID [PK], CourseName, InstructorID [FK])
  * INSTRUCTORS(InstructorID [PK], InstructorName, OfficeRoom)`,
        diagramExplanation:
          'By decomposing tables along functional dependency boundaries, each entity manages only its own attributes, eliminating duplicate data.',
        visualBlocks: [
          {
            title: 'The Three Relational Anomalies',
            codeOrSchema:
              'Insertion Anomaly: Cannot add an Instructor until they teach a Course.\nUpdate Anomaly: Changing an Instructor office requires updating 200 course rows.\nDeletion Anomaly: Deleting the only student enrolled in a course deletes the course entirely.',
            annotation: 'Normalization to 3NF completely resolves all three anomalies.',
          },
        ],
      },
      simpleExample: {
        subtitle: 'Transforming an Unnormalized Table into Clean 3NF Relations',
        context:
          'Here is the SQL schema demonstrating the decomposed 3NF structure replacing a messy single table.',
        codeOrData: `-- Normalized 3NF Schema

-- Table 1: Student Entity (Non-key columns depend only on student_id)
CREATE TABLE students (
    student_id INT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

-- Table 2: Instructor Entity (Separated to eliminate transitive dependency)
CREATE TABLE instructors (
    instructor_id INT PRIMARY KEY,
    instructor_name VARCHAR(100) NOT NULL,
    office_room VARCHAR(20) NOT NULL
);

-- Table 3: Course Entity (References Instructor via Foreign Key)
CREATE TABLE courses (
    course_id VARCHAR(10) PRIMARY KEY,
    course_title VARCHAR(100) NOT NULL,
    instructor_id INT NOT NULL,
    FOREIGN KEY (instructor_id) REFERENCES instructors(instructor_id)
);

-- Table 4: Enrollment Junction (Composite Key with no partial dependencies)
CREATE TABLE enrollments (
    student_id INT NOT NULL,
    course_id VARCHAR(10) NOT NULL,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    grade CHAR(2),
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);`,
        stepsOrBreakdown: [
          '1. Student details are stored once in the students table.',
          '2. Instructor office rooms depend strictly on instructor_id, preventing duplicate instructor data across courses.',
          '3. The enrollments table links students and courses using clean foreign keys.',
          '4. If an instructor changes offices, we update exactly one row in instructors, preventing update anomalies.',
        ],
        conclusion:
          'This 3NF schema prevents orphan records, eliminates data duplication, and ensures maximum database consistency.',
      },
      checkUnderstanding: {
        question:
          'Which normal form specifically requires eliminating transitive dependencies where a non-prime attribute depends on another non-prime attribute?',
        options: [
          'Third Normal Form (3NF)',
          'First Normal Form (1NF)',
          'Second Normal Form (2NF)',
          'Boyce-Codd Normal Form (BCNF)',
        ],
        correctIndex: 0,
        explanation:
          'Option 0 is correct: 3NF requires that a relation is in 2NF and that no non-prime attribute is transitively dependent on any candidate key (X -> Y and Y -> Z where Z is non-prime). 1NF handles atomicity, and 2NF handles partial key dependencies.',
      },
      alternateExplanation: {
        title: 'The Single Source of Truth Mental Model',
        text: 'Normalization is simply the rule of "One Fact in One Place". If a phone number changes, you should only ever have to update a single row in the entire database. If you have to write an UPDATE statement that touches multiple rows to change one real-world fact, your schema is not normalized.',
      },
    };
  }

  // 3. SQL JOINS
  if (/\b(sql\s*join|joins|inner\s*join|outer\s*join)\b/i.test(lower)) {
    return {
      topicTitle: intent.extractedTopic || 'SQL Joins (INNER, LEFT, RIGHT & FULL OUTER)',
      simpleExplanation: {
        headline:
          'An SQL JOIN clause combines rows from two or more database tables based on a related column between them, allowing relational databases to reconstruct complete entities from normalized tables.',
        paragraphs: [
          'Because normalized database schemas store distinct entities in separate tables (such as customers in one table and their orders in another), queries must join these tables together to produce meaningful reports. An SQL JOIN matches rows using a conditional join predicate (usually specified in the ON clause) that compares foreign keys to primary keys.',
          'Relational SQL provides four fundamental join types: INNER JOIN returns only records that have matching values in both tables; LEFT OUTER JOIN returns all records from the left table and matched records from the right table (filling right-side columns with NULL when no match exists); RIGHT OUTER JOIN returns all records from the right table and matching records from the left; and FULL OUTER JOIN returns all records whenever there is a match in either the left or right table.',
          'Under the hood, database query optimizers execute joins using specialized algorithms based on data volume and index availability: Nested Loop Join (efficient when one table is small and the other is indexed), Hash Join (optimal for large unindexed datasets where an in-memory hash table is built), and Sort-Merge Join (fast when both tables are already sorted on the join key).',
        ],
        keyPoints: [
          'INNER JOIN: Intersection of both tables; records without matches on either side are excluded.',
          'LEFT JOIN: Preserves all left table rows; unmatched right columns evaluate to NULL.',
          'RIGHT JOIN: Preserves all right table rows; unmatched left columns evaluate to NULL.',
          'FULL OUTER JOIN: Union of all records from both tables; missing matches on either side produce NULLs.',
          'CROSS JOIN: Computes the Cartesian product (M * N rows), matching every left row with every right row.',
        ],
        rulesOfThumb: [
          {
            label: 'Always Index Join Keys',
            rule: 'Ensure foreign keys in the joining table have an index. Without indexes, the query engine must perform expensive sequential table scans.',
          },
          {
            label: 'ON vs WHERE Filtering',
            rule: 'In a LEFT JOIN, conditions in the ON clause control how rows match; conditions in the WHERE clause filter after joining (which can accidentally turn a LEFT JOIN into an INNER JOIN if you check right-side columns for NOT NULL).',
          },
          {
            label: 'Default to INNER JOIN',
            rule: 'Use INNER JOIN unless you explicitly need to include entities that have no associated child records (e.g. customers with zero orders).',
          },
        ],
      },
      realWorldAnalogy: {
        analogyTitle: 'The VIP Party Guest List vs The Coat Check Room',
        story:
          'Imagine an exclusive party. Table A is the official Guest List (names of invited people). Table B is the Coat Check Ledger (tickets and coats). An INNER JOIN is the list of people who are currently inside holding a checked coat—both their name is on the guest list and they have a checked coat ticket. A LEFT JOIN is everyone on the guest list: those who checked a coat have their ticket number displayed, while those who came without a coat have NULL listed next to their name. A FULL OUTER JOIN lists all invited guests PLUS any unclaimed coats left in the coat check room by uninvited visitors.',
        breakdownPoints: [
          {
            title: 'Guest List (Left Table)',
            description: 'The master entity list that you want to examine (e.g. Customers).',
          },
          {
            title: 'Coat Check (Right Table)',
            description: 'The secondary associated records that may or may not exist for each guest (e.g. Orders).',
          },
          {
            title: 'Unchecked Coat (NULL value)',
            description: 'Represents the absence of matching child records in a LEFT or FULL OUTER JOIN.',
          },
        ],
        solutionTakeaway:
          'Joins let you inspect relationships between separate tables without forcing you to merge them into one messy list.',
      },
      visualExplanation: {
        subtitle: 'SQL Join Venn Diagram and Row Matching Matrix',
        diagramAscii: `TABLE A (Customers)              TABLE B (Orders)
+---------+----------+           +----------+---------+--------+
| cust_id | name     |           | order_id | cust_id | total  |
+---------+----------+           +----------+---------+--------+
| 1       | Alice    |           | 101      | 1       | $50.00 |
| 2       | Bob      |           | 102      | 1       | $30.00 |
| 3       | Charlie  |           | 103      | 2       | $99.00 |
+---------+----------+           +----------+---------+--------+
(Note: Charlie has 0 orders)     (Note: No order exists for cust 3)

1. INNER JOIN (Only customers with matching orders):
+---------+----------+----------+--------+
| cust_id | name     | order_id | total  |
+---------+----------+----------+--------+
| 1       | Alice    | 101      | $50.00 |
| 1       | Alice    | 102      | $30.00 |
| 2       | Bob      | 103      | $99.00 |
+---------+----------+----------+--------+  (Charlie excluded!)

2. LEFT OUTER JOIN (All customers, with NULL if no order):
+---------+----------+----------+--------+
| cust_id | name     | order_id | total  |
+---------+----------+----------+--------+
| 1       | Alice    | 101      | $50.00 |
| 1       | Alice    | 102      | $30.00 |
| 2       | Bob      | 103      | $99.00 |
| 3       | Charlie  | NULL     | NULL   |  <-- Charlie preserved!
+---------+----------+----------+--------+`,
        diagramExplanation:
          'INNER JOIN keeps only rows where keys match in both tables. LEFT JOIN preserves every row from the left table, injecting NULLs where no right table record matches.',
        visualBlocks: [
          {
            title: 'Join Syntax Cheat Sheet',
            codeOrSchema:
              'SELECT c.name, o.total\nFROM customers c\nINNER JOIN orders o ON c.cust_id = o.cust_id;\n\nSELECT c.name, o.total\nFROM customers c\nLEFT JOIN orders o ON c.cust_id = o.cust_id;',
            annotation: 'Always match primary key to foreign key in the ON condition.',
          },
        ],
      },
      simpleExample: {
        subtitle: 'Practical Query: Finding Customers with and without Orders',
        context:
          'Here is how you write real SQL joins to answer business questions like "Which customers have never placed an order?"',
        codeOrData: `-- 1. Find all customers and their order totals (LEFT JOIN)
SELECT 
    c.cust_id,
    c.name,
    COALESCE(SUM(o.total), 0.00) AS total_spent
FROM customers c
LEFT JOIN orders o ON c.cust_id = o.cust_id
GROUP BY c.cust_id, c.name
ORDER BY total_spent DESC;

-- 2. Anti-Join: Find customers who have NEVER placed an order
SELECT 
    c.cust_id,
    c.name
FROM customers c
LEFT JOIN orders o ON c.cust_id = o.cust_id
WHERE o.order_id IS NULL;`,
        stepsOrBreakdown: [
          '1. The query starts with the customers table as the left source.',
          '2. The LEFT JOIN connects matching records from orders on cust_id.',
          '3. For customers with zero orders, order_id and total evaluate to NULL.',
          '4. Checking WHERE o.order_id IS NULL cleanly identifies customers who have never bought anything.',
        ],
        conclusion:
          'LEFT JOIN combined with an IS NULL filter is the standard, high-performance pattern for identifying inactive records across relational tables.',
      },
      checkUnderstanding: {
        question:
          'In a LEFT OUTER JOIN between Table A (left) and Table B (right), what appears in the columns of Table B when a row in Table A has no match?',
        options: [
          'NULL values for all Table B columns',
          'Empty strings ("") or numerical zeroes (0)',
          'The query throws a foreign key violation runtime exception',
          'The unmatched row from Table A is silently dropped from the result',
        ],
        correctIndex: 0,
        explanation:
          'Option 0 is correct: By definition, a LEFT OUTER JOIN preserves all records from the left table and populates missing right-side attributes with NULL. If unmatched rows were dropped, it would be an INNER JOIN.',
      },
      alternateExplanation: {
        title: 'The Two-Circle Venn Diagram Shortcut',
        text: 'Picture two overlapping circles, A and B. INNER JOIN is only the football-shaped overlap in the middle. LEFT JOIN is the entire circle A, including both the overlap and the un-overlapped left crescent. FULL JOIN is both circles combined.',
      },
    };
  }

  // 4. JAVA POLYMORPHISM
  if (/\b(polymorph|polymorphism|overload|override)\b/i.test(lower)) {
    return {
      topicTitle: intent.extractedTopic || 'Polymorphism in Java (Compile-Time vs Runtime)',
      simpleExplanation: {
        headline:
          'Polymorphism in Object-Oriented Programming is the ability of an entity (such as a variable, function, or object) to take on multiple forms, enabling uniform interfaces for handling different underlying data types.',
        paragraphs: [
          'In Java, polymorphism is divided into two fundamental mechanisms: Compile-Time (Static) Polymorphism and Runtime (Dynamic) Polymorphism. Compile-time polymorphism is achieved through Method Overloading, where multiple methods share the same name within the same class but differ in parameter counts, types, or order. The Java compiler determines which method to invoke during compilation based strictly on the argument signature.',
          'Runtime Polymorphism is achieved through Method Overriding, where a subclass provides its own specific implementation of a method already declared in its parent class or interface. The method call is resolved dynamically at runtime through dynamic method dispatch, using the actual object instance referenced in memory rather than the declared reference type.',
          'Under the hood, the Java Virtual Machine (JVM) executes runtime polymorphism using a Virtual Method Table (vtable). Each class has an internal vtable indexing method pointers. When `parentRef.render()` is invoked, the JVM looks up the vtable of the concrete runtime class (e.g. Circle or Square) and executes that specific bytecode instruction.',
        ],
        keyPoints: [
          'Two Flavors: Compile-Time (Method Overloading) vs Runtime (Method Overriding).',
          'Method Overloading: Same method name, different parameter signature; resolved by javac compiler.',
          'Method Overriding: Same signature in subclass with @Override; resolved dynamically at runtime by the JVM.',
          'Dynamic Method Dispatch: Invocation is determined by the object in heap memory, not the reference variable type.',
          'The vtable: The JVM internal lookup table that resolves overridden method pointers at runtime.',
        ],
        rulesOfThumb: [
          {
            label: 'Always Use @Override',
            rule: 'Always annotate overridden methods with @Override. This forces the compiler to catch typos in method names or parameter types.',
          },
          {
            label: 'Program to Interfaces',
            rule: 'Declare reference variables using interfaces or abstract base classes (e.g. List<String> list = new ArrayList<>()) to write flexible, polymorphic code.',
          },
          {
            label: 'Static Methods Cannot Be Overridden',
            rule: 'Static methods belong to the class, not instances; declaring a static method with the same signature in a subclass results in method hiding, not polymorphism.',
          },
        ],
      },
      realWorldAnalogy: {
        analogyTitle: 'The Universal TV Remote Control',
        story:
          'Imagine holding a universal remote control. On the remote, there is a single button labeled "Power On". You do not need a different remote for your Samsung TV, your Sony Soundbar, and your Apple TV. You point the remote and press "Power On". The Samsung TV powers on by turning on its OLED display; the Soundbar powers on by engaging its audio amplifier; the Apple TV boots its operating system. The interface is identical ("Power On"), but the concrete behavior is determined entirely by the device receiving the signal.',
        breakdownPoints: [
          {
            title: 'The Remote Button (Interface/Base Class)',
            description: 'Declares the uniform contract (e.g. void powerOn()).',
          },
          {
            title: 'Concrete Devices (Subclasses)',
            description: 'SamsungTV, SonySoundbar, and AppleTV each implement powerOn() differently.',
          },
          {
            title: 'Signal Transmission (Dynamic Dispatch)',
            description: 'The receiver executes its own internal circuitry based on its actual hardware identity.',
          },
        ],
        solutionTakeaway:
          'Polymorphism lets calling code issue simple commands without needing to know or care which concrete subclass is executing them.',
      },
      visualExplanation: {
        subtitle: 'Compile-Time vs Runtime Polymorphism in Java',
        diagramAscii: `1. COMPILE-TIME (METHOD OVERLOADING):
   class Calculator {
       int add(int a, int b)       <-- Compiler selects based on 2 ints
       double add(double a, double b) <-- Compiler selects based on 2 doubles
   }
   Resolved by: javac compiler at compile-time.

2. RUNTIME (METHOD OVERRIDING & DYNAMIC DISPATCH):
   Shape shapeRef;  // Reference of type Shape

   shapeRef = new Circle();   // Heap object is Circle
   shapeRef.draw();           // Calls Circle.draw()

   shapeRef = new Square();   // Heap object is Square
   shapeRef.draw();           // Calls Square.draw()

   JVM MEMORY LAYOUT & VTABLE:
   [ Stack Reference: shapeRef ] ---> [ Heap Object: new Circle() ]
                                                 |
                                                 v
                                    [ Circle vtable Pointer ]
                                    - draw() -> &Circle::draw()
                                    - area() -> &Circle::area()`,
        diagramExplanation:
          'The compiler verifies that Shape has a draw() method, but the JVM resolves which concrete draw() method runs based on the actual object in heap memory.',
        visualBlocks: [
          {
            title: 'Dynamic Method Dispatch Rule',
            codeOrSchema:
              'Parent obj = new Child();\nobj.someMethod(); // Executes Child.someMethod() if overridden!',
            annotation: 'Method resolution is dynamic; field resolution is static (fields are never polymorphic).',
          },
        ],
      },
      simpleExample: {
        subtitle: 'Authentic Java Implementation: Polymorphic Payment Processing',
        context:
          'Demonstrating runtime polymorphism using an abstract PaymentMethod base and multiple concrete payment channels.',
        codeOrData: `// 1. Base abstraction
public abstract class PaymentMethod {
    protected String accountId;

    public PaymentMethod(String accountId) {
        this.accountId = accountId;
    }

    // Abstract method to be overridden polymorphically
    public abstract void processPayment(double amount);
}

// 2. Concrete Subclass A
public class CreditCardPayment extends PaymentMethod {
    public CreditCardPayment(String cardNumber) {
        super(cardNumber);
    }

    @Override
    public void processPayment(double amount) {
        System.out.printf("Processing $%.2f via Credit Card Network for account %s\\n", amount, accountId);
    }
}

// 3. Concrete Subclass B
public class CryptoPayment extends PaymentMethod {
    public CryptoPayment(String walletAddress) {
        super(walletAddress);
    }

    @Override
    public void processPayment(double amount) {
        System.out.printf("Broadcasting $%.2f transaction to Blockchain wallet %s\\n", amount, accountId);
    }
}

// 4. Polymorphic client execution
public class CheckoutService {
    public static void main(String[] args) {
        // Uniform list of payment methods
        List<PaymentMethod> methods = List.of(
            new CreditCardPayment("4111-XXXX-XXXX-1234"),
            new CryptoPayment("0x71C...B29")
        );

        // Polymorphic invocation: each object behaves according to its true type
        for (PaymentMethod pm : methods) {
            pm.processPayment(150.00);
        }
    }
}`,
        stepsOrBreakdown: [
          '1. PaymentMethod defines the abstract processPayment contract.',
          '2. CreditCardPayment and CryptoPayment implement their own business logic.',
          '3. The CheckoutService loops through a collection of PaymentMethod references.',
          '4. The JVM looks up the vtable of each concrete object and runs the correct payment processor.',
        ],
        conclusion:
          'Adding a new payment provider (e.g. PayPal) requires zero changes to the CheckoutService loop, satisfying the Open-Closed Principle.',
      },
      checkUnderstanding: {
        question:
          'Given the code "Shape s = new Circle(); s.draw();", how does Java determine which draw() method to execute at runtime?',
        options: [
          'The JVM inspects the actual object type in heap memory (Circle) and invokes its draw() method via dynamic method dispatch',
          'The compiler forces the draw() method in Shape to run because s is declared as Shape',
          'Java randomly picks between Shape and Circle depending on thread availability',
          'Method calls cannot be resolved dynamically in Java without reflection',
        ],
        correctIndex: 0,
        explanation:
          'Option 0 is correct: In Java, method calls on objects are virtual by default. The reference type (Shape) is checked at compile-time, but at runtime the JVM inspects the concrete instance on the heap (Circle) and dynamically dispatches to Circle.draw().',
      },
      alternateExplanation: {
        title: 'The Actor and the Script Mental Model',
        text: 'Think of the reference variable as a character script (e.g. "Hamlet"), and the object instance as the actor playing the role. The script says "speak the lines", but each individual actor (whether Laurence Olivier or Kenneth Branagh) delivers those lines in their own unique voice and style.',
      },
    };
  }

  // 5. DIJKSTRA'S ALGORITHM
  if (/\b(dijkstra|shortest\s*path)\b/i.test(lower)) {
    return {
      topicTitle: intent.extractedTopic || "Dijkstra's Shortest Path Algorithm",
      simpleExplanation: {
        headline:
          "Dijkstra's Algorithm is a greedy graph search algorithm that finds the shortest path from a single source vertex to all other vertices in a weighted graph with non-negative edge weights.",
        paragraphs: [
          "Developed by computer scientist Edsger Dijkstra in 1956, this algorithm solves the single-source shortest path problem. It operates by maintaining a set of visited nodes and a priority queue (min-heap) of tentative distances from the source node to every other node in the graph.",
          "At each step, Dijkstra's algorithm selects the unvisited node with the smallest tentative distance, marks it as visited (finalizing its shortest path), and 'relaxes' all of its outgoing edges. Relaxation evaluates whether traveling through the newly visited node provides a shorter route to its neighbors than previously recorded: if `dist[u] + weight(u, v) < dist[v]`, the algorithm updates `dist[v]` to this new lower value.",
          "A crucial mathematical prerequisite of Dijkstra's algorithm is that all edge weights must be non-negative. If a graph contains negative edge weights, Dijkstra's greedy assumption—that visiting a node permanently finalizes its shortest path—breaks down, and algorithms such as Bellman-Ford or Floyd-Warshall must be used instead.",
        ],
        keyPoints: [
          'Problem Class: Single-Source Shortest Path (SSSP) on weighted directed or undirected graphs.',
          'Core Strategy: Greedy algorithm that always expands the closest unvisited vertex first.',
          'Critical Constraint: Edge weights MUST be non-negative (>= 0). Fails on negative edge cycles.',
          'Time Complexity: O((V + E) log V) using a min-heap priority queue; O(V^2) with a simple adjacency matrix.',
          'Space Complexity: O(V) to store distance arrays and priority queue elements.',
        ],
        rulesOfThumb: [
          {
            label: 'Negative Weights Warning',
            rule: 'If edge weights can be negative, do not use Dijkstra; use the Bellman-Ford algorithm instead (O(V * E)).',
          },
          {
            label: 'Priority Queue Implementation',
            rule: 'Always implement Dijkstra with a Min-Heap (PriorityQueue in Java / C++ std::priority_queue) to achieve O((V + E) log V) performance.',
          },
          {
            label: 'Early Exit for Single Target',
            rule: 'If you only need the distance to one specific target node, you can safely terminate the loop the moment the target node is extracted from the min-heap.',
          },
        ],
      },
      realWorldAnalogy: {
        analogyTitle: 'Water Flowing Through an Irrigation Canal Network',
        story:
          'Imagine a network of dry irrigation canals connecting farmland villages. The canal lengths represent edge weights. If you open a water dam at village A (the source), water spreads outward simultaneously along all connected canals at a constant speed. The first village to receive water is guaranteed to be the closest village to village A. As water reaches each new junction, it branches out along connected canals. Because water can never travel backwards in time (equivalent to non-negative edge weights), the moment water first reaches any village, that arrival time is strictly the shortest possible path.',
        breakdownPoints: [
          {
            title: 'The Water Dam (Source Node)',
            description: 'The starting vertex where tentative distance begins at 0.',
          },
          {
            title: 'Canal Lengths (Edge Weights)',
            description: 'Physical distances or travel costs between interconnected vertices.',
          },
          {
            title: 'Water Arrival Time (Shortest Path Distance)',
            description: 'The earliest possible time water can reach each junction constitutes its optimal path.',
          },
        ],
        solutionTakeaway:
          'Dijkstra works like expanding ripples of water: it always reaches the nearest points first and expands outward systematically.',
      },
      visualExplanation: {
        subtitle: "Dijkstra's Algorithm Edge Relaxation and Min-Heap Traversal",
        diagramAscii: `GRAPH TOPOLOGY:
          (B)
        /2   \\1
      (A)     (D)
        \\4   /3
          (C)

Distance Array: dist[A]=0, dist[B]=inf, dist[C]=inf, dist[D]=inf
Priority Queue (Min-Heap): [(0, A)]

STEP 1: Pop A (dist=0). Neighbors are B and C.
- Relax A -> B: 0 + 2 < inf => dist[B] = 2. Push (2, B)
- Relax A -> C: 0 + 4 < inf => dist[C] = 4. Push (4, C)
Visited: {A}

STEP 2: Pop B (dist=2). Neighbors are D.
- Relax B -> D: 2 + 1 < inf => dist[D] = 3. Push (3, D)
Visited: {A, B}

STEP 3: Pop D (dist=3). No unvisited neighbors.
Visited: {A, B, D}

STEP 4: Pop C (dist=4). C -> D: 4 + 3 = 7 > dist[D] (3) -> No update!
Visited: {A, B, D, C}

FINAL SHORTEST DISTANCES FROM A:
A: 0 | B: 2 | C: 4 | D: 3 (Path: A -> B -> D)`,
        diagramExplanation:
          'At each step, the vertex with the lowest tentative distance is extracted from the min-heap. Its neighbors are relaxed, updating distances whenever a shorter route is found.',
        visualBlocks: [
          {
            title: 'Edge Relaxation Formula',
            codeOrSchema:
              'if (dist[u] + weight(u, v) < dist[v]) {\n    dist[v] = dist[u] + weight(u, v);\n    priorityQueue.insert(dist[v], v);\n}',
            annotation: 'The fundamental mathematical equation evaluated at every edge step.',
          },
        ],
      },
      simpleExample: {
        subtitle: 'Production Java Implementation with PriorityQueue',
        context:
          'A complete, syntactically correct Java implementation of Dijkstra algorithm using an adjacency list and min-heap.',
        codeOrData: `import java.util.*;

public class DijkstraAlgorithm {
    static class Edge {
        int target, weight;
        Edge(int target, int weight) {
            this.target = target;
            this.weight = weight;
        }
    }

    static class Node implements Comparable<Node> {
        int id, dist;
        Node(int id, int dist) {
            this.id = id;
            this.dist = dist;
        }
        @Override
        public int compareTo(Node o) {
            return Integer.compare(this.dist, o.dist); // Min-heap ordering
        }
    }

    public static int[] findShortestPaths(int vertices, List<List<Edge>> graph, int source) {
        int[] dist = new int[vertices];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[source] = 0;

        PriorityQueue<Node> pq = new PriorityQueue<>();
        pq.offer(new Node(source, 0));

        while (!pq.isEmpty()) {
            Node current = pq.poll();
            int u = current.id;

            // Skip outdated distance entries
            if (current.dist > dist[u]) continue;

            for (Edge edge : graph.get(u)) {
                int v = edge.target;
                int weight = edge.weight;

                // Relaxation condition
                if (dist[u] + weight < dist[v]) {
                    dist[v] = dist[u] + weight;
                    pq.offer(new Node(v, dist[v]));
                }
            }
        }
        return dist;
    }
}`,
        stepsOrBreakdown: [
          '1. Initialize dist[] array to infinity and set dist[source] = 0.',
          '2. Insert the source node into a min-heap priority queue.',
          '3. Extract the node with minimum tentative distance from the queue.',
          '4. For each outgoing edge, perform relaxation to check for shorter paths.',
          '5. If a shorter path is discovered, update dist[v] and push (v, dist[v]) into the heap.',
        ],
        conclusion:
          'Using a priority queue guarantees optimal O((V + E) log V) execution time, making it suitable for million-node road networks.',
      },
      checkUnderstanding: {
        question:
          "Why does Dijkstra's algorithm fail to guarantee optimal results on graphs with negative edge weights?",
        options: [
          "Because once a vertex is marked visited, Dijkstra assumes its shortest path is permanently finalized; a negative edge later in the path could reduce that distance",
          'Because computers cannot store negative numbers in arrays',
          'Because priority queues automatically crash when comparing negative values',
          'Because graphs with negative edges cannot be represented as adjacency lists',
        ],
        correctIndex: 0,
        explanation:
          "Option 0 is correct: Dijkstra is a greedy algorithm that assumes adding edges can only increase or maintain path lengths. If an edge can have a negative weight, a path that looked longer initially could end up being shorter later, violating Dijkstra's greedy invariant.",
      },
      alternateExplanation: {
        title: 'The Expanding GPS Radar Mental Model',
        text: 'Imagine your car navigation system searching for a destination. It starts at your current location and searches in expanding circles: first looking 1 mile away, then 2 miles, then 3 miles. The moment it hits the destination, it knows it found the closest route because it already checked every possible closer point.',
      },
    };
  }

  // 6. QUICKSORT VS MERGESORT
  if (/\b(quicksort|mergesort)\b/i.test(lower)) {
    return {
      topicTitle: 'QuickSort vs MergeSort: Algorithmic Comparison',
      simpleExplanation: {
        headline:
          'QuickSort and MergeSort are two premier divide-and-conquer sorting algorithms, differing fundamentally in partitioning strategy, auxiliary memory usage, and worst-case performance guarantees.',
        paragraphs: [
          'Both QuickSort and MergeSort achieve optimal average-case time complexity of O(N log N). However, they conquer the sorting problem from opposite directions. QuickSort does the hard work before recursing: it selects a pivot element and partitions the array in-place so that elements smaller than the pivot sit on the left and larger elements sit on the right. Sub-arrays are then sorted independently with no merging step required.',
          'MergeSort, by contrast, does the hard work after recursing: it trivializes division by simply splitting the array down the middle into two equal halves until reaching single-element base cases. It then merges the sorted halves back together in an auxiliary buffer array, preserving the relative order of duplicate elements (stability).',
          'The primary engineering trade-off centers on memory and stability: QuickSort sorts in-place using O(log N) stack memory, making it cache-friendly and extremely fast in practice, but exhibits an O(N^2) worst-case on poor pivot choices and is unstable. MergeSort guarantees O(N log N) time in all cases and is stable, but requires O(N) auxiliary space.',
        ],
        keyPoints: [
          'Average Time: Both run in O(N log N) average time; MergeSort guarantees O(N log N) worst-case, while QuickSort degrades to O(N^2) on pathological pivot selection.',
          'Space Complexity: QuickSort is in-place with O(log N) stack space; MergeSort requires O(N) auxiliary array allocation.',
          'Stability: MergeSort is strictly stable (preserves duplicate order); QuickSort is unstable due to long-distance swaps.',
          'Cache Locality: QuickSort has superior spatial cache locality because it swaps contiguous elements in-place.',
          'Real-World Adoption: Java uses Dual-Pivot QuickSort for primitive arrays (speed & cache), and Timsort (MergeSort derivative) for Object arrays (stability).',
        ],
        rulesOfThumb: [
          {
            label: 'When to Prefer QuickSort',
            rule: 'Choose QuickSort for arrays of primitive types where memory is tight, stability is not required, and raw in-memory speed is paramount.',
          },
          {
            label: 'When to Prefer MergeSort',
            rule: 'Choose MergeSort when sorting complex objects where stability matters, or when sorting linked lists or huge datasets on external disk storage.',
          },
          {
            label: 'Pivot Selection Protection',
            rule: 'Always use Randomized Pivot selection or Median-of-Three in QuickSort to protect against the O(N^2) sorted-array worst case.',
          },
        ],
      },
      realWorldAnalogy: {
        analogyTitle: 'Sorting Playing Cards: In-Lap Shuffling vs Table Stacking',
        story:
          'Imagine sorting a deck of playing cards. QuickSort is like picking an 8 of diamonds as a pivot, holding the cards in your hands, and quickly sliding cards smaller than 8 to your left hand and cards larger to your right hand (in-place partitioning). You need zero extra table space, but if you pick an Ace as a pivot every single time, you make almost no progress. MergeSort is like splitting the deck into two piles of 26, then four piles of 13, and so on, until each card sits alone on a wide conference table. You then systematically zip the piles together pair by pair. You need a big table (auxiliary memory), but you are guaranteed to finish in the exact same time no matter what.',
        breakdownPoints: [
          {
            title: 'In-Hand Partitioning (QuickSort)',
            description: 'Rearranges items within existing memory without needing auxiliary storage.',
          },
          {
            title: 'Table Staging (MergeSort)',
            description: 'Allocates external staging space to cleanly merge sorted sub-lists with 100% stability.',
          },
          {
            title: 'Bad Pivot Risk',
            description: 'Selecting an extreme minimum or maximum pivot causes unbalanced single-item partitions.',
          },
        ],
        solutionTakeaway:
          'QuickSort trades worst-case safety for speed and memory efficiency; MergeSort trades memory for rock-solid stability and guaranteed performance.',
      },
      visualExplanation: {
        subtitle: 'Architectural Comparison Matrix: QuickSort vs MergeSort',
        diagramAscii: `+-----------------------+-----------------------------+-----------------------------+
| Feature               | QuickSort                   | MergeSort                   |
+-----------------------+-----------------------------+-----------------------------+
| Divide Strategy       | Pivot Partitioning (L < P < R)| Equal Midpoint Split (N / 2) |
| Hard Work Phase       | During Partition (Before)   | During Merge (After)        |
| Best / Average Time   | O(N log N)                  | O(N log N)                  |
| Worst-Case Time       | O(N^2) (Poor Pivot)         | O(N log N) (Guaranteed)     |
| Auxiliary Space       | O(log N) (In-place stack)   | O(N) (Extra Array Buffer)   |
| Stability             | Unstable                    | Stable                      |
| Cache Performance     | Excellent (In-place)        | Moderate (Buffer copies)    |
+-----------------------+-----------------------------+-----------------------------+

QUICKSORT EXECUTION FLOW:
[ 7, 2, 1, 6, 8, 5, 3, 4 ]  --> Pick Pivot = 4
Partition around 4:
[ 2, 1, 3 ]  [ 4 ]  [ 7, 6, 8, 5 ]   <-- In-place swap!

MERGESORT EXECUTION FLOW:
[ 7, 2, 1, 6, 8, 5, 3, 4 ]
Split: [ 7, 2, 1, 6 ] and [ 8, 5, 3, 4 ]
... split down to single items ...
Merge: [ 1, 2, 6, 7 ] + [ 3, 4, 5, 8 ] ---> [ 1, 2, 3, 4, 5, 6, 7, 8 ] (Requires extra array)`,
        diagramExplanation:
          'QuickSort partitions elements around a pivot in-place before recursing. MergeSort splits evenly down to single elements and merges sorted lists using auxiliary memory.',
        visualBlocks: [
          {
            title: 'Stability Definition',
            codeOrSchema:
              'Input: [(Card A, 5), (Card B, 5)]\nStable Sort: Always keeps Card A before Card B\nUnstable Sort: May swap Card B before Card A',
            annotation: 'MergeSort is stable; QuickSort is unstable.',
          },
        ],
      },
      simpleExample: {
        subtitle: 'QuickSort In-Place Partition vs MergeSort Merge Step',
        context:
          'Comparing the core operational routines: QuickSort partition() vs MergeSort merge().',
        codeOrData: `// --- QUICKSORT: In-Place Partition (Lomuto Scheme) ---
int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1; // Index of smaller element

    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp; // Swap
        }
    }
    int temp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = temp;
    return i + 1; // Pivot position finalized!
}

// --- MERGESORT: Auxiliary Buffer Merge ---
void merge(int[] arr, int left, int mid, int right) {
    int[] temp = new int[right - left + 1]; // Requires O(N) allocation
    int i = left, j = mid + 1, k = 0;

    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) temp[k++] = arr[i++]; // <= ensures stability
        else temp[k++] = arr[j++];
    }
    while (i <= mid) temp[k++] = arr[i++];
    while (j <= right) temp[k++] = arr[j++];

    System.arraycopy(temp, 0, arr, left, temp.length);
}`,
        stepsOrBreakdown: [
          '1. QuickSort partition swaps elements directly inside arr[] using a pointer, returning the finalized pivot index.',
          '2. MergeSort merge allocates a temporary array temp[], copies smaller elements sequentially, and copies back.',
          '3. QuickSort uses O(1) auxiliary space during the partition step.',
          '4. MergeSort uses O(N) space to safely stage elements without overwriting unvisited values.',
        ],
        conclusion:
          'QuickSort wins in environments with limited RAM and primitive data types; MergeSort wins when data stability and guaranteed worst-case latency are critical.',
      },
      checkUnderstanding: {
        question:
          'What is the primary technical reason Java uses a MergeSort derivative (Timsort) for Objects but QuickSort for primitives?',
        options: [
          'Object sorting frequently requires stability to preserve secondary sort orders, whereas primitives have no identity beyond their value and benefit from QuickSort in-place cache speed',
          'Java compilers are unable to generate QuickSort bytecode for Object references',
          'QuickSort cannot compare numbers greater than 1,000,000',
          'MergeSort cannot run on arrays of integer primitive types',
        ],
        correctIndex: 0,
        explanation:
          'Option 0 is correct: When sorting objects (e.g. Students by GPA then by Name), stability is essential so that students with equal GPA remain sorted by name. Primitives have no distinct identity (any integer 5 is identical to any other 5), making QuickSort in-place speed the optimal choice.',
      },
      alternateExplanation: {
        title: 'The Budget vs Safety Mental Model',
        text: 'QuickSort is a race car: it travels at maximum speed and requires zero extra luggage (memory), but if you hit bad weather (unbalanced pivot) you can spin out. MergeSort is a high-speed passenger train: it requires a dedicated railway track (extra memory), but it arrives on time every single run without fail.',
      },
    };
  }

  // 7. INTERFACES VS ABSTRACT CLASSES
  if (/\b(interface|abstract\s*class)\b/i.test(lower)) {
    return {
      topicTitle: 'Interfaces vs Abstract Classes in Java',
      simpleExplanation: {
        headline:
          'Interfaces and Abstract Classes represent two core abstraction mechanisms in Java, distinguishing between a contractual capability ("what an object CAN DO") and an ontological identity ("what an object IS").',
        paragraphs: [
          'An Interface in Java is a blueprint of behavior that defines a contract for classes to implement. A class can implement multiple interfaces, overcoming Java single inheritance constraint. Since Java 8, interfaces can also provide default and static method implementations, and in Java 9 private helper methods were added. However, interfaces cannot maintain instance state (all fields are implicitly public, static, and final) and cannot define constructors.',
          'An Abstract Class is an incomplete base class intended to be subclassed via inheritance (`extends`). An abstract class can declare both abstract methods (without bodies) and concrete methods (with bodies), can maintain mutable instance state (private non-final variables), and can define constructors to initialize shared state. A class can extend only one abstract class.',
          'The architectural decision hinges on relationship and state: use an abstract class when classes share code and a common root identity (an "is-a" relationship, e.g. Dog is an Animal). Use an interface when unrelated classes need to provide common functionality (a "can-do" capability, e.g. Document, Picture, and BankStatement all implement Printable).',
        ],
        keyPoints: [
          'Inheritance Model: Multiple interfaces can be implemented (`implements A, B, C`); only one abstract class can be extended (`extends Base`).',
          'State & Fields: Interfaces only allow `public static final` constants; abstract classes allow mutable instance variables of any access modifier.',
          'Constructors: Abstract classes have constructors called during subclass instantiation; interfaces cannot have constructors.',
          'Default Methods: Java 8 introduced `default` methods in interfaces for backwards-compatible API evolution.',
          'Design Intent: Interface defines a capability contract ("can-do"); Abstract class defines a shared family hierarchy ("is-a").',
        ],
        rulesOfThumb: [
          {
            label: 'The Is-A vs Can-Do Heuristic',
            rule: 'If the relationship is "A is a B" with shared state, use an Abstract Class. If the relationship is "A can do B", use an Interface.',
          },
          {
            label: 'Default to Interfaces',
            rule: 'In modern Java architecture, prefer interfaces for public API boundaries to avoid locking consumers into a rigid class inheritance hierarchy.',
          },
          {
            label: 'Combine Both (Skeletal Pattern)',
            rule: 'Define an Interface for the contract (e.g. List), and provide an Abstract Class for common implementations (e.g. AbstractList).',
          },
        ],
      },
      realWorldAnalogy: {
        analogyTitle: 'The Human DNA Heritage vs The Driver License Certification',
        story:
          'Think of an Abstract Class as your genetic family tree. You can only have one biological father (single inheritance). From that father, you inherit physical attributes like blood type, eye color, and core biological functions (shared instance state and constructors). An Interface, on the other hand, is like a professional certification or driver license. You can hold a driver license, a scuba diver certification, and a pilot license simultaneously (multiple interface implementation). The licensing bureau does not care who your biological father was—they only verify that you satisfy the required skill contract.',
        breakdownPoints: [
          {
            title: 'Genetic Heritage (Abstract Class)',
            description: 'Single inheritance providing core shared state, constructors, and family identity.',
          },
          {
            title: 'Licenses & Certifications (Interfaces)',
            description: 'Pluggable capability contracts that any person can adopt regardless of biological lineage.',
          },
          {
            title: 'Skill Test (Interface Methods)',
            description: 'The verification that an object fulfills its promised behavioral specification.',
          },
        ],
        solutionTakeaway:
          'Use abstract classes for intrinsic identity and shared state; use interfaces for modular, swappable capabilities.',
      },
      visualExplanation: {
        subtitle: 'Structural Comparison: Interface vs Abstract Class',
        diagramAscii: `+-----------------------+-----------------------------+-----------------------------+
| Architectural Vector  | Interface                   | Abstract Class              |
+-----------------------+-----------------------------+-----------------------------+
| Keyword               | interface / implements      | abstract class / extends    |
| Multiple Inheritance  | YES (Multiple interfaces)   | NO (Single class extension) |
| Instance State / Vars | NO (Only public static final)| YES (Private, protected, etc)|
| Constructors          | NO                          | YES                         |
| Speed / Dispatch      | Involves itable lookup      | Faster direct vtable lookup |
| Evolution             | default methods (Java 8+)   | Add concrete methods        |
+-----------------------+-----------------------------+-----------------------------+

HIERARCHY MODEL:
             [ Abstract Class: Vehicle ]  <-- Shared state: engine, VIN, constructor
                    /           \\
                   v             v
              [ Car ]          [ Truck ]
                 |                |
                 +-------+--------+
                         |
                         v
             [ Interface: GPSNavigable ]   <-- Capability contract: getCoordinates()
                         ^
                         |
             [ SmartPhone ]  (Completely unrelated class implementing GPSNavigable!)`,
        diagramExplanation:
          'Car and Truck share the Vehicle abstract base class (is-a), while both SmartPhone and Car implement GPSNavigable (can-do).',
        visualBlocks: [
          {
            title: 'Skeletal Implementation Pattern',
            codeOrSchema:
              'public interface Collection<E> { ... }\npublic abstract class AbstractCollection<E> implements Collection<E> { ... }\npublic class ArrayList<E> extends AbstractCollection<E> { ... }',
            annotation: 'The gold standard Java design pattern seen in the Collections framework.',
          },
        ],
      },
      simpleExample: {
        subtitle: 'Authentic Java Implementation: Vehicle Hierarchy & Capabilities',
        context:
          'Demonstrating an abstract base class with shared state and a pluggable interface implemented across different classes.',
        codeOrData: `// 1. Capability Interface (Any device can implement this)
public interface Chargeable {
    void recharge(int durationMinutes);
}

// 2. Abstract Base Class (Shared state & identity)
public abstract class Vehicle {
    private final String vin;
    protected double mileage;

    public Vehicle(String vin) {
        this.vin = vin;
        this.mileage = 0.0;
    }

    public String getVin() { return vin; }

    // Abstract method: subclasses MUST implement
    public abstract void drive(double distanceKm);
}

// 3. Concrete Class extending Abstract Class AND implementing Interface
public class ElectricCar extends Vehicle implements Chargeable {
    private int batteryLevel;

    public ElectricCar(String vin) {
        super(vin); // Invokes abstract class constructor
        this.batteryLevel = 100;
    }

    @Override
    public void drive(double distanceKm) {
        this.mileage += distanceKm;
        this.batteryLevel -= (int)(distanceKm * 0.2);
    }

    @Override
    public void recharge(int durationMinutes) {
        this.batteryLevel = Math.min(100, this.batteryLevel + durationMinutes * 2);
    }
}`,
        stepsOrBreakdown: [
          '1. Vehicle provides common state (vin, mileage) and a constructor.',
          '2. ElectricCar inherits from Vehicle and calls super(vin).',
          '3. ElectricCar implements Chargeable, satisfying the recharge() capability contract.',
          '4. A Tesla and an iPhone can both be passed to a ChargingStation that only requires Chargeable.',
        ],
        conclusion:
          'Combining abstract classes for stateful inheritance with interfaces for behavioral contracts delivers clean, extensible object-oriented architectures.',
      },
      checkUnderstanding: {
        question:
          'Which feature can be declared inside an Abstract Class but is STRICTLY FORBIDDEN inside an Interface in Java?',
        options: [
          'A constructor and private non-static instance variables',
          'Static utility methods with method bodies',
          'Default methods with fallback implementations',
          'Constants declared with public static final',
        ],
        correctIndex: 0,
        explanation:
          'Option 0 is correct: Interfaces cannot declare constructors or instance variables (all interface fields are implicitly public, static, and final). Abstract classes can have private instance fields and constructors to initialize them.',
      },
      alternateExplanation: {
        title: 'The Blueprint vs Permit Mental Model',
        text: 'An Abstract Class is an architectural blueprint: it has foundational concrete poured, pipes laid, and shared structure that your house must build upon. An Interface is an occupancy permit: it merely certifies that your building has emergency exits and fire sprinklers, regardless of what materials you used to construct it.',
      },
    };
  }

  // 8. SQL FUNDAMENTALS (DDL VS DML)
  if (
    /\b(ddl|dml)\b/i.test(lower) ||
    (/\b(sql|structured\s*query\s*language)\b/i.test(lower) && !lower.includes('join') && !lower.includes('trigger'))
  ) {
    return {
      topicTitle: 'Structured Query Language (SQL): DDL vs DML',
      simpleExplanation: {
        headline:
          'Structured Query Language (SQL) commands are divided into functional sub-languages, primarily Data Definition Language (DDL) for defining schema structures and Data Manipulation Language (DML) for querying and modifying data rows.',
        paragraphs: [
          'Relational database management systems organize SQL commands according to their scope of operation. DDL (Data Definition Language) commands—such as CREATE, ALTER, DROP, and TRUNCATE—operate directly on database catalog metadata. They create, modify, or destroy structural database objects such as tables, schemas, indexes, and constraints. In most database engines (such as MySQL and Oracle), DDL statements implicitly commit the current transaction immediately and cannot be rolled back.',
          'DML (Data Manipulation Language) commands—including SELECT, INSERT, UPDATE, and DELETE—operate on the data rows residing inside those structures. DML commands do not alter table schemas; instead, they populate, query, mutate, and delete records. DML operations execute within transactional boundaries and can be rolled back via ROLLBACK before being finalized via COMMIT.',
          'In addition to DDL and DML, full SQL encompasses DCL (Data Control Language: GRANT, REVOKE for permissions and access control) and TCL (Transaction Control Language: COMMIT, ROLLBACK, SAVEPOINT for managing transactional atomicity).',
        ],
        keyPoints: [
          'DDL Commands: CREATE, ALTER, DROP, TRUNCATE, RENAME; modifies database metadata and structure.',
          'DML Commands: SELECT, INSERT, UPDATE, DELETE; queries and manipulates records within tables.',
          'Transaction Behavior: DML commands participate in transactions and can be rolled back; DDL statements usually trigger auto-commits.',
          'TRUNCATE vs DELETE: DELETE is DML (scans and removes rows, logs each row, fires triggers, can be rolled back); TRUNCATE is DDL (deallocates storage pages, faster, does not fire row triggers).',
          'Sub-Languages: DDL (structure), DML (data), DCL (permissions), TCL (transactions).',
        ],
        rulesOfThumb: [
          {
            label: 'TRUNCATE vs DELETE Performance',
            rule: 'Use TRUNCATE TABLE to wipe a table clean in development or staging; it executes orders of magnitude faster than DELETE FROM table because it deallocates data pages instead of logging every tuple.',
          },
          {
            label: 'DDL in Production',
            rule: 'Execute ALTER TABLE commands with extreme caution on large production tables; schema changes can acquire exclusive catalog locks that block incoming DML reads and writes.',
          },
          {
            label: 'Always Use WHERE with UPDATE & DELETE',
            rule: 'Executing an UPDATE or DELETE without an explicit WHERE clause mutates or destroys every single row in the table.',
          },
        ],
      },
      realWorldAnalogy: {
        analogyTitle: 'Constructing a Library Building vs Stocking Books on Shelves',
        story:
          'Imagine building a municipal library. DDL is the construction crew: they pour concrete foundations, erect steel walls, install bookshelves, and label aisle signs (CREATE TABLE, ALTER TABLE). You cannot put books in a library until the shelves exist. DML is the library patrons and librarians: they borrow books, return books, rearrange books on shelves, and add newly purchased novels to existing bookcases (INSERT, SELECT, UPDATE, DELETE). The librarians do not knock down walls or change the building architecture when they put away a book.',
        breakdownPoints: [
          {
            title: 'Construction Crew (DDL)',
            description: 'Defines the structural blueprint, shelves, and constraints of the database.',
          },
          {
            title: 'Librarians & Readers (DML)',
            description: 'Manipulates and reads the content stored within the existing shelves.',
          },
          {
            title: 'Demolishing a Shelf (DROP TABLE)',
            description: 'Destroys the physical structure itself, destroying all books stored inside.',
          },
        ],
        solutionTakeaway:
          'DDL builds the containers; DML manages the items stored inside those containers.',
      },
      visualExplanation: {
        subtitle: 'SQL Command Classification Architecture',
        diagramAscii: `                    STRUCTURED QUERY LANGUAGE (SQL)
                                   |
         +-------------------------+-------------------------+
         |                                                   |
         v                                                   v
   [ DDL: STRUCTURE ]                                  [ DML: DATA ]
   Data Definition Language                            Data Manipulation Language
   - CREATE TABLE / INDEX                              - SELECT (Read)
   - ALTER TABLE (Add/Drop Column)                     - INSERT (Create)
   - DROP TABLE (Destroy)                              - UPDATE (Modify)
   - TRUNCATE (Deallocate pages)                       - DELETE (Remove)
   * Modifies Catalog Metadata                         * Modifies Table Tuples
   * Implicit Auto-Commit                              * Rollback Supported via TCL

TRANSACTION LIFECYCLE DIFFERENCE:
DML: BEGIN -> INSERT INTO users ... -> ROLLBACK (Data restored!)
DDL: CREATE TABLE users ... -> (Instantly committed to database catalog!)`,
        diagramExplanation:
          'DDL alters the schema container and catalog metadata. DML manipulates individual records within those containers under transaction control.',
        visualBlocks: [
          {
            title: 'The SQL Sub-Language Family',
            codeOrSchema:
              'DDL: CREATE, ALTER, DROP, TRUNCATE\nDML: SELECT, INSERT, UPDATE, DELETE\nTCL: COMMIT, ROLLBACK, SAVEPOINT\nDCL: GRANT, REVOKE',
            annotation: 'Four distinct operational domains within standard ANSI SQL.',
          },
        ],
      },
      simpleExample: {
        subtitle: 'DDL Schema Construction Followed by DML Data Operations',
        context:
          'A side-by-side SQL script illustrating DDL schema setup followed by transactional DML operations.',
        codeOrData: `-- === 1. DDL OPERATIONS (Defining Schema Structure) ===
-- Creates the table container
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    stock_count INT DEFAULT 0
);

-- Adds a new column to existing structure
ALTER TABLE products ADD COLUMN category VARCHAR(50);

-- === 2. DML OPERATIONS (Manipulating Data Rows) ===
BEGIN TRANSACTION;

-- INSERT: Adds new records
INSERT INTO products (product_name, price, stock_count, category)
VALUES 
    ('Mechanical Keyboard', 89.99, 45, 'Peripherals'),
    ('Wireless Mouse', 49.99, 120, 'Peripherals');

-- UPDATE: Modifies existing record
UPDATE products
SET price = 79.99, stock_count = stock_count - 1
WHERE product_name = 'Mechanical Keyboard';

-- SELECT: Queries data
SELECT product_name, price, stock_count
FROM products
WHERE category = 'Peripherals';

-- DELETE: Removes matching records
DELETE FROM products WHERE stock_count = 0;

COMMIT;`,
        stepsOrBreakdown: [
          '1. CREATE TABLE establishes the product container with typed columns and constraints (DDL).',
          '2. ALTER TABLE appends the category column to the table schema (DDL).',
          '3. BEGIN TRANSACTION starts an isolated unit of work (TCL).',
          '4. INSERT, UPDATE, and DELETE modify data records within the container (DML).',
          '5. COMMIT permanently applies the DML modifications (TCL).',
        ],
        conclusion:
          'Understanding the boundary between DDL and DML ensures safe database administration and transaction handling in production.',
      },
      checkUnderstanding: {
        question:
          'What is the fundamental difference between the TRUNCATE command (DDL) and the DELETE command (DML) in relational databases?',
        options: [
          'TRUNCATE deallocates data storage pages directly at the catalog level without firing row triggers, whereas DELETE evaluates row-by-row, logs each deletion, and fires triggers',
          'TRUNCATE only deletes rows with odd IDs, while DELETE deletes rows with even IDs',
          'DELETE permanently drops the table schema, while TRUNCATE renames the table',
          'There is no difference; TRUNCATE is simply an alias for DELETE FROM table',
        ],
        correctIndex: 0,
        explanation:
          'Option 0 is correct: TRUNCATE is a DDL command that deallocates data pages, executing much faster and bypassing row-level triggers. DELETE is a DML command that inspects each row, records modifications in the transaction log, and fires triggers.',
      },
      alternateExplanation: {
        title: 'The Cookie Cutter and the Dough Mental Model',
        text: 'DDL is the cookie cutter: it shapes the star, circle, or tree form. DML is the dough you press into the cutter. You can change, eat, or add more dough as much as you want without changing the shape of the steel cutter.',
      },
    };
  }

  return null;
}
