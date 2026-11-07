import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  PenTool, 
  Coins, 
  Trophy, 
  ArrowLeft, 
  CheckCircle, 
  Lightbulb,
  Flame,
  Clock,
  ExternalLink,
  Database,
  Zap,
  Palette,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { SHIRA_DAILY_TIPS, SHIRA_WELCOME_MESSAGES } from '../data/shiraTips';
import { TEEN_DILEMMAS } from '../data/teenDilemmas';
import { UserStats } from '../types';
import { useTheme } from '../utils/themeContext';
import { sound } from '../utils/soundEngine';
import { fireSmallSuccessConfetti } from '../utils/confetti';

interface HeroWelcomeProps {
  onNavigate: (tab: string) => void;
  userStats: UserStats;
  onOpenGlossary: () => void;
  onOpenThemeSelector?: () => void;
  onOpenSpeedDrill?: () => void;
  onAddXP?: (amount: number) => void;
}

export const HeroWelcome: React.FC<HeroWelcomeProps> = ({
  onNavigate,
  userStats,
  onOpenGlossary,
  onOpenThemeSelector,
  onOpenSpeedDrill,
  onAddXP
}) => {
  const { theme } = useTheme();
  const [tipIndex, setTipIndex] = useState(0);
  const currentTip = SHIRA_DAILY_TIPS[tipIndex];

  // Daily Teen Dilemma state
  const [dilemmaIndex, setDilemmaIndex] = useState(0);
  const [dilemmaChoice, setDilemmaChoice] = useState<number | null>(null);
  const [isDilemmaAnswered, setIsDilemmaAnswered] = useState(false);
  const [answeredDilemmas, setAnsweredDilemmas] = useState<Record<string, boolean>>({});

  const currentDilemma = TEEN_DILEMMAS[dilemmaIndex];

  // Level Progression Calculation
  const getLevelInfo = (xp: number) => {
    if (xp < 150) return { level: 1, title: '🥉 טירון אזרחות', nextXp: 150, currentMin: 0 };
    if (xp < 400) return { level: 2, title: '🥈 אזרח פעיל ומודע', nextXp: 400, currentMin: 150 };
    if (xp < 800) return { level: 3, title: '🥇 לוחם צה״ס מוסמך', nextXp: 800, currentMin: 400 };
    if (xp < 1500) return { level: 4, title: '💎 שופט שלום ומגן זכויות', nextXp: 1500, currentMin: 800 };
    return { level: 5, title: '👑 מאסטר הבגרות ונשיא עליון', nextXp: 2500, currentMin: 1500 };
  };
  const levelInfo = getLevelInfo(userStats.xp);
  const progressPercent = Math.min(100, Math.max(5, ((userStats.xp - levelInfo.currentMin) / (levelInfo.nextXp - levelInfo.currentMin)) * 100));

  const handleSelectDilemma = (idx: number) => {
    if (isDilemmaAnswered) return;
    setDilemmaChoice(idx);
    setIsDilemmaAnswered(true);

    if (idx === currentDilemma.correctIndex) {
      sound.playCorrect();
      fireSmallSuccessConfetti();
      if (!answeredDilemmas[currentDilemma.id]) {
        onAddXP?.(20);
        setAnsweredDilemmas(prev => ({ ...prev, [currentDilemma.id]: true }));
      }
    } else {
      sound.playWrong();
    }
  };

  const handleNextDilemma = () => {
    sound.playClick();
    setDilemmaChoice(null);
    setIsDilemmaAnswered(false);
    setDilemmaIndex((prev) => (prev + 1) % TEEN_DILEMMAS.length);
  };

  const nextTip = () => {
    sound.playClick();
    setTipIndex((prev) => (prev + 1) % SHIRA_DAILY_TIPS.length);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Teacher Shira's Hero Welcome Card */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-brand-800 to-indigo-950 text-white shadow-xl">
        {/* Decorative backdrop shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-civics/20 blur-3xl pointer-events-none" />

        <div className="relative p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row items-center gap-8 justify-between">
          
          <div className="space-y-4 max-w-2xl text-center lg:text-right">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-brand-200 border border-white/10">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>מרחב התרגול והלמידה הרשמי • תיכון מקיף ז׳</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              היי תלמידים יקרים! 👋 <br />
              <span className="bg-gradient-to-l from-amber-300 via-sky-200 to-white bg-clip-text text-transparent">
                ברוכים הבאים למרחב של שירה
              </span>
            </h1>

            <p className="text-slate-200 text-base sm:text-lg leading-relaxed font-normal">
              הקמתי את האתר הזה במיוחד עבורכם – תלמידי ותלמידות מקיף ז׳. כאן נתרגל יחד לקראת המבחנים בכיתה ובחינת הבגרות באזרחות, ונלמד חינוך פיננסי מעשי שישמור לכם על הכסף האמיתי בעבודה ובחיים.
            </p>

            {/* Quick Badges in Hero */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-sm text-slate-300">
              <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-lg">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                מאגר שאלות בגרות וראמ״ה
              </span>
              <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-lg">
                <CheckCircle className="w-4 h-4 text-amber-400" />
                בדיקה עצמית למודל צה״ס
              </span>
              <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-lg">
                <CheckCircle className="w-4 h-4 text-sky-400" />
                זכויות נוער עובד ושכר
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-4">
              <button
                onClick={() => onNavigate('exam')}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg hover:shadow-amber-400/25 transition-all flex items-center gap-2 text-sm sm:text-base group"
              >
                <span>התחל מבחן כיתתי לתרגול</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('tsehes')}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-5 py-3.5 rounded-xl backdrop-blur-sm transition-all text-sm sm:text-base flex items-center gap-2"
              >
                <PenTool className="w-4 h-4 text-amber-300" />
                <span>מאמן צה״ס לבגרות</span>
              </button>

              {onOpenSpeedDrill && (
                <button
                  onClick={onOpenSpeedDrill}
                  className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-extrabold px-4 py-3.5 rounded-xl shadow-lg transition-all text-sm sm:text-base flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>אתגר 60 שניות ⚡️</span>
                </button>
              )}

              {onOpenThemeSelector && (
                <button
                  onClick={onOpenThemeSelector}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium px-4 py-3.5 rounded-xl backdrop-blur-sm transition-all text-sm sm:text-base flex items-center gap-2"
                >
                  <Palette className="w-4 h-4 text-purple-300" />
                  <span>בחר סטייל 🎨</span>
                </button>
              )}
            </div>
          </div>

          {/* Teacher Greeting Avatar & Personal Message */}
          <div className="w-full lg:w-auto flex flex-col items-center">
            <div className="relative group">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-400 p-1.5 shadow-2xl shadow-orange-500/30">
                <div className="w-full h-full rounded-2xl bg-brand-950 flex flex-col items-center justify-center text-center p-3 border border-white/20">
                  <span className="text-4xl sm:text-5xl">{theme.shiraAvatar}</span>
                  <span className="text-xs font-bold text-amber-200 mt-1">המורה שירה</span>
                  <span className="text-[10px] text-slate-300">{theme.shiraTitle}</span>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-full border-2 border-brand-900 shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4 bg-white/10 backdrop-blur-md rounded-2xl p-3.5 max-w-xs text-xs text-slate-200 border border-white/15 text-center relative shadow-inner">
              <p className="italic font-medium">
                "{theme.shiraVibe}"
              </p>
            </div>
          </div>

        </div>

        {/* Daily Tip Bar (Interactive Carousel) */}
        <div className="border-t border-white/10 bg-black/25 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-3">
            <div className="bg-amber-400/20 text-amber-300 p-2 rounded-xl">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-amber-300 ml-2">הטיפ היומי של שירה:</span>
              <span className="text-slate-200">{currentTip.text}</span>
            </div>
          </div>
          <button
            onClick={nextTip}
            className="text-xs bg-white/10 hover:bg-white/20 text-white font-medium px-3 py-1.5 rounded-lg border border-white/15 transition-colors whitespace-nowrap self-end sm:self-auto"
          >
            טיפ הבא ↻
          </button>
        </div>

      </section>

      {/* Student Rank & Level Progress Bar */}
      <section className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 flex items-center justify-center font-black text-lg">
            {levelInfo.level}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-slate-900">{levelInfo.title}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 border border-brand-200">
                דרגה {levelInfo.level}
              </span>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              {userStats.xp} / {levelInfo.nextXp} XP לדרגה הבאה
            </div>
          </div>
        </div>

        <div className="w-full sm:w-64 space-y-1">
          <div className="flex justify-between text-[11px] font-semibold text-slate-500">
            <span>התקדמות לדרגה הבאה</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-brand-500 to-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </section>

      {/* Stats Summary Strip for the Student */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
            <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{userStats.streakDays} ימים</div>
            <div className="text-xs text-slate-500 font-medium">רצף למידה פעיל</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center text-xl">
            <Trophy className="w-6 h-6 text-brand-600" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{userStats.xp} XP</div>
            <div className="text-xs text-slate-500 font-medium">נקודות ניסיון</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{userStats.quizzesCompleted}</div>
            <div className="text-xs text-slate-500 font-medium">מבחנים שהושלמו</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl">
            <PenTool className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{userStats.tsehesCompleted}</div>
            <div className="text-xs text-slate-500 font-medium">אימוני צה״ס בגרות</div>
          </div>
        </div>

      </section>

      {/* Daily Teen Dilemma Card (Ages 14-17 Relatable Scenarios) */}
      <section className="bg-gradient-to-br from-amber-500/10 via-purple-500/5 to-sky-500/10 rounded-3xl p-6 sm:p-8 border border-amber-500/20 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-amber-500/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center text-xl shadow-md">
              <span>{currentDilemma.badgeIcon}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-400/30">
                  {currentDilemma.tag}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  דילמה {dilemmaIndex + 1} מתוך {TEEN_DILEMMAS.length}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                🔥 דילמת היום לנוער: שירה מאתגרת אתכם!
              </h2>
            </div>
          </div>

          <button
            onClick={handleNextDilemma}
            className="text-xs font-bold bg-white dark:bg-zinc-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 flex items-center gap-1.5 transition-all shadow-xs self-end sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>דילמה אחרת ↻</span>
          </button>
        </div>

        <div className="pt-4 space-y-4">
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-zinc-800">
            <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {currentDilemma.scenario}
            </p>
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-zinc-800 font-bold text-sm sm:text-base text-brand-700 dark:text-brand-300">
              ❓ {currentDilemma.question}
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentDilemma.options.map((opt, oIdx) => {
              const isSelected = dilemmaChoice === oIdx;
              const isCorrect = oIdx === currentDilemma.correctIndex;

              let btnStyle = "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-slate-200 hover:border-amber-400";
              if (isDilemmaAnswered) {
                if (isCorrect) {
                  btnStyle = "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold ring-2 ring-emerald-500/30";
                } else if (isSelected && !isCorrect) {
                  btnStyle = "bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200 line-through opacity-80";
                } else {
                  btnStyle = "opacity-50 border-slate-200 dark:border-zinc-800";
                }
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelectDilemma(oIdx)}
                  disabled={isDilemmaAnswered}
                  className={`p-3.5 rounded-xl border text-right text-xs sm:text-sm font-medium transition-all flex items-start gap-2.5 ${btnStyle}`}
                >
                  <span className="font-bold text-xs mt-0.5 opacity-60">
                    {String.fromCharCode(1488 + oIdx)}.
                  </span>
                  <span className="flex-1 leading-snug">{opt}</span>
                  {isDilemmaAnswered && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  {isDilemmaAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Shira's Explanation Banner */}
          {isDilemmaAnswered && (
            <div className="rounded-2xl p-4 bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/30 animate-in fade-in slide-in-from-top-2 duration-300 space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {dilemmaChoice === currentDilemma.correctIndex ? 'בול! תשובה מדויקת! (+20 XP)' : 'הסבר המורה שירה:'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentDilemma.explanation}
              </p>
              <div className="bg-white/80 dark:bg-zinc-900/80 rounded-xl p-3 text-xs text-amber-800 dark:text-amber-200 border border-amber-500/20 font-medium">
                💡 {currentDilemma.shiraTip}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Learning Hubs Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">לאן נרצה לצלול היום? 🚀</h2>
            <p className="text-sm text-slate-500">בחרו את הנושא הרצוי לתרגול ממוקד והכנה לבחינה</p>
          </div>
          <button
            onClick={onOpenGlossary}
            className="text-sm font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1 transition-colors"
          >
            <span>פתח מילון מושגים מלא</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {/* Card 1: Civics Hub */}
          <div 
            onClick={() => onNavigate('civics')}
            className="group bg-white rounded-3xl p-6 border border-slate-200 hover:border-civics/50 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-civics-light text-civics flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                  חט״ב + חט״ע
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 group-hover:text-civics transition-colors">
                מרחב אזרחות
              </h3>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                יסודות הדמוקרטיה, שלטון החוק, זכויות האדם והאזרח, עקרונות המשטר בישראל, ומאפייני המדינה היהודית והדמוקרטית.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-civics">
              <span>היכנס לתרגול שאלות</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Tsehes Trainer (Bagrut Spotlight) */}
          <div 
            onClick={() => onNavigate('tsehes')}
            className="group bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-3xl p-6 border-2 border-amber-300 hover:border-amber-400 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-3 left-3 bg-amber-400 text-amber-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
              דגש בגרות 34281
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PenTool className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-xl font-black text-slate-900 group-hover:text-amber-800 transition-colors">
                מאמן צה״ס לבגרות
              </h3>
              <p className="text-slate-700 text-sm mt-2 leading-relaxed">
                אימון מודרך שלב-אחר-שלב לשאלות אירוע: <strong>ציין ➔ הצג ➔ הסבר</strong>. בדיקה אוטומטית מלאה ופתרון לפי מחוון משרד החינוך!
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-amber-200 flex items-center justify-between text-sm font-bold text-amber-900">
              <span>התחל אימון שאלת אירוע</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Financial Education */}
          <div 
            onClick={() => onNavigate('finance')}
            className="group bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-500/50 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Coins className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800">
                  מעשי לחיים
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                חינוך פיננסי וזכויות נוער
              </h3>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                שכר מינימום לנוער, קריאת תלוש שכר, הגנה מפני קנסות בעבודה, בנקאות נבונה, כוחה של ריבית דריבית וזיהוי הונאות רשת.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-emerald-700">
              <span>למדריך ולכלים הפיננסיים</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: 6,400+ Question Bank */}
          <div 
            onClick={() => onNavigate('bank')}
            className="group bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 border border-indigo-700/50 hover:border-indigo-400 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/30 text-indigo-300 flex items-center justify-center group-hover:scale-110 transition-transform border border-indigo-500/30">
                  <Database className="w-6 h-6" />
                </div>
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-amber-400 text-amber-950">
                  6,430+ שאלות
                </span>
              </div>
              <h3 className="text-xl font-black text-white group-hover:text-indigo-300 transition-colors">
                בנק השאלות המלא
              </h3>
              <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                לפחות 1,000 שאלות לכל כיתה (ז׳ עד י״ב!) מבוססות חומר רשמי ברמת אתגר עילאית, חיפוש מהיר ומחווני בדיקה.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-slate-700/80 flex items-center justify-between text-sm font-bold text-indigo-300">
              <span>חיפוש ותרגול במאגר ➔</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </section>

      {/* Classroom Exam Banner */}
      <section className="bg-gradient-to-r from-brand-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-right">
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold text-amber-200">
            <Clock className="w-3.5 h-3.5" />
            <span>סימולציה תחת זמן</span>
          </div>
          <h3 className="text-2xl font-black">רוצים לבדוק איפה אתם עומדים?</h3>
          <p className="text-brand-100 text-sm max-w-xl">
            קחו מבחן כיתתי מלא של 5, 10 או 15 שאלות עם שעון עצר, קבלו דוח ניתוח מפורט בסיום ותעודת הערכה להצגה לשירה בכיתה!
          </p>
        </div>
        <button
          onClick={() => onNavigate('exam')}
          className="bg-white hover:bg-brand-50 text-brand-900 font-extrabold px-6 py-3.5 rounded-xl shadow-md transition-all text-sm whitespace-nowrap flex items-center gap-2 group"
        >
          <span>התחל מבחן כיתתי עכשיו</span>
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        </button>
      </section>

    </div>
  );
};
