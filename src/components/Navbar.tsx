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
  Zap
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
  };
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & School Name */}
          <div 
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <span className="text-xl font-black">ז׳</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">המרחב של שירה</span>
                <span className="hidden sm:inline-block text-xs bg-brand-100 text-brand-800 font-bold px-2 py-0.5 rounded-full">
                  תיכון מקיף ז׳
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">אזרחות (חט״ב וחט״ע) • חינוך פיננסי</p>
            </div>
          </div>

          {/* Navigation Links */}
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
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Speed Drill Button */}
            <button
              onClick={() => {
                sound.playStreak();
                onOpenSpeedDrill();
              }}
              className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-2.5 py-1.5 rounded-xl text-xs font-black shadow-xs shadow-orange-500/20 transition-all hover:scale-105 active:scale-95 animate-pulse"
              title="ספיד-דריל: אתגר 60 שניות מהיר!"
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
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-black shadow-xs transition-all hover:scale-105 active:scale-95"
              title="בחר סטייל: גיימינג, פופ, ספורט, כדורגל, כדורסל, עתידני ועוד"
            >
              <span>{theme.icon}</span>
              <span className="hidden lg:inline">{theme.name}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className={`p-1.5 rounded-xl border transition-all hover:scale-105 active:scale-95 ${
                isSoundEnabled 
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100' 
                  : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200'
              }`}
              title={isSoundEnabled ? 'השתק צלילים' : 'הפעל צלילים ואפקטים'}
            >
              {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
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
              className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 px-2.5 py-1 rounded-full text-xs font-bold shadow-xs cursor-pointer hover:bg-amber-100 transition-colors"
              onClick={() => {
                sound.playStreak();
                onOpenProgress();
              }}
              title={`רצף למידה של ${userStats.streakDays} ימים`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
              <span>{userStats.streakDays}</span>
              <span className="hidden sm:inline">ימים</span>
            </div>

            {/* XP Points */}
            <div 
              className="flex items-center gap-1.5 bg-brand-50 border border-brand-200 text-brand-900 px-3 py-1 rounded-full text-xs font-black shadow-xs cursor-pointer hover:bg-brand-100 transition-colors"
              onClick={() => {
                sound.playFanfare();
                onOpenProgress();
              }}
              title="סך כל נקודות הניסיון שלך"
            >
              <Award className="w-3.5 h-3.5 text-brand-600" />
              <span>{userStats.xp} XP</span>
            </div>

            {/* Profile Avatar */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenProgress();
              }}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 text-sm font-bold transition-all hover:scale-105"
              title="ההתקדמות והתגים שלי"
            >
              👤
            </button>
          </div>

        </div>

        {/* Mobile Navigation Strip */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 overflow-x-auto gap-2">
          <button
            onClick={() => setCurrentTab('home')}
            className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap ${currentTab === 'home' ? 'text-brand-600' : 'text-slate-600'}`}
          >
            בית
          </button>
          <button
            onClick={() => setCurrentTab('civics')}
            className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap ${currentTab === 'civics' ? 'text-civics-dark' : 'text-slate-600'}`}
          >
            אזרחות
          </button>
          <button
            onClick={() => setCurrentTab('tsehes')}
            className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap ${currentTab === 'tsehes' ? 'text-amber-700' : 'text-slate-600'}`}
          >
            מאמן צה״ס
          </button>
          <button
            onClick={() => setCurrentTab('finance')}
            className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap ${currentTab === 'finance' ? 'text-emerald-700' : 'text-slate-600'}`}
          >
            פיננסי
          </button>
          <button
            onClick={() => setCurrentTab('bank')}
            className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap ${currentTab === 'bank' ? 'text-indigo-700 font-black' : 'text-slate-600'}`}
          >
            בנק 6,000+
          </button>
          <button
            onClick={() => setCurrentTab('exam')}
            className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap ${currentTab === 'exam' ? 'text-brand-600' : 'text-slate-600'}`}
          >
            מבחן
          </button>
        </div>

      </div>
    </header>
  );
};
