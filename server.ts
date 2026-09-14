import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { extractTopicAndIntent, generateDynamicTutorContent } from './src/server/tutorEngine.js';
import {
  generateDynamicAdaptiveContent,
  selectAdaptiveStrategy,
  ALL_ADAPTIVE_STRATEGIES,
} from './src/server/adaptiveTutor.js';
import {
  PRACTICE_QUESTIONS,
  evaluatePracticeAnswerDynamic,
} from './src/server/practiceEvaluator.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let genAIClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in the server environment');
    }
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// Structured schema for 5-layer learning breakdown
const teachResponseSchema = {
  type: Type.OBJECT,
  properties: {
    topicTitle: {
      type: Type.STRING,
      description: 'Clean formatted title of the topic, e.g. "Database Triggers (BEFORE, AFTER & INSTEAD OF)"',
    },
    simpleExplanation: {
      type: Type.OBJECT,
      properties: {
        headline: {
          type: Type.STRING,
          description: 'A punchy, clear one-sentence core definition or thesis of the topic',
        },
        paragraphs: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Detailed, highly educational explanation paragraphs appropriate for a college engineering student',
        },
        keyPoints: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Core concepts, mechanisms, and takeaways as clean bullet points',
        },
        rulesOfThumb: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              rule: { type: Type.STRING },
            },
            required: ['label', 'rule'],
          },
          description: 'Practical rules of thumb, heuristics, or exam tips',
        },
      },
      required: ['headline', 'paragraphs', 'keyPoints', 'rulesOfThumb'],
    },
    realWorldAnalogy: {
      type: Type.OBJECT,
      properties: {
        analogyTitle: {
          type: Type.STRING,
          description: 'Short catchy title for the real-world analogy',
        },
        story: {
          type: Type.STRING,
          description: 'An intuitive, memorable real-world story or everyday metaphor explaining the concept',
        },
        breakdownPoints: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
            },
            required: ['title', 'description'],
          },
          description: 'Mapping specific elements of the analogy directly to technical components',
        },
        solutionTakeaway: {
          type: Type.STRING,
          description: 'Summary of the lesson learned from the analogy',
        },
      },
      required: ['analogyTitle', 'story', 'solutionTakeaway'],
    },
    visualExplanation: {
      type: Type.OBJECT,
      properties: {
        subtitle: {
          type: Type.STRING,
          description: 'Descriptive title for the diagram',
        },
        diagramAscii: {
          type: Type.STRING,
          description: 'Clean, beautiful ASCII art diagram illustrating relationships, tables, memory, or workflow',
        },
        diagramExplanation: {
          type: Type.STRING,
          description: 'Concise explanation guiding the student through the ASCII diagram',
        },
      },
      required: ['subtitle', 'diagramAscii', 'diagramExplanation'],
    },
    simpleExample: {
      type: Type.OBJECT,
      properties: {
        subtitle: {
          type: Type.STRING,
          description: 'Descriptive title for the practical code or query example',
        },
        context: {
          type: Type.STRING,
          description: 'Brief realistic context or problem statement introducing the code',
        },
        codeOrData: {
          type: Type.STRING,
          description: 'Actual syntactically valid code or SQL statements with helpful comments',
        },
        stepsOrBreakdown: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Numbered breakdown of how the code or query executes step-by-step',
        },
        conclusion: {
          type: Type.STRING,
          description: 'Key takeaway from this example',
        },
      },
      required: ['subtitle', 'context', 'codeOrData', 'stepsOrBreakdown', 'conclusion'],
    },
    checkUnderstanding: {
      type: Type.OBJECT,
      properties: {
        question: { type: Type.STRING, description: 'ONE short conceptual multiple-choice question testing the topic' },
        options: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Exactly 4 multiple choice options',
        },
        correctIndex: {
          type: Type.INTEGER,
          description: '0-based index (0 to 3) of the correct answer option',
        },
        explanation: {
          type: Type.STRING,
          description: 'Clear educational explanation of why the correct option is right and others are wrong',
        },
      },
      required: ['question', 'options', 'correctIndex', 'explanation'],
    },
    alternateExplanation: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'Fresh alternative mental model title' },
        text: { type: Type.STRING, description: 'Distinct alternative explanation or intuitive shortcut' },
      },
      required: ['title', 'text'],
    },
  },
  required: [
    'topicTitle',
    'simpleExplanation',
    'realWorldAnalogy',
    'visualExplanation',
    'simpleExample',
    'checkUnderstanding',
    'alternateExplanation',
  ],
};

