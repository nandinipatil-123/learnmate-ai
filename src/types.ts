export type NavPage =
  | 'dashboard'
  | 'learn'
  | 'practice'
  | 'sql-lab'
  | 'quiz'
  | 'analysis'
  | 'study-plan'
  | 'progress'
  | 'settings'
  | 'posters';

export interface LearningTopic {
  id: string;
  name: string;
  status: 'Strong' | 'Average' | 'Weak';
  score: number; // percentage
  category: string;
}

export interface QuizQuestion {
  id: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface StudyDay {
  day: number;
  title: string;
  focus: string;
  topics: string[];
  estimatedHours: number;
  status: 'completed' | 'in-progress' | 'upcoming';
  dateLabel: string;
}

export type AdaptiveStrategy =
  | 'real-world analogy'
  | 'very simple explanation'
  | 'step-by-step breakdown'
  | 'visual-style explanation'
  | 'worked example'
  | 'interactive understanding check';

export interface AdaptiveTeachResponse {
  strategy: AdaptiveStrategy | string;
  title: string;
  text: string;
  attemptNumber: number;
  simplificationSummary?: string;
}

export interface TeachContent {
  topicTitle: string;
  simpleExplanation: {
    headline: string;
    paragraphs: string[];
    keyPoints: string[];
    rulesOfThumb?: { label: string; rule: string }[];
  };
  realWorldAnalogy: {
    analogyTitle: string;
    story: string;
    breakdownPoints?: { title: string; description: string }[];
    solutionTakeaway: string;
  };
  visualExplanation: {
    subtitle: string;
    diagramAscii: string;
    diagramExplanation?: string;
    visualBlocks?: { title: string; codeOrSchema: string; annotation?: string }[];
  };
  simpleExample: {
    subtitle: string;
    context: string;
    codeOrData?: string;
    stepsOrBreakdown: string[];
    conclusion?: string;
  };
  checkUnderstanding: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  alternateExplanation?: {
    title: string;
    text: string;
    strategy?: AdaptiveStrategy | string;
    attemptNumber?: number;
  };
}

export type AnswerVerdict = 'correct' | 'partially_correct' | 'incorrect';

export type PracticeQuestionType =
  | 'Conceptual'
  | 'Problem-solving'
  | 'Scenario-based'
  | 'SQL/coding'
  | 'Exam-oriented'
  | 'Application-based'
  | 'Debugging'
  | 'Calculation/derivation'
  | 'Compare-and-explain'
  | 'Case-study';

export interface PracticeEvaluation {
  score: number; // 0 - 100
  verdict: string;
  status: AnswerVerdict;
  understoodCorrectly: string[];
  missingOrIncorrect: string[];
  mistakeExplanation: string;
  howToImprove: string;
  rubric: string[];
  feedback: string;
}

export interface PracticeQuestion {
  id: string;
  code: string;
  unitId?: 'unit-1' | 'unit-2' | 'unit-3' | 'unit-4' | 'unit-5';
  unitNumber?: 1 | 2 | 3 | 4 | 5;
  unitTitle?: string;
  subject: 'DBMS' | 'Java' | 'DSA';
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: PracticeQuestionType;
  title: string;
  description: string;
  statement: {
    context: string;
    schemaOrCode?: string;
    tasks: string[];
  };
  tip?: string;
  defaultAnswer?: string;
  expectedKeywords?: string[];
  sampleSolution: string;
}
