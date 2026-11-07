// src/components/SpeedDrillModal.tsx
import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  X, 
  Clock, 
  Trophy, 
  Flame, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Sparkles,
  Share2
} from 'lucide-react';
import { MASTER_QUESTION_BANK } from '../data/questionBank';
import { Question } from '../types';
import { sound } from '../utils/soundEngine';
import { fireSchoolPrideConfetti, fireSmallSuccessConfetti } from '../utils/confetti';
import { useTheme } from '../utils/themeContext';

interface SpeedDrillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddXP: (amount: number) => void;
}

export const SpeedDrillModal: React.FC<SpeedDrillModalProps> = ({ isOpen, onClose, onAddXP }) => {
  const { theme } = useTheme();
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover'>('intro');
  const [secondsLeft, setSecondsLeft] = useState<number>(60);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(1);
  const [maxCombo, setMaxCombo] = useState<number>(1);
  const [totalAnswered, setTotalAnswered] = useState<number>(0);
  const [selectedSubject, setSelectedSubject] = useState<'all' | 'civics' | 'finance'>('all');

  // Timer loop
  useEffect(() => {
    let interval: any;
    if (gameState === 'playing' && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, secondsLeft]);

  if (!isOpen) return null;

  const startGame = () => {
    sound.playStreak();
    // Filter by subject
    let pool = MASTER_QUESTION_BANK;
    if (selectedSubject !== 'all') {
      pool = MASTER_QUESTION_BANK.filter(q => q.subject === selectedSubject);
    }
    // Shuffle pool
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 50);
    setActiveQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setCombo(1);
    setMaxCombo(1);
    setTotalAnswered(0);
    setSecondsLeft(60);
    setGameState('playing');
  };

  const handleAnswer = (optionIdx: number) => {
    const q = activeQuestions[currentIndex];
    if (!q) return;

    setTotalAnswered(prev => prev + 1);

    if (optionIdx === q.correctIndex) {
      sound.playCorrect(combo);
      fireSmallSuccessConfetti();
      const points = 10 * combo;
      setScore(prev => prev + points);
      onAddXP(points);

      const nextCombo = combo + 1;
      setCombo(nextCombo);
      if (nextCombo > maxCombo) {
        setMaxCombo(nextCombo);
      }
    } else {
      sound.playWrong();
      setCombo(1); // Reset combo
    }

    // Advance to next question immediately
    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setGameState('gameover');
    sound.playFanfare();
    fireSchoolPrideConfetti();
  };

  const currentQ = activeQuestions[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-900 relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. INTRO SCREEN */}
        {gameState === 'intro' && (
          <div className="text-center space-y-6 py-4">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 text-white flex items-center justify-center text-4xl mx-auto shadow-xl shadow-orange-500/30 animate-bounce">
              ⚡️
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                ספיד-דריל: אתגר 60 שניות!
              </h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                כמה שאלות אתגר תצליחו לפצח בדקה אחת? רצף תשובות נכונות מכפיל את ה-XP בטירוף (עד פי 5 קומבו)!
              </p>
            </div>

            {/* Subject Selector */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setSelectedSubject('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedSubject === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                משולב (הכל)
              </button>
              <button
                onClick={() => setSelectedSubject('civics')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedSubject === 'civics'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                אזרחות בלבד
              </button>
              <button
                onClick={() => setSelectedSubject('finance')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedSubject === 'finance'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                חינוך פיננסי
              </button>
            </div>

            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-black text-lg py-4 rounded-2xl shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5 fill-white" />
              <span>צא לדרך! התחל 60 שניות ⏱️</span>
            </button>
          </div>
        )}

        {/* 2. PLAYING SCREEN */}
        {gameState === 'playing' && currentQ && (
          <div className="space-y-5 animate-fadeIn">
            
            {/* Top Game Bar: Timer & Combo */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${
                  secondsLeft <= 10 
                    ? 'bg-rose-500 text-white animate-pulse' 
                    : 'bg-slate-100 text-slate-800'
                }`}>
                  <Clock className="w-3.5 h-3.5" />
                  <span>{secondsLeft} שניות</span>
                </div>

                <div className="text-xs font-bold text-slate-500">
                  ניקוד: <span className="font-black text-brand-600">{score}</span>
                </div>
              </div>

              {/* Combo Multiplier */}
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black transition-all ${
                combo >= 3 
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md shadow-orange-500/30 scale-105' 
                  : 'bg-amber-100 text-amber-900'
              }`}>
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>קומבו X{combo}!</span>
              </div>
            </div>

            {/* Question Card */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <span>{currentQ.gradeText}</span>
                <span>•</span>
                <span>{currentQ.topic}</span>
              </div>

              {currentQ.scenario && (
                <div className="bg-slate-50 border-r-3 border-amber-500 p-3 rounded-xl text-xs text-slate-700 leading-relaxed max-h-24 overflow-y-auto">
                  {currentQ.scenario}
                </div>
              )}

              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-snug">
                {currentQ.question}
              </h3>

              {/* 4 Instant Answer Buttons */}
              <div className="grid grid-cols-1 gap-2 pt-2">
                {currentQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className="w-full text-right p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-400 text-xs sm:text-sm font-semibold transition-all active:scale-[0.99] flex items-center gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-white border border-slate-300 flex items-center justify-center text-xs font-bold shrink-0">
                      {['א', 'ב', 'ג', 'ד'][idx]}
                    </span>
                    <span className="flex-1">{opt}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 3. GAME OVER SCREEN */}
        {gameState === 'gameover' && (
          <div className="text-center space-y-6 py-4 animate-fadeIn">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-white flex items-center justify-center text-4xl mx-auto shadow-xl shadow-amber-500/30">
              🏆
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                זמן עבר! איזה ביצוע מטורף!
              </h2>
              <p className="text-sm text-slate-500">
                הוכחתם חשיבה מהירה ושליטה בחומר של מקיף ז׳!
              </p>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200">
                <span className="text-[11px] text-slate-400 block font-medium">שאלות שנענו</span>
                <span className="text-xl sm:text-2xl font-black text-slate-800">{totalAnswered}</span>
              </div>
              <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200">
                <span className="text-[11px] text-amber-800 block font-medium">שיא קומבו</span>
                <span className="text-xl sm:text-2xl font-black text-amber-700">X{maxCombo} 🔥</span>
              </div>
              <div className="bg-indigo-50 rounded-2xl p-3 border border-indigo-200">
                <span className="text-[11px] text-indigo-800 block font-medium">XP שצברת</span>
                <span className="text-xl sm:text-2xl font-black text-indigo-700">+{score}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={startGame}
                className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-6 py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>שחק שוב עכשיו ↻</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(`שברתי שיא של ${score} נקודות באתגר 60 שניות במרחב של שירה בתיכון מקיף ז׳! נסו לנצח אותי: https://mekif-z-shira.pages.dev 🔥`);
                    alert('התוצאה הועתקה ללוח! שתפו עם החברים בכיתה 🚀');
                  }
                }}
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold px-5 py-3.5 rounded-xl border border-slate-300 transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span>שתף תוצאה עם הכיתה 📲</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