// In-memory record of the current or most recent topic studied in Learn
let currentLearnedSession = {
  subject: 'DBMS',
  topicTitle: 'DBMS Normalization (1NF → 2NF → 3NF)',
  topicInput: 'Explain normalization',
  timestamp: Date.now(),
};

// Current learned topic endpoint for Learn -> Practice integration
app.get('/api/current-learned-topic', (req, res) => {
  res.json(currentLearnedSession);
});

// Teach Me API endpoint
app.post('/api/teach', async (req, res) => {
  const { topic, subject = 'DBMS', previousTopic } = req.body;
  if (!topic || typeof topic !== 'string' || !topic.trim()) {
    res.status(400).json({ error: 'Please enter a concept, question, or topic to learn.' });
    return;
  }

  const trimmedTopic = topic.trim();
  const topicIntent = extractTopicAndIntent(trimmedTopic, subject, previousTopic);

  // If GEMINI_API_KEY is configured, call Gemini with adaptive pedagogical prompting
  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = getGeminiClient();

      const systemInstruction = `You are LearnMate, an expert, encouraging, and genuinely adaptive AI learning agent and computer science engineering tutor.

CORE TUTORING OBJECTIVES:
1. THE STUDENT'S CURRENT MESSAGE ALWAYS CONTROLS THE LEARNING CONTENT:
   - Understand the student's complete natural-language request: identify what they are asking to learn, their conceptual difficulty, and their desired learning style.
   - The selected subject context (${subject}) is ONLY background context for disambiguation. If the student asks about a concept from another subject or asks to compare concepts across subjects, ALWAYS prioritize the student's message.
   - Never use conversational framing (e.g. "Explain about...", "Can you tell me about...", "Give more details on...") as the topicTitle. Always set topicTitle to an authoritative, clean academic title.

2. ADAPTIVE TEACHING STRATEGIES & DEPTH:
   - EXPLAIN: Provide a deep, structured, authoritative explanation answering what it is, why it was created, how it works internally, and where it is applied.
   - SIMPLIFY (e.g. "I don't understand", "explain simply", "ELI5", "basics"): Strip away academic jargon, explain the core intuition using everyday reasoning, step-by-step clarity, and zero unnecessary abstractions.
   - DEEP DIVE (e.g. "give more details", "in-depth", "how does it work under the hood", "advanced"): Provide graduate-level engineering rigor: storage engines, CPU/memory layout, execution pipelines, concurrency, asymptotic complexity, edge cases, and architectural best practices.
   - COMPARE (e.g. "A vs B", "compare", "difference between", "quicksort vs mergesort", "abstract class vs interface"): Structure all 5 perspectives to contrast the concepts side-by-side, analyzing trade-offs, performance differences, and concrete decision criteria for when to use which.
   - PRACTICAL EXAMPLES (e.g. "with example", "show code", "real world use"): Deliver production-grade, syntactically valid code/queries with realistic schemas/classes, line-by-line breakdown, and practical edge-case handling.
   - ALTERNATIVE PERSPECTIVE (e.g. "I still don't get it", "explain differently"): Provide a radically different mental model, physical analogy, or conceptual framework that attacks the misunderstanding from a fresh angle.

3. ZERO GENERIC AI FILLER:
   - STRICTLY PROHIBITED: Never use generic boilerplate or filler phrases such as "core invariant", "foundational computer science concept", "architectural benefit", "reduces cognitive load", "optimized outcome", "atomic testable sub-steps".
   - Every single explanation, analogy, diagram, code snippet, and question must be rich, concrete, and technically authentic to the exact topic requested.

4. 5 LEARNING PERSPECTIVES (STRICT SCHEMA COMPLIANCE):
   - topicTitle: Clean, authoritative academic title representing the concept or comparison.
   - simpleExplanation: headline (direct thesis statement), paragraphs (2-4 rich paragraphs), keyPoints (4-6 actionable takeaways), rulesOfThumb (2-4 practical rules).
   - realWorldAnalogy: analogyTitle (evocative title), story (tangible everyday scenario), breakdownPoints (mapping analogy elements to technical elements), solutionTakeaway (key insight).
   - visualExplanation: subtitle, diagramAscii (crisp ASCII art diagram of tables, pointers, execution flow, or memory), diagramExplanation (concise explanation).
   - simpleExample: subtitle, context, codeOrData (authentic code/query with comments), stepsOrBreakdown (step-by-step trace), conclusion.
   - checkUnderstanding: question (specific to this topic), options (exactly 4 distinct options), correctIndex (0-3), explanation (detailed educational reason).
   - alternateExplanation: title (fresh mental model), text (alternative shortcut or intuitive takeaway for students who click "I STILL DON'T GET IT").`;

      const promptInstructions = `STUDENT COMPLETE INPUT: "${trimmedTopic}"
BACKGROUND SUBJECT CONTEXT: ${subject}
${previousTopic ? `PREVIOUS TOPIC / CONTEXT: "${previousTopic}"` : ''}
DETECTED INTENT & STRATEGY: ${topicIntent.intent.toUpperCase()} (Requested Depth: ${topicIntent.detailLevel.toUpperCase()})
${topicIntent.isComparison && topicIntent.comparisonEntities ? `COMPARATIVE ENTITIES: ${topicIntent.comparisonEntities[0]} vs ${topicIntent.comparisonEntities[1]}` : ''}

Generate a personalized, deeply engaging, and technically authentic 5-layer learning breakdown specifically customized for this student request.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptInstructions,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: teachResponseSchema,
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Gemini returned an empty response');
      }

      const parsedData = JSON.parse(responseText);
      currentLearnedSession = {
        subject: (subject as any) || 'DBMS',
        topicTitle: parsedData.topicTitle || trimmedTopic,
        topicInput: trimmedTopic,
        timestamp: Date.now(),
      };
      res.json(parsedData);
      return;
    } catch (err: any) {
      console.error('Gemini API error in /api/teach, falling through to dynamic tutor generator:', err);
      // Fall through to dynamic fallback generator below
    }
  }

  // When GEMINI_API_KEY is not configured or on quota/network error, synthesize a dynamic response directly from student input
  console.log(`[LearnMate] Synthesizing dynamic adaptive tutor response for: "${trimmedTopic}" (Subject context: ${subject})`);
  const dynamicData = generateDynamicTutorContent(trimmedTopic, subject, previousTopic);
  currentLearnedSession = {
    subject: (subject as any) || 'DBMS',
    topicTitle: dynamicData.topicTitle || trimmedTopic,
    topicInput: trimmedTopic,
    timestamp: Date.now(),
  };
  res.json(dynamicData);
});

// Structured schema for adaptive re-teaching when student clicks "I STILL DON'T GET IT"
const adaptiveTeachSchema = {
  type: Type.OBJECT,
  properties: {
    strategy: {
      type: Type.STRING,
      description:
        'The teaching strategy chosen: "real-world analogy" | "very simple explanation" | "step-by-step breakdown" | "visual-style explanation" | "worked example" | "interactive understanding check"',
    },
    title: {
      type: Type.STRING,
      description:
        'A descriptive strategy title, e.g. "Strategy: Real-World Analogy (The Coat Check Ticket)" or "Strategy: Step-by-Step Breakdown (Simplified)"',
    },
    text: {
      type: Type.STRING,
      description:
        'The full, progressively simplified re-teaching explanation using the chosen strategy, deeply focused on the current concept and substantially different from prior explanations.',
    },
    simplificationSummary: {
      type: Type.STRING,
      description: 'Brief note describing how this explanation progressively simplifies the concept for the student.',
    },
  },
  required: ['strategy', 'title', 'text'],
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Adaptive Re-Teach Endpoint ("I STILL DON'T GET IT" action)
app.post('/api/adaptive-teach', async (req, res) => {
  const {
    topic,
    subject = 'DBMS',
    previousExplanation,
    attemptCount = 1,
    usedStrategies = [],
    preferredStrategy,
  } = req.body;

  if (!topic || typeof topic !== 'string' || !topic.trim()) {
    res.status(400).json({ error: 'Please specify the concept currently being studied.' });
    return;
  }

  const cleanTopic = topic.trim();
  const numericAttempt = Math.max(1, Number(attemptCount) || 1);
  const targetStrategy = selectAdaptiveStrategy(numericAttempt, usedStrategies, preferredStrategy);

  // If GEMINI_API_KEY is configured, invoke Gemini with the adaptive re-teaching prompt
  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = getGeminiClient();

      const systemInstruction = `You are LearnMate's Adaptive Teaching Engine.
A student is currently studying a computer science topic but clicked "I STILL DON'T GET IT" (Attempt #${numericAttempt}).

YOUR MANDATE:
1. UNDERSTAND THE CONCEPT CURRENTLY BEING STUDIED:
   - Target Concept: ${cleanTopic}
   - Subject Domain: ${subject}
   - Previous Explanation / Analogy: ${JSON.stringify(previousExplanation || 'Initial explanation')}

2. TEACH THE SAME CONCEPT USING A SUBSTANTIALLY DIFFERENT STRATEGY:
   - Strategy assigned for this attempt: "${targetStrategy}"
   - Allowed strategies to switch between:
     * real-world analogy: An everyday physical or life scenario (distinct from any prior analogy) that mirrors the concept's mechanical behavior with zero technical jargon.
     * very simple explanation: Plain language ELI5 (Explain Like I'm 5) explanation that strips all academic jargon, focusing on: What is it? Why do we care? What is the simple rule?
     * step-by-step breakdown: Numbered micro-steps (Step 1, Step 2, Step 3...) tracing what happens sequentially without jumping ahead or assuming prior knowledge.
     * visual-style explanation: Spatial ASCII diagram or schematic showing relations, table layout, pointer flow, or state transitions with clear labels.
     * worked example: Concrete walkthrough with actual values or realistic snippets, showing input -> operation -> output.
     * interactive understanding check: A mini thought experiment or scenario question ("What would happen if...?") followed by an intuitive explanation revealing the core insight.

3. PROGRESSIVELY SIMPLIFY BASED ON DIFFICULTY:
   - The student has clicked "I STILL DON'T GET IT" ${numericAttempt} time(s).
   - Progressively simplify: reduce cognitive load, shorten sentences, eliminate academic abstractions, and address why the student might be confused.
   - Do NOT repeat the previous explanation or previous analogies.

4. FOCUS AND AUTHENTICITY:
   - Remain 100% focused on ${cleanTopic}.
   - Never use generic placeholder phrases like "core invariant", "cognitive load", "architectural benefit". Make every line rich, insightful, and technically accurate.`;

      const prompt = `Student says: "I STILL DON'T GET IT" for: "${cleanTopic}" (${subject}).
Attempt Count: ${numericAttempt}
Previous Strategies Used: ${JSON.stringify(usedStrategies)}
Required Strategy: "${targetStrategy}"

Generate a fresh, substantially different, progressively simplified explanation teaching "${cleanTopic}" using the "${targetStrategy}" strategy.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: adaptiveTeachSchema,
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Gemini returned empty response for adaptive teaching');
      }

      const parsed = JSON.parse(responseText);
      res.json({
        strategy: parsed.strategy || targetStrategy,
        title: parsed.title,
        text: parsed.text,
        simplificationSummary: parsed.simplificationSummary || '',
        attemptNumber: numericAttempt,
      });
      return;
    } catch (err: any) {
      console.error('Gemini error in /api/adaptive-teach, using dynamic adaptive fallback:', err);
      // Fall through to dynamic fallback below
    }
  }

  // Fallback when GEMINI_API_KEY is not configured or on network error
  console.log(`[LearnMate] Generating dynamic adaptive explanation for "${cleanTopic}" with strategy "${targetStrategy}" (Attempt ${numericAttempt})`);
  const adaptiveData = generateDynamicAdaptiveContent({
    topic: cleanTopic,
    subject,
    previousExplanation,
    attemptCount: numericAttempt,
    usedStrategies,
    preferredStrategy: targetStrategy,
  });

  res.json(adaptiveData);
});

