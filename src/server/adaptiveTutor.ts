import { AdaptiveStrategy, AdaptiveTeachResponse } from '../types.js';
import { extractTopicAndIntent } from './tutorEngine.js';

export const ALL_ADAPTIVE_STRATEGIES: AdaptiveStrategy[] = [
  'real-world analogy',
  'very simple explanation',
  'step-by-step breakdown',
  'visual-style explanation',
  'worked example',
  'interactive understanding check',
];

export interface AdaptiveRequest {
  topic: string;
  subject?: string;
  previousExplanation?: {
    headline?: string;
    analogyTitle?: string;
    previousAlternate?: string;
  } | string;
  attemptCount?: number;
  usedStrategies?: string[];
  preferredStrategy?: string;
}

/**
 * Selects the next best teaching strategy based on attempt count and prior strategies.
 * Progressively simplifies:
 * 1. Attempt 1: real-world analogy or step-by-step breakdown
 * 2. Attempt 2: very simple explanation (plain English, ELI5)
 * 3. Attempt 3: worked example (concrete walkthrough)
 * 4. Attempt 4: visual-style explanation (structural diagram / spatial layout)
 * 5. Attempt 5: interactive understanding check (thought experiment + intuition reveal)
 */
export function selectAdaptiveStrategy(
  attemptCount: number = 1,
  usedStrategies: string[] = [],
  preferredStrategy?: string
): AdaptiveStrategy {
  if (preferredStrategy && ALL_ADAPTIVE_STRATEGIES.includes(preferredStrategy as AdaptiveStrategy)) {
    return preferredStrategy as AdaptiveStrategy;
  }

  // Filter out strategies that have already been used
  const remaining = ALL_ADAPTIVE_STRATEGIES.filter((s) => !usedStrategies.includes(s));

  if (remaining.length > 0) {
    return remaining[0];
  }

  // If all 6 have been used, cycle based on attempt count
  const index = (attemptCount - 1) % ALL_ADAPTIVE_STRATEGIES.length;
  return ALL_ADAPTIVE_STRATEGIES[index];
}

/**
 * Dynamic fallback generator when GEMINI_API_KEY is not configured or in preview/testing.
 * Generates an authentic, strategy-specific teaching response tailored to the topic and attempt count.
 */
export function generateDynamicAdaptiveContent(req: AdaptiveRequest): AdaptiveTeachResponse {
  const attemptCount = Math.max(1, req.attemptCount || 1);
  const usedStrategies = req.usedStrategies || [];
  const strategy = selectAdaptiveStrategy(attemptCount, usedStrategies, req.preferredStrategy);

  const intent = extractTopicAndIntent(req.topic, req.subject || 'DBMS');
  const topicName = intent.extractedTopic || req.topic;
  const lower = topicName.toLowerCase();

  // Topic-specific strategy generators for high-frequency curriculum topics
  if (lower.includes('trigger')) {
    return generateTriggerAdaptiveContent(strategy, attemptCount, topicName);
  }

  if (lower.includes('normaliz') || lower.includes('normalis') || /\b(1nf|2nf|3nf|bcnf)\b/i.test(lower)) {
    return generateNormalizationAdaptiveContent(strategy, attemptCount, topicName);
  }

  if (lower.includes('join')) {
    return generateJoinAdaptiveContent(strategy, attemptCount, topicName);
  }

  if (lower.includes('polymorph')) {
    return generatePolymorphismAdaptiveContent(strategy, attemptCount, topicName);
  }

  if (lower.includes('quicksort') || lower.includes('mergesort')) {
    return generateSortingAdaptiveContent(strategy, attemptCount, topicName);
  }

  if (lower.includes('dijkstra')) {
    return generateDijkstraAdaptiveContent(strategy, attemptCount, topicName);
  }

  // General adaptive generator for arbitrary student topics
  return generateGenericAdaptiveContent(strategy, attemptCount, topicName, req.subject || 'Computer Science');
}

/* ========================================================================== */
/* Specific Topic Strategy Implementations                                   */
/* ========================================================================== */

