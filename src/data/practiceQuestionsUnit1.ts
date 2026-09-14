import { PracticeQuestion } from '../types';

export const UNIT_1_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'dbms-u1-q01',
    code: 'DBMS-U1-Q01',
    unitId: 'unit-1',
    unitNumber: 1,
    unitTitle: 'UNIT I – Overview of Database Systems & ER Model',
    subject: 'DBMS',
    topic: 'File System vs DBMS',
    difficulty: 'Easy',
    type: 'Conceptual',
    title: 'File-Processing System vs Database Management System (DBMS)',
    description: 'Analyze fundamental differences between traditional file-based data storage and modern DBMS architectures.',
    statement: {
      context: 'Traditional file systems stored data in separate flat files managed by custom application programs. A bank migrated its customer records, loan ledgers, and transactions from flat files to a relational DBMS.',
      tasks: [
        '1. Compare file systems and DBMS across four critical parameters: Data Redundancy & Inconsistency, Concurrent Access Anomalies, Data Isolation, and Atomicity/Crash Recovery.',
        '2. Explain how a DBMS solves the problem of uncontrolled redundancy using centralized control and integrity constraints.'
      ]
    },
    tip: 'Focus on Codd’s principles and ACID crash-recovery guarantees.',
    expectedKeywords: ['redundancy', 'inconsistency', 'concurrent', 'atomicity', 'isolation', 'crash recovery', 'centralized'],
    sampleSolution: `1. Comparison between File Systems and DBMS:
• Data Redundancy & Inconsistency: In file systems, duplicate copies of identical data exist in multiple department files (e.g., student address saved by library and hostel). Updates in one file leave others stale, causing data inconsistency. A DBMS maintains a single logical repository with foreign keys and normalization, minimizing redundancy.
• Concurrent Access Anomalies: In file systems, simultaneous writes by multiple users lead to lost updates or interleaved corruption (e.g., two clerks booking the last seat). A DBMS provides concurrency control protocols (locking/2PL/timestamps) guaranteeing serializable schedules.
• Data Isolation & Accessibility: In file systems, data is scattered across files with proprietary formats, requiring new programs for ad-hoc queries. DBMS provides standardized declarative query languages (SQL) and high data independence.
• Atomicity & Crash Recovery: If a power failure occurs mid-transaction in a file system, the file is left partially modified. A DBMS ensures atomicity using write-ahead logging (WAL), rolling back incomplete transactions to a consistent state.

2. How DBMS Solves Uncontrolled Redundancy:
A DBMS organizes data through a centralized conceptual schema. By declaring Primary Keys, Foreign Keys, and Normalization rules (e.g., 3NF/BCNF), any duplicate attribute is eliminated. Any necessary redundancy (such as foreign key links) is strictly controlled and automatically validated by the DBMS engine via referential integrity constraints.`
  },
  {
    id: 'dbms-u1-q02',
    code: 'DBMS-U1-Q02',
    unitId: 'unit-1',
    unitNumber: 1,
    unitTitle: 'UNIT I – Overview of Database Systems & ER Model',
    subject: 'DBMS',
    topic: 'Describing and Storing Data in a DBMS',
    difficulty: 'Medium',
    type: 'Conceptual',
    title: 'Three-Schema Architecture (ANSI/SPARC) & Data Independence',
    description: 'Understand the three levels of data abstraction and distinguish logical from physical data independence.',
    statement: {
      context: 'The ANSI/SPARC 3-schema architecture was designed to separate user views from physical database representations on persistent disk storage.',
      tasks: [
        '1. Define the three schema levels: Physical (Internal), Conceptual (Logical), and External (View).',
        '2. Contrast Logical Data Independence and Physical Data Independence with concrete examples of modifications at each level.'
      ]
    },
    tip: 'Think about who interacts with each level: DBAs at the conceptual/internal level, and end users at the external level.',
    expectedKeywords: ['physical schema', 'conceptual schema', 'external schema', 'logical data independence', 'physical data independence', 'abstraction'],
    sampleSolution: `1. The Three Schema Levels:
• Physical (Internal) Schema: Describes the physical storage structure, file organizations (B-trees, hash buckets, heap files), record formats, compression, and access paths on magnetic disks/SSDs.
• Conceptual (Logical) Schema: Describes the entire database structure for the community of users—all entities, attributes, relationships, and integrity constraints—without physical storage details.
• External (View) Schema: Consists of multiple custom views tailored to distinct user groups, hiding sensitive attributes and filtering unnecessary complexity (e.g., Student portal vs Payroll clerk view).

2. Logical vs Physical Data Independence:
• Logical Data Independence: The capacity to alter the Conceptual Schema without requiring rewrites to existing external schemas or application programs.
  Example: Adding a new table 'StudentScholarship' or adding an attribute 'BloodGroup' to table 'Student' does not break the existing grading portal view.
• Physical Data Independence: The capacity to alter the Physical/Internal Schema without altering the Conceptual Schema or external views.
  Example: Adding a B+ tree secondary index on 'Salary' or switching from heap storage to RAID-5 does not change the SQL queries or logical relation schemas.`
  },
  {
    id: 'dbms-u1-q03',
    code: 'DBMS-U1-Q03',
    unitId: 'unit-1',
    unitNumber: 1,
    unitTitle: 'UNIT I – Overview of Database Systems & ER Model',
    subject: 'DBMS',
    topic: 'Structure of DBMS',
    difficulty: 'Medium',
    type: 'Conceptual',
    title: 'Internal Architecture and Engine Components of a DBMS',
    description: 'Examine the modular architecture of a database engine from query parsing down to persistent disk storage.',
    statement: {
      context: 'When an application sends a query to a relational database, multiple cooperating software modules process the request.',
      tasks: [
        '1. Describe the responsibilities of the Query Processor components: DDL Interpreter, DML Compiler, and Query Optimizer.',
        '2. Describe the responsibilities of the Storage Manager components: Buffer Manager, File Manager, Authorization/Integrity Manager, and Transaction/Recovery Manager.'
      ]
    },
    tip: 'Trace the path of a query from SQL string to disk block fetch.',
    expectedKeywords: ['query optimizer', 'buffer manager', 'storage manager', 'ddl interpreter', 'transaction manager', 'file manager'],
    sampleSolution: `1. Query Processor Modules:
• DDL Interpreter: Parses DDL statements (CREATE, ALTER, DROP) and records metadata definitions into the system catalog (Data Dictionary).
• DML Compiler & Parser: Translates declarative DML statements (SELECT, INSERT, UPDATE) into low-level relational algebra operations, checking syntax and semantic validity.
• Query Evaluation Engine & Optimizer: Evaluates alternative relational algebra execution trees, estimates I/O and CPU costs using catalog statistics, and selects the most efficient plan.

2. Storage Manager Modules:
• Buffer Manager: Allocates memory frames in the RAM buffer pool, reads disk blocks into memory on demand, and decides replacement policies (e.g., LRU/Clock) when frames are full.
• File Manager: Allocates contiguous or chained disk space, maintains free space lists, and manages record placement on data pages.
• Authorization & Integrity Manager: Validates user privileges (GRANT/REVOKE) and enforces integrity constraints (CHECK, PRIMARY KEY, FOREIGN KEY).
• Transaction & Recovery Manager: Coordinates concurrency control (locks/timestamps) and maintains the Write-Ahead Log (WAL) to restore consistency after system crashes.`
  },
  {
    id: 'dbms-u1-q04',
    code: 'DBMS-U1-Q04',
    unitId: 'unit-1',
    unitNumber: 1,
    unitTitle: 'UNIT I – Overview of Database Systems & ER Model',
    subject: 'DBMS',
    topic: 'Entities, Attributes and Entity Sets',
    difficulty: 'Easy',
    type: 'Conceptual',
    title: 'Classification of Attributes and Entity Types in ER Modeling',
    description: 'Differentiate simple, composite, single-valued, multivalued, and derived attributes, and distinguish strong from weak entities.',
    statement: {
      context: 'In an enterprise ER schema for a university, an entity Employee contains attributes: EmpID, FullName (FirstName, MiddleName, LastName), DateOfBirth, Age, PhoneNumbers, and Department.',
      tasks: [
        '1. Categorize each attribute in the Employee entity into Simple, Composite, Single-valued, Multivalued, or Derived.',
        '2. Contrast a Strong Entity Set with a Weak Entity Set, explaining the roles of the Discriminator (Partial Key) and Identifying Relationship.'
      ]
    },
    tip: 'Derived attributes can be computed from stored attributes (e.g. Age from DateOfBirth).',
    expectedKeywords: ['composite attribute', 'multivalued attribute', 'derived attribute', 'weak entity', 'discriminator', 'identifying relationship'],
    sampleSolution: `1. Attribute Classification:
• EmpID: Simple, Single-valued (Atomic primary key).
• FullName: Composite attribute (composed of sub-attributes: FirstName, MiddleName, LastName).
• DateOfBirth: Simple, Single-valued stored attribute.
• Age: Derived attribute (calculated dynamically from current date - DateOfBirth).
• PhoneNumbers: Multivalued attribute (an employee may possess zero, one, or multiple contact numbers).
• Department: Simple, Single-valued attribute.

2. Strong vs Weak Entity Sets:
• Strong Entity Set: Possesses a primary key formed by its own attributes (e.g., Employee with EmpID). It exists independently of other entities.
• Weak Entity Set: Does not have sufficient attributes to form a primary key. It depends on an identifying (owner) strong entity set for its existence (e.g., Dependent of an Employee).
• Discriminator (Partial Key): A set of attributes within the weak entity that distinguishes among entities related to the same owner (e.g., DependentName denoted by dashed underline).
• Identifying Relationship: The relationship associating the weak entity set with its owner entity set (represented by a double diamond in ER diagrams).`
  },
  {
    id: 'dbms-u1-q05',
    code: 'DBMS-U1-Q05',
    unitId: 'unit-1',
    unitNumber: 1,
    unitTitle: 'UNIT I – Overview of Database Systems & ER Model',
    subject: 'DBMS',
    topic: 'Relationships and Relationship Sets',
    difficulty: 'Medium',
    type: 'Problem-solving',
    title: 'Mapping Cardinality and Participation Constraints in ER Diagrams',
    description: 'Formulate cardinality ratios and participation constraints for real-world enterprise associations.',
    statement: {
      context: 'Analyze a University Academic Department scenario with two entity sets: Professor and Department, and two relationships: "Works_In" and "Manages".',
      tasks: [
        '1. Determine the cardinality ratio and participation constraint (Total vs Partial) for Professor "Works_In" Department, assuming every professor must work in exactly one department, and a department employs many professors.',
        '2. Determine the cardinality ratio and participation constraint for Professor "Manages" Department, assuming a department has exactly one head professor, but not all professors head a department.',
        '3. Explain how Total Participation is graphically represented in standard Chen ER notation.'
      ]
    },
    tip: 'Total participation (existence dependency) is drawn as a double line.',
    expectedKeywords: ['cardinality ratio', 'total participation', 'partial participation', '1:N', '1:1', 'double line'],
    sampleSolution: `1. Relationship "Works_In":
• Cardinality Ratio: Many-to-One (N:1) from Professor to Department (many professors work in one department).
• Participation Constraints:
  - Professor: Total participation (every professor MUST belong to a department).
  - Department: Total participation (a department cannot exist without employed faculty).

2. Relationship "Manages":
• Cardinality Ratio: One-to-One (1:1) (one professor manages at most one department, and one department is managed by one professor).
• Participation Constraints:
  - Professor: Partial participation (only a select few professors become department chairs).
  - Department: Total participation (every department must have an active head).

3. Graphical Representation:
In Chen ER notation:
• Total participation is indicated by a double line connecting the entity rectangle to the relationship diamond.
• Partial participation is indicated by a single line connecting the entity rectangle to the relationship diamond.`
  },
  {
    id: 'dbms-u1-q06',
    code: 'DBMS-U1-Q06',
    unitId: 'unit-1',
    unitNumber: 1,
    unitTitle: 'UNIT I – Overview of Database Systems & ER Model',
    subject: 'DBMS',
    topic: 'Additional Features of ER Model',
    difficulty: 'Medium',
    type: 'Conceptual',
    title: 'Specialization, Generalization, and Aggregation in Extended ER (EER)',
    description: 'Differentiate top-down Specialization, bottom-up Generalization, and examine when Aggregation is required.',
    statement: {
      context: 'In an enterprise vehicle rental system, the generic entity Vehicle is specialized into Car, Truck, and Motorcycle. In another branch, an Employee works on a Project that requires specific Machinery.',
      tasks: [
        '1. Contrast Generalization (bottom-up) and Specialization (top-down) with examples.',
        '2. Explain Disjointness Constraints (Disjoint vs Overlapping) and Completeness Constraints (Total vs Partial) in specialization hierarchies.',
        '3. Explain why Aggregation is necessary when modeling a relationship between an entity set and another relationship set.'
      ]
    },
    tip: 'Aggregation treats a relationship set as a higher-level entity set.',
    expectedKeywords: ['specialization', 'generalization', 'aggregation', 'disjoint', 'overlapping', 'completeness'],
    sampleSolution: `1. Generalization vs Specialization:
• Specialization (Top-down): The process of defining a set of subclasses of an entity type based on distinguishing characteristics.
  Example: Starting with entity Vehicle and identifying specific subclasses: Car (has trunk size), Truck (has cargo tonnage), and Motorcycle (has engine cc).
• Generalization (Bottom-up): The process of synthesizing common attributes and relationships across multiple entity types into a higher-level superclass.
  Example: Identifying common attributes (ID, Name, Salary) in Doctor and Nurse and abstracting them into medical superclass HospitalStaff.

2. Disjointness and Completeness Constraints:
• Disjointness:
  - Disjoint (d): An entity can belong to at most one subclass (e.g., a Vehicle cannot simultaneously be a Car and a Motorcycle).
  - Overlapping (o): An entity can simultaneously be a member of multiple subclasses (e.g., an Employee can be both a Manager and an Engineer).
• Completeness:
  - Total: Every superclass entity must belong to at least one subclass (double line from superclass to circle).
  - Partial: Some superclass entities do not belong to any subclass (single line).

3. Aggregation:
In basic ER modeling, a relationship cannot directly connect to another relationship. When a relationship set itself must participate in another relationship (e.g., an Employee working on a Project requires JobMachinery), Aggregation abstracts the relationship (Employee "Works_On" Project) into a higher-level composite entity, allowing it to establish a new relationship with Machinery.`
  },
  {
    id: 'dbms-u1-q07',
    code: 'DBMS-U1-Q07',
    unitId: 'unit-1',
    unitNumber: 1,
    unitTitle: 'UNIT I – Overview of Database Systems & ER Model',
    subject: 'DBMS',
    topic: 'Conceptual Database Design with ER Model',
    difficulty: 'Hard',
    type: 'Application-based',
    title: 'Hospital Management System: Conceptual ER Schema Design',
    description: 'Design a comprehensive ER schema for hospital inpatient admissions, doctors, treatments, and prescriptions.',
    statement: {
      context: 'A regional hospital requires a centralized database to manage clinical operations:\n• Patients are identified by PatientID and have Name, DOB, and Contact.\n• Doctors have DoctorID, Name, Specialty, and LicenseNumber.\n• A Doctor treats multiple Patients, and a Patient may be treated by multiple Doctors.\n• When a Doctor prescribes medication to a Patient, the Prescription details (Date, Dosage, Duration) must be tracked.\n• Each Patient is assigned to at most one Ward Room (RoomNo, Capacity, Floor), while a Room accommodates multiple Patients.',
      tasks: [
        '1. List all primary Entity Sets, their attributes, and primary keys.',
        '2. Identify all Relationship Sets, their cardinality ratios (1:1, 1:N, M:N), and any descriptive attributes.',
        '3. Formulate how the ternary association among Doctor, Patient, and Medication (or Prescription entity) should be modeled.'
      ]
    },
    tip: 'Prescription can be modeled either as an associative entity or a ternary relationship with descriptive attributes.',
    expectedKeywords: ['patient', 'doctor', 'prescription', 'room', 'cardinality', 'ternary', 'associative entity'],
    sampleSolution: `1. Primary Entity Sets & Attributes:
• Patient: (PatientID [PK], FullName, DateOfBirth, PhoneNumber, EmergencyContact)
• Doctor: (DoctorID [PK], DoctorName, Specialization, LicenseNumber)
• WardRoom: (RoomNo [PK], FloorNumber, BedCapacity)
• Medicine: (MedicineID [PK], TradeName, Manufacturer, UnitPrice)

2. Relationship Sets & Cardinalities:
• "Treats" (Doctor ↔ Patient):
  - Cardinality: Many-to-Many (M:N). A doctor treats multiple patients; a patient can consult multiple doctors.
  - Participation: Doctor (Partial), Patient (Total).
• "Assigned_To" (Patient ↔ WardRoom):
  - Cardinality: Many-to-One (N:1). Many patients can occupy beds in one ward room; each inpatient occupies one room.
  - Participation: Inpatient (Total), WardRoom (Partial).

3. Modeling Prescriptions:
Because a prescription connects a Doctor who orders, a Patient who receives, and a Medicine that is dispensed at a specific timestamp:
• Optimal Model (Associative Entity): Create a 'Prescription' entity with PrescriptionID [PK], PrescriptionDate, Dosage, Frequency, and Duration.
• Connections:
  - Doctor "Writes" Prescription (1:N, Doctor writes many prescriptions; each prescription written by exactly one doctor).
  - Patient "Receives" Prescription (1:N, Patient receives many prescriptions).
  - Prescription "Contains" Medicine (M:N with Dosage, or 1:N lines).
This avoids ambiguous ternary loops and maps cleanly to relational tables without update anomalies.`
  },
  {
    id: 'dbms-u1-q08',
    code: 'DBMS-U1-Q08',
    unitId: 'unit-1',
    unitNumber: 1,
    unitTitle: 'UNIT I – Overview of Database Systems & ER Model',
    subject: 'DBMS',
    topic: 'Entities, Attributes and Entity Sets',
    difficulty: 'Medium',
    type: 'Problem-solving',
    title: 'Weak Entity Identification: Employee Dependents Modeling',
    description: 'Analyze weak entity sets, partial keys, and identifying relationships in insurance coverage modeling.',
    statement: {
      context: 'A company provides health insurance to employees and their dependents. Company policy states that Dependent names are unique only within each employee household (two different employees might both have a dependent child named "Alex").',
      tasks: [
        '1. Identify the Strong Entity Set, Weak Entity Set, Discriminator (Partial Key), and Identifying Relationship.',
        '2. Explain how the primary key of the weak entity is formed when converted into a relational table.',
        '3. Explain the cascade behavior when an employee resigns and is removed from the database.'
      ]
    },
    tip: 'A weak entity’s primary key always includes the primary key of its identifying owner.',
    expectedKeywords: ['weak entity', 'partial key', 'identifying relationship', 'cascade delete', 'discriminator', 'composite key'],
    sampleSolution: `1. Identification of ER Components:
• Strong Entity Set: Employee (Primary key: EmpID).
• Weak Entity Set: Dependent (Cannot be uniquely identified solely by DependentName).
• Discriminator (Partial Key): DependentName (represented with a dashed underline).
• Identifying Relationship: "Has_Dependent" (represented with a double diamond).
• Participation: Dependent has Total Participation (existence-dependent on Employee).

2. Relational Schema Mapping:
When converting the weak entity 'Dependent' into a relational table:
• The primary key of 'Dependent' is a composite key formed by:
  Primary Key = { EmpID (Foreign Key referencing Employee), DependentName }
• Table Definition:
  CREATE TABLE Dependent (
    EmpID INT,
    DependentName VARCHAR(100),
    Relationship VARCHAR(50),
    DateOfBirth DATE,
    PRIMARY KEY (EmpID, DependentName),
    FOREIGN KEY (EmpID) REFERENCES Employee(EmpID) ON DELETE CASCADE
  );

3. Cascade Behavior:
Because dependents possess existence dependency on their parent employee, the foreign key constraint enforces 'ON DELETE CASCADE'. When an Employee record is deleted, all dependent insurance records referencing that EmpID are automatically deleted, preventing dangling orphan records.`
  },
  {
    id: 'dbms-u1-q09',
    code: 'DBMS-U1-Q09',
    unitId: 'unit-1',
    unitNumber: 1,
    unitTitle: 'UNIT I – Overview of Database Systems & ER Model',
    subject: 'DBMS',
    topic: 'Conceptual Database Design with ER Model',
    difficulty: 'Medium',
    type: 'Application-based',
    title: 'University Library System: Conceptual ER Modeling',
    description: 'Construct conceptual entities and relationships for tracking library books, physical copies, and student checkout transactions.',
    statement: {
      context: 'A university library maintains a catalog of Book titles (ISBN, Title, Authors, Publisher). The library owns multiple physical copies of each book (CopyID, AcquisitionDate, ShelfLocation). Students (RollNo, Name, Department) borrow book copies for up to 14 days.',
      tasks: [
        '1. Explain why physical BookCopy is modeled as a weak entity dependent on the Book catalog entity.',
        '2. Model the borrowing action: Should "Borrows" be a direct relationship between Student and BookCopy, or an independent transaction entity?',
        '3. Specify the cardinality ratios and descriptive attributes for the borrowing event (IssueDate, DueDate, ReturnDate, FinePaid).'
      ]
    },
    tip: 'Students borrow a specific physical copy of a book, not the abstract ISBN title.',
    expectedKeywords: ['book copy', 'isbn', 'borrowing', 'weak entity', 'issue date', 'cardinality'],
    sampleSolution: `1. BookCopy as a Weak Entity:
• 'Book' represents the bibliographic conceptual title identified by ISBN (e.g., 'Database System Concepts').
• The library owns 10 physical copies on shelves. A barcode like 'Copy #3' has no global meaning without knowing which ISBN title it belongs to.
• Therefore, BookCopy is a Weak Entity with partial key CopyNumber, identifying relationship "Has_Copy", and identifying owner Book (ISBN). Its primary key is (ISBN, CopyNumber).

2. Modeling the Borrowing Action:
Students borrow a specific physical BookCopy (not the abstract ISBN).
• "Borrows" is modeled as a relationship connecting Student and BookCopy.
• Alternatively, to preserve historical checkout logs after a book copy is returned, "LoanTransaction" can be an associative entity with (TransactionID [PK], RollNo [FK], ISBN [FK], CopyNumber [FK], IssueDate, DueDate, ReturnDate, Fine).

3. Cardinalities and Descriptive Attributes:
• Relationship: Student "Borrows" BookCopy.
• Cardinality Ratio:
  - For active loans: 1:N from Student to BookCopy (one student can hold multiple copies; each physical copy is loaned to at most one student at a time).
  - Over time (historical): M:N (students borrow many copies over the semester; copies are borrowed by many students).
• Descriptive Attributes: IssueDate, DueDate, ReturnDate, and FineAmount.`
  },
  {
    id: 'dbms-u1-q10',
    code: 'DBMS-U1-Q10',
    unitId: 'unit-1',
    unitNumber: 1,
    unitTitle: 'UNIT I – Overview of Database Systems & ER Model',
    subject: 'DBMS',
    topic: 'Managing Data',
    difficulty: 'Easy',
    type: 'Exam-oriented',
    title: 'Data Redundancy, Consistency & Codd’s Foundation for DBMS',
    description: 'Summarize the risks of unmanaged data redundancy and explain how DBMS declarative integrity rules maintain consistency.',
    statement: {
      context: 'Dr. E.F. Codd established the relational database model to overcome the structural rigidity and data integrity vulnerabilities of navigational and hierarchical data stores.',
      tasks: [
        '1. Define the three major anomalies caused by data redundancy: Insertion Anomaly, Deletion Anomaly, and Update Anomaly.',
        '2. Explain how declarative integrity constraints (Domain, Key, Entity Integrity, Referential Integrity) protect database consistency.'
      ]
    },
    tip: 'Think of an unnormalized employee-department spreadsheet to visualize the three anomalies.',
    expectedKeywords: ['insertion anomaly', 'deletion anomaly', 'update anomaly', 'referential integrity', 'entity integrity', 'consistency'],
    sampleSolution: `1. Anomalies Caused by Data Redundancy:
• Update Anomaly: If an employee's department office address is duplicated across 1,000 employee records, updating the office location requires modifying all 1,000 rows. If some rows are missed, the database enters an inconsistent state.
• Insertion Anomaly: In an unnormalized table combining Student and Course, you cannot record a newly introduced Course until at least one student enrolls in it, because StudentID (part of the primary key) cannot be NULL.
• Deletion Anomaly: If the last enrolled student in a course drops out, deleting that student's record inadvertently erases the entire course title, credit count, and syllabus from the database.

2. How DBMS Integrity Constraints Enforce Consistency:
• Domain Constraints: Enforce allowable data types, ranges, and formats (e.g., Age BETWEEN 18 AND 100).
• Key Constraints: Guarantee uniqueness across identifiers (e.g., UNIQUE, PRIMARY KEY), preventing duplicate customer registrations.
• Entity Integrity: Enforces that no primary key attribute can ever contain a NULL value, ensuring every row is distinctly addressable.
• Referential Integrity: Enforces foreign key relationships, guaranteeing that a child record cannot reference a non-existent parent entity.`
  }
];
