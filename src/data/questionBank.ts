// src/data/questionBank.ts
import { Question, SubjectType, GradeLevel } from '../types';
import civicsData from './questions/civicsBank.json';
import financeData from './questions/financeBank.json';
import { ALL_QUESTIONS as CURATED_QUESTIONS } from './allQuestions';

// Cast and combine the full static bank
export const FULL_CIVICS_BANK: Question[] = civicsData as unknown as Question[];
export const FULL_FINANCE_BANK: Question[] = financeData as unknown as Question[];

export const MASTER_QUESTION_BANK: Question[] = [
  ...CURATED_QUESTIONS,
  ...FULL_CIVICS_BANK,
  ...FULL_FINANCE_BANK
];

export interface QuestionFilterOptions {
  subject?: SubjectType | 'all';
  gradeLevel?: GradeLevel | 'all';
  exactGrade?: string | 'all';
  topic?: string | 'all';
  difficulty?: 'all' | 'בסיסי' | 'בינוני' | 'מתקדם' | 'בגרות' | 'אתגר עליון';
  searchQuery?: string;
}

/**
 * Filter questions with high performance
 */
export function getFilteredQuestions(options: QuestionFilterOptions): Question[] {
  const { subject, gradeLevel, exactGrade, topic, difficulty, searchQuery } = options;

  let pool = MASTER_QUESTION_BANK;

  if (subject && subject !== 'all') {
    pool = pool.filter(q => q.subject === subject);
  }

  if (gradeLevel && gradeLevel !== 'all') {
    pool = pool.filter(q => q.gradeLevel === gradeLevel);
  }

  if (exactGrade && exactGrade !== 'all') {
    pool = pool.filter(q => q.gradeText.includes(exactGrade));
  }

  if (topic && topic !== 'all') {
    pool = pool.filter(q => q.topic === topic);
  }

  if (difficulty && difficulty !== 'all') {
    pool = pool.filter(q => q.difficulty === difficulty);
  }

  if (searchQuery && searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase().trim();
    pool = pool.filter(q => 
      q.question.toLowerCase().includes(query) ||
      (q.scenario && q.scenario.toLowerCase().includes(query)) ||
      q.topic.toLowerCase().includes(query) ||
      (q.shiraTip && q.shiraTip.toLowerCase().includes(query))
    );
  }

  return pool;
}

/**
 * Generate a randomized test quiz of any size from the master bank
 */
export function generateMockExam(count: number = 10, options: QuestionFilterOptions = {}): Question[] {
  const filtered = getFilteredQuestions(options);
  if (filtered.length <= count) {
    return [...filtered].sort(() => 0.5 - Math.random());
  }

  // Shuffle and slice
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