function generateTriggerAdaptiveContent(
  strategy: AdaptiveStrategy,
  attempt: number,
  topic: string
): AdaptiveTeachResponse {
  switch (strategy) {
    case 'real-world analogy':
      return {
        strategy,
        attemptNumber: attempt,
        title: 'Strategy: Real-World Analogy (The Automatic Motion-Sensor Sprinkler)',
        text: `Forget SQL code for a second! Think of a database trigger like an automatic motion-sensor sprinkler on your front lawn:

1. The Lawn: That's your database table.
2. The Burglar stepping on the grass: That's an INSERT or UPDATE statement happening.
3. The Motion Sensor detecting the footstep: That's the TRIGGER condition (e.g. "AFTER INSERT").
4. The Sprinkler blasting cold water: That's the TRIGGER action (auditing the user, emailing security, or rejecting the transaction).

Notice: You don't have to hire a guard to manually turn on the hose every time someone walks on the lawn. The sprinkler is wired into the ground—it fires automatically whether the burglar arrived by foot, bike, or car! In the same way, whether an insert comes from a web app, a mobile app, or a direct database admin console, the trigger fires 100% of the time.`,
        simplificationSummary: 'Replaced database catalogs and event loops with an automatic motion sprinkler analogy.',
      };

    case 'very simple explanation':
      return {
        strategy,
        attemptNumber: attempt,
        title: 'Strategy: Very Simple Explanation (ELI5: The "If This, Then That" Rule)',
        text: `Here is the simplest way to understand a Database Trigger:

A trigger is just a robot sitting inside your database with one strict rule:
"Whenever someone touches this table, DO THIS EXTRA JOB immediately."

Why not just write that job in your Python or Java code?
Because if you have 5 different apps talking to the same database, you would have to write that safety check in 5 different places. If one app forgets, your data gets corrupted.

By putting the trigger right inside the database itself:
- Nobody can bypass it.
- It doesn't matter who modifies the row—the database runs the safety check automatically before or after saving the changes.`,
        simplificationSummary: 'Stripped away event architectures and explained triggers as an un-bypassable in-database guard robot.',
      };

    case 'step-by-step breakdown':
      return {
        strategy,
        attemptNumber: attempt,
        title: 'Strategy: Step-by-Step Breakdown (The 4 Micro-Steps of a Trigger)',
        text: `Let's break down exactly what happens millisecond-by-millisecond when a trigger runs:

Step 1: The Event Occurs
An application sends an SQL command:
UPDATE BankAccount SET balance = balance - 500 WHERE id = 42;

Step 2: The Database Pauses Execution
Before committing the change, the database engine checks: "Are there any triggers listening for an UPDATE on BankAccount?"
Yes! It finds: \`check_minimum_balance\`.

Step 3: The Trigger Evaluates (BEFORE UPDATE)
The trigger looks at two magic temporary snapshots:
- OLD.balance = $600
- NEW.balance = $100
The trigger checks: Is NEW.balance < minimum ($200)? Yes! It triggers an exception: "Balance cannot drop below $200!"

Step 4: Rollback or Commit
Because the trigger raised an error, the database rolls back the entire update. The $500 never leaves the account.`,
        simplificationSummary: 'Traced execution order from SQL arrival to rollback/commit through four explicit phases.',
      };

    case 'visual-style explanation':
      return {
        strategy,
        attemptNumber: attempt,
        title: 'Strategy: Visual-Style Explanation (Trigger Pipeline Diagram)',
        text: `Here is a spatial diagram showing where the Trigger sits in the database pipeline:

[ Web App / User ]
       |
       | 1. Sends: "DELETE FROM Employees WHERE id = 7"
       v
+-------------------------------------------------------------+
| DATABASE ENGINE                                             |
|                                                             |
|   [ BEFORE Trigger ]  --> (Checks: "Is employee an admin?") |
|          |                If YES -> ABORT deletion!         |
|          v                                                  |
|   [ Actual Deletion ] --> (Removes row 7 from disk)         |
|          |                                                  |
|          v                                                  |
|   [ AFTER Trigger ]   --> (Writes row 7 into "Audit_Log")   |
+-------------------------------------------------------------+
       |
       v
[ Success Response sent back to User ]

Notice: The actual delete is sandwiched between the BEFORE and AFTER triggers. Neither the user nor the web app had to do extra work!`,
        simplificationSummary: 'Rendered an ASCII pipeline showing how BEFORE and AFTER triggers sandwich the disk modification.',
      };

    case 'worked example':
      return {
        strategy,
        attemptNumber: attempt,
        title: 'Strategy: Worked Example (Preventing Negative Product Stock)',
        text: `Let's walk through a real scenario: An eCommerce inventory table.

1. The Problem:
Cashiers keep accidentally entering negative quantities, setting stock to -5 items!

2. The Trigger Solution:
CREATE TRIGGER prevent_negative_inventory
BEFORE UPDATE ON Products
FOR EACH ROW
BEGIN
  IF NEW.stock_quantity < 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Stock quantity cannot be less than 0!';
  END IF;
END;

3. Testing with Real Data:
- Initial state: Product "Laptop" has stock_quantity = 3.
- Cashier runs: UPDATE Products SET stock_quantity = -2 WHERE id = 10;
- What happens: The trigger intercepts the command BEFORE it touches the disk. It checks NEW.stock_quantity (-2 < 0). It immediately throws error '45000'.
- Final state: The Laptop still has stock_quantity = 3. The invalid update was completely blocked!`,
        simplificationSummary: 'Demonstrated an end-to-end worked example blocking negative inventory with before/after state verification.',
      };

    case 'interactive understanding check':
      return {
        strategy,
        attemptNumber: attempt,
        title: 'Strategy: Interactive Understanding Check (The Bank Transfer Dilemma)',
        text: `Take a quick moment to test your intuition on this scenario:

Scenario:
You have an \`Accounts\` table. You want to ensure that whenever someone's balance drops to $0, their account status is automatically changed to 'INACTIVE'.

Which trigger type should you use?
A) BEFORE INSERT
B) AFTER UPDATE
C) INSTEAD OF SELECT

Think of your answer before scrolling down!
.
.
.
The Answer: B) AFTER UPDATE!
Why?
- It cannot be INSERT, because the account already exists and is having its money withdrawn (an UPDATE).
- It should be AFTER, because you want the balance deduction to successfully happen first, and THEN immediately update the status column to 'INACTIVE'.`,
        simplificationSummary: 'Presented a real dilemma with guided self-check to anchor the choice between trigger events.',
      };
  }
}

