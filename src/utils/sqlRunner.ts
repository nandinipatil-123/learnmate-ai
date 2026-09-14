import alasql from 'alasql';
import { UNIVERSITY_SCHEMA, SqlQuestion } from '../data/sqlPracticeData';

export interface SqlQueryResult {
  success: boolean;
  columns: string[];
  rows: Record<string, any>[];
  rowCount: number;
  executionTimeMs: number;
  error?: string;
  queryType: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'OTHER';
  affectedRows?: number;
}

export interface SqlVerificationResult {
  isCorrect: boolean;
  feedback: string;
  userResult: SqlQueryResult;
  expectedResult: SqlQueryResult;
  columnMismatch?: boolean;
  rowMismatch?: boolean;
}

// Global active in-memory database instance for interactive user execution
let activeDb: any = null;

/**
 * Initializes or resets an in-memory AlaSQL database instance with the University Schema and seed data.
 */
export function createFreshDatabase(): any {
  // Create a clean new AlaSQL database instance
  const db = new (alasql as any).Database();

  // Create tables and seed data
  for (const table of UNIVERSITY_SCHEMA) {
    // 1. Create table schema
    const colDefs = table.columns
      .map((c) => {
        let def = `${c.name} ${c.type}`;
        if (c.isPrimaryKey) def += ' PRIMARY KEY';
        return def;
      })
      .join(', ');

    db.exec(`CREATE TABLE ${table.tableName} (${colDefs});`);

    // 2. Insert pristine seed rows
    for (const row of table.sampleData) {
      const keys = Object.keys(row).join(', ');
      const values = Object.values(row)
        .map((v) => (typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : v))
        .join(', ');
      db.exec(`INSERT INTO ${table.tableName} (${keys}) VALUES (${values});`);
    }
  }

  return db;
}

/**
 * Ensures an active in-memory database is ready for interactive queries.
 */
export function getActiveDatabase(): any {
  if (!activeDb) {
    activeDb = createFreshDatabase();
  }
  return activeDb;
}

/**
 * Resets the active in-memory database back to pristine initial seed values.
 */
export function resetActiveDatabase(): void {
  activeDb = createFreshDatabase();
}

/**
 * Detects the query type from the SQL statement string.
 */
export function detectQueryType(
  sql: string
): 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'OTHER' {
  const trimmed = sql.trim().toUpperCase();
  if (trimmed.startsWith('SELECT') || trimmed.startsWith('WITH')) return 'SELECT';
  if (trimmed.startsWith('INSERT')) return 'INSERT';
  if (trimmed.startsWith('UPDATE')) return 'UPDATE';
  if (trimmed.startsWith('DELETE')) return 'DELETE';
  return 'OTHER';
}

/**
 * Executes a SQL statement safely inside an in-memory AlaSQL instance.
 */
export function executeSql(
  query: string,
  databaseInstance?: any
): SqlQueryResult {
  const db = databaseInstance || getActiveDatabase();
  const startTime = performance.now();
  const cleanSql = query.trim();

  if (!cleanSql) {
    return {
      success: false,
      columns: [],
      rows: [],
      rowCount: 0,
      executionTimeMs: 0,
      error: 'Query is empty. Please enter a SQL query.',
      queryType: 'OTHER',
    };
  }

  const queryType = detectQueryType(cleanSql);

  try {
    // Strip trailing semicolon if needed by alasql parser
    const sqlToRun = cleanSql.endsWith(';') ? cleanSql.slice(0, -1) : cleanSql;
    const rawResult = db.exec(sqlToRun);
    const endTime = performance.now();
    const executionTimeMs = Math.max(0.1, Math.round((endTime - startTime) * 100) / 100);

    // If query returned rows (e.g. SELECT)
    if (Array.isArray(rawResult)) {
      // Find all unique column keys from result items
      const columns = rawResult.length > 0 ? Object.keys(rawResult[0]) : [];
      return {
        success: true,
        columns,
        rows: rawResult,
        rowCount: rawResult.length,
        executionTimeMs,
        queryType,
      };
    }

    // For DML (INSERT, UPDATE, DELETE), rawResult is often a number indicating affected records
    const affected = typeof rawResult === 'number' ? rawResult : 1;
    return {
      success: true,
      columns: ['affected_rows'],
      rows: [{ affected_rows: affected }],
      rowCount: affected,
      executionTimeMs,
      queryType,
      affectedRows: affected,
    };
  } catch (err: any) {
    const endTime = performance.now();
    const executionTimeMs = Math.round((endTime - startTime) * 100) / 100;
    const rawError = err?.message || String(err);

    // Provide friendly error message
    let friendlyError = rawError;
    if (rawError.includes('Parse error')) {
      friendlyError = `SQL Syntax Error: ${rawError}. Check spelling of clauses, commas, and quotes.`;
    } else if (rawError.includes('Cannot read property') || rawError.includes('is not defined')) {
      friendlyError = `SQL Reference Error: ${rawError}. Verify table names and column names in the schema.`;
    }

    return {
      success: false,
      columns: [],
      rows: [],
      rowCount: 0,
      executionTimeMs,
      error: friendlyError,
      queryType,
    };
  }
}

/**
 * Normalizes values for comparison (case-insensitive for strings, handles numbers and floating point).
 */
function normalizeVal(val: any): string {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return String(Math.round(val * 1000) / 1000);
  if (typeof val === 'string') return val.trim().toLowerCase();
  return String(val);
}

