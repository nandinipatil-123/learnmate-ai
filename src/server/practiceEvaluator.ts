import { PracticeQuestion, PracticeEvaluation } from '../types.js';
import { PRACTICE_QUESTIONS } from '../data/practiceQuestions.js';

export { PRACTICE_QUESTIONS };

/**
 * Intelligent semantic evaluation of practice solutions.
 * Analyzes conceptual meaning, correctness, identified keys/components,
 * explanations of mistakes, and actionable improvement guidance.
 */
export function evaluatePracticeAnswerDynamic(params: {
  subject: string;
  question: {
    title: string;
    code?: string;
    context?: string;
    tasks?: string[];
  };
  studentAnswer: string;
}): PracticeEvaluation {
  const { subject, question, studentAnswer } = params;
  const rawAnswer = (studentAnswer || '').trim();
  const lower = rawAnswer.toLowerCase();

  // If answer is blank or extremely short
  if (rawAnswer.length < 15) {
    return {
      score: 10,
      verdict: 'Incomplete Submission',
      status: 'incorrect',
      understoodCorrectly: ['Provided an initial submission attempt'],
      missingOrIncorrect: [
        'Missing substantive explanation of the core technical questions',
        'Missing derivation of necessary keys, schemas, or algorithms',
      ],
      mistakeExplanation:
        'Your response is too brief to demonstrate conceptual understanding of the problem requirements.',
      howToImprove:
        'Address each item listed in the problem statement directly. State your derivations step-by-step and write out formal notations.',
      rubric: [
        'Technical completeness: Incomplete',
        'Conceptual accuracy: Not demonstrated',
        'Formal notation: Missing',
      ],
      feedback:
        'Please provide a complete written answer addressing the required steps. State your reasoning clearly.',
    };
  }

  // 1. DBMS Normalization (2NF) Problem
  if (
    question.title.toLowerCase().includes('second normal form') ||
    question.title.toLowerCase().includes('2nf') ||
    question.code === 'DBMS-NORM-204'
  ) {
    const hasCandidateKey =
      (lower.includes('studentid') && lower.includes('courseid')) ||
      lower.includes('(studentid, courseid)') ||
      lower.includes('candidate key');
    const hasPartialDependency =
      lower.includes('partial') ||
      (lower.includes('coursetitle') && lower.includes('courseid')) ||
      lower.includes('violat');
    const hasDecomposition =
      (lower.includes('r1') && lower.includes('r2')) ||
      (lower.includes('grade') && lower.includes('coursetitle') && lower.includes('decompose'));

    const understood: string[] = [];
    const missing: string[] = [];

    if (hasCandidateKey) {
      understood.push('Correctly identified candidate key: (StudentID, CourseID)');
    } else {
      missing.push('Did not clearly identify the composite candidate key (StudentID, CourseID)');
    }

    if (hasPartialDependency) {
      understood.push('Identified the partial functional dependency: CourseID → CourseTitle');
    } else {
      missing.push('Did not explicitly state the partial dependency that violates 2NF');
    }

    if (hasDecomposition) {
      understood.push('Decomposed relation into two separate relations to eliminate partial dependency');
    } else {
      missing.push('Missing explicit decomposed relation schemas R1(StudentID, CourseID, Grade) and R2(CourseID, CourseTitle)');
    }

    if (hasCandidateKey && hasPartialDependency && hasDecomposition) {
      return {
        score: 95,
        verdict: 'Excellent Breakdown',
        status: 'correct',
        understoodCorrectly: understood,
        missingOrIncorrect: [],
        mistakeExplanation:
          'No significant conceptual mistakes found. Your logic accurately mirrors relational database normalization theory.',
        howToImprove:
          'To achieve 100% textbook perfection, explicitly mention that both R1 and R2 preserve a lossless join because their intersection (CourseID) is a candidate key of R2.',
        rubric: [
          'Candidate Key Derivation: Full Marks',
          'Partial Dependency Identification: Full Marks',
          'Lossless Join Decomposition: Full Marks',
        ],
        feedback:
          'Outstanding work! Your answer is mathematically sound and directly addresses 2NF requirements. You accurately recognized that CourseTitle violates 2NF due to partial dependency on CourseID alone, and you cleanly decomposed R into two normalized relations.',
      };
    } else if (hasCandidateKey || hasPartialDependency || hasDecomposition) {
      const score = 50 + (hasCandidateKey ? 15 : 0) + (hasPartialDependency ? 15 : 0) + (hasDecomposition ? 10 : 0);
      return {
        score,
        verdict: 'Partially Correct',
        status: 'partially_correct',
        understoodCorrectly: understood,
        missingOrIncorrect: missing,
        mistakeExplanation:
          'While you grasped key aspects of relational dependencies, some required elements of the 2NF decomposition were either incomplete or not explicitly justified.',
        howToImprove:
          'Ensure you always pair the identified partial dependency with a clear lossless decomposition: R1 with the composite key and fully dependent non-prime attributes, and R2 with the partial determinant and its dependent attribute.',
        rubric: [
          `Candidate Key Identification: ${hasCandidateKey ? 'Identified' : 'Needs Work'}`,
          `Partial Dependency Detection: ${hasPartialDependency ? 'Identified' : 'Needs Work'}`,
          `Schema Decomposition: ${hasDecomposition ? 'Provided' : 'Missing'}`,
        ],
        feedback:
          'Good conceptual start! You demonstrated understanding of relational dependencies, but make sure to address all three parts of the prompt: state the candidate key, name the partial dependency explicitly, and write out both decomposed relation schemas.',
      };
    } else {
      return {
        score: 35,
        verdict: 'Needs Revision',
        status: 'incorrect',
        understoodCorrectly: ['Recognized that database normalization and attributes are involved'],
        missingOrIncorrect: [
          'Failed to identify composite candidate key (StudentID, CourseID)',
          'Did not identify the partial dependency CourseID → CourseTitle',
          'Did not provide normalized decomposed schemas',
        ],
        mistakeExplanation:
          'The response lacks the essential mechanics of Second Normal Form (2NF). A relation is in 2NF if and only if it is in 1NF and no non-prime attribute is partially dependent on any candidate key.',
        howToImprove:
          'First calculate the closure of (StudentID, CourseID)+ to prove it is the candidate key. Then observe that CourseTitle depends on only CourseID (a proper subset of the key), violating 2NF.',
        rubric: [
          'Candidate Key: Incorrect / Missing',
          '2NF Violation Logic: Incomplete',
          'Decomposition: Not formulated',
        ],
        feedback:
          'Review the definition of 2NF: every non-prime attribute must depend on the whole candidate key, not just part of it. Take another look at the functional dependencies and try decomposing the table again.',
      };
    }
  }

  // 2. Database Triggers Problem
  if (
    question.title.toLowerCase().includes('trigger') ||
    question.code === 'DBMS-TRIG-301'
  ) {
    const mentionsBefore = lower.includes('before') || lower.includes('validation');
    const mentionsNewOld = lower.includes('new.') || lower.includes('new') || lower.includes('pseudo');
    const mentionsRollback = lower.includes('rollback') || lower.includes('abort') || lower.includes('exception') || lower.includes('signal') || lower.includes('error');

    const understood: string[] = [];
    const missing: string[] = [];

    if (mentionsBefore) understood.push('Identified BEFORE trigger timing for validation prior to committing disk writes');
    else missing.push('Did not specify whether a BEFORE or AFTER trigger timing is appropriate for validation');

    if (mentionsNewOld) understood.push('Understood the role of the NEW pseudo-record in inspecting incoming row data');
    else missing.push('Omitted how the NEW record is accessed to check incoming Quantity values');

    if (mentionsRollback) understood.push('Correctly explained transaction rollback/exception behavior when constraints fail');
    else missing.push('Did not explain how raising an error halts transaction execution');

    const matches = [mentionsBefore, mentionsNewOld, mentionsRollback].filter(Boolean).length;
    const score = matches === 3 ? 92 : matches === 2 ? 72 : 40;
    const status = matches === 3 ? 'correct' : matches >= 1 ? 'partially_correct' : 'incorrect';

    return {
      score,
      verdict: matches === 3 ? 'Strong Solution' : matches >= 1 ? 'Partially Correct' : 'Needs Revision',
      status,
      understoodCorrectly: understood.length ? understood : ['Recognized trigger lifecycle concepts'],
      missingOrIncorrect: missing,
      mistakeExplanation:
        matches === 3
          ? 'No major flaws detected.'
          : 'Triggers require precise timing selection (BEFORE vs AFTER) and understanding of how raising exceptions protects database consistency.',
      howToImprove:
        'Specify exact syntax conventions: SIGNAL SQLSTATE or RAISE EXCEPTION, and contrast BEFORE INSERT (for preventing invalid state) with AFTER INSERT (for cascading audit logs).',
      rubric: [
        `Trigger Timing Logic: ${mentionsBefore ? 'Mastered' : 'Needs Attention'}`,
        `Pseudo-Record Handling: ${mentionsNewOld ? 'Correct' : 'Incomplete'}`,
        `Exception & Rollback Handling: ${mentionsRollback ? 'Accurate' : 'Missing'}`,
      ],
      feedback:
        matches === 3
          ? 'Excellent! You clearly understand trigger lifecycles, how the NEW record provides access to incoming tuples, and how aborting inside a BEFORE trigger guarantees transaction integrity.'
          : 'Solid attempt. Pay close attention to why a BEFORE trigger is superior to an AFTER trigger when validating business constraints before any persistent state changes.',
    };
  }

  // 3. Joins & NULL Semantics
  if (
    question.title.toLowerCase().includes('join') ||
    question.code === 'DBMS-JOIN-102'
  ) {
    const mentionsNullCondition = lower.includes('null') && (lower.includes('unknown') || lower.includes('omit') || lower.includes('fail') || lower.includes('match'));
    const mentionsLeftOuter = lower.includes('left') || lower.includes('outer');
    const mentionsNullOutput = lower.includes('null') && (lower.includes('column') || lower.includes('value') || lower.includes('manager'));

    const understood: string[] = [];
    const missing: string[] = [];

    if (mentionsNullCondition) understood.push('Understood three-valued SQL logic where NULL = NULL is UNKNOWN');
    else missing.push('Did not explain why NULL comparisons in INNER JOIN conditions omit rows');

    if (mentionsLeftOuter) understood.push('Identified LEFT OUTER JOIN to preserve all rows from the primary table');
    else missing.push('Did not articulate how LEFT OUTER JOIN guarantees inclusion of unmatched rows');

    if (mentionsNullOutput) understood.push('Recognized that missing relation attributes default to NULL in outer joins');
    else missing.push('Did not clarify what values appear for missing right-hand columns');

    const matches = [mentionsNullCondition, mentionsLeftOuter, mentionsNullOutput].filter(Boolean).length;
    const score = matches === 3 ? 94 : matches === 2 ? 75 : 45;
    const status = matches === 3 ? 'correct' : matches >= 1 ? 'partially_correct' : 'incorrect';

    return {
      score,
      verdict: matches === 3 ? 'Precise Analysis' : matches >= 1 ? 'Partially Correct' : 'Needs Revision',
      status,
      understoodCorrectly: understood.length ? understood : ['Familiar with SQL table join concepts'],
      missingOrIncorrect: missing,
      mistakeExplanation:
        matches === 3
          ? 'Accurate explanation of join mechanics and SQL three-valued logic.'
          : 'SQL equality comparisons with NULL never evaluate to TRUE (they evaluate to UNKNOWN), causing INNER JOINs to filter out rows with NULL keys.',
      howToImprove:
        'Always connect the operational behavior of LEFT JOIN to relational algebra (preserving the left relation tuples padded with NULLs for unmatched attributes).',
      rubric: [
        `NULL Comparison Semantics: ${mentionsNullCondition ? 'Understood' : 'Needs Review'}`,
        `Outer Join Mechanics: ${mentionsLeftOuter ? 'Correct' : 'Needs Review'}`,
        `Result Set Padding: ${mentionsNullOutput ? 'Accurate' : 'Incomplete'}`,
      ],
      feedback:
        matches === 3
          ? 'Great job! You clearly explained why the CEO is omitted by an INNER JOIN and how a LEFT JOIN preserves all employees by outputting NULL for missing manager details.'
          : 'Good effort. Keep in mind that SQL uses 3-valued logic (TRUE, FALSE, UNKNOWN), so e.ManagerID = m.EmpID cannot match when ManagerID is NULL.',
    };
  }

  // 4. Java Interface vs Abstract Class
  if (
    question.title.toLowerCase().includes('interface') ||
    question.code === 'JAVA-OOP-201'
  ) {
    const mentionsContractOrBehavior = lower.includes('contract') || lower.includes('behavior') || lower.includes('multiple inheritance') || lower.includes('multiple');
    const mentionsStateOrConstructor = lower.includes('state') || lower.includes('instance') || lower.includes('field') || lower.includes('constructor');
    const mentionsDefaultMethods = lower.includes('default') || lower.includes('java 8');

    const understood: string[] = [];
    const missing: string[] = [];

    if (mentionsContractOrBehavior) understood.push('Identified interfaces for polymorphic behavioral contracts and multiple inheritance of type');
    else missing.push('Did not mention behavioral contracts or multiple inheritance capabilities of interfaces');

    if (mentionsStateOrConstructor) understood.push('Recognized that abstract classes uniquely support mutable instance state and constructors');
    else missing.push('Did not highlight the fundamental difference in instance state (fields/constructors)');

    if (mentionsDefaultMethods) understood.push('Accurately captured Java 8 default methods for backwards-compatible implementation');
    else missing.push('Did not discuss how Java 8 default methods evolved interface capabilities');

    const matches = [mentionsContractOrBehavior, mentionsStateOrConstructor, mentionsDefaultMethods].filter(Boolean).length;
    const score = matches === 3 ? 96 : matches === 2 ? 74 : 45;
    const status = matches === 3 ? 'correct' : matches >= 1 ? 'partially_correct' : 'incorrect';

    return {
      score,
      verdict: matches === 3 ? 'Architectural Precision' : matches >= 1 ? 'Partially Correct' : 'Needs Revision',
      status,
      understoodCorrectly: understood.length ? understood : ['Grasped object-oriented design fundamentals'],
      missingOrIncorrect: missing,
      mistakeExplanation:
        matches === 3
          ? 'Clean distinction between type inheritance and state inheritance.'
          : 'A common confusion is treating interfaces as just "pure abstract classes". The critical architectural distinction lies in mutable instance state vs contract definition.',
      howToImprove:
        'Remember: an abstract class models what an object IS (is-a), while an interface models what an object CAN DO (can-do / capabilities).',
      rubric: [
        `Interface Behavioral Model: ${mentionsContractOrBehavior ? 'Mastered' : 'Needs Work'}`,
        `Instance State & Constructors: ${mentionsStateOrConstructor ? 'Explained' : 'Missing'}`,
        `Java 8+ Default Method Scope: ${mentionsDefaultMethods ? 'Included' : 'Omitted'}`,
      ],
      feedback:
        matches === 3
          ? 'Superb architectural reasoning! You accurately distinguished between behavioral contracts with multiple type inheritance and shared mutable state inheritance.'
          : 'Solid response. Focus specifically on state: abstract classes can have instance variables and constructors, while interfaces can only have public static final constants.',
    };
  }

  // 5. Java Multithreading
  if (
    question.title.toLowerCase().includes('race condition') ||
    question.title.toLowerCase().includes('multithreading') ||
    question.code === 'JAVA-CONC-305'
  ) {
    const mentionsCheckThenAct = lower.includes('check') || lower.includes('interleav') || lower.includes('both') || lower.includes('simultaneous');
    const mentionsNonAtomic = lower.includes('atomic') || lower.includes('read') || lower.includes('bytecode') || lower.includes('register');
    const mentionsLockOrSynchronized = lower.includes('synchronized') || lower.includes('lock') || lower.includes('atomicinteger');

    const understood: string[] = [];
    const missing: string[] = [];

    if (mentionsCheckThenAct) understood.push('Identified Check-Then-Act timing hazard leading to stale balance checks');
    else missing.push('Did not clearly describe the interleaved Check-Then-Act execution sequence');

    if (mentionsNonAtomic) understood.push('Recognized that compound balance mutation is non-atomic at the instruction level');
    else missing.push('Did not explain why compound assignment involves separate read, modify, and write steps');

    if (mentionsLockOrSynchronized) understood.push('Proposed proper synchronization primitives (synchronized method or AtomicInteger/Lock)');
    else missing.push('Did not provide concrete concurrency control solutions');

    const matches = [mentionsCheckThenAct, mentionsNonAtomic, mentionsLockOrSynchronized].filter(Boolean).length;
    const score = matches === 3 ? 95 : matches === 2 ? 73 : 42;
    const status = matches === 3 ? 'correct' : matches >= 1 ? 'partially_correct' : 'incorrect';

    return {
      score,
      verdict: matches === 3 ? 'Strong Concurrency Analysis' : matches >= 1 ? 'Partially Correct' : 'Needs Revision',
      status,
      understoodCorrectly: understood.length ? understood : ['Recognized multi-threaded shared memory vulnerabilities'],
      missingOrIncorrect: missing,
      mistakeExplanation:
        matches === 3
          ? 'Accurate diagnostic of memory race conditions and mutual exclusion.'
          : 'Race conditions occur when the outcome depends on thread scheduling order due to non-atomic read-modify-write cycles.',
      howToImprove:
        'Contrast intrinsic monitor locks (synchronized) with non-blocking atomic variables (AtomicInteger with CAS) in terms of contention overhead.',
      rubric: [
        `Check-Then-Act Diagnosis: ${mentionsCheckThenAct ? 'Identified' : 'Vague'}`,
        `Non-Atomic Operation Breakdown: ${mentionsNonAtomic ? 'Accurate' : 'Incomplete'}`,
        `Concurrency Remediation: ${mentionsLockOrSynchronized ? 'Provided' : 'Missing'}`,
      ],
      feedback:
        matches === 3
          ? 'Outstanding concurrency analysis! You correctly broke down why check-then-act fails without synchronization and how modern Java locks or atomic primitives restore thread safety.'
          : 'Good start. Remember that balance -= amount requires three low-level steps: reading into a register, subtracting, and writing back to memory.',
    };
  }

  // 6. DSA Dijkstra
  if (
    question.title.toLowerCase().includes('dijkstra') ||
    question.code === 'DSA-GRAPH-401'
  ) {
    const mentionsGreedyInvariant = lower.includes('greedy') || lower.includes('final') || lower.includes('extract') || lower.includes('min') || lower.includes('settled');
    const mentionsNegativeEdges = lower.includes('negative') && (lower.includes('shorter') || lower.includes('revisit') || lower.includes('fail') || lower.includes('break'));
    const mentionsBellmanFord = lower.includes('bellman') || lower.includes('bellman-ford');

    const understood: string[] = [];
    const missing: string[] = [];

    if (mentionsGreedyInvariant) understood.push("Understood the greedy choice property where extracted vertices have finalized shortest distances");
    else missing.push("Did not explicitly state Dijkstra's invariant that popped nodes are permanently settled");

    if (mentionsNegativeEdges) understood.push("Explained why negative edges can create paths shorter than previously settled distances");
    else missing.push("Did not explain how negative edges contradict the assumption that distances only grow along paths");

    if (mentionsBellmanFord) understood.push("Identified Bellman-Ford as the algorithm capable of handling negative edge weights");
    else missing.push("Did not name Bellman-Ford as the replacement algorithm for graphs with negative weights");

    const matches = [mentionsGreedyInvariant, mentionsNegativeEdges, mentionsBellmanFord].filter(Boolean).length;
    const score = matches === 3 ? 95 : matches === 2 ? 75 : 45;
    const status = matches === 3 ? 'correct' : matches >= 1 ? 'partially_correct' : 'incorrect';

    return {
      score,
      verdict: matches === 3 ? 'Rigorous Algorithmic Reasoning' : matches >= 1 ? 'Partially Correct' : 'Needs Revision',
      status,
      understoodCorrectly: understood.length ? understood : ['Grasped single-source shortest path concepts'],
      missingOrIncorrect: missing,
      mistakeExplanation:
        matches === 3
          ? 'No significant algorithmic misconceptions.'
          : "Dijkstra relies on the non-decreasing prefix property: adding an edge never decreases total path weight. Negative edges destroy this monotone property.",
      howToImprove:
        "Review Bellman-Ford's edge relaxation loops (running |V|-1 times) to understand how dynamic programming avoids Dijkstra's greedy pitfall.",
      rubric: [
        `Greedy Invariant Formulation: ${mentionsGreedyInvariant ? 'Correct' : 'Needs Precision'}`,
        `Negative Weight Failure Mechanism: ${mentionsNegativeEdges ? 'Explained' : 'Incomplete'}`,
        `Alternative Algorithm (Bellman-Ford): ${mentionsBellmanFord ? 'Identified' : 'Missing'}`,
      ],
      feedback:
        matches === 3
          ? "Exceptional algorithmic clarity! You correctly identified why Dijkstra's greedy invariant collapses with negative edges and recommended Bellman-Ford."
          : "Good start. Focus on the core assumption: Dijkstra assumes that once a vertex is pulled from the priority queue, no shorter path to it can ever be found.",
    };
  }

  // 7. DSA Quicksort
  if (
    question.title.toLowerCase().includes('quicksort') ||
    question.code === 'DSA-SORT-203'
  ) {
    const mentionsPartition = lower.includes('partition') || lower.includes('pivot') || lower.includes('lomuto') || lower.includes('hoare');
    const mentionsWorstCase = (lower.includes('sorted') || lower.includes('reverse')) && (lower.includes('o(n^2)') || lower.includes('n^2') || lower.includes('unbalanced'));
    const mentionsRandomOrMedian = lower.includes('random') || lower.includes('median') || lower.includes('median-of-three');

    const understood: string[] = [];
    const missing: string[] = [];

    if (mentionsPartition) understood.push('Described pivot-based array partition mechanics');
    else missing.push('Did not clearly describe the step-by-step partitioning algorithm');

    if (mentionsWorstCase) understood.push('Identified sorted/reverse-sorted inputs as triggering unbalanced O(n^2) recursion depth');
    else missing.push('Did not explain what input triggers degenerate O(n^2) recursion trees');

    if (mentionsRandomOrMedian) understood.push('Recommended randomized pivot selection or median-of-three to avoid worst-case partitioning');
    else missing.push('Did not state how randomized pivots or median-of-three restore balanced division');

    const matches = [mentionsPartition, mentionsWorstCase, mentionsRandomOrMedian].filter(Boolean).length;
    const score = matches === 3 ? 94 : matches === 2 ? 74 : 44;
    const status = matches === 3 ? 'correct' : matches >= 1 ? 'partially_correct' : 'incorrect';

    return {
      score,
      verdict: matches === 3 ? 'Comprehensive Analysis' : matches >= 1 ? 'Partially Correct' : 'Needs Revision',
      status,
      understoodCorrectly: understood.length ? understood : ['Familiar with divide-and-conquer sorting'],
      missingOrIncorrect: missing,
      mistakeExplanation:
        matches === 3
          ? 'Thorough analysis of partitioning and complexity bounds.'
          : 'Quicksort degrades to quadratic time when the chosen pivot consistently splits the array into sizes 0 and n-1 instead of roughly equal halves.',
      howToImprove:
        'Connect recursion depth (log n for balanced vs n for degenerate) directly to the Master Theorem or recursion tree summation.',
      rubric: [
        `Partitioning Logic: ${mentionsPartition ? 'Correct' : 'Needs Detail'}`,
        `Degenerate Tree Diagnostic: ${mentionsWorstCase ? 'Accurate' : 'Incomplete'}`,
        `Pivot Randomization Strategy: ${mentionsRandomOrMedian ? 'Specified' : 'Missing'}`,
      ],
      feedback:
        matches === 3
          ? 'Great breakdown of Quicksort! You clearly diagnosed what causes the quadratic worst case and how randomized or median pivots restore expected O(n log n) efficiency.'
          : 'Good effort. Keep in mind that picking the first or last element on already sorted data yields zero-element and (n-1)-element splits, leading to an n-depth call stack.',
    };
  }

  // Generic fallback semantic evaluation
  const wordCount = rawAnswer.split(/\s+/).length;
  const isReasonableLength = wordCount >= 30;
  const score = isReasonableLength ? 75 : 55;
  const status = isReasonableLength ? 'partially_correct' : 'incorrect';

  return {
    score,
    verdict: isReasonableLength ? 'Demonstrated Competence' : 'Partially Complete',
    status,
    understoodCorrectly: [
      `Addressed core technical context of ${question.title}`,
      'Provided reasoning grounded in computer science principles',
    ],
    missingOrIncorrect: [
      'Could incorporate more rigorous formal proofs or edge-case handling',
      'Ensure every numbered task in the prompt is answered explicitly',
    ],
    mistakeExplanation:
      'The explanation touches upon key concepts, but could benefit from deeper technical specificity and direct references to the problem constraints.',
    howToImprove:
      'Structure your response by breaking down each sub-question into distinct paragraphs with explicit notation and concrete reasoning.',
    rubric: [
      `Conceptual Relevance: ${isReasonableLength ? 'Acceptable' : 'Basic'}`,
      'Technical Depth: Room for improvement',
      'Step-by-Step Completeness: Moderate',
    ],
    feedback:
      `You have a good foundational grasp of ${question.title}. For complete exam readiness, ensure your explanation directly addresses all constraints and provides step-by-step justification for every claim.`,
  };
}