function generateNormalizationAdaptiveContent(
  strategy: AdaptiveStrategy,
  attempt: number,
  topic: string
): AdaptiveTeachResponse {
  switch (strategy) {
    case 'real-world analogy':
      return {
        strategy,
        attemptNumber: attempt,
        title: 'Strategy: Real-World Analogy (The Messy Shared Google Doc vs Clean Spreadsheets)',
        text: `Think of Normalization like organizing a messy student club:

The Unnormalized Mess:
Imagine one shared Google Doc where every time a member buys a pizza, they paste their Name, Student ID, Major, Phone Number, Home Address, Pizza Flavor, and Store Address on a new line.
- If Sarah moves to a new apartment, you have to find and edit 45 pizza receipts. If you miss one receipt, Sarah now has two different home addresses (Update Anomaly)!
- If Sarah quits the club and you delete her pizza purchase, you accidentally erase Sarah's student ID and phone number forever (Delete Anomaly)!

The Normalized Fix:
You split that doc into three clean, tidy spreadsheets:
1. "Students" (StudentID, Name, Phone, Address) - Sarah's info appears ONCE.
2. "Stores" (StoreID, StoreName, Address) - Pizza shop info appears ONCE.
3. "Orders" (OrderID, StudentID, StoreID, Date) - Just references the IDs!

Now if Sarah moves, you update ONE single cell in the Students spreadsheet. That is all Normalization is!`,
        simplificationSummary: 'Mapped database relations to three Google spreadsheets avoiding duplicated contact info.',
      };

    case 'very simple explanation':
      return {
        strategy,
        attemptNumber: attempt,
        title: 'Strategy: Very Simple Explanation (The "One Fact in One Place" Golden Rule)',
        text: `Normalization comes down to one single golden rule:
"Every fact should live in exactly ONE place in your database."

Ask yourself this question whenever you design a table:
"If this student's phone number changes tomorrow, how many rows do I have to update?"

- If the answer is "more than 1 row", your table is NOT normalized.
- If the answer is "exactly 1 row", your table is normalized.

The 3 Normal Forms in 10 seconds each:
1. 1NF: No comma-separated lists in a single cell. Each box has only one single value.
2. 2NF: No saving details about a course in a table whose primary job is tracking student enrollments.
3. 3NF: No saving details about a city/zip code in a table whose primary job is tracking customers.`,
        simplificationSummary: 'Condensed relational normal forms into the single "One Fact in One Place" rule.',
      };

    case 'step-by-step breakdown':
      return {
        strategy,
        attemptNumber: attempt,
        title: 'Strategy: Step-by-Step Breakdown (The 3-Step Cleaning Pipeline)',
        text: `Here is the foolproof 3-step checklist to normalize any messy table:

Step 1: Check 1NF (Atomicity)
- Look at each cell in your table. Does any cell contain multiple values (e.g. "Skills: Java, SQL, Python")?
- Fix: Split them into separate rows or separate tables so every single cell contains only one atomic piece of data.

Step 2: Check 2NF (No Partial Dependencies)
- Look at your composite primary key (e.g. StudentID + CourseID).
- Does any column depend on only ONE half of the key? (e.g., CourseName depends only on CourseID, not on StudentID).
- Fix: Move CourseID and CourseName into their own separate Courses table!

Step 3: Check 3NF (No Transitive Dependencies)
- Look at non-key columns (e.g. ZipCode and City).
- Does a non-key column point to another non-key column? (e.g. ZipCode determines City).
- Fix: Move ZipCode and City into a separate PostalCodes table!`,
        simplificationSummary: 'Structured normalization as a sequential 3-step audit checklist.',
      };

    case 'visual-style explanation':
      return {
        strategy,
        attemptNumber: attempt,
        title: 'Strategy: Visual-Style Explanation (Table Splitting Diagram)',
        text: `Here is how a bloated, unnormalized table gets sliced into clean 3NF tables:

[ BAD UNNORMALIZED TABLE ]
+-----------+------------+-------------+------------+--------------------+
| OrderID   | CustomerID | CustPhone   | ItemName   | SupplierCity       |
+-----------+------------+-------------+------------+--------------------+
| 1001      | C1         | 555-0100    | Keyboard   | San Jose           |
| 1002      | C1         | 555-0100    | Mouse      | San Jose (DUPLICATE)
+-----------+------------+-------------+------------+--------------------+
  ⚠️ Notice: CustPhone is repeated across every order C1 makes!

           ⬇ DECOMPOSE (Split into dedicated entities) ⬇

[ Customers Table ]           [ Orders Table ]           [ Items Table ]
PK: CustomerID                PK: OrderID                PK: ItemID
+------------+-----------+    +---------+------------+   +--------+-------------+
| CustomerID | CustPhone |    | OrderID | CustomerID |   | ItemID | SupplierCity|
+------------+-----------+    +---------+------------+   +--------+-------------+
| C1         | 555-0100  |    | 1001    | C1         |   | I1     | San Jose    |
+------------+-----------+    | 1002    | C1         |   +--------+-------------+
                              +---------+------------+

Result: Phone number exists in ONE place. Zero duplicates!`,
        simplificationSummary: 'Visualized schema decomposition from one wide duplicated table to three focused relations.',
      };

    case 'worked example':
      return {
        strategy,
        attemptNumber: attempt,
        title: 'Strategy: Worked Example (Fixing a College Enrollment Table)',
        text: `Let's work through an actual bad database table and fix it together:

Input Table: StudentCourseGrades
Columns: (StudentID, CourseID, StudentName, CourseTitle, ProfessorName, Grade)
Primary Key: (StudentID, CourseID)

Why it fails 2NF:
- The key is composite: (StudentID, CourseID).
- StudentName depends ONLY on StudentID (not CourseID).
- CourseTitle and ProfessorName depend ONLY on CourseID (not StudentID).

How we fix it:
1. Extract Student entity:
   Students(StudentID [PK], StudentName)
2. Extract Course entity:
   Courses(CourseID [PK], CourseTitle, ProfessorName)
3. Keep the relationship and the grade:
   Enrollments(StudentID [FK], CourseID [FK], Grade)
   PK: (StudentID, CourseID)

Outcome: If 500 students enroll in "CS101", the CourseTitle "Data Structures" is stored ONCE in Courses, saving memory and eliminating update anomalies!`,
        simplificationSummary: 'Provided concrete attribute-by-attribute normalization walkthrough for college enrollments.',
      };

    case 'interactive understanding check':
      return {
        strategy,
        attemptNumber: attempt,
        title: 'Strategy: Interactive Understanding Check (Spot the Anomaly)',
        text: `Test your intuition with this quick riddle:

Imagine you have a single table called \`CarRentals\`:
Columns: (RentalID, CustomerName, CustomerPhone, CarModel)

Riddle:
Customer Bob rents a Tesla today and returns it tomorrow. You delete his rental record from the table.
What accidental damage did you just do?

Think for 5 seconds...
.
.
.
The Answer:
You just committed a "Deletion Anomaly"!
Because Bob's phone number was stored ONLY in the CarRentals table, deleting the rental record erased Bob's phone number from your entire business! Next week when Bob wants to rent another car, you have no record of his contact info.
Normalization fixes this by keeping a permanent \`Customers\` table separate from \`Rentals\`.`,
        simplificationSummary: 'Highlighted deletion anomalies through an intuitive car rental riddle with step-by-step resolution.',
      };
  }
}

