export interface SqlColumn {
  name: string;
  type: string;
  isPrimaryKey?: boolean;
  foreignKey?: string;
  description: string;
}

export interface SqlTableSchema {
  tableName: string;
  description: string;
  columns: SqlColumn[];
  sampleData: Record<string, any>[];
}

export type SqlTopicId =
  | 'ALL'
  | 'SELECT'
  | 'WHERE'
  | 'ORDER BY'
  | 'GROUP BY'
  | 'JOIN'
  | 'INSERT'
  | 'UPDATE'
  | 'DELETE';

export interface SqlQuestion {
  id: string;
  topic: 'SELECT' | 'WHERE' | 'ORDER BY' | 'GROUP BY' | 'JOIN' | 'INSERT' | 'UPDATE' | 'DELETE';
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  targetTables: string[];
  hints: string[];
  starterQuery: string;
  expectedQuery: string;
  queryType: 'SELECT' | 'DML'; // DML for INSERT, UPDATE, DELETE
  affectedTable?: string;
  checkTableQuery?: string; // Query to inspect the table after DML
  explanation: {
    overview: string;
    keyClauses: string[];
    commonMistakes: string[];
    examTip: string;
  };
}

// ----------------------------------------------------------------------
// UNIVERSITY DATABASE SCHEMA & SEED DATA
// ----------------------------------------------------------------------
export const UNIVERSITY_SCHEMA: SqlTableSchema[] = [
  {
    tableName: 'departments',
    description: 'Academic departments in the university',
    columns: [
      { name: 'dept_id', type: 'INT', isPrimaryKey: true, description: 'Unique department ID' },
      { name: 'dept_name', type: 'VARCHAR(50)', description: 'Department name (e.g. Computer Science)' },
      { name: 'building', type: 'VARCHAR(50)', description: 'Campus building where department is housed' },
      { name: 'budget', type: 'INT', description: 'Annual operating budget in USD' },
    ],
    sampleData: [
      { dept_id: 1, dept_name: 'Computer Science', building: 'Turing Hall', budget: 950000 },
      { dept_id: 2, dept_name: 'Electrical Eng', building: 'Tesla Labs', budget: 820000 },
      { dept_id: 3, dept_name: 'Mechanical Eng', building: 'Newton Center', budget: 750000 },
      { dept_id: 4, dept_name: 'Mathematics', building: 'Euler Tower', budget: 500000 },
      { dept_id: 5, dept_name: 'Civil Eng', building: 'Da Vinci Pavilion', budget: 620000 },
    ],
  },
  {
    tableName: 'students',
    description: 'Enrolled university students',
    columns: [
      { name: 'student_id', type: 'INT', isPrimaryKey: true, description: 'Unique student identifier' },
      { name: 'name', type: 'VARCHAR(50)', description: 'Full student name' },
      { name: 'dept_id', type: 'INT', foreignKey: 'departments.dept_id', description: 'Department ID' },
      { name: 'gpa', type: 'FLOAT', description: 'Grade point average on 4.0 scale' },
      { name: 'semester', type: 'INT', description: 'Current active semester (1 - 8)' },
      { name: 'email', type: 'VARCHAR(80)', description: 'Student institutional email' },
    ],
    sampleData: [
      { student_id: 101, name: 'Aarav Sharma', dept_id: 1, gpa: 3.85, semester: 6, email: 'aarav.s@univ.edu' },
      { student_id: 102, name: 'Priya Patel', dept_id: 1, gpa: 3.92, semester: 4, email: 'priya.p@univ.edu' },
      { student_id: 103, name: 'Rohan Verma', dept_id: 2, gpa: 3.45, semester: 6, email: 'rohan.v@univ.edu' },
      { student_id: 104, name: 'Ananya Iyer', dept_id: 1, gpa: 3.70, semester: 2, email: 'ananya.i@univ.edu' },
      { student_id: 105, name: 'Vikram Singh', dept_id: 3, gpa: 2.95, semester: 8, email: 'vikram.s@univ.edu' },
      { student_id: 106, name: 'Sneha Reddy', dept_id: 4, gpa: 3.80, semester: 4, email: 'sneha.r@univ.edu' },
      { student_id: 107, name: 'Dev Mehta', dept_id: 2, gpa: 3.10, semester: 6, email: 'dev.m@univ.edu' },
      { student_id: 108, name: 'Kavita Joshi', dept_id: 5, gpa: 3.60, semester: 2, email: 'kavita.j@univ.edu' },
    ],
  },
  {
    tableName: 'courses',
    description: 'Courses offered by departments',
    columns: [
      { name: 'course_id', type: 'VARCHAR(10)', isPrimaryKey: true, description: 'Course code (e.g. CS101)' },
      { name: 'title', type: 'VARCHAR(60)', description: 'Title of the course' },
      { name: 'dept_id', type: 'INT', foreignKey: 'departments.dept_id', description: 'Offering department ID' },
      { name: 'credits', type: 'INT', description: 'Number of academic credits' },
    ],
    sampleData: [
      { course_id: 'CS101', title: 'Database Systems', dept_id: 1, credits: 4 },
      { course_id: 'CS102', title: 'Data Structures & Algorithms', dept_id: 1, credits: 4 },
      { course_id: 'CS103', title: 'Operating Systems', dept_id: 1, credits: 3 },
      { course_id: 'EE201', title: 'Digital Circuit Design', dept_id: 2, credits: 4 },
      { course_id: 'ME301', title: 'Thermodynamics', dept_id: 3, credits: 3 },
      { course_id: 'MA101', title: 'Discrete Mathematics', dept_id: 4, credits: 3 },
      { course_id: 'CE202', title: 'Structural Analysis', dept_id: 5, credits: 4 },
    ],
  },
  {
    tableName: 'enrollments',
    description: 'Course registrations, grades and exam marks',
    columns: [
      { name: 'enrollment_id', type: 'INT', isPrimaryKey: true, description: 'Registration record ID' },
      { name: 'student_id', type: 'INT', foreignKey: 'students.student_id', description: 'Enrolled student ID' },
      { name: 'course_id', type: 'VARCHAR(10)', foreignKey: 'courses.course_id', description: 'Enrolled course ID' },
      { name: 'grade', type: 'VARCHAR(2)', description: 'Letter grade assigned (A, B, C, etc.)' },
      { name: 'marks', type: 'INT', description: 'Total exam marks out of 100' },
    ],
    sampleData: [
      { enrollment_id: 1, student_id: 101, course_id: 'CS101', grade: 'A', marks: 92 },
      { enrollment_id: 2, student_id: 101, course_id: 'CS102', grade: 'A', marks: 95 },
      { enrollment_id: 3, student_id: 102, course_id: 'CS101', grade: 'A', marks: 98 },
      { enrollment_id: 4, student_id: 103, course_id: 'EE201', grade: 'B', marks: 81 },
      { enrollment_id: 5, student_id: 104, course_id: 'CS101', grade: 'B', marks: 84 },
      { enrollment_id: 6, student_id: 104, course_id: 'MA101', grade: 'A', marks: 90 },
      { enrollment_id: 7, student_id: 105, course_id: 'ME301', grade: 'C', marks: 72 },
      { enrollment_id: 8, student_id: 106, course_id: 'MA101', grade: 'A', marks: 94 },
      { enrollment_id: 9, student_id: 107, course_id: 'EE201', grade: 'B', marks: 78 },
    ],
  },
  {
    tableName: 'instructors',
    description: 'Faculty professors and instructors',
    columns: [
      { name: 'instructor_id', type: 'INT', isPrimaryKey: true, description: 'Faculty employee identifier' },
      { name: 'name', type: 'VARCHAR(50)', description: 'Instructor full name' },
      { name: 'dept_id', type: 'INT', foreignKey: 'departments.dept_id', description: 'Department ID' },
      { name: 'salary', type: 'INT', description: 'Annual salary in USD' },
    ],
    sampleData: [
      { instructor_id: 501, name: 'Dr. Alan Codd', dept_id: 1, salary: 115000 },
      { instructor_id: 502, name: 'Prof. Grace Hopper', dept_id: 1, salary: 125000 },
      { instructor_id: 503, name: 'Dr. Claude Shannon', dept_id: 2, salary: 105000 },
      { instructor_id: 504, name: 'Prof. James Watt', dept_id: 3, salary: 98000 },
      { instructor_id: 505, name: 'Dr. Emmy Noether', dept_id: 4, salary: 110000 },
    ],
  },
];

