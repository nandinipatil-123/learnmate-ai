export type NavPage =
  | 'dashboard'
  | 'learn'
  | 'practice'
  | 'quiz'
  | 'analysis'
  | 'study-plan'
  | 'progress'
  | 'settings';

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