function generateJoinAdaptiveContent(
  strategy: AdaptiveStrategy,
  attempt: number,
  topic: string
): AdaptiveTeachResponse {
  switch (strategy) {
    case 'real-world analogy':
      return {
        strategy,
        attemptNumber: attempt,
        title: 'Strategy: Real-World Analogy (The Coat Check Ticket)',
        text: `Think of an SQL JOIN like checking your jacket at a theater coat check:

Table 1 (You): You have a coat check ticket: Ticket #42.
Table 2 (Coat Rack): Hangers holding jackets, each with a tag: Tag #42.

An INNER JOIN is the coat attendant matching ticket #42 with hanger #42 to hand you your jacket.
- INNER JOIN: Matches only people who have a ticket AND an existing jacket on the rack.
- LEFT JOIN: Shows EVERY person in line. If you lost your ticket, your jacket shows up as NULL (empty hands), but YOU are not discarded from the list!
- FULL OUTER JOIN: Shows all people AND all unclaimed jackets remaining on the rack.`,
        simplificationSummary: 'Anchored joins to physical coat check tickets and rack tags.',
      };

    case 'very simple explanation':
      return {
        strategy,
        attemptNumber: attempt,
        title: 'Strategy: Very Simple Explanation (Gluing Two Tables Side-by-Side)',
        text: `Because databases split data into separate tables (Customers in Table A, Orders in Table B), a JOIN is simply the glue that stitches those two tables back together for a single query.

How the glue works:
You specify which column connects them:
ON Customers.id = Orders.customer_id

The only difference between the types of joins is what to do when a row has no match:
- INNER JOIN: "If there's no match, throw both away."
- LEFT JOIN: "Keep everything on the left table, even if it has no match on the right."
- RIGHT JOIN: "Keep everything on the right table, even if it has no match on the left."
- FULL JOIN: "Keep everything from both tables, fill gaps with NULL."`,
        simplificationSummary: 'Clarified joins as temporary table gluing based on matching column values.',
      };

    case 'step-by-step breakdown':
      return {
        strategy,
        attemptNumber: attempt,
        title: 'Strategy: Step-by-Step Breakdown (How the Database Engine Executes a Join)',
        text: `Here is the step-by-step journey of an SQL Join inside the database engine:

Step 1: Read Left Table Row 1
The engine grabs row 1 from Customers (ID: 10, Name: 'Alice').

Step 2: Scan Right Table for Matching Key
The engine checks the Orders table for any row where \`customer_id = 10\`.
It finds Order #501 ($45) and Order #502 ($120).

Step 3: Produce Combined Rows
It outputs two combined rows:
- [Alice, Order 501, $45]
- [Alice, Order 502, $120]

Step 4: Handle Unmatched Rows
Next, the engine checks customer Bob (ID: 11). Bob has placed 0 orders.
- In INNER JOIN: Bob is dropped from the result.
- In LEFT JOIN: [Bob, NULL, NULL] is output so Bob still appears.`,
        simplificationSummary: 'Traced left-to-right nested loop execution with matched and unmatched keys.',
      };

    case 'visual-style explanation':
      return {
        strategy,
        attemptNumber: attempt,
        title: 'Strategy: Visual-Style Explanation (Venn Diagram to Table Matching)',
        text: `Visual comparison of Join results:

Table A (Students)         Table B (LockerKeys)
+----+-------+             +----+----------+
| ID | Name  |             | ID | LockerNo |
+----+-------+             +----+----------+
| 1  | Alice |             | 1  | L-101    |
| 2  | Bob   |             | 3  | L-103    |
+----+-------+             +----+----------+

[ 1. INNER JOIN (A.ID = B.ID) ]
Only rows with matches in BOTH tables:
+----+-------+----------+
| ID | Name  | LockerNo |
+----+-------+----------+
| 1  | Alice | L-101    |
+----+-------+----------+

[ 2. LEFT JOIN (Keep all A) ]
Preserves Bob even though he has no locker:
+----+-------+----------+
| ID | Name  | LockerNo |
+----+-------+----------+
| 1  | Alice | L-101    |
| 2  | Bob   | NULL     | <--- Bob is not lost!
+----+-------+----------+`,
        simplificationSummary: 'Contrasted INNER JOIN and LEFT JOIN using side-by-side tabular key matching.',
      };

    case 'worked example':
      return {
        strategy,
        attemptNumber: attempt,
        title: 'Strategy: Worked Example (Finding Customers Who Never Placed an Order)',
        text: `A classic interview problem: "Find all customers who haven't placed an order."

1. The Query:
SELECT Customers.name, Orders.order_id
FROM Customers
LEFT JOIN Orders ON Customers.id = Orders.customer_id
WHERE Orders.order_id IS NULL;

2. Why LEFT JOIN is required:
If you used INNER JOIN, customers with 0 orders would be thrown away by the match condition!
By using LEFT JOIN, every customer is listed. Those without orders have NULL in \`Orders.order_id\`.
The filter \`WHERE Orders.order_id IS NULL\` instantly gives you all inactive customers!`,
        simplificationSummary: 'Walked through the classic "find missing matches" interview query using LEFT JOIN IS NULL.',
      };

    case 'interactive understanding check':
      return {
        strategy,
        attemptNumber: attempt,
        title: 'Strategy: Interactive Understanding Check (The 10-Row Riddle)',
        text: `Quick riddle to test your join mastery:

You have:
- \`Employees\` table with 10 rows.
- \`Badges\` table with 0 rows (completely empty).

Question:
How many rows will this query return?
SELECT * FROM Employees LEFT JOIN Badges ON Employees.id = Badges.emp_id;

Will it return:
A) 0 rows
B) 10 rows
C) An error

Take a second to think...
.
.
.
The Answer: B) Exactly 10 rows!
Why?
Because a LEFT JOIN guarantees that every single row from the left table (\`Employees\`) is preserved. Since \`Badges\` is empty, all the badge columns will just be filled with NULL, but all 10 employees remain in your output!`,
        simplificationSummary: 'Used an edge case riddle (joining against an empty table) to solidify LEFT JOIN semantics.',
      };
  }
}