// ----------------------------------------------------------------------
// PRACTICE QUESTIONS ORGANIZED BY TOPIC
// ----------------------------------------------------------------------
export const SQL_QUESTIONS: SqlQuestion[] = [
  // ==========================================
  // TOPIC 1: SELECT
  // ==========================================
  {
    id: 'sql-select-01',
    topic: 'SELECT',
    title: 'Basic Column Projection',
    difficulty: 'Easy',
    description:
      'Write a SQL query to retrieve the **name**, **gpa**, and **email** of all students from the `students` table.',
    targetTables: ['students'],
    hints: [
      'Use the SELECT keyword followed by the specific column names separated by commas.',
      'Specify the table name after the FROM keyword.',
      'Query template: SELECT col1, col2, col3 FROM table_name;',
    ],
    starterQuery: `-- Write your SQL query to select name, gpa, and email from students\nSELECT \nFROM students;`,
    expectedQuery: `SELECT name, gpa, email FROM students;`,
    queryType: 'SELECT',
    explanation: {
      overview:
        'The SELECT statement is used to project specific attributes (columns) from a relation (table). Projection corresponds directly to the π (pi) operator in Relational Algebra.',
      keyClauses: [
        'SELECT: Specifies which columns to include in the resulting relation.',
        'FROM: Specifies the source table from which rows are evaluated.',
      ],
      commonMistakes: [
        'Writing SELECT * instead of specifying only the three requested columns (name, gpa, email).',
        'Misspelling column names or omitting commas between column names.',
      ],
      examTip:
        'Always verify whether the question asks for all columns (SELECT *) or specific projected attributes (SELECT col1, col2). Selecting only required columns minimizes I/O and network transfer.',
    },
  },
  {
    id: 'sql-select-02',
    topic: 'SELECT',
    title: 'Distinct Course Credits & Calculations',
    difficulty: 'Easy',
    description:
      'Write a SQL query to find all unique **credits** values offered in the `courses` table using the `DISTINCT` keyword.',
    targetTables: ['courses'],
    hints: [
      'The DISTINCT keyword eliminates duplicate rows from the query result.',
      'Place DISTINCT immediately after the SELECT keyword: SELECT DISTINCT column FROM table;',
    ],
    starterQuery: `-- Select distinct credits values from the courses table\nSELECT \nFROM courses;`,
    expectedQuery: `SELECT DISTINCT credits FROM courses;`,
    queryType: 'SELECT',
    explanation: {
      overview:
        'In relational DBMSs, a SQL table is a multiset (bag) by default, meaning duplicates may appear unless restricted. The DISTINCT keyword forces the query engine to eliminate duplicates and return a true mathematical set.',
      keyClauses: [
        'SELECT DISTINCT: Evaluates projected rows and removes duplicate values.',
        'FROM courses: Source table containing course credit records.',
      ],
      commonMistakes: [
        'Placing DISTINCT after the column name (e.g. SELECT credits DISTINCT) which causes a syntax error.',
      ],
      examTip:
        'In university exams, when asked to find "unique values" or "all different types of X", always use DISTINCT.',
    },
  },

  // ==========================================
  // TOPIC 2: WHERE
  // ==========================================
  {
    id: 'sql-where-01',
    topic: 'WHERE',
    title: 'Filtering by Department ID',
    difficulty: 'Easy',
    description:
      'Write a SQL query to retrieve all information (`*`) for all students who belong to the Computer Science department (`dept_id = 1`).',
    targetTables: ['students'],
    hints: [
      'Use the WHERE clause to specify filter conditions on rows.',
      'To test equality for numeric fields, use the = operator.',
      'Query template: SELECT * FROM students WHERE dept_id = 1;',
    ],
    starterQuery: `-- Retrieve all students where dept_id is 1\nSELECT *\nFROM students\nWHERE ;`,
    expectedQuery: `SELECT * FROM students WHERE dept_id = 1;`,
    queryType: 'SELECT',
    explanation: {
      overview:
        'The WHERE clause filters rows based on a Boolean condition predicate. This corresponds directly to the Selection operator σ (sigma) in Relational Algebra.',
      keyClauses: [
        'SELECT *: Returns all columns of the filtered rows.',
        'FROM students: Evaluates each record in the students table.',
        'WHERE dept_id = 1: Predicate condition that keeps only rows where dept_id equals 1.',
      ],
      commonMistakes: [
        'Using == instead of = for equality comparison (SQL uses a single = sign).',
        'Quoting numeric values unnecessarily (though acceptable in some engines, clean numeric literals should not be quoted).',
      ],
      examTip:
        'Selection predicates in the WHERE clause are executed before projection and before GROUP BY, eliminating non-matching rows early to reduce memory usage.',
    },
  },
  {
    id: 'sql-where-02',
    topic: 'WHERE',
    title: 'Compound Filter with AND & Comparison',
    difficulty: 'Medium',
    description:
      'Find the **name**, **gpa**, and **semester** of all students whose **gpa is 3.5 or higher** (`>= 3.5`) AND who are in **semester 4 or higher** (`>= 4`).',
    targetTables: ['students'],
    hints: [
      'Combine multiple conditions using the Boolean AND operator.',
      'Use the greater than or equal to operator: >=',
      'Both conditions must evaluate to TRUE for a row to be included.',
    ],
    starterQuery: `-- Retrieve name, gpa, semester where gpa >= 3.5 and semester >= 4\nSELECT name, gpa, semester\nFROM students\nWHERE ;`,
    expectedQuery: `SELECT name, gpa, semester FROM students WHERE gpa >= 3.5 AND semester >= 4;`,
    queryType: 'SELECT',
    explanation: {
      overview:
        'Compound Boolean expressions combine multiple logical predicates using AND, OR, and NOT. With AND, both sides must evaluate to true for the row to be preserved in the result.',
      keyClauses: [
        'SELECT name, gpa, semester: Projects the three requested columns.',
        'WHERE gpa >= 3.5 AND semester >= 4: Filters rows meeting both academic criteria simultaneously.',
      ],
      commonMistakes: [
        'Using && instead of AND. SQL requires the keyword AND.',
        'Using > instead of >= when the question specifies "3.5 or higher".',
      ],
      examTip:
        'Pay close attention to wording in questions: "strictly greater than" means >, while "at least", "minimum", or "or higher" means >=.',
    },
  },

  // ==========================================
  // TOPIC 3: ORDER BY
  // ==========================================
  {
    id: 'sql-orderby-01',
    topic: 'ORDER BY',
    title: 'Descending Sort on GPA',
    difficulty: 'Easy',
    description:
      'Write a SQL query to list the **name** and **gpa** of all students, sorted by **gpa in descending order** (highest GPA first).',
    targetTables: ['students'],
    hints: [
      'Use the ORDER BY clause at the end of the query.',
      'Add the DESC keyword to sort in descending order (highest to lowest).',
      'ASC is the default (ascending), so DESC must be specified explicitly.',
    ],
    starterQuery: `-- Order students by gpa descending\nSELECT name, gpa\nFROM students\nORDER BY ;`,
    expectedQuery: `SELECT name, gpa FROM students ORDER BY gpa DESC;`,
    queryType: 'SELECT',
    explanation: {
      overview:
        'In relational theory, tuples in a relation have no intrinsic order. The ORDER BY clause imposes a deterministic display sequence on the output tuples.',
      keyClauses: [
        'ORDER BY gpa DESC: Sorts the result set by the numerical value of gpa from highest to lowest.',
      ],
      commonMistakes: [
        'Placing ORDER BY before the WHERE clause (ORDER BY must come after WHERE and GROUP BY).',
        'Forgetting the DESC keyword, which defaults to ASC (lowest GPA first).',
      ],
      examTip:
        'In SQL execution order, ORDER BY is evaluated almost last—after FROM, WHERE, GROUP BY, HAVING, and SELECT.',
    },
  },
  {
    id: 'sql-orderby-02',
    topic: 'ORDER BY',
    title: 'Multi-Column Sorting',
    difficulty: 'Medium',
    description:
      'List the **dept_id**, **name**, and **gpa** of all students. Sort the results first by **dept_id in ascending order**, and then within each department by **gpa in descending order**.',
    targetTables: ['students'],
    hints: [
      'You can sort by multiple columns by separating them with commas in the ORDER BY clause.',
      'For example: ORDER BY col1 ASC, col2 DESC;',
    ],
    starterQuery: `-- Sort by dept_id ascending, then gpa descending\nSELECT dept_id, name, gpa\nFROM students\nORDER BY ;`,
    expectedQuery: `SELECT dept_id, name, gpa FROM students ORDER BY dept_id ASC, gpa DESC;`,
    queryType: 'SELECT',
    explanation: {
      overview:
        'Multi-column sorting evaluates the primary sort column first. Only when two or more rows have identical values for the primary column does the database engine evaluate the secondary sort column.',
      keyClauses: [
        'ORDER BY dept_id ASC, gpa DESC: Primary ascending sort on department ID, secondary descending sort on student GPA.',
      ],
      commonMistakes: [
        'Putting DESC only at the end and expecting it to apply to both columns. Each column in ORDER BY has its own direction modifier.',
      ],
      examTip:
        'Tie-breakers in exams frequently test multi-column sorting (e.g. sorting students by class, then by roll number).',
    },
  },

  // ==========================================
  // TOPIC 4: GROUP BY
  // ==========================================
  {
    id: 'sql-groupby-01',
    topic: 'GROUP BY',
    title: 'Count Students per Department',
    difficulty: 'Medium',
    description:
      'Write a SQL query to find the **dept_id** and the total number of students in each department (name the count column **student_count**). Group the results by `dept_id`.',
    targetTables: ['students'],
    hints: [
      'Use the aggregate function COUNT(*) or COUNT(student_id).',
      'Assign an alias using the AS keyword: COUNT(*) AS student_count',
      'Group the rows using GROUP BY dept_id.',
    ],
    starterQuery: `-- Count students in each department\nSELECT dept_id, COUNT(*) AS student_count\nFROM students\nGROUP BY ;`,
    expectedQuery: `SELECT dept_id, COUNT(*) AS student_count FROM students GROUP BY dept_id;`,
    queryType: 'SELECT',
    explanation: {
      overview:
        'The GROUP BY clause collapses multiple rows sharing the same group key into a single summary tuple. Aggregate functions like COUNT(), SUM(), AVG(), MIN(), and MAX() calculate summary values across each group.',
      keyClauses: [
        'SELECT dept_id, COUNT(*) AS student_count: Outputs the grouping key and the aggregated count.',
        'GROUP BY dept_id: Divides the students table into distinct partitions per department.',
      ],
      commonMistakes: [
        'Selecting a non-aggregated column that is not part of the GROUP BY clause (e.g. SELECT name, dept_id, COUNT(*)...). This violates relational SQL rules.',
      ],
      examTip:
        'Golden Rule of GROUP BY: Any column appearing in the SELECT list that is NOT inside an aggregate function MUST be listed in the GROUP BY clause.',
    },
  },
  {
    id: 'sql-groupby-02',
    topic: 'GROUP BY',
    title: 'Average GPA with HAVING Filter',
    difficulty: 'Hard',
    description:
      'Write a SQL query to calculate the **dept_id** and the average GPA (alias as **avg_gpa**) for each department, but **only include departments where the average GPA is greater than 3.5**.',
    targetTables: ['students'],
    hints: [
      'Use AVG(gpa) AS avg_gpa to compute the average.',
      'To filter aggregated groups, use the HAVING clause (not WHERE).',
      'HAVING AVG(gpa) > 3.5 filters groups after aggregation.',
    ],
    starterQuery: `-- Calculate average GPA per department and filter departments where avg_gpa > 3.5\nSELECT dept_id, AVG(gpa) AS avg_gpa\nFROM students\nGROUP BY dept_id\nHAVING ;`,
    expectedQuery: `SELECT dept_id, AVG(gpa) AS avg_gpa FROM students GROUP BY dept_id HAVING AVG(gpa) > 3.5;`,
    queryType: 'SELECT',
    explanation: {
      overview:
        'WHERE filters individual rows BEFORE they are grouped. HAVING filters consolidated groups AFTER aggregation. You cannot put aggregate functions like AVG() in a WHERE clause.',
      keyClauses: [
        'AVG(gpa) AS avg_gpa: Computes the arithmetic mean GPA for each department partition.',
        'GROUP BY dept_id: Forms one group per department.',
        'HAVING AVG(gpa) > 3.5: Drops departments whose group average GPA is 3.5 or less.',
      ],
      commonMistakes: [
        'Attempting to put WHERE AVG(gpa) > 3.5, which causes a fatal SQL syntax error because WHERE cannot evaluate aggregate functions.',
      ],
      examTip:
        'Classic exam question: "What is the difference between WHERE and HAVING?". Remember: WHERE filters rows before grouping; HAVING filters groups after aggregation.',
    },
  },

  // ==========================================
  // TOPIC 5: JOIN
  // ==========================================
  {
    id: 'sql-join-01',
    topic: 'JOIN',
    title: 'Inner Join Students with Departments',
    difficulty: 'Medium',
    description:
      'Write a SQL query to retrieve each student\'s **name**, their **gpa**, and their department\'s **dept_name**. Perform an `INNER JOIN` between `students` and `departments` on `dept_id`.',
    targetTables: ['students', 'departments'],
    hints: [
      'Specify the tables in the FROM and JOIN clauses: FROM students INNER JOIN departments',
      'Define the join condition using ON: ON students.dept_id = departments.dept_id',
      'Select students.name, students.gpa, departments.dept_name.',
    ],
    starterQuery: `-- Join students and departments to show student name, gpa, and department name\nSELECT students.name, students.gpa, departments.dept_name\nFROM students\nINNER JOIN departments ON ;`,
    expectedQuery: `SELECT students.name, students.gpa, departments.dept_name FROM students INNER JOIN departments ON students.dept_id = departments.dept_id;`,
    queryType: 'SELECT',
    explanation: {
      overview:
        'An INNER JOIN combines records from two relations based on a common matching key (the join condition). Rows without a corresponding match in both tables are excluded.',
      keyClauses: [
        'FROM students INNER JOIN departments: Pairs rows from the students relation with rows from the departments relation.',
        'ON students.dept_id = departments.dept_id: Join predicate matching student foreign keys to department primary keys.',
      ],
      commonMistakes: [
        'Forgetting the ON condition, resulting in an unintentional Cartesian Product (Cross Join) pairing every student with every department.',
        'Ambiguous column references: when columns exist in both tables (like dept_id), they must be table-qualified (e.g. students.dept_id).',
      ],
      examTip:
        'In Relational Algebra, an INNER JOIN with an equality predicate is called an Equi-Join or Natural Join (⨝).',
    },
  },
  {
    id: 'sql-join-02',
    topic: 'JOIN',
    title: 'Multi-Table Join: Students, Courses & Enrollments',
    difficulty: 'Hard',
    description:
      'Find the **name** of each student, the course **title**, and the **grade** they received. Join `students`, `enrollments`, and `courses`.',
    targetTables: ['students', 'enrollments', 'courses'],
    hints: [
      'Join students with enrollments on students.student_id = enrollments.student_id.',
      'Then join courses on enrollments.course_id = courses.course_id.',
      'Select students.name, courses.title, enrollments.grade.',
    ],
    starterQuery: `-- Join students, enrollments, and courses\nSELECT students.name, courses.title, enrollments.grade\nFROM students\nINNER JOIN enrollments ON \nINNER JOIN courses ON ;`,
    expectedQuery: `SELECT students.name, courses.title, enrollments.grade FROM students INNER JOIN enrollments ON students.student_id = enrollments.student_id INNER JOIN courses ON enrollments.course_id = courses.course_id;`,
    queryType: 'SELECT',
    explanation: {
      overview:
        'In relational modeling, many-to-many relationships (students to courses) are resolved through a junction table (enrollments). Querying across this relationship requires a two-step join sequence.',
      keyClauses: [
        'FROM students INNER JOIN enrollments ON students.student_id = enrollments.student_id: Connects student identity to enrollment records.',
        'INNER JOIN courses ON enrollments.course_id = courses.course_id: Connects enrollment records to course catalog details.',
      ],
      commonMistakes: [
        'Trying to join students directly to courses without referencing the enrollments link table.',
      ],
      examTip:
        'When joining N tables, you will always need at least N - 1 join conditions to prevent Cartesian product blow-ups.',
    },
  },

  // ==========================================
  // TOPIC 6: INSERT
  // ==========================================
  {
    id: 'sql-insert-01',
    topic: 'INSERT',
    title: 'Insert a New Student Record',
    difficulty: 'Easy',
    description:
      'Insert a new student into the `students` table with:\n- `student_id`: **109**\n- `name`: **\'Meera Nair\'**\n- `dept_id`: **1**\n- `gpa`: **3.75**\n- `semester`: **2**\n- `email`: **\'meera.n@univ.edu\'**',
    targetTables: ['students'],
    hints: [
      'Use the INSERT INTO statement syntax.',
      'Syntax: INSERT INTO students (student_id, name, dept_id, gpa, semester, email) VALUES (109, \'Meera Nair\', 1, 3.75, 2, \'meera.n@univ.edu\');',
    ],
    starterQuery: `-- Insert student with ID 109\nINSERT INTO students (student_id, name, dept_id, gpa, semester, email)\nVALUES (109, 'Meera Nair', 1, 3.75, 2, 'meera.n@univ.edu');`,
    expectedQuery: `INSERT INTO students (student_id, name, dept_id, gpa, semester, email) VALUES (109, 'Meera Nair', 1, 3.75, 2, 'meera.n@univ.edu');`,
    queryType: 'DML',
    affectedTable: 'students',
    checkTableQuery: 'SELECT * FROM students WHERE student_id = 109;',
    explanation: {
      overview:
        'The INSERT INTO statement adds one or more new rows (tuples) into an existing table. All entity integrity constraints (such as primary key uniqueness) must be satisfied.',
      keyClauses: [
        'INSERT INTO students (columns...): Specifies the destination table and the sequence of attributes receiving values.',
        'VALUES (...): Provides the corresponding tuple literals.',
      ],
      commonMistakes: [
        'Mismatching the number or order of column names and values.',
        'Using double quotes instead of single quotes for SQL string literals.',
      ],
      examTip:
        'String and date literals in standard SQL must be enclosed in single quotes (\'text\'), while column and table names do not use quotes.',
    },
  },

  // ==========================================
  // TOPIC 7: UPDATE
  // ==========================================
  {
    id: 'sql-update-01',
    topic: 'UPDATE',
    title: 'Update Student GPA',
    difficulty: 'Medium',
    description:
      'Write a SQL statement to update the `students` table: set the **gpa** of student with **student_id = 103** to **3.65**.',
    targetTables: ['students'],
    hints: [
      'Use the UPDATE statement with the SET clause.',
      'Always include the WHERE clause to specify which record to modify, otherwise all rows in the table will be updated!',
      'Syntax: UPDATE students SET gpa = 3.65 WHERE student_id = 103;',
    ],
    starterQuery: `-- Update GPA of student 103 to 3.65\nUPDATE students\nSET gpa = \nWHERE student_id = ;`,
    expectedQuery: `UPDATE students SET gpa = 3.65 WHERE student_id = 103;`,
    queryType: 'DML',
    affectedTable: 'students',
    checkTableQuery: 'SELECT student_id, name, gpa FROM students WHERE student_id = 103;',
    explanation: {
      overview:
        'The UPDATE statement modifies existing data values in one or more columns of a table. The WHERE clause identifies the target rows to be mutated.',
      keyClauses: [
        'UPDATE students: Specifies the target table to be modified.',
        'SET gpa = 3.65: Assigns the new value to the designated column.',
        'WHERE student_id = 103: Restricts the update strictly to the row matching primary key 103.',
      ],
      commonMistakes: [
        'Omitting the WHERE clause! Without WHERE, the database will update EVERY SINGLE ROW in the table, corrupting the entire column.',
      ],
      examTip:
        'Golden Safety Rule in Production & Exams: ALWAYS double-check your WHERE clause on UPDATE and DELETE operations.',
    },
  },

  // ==========================================
  // TOPIC 8: DELETE
  // ==========================================
  {
    id: 'sql-delete-01',
    topic: 'DELETE',
    title: 'Delete Student by ID',
    difficulty: 'Medium',
    description:
      'Write a SQL statement to remove student with **student_id = 108** from the `students` table.',
    targetTables: ['students'],
    hints: [
      'Use the DELETE FROM syntax with a WHERE clause.',
      'Do not specify column names with DELETE (DELETE removes entire rows, not individual columns).',
      'Syntax: DELETE FROM students WHERE student_id = 108;',
    ],
    starterQuery: `-- Delete student with student_id = 108\nDELETE FROM students\nWHERE student_id = ;`,
    expectedQuery: `DELETE FROM students WHERE student_id = 108;`,
    queryType: 'DML',
    affectedTable: 'students',
    checkTableQuery: 'SELECT * FROM students WHERE student_id = 108;',
    explanation: {
      overview:
        'The DELETE statement removes one or more rows from a table based on a condition predicate. The table structure and columns remain intact.',
      keyClauses: [
        'DELETE FROM students: Designates the table from which rows are pruned.',
        'WHERE student_id = 108: Selects the specific tuple for deletion.',
      ],
      commonMistakes: [
        'Writing DELETE * FROM students (DELETE deletes entire rows, so the asterisk * is incorrect).',
        'Confusing DELETE with DROP TABLE (DROP removes the entire table structure and schema; DELETE removes data rows).',
      ],
      examTip:
        'DELETE vs TRUNCATE vs DROP is a top university exam question: DELETE is a DML command that can have a WHERE clause and can be rolled back; TRUNCATE is a DDL command that resets the table; DROP deletes schema and data completely.',
    },
  },
];
