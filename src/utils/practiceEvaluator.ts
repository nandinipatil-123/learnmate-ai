import { PracticeQuestion, PracticeEvaluation } from '../types';

/**
 * Intelligent static semantic evaluation of practice solutions.
 * Evaluates student answers against key concepts, task requirements,
 * and technical depth without requiring external API calls.
 */
export function evaluateStudentPracticeAnswer(
  question: PracticeQuestion,
  studentAnswer: string
): PracticeEvaluation {
  const rawAnswer = (studentAnswer || '').trim();
  const lower = rawAnswer.toLowerCase();

  // 1. Incomplete / empty submission check
  if (rawAnswer.length < 15) {
    return {
      score: 15,
      verdict: 'Incomplete Submission',
      status: 'incorrect',
      understoodCorrectly: ['Provided an initial submission attempt'],
      missingOrIncorrect: [
        'Missing substantive explanation addressing the question tasks',
        'No technical reasoning or formal notation provided',
      ],
      mistakeExplanation:
        'Your response is too brief to demonstrate conceptual understanding of the problem requirements.',
      howToImprove:
        'Carefully address each numbered task in the problem statement. Write out your steps, key definitions, or schemas clearly.',
      rubric: [
        'Task Completeness: 0 / 40',
        'Technical Accuracy: 10 / 40',
        'Methodology & Notation: 5 / 20',
      ],
      feedback:
        'Please write a comprehensive response addressing all specific questions listed in the problem statement.',
    };
  }

  // 2. Keyword & semantic analysis based on expected keywords and tasks
  const keywords = question.expectedKeywords || [];
  const matchedKeywords = keywords.filter((kw) => lower.includes(kw.toLowerCase()));
  const matchRatio = keywords.length > 0 ? matchedKeywords.length / keywords.length : 0.5;

  // Task-specific checks
  const tasksCount = question.statement.tasks.length;
  const wordCount = rawAnswer.split(/\s+/).length;
  const hasSubstantialLength = wordCount >= 25;

  const understood: string[] = [];
  const missing: string[] = [];

  // Identify understood points
  if (matchedKeywords.length > 0) {
    matchedKeywords.forEach((kw) => {
      understood.push(`Accurately incorporated and applied concept: "${kw}"`);
    });
  } else {
    understood.push('Demonstrated basic awareness of the core problem domain');
  }

  // Identify missing points
  const unmatchedKeywords = keywords.filter((kw) => !lower.includes(kw.toLowerCase()));
  if (unmatchedKeywords.length > 0) {
    unmatchedKeywords.forEach((kw) => {
      missing.push(`Omitted or insufficiently explained key concept: "${kw}"`);
    });
  }

  if (wordCount < 30 && tasksCount >= 2) {
    missing.push('Did not provide a thorough breakdown for all numbered tasks');
  }

  // Determine score and verdict
  let score: number;
  let status: 'correct' | 'partially_correct' | 'incorrect';
  let verdict: string;
  let mistakeExplanation: string;
  let howToImprove: string;

  if (matchRatio >= 0.7 && hasSubstantialLength) {
    score = Math.min(100, Math.round(88 + matchRatio * 10));
    status = 'correct';
    verdict = 'Excellent Technical Solution';
    mistakeExplanation =
      'No major conceptual errors identified. Your response accurately addresses the problem constraints and demonstrates strong foundational grasp.';
    howToImprove =
      'To achieve textbook perfection in exam or interview scenarios, explicitly highlight edge cases or complexity implications (e.g., time/space complexity or lock overhead).';
  } else if (matchRatio >= 0.35 || wordCount >= 30) {
    score = Math.min(84, Math.max(55, Math.round(50 + matchRatio * 35)));
    status = 'partially_correct';
    verdict = 'Partially Correct Breakdown';
    mistakeExplanation =
      'You identified key elements of the problem, but certain vital technical mechanisms or formal justifications were omitted or partially formulated.';
    howToImprove = `Ensure every numbered sub-task is addressed sequentially. Make sure to explicitly define: ${unmatchedKeywords.slice(0, 2).map((k) => `"${k}"`).join(' and ')}.`;
  } else {
    score = Math.max(25, Math.round(25 + matchRatio * 20));
    status = 'incorrect';
    verdict = 'Needs Revision';
    mistakeExplanation =
      'The response does not sufficiently demonstrate the required technical principles or formal rules for this question.';
    howToImprove =
      'Review the core definition and rules for this topic. Use the hint tip provided above the answer box and structure your answer with clear numbered headings.';
  }

  return {
    score,
    verdict,
    status,
    understoodCorrectly: understood.length > 0 ? understood : ['Attempted the practice problem'],
    missingOrIncorrect: missing.length > 0 ? missing : ['Minor formal edge cases can be elaborated'],
    mistakeExplanation,
    howToImprove,
    rubric: [
      `Conceptual Depth: ${status === 'correct' ? 'Full Marks' : status === 'partially_correct' ? 'Proficient' : 'Needs Work'}`,
      `Task Coverage: ${status === 'correct' ? 'Complete' : status === 'partially_correct' ? 'Partial' : 'Incomplete'}`,
      `Technical Precision: ${matchRatio >= 0.5 ? 'Strong' : 'Developing'}`,
    ],
    feedback:
      status === 'correct'
        ? `Superb work on this ${question.type} question! Your reasoning aligns closely with rigorous computer science principles.`
        : status === 'partially_correct'
        ? `Solid foundation shown on ${question.title}. Refine your explanation by including the missing technical components noted below.`
        : `This topic requires careful step-by-step reasoning. Review the problem statement constraints and give it another try.`,
  };
}