function generatePolymorphismAdaptiveContent(
  strategy: AdaptiveStrategy,
  attempt: number,
  topic: string
): AdaptiveTeachResponse {
  switch (strategy) {
    case 'real-world analogy':
      return {
        strategy,
        attemptNumber: attempt,
        title: 'Strategy: Real-World Analogy (The Universal Power Button)',
        text: `Think of polymorphism like the "Power Button" on your remote control:

You press the exact same button labeled "Power":
- If aimed at your TV: The screen lights up and displays HDMI 1.
- If aimed at your Air Conditioner: The fan starts spinning and blows cold air.
- If aimed at your Soundbar: It illuminates and connects to Bluetooth.

You (the caller) don't need three separate buttons: "pressTvPower()", "pressAcPower()", "pressSoundbarPower()".
You just call \`device.powerOn()\`. Each object knows its own specific way to react! That is Polymorphism ("Many Forms").`,
        simplificationSummary: 'Anchored object-oriented polymorphism to a single remote control power button controlling different appliances.',
      };

    case 'very simple explanation':
      return {
        strategy,
        attemptNumber: attempt,
        title: 'Strategy: Very Simple Explanation (One Command, Different Reactions)',
        text: `Polymorphism means "many shapes or behaviors".

In programming, it simply means:
You can treat different objects as if they were the same parent type, but when you tell them to do an action, each one behaves in its own custom way.

Example:
You tell a Dog to "speak()" -> It barks: "Woof!"
You tell a Cat to "speak()" -> It meows: "Meow!"
You tell a Cow to "speak()" -> It moos: "Moo!"

Your code just writes: \`animal.speak()\`.
You don't need giant if/else ladders checking if it's a dog or cat. The object itself handles the details.`,
        simplificationSummary: 'Stripped method dispatch theory and explained polymorphism as treating different objects uniformly.',
      };

    case 'step-by-step breakdown':
      return {
        strategy,
        attemptNumber: attempt,
        title: 'Strategy: Step-by-Step Breakdown (Compile-Time vs Runtime Polymorphism)',
        text: `There are two completely different kinds of polymorphism in Java. Here is the step-by-step distinction:

1. Compile-Time Polymorphism (Method Overloading):
- Same method name, different parameter lists (e.g. \`add(int a, int b)\` vs \`add(double a, double b)\`).
- Decided by: The compiler BEFORE the program runs.
- How: The compiler inspects the argument types and hardcodes the exact method address.

2. Runtime Polymorphism (Method Overriding):
- Child class rewrites a parent class method with the exact same signature.
- Decided by: The Java Virtual Machine (JVM) WHILE the program is running.
- How: The JVM checks the actual object memory on the heap (vtable / method table) to find the child's overridden version.`,
        simplificationSummary: 'Contrasted overloading (static binding) and overriding (dynamic vtable dispatch).',
      };

    case 'visual-style explanation':
      return {
        strategy,
        attemptNumber: attempt,
        title: 'Strategy: Visual-Style Explanation (Dynamic Method Dispatch in Memory)',
        text: `Here is what the JVM memory looks like during Runtime Polymorphism:

Code:
Shape s = new Circle();
s.draw();

[ Stack (Reference) ]             [ Heap (Actual Object) ]
+---------------+                 +------------------------------+
| s: Shape ref  | ------------->  | Object: Circle               |
+---------------+                 | vtable pointer -> Circle.draw|
                                  +------------------------------+
                                                 |
                                                 v
                                  Runs Circle's draw() implementation!
                                  (NOT Shape's draw)

Even though variable 's' is typed as 'Shape', the JVM follows the pointer to the real object in the heap and discovers it is a 'Circle'.`,
        simplificationSummary: 'Diagrammed stack reference versus heap object vtable resolution.',
      };

    case 'worked example':
      return {
        strategy,
        attemptNumber: attempt,
        title: 'Strategy: Worked Example (Payment Gateway in Java)',
        text: `A real-world example: Processing payments in an online checkout.

\`\`\`java
// 1. Common Parent Interface
interface PaymentMethod {
  void pay(double amount);
}

// 2. Concrete Implementations
class CreditCard implements PaymentMethod {
  public void pay(double amount) {
    System.out.println("Charging $" + amount + " via Stripe API");
  }
}

class PayPal implements PaymentMethod {
  public void pay(double amount) {
    System.out.println("Redirecting to PayPal login for $" + amount);
  }
}

// 3. Polymorphic Usage: Clean code with ZERO if/else!
public void checkout(PaymentMethod method, double total) {
  method.pay(total); // Works for CreditCard, PayPal, Crypto, or ApplePay!
}
\`\`\``,
        simplificationSummary: 'Demonstrated payment method interfaces eliminating branching logic.',
      };

    case 'interactive understanding check':
      return {
        strategy,
        attemptNumber: attempt,
        title: 'Strategy: Interactive Understanding Check (What Gets Printed?)',
        text: `Test your polymorphism mastery:

Look at this snippet:
class Parent {
  void show() { System.out.println("Parent"); }
}
class Child extends Parent {
  void show() { System.out.println("Child"); }
}

Parent obj = new Child();
obj.show();

Question: What will be printed to the console?
A) Parent
B) Child
C) Compilation Error

Guess before revealing below...
.
.
.
The Answer: B) Child!
Why?
In Java, method calls are resolved based on the TYPE OF THE ACTUAL OBJECT IN MEMORY (Child), not the type of the reference variable (Parent). This is the hallmark of dynamic runtime method dispatch!`,
        simplificationSummary: 'Used a classic reference-vs-instance puzzle to verify dynamic dispatch understanding.',
      };
  }
}

