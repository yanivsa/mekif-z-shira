import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  ArrowLeft, 
  PenTool, 
  Sparkles, 
  Award, 
  Shuffle,
  ExternalLink,
  Compass,
  ShieldCheck
} from 'lucide-react';
import { ALL_QUESTIONS } from '../data/allQuestions';
import { FULL_CIVICS_BANK } from '../data/questionBank';
import { Question } from '../types';
import { fireSmallSuccessConfetti } from '../utils/confetti';
import { sound } from '../utils/soundEngine';

interface CivicsHubProps {
  onAddXP: (amount: number) => void;
  onNavigateToTsehes: () => void;
}

export const CivicsHub: React.FC<CivicsHubProps> = ({ onAddXP, onNavigateToTsehes }) => {
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [attemptsCount, setAttemptsCount] = useState<number>(0);
  const [wrongAttempts, setWrongAttempts] = useState<number[]>([]);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Filter civics questions
  const civicsQuestions = FULL_CIVICS_BANK.filter((q) => {
    if (selectedGrade !== 'all') {
      if (selectedGrade === 'junior' && q.gradeLevel !== 'junior') return false;
      if (selectedGrade === 'senior' && q.gradeLevel !== 'senior') return false;
      if (!['junior', 'senior'].includes(selectedGrade) && !q.gradeText.includes(selectedGrade)) return false;
    }
    if (selectedTopic !== 'all' && q.topic !== selectedTopic) return false;
    if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const currentQ: Question | undefined = civicsQuestions[activeQuestionIndex];

  // Topics list for filter
  const topics = Array.from(new Set(FULL_CIVICS_BANK.map(q => q.topic)));

  const handleSelectOption = (idx: number) => {
    if (isAnswered || wrongAttempts.includes(idx)) return;

    if (currentQ && idx === currentQ.correctIndex) {
      setSelectedAnswer(idx);
      setIsAnswered(true);
      setShowExplanation(true);
      setShowHint(false);
      fireSmallSuccessConfetti();
      sound.playCorrect();
      if (attemptsCount === 0) {
        onAddXP(15);
      } else {
        onAddXP(8);
      }
    } else {
      if (attemptsCount === 0) {
        // First mistake: give hint from Shira and let student try again!
        setAttemptsCount(1);
        setWrongAttempts([idx]);
        setShowHint(true);
        sound.playWrong();
      } else {
        // Second mistake: lock question and reveal full answer & explanation
        setWrongAttempts(prev => [...prev, idx]);
        setSelectedAnswer(idx);
        setIsAnswered(true);
        setShowExplanation(true);
        setShowHint(false);
        sound.playWrong();
      }
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowExplanation(false);
    setAttemptsCount(0);
    setWrongAttempts([]);
    setShowHint(false);
    setActiveQuestionIndex((prev) => (prev + 1) % civicsQuestions.length);
  };

  const randomQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowExplanation(false);
    setAttemptsCount(0);
    setWrongAttempts([]);
    setShowHint(false);
    const rand = Math.floor(Math.random() * civicsQuestions.length);
    setActiveQuestionIndex(rand);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-civics-dark via-purple-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-purple-200">
            <BookOpen className="w-3.5 h-3.5" />
            <span>תוכנית הלימודים של משרד החינוך</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">מרחב אזרחות • תיכון מקיף ז׳</h1>
          <p className="text-purple-100 text-sm leading-relaxed">
            מאגר שאלות מובנה הכולל שאלות ידע, הבנה ויישום לחטיבת הביניים ולחטיבה העליונה (לקראת שאלון בגרות 034281).
          </p>
        </div>

        <button
          onClick={onNavigateToTsehes}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-3 rounded-xl shadow-md transition-all text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap self-stretch md:self-auto justify-center"
        >
          <PenTool className="w-4 h-4" />
          <span>עבור למאמן צה״ס לבגרות ➔</span>
        </button>
      </div>

      {/* Official Ministry Portals & Syllabi Banner */}
      <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-slate-50 border border-purple-200 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3 w-full max-w-full overflow-hidden min-w-0">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="p-2.5 bg-civics text-white rounded-2xl shadow-xs shrink-0 mt-0.5">
              <Compass className="w-5 h-5" />
            </span>
            <div>
              <div className="text-sm sm:text-base font-black text-slate-900 flex flex-wrap items-center gap-2">
                <span>מערך תוכניות הלימודים הרשמיות של משרד החינוך</span>
                <span className="text-[11px] bg-purple-100 text-purple-900 font-extrabold px-2.5 py-0.5 rounded-full border border-purple-200">
                  רמת אתגר גבוהה לבגרות
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                השאלות נבנו וכוילו במדויק מתוך חומרי הלימוד הרשמיים בפורטל עובדי הוראה של משרד החינוך, ברמת קושי עילאית המכינה להצטיינות במבחנים ובשאלון 034281.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0 w-full lg:w-auto">
            <a
              href="https://pop.education.gov.il/tchumey_daat/citizenship/junior-high/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-white border border-purple-300 text-purple-900 hover:bg-purple-100 text-xs font-bold px-3 py-2 rounded-xl shadow-2xs transition-all flex-1 lg:flex-initial justify-center"
            >
              <span>פורטל אזרחות חט״ב (ז׳-ט׳)</span>
              <ExternalLink className="w-3.5 h-3.5 text-purple-600" />
            </a>
            <a
              href="https://pop.education.gov.il/tchumey_daat/citizenship/citizenship-high-school/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-civics hover:bg-civics-dark text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-2xs transition-all flex-1 lg:flex-initial justify-center"
            >
              <span>שאלון בגרות 034281 חט״ע</span>
              <ExternalLink className="w-3.5 h-3.5 text-white" />
            </a>
          </div>
        </div>

        {/* 7 Mandatory Units & Core Bagrut Skills Ribbon */}
        <div className="w-full max-w-full overflow-hidden pt-1 border-t border-purple-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold text-slate-700 scrollbar-none overscroll-x-contain">
          <span className="shrink-0 text-purple-700 font-black flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> יחידות הליבה (משרד החינוך):
          </span>
          {[
            "מעמד האזרח וקיום מדינה",
            "מגילת העצמאות והשוויון",
            "הפרדת רשויות ואיזונים",
            "סמלי המדינה וחוק השבות",
            "השלטון המקומי וחוקי עזר",
            "סובלנות ומאבק בשיימינג",
            "פסקת ההגבלה (סעיף 8)",
            "סוגי עבריינות ודגל שחור",
            "דמוקרטיה מתגוננת (סעיף 7א)",
            "סמכות שיורית של הממשלה (32)",
            "מודל צה״ס למענה בבגרות"
          ].map((unit, uIdx) => (
            <span 
              key={uIdx} 
              className="shrink-0 bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-800 text-[11px] font-semibold whitespace-nowrap shadow-2xs"
            >
              {unit}
            </span>
          ))}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        
        {/* Grade tabs */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">שכבת לימוד / כיתה:</span>
            <span className="text-xs text-civics font-bold">
              {civicsQuestions.length} שאלות במאגר
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'כל השכבות' },
              { id: 'ז׳', label: 'כיתה ז׳' },
              { id: 'ח׳', label: 'כיתה ח׳' },
              { id: 'ט׳', label: 'כיתה ט׳' },
              { id: 'י׳', label: 'כיתה י׳' },
              { id: 'י״א', label: 'כיתה י״א' },
              { id: 'י״ב', label: 'כיתה י״ב' },
              { id: 'junior', label: 'חט״ב (ז׳–ט׳)' },
              { id: 'senior', label: 'חט״ע (י׳–י״ב)' }
            ].map((g) => (
              <button
                key={g.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedGrade(g.id);
                  setActiveQuestionIndex(0);
                  setIsAnswered(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedGrade === g.id
                    ? 'bg-civics text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Topic tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 ml-2">נושא:</span>
          <button
            onClick={() => { setSelectedTopic('all'); setActiveQuestionIndex(0); setIsAnswered(false); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              selectedTopic === 'all' ? 'bg-slate-800 text-white font-bold' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            הכל
          </button>
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => { setSelectedTopic(t); setActiveQuestionIndex(0); setIsAnswered(false); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedTopic === t ? 'bg-slate-800 text-white font-bold' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Difficulty and Action row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-slate-500 ml-2">רמת קושי:</span>
            {['all', 'מתקדם', 'בגרות', 'אתגר עליון'].map((diff) => (
              <button
                key={diff}
                onClick={() => { setSelectedDifficulty(diff); setActiveQuestionIndex(0); setIsAnswered(false); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedDifficulty === diff
                    ? diff === 'אתגר עליון'
                      ? 'bg-rose-600 text-white'
                      : 'bg-civics text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {diff === 'all' ? 'הכל' : diff}
              </button>
            ))}
          </div>

          <button
            onClick={randomQuestion}
            className="text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-200 flex items-center gap-1.5 transition-all shadow-2xs"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>שאלה אקראית מתוך {civicsQuestions.length} 🎲</span>
          </button>
        </div>

      </div>

      {/* Question Card */}
      {currentQ ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          
          {/* Question Meta Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-civics-light text-civics-dark font-extrabold text-xs px-2.5 py-1 rounded-full">
                {currentQ.gradeText}
              </span>
              <span className="bg-slate-100 text-slate-700 font-semibold text-xs px-2.5 py-1 rounded-full">
                {currentQ.topic}
              </span>
              <span className={`font-bold text-xs px-2.5 py-1 rounded-full ${
                currentQ.difficulty === 'אתגר עליון'
                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                  : 'bg-amber-100 text-amber-900'
              }`}>
                רמה: {currentQ.difficulty}
              </span>
              {currentQ.source && (
                <span className="bg-indigo-50 text-indigo-900 border border-indigo-200 font-bold text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1">
                  <span>📖 {currentQ.source}</span>
                </span>
              )}
            </div>

            <div className="text-xs text-slate-500 font-bold bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
              שאלה {activeQuestionIndex + 1} מתוך {civicsQuestions.length}
            </div>
          </div>

          {/* Scenario Background (If present) */}
          {currentQ.scenario && (
            <div className="bg-purple-50/70 dark:bg-purple-950/40 border-r-4 border-civics p-4 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-zinc-200 leading-relaxed space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-civics dark:text-purple-300">
                <BookOpen className="w-4 h-4" />
                <span>אירוע / קטע לעיון ולניתוח:</span>
              </div>
              <p className="font-normal">{currentQ.scenario}</p>
            </div>
          )}

          {/* Question Text */}
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-zinc-100 leading-relaxed">
              {currentQ.question}
            </h2>
          </div>

          {/* Teacher Shira's Hint on First Mistake */}
          {showHint && !isAnswered && (
            <div className="bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700/60 rounded-2xl p-4 sm:p-5 text-amber-950 dark:text-amber-200 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300 shadow-md">
              <div className="flex items-center gap-2 font-black text-sm text-amber-800 dark:text-amber-300">
                <span className="text-lg">💡</span>
                <span>לא נורא! הנה רמז משירה – קיראו ונסו שוב:</span>
              </div>
              <p className="text-xs sm:text-sm font-medium leading-relaxed bg-white/80 dark:bg-zinc-900/80 p-3 rounded-xl border border-amber-200 dark:border-amber-800/40">
                {currentQ.shiraTip || 'היזכרו בהגדרה הרשמית של המושג ושימו לב לפרטים המדויקים המופיעים באירוע.'}
              </p>
              <div className="text-xs font-bold text-amber-700 dark:text-amber-400">
                🎯 התשובה שבחרתם אינה נכונה. ביחרו תשובה אחרת מבין האפשרויות הנותרות!
              </div>
            </div>
          )}

          {/* Options */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === currentQ.correctIndex;
              const isWrongAttempt = wrongAttempts.includes(idx);

              let btnStyle = "border-slate-200 dark:border-zinc-800 hover:border-civics hover:bg-slate-50 dark:hover:bg-zinc-800/60 text-slate-800 dark:text-zinc-200";
              
              if (isWrongAttempt && !isAnswered) {
                btnStyle = "border-rose-300 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 line-through opacity-60 cursor-not-allowed";
              } else if (isAnswered) {
                if (isCorrect) {
                  btnStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 font-bold shadow-sm";
                } else if (isSelected) {
                  btnStyle = "border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-950 dark:text-rose-100";
                } else {
                  btnStyle = "border-slate-200 dark:border-zinc-800 text-slate-400 opacity-60";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered || isWrongAttempt}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-2xl border text-right transition-all flex items-start gap-3 text-sm sm:text-base ${btnStyle}`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    isAnswered && isCorrect 
                      ? 'bg-emerald-500 text-white' 
                      : isAnswered && isSelected 
                      ? 'bg-rose-500 text-white'
                      : isWrongAttempt
                      ? 'bg-rose-200 dark:bg-rose-900 text-rose-800'
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="flex-1">{option}</span>
                  {isAnswered && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Teacher Shira's Golden Tip */}
          {showExplanation && (
            <div className="rounded-2xl p-5 border animate-fadeIn space-y-4 bg-slate-50 border-slate-200">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl text-white shrink-0 ${
                  selectedAnswer === currentQ.correctIndex ? 'bg-emerald-500' : 'bg-rose-500'
                }`}>
                  {selectedAnswer === currentQ.correctIndex ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="font-extrabold text-base text-slate-900">
                    {selectedAnswer === currentQ.correctIndex ? 'כל הכבוד! תשובה נכונה (+15 XP) 🎉' : 'לא נורא, זו הזדמנות מעולה ללמוד!'}
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    {currentQ.explanation}
                  </p>
                </div>
              </div>

              {/* Shira's Tip Box */}
              {currentQ.shiraTip && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3 text-xs sm:text-sm text-amber-950">
                  <span className="text-xl shrink-0">👩‍🏫</span>
                  <div>
                    <span className="font-black text-amber-900 ml-1">הטיפ של שירה למבחן:</span>
                    <span>{currentQ.shiraTip}</span>
                  </div>
                </div>
              )}

              {/* Next Question Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={nextQuestion}
                  className="bg-civics hover:bg-civics-dark text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-all text-sm flex items-center gap-2"
                >
                  <span>לשאלה הבאה</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200">
          <p className="text-slate-500 font-medium">לא נמצאו שאלות בסינון זה.</p>
          <button
            onClick={() => { setSelectedGrade('all'); setSelectedTopic('all'); }}
            className="mt-3 text-sm font-bold text-civics underline"
          >
            איפוס סינונים
          </button>
        </div>
      )}

    </div>
  );
};
