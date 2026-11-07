import React, { useState } from 'react';
import { BookOpen, CheckCircle2, XCircle, Lightbulb, ArrowLeft, PenTool, Sparkles, Award, Shuffle } from 'lucide-react';
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
  const [selectedGrade, setSelectedGrade] = useState<'all' | 'junior' | 'senior'>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // Combine curated and full bank
  const allCivicsPool = [
    ...ALL_QUESTIONS.filter(q => q.subject === 'civics'),
    ...FULL_CIVICS_BANK
  ];

  // Filter civics questions
  const civicsQuestions = allCivicsPool.filter((q) => {
    if (selectedGrade !== 'all' && q.gradeLevel !== selectedGrade) return false;
    if (selectedTopic !== 'all' && q.topic !== selectedTopic) return false;
    if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const currentQ: Question | undefined = civicsQuestions[activeQuestionIndex];

  // Topics list for filter
  const topics = Array.from(new Set(allCivicsPool.map(q => q.topic)));

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedAnswer(idx);
    setIsAnswered(true);
    setShowExplanation(true);

    if (currentQ && idx === currentQ.correctIndex) {
      fireSmallSuccessConfetti();
      sound.playCorrect();
      onAddXP(15);
    } else {
      sound.playWrong();
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowExplanation(false);
    setActiveQuestionIndex((prev) => (prev + 1) % civicsQuestions.length);
  };

  const randomQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowExplanation(false);
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

      {/* Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        
        {/* Grade tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 ml-2">שכבת גיל:</span>
          <button
            onClick={() => { setSelectedGrade('all'); setActiveQuestionIndex(0); setIsAnswered(false); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedGrade === 'all'
                ? 'bg-civics text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            כל השכבות
          </button>
          <button
            onClick={() => { setSelectedGrade('junior'); setActiveQuestionIndex(0); setIsAnswered(false); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedGrade === 'junior'
                ? 'bg-civics text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            חטיבת ביניים (כיתות ז׳-ט׳)
          </button>
          <button
            onClick={() => { setSelectedGrade('senior'); setActiveQuestionIndex(0); setIsAnswered(false); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedGrade === 'senior'
                ? 'bg-civics text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            חטיבה עליונה (הכנה לבגרות)
          </button>
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
            </div>

            <div className="text-xs text-slate-500 font-bold bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
              שאלה {activeQuestionIndex + 1} מתוך {civicsQuestions.length}
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
              {currentQ.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let btnStyle = "border-slate-200 hover:border-civics hover:bg-slate-50 text-slate-800";
              
              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold shadow-sm";
                } else if (isSelected) {
                  btnStyle = "border-rose-500 bg-rose-50 text-rose-950";
                } else {
                  btnStyle = "border-slate-200 text-slate-400 opacity-60";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-2xl border text-right transition-all flex items-start gap-3 text-sm sm:text-base ${btnStyle}`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    isAnswered && isCorrect 
                      ? 'bg-emerald-500 text-white' 
                      : isAnswered && isSelected 
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-100 text-slate-700'
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