function generateSortingAdaptiveContent(
  strategy: AdaptiveStrategy,
  attempt: number,
  topic: string
): AdaptiveTeachResponse {
  switch (strategy) {
    case 'real-world analogy':
      return {
        strategy,
        attemptNumber: attempt,
        title: 'Strategy: Real-World Analogy (Sorting Playing Cards)',
        text: `Think of sorting playing cards in your hands:

MergeSort:
You take a 52-card deck, split it in half (26 & 26), split again (13 & 13) down to individual cards. Then you zip two sorted piles together comparing the top card of each. It's calm, predictable, and always takes the exact same time, but you need a second table to spread out the piles (extra memory).

QuickSort:
You pick one card at random (the Pivot, say an 8 of Hearts). You rapidly toss all cards lower than 8 to your left, and higher cards to your right. You didn't need a second table—you did it right in your hands! But if you accidentally pick the smallest card as pivot every time, it takes forever.`,
        simplificationSummary: 'Compared mergesort and quicksort to dividing decks versus pivot card partitioning.',
      };

    case 'very simple explanation':
      return {
        strategy,
        attemptNumber: attempt,
        title: 'Strategy: Very Simple Explanation (The Trade-Off in Plain English)',
        text: `The whole comparison between QuickSort and MergeSort boils down to one simple trade-off:

"Do you care more about RAM memory, or absolute worst-case guarantees?"

- MergeSort: Guaranteed O(N log N) speed no matter what, but it is a memory hog—it requires O(N) auxiliary space.
- QuickSort: In-place O(1) extra memory, lightning-fast in cache on modern CPUs, but has a worst-case O(N²) if you pick terrible pivots.

That is why Java uses MergeSort/TimSort for Objects (where stability matters) and Dual-Pivot QuickSort for primitive arrays (where CPU cache and memory speed dominate).`,
        simplificationSummary: 'Summarized the core architectural trade-off between memory footprint and worst-case guarantees.',
      };

    case 'step-by-step breakdown':
      return {
        strategy,
        attemptNumber: attempt,
        title: 'Strategy: Step-by-Step Breakdown (Divide & Conquer Step Comparison)',
        text: `Both use divide-and-conquer, but the hard work happens at opposite stages:

MergeSort: Easy Divide, Hard Combine
1. Divide: Split array down the middle. (Trivial: O(1))
2. Conquer: Recursively sort left and right halves.
3. Combine: Merge the two sorted arrays into one. (Heavy work: O(N) with helper array!)

QuickSort: Hard Divide, Easy Combine
1. Divide: Partition the array around a pivot so left < pivot < right. (Heavy work: O(N) partitioning!)
2. Conquer: Recursively sort left and right partitions.
3. Combine: Nothing to do! The elements are already in their final sorted spots. (Trivial: O(1))`,
        simplificationSummary: 'Contrasted where computation occurs: merge phase in MergeSort vs partition phase in QuickSort.',
      };

    case 'visual-style explanation':
      return {
        strategy,
        attemptNumber: attempt,
        title: 'Strategy: Visual-Style Explanation (Partition vs Merge Tree)',
        text: `QuickSort Partitioning:
[ 7, 2, 1, 6, 8, 5, 3, 4(P) ]  -> Pivot = 4
Left (< 4)    Pivot   Right (> 4)
[ 2, 1, 3 ]   [ 4 ]   [ 7, 6, 8, 5 ]

MergeSort Merging:
[ 1, 3 ]     [ 2, 4 ]
    \\         /
   Compare 1 vs 2 -> Take 1: [ 1 ]
   Compare 3 vs 2 -> Take 2: [ 1, 2 ]
   Compare 3 vs 4 -> Take 3: [ 1, 2, 3 ]
   Append remaining ->       [ 1, 2, 3, 4 ]`,
        simplificationSummary: 'Visualized the partition step of QuickSort against the two-pointer merge step of MergeSort.',
      };

    case 'worked example':
      return {
        strategy,
        attemptNumber: attempt,
        title: 'Strategy: Worked Example (Partitioning [5, 2, 9, 1, 7, 3])',
        text: `Step-by-step QuickSort partition with pivot = 3:
Array: [5, 2, 9, 1, 7, 3]

Index pointer i starts before array (-1).
Walk j from index 0 to 4:
- j=0 (val 5): 5 > 3, do nothing.
- j=1 (val 2): 2 <= 3 -> increment i to 0, swap arr[0] and arr[1]: [2, 5, 9, 1, 7, 3]
- j=2 (val 9): 9 > 3, do nothing.
- j=3 (val 1): 1 <= 3 -> increment i to 1, swap arr[1] and arr[3]: [2, 1, 9, 5, 7, 3]
- j=4 (val 7): 7 > 3, do nothing.

Finally swap pivot into position (i+1 = 2):
Array becomes: [2, 1, 3, 5, 7, 9]
Notice: 3 is in its final sorted position! Everything to its left is < 3, everything to right is > 3.`,
        simplificationSummary: 'Traced Lomuto partition pointers i and j step by step.',
      };

    case 'interactive understanding check':
      return {
        strategy,
        attemptNumber: attempt,
        title: 'Strategy: Interactive Understanding Check (Stability Scenario)',
        text: `Scenario:
You have a table of student records already sorted alphabetically by Name.
Now you want to sort them by Grade (A, B, C...).
If two students both have grade 'A', you want them to remain sorted alphabetically by their names.

Which algorithm must you use?
A) QuickSort
B) MergeSort
C) HeapSort

Think for a moment...
.
.
.
The Answer: B) MergeSort!
Why?
MergeSort is a STABLE sort: it preserves the relative order of items with equal keys. Standard QuickSort is UNSTABLE because its partitioning swaps elements over long distances, scrambling the previous alphabetical order of students with the same grade.`,
        simplificationSummary: 'Checked student understanding of sorting algorithm stability with a multi-key sorting challenge.',
      };
  }
}

