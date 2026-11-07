export type SubjectType = 'civics' | 'finance';
export type GradeLevel = 'junior' | 'senior' | 'all';

export interface Question {
  id: string;
  subject: SubjectType;
  gradeLevel: GradeLevel;
  gradeText: string;
  topic: string;
  difficulty: 'בסיסי' | 'בינוני' | 'מתקדם' | 'בגרות' | 'אתגר עליון';
  question: string;
  scenario?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  shiraTip?: string;
  source?: string;
}

export interface TsehesStep {
  prompt: string;
  options: string[];
  correctIndex: number;
  points: number;
  feedback: string;
}

export interface TsehesRubricBreakdown {
  component: string;
  points: number;
  requirement: string;
}

export interface TsehesQuestion {
  id: string;
  year: string;
  topic: string;
  title: string;
  scenario: string;
  question: string;
  step1_tzayen: TsehesStep;
  step2_hatzeg: TsehesStep;
  step3_hasber: TsehesStep;
  moeRubric: {
    totalPoints: number;
    breakdown: TsehesRubricBreakdown[];
    officialAnswerModel: string;
  };
}

export interface GlossaryTerm {
  id: string;
  term: string;
  category: string;
  definition: string;
  shiraTip?: string;
  gradeLevel: 'junior' | 'senior' | 'both';
}

export interface ExternalTool {
  id: string;
  name: string;
  organization: string;
  description: string;
  url: string;
  category: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserStats {
  studentName: string;
  xp: number;
  streakDays: number;
  lastActiveDate: string;
  quizzesCompleted: number;
  tsehesCompleted: number;
  correctAnswersCount: number;
  totalAnswersCount: number;
  badges: Badge[];
}

export interface ExamResult {
  date: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  topic: string;
  subject: SubjectType;
  timeSpentSeconds: number;
  mistakes: {
    question: string;
    userAnswer: string;
    correctAnswer: string;
    explanation: string;
    shiraTip?: string;
  }[];
}
