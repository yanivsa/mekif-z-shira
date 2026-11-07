import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Award, 
  ArrowLeft, 
  RotateCcw, 
  Printer, 
  AlertCircle, 
  Check, 
  X,
  FileCheck
} from 'lucide-react';
import { Question, SubjectType, ExamResult } from '../types';
import { MASTER_QUESTION_BANK, getFilteredQuestions } from '../data/questionBank';
import { fireSchoolPrideConfetti } from '../utils/confetti';
import { sound } from '../utils/soundEngine';

interface ExamSimulatorProps {
  onAddXP: (amount: number) => void;
  onQuizCompleted: () => void;
  studentName: string;
}

export const ExamSimulator: React.FC<ExamSimulatorProps> = ({
  onAddXP,
  onQuizCompleted,
  studentName
}) => {
  // Setup state
  const [examStatus, setExamStatus] = useState<'setup' | 'active' | 'finished'>('setup');
  const [selectedSubject, setSelectedSubject] = useState<'all' | 'civics' | 'finance'>('all');
  const [selectedGrade, setSelectedGrade] = useState<'all' | 'junior' | 'senior'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(15);

  // Active exam state
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>(900);

  // Results state
  const [examResult, setExamResult] = useState<ExamResult | null>(null);

  // Timer effect
  useEffect(() => {
    let interval: any;
    if (examStatus === 'active' && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            finishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [examStatus, secondsRemaining]);

  // Available questions in current setup pool
  const currentPool = getFilteredQuestions({
    subject: selectedSubject,
    gradeLevel: selectedGrade,
    difficulty: selectedDifficulty as any
  });

  const startExam = () => {
    // Pick requested count from currentPool
    const shuffled = [...currentPool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(questionCount, shuffled.length));

    setActiveQuestions(selected);
    setCurrentIdx(0);
    setUserAnswers({});
    setSecondsRemaining(timeLimitMinutes * 60);
    setExamStatus('active');
  };

  const handleSelectOption = (optionIdx: number) => {
    sound.playClick();
    setUserAnswers((prev) => ({
      ...prev,
      [currentIdx]: optionIdx
    }));
  };

  const finishExam = () => {
    let correctCount = 0;
    const mistakes: ExamResult['mistakes'] = [];

    activeQuestions.forEach((q, idx) => {
      const userChoice = userAnswers[idx];
      if (userChoice === q.correctIndex) {
        correctCount++;
      } else {
        mistakes.push({
          question: q.question,
          userAnswer: userChoice !== undefined ? q.options[userChoice] : 'לא נענה',
          correctAnswer: q.options[q.correctIndex],
          explanation: q.explanation,
          shiraTip: q.shiraTip
        });
      }
    });

    const score = Math.round((correctCount / activeQuestions.length) * 100);
    const timeSpent = timeLimitMinutes * 60 - secondsRemaining;

    const result: ExamResult = {
      date: new Date().toLocaleDateString('he-IL'),
      score,
      totalQuestions: activeQuestions.length,
      correctCount,
      topic: selectedSubject === 'civics' ? 'אזרחות' : selectedSubject === 'finance' ? 'חינוך פיננסי' : 'משולב (אזרחות ופיננסים)',
      subject: selectedSubject === 'finance' ? 'finance' : 'civics',
      timeSpentSeconds: timeSpent,
      mistakes
    };

    setExamResult(result);
    setExamStatus('finished');

    // Add XP & badges
    onAddXP(score >= 80 ? 50 : 25);
    onQuizCompleted();

    if (score >= 80) {
      fireSchoolPrideConfetti();
      sound.playFanfare();
    } else {
      sound.playStreak();
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. SETUP SCREEN */}
      {examStatus === 'setup' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-6 animate-fadeIn">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto text-2xl shadow-xs">
              📝
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              סימולציית מבחן כיתתי • מקיף ז׳
            </h1>
            <p className="text-sm text-slate-500">
              התנסות במבחן כיתתי אמיתי עם שעון עצר, ציון מפורט ודוח תוצאות להצגה למורה שירה.
            </p>
          </div>

          <div className="space-y-5 pt-2 text-sm">
            {/* Subject selector */}
            <div className="space-y-2">
              <label className="font-bold text-slate-800 block">בחר תחום למבחן:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSubject('all')}
                  className={`p-3 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                    selectedSubject === 'all'
                      ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  משולב (הכל)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSubject('civics')}
                  className={`p-3 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                    selectedSubject === 'civics'
                      ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  אזרחות בלבד
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSubject('finance')}
                  className={`p-3 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                    selectedSubject === 'finance'
                      ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  חינוך פיננסי
                </button>
              </div>
            </div>

            {/* Grade level selector */}
            <div className="space-y-2">
              <label className="font-bold text-slate-800 block">שכבת גיל / שלב חינוך:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedGrade('all')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    selectedGrade === 'all'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  כל השכבות
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedGrade('junior')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    selectedGrade === 'junior'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  חט״ב (ז׳–ט׳)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedGrade('senior')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    selectedGrade === 'senior'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  חט״ע ובגרות (י׳–י״ב)
                </button>
              </div>
            </div>

            {/* Difficulty selector */}
            <div className="space-y-2">
              <label className="font-bold text-slate-800 block">רמת קושי של השאלות:</label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDifficulty('all')}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                    selectedDifficulty === 'all'
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  מעורב
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDifficulty('מתקדם')}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                    selectedDifficulty === 'מתקדם'
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  מתקדם
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDifficulty('בגרות')}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                    selectedDifficulty === 'בגרות'
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  רמת בגרות
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDifficulty('אתגר עליון')}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                    selectedDifficulty === 'אתגר עליון'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  אתגר עליון 🔥
                </button>
              </div>
            </div>

            {/* Questions count */}
            <div className="space-y-2">
              <label className="font-bold text-slate-800 block">מספר שאלות במבחן:</label>
              <div className="grid grid-cols-5 gap-2">
                {[5, 10, 15, 20, 30].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuestionCount(num)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      questionCount === num
                        ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Time limit */}
            <div className="space-y-2">
              <label className="font-bold text-slate-800 block">זמן מוקצב (דקות):</label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 15, 25, 45].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setTimeLimitMinutes(mins)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      timeLimitMinutes === mins
                        ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {mins} דק׳
                  </button>
                ))}
              </div>
            </div>

            {/* Pool availability info */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center text-xs font-bold text-slate-600">
              מאגר של <span className="text-brand-600 font-black">{currentPool.length.toLocaleString()}</span> שאלות זמין להגרלת סימולציה זו מתוך 2,593 שאלות!
            </div>

            {/* Start Button */}
            <div className="pt-2">
              <button
                onClick={startExam}
                className="w-full bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-extrabold py-4 rounded-2xl shadow-lg shadow-brand-500/25 transition-all text-base flex items-center justify-center gap-2"
              >
                <span>התחל את המבחן עכשיו 🚀</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. ACTIVE EXAM SCREEN */}
      {examStatus === 'active' && activeQuestions.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-fadeIn max-w-3xl mx-auto">
          
          {/* Header Strip with Timer & Progress */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">
                שאלה {currentIdx + 1} מתוך {activeQuestions.length}
              </span>
            </div>

            {/* Countdown timer */}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${
              secondsRemaining < 120 
                ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse'
                : 'bg-slate-100 border-slate-200 text-slate-800'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTimer(secondsRemaining)}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-brand-600 h-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / activeQuestions.length) * 100}%` }}
            />
          </div>

          {/* Active Question */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2.5 py-0.5 rounded-full">
                {activeQuestions[currentIdx].topic}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
              {activeQuestions[currentIdx].question}
            </h2>

            {/* Options */}
            <div className="space-y-2.5 pt-2">
              {activeQuestions[currentIdx].options.map((opt, optIdx) => {
                const isSelected = userAnswers[currentIdx] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full p-4 rounded-2xl border text-right text-xs sm:text-sm leading-relaxed transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50 text-brand-950 font-bold shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                      isSelected ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {optIdx + 1}
                    </span>
                    <span className="flex-1">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((p) => p - 1)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40"
            >
              ➔ לשאלה הקודמת
            </button>

            {currentIdx < activeQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentIdx((p) => p + 1)}
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all text-xs flex items-center gap-1.5"
              >
                <span>לשאלה הבאה</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={finishExam}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-md transition-all text-xs flex items-center gap-1.5"
              >
                <span>הגש מבחן וחשב ציון ✓</span>
              </button>
            )}
          </div>

        </div>
      )}

      {/* 3. FINISHED RESULTS & CERTIFICATE SCREEN */}
      {examStatus === 'finished' && examResult && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm max-w-3xl mx-auto space-y-8 animate-fadeIn">
          
          {/* Printable Certificate Box */}
          <div className="border-4 border-double border-slate-200 rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-slate-50 to-white text-center space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-xs font-bold text-slate-500">תיכון מקיף ז׳</span>
              <span className="text-xs font-bold text-slate-500">תאריך: {examResult.date}</span>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                דוח הערכה אישי • כיתת המורה שירה
              </h2>
              <p className="text-xs text-slate-500">
                נבחן/ת: <span className="font-bold text-slate-900">{studentName}</span> | תחום: {examResult.topic}
              </p>
            </div>

            {/* Score Ring */}
            <div className="py-2">
              <div className="inline-flex flex-col items-center justify-center w-28 h-28 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-xl shadow-brand-500/20">
                <span className="text-4xl font-black">{examResult.score}</span>
                <span className="text-[11px] font-bold text-brand-100">מתוך 100</span>
              </div>
            </div>

            {/* Teacher's Feedback Quote */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs sm:text-sm text-amber-950 max-w-lg mx-auto">
              <span className="font-black text-amber-900 block mb-1">הערכת המורה שירה:</span>
              <p className="italic">
                {examResult.score >= 90
                  ? "וואו! תוצאה מבריקה ויוצאת מן הכלל. את/ה שולט/ת בחומר ברמה גבוהה מאוד ומוכן/ה להפציץ במבחן בכיתה ובבגרות!"
                  : examResult.score >= 70
                  ? "עבודה יפה מאוד! יש לך בסיס חזק וטוב. עבור/י על השאלות שבהן טעית למטה כדי לסגור את הפינות עד ל-100!"
                  : "התרגול הוא הדרך הבטוחה להצלחה! אל תתייאש/י – קרא/י את ההסברים והטיפים שלמטה ונסה/י שוב."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-500 block">תשובות נכונות:</span>
                <span className="text-base font-bold text-emerald-600">
                  {examResult.correctCount} מתוך {examResult.totalQuestions}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-500 block">זמן מבחן:</span>
                <span className="text-base font-bold text-slate-800">
                  {formatTimer(examResult.timeSpentSeconds)}
                </span>
              </div>
            </div>

          </div>

          {/* Mistakes Breakdown (if any) */}
          {examResult.mistakes.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <span>שאלות לחזרה וחיזוק ({examResult.mistakes.length}):</span>
              </h3>

              <div className="space-y-4">
                {examResult.mistakes.map((m, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2 text-xs sm:text-sm">
                    <div className="font-bold text-slate-900 leading-snug">{m.question}</div>
                    
                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex-1">
                        <span className="font-bold block text-[11px] text-rose-700">תשובתך:</span>
                        <span>{m.userAnswer}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex-1">
                        <span className="font-bold block text-[11px] text-emerald-700">התשובה הנכונה:</span>
                        <span>{m.correctAnswer}</span>
                      </div>
                    </div>

                    <p className="text-slate-600 pt-1 leading-relaxed">
                      💡 {m.explanation}
                    </p>

                    {m.shiraTip && (
                      <div className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200">
                        👩‍🏫 טיפ משירה: {m.shiraTip}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>הדפס דוח להצגה לשירה</span>
            </button>

            <button
              onClick={() => {
                setExamStatus('setup');
                setExamResult(null);
              }}
              className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>מבחן חדש</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