function generateDijkstraAdaptiveContent(
  strategy: AdaptiveStrategy,
  attempt: number,
  topic: string
): AdaptiveTeachResponse {
  switch (strategy) {
    case 'real-world analogy':
      return {
        strategy,
        attemptNumber: attempt,
        title: 'Strategy: Real-World Analogy (The Expanding Pool of Water)',
        text: `Imagine pouring a steady stream of water onto a map made of narrow dirt channels:

1. Starting Point: The water starts at City A.
2. Flow: The water flows along every channel at constant speed. Shorter roads get flooded first.
3. The First Touch: The moment the water reaches City B, you know with 100% certainty that you found the absolute shortest path to B. Any other channel would take longer to arrive!
4. Dijkstra's Algorithm is literally this water ripple: It always explores the closest unvisited node next using a Min-Heap priority queue.`,
        simplificationSummary: 'Explained Dijkstra as an expanding physical wave of water reaching nodes.',
      };

    case 'very simple explanation':
      return {
        strategy,
        attemptNumber: attempt,
        title: 'Strategy: Very Simple Explanation (Greedy Path Finding)',
        text: `Dijkstra's Algorithm finds the shortest path from one start city to every other city on a graph.

The entire algorithm is based on this greedy logic:
1. Start with distance 0 to your starting city, and infinity to everywhere else.
2. Put all cities in a priority list.
3. Pick the city with the smallest known distance.
4. Look at all its direct neighbors. If going through this city gives a shorter route than whatever we recorded earlier, update their distance ("relaxation")!
5. Mark this city as visited. Repeat until you reach the target.`,
        simplificationSummary: 'Summarized Dijkstra into a 5-step greedy distance relaxation process.',
      };

    case 'step-by-step breakdown':
      return {
        strategy,
        attemptNumber: attempt,
        title: 'Strategy: Step-by-Step Breakdown (The Relaxation Loop)',
        text: `The core mechanism of Dijkstra is called Edge Relaxation. Here is how it works:

Suppose you know:
- Distance to Node U = 5 km
- Road from Node U to Node V = 2 km
- Currently recorded distance to Node V = 10 km

The Relaxation Check:
Is \`dist[U] + weight(U, V) < dist[V]\`?
Is \`5 + 2 < 10\`?
Yes! (7 < 10).

The Action:
Update \`dist[V] = 7\` and record that the path to V goes through U.
That single comparison repeated for every edge is all Dijkstra does!`,
        simplificationSummary: 'Isolated edge relaxation formula dist[u] + weight < dist[v].',
      };

    case 'visual-style explanation':
      return {
        strategy,
        attemptNumber: attempt,
        title: 'Strategy: Visual-Style Explanation (Priority Queue Graph Flow)',
        text: `Dijkstra's Min-Heap Exploration:

(A) --[ 4 ]--> (B)
 |              |
[ 2 ]          [ 1 ]
 v              v
(C) --[ 3 ]--> (D)

Step 1: Min-Heap has [(A, dist:0)].
        Pop A. Neighbors: B(dist:4), C(dist:2).
        Min-Heap: [(C, 2), (B, 4)].

Step 2: Pop C (closest!).
        Neighbors of C: D(2+3=5).
        Min-Heap: [(B, 4), (D, 5)].

Step 3: Pop B.
        Neighbors of B: D(4+1=5).
        Shortest distance to D is 5 (via A->C->D or A->B->D).`,
        simplificationSummary: 'Traced Dijkstra priority queue pops and neighbor pushes with an ASCII graph.',
      };

    case 'worked example':
      return {
        strategy,
        attemptNumber: attempt,
        title: 'Strategy: Worked Example (GPS Navigation with 4 Intersections)',
        text: `Graph: Start = Home.
Home -> Store (10 min)
Home -> Park (3 min)
Park -> Store (4 min)

Distances Table:
Initial: Home: 0, Park: inf, Store: inf
Visit Home:
- Update Park: min(inf, 0 + 3) = 3
- Update Store: min(inf, 0 + 10) = 10

Visit Park (smallest distance = 3):
- Check Store: min(10, 3 + 4) = 7! (Improved!)
- Update Store distance to 7.

Final Shortest Path to Store: Home -> Park -> Store (7 mins), beating the direct 10 min highway!`,
        simplificationSummary: 'Demonstrated GPS route discovery beating a direct highway through an intermediate node.',
      };

    case 'interactive understanding check':
      return {
        strategy,
        attemptNumber: attempt,
        title: 'Strategy: Interactive Understanding Check (Why Negative Weights Break It)',
        text: `Question:
Why does Dijkstra's Algorithm fail if a road has a negative weight (e.g. -5 km)?

A) The computer runs out of memory.
B) Dijkstra greedily marks a node as permanently visited, assuming no future path could ever make it shorter. A negative edge breaks that assumption!
C) Dijkstra only works on trees, not graphs.

Think before reading the answer...
.
.
.
The Answer: B!
Dijkstra is "greedy". Once it pops a node from the min-heap, it declares: "This distance is finalized." But if a negative edge exists later in the graph, it could retroactively reduce the total distance to an already finalized node! For negative weights, you must use the Bellman-Ford algorithm instead.`,
        simplificationSummary: 'Investigated the failure mode of negative edge weights versus greedy finalization.',
      };
  }
}

