import React, { useState, useMemo } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  Award, 
  Lightbulb, 
  CheckCircle2, 
  XCircle, 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  BookOpen, 
  Coins, 
  Flame, 
  ExternalLink 
} from 'lucide-react';
import { MASTER_QUESTION_BANK } from '../data/questionBank';
import { Question, SubjectType } from '../types';
import { fireSmallSuccessConfetti } from '../utils/confetti';
import { sound } from '../utils/soundEngine';

interface QuestionBankExplorerProps {
  onAddXP: (amount: number) => void;
  onNavigateToSimulator: () => void;
}

export const QuestionBankExplorer: React.FC<QuestionBankExplorerProps> = ({
  onAddXP,
  onNavigateToSimulator
}) => {
  const [selectedSubject, setSelectedSubject] = useState<'all' | 'civics' | 'finance'>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Selected answers state: questionId -> optionIndex
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [wrongAttemptsByQ, setWrongAttemptsByQ] = useState<Record<string, number[]>>({});
  const [hintsByQ, setHintsByQ] = useState<Record<string, boolean>>({});

  // Dynamic Bank Stats
  const stats = useMemo(() => {
    const total = MASTER_QUESTION_BANK.length;
    const civics = MASTER_QUESTION_BANK.filter(q => q.subject === 'civics').length;
    const finance = MASTER_QUESTION_BANK.filter(q => q.subject === 'finance').length;
    const byGrade = {
      z: MASTER_QUESTION_BANK.filter(q => q.gradeText.includes('ז׳')).length,
      ch: MASTER_QUESTION_BANK.filter(q => q.gradeText.includes('ח׳')).length,
      t: MASTER_QUESTION_BANK.filter(q => q.gradeText.includes('ט׳')).length,
      y: MASTER_QUESTION_BANK.filter(q => q.gradeText.includes('כיתה י׳')).length,
      ya: MASTER_QUESTION_BANK.filter(q => q.gradeText.includes('י״א')).length,
      yb: MASTER_QUESTION_BANK.filter(q => q.gradeText.includes('י״ב')).length,
    };
    return { total, civics, finance, byGrade };
  }, []);

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return MASTER_QUESTION_BANK.filter((q) => {
      if (selectedSubject !== 'all' && q.subject !== selectedSubject) return false;
      if (selectedGrade !== 'all') {
        if (selectedGrade === 'junior' && q.gradeLevel !== 'junior') return false;
        if (selectedGrade === 'senior' && q.gradeLevel !== 'senior') return false;
        if (!['junior', 'senior'].includes(selectedGrade) && !q.gradeText.includes(selectedGrade)) return false;
      }
      if (selectedTopic !== 'all' && q.topic !== selectedTopic) return false;
      if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const textMatch = 
          q.question.toLowerCase().includes(query) ||
          (q.scenario && q.scenario.toLowerCase().includes(query)) ||
          q.topic.toLowerCase().includes(query) ||
          (q.shiraTip && q.shiraTip.toLowerCase().includes(query)) ||
          q.explanation.toLowerCase().includes(query);
        if (!textMatch) return false;
      }
      return true;
    });
  }, [selectedSubject, selectedGrade, selectedTopic, selectedDifficulty, searchQuery]);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedSubject, selectedGrade, selectedTopic, selectedDifficulty, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage) || 1;
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Available topics for filter dropdown
  const availableTopics = useMemo(() => {
    const list = MASTER_QUESTION_BANK
      .filter(q => selectedSubject === 'all' || q.subject === selectedSubject)
      .map(q => q.topic);
    return Array.from(new Set(list));
  }, [selectedSubject]);

  const handleSelectOption = (questionId: string, optionIdx: number, correctIdx: number) => {
    if (userAnswers[questionId] !== undefined) return;
    const currentWrongs = wrongAttemptsByQ[questionId] || [];
    if (currentWrongs.includes(optionIdx)) return;

    if (optionIdx === correctIdx) {
      setUserAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
      setRevealedAnswers(prev => ({ ...prev, [questionId]: true }));
      setHintsByQ(prev => ({ ...prev, [questionId]: false }));
      fireSmallSuccessConfetti();
      sound.playCorrect();
      if (currentWrongs.length > 0) {
        onAddXP(8);
      } else {
        onAddXP(15);
      }
    } else {
      if (currentWrongs.length === 0) {
        // First mistake: give hint from Shira and let student try again!
        setWrongAttemptsByQ(prev => ({ ...prev, [questionId]: [optionIdx] }));
        setHintsByQ(prev => ({ ...prev, [questionId]: true }));
        sound.playWrong();
      } else {
        // Second mistake: lock and reveal answer
        setWrongAttemptsByQ(prev => ({ ...prev, [questionId]: [...currentWrongs, optionIdx] }));
        setUserAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
        setRevealedAnswers(prev => ({ ...prev, [questionId]: true }));
        setHintsByQ(prev => ({ ...prev, [questionId]: false }));
        sound.playWrong();
      }
    }
  };

  const toggleReveal = (questionId: string) => {
    setRevealedAnswers(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const jumpToRandom = () => {
    if (totalPages > 1) {
      const randPage = Math.floor(Math.random() * totalPages) + 1;
      setCurrentPage(randPage);
      window.scrollTo({ top: 350, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/50">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-3.5 py-1 rounded-full text-xs font-bold border border-indigo-500/30">
              <Database className="w-3.5 h-3.5" />
              <span>המאגר המקיף בישראל: לפחות 1,000 שאלות לכל כיתה!</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              בנק השאלות המלא: {stats.total.toLocaleString()} שאלות אתגר (1,000+ לכל כיתה)
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              לכל כיתה (ז׳, ח׳, ט׳, י׳, י״א, י״ב) הוכנו מעל 1,000 שאלות ייעודיות המבוססות בדיוק על חומרי הלימוד של אותה כיתה, ברמת קושי גבוהה ומעמיקה במיוחד להבטחת שליטה מלאה בבגרות ובמבחני הכיתה.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <button
              onClick={jumpToRandom}
              className="bg-indigo-600/40 hover:bg-indigo-600/60 text-white border border-indigo-400/30 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Shuffle className="w-4 h-4 text-indigo-300" />
              <span>עמוד אקראי 🎲</span>
            </button>
            <button
              onClick={onNavigateToSimulator}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-5 py-3 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-500/20"
            >
              <Flame className="w-4 h-4" />
              <span>צור סימולציית מבחן 🚀</span>
            </button>
          </div>
        </div>

        {/* Live Counters Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80 mt-6 text-center">
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
            <p className="text-xs text-slate-400 font-medium">סה״כ שאלות במאגר</p>
            <p className="text-xl sm:text-2xl font-black text-amber-400">{stats.total.toLocaleString()}</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
            <p className="text-xs text-slate-400 font-medium">שאלות לכל כיתה</p>
            <p className="text-xl sm:text-2xl font-black text-sky-400">1,080+ לכל שכבה</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
            <p className="text-xs text-slate-400 font-medium">שאלות אזרחות וחט״ע</p>
            <p className="text-xl sm:text-2xl font-black text-purple-400">{stats.civics.toLocaleString()}</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
            <p className="text-xs text-slate-400 font-medium">שאלות חינוך פיננסי</p>
            <p className="text-xl sm:text-2xl font-black text-emerald-400">{stats.finance.toLocaleString()}</p>
          </div>
        </div>

        {/* Per-Grade Breakdown Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4 border-t border-slate-800/50 mt-4 text-xs font-bold text-slate-300">
          <span className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700">כיתה ז׳: {stats.byGrade.z.toLocaleString()} שאלות</span>
          <span className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700">כיתה ח׳: {stats.byGrade.ch.toLocaleString()} שאלות</span>
          <span className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700">כיתה ט׳: {stats.byGrade.t.toLocaleString()} שאלות</span>
          <span className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700">כיתה י׳: {stats.byGrade.y.toLocaleString()} שאלות</span>
          <span className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700">כיתה י״א: {stats.byGrade.ya.toLocaleString()} שאלות</span>
          <span className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700">כיתה י״ב: {stats.byGrade.yb.toLocaleString()} שאלות</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        
        {/* Search input */}
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            id="question-bank-search"
            name="questionBankSearch"
            aria-label="חיפוש חופשי בבנק השאלות"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="חיפוש חופשי בשאלות, תרחישים, מושגים (למשל: פקודה בלתי חוקית, העדפה מתקנת, שעות נוספות, פישינג)..."
            className="w-full pl-4 pr-12 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium transition-all"
          />
        </div>

        {/* Filter selects row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          
          {/* Subject Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">מקצוע לימוד:</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value as any)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">כל המקצועות (אזרחות + פיננסי)</option>
              <option value="civics">אזרחות בלבד</option>
              <option value="finance">חינוך פיננסי בלבד</option>
            </select>
          </div>

          {/* Grade Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">שכבת גיל / כיתה:</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">כל השכבות (ז׳ עד י״ב)</option>
              <option value="junior">חטיבת ביניים (ז׳–ט׳)</option>
              <option value="senior">חטיבה עליונה ובגרות (י׳–י״ב)</option>
              <option value="כיתה ז׳">כיתה ז׳</option>
              <option value="כיתה ח׳">כיתה ח׳</option>
              <option value="כיתה ט׳">כיתה ט׳</option>
              <option value="כיתה י׳">כיתה י׳</option>
              <option value="כיתה י״א">כיתה י״א</option>
              <option value="כיתה י״ב">כיתה י״ב</option>
            </select>
          </div>

          {/* Topic Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">נושא ממוקד:</label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">כל הנושאים</option>
              {availableTopics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">רמת קושי:</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">כל רמות הקושי</option>
              <option value="בסיסי">בסיסי</option>
              <option value="בינוני">בינוני</option>
              <option value="מתקדם">מתקדם</option>
              <option value="בגרות">בגרות (שאלון 034281)</option>
              <option value="אתגר עליון">אתגר עליון (מעבר לבגרות)</option>
            </select>
          </div>
        </div>

        {/* Results summary bar */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 pt-2 border-t border-slate-100">
          <span>נמצאו {filteredQuestions.length.toLocaleString()} שאלות תואמות לסינון</span>
          <span>עמוד {currentPage} מתוך {totalPages}</span>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {paginatedQuestions.map((q, idx) => {
          const globalIdx = (currentPage - 1) * itemsPerPage + idx + 1;
          const userChoice = userAnswers[q.id];
          const isRevealed = revealedAnswers[q.id];
          const isCorrect = userChoice === q.correctIndex;

          return (
            <div 
              key={q.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 transition-all hover:border-slate-300"
            >
              {/* Question Header Tags */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-black bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                    #{globalIdx}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    q.subject === 'civics'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {q.subject === 'civics' ? 'אזרחות' : 'חינוך פיננסי'}
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">
                    {q.gradeText}
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">
                    {q.topic}
                  </span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    q.difficulty === 'אתגר עליון'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : q.difficulty === 'בגרות'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {q.difficulty}
                  </span>
                </div>

                {q.source && (
                  <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">
                    {q.source}
                  </span>
                )}
              </div>

              {/* Scenario */}
              {q.scenario && (
                <div className="bg-slate-50 border-r-4 border-indigo-500 p-4 rounded-xl text-slate-800 text-sm leading-relaxed font-normal">
                  <p className="font-bold text-xs text-indigo-700 mb-1">קטע האירוע לניתוח:</p>
                  <p>{q.scenario}</p>
                </div>
              )}

              {/* Question Text */}
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-zinc-100 leading-snug">
                {q.question}
              </h3>

              {/* Shira's Hint on First Mistake */}
              {hintsByQ[q.id] && userChoice === undefined && (
                <div className="bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700/60 rounded-2xl p-3.5 text-amber-950 dark:text-amber-200 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300 shadow-md">
                  <div className="flex items-center gap-2 font-black text-xs text-amber-800 dark:text-amber-300">
                    <span className="text-sm">💡</span>
                    <span>לא נורא! רמז משירה – קיראו ונסו שוב:</span>
                  </div>
                  <p className="text-xs font-medium leading-relaxed bg-white/80 dark:bg-zinc-900/80 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800/40">
                    {q.shiraTip || 'היזכרו במושג המרכזי וקיראו שוב את הניסוח בשאלה.'}
                  </p>
                  <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400">
                    🎯 התשובה שבחרתם אינה נכונה. ביחרו תשובה אחרת מבין האפשרויות הנותרות!
                  </div>
                </div>
              )}

              {/* Interactive Options */}
              <div className="grid grid-cols-1 gap-2 pt-1">
                {q.options.map((option, optIdx) => {
                  const isWrongAttempt = (wrongAttemptsByQ[q.id] || []).includes(optIdx);
                  let optStyle = "bg-slate-50 dark:bg-zinc-800/60 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800";
                  
                  if (isWrongAttempt && userChoice === undefined) {
                    optStyle = "bg-rose-50/70 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 line-through opacity-60 cursor-not-allowed";
                  } else if (userChoice !== undefined) {
                    if (optIdx === q.correctIndex) {
                      optStyle = "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-bold";
                    } else if (userChoice === optIdx) {
                      optStyle = "bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-100 line-through";
                    } else {
                      optStyle = "bg-slate-50 dark:bg-zinc-800/40 border-slate-200 dark:border-zinc-800 text-slate-400 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={userChoice !== undefined || isWrongAttempt}
                      onClick={() => handleSelectOption(q.id, optIdx, q.correctIndex)}
                      className={`w-full text-right p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${optStyle}`}
                    >
                      <span className="w-5 h-5 rounded-full border border-slate-300 dark:border-zinc-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {['א', 'ב', 'ג', 'ד'][optIdx]}
                      </span>
                      <span className="flex-1">{option}</span>
                      {userChoice !== undefined && optIdx === q.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      {userChoice === optIdx && optIdx !== q.correctIndex && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Toggle Reveal or Explanation */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => toggleReveal(q.id)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{isRevealed ? 'הסתר מחוון והסבר' : 'חשוף תשובה ומחוון מלא'}</span>
                </button>

                {userChoice !== undefined && (
                  <span className={`text-xs font-extrabold ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isCorrect ? 'תשובה נכונה! (+15 XP)' : 'תשובה שגויה – עיינו בהסבר'}
                  </span>
                )}
              </div>

              {/* Detailed Explanation & Shira's Tip */}
              {isRevealed && (
                <div className="space-y-3 pt-2 text-xs sm:text-sm animate-fadeIn">
                  <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3.5 text-indigo-950 space-y-1">
                    <p className="font-bold text-indigo-900 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>התשובה הנכונה: {['א', 'ב', 'ג', 'ד'][q.correctIndex]}</span>
                    </p>
                    <p className="text-slate-700 leading-relaxed">{q.explanation}</p>
                  </div>

                  {q.shiraTip && (
                    <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3.5 text-amber-950 flex items-start gap-2.5">
                      <span className="text-base">💡</span>
                      <div>
                        <span className="font-extrabold text-amber-900 block mb-0.5">הטיפ של שירה לבגרות ולמבחן:</span>
                        <p className="text-amber-900/90 leading-relaxed">{q.shiraTip}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => {
              setCurrentPage(p => Math.max(1, p - 1));
              window.scrollTo({ top: 350, behavior: 'smooth' });
            }}
            disabled={currentPage === 1}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all font-bold text-xs flex items-center gap-1"
          >
            <ChevronRight className="w-4 h-4" />
            <span>הקודם</span>
          </button>

          <div className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
            <span>עמוד</span>
            <span className="text-brand-600 font-black">{currentPage}</span>
            <span>מתוך</span>
            <span>{totalPages}</span>
          </div>

          <button
            onClick={() => {
              setCurrentPage(p => Math.min(totalPages, p + 1));
              window.scrollTo({ top: 350, behavior: 'smooth' });
            }}
            disabled={currentPage === totalPages}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all font-bold text-xs flex items-center gap-1"
          >
            <span>הבא</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