/**
 * Verifies a student's SQL query against the canonical answer using isolated test databases.
 */
export function verifySqlQuery(
  studentQuery: string,
  question: SqlQuestion
): SqlVerificationResult {
  // 1. Create two isolated databases so user changes or pre-existing state don't interfere
  const studentDb = createFreshDatabase();
  const expectedDb = createFreshDatabase();

  // 2. Execute expected query first
  const expectedResult = executeSql(question.expectedQuery, expectedDb);

  // 3. Execute student query
  const userResult = executeSql(studentQuery, studentDb);

  // If student query produced a SQL error
  if (!userResult.success || userResult.error) {
    return {
      isCorrect: false,
      feedback: `Your query encountered a SQL error: ${userResult.error}`,
      userResult,
      expectedResult,
    };
  }

  // Case A: SELECT queries
  if (question.queryType === 'SELECT') {
    // Check column count and names
    const userCols = userResult.columns.map((c) => c.toLowerCase());
    const expectedCols = expectedResult.columns.map((c) => c.toLowerCase());

    // Check if column counts differ
    if (userCols.length !== expectedCols.length) {
      return {
        isCorrect: false,
        feedback: `Column projection mismatch: Expected ${expectedCols.length} column(s) (${expectedCols.join(', ')}), but your query returned ${userCols.length} column(s) (${userCols.join(', ')}).`,
        userResult,
        expectedResult,
        columnMismatch: true,
      };
    }

    // Check row count
    if (userResult.rowCount !== expectedResult.rowCount) {
      return {
        isCorrect: false,
        feedback: `Row count mismatch: Expected ${expectedResult.rowCount} row(s), but your query returned ${userResult.rowCount} row(s). Check your WHERE condition or JOIN clause.`,
        userResult,
        expectedResult,
        rowMismatch: true,
      };
    }

    // Check row content
    const isOrdered = question.topic === 'ORDER BY' || question.expectedQuery.toUpperCase().includes('ORDER BY');

    if (isOrdered) {
      // Must match row by row in exact order
      for (let i = 0; i < userResult.rows.length; i++) {
        const uRow = userResult.rows[i];
        const eRow = expectedResult.rows[i];

        for (let c = 0; c < expectedCols.length; c++) {
          const uVal = normalizeVal(uRow[userResult.columns[c]]);
          const eVal = normalizeVal(eRow[expectedResult.columns[c]]);
          if (uVal !== eVal) {
            return {
              isCorrect: false,
              feedback: `Row ${i + 1} mismatch: In column "${userResult.columns[c]}", expected value "${eVal}", but got "${uVal}". Verify your ORDER BY direction or filtering.`,
              userResult,
              expectedResult,
              rowMismatch: true,
            };
          }
        }
      }
    } else {
      // Set equality check (order does not matter)
      const expectedRowsSignatures = expectedResult.rows.map((r) =>
        expectedResult.columns.map((col) => normalizeVal(r[col])).sort().join('||')
      );
      const userRowsSignatures = userResult.rows.map((r) =>
        userResult.columns.map((col) => normalizeVal(r[col])).sort().join('||')
      );

      expectedRowsSignatures.sort();
      userRowsSignatures.sort();

      const matched = expectedRowsSignatures.every((sig, idx) => sig === userRowsSignatures[idx]);
      if (!matched) {
        return {
          isCorrect: false,
          feedback: `Data mismatch: The values returned in your output do not match the expected result set. Check your filtering conditions.`,
          userResult,
          expectedResult,
          rowMismatch: true,
        };
      }
    }

    return {
      isCorrect: true,
      feedback: 'Excellent! Your query produced the exact expected output relation.',
      userResult,
      expectedResult,
    };
  }

  // Case B: DML queries (INSERT, UPDATE, DELETE)
  if (question.queryType === 'DML') {
    const checkQuery =
      question.checkTableQuery ||
      (question.affectedTable ? `SELECT * FROM ${question.affectedTable};` : '');

    if (checkQuery) {
      const studentFinalState = executeSql(checkQuery, studentDb);
      const expectedFinalState = executeSql(checkQuery, expectedDb);

      const studentStr = JSON.stringify(studentFinalState.rows);
      const expectedStr = JSON.stringify(expectedFinalState.rows);

      if (studentStr === expectedStr) {
        return {
          isCorrect: true,
          feedback: `Outstanding! The ${question.affectedTable || 'database'} table was updated precisely as requested.`,
          userResult: studentFinalState,
          expectedResult: expectedFinalState,
        };
      } else {
        return {
          isCorrect: false,
          feedback: `The database state after execution does not match the expected state. Verify your SET values or WHERE clause.`,
          userResult: studentFinalState,
          expectedResult: expectedFinalState,
          rowMismatch: true,
        };
      }
    }

    return {
      isCorrect: true,
      feedback: 'Query executed successfully!',
      userResult,
      expectedResult,
    };
  }

  return {
    isCorrect: true,
    feedback: 'Query executed successfully!',
    userResult,
    expectedResult,
  };
}

/**
 * Returns current snapshot of all rows from a given table in the active database.
 */
export function getLiveTableRows(tableName: string): Record<string, any>[] {
  try {
    const db = getActiveDatabase();
    const result = db.exec(`SELECT * FROM ${tableName};`);
    return Array.isArray(result) ? result : [];
  } catch (err) {
    console.error('Failed to get table rows:', err);
    return [];
  }
}
