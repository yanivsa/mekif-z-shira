import React from 'react';
import { 
  Award, 
  Flame, 
  BookOpen, 
  Calculator, 
  PenTool, 
  CheckCircle2, 
  Database,
  Palette,
  Volume2,
  VolumeX,
  Zap,
  Home
} from 'lucide-react';
import { UserStats } from '../types';
import { useTheme } from '../utils/themeContext';
import { sound } from '../utils/soundEngine';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  userStats: UserStats;
  onOpenProgress: () => void;
  onOpenGlossary: () => void;
  onOpenThemeSelector: () => void;
  onOpenSpeedDrill: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  userStats,
  onOpenProgress,
  onOpenGlossary,
  onOpenThemeSelector,
  onOpenSpeedDrill,
}) => {
  const { theme, isSoundEnabled, toggleSound } = useTheme();

  const handleTabClick = (tab: string) => {
    sound.playClick();
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
            
            {/* Logo & School Name */}
            <div 
              onClick={() => handleTabClick('home')}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group min-w-0 shrink"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform shrink-0">
                <span className="text-base sm:text-xl font-black">ז׳</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-extrabold text-sm sm:text-lg text-slate-900 dark:text-zinc-100 tracking-tight whitespace-nowrap">
                    המרחב של שירה
                  </span>
                  <span className="hidden sm:inline-block text-[11px] bg-brand-100 dark:bg-brand-900/50 text-brand-800 dark:text-brand-300 font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                    תיכון מקיף ז׳
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 hidden lg:block truncate">
                  אזרחות (חט״ב וחט״ע) • חינוך פיננסי
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => handleTabClick('home')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  currentTab === 'home'
                    ? 'bg-brand-50 text-brand-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                דף הבית
              </button>
              <button
                onClick={() => handleTabClick('civics')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  currentTab === 'civics'
                    ? 'bg-civics-light text-civics-dark shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-4 h-4 text-civics" />
                מרחב אזרחות
              </button>
              <button
                onClick={() => handleTabClick('tsehes')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  currentTab === 'tsehes'
                    ? 'bg-amber-100 text-amber-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <PenTool className="w-4 h-4 text-amber-600" />
                מאמן צה״ס לבגרות
              </button>
              <button
                onClick={() => handleTabClick('finance')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  currentTab === 'finance'
                    ? 'bg-emerald-100 text-emerald-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Calculator className="w-4 h-4 text-emerald-600" />
                חינוך פיננסי
              </button>
              <button
                onClick={() => handleTabClick('bank')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  currentTab === 'bank'
                    ? 'bg-indigo-100 text-indigo-900 shadow-sm font-black'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Database className="w-4 h-4 text-indigo-600" />
                בנק 6,000+ שאלות
              </button>
              <button
                onClick={() => handleTabClick('exam')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  currentTab === 'exam'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                מבחן כיתתי
              </button>
            </nav>

            {/* Gamification, Themes & Audio Control Bar */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              
              {/* Speed Drill Button */}
              <button
                onClick={() => {
                  sound.playStreak();
                  onOpenSpeedDrill();
                }}
                className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-black shadow-xs shadow-orange-500/20 transition-all hover:scale-105 active:scale-95 animate-pulse"
                title="ספיד-דריל: אתגר 60 שניות מהיר!"
                aria-label="אתגר 60 שניות"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">60 שנ׳</span>
              </button>

              {/* Theme Selector Pill */}
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenThemeSelector();
                }}
                className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 text-xs font-black shadow-xs transition-all hover:scale-105 active:scale-95"
                title="בחר סטייל"
                aria-label="בחר סטייל"
              >
                <span className="text-sm">{theme.icon}</span>
                <span className="hidden lg:inline">{theme.name}</span>
              </button>

              {/* Sound Toggle */}
              <button
                onClick={toggleSound}
                className={`p-1.5 rounded-xl border transition-all hover:scale-105 active:scale-95 ${
                  isSoundEnabled 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:border-indigo-800 dark:text-indigo-300' 
                    : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200 dark:bg-zinc-800 dark:border-zinc-700'
                }`}
                title={isSoundEnabled ? 'השתק צלילים' : 'הפעל צלילים'}
                aria-label={isSoundEnabled ? 'השתק צלילים' : 'הפעל צלילים'}
              >
                {isSoundEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </button>

              {/* Quick Glossary Pill */}
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenGlossary();
                }}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg font-medium transition-colors hidden sm:flex items-center gap-1"
                title="פתח מילון מושגים"
              >
                📖 מילון
              </button>

              {/* Streak */}
              <div 
                className="hidden sm:flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 px-2.5 py-1 rounded-full text-xs font-bold shadow-xs cursor-pointer hover:bg-amber-100 transition-colors"
                onClick={() => {
                  sound.playStreak();
                  onOpenProgress();
                }}
                title={`רצף למידה של ${userStats.streakDays} ימים`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
                <span>{userStats.streakDays}</span>
                <span className="hidden md:inline">ימים</span>
              </div>

              {/* XP Points */}
              <div 
                className="flex items-center gap-1 bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 text-brand-900 dark:text-brand-200 px-2 sm:px-2.5 py-1 rounded-full text-xs font-black shadow-xs cursor-pointer hover:bg-brand-100 transition-colors"
                onClick={() => {
                  sound.playFanfare();
                  onOpenProgress();
                }}
                title="סך כל נקודות הניסיון שלך"
              >
                <Award className="w-3.5 h-3.5 text-brand-600" />
                <span className="text-[11px] sm:text-xs">{userStats.xp} XP</span>
              </div>

              {/* Profile Avatar */}
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenProgress();
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 border border-slate-300 dark:border-zinc-700 flex items-center justify-center text-slate-700 dark:text-zinc-200 text-xs sm:text-sm font-bold transition-all hover:scale-105"
                title="ההתקדמות והתגים שלי"
                aria-label="הפרופיל שלי"
              >
                👤
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Floating Bottom Navigation Bar for Mobile */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-zinc-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-1 pt-1.5 safe-bottom"
        aria-label="ניווט ראשי למובייל"
      >
        <div className="grid grid-cols-6 gap-0.5 max-w-md mx-auto text-center">
          <button
            onClick={() => handleTabClick('home')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
              currentTab === 'home'
                ? 'text-brand-600 font-extrabold scale-105'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <Home className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] leading-tight">בית</span>
          </button>
          <button
            onClick={() => handleTabClick('civics')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
              currentTab === 'civics'
                ? 'text-civics-dark font-extrabold scale-105'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <BookOpen className="w-4 h-4 mb-0.5 text-civics" />
            <span className="text-[10px] leading-tight">אזרחות</span>
          </button>
          <button
            onClick={() => handleTabClick('tsehes')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
              currentTab === 'tsehes'
                ? 'text-amber-700 font-extrabold scale-105'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <PenTool className="w-4 h-4 mb-0.5 text-amber-600" />
            <span className="text-[10px] leading-tight">צה״ס</span>
          </button>
          <button
            onClick={() => handleTabClick('finance')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
              currentTab === 'finance'
                ? 'text-emerald-700 font-extrabold scale-105'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <Calculator className="w-4 h-4 mb-0.5 text-emerald-600" />
            <span className="text-[10px] leading-tight">פיננסי</span>
          </button>
          <button
            onClick={() => handleTabClick('bank')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
              currentTab === 'bank'
                ? 'text-indigo-700 font-black scale-105'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <Database className="w-4 h-4 mb-0.5 text-indigo-600" />
            <span className="text-[10px] leading-tight">6K+</span>
          </button>
          <button
            onClick={() => handleTabClick('exam')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
              currentTab === 'exam'
                ? 'text-brand-600 font-extrabold scale-105'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] leading-tight">מבחן</span>
          </button>
        </div>
      </nav>
    </>
  );
};