// Structured schema for AI practice evaluation
const practiceEvaluationSchema = {
  type: Type.OBJECT,
  properties: {
    status: {
      type: Type.STRING,
      description:
        'Must be one of "correct", "partially_correct", or "incorrect" based on semantic analysis of meaning, not exact wording.',
    },
    score: {
      type: Type.INTEGER,
      description: 'Numeric grade from 0 to 100 based on completeness, accuracy, and reasoning.',
    },
    verdict: {
      type: Type.STRING,
      description:
        'Short punchy verdict title, e.g. "Excellent Breakdown", "Partially Correct", "Needs Revision", "Solid Architectural Reasoning".',
    },
    understoodCorrectly: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description:
        'List of specific concepts, keys, derivations, or steps the student understood correctly in their answer.',
    },
    missingOrIncorrect: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description:
        'List of elements that are missing, incomplete, or mathematically/logically incorrect.',
    },
    mistakeExplanation: {
      type: Type.STRING,
      description:
        'A clear, pedagogical explanation of what went wrong or why a mistake happened, highlighting the underlying truth.',
    },
    howToImprove: {
      type: Type.STRING,
      description:
        'Concrete, actionable guidance on how the student can improve and master this concept for exam questions.',
    },
    rubric: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '3-4 rubric items showing how the student scored on each core requirement.',
    },
    feedback: {
      type: Type.STRING,
      description:
        'A warm, professional summary paragraph evaluating the student solution and explaining the verdict.',
    },
  },
  required: [
    'status',
    'score',
    'verdict',
    'understoodCorrectly',
    'missingOrIncorrect',
    'mistakeExplanation',
    'howToImprove',
    'rubric',
    'feedback',
  ],
};

