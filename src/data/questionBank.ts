// src/data/questionBank.ts
import { Question, SubjectType, GradeLevel } from '../types';
import masterGradeData from './questions/masterGradeBank.json';
import { ALL_QUESTIONS as CURATED_QUESTIONS } from './allQuestions';

// Cast and export the full master bank (over 6,430 questions strictly >= 1,000 per grade)
export const FULL_GRADE_BANK: Question[] = masterGradeData as unknown as Question[];

export const MASTER_QUESTION_BANK: Question[] = [
  ...CURATED_QUESTIONS,
  ...FULL_GRADE_BANK
];

export const FULL_CIVICS_BANK: Question[] = MASTER_QUESTION_BANK.filter(q => q.subject === 'civics');
export const FULL_FINANCE_BANK: Question[] = MASTER_QUESTION_BANK.filter(q => q.subject === 'finance');

export interface QuestionFilterOptions {
  subject?: SubjectType | 'all';
  gradeLevel?: GradeLevel | 'all';
  exactGrade?: string | 'all';
  topic?: string | 'all';
  difficulty?: 'all' | 'בסיסי' | 'בינוני' | 'מתקדם' | 'בגרות' | 'אתגר עליון';
  searchQuery?: string;
}

/**
 * Filter questions with high performance (under 2ms)
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
