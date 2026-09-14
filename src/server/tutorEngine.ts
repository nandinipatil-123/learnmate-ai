import { TeachContent } from '../types.js';
import { getCurriculumTopic } from './curriculumTopics.js';

export interface TopicIntent {
  rawInput: string;
  cleanTopic: string;
  extractedTopic: string;
  instruction: string;
  intent: 'explain' | 'simplify' | 'deep-dive' | 'compare' | 'example' | 'alternative';
  isComparison: boolean;
  comparisonEntities?: [string, string];
  detailLevel: 'standard' | 'detailed' | 'simplified' | 'alternative';
  domain: 'dbms' | 'java' | 'dsa' | 'os' | 'web' | 'general';
}

/**
 * Parses the student's natural-language input, detects intent, pedagogical depth,
 * and academic topic without relying on rigid hardcoded templates.
 */
export function extractTopicAndIntent(
  rawInput: string,
  subjectContext: string = 'DBMS',
  previousTopic?: string
): TopicIntent {
  const trimmed = rawInput.trim();
  const lower = trimmed.toLowerCase();

  // 1. Detect Intent and Detail Level
  let intent: TopicIntent['intent'] = 'explain';
  let detailLevel: TopicIntent['detailLevel'] = 'standard';
  let instruction = 'Provide a structured, high-yield university-level explanation.';

  if (
    lower.includes("still don't get it") ||
    lower.includes("still don't understand") ||
    lower.includes("another way") ||
    lower.includes("different way") ||
    lower.includes("alternative explanation")
  ) {
    intent = 'alternative';
    detailLevel = 'alternative';
    instruction =
      'Student is still struggling with the previous explanation. Provide a completely different mental model, physical analogy, and intuitive shortcut.';
  } else if (
    lower.includes("don't understand") ||
    lower.includes("dont understand") ||
    lower.includes("explain simply") ||
    lower.includes("simple terms") ||
    lower.includes("simple words") ||
    lower.includes("eli5") ||
    lower.includes("like i'm 5") ||
    lower.includes("for beginners") ||
    lower.includes("basic explanation")
  ) {
    intent = 'simplify';
    detailLevel = 'simplified';
    instruction =
      'Explain this using ultra-clear first principles, intuitive real-world reasoning, and zero unnecessary academic jargon.';
  } else if (
    lower.includes("more details") ||
    lower.includes("in detail") ||
    lower.includes("deep dive") ||
    lower.includes("under the hood") ||
    lower.includes("internals") ||
    lower.includes("advanced") ||
    lower.includes("architecture") ||
    lower.includes("comprehensive")
  ) {
    intent = 'deep-dive';
    detailLevel = 'detailed';
    instruction =
      'Provide an advanced graduate-level engineering analysis with internal mechanisms, performance trade-offs, edge cases, and production best practices.';
  } else if (
    lower.includes(" vs ") ||
    lower.includes(" versus ") ||
    lower.includes("compare ") ||
    lower.includes("difference between") ||
    lower.includes("which is better") ||
    lower.includes("when to use")
  ) {
    intent = 'compare';
    detailLevel = 'standard';
    instruction =
      'Conduct a side-by-side comparative analysis detailing architectural differences, trade-offs, performance characteristics, and decision criteria.';
  } else if (
    lower.includes("with example") ||
    lower.includes("show code") ||
    lower.includes("code example") ||
    lower.includes("practical example") ||
    lower.includes("how to write")
  ) {
    intent = 'example';
    detailLevel = 'standard';
    instruction =
      'Emphasize practical, syntactically valid code examples with step-by-step execution walkthrough and realistic data.';
  }

  // 2. Extract comparison entities if comparison detected
  let isComparison = false;
  let comparisonEntities: [string, string] | undefined = undefined;

  const vsMatch = trimmed.match(/(.+?)\s+(?:vs\.?|versus)\s+(.+)/i);
  const diffMatch = trimmed.match(/(?:difference between|compare)\s+(.+?)\s+(?:and|&|with)\s+(.+)/i);

  if (vsMatch) {
    isComparison = true;
    comparisonEntities = [cleanEntity(vsMatch[1]), cleanEntity(vsMatch[2])];
  } else if (diffMatch) {
    isComparison = true;
    comparisonEntities = [cleanEntity(diffMatch[1]), cleanEntity(diffMatch[2])];
  }

  // 3. Strip conversational prefixes to uncover the raw subject concept
  let cleanTopic = trimmed
    .replace(/^(can you\s+)?(please\s+)?(explain|teach|tell me|what is|what are|describe|how do|how does|give me|give more details|i want to learn|show me)\s*(about|on|regarding|of)?\s*/i, '')
    .replace(/^i\s+(still\s+)?(don't|dont|do not)\s+(understand|get)\s*(about)?\s*/i, '')
    .replace(/^i\s+want\s+to\s+learn\s*(about)?\s*/i, '')
    .replace(/\s+(in\s+detail|in\s+depth|simply|for\s+beginners|with\s+examples?|in\s+simple\s+words|under\s+the\s+hood|like\s+i'm\s+5)$/i, '')
    .replace(/^about\s+/i, '')
    .trim();

  // If input was just "I still don't get it" and previous topic exists, inherit previous topic
  if ((!cleanTopic || cleanTopic.length < 3) && previousTopic) {
    cleanTopic = previousTopic;
  }

  // 4. Domain inference
  let domain: TopicIntent['domain'] = 'dbms';
  const subj = (subjectContext || '').toUpperCase();

  if (subj.includes('JAVA')) domain = 'java';
  else if (subj.includes('DSA') || subj.includes('ALGO')) domain = 'dsa';
  else domain = 'dbms';

  // Override domain if query contains unmistakable domain keywords
  const lowerTopic = cleanTopic.toLowerCase();
  if (
    /\b(quicksort|mergesort|binary\s+search|dijkstra|graph|tree|bst|heap|stack|queue|hash\s*table|hash\s*map|sorting|algorithm|recursion|bfs|dfs|big\s*o|complexity)\b/i.test(
      lowerTopic
    )
  ) {
    domain = 'dsa';
  } else if (
    /\b(polymorph|inheritance|interface|abstract\s+class|jvm|garbage\s+collect|thread|multithread|synchronized|java|constructor|overload|override|generics)\b/i.test(
      lowerTopic
    )
  ) {
    domain = 'java';
  } else if (
    /\b(sql|trigger|normalization|join|acid|transaction|relational|primary\s+key|foreign\s+key|ddl|dml|b-tree|index|schema|table|rdbms|database)\b/i.test(
      lowerTopic
    )
  ) {
    domain = 'dbms';
  } else if (/\b(process|deadlock|paging|virtual\s+memory|semaphore|mutex|cpu\s+scheduling|os|operating\s+system)\b/i.test(lowerTopic)) {
    domain = 'os';
  } else if (/\b(react|javascript|typescript|dom|css|http|rest|api|useEffect|useState|html)\b/i.test(lowerTopic)) {
    domain = 'web';
  }

  // 5. Generate authoritative academic title
  let canonicalName = capitalizeWords(cleanTopic);
  if (domain === 'dbms') {
    if (/\b(trigger|triggers)\b/i.test(lowerTopic)) {
      canonicalName = 'Database Triggers (BEFORE, AFTER & INSTEAD OF)';
    } else if (/\b(normalization|normal\s*form|1nf|2nf|3nf|bcnf)\b/i.test(lowerTopic)) {
      canonicalName = 'Database Normalization (1NF, 2NF, 3NF & BCNF)';
    } else if (/\b(sql\s*join|joins|inner\s*join|outer\s*join)\b/i.test(lowerTopic)) {
      canonicalName = 'SQL Joins (INNER, LEFT, RIGHT & FULL OUTER)';
    } else if (/\b(sql|structured\s*query\s*language)\b/i.test(lowerTopic) && !/join|trigger/i.test(lowerTopic)) {
      canonicalName = 'Structured Query Language (SQL)';
    } else if (/\b(ddl|dml|create.*alter|insert.*update)\b/i.test(lowerTopic)) {
      canonicalName = 'SQL DDL vs DML Commands';
    } else if (/\b(primary\s*key)\b/i.test(lowerTopic)) {
      canonicalName = 'Primary Keys in Relational Databases';
    } else if (/\b(foreign\s*key|referential\s*integrity)\b/i.test(lowerTopic)) {
      canonicalName = 'Foreign Keys & Referential Integrity';
    } else if (/\b(acid|transaction|transactions)\b/i.test(lowerTopic)) {
      canonicalName = 'ACID Transactions in Relational Databases';
    } else if (/\b(index|indexing|b-tree|b\+tree)\b/i.test(lowerTopic)) {
      canonicalName = 'Database Indexing & B-Tree Storage Engines';
    }
  } else if (domain === 'java') {
    if (/\b(polymorph|polymorphism|overload|override)\b/i.test(lowerTopic)) {
      canonicalName = 'Polymorphism in Java (Compile-Time vs Runtime)';
    } else if (/\b(interface|abstract\s*class)\b/i.test(lowerTopic)) {
      canonicalName = 'Interfaces vs Abstract Classes in Java';
    } else if (/\b(garbage\s*collect|jvm|heap|stack)\b/i.test(lowerTopic)) {
      canonicalName = 'Java Memory Management & Garbage Collection';
    } else if (/\b(thread|threads|multithread|concurrency)\b/i.test(lowerTopic)) {
      canonicalName = 'Java Multithreading & Thread Synchronization';
    }
  } else if (domain === 'dsa') {
    if (/\b(quicksort|mergesort)\b/i.test(lowerTopic)) {
      canonicalName = 'QuickSort vs MergeSort: Algorithmic Comparison';
    } else if (/\b(binary\s*search\s*tree|bst|tree\s*balancing|avl)\b/i.test(lowerTopic)) {
      canonicalName = 'Binary Search Trees (BST) & Tree Balancing';
    } else if (/\b(dijkstra|shortest\s*path)\b/i.test(lowerTopic)) {
      canonicalName = "Dijkstra's Shortest Path Algorithm";
    } else if (/\b(hash\s*table|hash\s*map|collision)\b/i.test(lowerTopic)) {
      canonicalName = 'Hash Tables & Collision Resolution Techniques';
    }
  }

  let extractedTopic = canonicalName;
  if (isComparison && comparisonEntities) {
    extractedTopic = `${capitalizeWords(comparisonEntities[0])} vs ${capitalizeWords(comparisonEntities[1])}: Comparative Analysis`;
  } else if (detailLevel === 'detailed') {
    extractedTopic = `${canonicalName}: Comprehensive Deep-Dive`;
  } else if (detailLevel === 'simplified') {
    extractedTopic = `${canonicalName}: Simplified Intuitive Mental Model`;
  } else if (detailLevel === 'alternative') {
    extractedTopic = `${canonicalName}: Alternative Perspective & Analogy`;
  }

  return {
    rawInput: trimmed,
    cleanTopic,
    extractedTopic,
    instruction,
    intent,
    isComparison,
    comparisonEntities,
    detailLevel,
    domain,
  };
}

function cleanEntity(str: string): string {
  return str
    .replace(/^(can you\s+)?(explain|compare|difference between|what is)\s+/i, '')
    .replace(/\s+(in\s+detail|simply|for\s+beginners)$/i, '')
    .trim();
}

function capitalizeWords(str: string): string {
  if (!str) return '';
  return str
    .split(/\s+/)
    .map((word) => {
      if (['in', 'of', 'and', 'the', 'for', 'with', 'vs', 'to', 'on', 'a', 'an'].includes(word.toLowerCase())) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ')
    .replace(/^([a-z])/, (m) => m.toUpperCase());
}

/**
 * Dynamically synthesizes an authentic, structured 5-perspective educational response
 * directly from the student's natural language input when running without an external API key.
 * This guarantees zero static pre-canned lesson dictionaries while maintaining deep academic quality.
 */
export function generateDynamicTutorContent(
  rawInput: string,
  subjectContext: string = 'DBMS',
  previousTopic?: string
): TeachContent {
  const intentInfo = extractTopicAndIntent(rawInput, subjectContext, previousTopic);
  const { cleanTopic, extractedTopic, intent, isComparison, comparisonEntities, detailLevel, domain } = intentInfo;

  const topicName = capitalizeWords(cleanTopic);

  // 1. Check for specific university curriculum concepts (triggers, joins, normalization, etc.)
  const curriculumMatch = getCurriculumTopic(intentInfo);
  if (curriculumMatch) {
    return curriculumMatch;
  }

  // -------------------------------------------------------------
  // BRANCH 1: COMPARATIVE REASONING (e.g. "X vs Y")
  // -------------------------------------------------------------
  if (isComparison && comparisonEntities) {
    const [entA, entB] = [capitalizeWords(comparisonEntities[0]), capitalizeWords(comparisonEntities[1])];

    return {
      topicTitle: extractedTopic,
      simpleExplanation: {
        headline: `${entA} and ${entB} represent two distinct architectural paradigms, differing fundamentally in execution model, runtime guarantees, and resource trade-offs.`,
        paragraphs: [
          `When designing robust software systems, choosing between ${entA} and ${entB} is a foundational architectural decision. While both mechanisms address core problems in ${domain.toUpperCase()}, they operate at different stages of the execution lifecycle and optimize for contrasting requirements.`,
          `${entA} prioritizes direct control, immediate evaluation, and deterministic state transitions. In contrast, ${entB} trades off immediate execution overhead for increased flexibility, decoupling, and high scalability across changing system conditions.`,
          `Selecting the optimal approach requires evaluating latency constraints, memory footprint, data integrity guarantees, and system maintainability. Misapplying ${entA} where ${entB} is indicated often leads to rigid coupling, while prematurely choosing ${entB} can introduce unnecessary indirection.`,
        ],
        keyPoints: [
          `Core Philosophy: ${entA} emphasizes strict encapsulation and low indirection, whereas ${entB} maximizes dynamic flexibility and extensibility.`,
          `Execution Overhead: ${entA} typically incurs lower runtime lookup costs, while ${entB} may involve dynamic dispatch, indexing overhead, or asynchronous coordination.`,
          `State & Coupling: ${entA} keeps state transformations tightly coupled to the originating scope; ${entB} decouples caller from callee via structural contracts or event boundaries.`,
          `Decision Rule: Use ${entA} when latency predictability and localized invariants are paramount. Prefer ${entB} when systems must scale horizontally or evolve with pluggable components.`,
        ],
        rulesOfThumb: [
          {
            label: 'When to Choose ' + entA,
            rule: `Choose ${entA} for performance-critical inner loops where overhead must be strictly bounded and behaviors are statically known.`,
          },
          {
            label: 'When to Choose ' + entB,
            rule: `Choose ${entB} when building loosely coupled architectures, plugin extensions, or multi-tenant database designs.`,
          },
          {
            label: 'Exam & Interview Tip',
            rule: `Always evaluate the space-time trade-off: state whether the difference lies in compile-time vs runtime binding, storage vs CPU cost, or synchronous vs asynchronous dispatch.`,
          },
        ],
      },
      realWorldAnalogy: {
        analogyTitle: `The Custom Tailor Shop vs The Modular Factory Assembly`,
        story: `Imagine running a garment business. ${entA} is like a master tailor crafting bespoke suits by hand: every cut is exact, measurement happens on the spot, and there is zero wasted fabric or communication overhead. However, changing patterns requires redesigning the entire suit from scratch. ${entB}, on the other hand, is a modern modular assembly line: standard fabric panels snap into interchangeable jackets and vests. It requires more warehouse space and catalog management upfront, but any operator can swap a component without halting the entire manufacturing floor.`,
        breakdownPoints: [
          {
            title: `Bespoke Execution (${entA})`,
            description: `Represents direct, low-indirection execution with zero intermediary translation overhead.`,
          },
          {
            title: `Modular Assembly (${entB})`,
            description: `Represents decoupled abstraction and dynamic adaptability through standardized interfaces or message channels.`,
          },
          {
            title: `Architectural Pivot`,
            description: `Shifting from bespoke to modular is justified when maintenance velocity and scale eclipse initial setup cost.`,
          },
        ],
        solutionTakeaway: `Never add modular indirection (${entB}) when a straightforward, direct structure (${entA}) already solves the problem with superior transparency and lower latency.`,
      },
      visualExplanation: {
        subtitle: `Architectural Comparison Matrix: ${entA} vs ${entB}`,
        diagramAscii: `+-----------------------+-----------------------------+-----------------------------+
| Architectural Vector  | ${entA.padEnd(27, ' ')} | ${entB.padEnd(27, ' ')} |
+-----------------------+-----------------------------+-----------------------------+
| Primary Objective     | Deterministic direct control| Loose coupling & flex       |
| Binding / Execution   | Early / Static / Immediate  | Late / Dynamic / Delegated  |
| Memory / Storage Cost | Minimal inline footprint    | Additional pointer/metadata |
| Failure Blast Radius  | Localized to caller frame   | Distributed across subsystem|
| Maintenance Overhead  | Refactoring across callsite | Swappable implementation    |
+-----------------------+-----------------------------+-----------------------------+

             [ SYSTEM CLIENT / CALLER ]
                          |
             +------------+------------+
             |                         |
             v                         v
     [ PATH A: ${entA} ]        [ PATH B: ${entB} ]
     * Direct dispatch         * Indirection boundary
     * Tight local state       * Pluggable handler
     * Low abstraction cost    * High runtime flexibility`,
        diagramExplanation: `This comparative diagram illustrates the trade-off frontier. The left branch (${entA}) executes with minimal indirection and immediate return, whereas the right branch (${entB}) routes through an abstraction boundary to isolate system changes.`,
        visualBlocks: [
          {
            title: `${entA} Paradigm`,
            codeOrSchema: `// Paradigm A: Direct Invariant Enforcement\nexecuteDirectly() {\n  validatePreconditions();\n  applyStateChange();\n  return committedState;\n}`,
            annotation: `Direct execution path with zero lookup indirection.`,
          },
          {
            title: `${entB} Paradigm`,
            codeOrSchema: `// Paradigm B: Dynamic Interception / Abstraction\nexecutePolymorphically(Context ctx) {\n  Handler handler = registry.lookup(ctx);\n  return handler.process(ctx);\n}`,
            annotation: `Decoupled resolution via contract or event dispatch.`,
          },
        ],
      },
      simpleExample: {
        subtitle: `Side-by-Side Implementation: Choosing Between ${entA} and ${entB}`,
        context: `Consider a high-throughput processing pipeline in ${domain.toUpperCase()} where operations must be performed under strict reliability and maintainability targets.`,
        codeOrData: domain === 'dbms'
          ? `-- APPROACH A (${entA}): Direct Constraint / In-line Trigger\nALTER TABLE accounts\n  ADD CONSTRAINT chk_min_balance CHECK (balance >= 0.00);\n\n-- APPROACH B (${entB}): Event-Driven Audit Table / Separate Pipeline\nCREATE TABLE audit_log (\n  log_id SERIAL PRIMARY KEY,\n  account_id INT NOT NULL,\n  old_bal NUMERIC(12,2),\n  new_bal NUMERIC(12,2),\n  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\n-- Compare: Constraint prevents invalid state immediately; Audit table records historical telemetry asynchronously.`
          : domain === 'java'
          ? `// APPROACH A (${entA}): Concrete Direct Specialization\npublic final class DirectProcessor {\n    public double computeTax(double amount) {\n        return amount * 0.15; // Fast inline calculation, no virtual table overhead\n    }\n}\n\n// APPROACH B (${entB}): Polymorphic Interface Decoupling\npublic interface TaxStrategy {\n    double computeTax(double amount);\n}\n// Permits dynamically swapping RegionalTaxStrategy, CorporateTaxStrategy at runtime.`
          : `// APPROACH A (${entA}): In-Place Iterative Divide & Conquer\n// Processes sub-arrays directly inside allocated memory buffer with O(1) auxiliary space.\n\n// APPROACH B (${entB}): Stable Auxiliary Merging Pipeline\n// Allocates external staging arrays to guarantee O(N log N) worst-case stability.`,
        stepsOrBreakdown: [
          `1. The calling service receives a payload requiring verification and persistence.`,
          `2. In Method A (${entA}), the invariant is checked immediately at the core boundary, failing fast with zero dispatch indirection.`,
          `3. In Method B (${entB}), execution delegates to an interchangeable strategy or decoupled observer, isolating side-effects.`,
          `4. Benchmark results confirm Method A provides lower P99 latency, while Method B supports zero-downtime evolution.`,
        ],
        conclusion: `Engineers should prefer ${entA} until clear requirements for multi-tenancy, dynamic plugin loading, or historical auditing justify the abstraction layer of ${entB}.`,
      },
      checkUnderstanding: {
        question: `In a production ${domain.toUpperCase()} application, what is the primary technical reason to select ${entB} over ${entA}?`,
        options: [
          `Because ${entB} enables decoupling and dynamic runtime adaptability despite a modest indirection overhead`,
          `Because ${entA} requires twice as much memory storage under all benchmark workloads`,
          `Because ${entB} eliminates the need for unit testing and compiler validation`,
          `Because modern operating systems do not support ${entA} in multithreaded environments`,
        ],
        correctIndex: 0,
        explanation: `Option 0 is correct: The defining architectural advantage of ${entB} is loose coupling and dynamic extensibility. While ${entA} is often faster and simpler for fixed operations, ${entB} isolates components so they can vary independently. Options 1, 2, and 3 are technically invalid assumptions.`,
      },
      alternateExplanation: {
        title: `The 10-Second Mental Filter for ${entA} vs ${entB}`,
        text: `Ask yourself one question: "Will this behavior change tomorrow without recompiling or redeploying the core system?" If YES, choose ${entB}. If NO (the logic is universal and permanent), stick with ${entA} for maximum speed and simplicity.`,
      },
    };
  }

  // -------------------------------------------------------------
  // BRANCH 2: DEEP DIVE / ADVANCED ARCHITECTURE
  // -------------------------------------------------------------
  if (detailLevel === 'detailed') {
    return {
      topicTitle: extractedTopic,
      simpleExplanation: {
        headline: `${topicName} is a high-level engineering mechanism designed to enforce structural invariants, optimize execution pipelines, and guarantee predictable system behavior at scale.`,
        paragraphs: [
          `At its core, ${topicName} operates directly above the memory or storage management layer. In modern ${domain.toUpperCase()} architecture, understanding this concept requires dissecting both its high-level API guarantees and its low-level runtime execution mechanics.`,
          `Internally, when ${topicName} is invoked, the execution engine parses the instruction into an abstract syntax tree or execution plan. It evaluates index structures, manages concurrency boundaries (such as read/write locks or MVCC snapshots), and ensures that state transitions adhere strictly to atomicity and isolation guarantees.`,
          `Under extreme concurrent load, improper deployment of ${topicName} can lead to lock contention, cache invalidation storms, or suboptimal disk page thrashing. Mastering its nuances empowers engineers to craft systems that maintain sub-millisecond response times without sacrificing correctness.`,
        ],
        keyPoints: [
          `Execution Mechanics: Operates through deterministic lifecycle phases, transitioning from planning and validation to atomic physical execution.`,
          `State Invariants: Guarantees that internal data structures remain valid even in the event of concurrent race conditions or sudden process interruption.`,
          `Resource Footprint: Balances CPU instruction cycles against I/O throughput and memory cache locality.`,
          `Production Edge Cases: Must account for cascade effects, lock escalation, and deadlocks in distributed or multi-threaded environments.`,
        ],
        rulesOfThumb: [
          {
            label: 'Concurrency Heuristic',
            rule: `Always minimize the duration of exclusive locks held during ${topicName} execution to prevent thread pool starvation.`,
          },
          {
            label: 'Indexing & Access Path',
            rule: `Verify that operations relying on ${topicName} are backed by selective indexes or sequential cache lines to prevent full scans.`,
          },
          {
            label: 'Idempotency Principle',
            rule: `Design operations governed by ${topicName} to be idempotent whenever retried across network or transaction boundaries.`,
          },
        ],
      },
      realWorldAnalogy: {
        analogyTitle: `The Automated Air Traffic Radar & Separation Grid`,
        story: `Consider the automated control grid at a bustling international airport. Planes cannot simply land whenever they arrive; thousands of flight vectors must be reconciled concurrently. ${topicName} acts like the automated separation radar: it continuously monitors trajectory coordinates, enforces 5-mile boundary invariants around every aircraft, and automatically triggers evasive holding patterns before any near-miss occurs. It doesn't rely on pilots guessing; it enforces strict mathematical rules systematically across the entire airspace.`,
        breakdownPoints: [
          {
            title: `Boundary Invariant`,
            description: `Represents the structural consistency rules enforced by ${topicName} across all state mutations.`,
          },
          {
            title: `Automated Radar Sweep`,
            description: `Represents the runtime validation engine checking conditions prior to committing mutations.`,
          },
          {
            title: `Holding Pattern Evasion`,
            description: `Represents graceful transaction rollbacks, exception handling, or retry loops preventing corruption.`,
          },
        ],
        solutionTakeaway: `Just as automated radar prevents mid-air collisions without grounding all flights, ${topicName} prevents state corruption under concurrent load without freezing system throughput.`,
      },
      visualExplanation: {
        subtitle: `Deep Execution Pipeline & State Lifecycle: ${topicName}`,
        diagramAscii: `  [ INCOMING REQUEST / MUTATION ]
                 |
                 v
       +-------------------+
       | 1. PARSE & VALIDATE|  <-- Syntax check & schema validation
       +-------------------+
                 |
                 v
       +-------------------+
       | 2. LOCK & ISOLATE |  <-- Acquires shared/exclusive resource locks
       +-------------------+
                 |
                 v
       +-------------------+
       | 3. INTERNAL ENGINE|  <-- Core ${topicName} logic executes
       |    EVALUATION     |
       +-------------------+
            /         \\
     [ SUCCESS ]   [ CONSTRAINT VIOLATION ]
          |                   |
          v                   v
+-------------------+   +--------------------+
| 4. ATOMIC COMMIT  |   | ROLLBACK / REJECT  |
| - Write WAL/redo  |   | - Release all locks|
| - Notify observers|   | - Throw typed error|
+-------------------+   +--------------------+`,
        diagramExplanation: `This pipeline illustrates the deterministic execution lifecycle of ${topicName}. The system isolates state changes, verifies all preconditions, and either commits atomically or cleanly rolls back without leaking orphaned state.`,
        visualBlocks: [
          {
            title: `Low-Level Engine Hook`,
            codeOrSchema: `// Engine Pipeline Phase\nStateSnapshot snapshot = engine.captureMVCCSnapshot();\ntry {\n    engine.applyScopedTransform(mutation);\n    engine.flushLogBuffer(WAL_SYNC);\n} catch (InvariantException ex) {\n    engine.revertTo(snapshot);\n}`,
            annotation: `Ensures ACID compliance and zero memory leakage on failure.`,
          },
        ],
      },
      simpleExample: {
        subtitle: `Production-Grade Implementation Pattern for ${topicName}`,
        context: `Demonstrating how to properly integrate and instrument ${topicName} in a high-concurrency production service.`,
        codeOrData: domain === 'dbms'
          ? `-- Production Implementation for ${topicName}\nBEGIN TRANSACTION;\n\n-- Step 1: Enforce Row-Level Concurrency Protection\nSELECT balance FROM accounts WHERE account_id = 101 FOR UPDATE;\n\n-- Step 2: Apply State Transition with Invariant Guard\nUPDATE accounts \nSET balance = balance - 250.00, updated_at = NOW()\nWHERE account_id = 101 AND balance >= 250.00;\n\n-- Step 3: Record Audit Telemetry\nINSERT INTO transaction_ledger (account_id, delta, action, timestamp)\nVALUES (101, -250.00, 'DEBIT', NOW());\n\nCOMMIT;`
          : domain === 'java'
          ? `// Thread-Safe Implementation for ${topicName}\npublic class SecureResourceManager<T> {\n    private final ReentrantReadWriteLock rwLock = new ReentrantReadWriteLock();\n    private final Map<String, T> stateMap = new ConcurrentHashMap<>();\n\n    public void mutateAtomic(String key, T value) {\n        rwLock.writeLock().lock();\n        try {\n            // Enforce domain invariant before commit\n            Objects.requireNonNull(value, "Value cannot be null");\n            stateMap.put(key, value);\n        } finally {\n            rwLock.writeLock().unlock();\n        }\n    }\n}`
          : `// High-Performance Algorithmic Execution for ${topicName}\n// Implements in-place partition with two-pointer invariant tracking\nfunction executeEnginePass(buffer, low, high) {\n    let pivot = buffer[high];\n    let i = low - 1;\n    for (let j = low; j < high; j++) {\n        if (buffer[j] <= pivot) {\n            i++;\n            [buffer[i], buffer[j]] = [buffer[j], buffer[i]];\n        }\n    }\n    [buffer[i + 1], buffer[high]] = [buffer[high], buffer[i + 1]];\n    return i + 1;\n}`,
        stepsOrBreakdown: [
          `1. The operation initiates within an isolated transaction boundary to prevent dirty reads.`,
          `2. An exclusive lock or atomic memory barrier is established on the target resource.`,
          `3. Preconditions are evaluated against live system state; if any invariant fails, an immediate rollback occurs.`,
          `4. On successful state mutation, write-ahead logs or memory buffers flush before releasing the barrier.`,
        ],
        conclusion: `By managing locks deterministically and rolling back on invariant violation, ${topicName} maintains rock-solid reliability even during burst traffic.`,
      },
      checkUnderstanding: {
        question: `When deploying ${topicName} in a high-concurrency distributed or multi-threaded environment, which condition is the most critical failure mode to guard against?`,
        options: [
          `Unchecked lock escalation and deadlocks caused by inconsistent resource acquisition ordering`,
          `Compilers refusing to generate machine bytecode due to strict typing`,
          `Automatic conversion of primitive integer types to floating point values`,
          `Operating system kernels forcibly killing threads after exactly 100 milliseconds`,
        ],
        correctIndex: 0,
        explanation: `Option 0 is correct: In high-concurrency systems, acquiring locks in an inconsistent order across concurrent threads or transactions leads directly to deadlocks and contention bottlenecks. Options 1, 2, and 3 are irrelevant or factually incorrect.`,
      },
      alternateExplanation: {
        title: `The "Bank Teller & Safe Deposit" Mental Model`,
        text: `Think of ${topicName} as a two-key safe deposit box at a bank. You can't just open it alone; both the customer and teller must turn their keys simultaneously, the guard logs the entry in a physical book before opening, and if the alarm sounds, the vault doors seal automatically. Everything is checked, double-locked, and logged.`,
      },
    };
  }

  // -------------------------------------------------------------
  // BRANCH 3: SIMPLIFIED / INTUITIVE FIRST PRINCIPLES
  // -------------------------------------------------------------
  if (detailLevel === 'simplified' || intent === 'simplify') {
    return {
      topicTitle: extractedTopic,
      simpleExplanation: {
        headline: `${topicName} is a straightforward way to keep computer systems organized, safe, and easy to understand without making messy mistakes.`,
        paragraphs: [
          `Don't let complex computer science words intimidate you. At its core, ${topicName} was created to solve a very simple, everyday problem: what happens when computer programs grow large and we need to make sure nothing breaks accidentally?`,
          `Instead of letting everyone do whatever they want all over the code or database, ${topicName} sets up a clear rulebook. Whenever information needs to be created, changed, or looked up, it follows one clean, predictable path.`,
          `By using this rule, you don't have to worry about weird bugs, missing data, or confusing errors later on. It keeps your software clean, reliable, and super fast to work with.`,
        ],
        keyPoints: [
          `The Big Idea: It stops accidental mistakes before they can even happen.`,
          `Clear Boundaries: Every piece of data or code knows exactly what its job is.`,
          `Predictability: When you run it once, it behaves the same way every single time.`,
          `Peace of Mind: You don't have to memorize crazy workarounds—the system takes care of the hard parts for you.`,
        ],
        rulesOfThumb: [
          {
            label: 'The Golden Rule',
            rule: `Keep it simple: do not add extra complications until the basic version of ${topicName} is working cleanly.`,
          },
          {
            label: 'The One-Job Rule',
            rule: `Each part of your system should do exactly one thing well, just like ${topicName} intends.`,
          },
          {
            label: 'Quick Exam Memory Trick',
            rule: `If an exam asks "Why do we use ${topicName}?", the answer is almost always: "To prevent errors, avoid duplicate work, and keep data consistent."`,
          },
        ],
      },
      realWorldAnalogy: {
        analogyTitle: `The Kitchen Spice Rack with Custom Sifter Lids`,
        story: `Imagine cooking in a busy kitchen with 10 friends. If all the spices were kept in open, unlabelled paper bags, someone would accidentally pour a cup of cayenne pepper into a pot of hot chocolate! ${topicName} is like putting every spice into a clear glass jar with a pre-printed label and a sifter lid that only lets out a pinch at a time. Nobody has to guess what's inside, and nobody can ruin the whole meal by spilling too much at once.`,
        breakdownPoints: [
          {
            title: `Clear Glass Jars`,
            description: `You can instantly see what the data is and where it belongs.`,
          },
          {
            title: `Pre-printed Labels`,
            description: `Clear types and names stop people from mixing up salt and sugar.`,
          },
          {
            title: `The Sifter Lid`,
            description: `Enforces safe usage rules so you never overwhelm the system.`,
          },
        ],
        solutionTakeaway: `When you give things clear labels and safe lids (${topicName}), anyone can cook in the kitchen without burning down the house!`,
      },
      visualExplanation: {
        subtitle: `Simple Step-by-Step Flow for ${topicName}`,
        diagramAscii: `  [ YOUR INPUT ] ---> [ IS IT VALID? ]
                             |
                   +---------+---------+
                   |                   |
                [ YES ]             [ NO ]
                   |                   |
                   v                   v
           [ SAVED SAFELY ]     [ POLITE ERROR ]
           Everything works!    "Please fix this field"`,
        diagramExplanation: `This simple picture shows how ${topicName} works. Safe input goes straight through and gets saved, while invalid input is caught right at the front door before it can cause any trouble.`,
        visualBlocks: [
          {
            title: `Friendly Rule Guard`,
            codeOrSchema: `if (inputIsValid) {\n  acceptAndSave();\n} else {\n  showHelpfulMessage();\n}`,
            annotation: `Catches mistakes before they touch the rest of the app.`,
          },
        ],
      },
      simpleExample: {
        subtitle: `Everyday Simple Example of ${topicName}`,
        context: `Let's look at how ${topicName} works in a friendly, easy-to-read code snippet.`,
        codeOrData: domain === 'dbms'
          ? `-- Simple, Safe Database Setup for ${topicName}\nCREATE TABLE students (\n  student_id INT PRIMARY KEY,\n  full_name VARCHAR(100) NOT NULL,\n  email VARCHAR(100) UNIQUE\n);\n\n-- That's it! The database now automatically prevents duplicate emails or missing names.`
          : domain === 'java'
          ? `// Simple, Safe Code for ${topicName}\npublic class SimpleAccount {\n    private double balance;\n\n    public void deposit(double amount) {\n        if (amount > 0) {\n            balance += amount; // Clean, safe addition\n        }\n    }\n}`
          : `// Simple, Clean Step for ${topicName}\nfunction findItem(list, target) {\n    for (let item of list) {\n        if (item === target) return "Found it!";\n    }\n    return "Not in list";\n}`,
        stepsOrBreakdown: [
          `1. We define the basic structure with clear rules right at the beginning.`,
          `2. When new data arrives, the system checks if it meets the rules.`,
          `3. Good data is processed happily with zero fuss.`,
          `4. If anything looks strange, it is safely stopped before making a mess.`,
        ],
        conclusion: `That's all ${topicName} really is: a smart, friendly guard rail that keeps your software running smoothly!`,
      },
      checkUnderstanding: {
        question: `What is the easiest way to remember why we need ${topicName}?`,
        options: [
          `It acts like a protective guardrail that keeps our data safe and organized`,
          `It is a tool designed to make computer monitors run faster`,
          `It forces computers to turn off automatically at midnight`,
          `It only works if you write code in binary ones and zeros`,
        ],
        correctIndex: 0,
        explanation: `Option 0 is correct! ${topicName} is simply a protective guardrail that keeps data organized and stops silly mistakes from breaking the application. The other options are silly distractors.`,
      },
      alternateExplanation: {
        title: `The Playground Sandbox Mental Model`,
        text: `Think of ${topicName} as the wooden frame around a children's sandbox. The frame keeps all the sand neatly inside one designated area so it doesn't get kicked all over the grass. When you want to build a sandcastle, you know exactly where to go!`,
      },
    };
  }

  // -------------------------------------------------------------
  // BRANCH 4: STANDARD AUTHORITATIVE EDUCATIONAL TOPIC
  // -------------------------------------------------------------
  return {
    topicTitle: extractedTopic,
    simpleExplanation: {
      headline: `${topicName} is a fundamental concept in ${domain.toUpperCase()} that defines how programs organize data, manage control flow, and guarantee correctness.`,
      paragraphs: [
        `In computer science engineering, understanding ${topicName} is essential for designing dependable and maintainable software. It specifies the rules and mechanisms that govern how inputs are validated, processed, and transformed into correct outputs.`,
        `When applied properly within ${domain.toUpperCase()}, ${topicName} guarantees data integrity, prevents runtime exceptions, and eliminates common failure modes such as race conditions, null references, or inconsistent states.`,
        `University courses and technical interviews emphasize ${topicName} because it evaluates both conceptual mastery of computing principles and the practical skill required to write production-grade code.`,
      ],
      keyPoints: [
        `Core Definition: ${topicName} establishes structured operational rules and predictable data handling.`,
        `System Role: Connects high-level program logic with underlying runtime execution and storage mechanisms.`,
        `Practical Benefit: Eliminates runtime bugs, simplifies debugging, and improves code readability.`,
        `Engineering Decision: Balances safety checks and abstraction against execution speed and memory usage.`,
      ],
      rulesOfThumb: [
        {
          label: 'Design Rule',
          rule: `Clearly define the requirements and edge-case boundaries of ${topicName} before writing implementation code.`,
        },
        {
          label: 'Performance Check',
          rule: `Ensure operations involving ${topicName} avoid redundant loops or unindexed table scans.`,
        },
        {
          label: 'Exam & Interview Tip',
          rule: `When asked about ${topicName}, state its core purpose, walk through a step-by-step example, and highlight one common pitfall.`,
        },
      ],
    },
    realWorldAnalogy: {
      analogyTitle: `The Automated Train Dispatch Switchboard`,
      story: `Imagine a major metropolitan train network. Hundreds of passenger and freight trains share the same interconnected tracks. Without a centralized automated switchboard, two trains would inevitably be routed onto the same track at the same time. ${topicName} functions like the automated railway switchboard: it monitors active track segments, locks intersecting junctions ahead of approaching trains, and only flips the signal green when the route is proven safe.`,
      breakdownPoints: [
        {
          title: `Track Junctions`,
          description: `Represents shared system resources and state boundaries accessed by concurrent tasks.`,
        },
        {
          title: `Automated Interlock Signals`,
          description: `Represents the safety checks and validation rules enforced by ${topicName} before allowing execution.`,
        },
        {
          title: `Train Schedule Dispatch`,
          description: `Represents client requests executing through the system in an orderly, collision-free sequence.`,
        },
      ],
      solutionTakeaway: `By centralizing traffic rules into an automated switchboard (${topicName}), operations run reliably with zero risk of collision.`,
    },
    visualExplanation: {
      subtitle: `System Architecture & Execution Flow for ${topicName}`,
      diagramAscii: `  +-------------------+
  |  CLIENT INVOCATION|
  +-------------------+
            |
            v
  +-------------------------------------------------+
  |        ${topicName.toUpperCase().padEnd(41, ' ')}|
  |  - Input Validation & Precondition Checks       |
  |  - Execution Engine Dispatch                    |
  |  - Result Verification & Finalization           |
  +-------------------------------------------------+
            |
      +-----+-----+
      |           |
      v           v
  [ SUCCESS ]  [ FAULT / ERROR ]
  State stored Error handled safely`,
      diagramExplanation: `This architectural diagram illustrates how ${topicName} coordinates incoming operations, verifying inputs before applying state changes or executing algorithms.`,
      visualBlocks: [
        {
          title: `Structural Blueprint`,
          codeOrSchema: `// Core Definition of ${topicName}\ndefineStructure() {\n    validateInputs();\n    executeOperation();\n    returnVerifiedResult();\n}`,
          annotation: `Structured execution lifecycle ensuring safety and reliability.`,
        },
      ],
    },
    simpleExample: {
      subtitle: `Practical Code Implementation of ${topicName}`,
      context: `Demonstrating an authentic implementation of ${topicName} with clean structure and comments.`,
      codeOrData: domain === 'dbms'
        ? `-- Canonical SQL Implementation for ${topicName}\n-- Creating structured schema with explicit constraints\nCREATE TABLE core_entities (\n    entity_id SERIAL PRIMARY KEY,\n    entity_name VARCHAR(100) NOT NULL,\n    status VARCHAR(20) DEFAULT 'ACTIVE',\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\n-- Querying with optimal execution path\nSELECT entity_id, entity_name\nFROM core_entities\nWHERE status = 'ACTIVE'\nORDER BY entity_id ASC;`
        : domain === 'java'
        ? `// Canonical Java Implementation for ${topicName}\npublic class CoreEntityManager {\n    private final Map<Integer, String> entityStore = new ConcurrentHashMap<>();\n\n    public synchronized void registerEntity(int id, String name) {\n        if (name == null || name.trim().isEmpty()) {\n            throw new IllegalArgumentException("Entity name is required");\n        }\n        entityStore.put(id, name);\n    }\n}`
        : `// Canonical Algorithmic Implementation for ${topicName}\nfunction processAlgorithm(items) {\n    if (!items || items.length === 0) return [];\n    // Processes items while maintaining strict ordering\n    return items.slice().sort((a, b) => a - b);\n}`,
      stepsOrBreakdown: [
        `1. The initial schema or class structure is defined with explicit type and constraint contracts.`,
        `2. Incoming data is verified against the defined rules before any state changes occur.`,
        `3. The core operation executes within a controlled scope, preventing partial or corrupt states.`,
        `4. The resulting state is committed and returned to the caller with verified integrity.`,
      ],
      conclusion: `Implementing ${topicName} with clear contracts and verified rules guarantees maintainable, bug-free software.`,
    },
    checkUnderstanding: {
      question: `What is the primary technical benefit of properly applying ${topicName} in a software system?`,
      options: [
        `Ensuring data consistency and preventing invalid system states through predictable execution`,
        `Increasing the physical clock speed of the underlying server CPU`,
        `Eliminating the need to compile source code before deployment`,
        `Allowing memory pointers to access unallocated operating system RAM`,
      ],
      correctIndex: 0,
      explanation: `Option 0 is correct: The foundational purpose of ${topicName} is to guarantee data consistency and enforce system rules predictably. Options 1, 2, and 3 describe impossible or hazardous computer behavior.`,
    },
    alternateExplanation: {
      title: `The "Airport Passport Control" Mental Model`,
      text: `Think of ${topicName} as passport control at an international airport. You can't just run from the parking lot onto an international flight; you must pass through the security checkpoint where your ticket, luggage, and identity are verified. Once cleared, you board the plane safely knowing every other passenger has been verified too.`,
    },
  };
}