// Practice Questions endpoint
app.get('/api/practice-questions', (req, res) => {
  const { subject } = req.query;
  if (subject && typeof subject === 'string') {
    const filtered = PRACTICE_QUESTIONS.filter(
      (q) => q.subject.toLowerCase() === subject.toLowerCase()
    );
    res.json(filtered.length ? filtered : PRACTICE_QUESTIONS);
    return;
  }
  res.json(PRACTICE_QUESTIONS);
});

// Practice Answer Evaluation endpoint
app.post('/api/evaluate-practice', async (req, res) => {
  const { subject = 'DBMS', question, studentAnswer, answer } = req.body;

  if (!question || !question.title) {
    res.status(400).json({ error: 'Question context is required for AI evaluation.' });
    return;
  }

  const rawAnswer = studentAnswer !== undefined ? studentAnswer : answer;
  const cleanAnswer = typeof rawAnswer === 'string' ? rawAnswer.trim() : '';

  // If GEMINI_API_KEY is configured, perform intelligent semantic evaluation with Gemini
  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = getGeminiClient();

      const systemInstruction = `You are LearnMate's Senior Computer Science Professor and AI Practice Evaluation Engine.
Your task is to evaluate a student's answer to a practice question in ${subject}.

CRITICAL EVALUATION PRINCIPLES:
1. SEMANTIC MEANING OVER EXACT WORDING:
   - Understand the logical, conceptual, and mathematical meaning of the student's submission.
   - Do NOT require exact textbook phrasing, specific naming conventions, or verbatim formulas.
   - Accept mathematically or conceptually equivalent expressions, notations, and decomposition orders.

2. RIGOROUS & FAIR CLASSIFICATION:
   - "correct": The student accurately addresses the core tasks without major conceptual errors (score 85-100).
   - "partially_correct": The student grasped some concepts (e.g., identified the key or spotted a violation) but missed part of the task, made an arithmetic/logical slip, or gave an incomplete decomposition (score 45-84).
   - "incorrect": The core thesis or answer is fundamentally flawed, contradicts the principles of the discipline, or misses the question completely (score 0-44).

3. DETAILED ACTIONABLE FEEDBACK:
   - understoodCorrectly: Concrete items the student got right.
   - missingOrIncorrect: Elements that were absent or mistaken.
   - mistakeExplanation: Clear, encouraging explanation of the mistake.
   - howToImprove: Specific, high-leverage steps the student can take right now to master this question.
   - rubric: 3-4 bullet points summarizing performance on the problem's rubric criteria.
   - feedback: 2-3 sentences providing an executive summary evaluation.`;

      const problemContext = question.statement?.context || question.context || '';
      const schemaOrCode = question.statement?.schemaOrCode || question.schemaOrCode || '';
      const tasksArray = question.statement?.tasks || (Array.isArray(question.tasks) ? question.tasks : [question.tasks || '']);
      const sampleSol = question.sampleSolution || '';

      const prompt = `SUBJECT: ${subject}
QUESTION TITLE: ${question.title}
QUESTION CODE: ${question.code || 'DBMS-PRACTICE'}
PROBLEM CONTEXT:
${problemContext}
${schemaOrCode}

TASKS REQUIRED:
${tasksArray.join('\n')}

MODEL / BENCHMARK SOLUTION:
${sampleSol}

STUDENT'S SUBMITTED ANSWER:
"""
${cleanAnswer || '(No answer provided)'}
"""

Evaluate the student's answer based on semantic meaning and compare with the model solution. Generate the complete structured evaluation report.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: practiceEvaluationSchema,
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Gemini returned empty response for practice evaluation');
      }

      const parsed = JSON.parse(responseText);
      const validStatuses = ['correct', 'partially_correct', 'incorrect'];
      if (!validStatuses.includes(parsed.status)) {
        parsed.status = parsed.score >= 85 ? 'correct' : parsed.score >= 50 ? 'partially_correct' : 'incorrect';
      }
      res.json(parsed);
      return;
    } catch (err: any) {
      console.error('Gemini error in /api/evaluate-practice, using dynamic fallback:', err);
      // Fall through to dynamic fallback
    }
  }

  // Fallback when GEMINI_API_KEY is not configured or on network error
  console.log(`[LearnMate] Performing dynamic AI evaluation for practice question: "${question.title}" (Subject: ${subject})`);
  const dynamicEval = evaluatePracticeAnswerDynamic({
    subject,
    question,
    studentAnswer: cleanAnswer,
  });

  res.json(dynamicEval);
});

// Endpoint for runtime AI educational poster image generation via Gemini Image models
app.post('/api/generate-poster-image', async (req, res) => {
  const { topicName, unitTitle, prompt: customPrompt } = req.body;
  if (!topicName) {
    return res.status(400).json({ error: 'Topic name is required' });
  }

  const promptText =
    customPrompt ||
    `Educational poster explaining ${topicName} in DBMS (${unitTitle || 'Database Management Systems'}). Clear visual infographic layout with dark modern background, distinct sections with diagrams, illustrations, flowcharts, icons, short readable text, examples, key concepts, college computer science infographic style.`;

  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image',
        contents: {
          parts: [{ text: promptText }],
        },
        config: {
          imageConfig: {
            aspectRatio: '3:4',
            imageSize: '1K',
          },
        },
      });

      for (const candidate of response.candidates || []) {
        for (const part of candidate.content?.parts || []) {
          if (part.inlineData?.data) {
            const mimeType = part.inlineData.mimeType || 'image/png';
            return res.json({
              success: true,
              imageUrl: `data:${mimeType};base64,${part.inlineData.data}`,
              modelUsed: 'gemini-3.1-flash-image',
              prompt: promptText,
            });
          }
        }
      }
    } catch (err: any) {
      console.warn('Image generation via Gemini API notice:', err?.message);
      return res.json({
        success: false,
        error: err?.message || 'Live generation with Gemini model requires paid quota',
        requiresPaidModel: true,
        modelInfo: 'Live on-demand image generation via Gemini API uses "gemini-3.1-flash-image" or "gemini-3-pro-image", which requires a paid API key configured in Settings > Secrets. LearnMate provides high-resolution pre-rendered AI educational posters for all topics.',
      });
    }
  }

  return res.json({
    success: false,
    requiresPaidModel: true,
    modelInfo: 'Live on-demand image generation via Gemini API uses "gemini-3.1-flash-image". Configure an API key with image generation quota in Settings > Secrets.',
  });
});

// Start server with Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