function generateGenericAdaptiveContent(
  strategy: AdaptiveStrategy,
  attempt: number,
  topic: string,
  subject: string
): AdaptiveTeachResponse {
  const cleanTitle = topic.replace(/explain\s*(about)?/i, '').trim();

  switch (strategy) {
    case 'real-world analogy':
      return {
        strategy,
        attemptNumber: attempt,
        title: `Strategy: Real-World Analogy (${cleanTitle})`,
        text: `Let's step completely away from the textbook and imagine ${cleanTitle} in everyday life:

Imagine a busy airport control tower:
- If every pilot landed their plane whenever they felt like it, you would have catastrophic collisions.
- The control tower enforces a protocol: planes queue up, get assigned specific runways, and only move when granted clear access.

In ${subject}, ${cleanTitle} operates as that exact coordination mechanism. It creates an orderly, predictable protocol so different operations don't collide or corrupt state. Whenever you encounter ${cleanTitle}, remember the airport control tower ensuring safety before any action proceeds.`,
        simplificationSummary: `Mapped ${cleanTitle} to an everyday coordination protocol analogy.`,
      };

    case 'very simple explanation':
      return {
        strategy,
        attemptNumber: attempt,
        title: `Strategy: Very Simple Explanation (ELI5: ${cleanTitle})`,
        text: `Here is the simplest way to think about ${cleanTitle} without any complicated jargon:

1. What problem does it solve?
Without ${cleanTitle}, systems suffer from inconsistencies, slow performance, or unexpected bugs when handling complex data.

2. What does it actually do?
It introduces a clear boundary and a reliable rule: do step A first, verify the condition, and only then proceed to step B.

3. Why do engineers care?
Because it saves hours of debugging! Once configured correctly, ${cleanTitle} guarantees that data stays correct without requiring constant manual intervention.`,
        simplificationSummary: `Boiled ${cleanTitle} down to core problem, mechanism, and engineering value.`,
      };

    case 'step-by-step breakdown':
      return {
        strategy,
        attemptNumber: attempt,
        title: `Strategy: Step-by-Step Breakdown (${cleanTitle})`,
        text: `Let's break down ${cleanTitle} into 4 sequential micro-steps:

Step 1: Initialization / Triggering Event
An operation begins and inputs are passed to the system. The system checks prerequisite conditions.

Step 2: Rule Evaluation
The core logic of ${cleanTitle} evaluates the current state against its constraints to decide the execution branch.

Step 3: State Transformation
The actual modification occurs safely, ensuring that all dependent data is updated consistently.

Step 4: Completion & Verification
The system commits the result or returns a confirmation. If any constraint was violated, it safely cancels and alerts the caller.`,
        simplificationSummary: `Broke ${cleanTitle} down into 4 clear execution phases.`,
      };

    case 'visual-style explanation':
      return {
        strategy,
        attemptNumber: attempt,
        title: `Strategy: Visual-Style Explanation (${cleanTitle} Architecture)`,
        text: `Here is a visual map of how ${cleanTitle} works:

[ Input / Request ]
        |
        v
+-------------------------------------------------+
|  ${cleanTitle.toUpperCase()} BOUNDARY           |
|                                                 |
|   1. Verify State & Constraints                 |
|   2. Execute Core Transformation                |
|   3. Protect Invariants & Consistency           |
+-------------------------------------------------+
        |
        +---> [ Success: State Committed ]
        |
        +---> [ Failure: Safe Rollback / Alert ]

The boundary isolates internal complexity from external callers, keeping the system robust!`,
        simplificationSummary: `Created a structural ASCII diagram representing the operational boundary of ${cleanTitle}.`,
      };

    case 'worked example':
      return {
        strategy,
        attemptNumber: attempt,
        title: `Strategy: Worked Example (${cleanTitle})`,
        text: `Let's trace a concrete example for ${cleanTitle}:

Scenario:
A system receives an incoming request with payload: { id: 101, value: 45 }.

Execution Trace:
1. Entry check: The system checks if ID 101 exists. It does.
2. Applying ${cleanTitle}: The rule dictates that \`value\` must be validated and transformed before persisting.
3. Outcome: The record is updated and the timestamp is logged.

If we had NOT applied ${cleanTitle}:
The request would have bypassed validation, potentially corrupting existing records. By applying ${cleanTitle}, the operation remained atomic and safe.`,
        simplificationSummary: `Traced an end-to-end worked example from input to verified output.`,
      };

    case 'interactive understanding check':
      return {
        strategy,
        attemptNumber: attempt,
        title: `Strategy: Interactive Understanding Check (${cleanTitle})`,
        text: `Quick reflection challenge:

Suppose an engineer suggests removing ${cleanTitle} to save 5 lines of code.
What is the primary danger they are introducing?

A) The program will instantly refuse to compile.
B) The system loses its protective constraint, leading to subtle data corruption or race conditions under load.
C) Modern operating systems automatically replace it anyway.

Take a second to consider your answer...
.
.
.
The Answer: B!
${cleanTitle} exists precisely to prevent subtle edge-case errors that only show up when systems scale or experience unexpected inputs. Removing it might look simpler on paper, but it trades away data integrity and reliability.`,
        simplificationSummary: `Presented a trade-off challenge to reinforce why ${cleanTitle} is necessary.`,
      };
  }
}
