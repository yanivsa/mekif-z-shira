import React, { useState } from 'react';
import { 
  Search, 
  X, 
  BookOpen, 
  Lightbulb, 
  Filter, 
  Layers, 
  RotateCw, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import { GLOSSARY_TERMS } from '../data/glossary';
import { GlossaryTerm } from '../types';
import { sound } from '../utils/soundEngine';
import { fireSmallSuccessConfetti } from '../utils/confetti';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({ isOpen, onClose }) => {
  const [activeView, setActiveView] = useState<'list' | 'flashcards'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Flashcards state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const categories = Array.from(new Set(GLOSSARY_TERMS.map(t => t.category)));

  const filteredTerms = GLOSSARY_TERMS.filter((term) => {
    const matchCategory = selectedCategory === 'all' || term.category === selectedCategory;
    const matchSearch =
      term.term.includes(searchQuery) ||
      term.definition.includes(searchQuery) ||
      (term.shiraTip && term.shiraTip.includes(searchQuery));
    return matchCategory && matchSearch;
  });

  const currentFlashcard: GlossaryTerm | undefined = filteredTerms[cardIndex] || filteredTerms[0];

  const handleFlip = () => {
    sound.playClick();
    setIsFlipped(prev => !prev);
  };

  const handleNextCard = () => {
    sound.playClick();
    setIsFlipped(false);
    setCardIndex(prev => (prev + 1) % filteredTerms.length);
  };

  const handlePrevCard = () => {
    sound.playClick();
    setIsFlipped(false);
    setCardIndex(prev => (prev - 1 + filteredTerms.length) % filteredTerms.length);
  };

  const handleMarkKnown = (termId: string) => {
    sound.playCorrect();
    fireSmallSuccessConfetti();
    setKnownCards(prev => ({ ...prev, [termId]: true }));
    handleNextCard();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-3xl max-h-[92vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-zinc-800">
        
        {/* Modal Header */}
        <div className="p-3.5 sm:p-5 border-b border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 dark:bg-zinc-950">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-civics-light text-civics flex items-center justify-center shadow-xs shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-lg font-black text-slate-900 dark:text-zinc-100">
                מרחב המונחים וההגדרות של שירה
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-zinc-400">
                הגדרות מדויקות ממונחון משרד החינוך ומפמ״ר אזרחות לבגרות ולמבחנים
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between w-full sm:w-auto gap-2">
            {/* View Switcher Pills */}
            <div className="bg-slate-200 dark:bg-zinc-800 p-1 rounded-xl flex items-center gap-1 text-xs font-bold">
              <button
                onClick={() => { sound.playClick(); setActiveView('list'); }}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeView === 'list'
                    ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
                }`}
              >
                📖 מילון
              </button>
              <button
                onClick={() => { sound.playClick(); setActiveView('flashcards'); setIsFlipped(false); }}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  activeView === 'flashcards'
                    ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>כרטיסיות שינון</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 flex items-center justify-center transition-colors shrink-0"
              aria-label="סגור מילון"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="w-full max-w-full overflow-hidden border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
          <div className="px-4 py-2.5 flex items-center gap-1.5 overflow-x-auto overscroll-x-contain scrollbar-none">
          <button
            onClick={() => { sound.playClick(); setSelectedCategory('all'); setCardIndex(0); }}
            className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200'
            }`}
          >
            הכל ({GLOSSARY_TERMS.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { sound.playClick(); setSelectedCategory(cat); setCardIndex(0); }}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold'
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
          </div>
        </div>

        {/* VIEW 1: SEARCHABLE LIST VIEW */}
        {activeView === 'list' && (
          <>
            {/* Search Input */}
            <div className="p-4 border-b border-slate-100 dark:border-zinc-800">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="glossary-search-input"
                  name="glossarySearch"
                  aria-label="חיפוש מושג או הגדרה במילון"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="חפש מושג, זכות, עיקרון או מילה במילון..."
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none text-xs sm:text-sm bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100"
                />
              </div>
            </div>

            {/* Terms List */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 divide-y divide-slate-100 dark:divide-zinc-800 flex-1">
              {filteredTerms.length > 0 ? (
                filteredTerms.map((item) => (
                  <div key={item.id} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-zinc-100">{item.term}</h3>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed font-normal">
                      {item.definition}
                    </p>
                    {item.shiraTip && (
                      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 rounded-xl p-2.5 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2">
                        <span className="text-sm shrink-0">👩‍🏫</span>
                        <span><strong>טיפ משירה לבגרות:</strong> {item.shiraTip}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-400 text-sm">
                  לא נמצאו מושגים התואמים את החיפוש.
                </div>
              )}
            </div>
          </>
        )}

        {/* VIEW 2: INTERACTIVE FLASHCARDS MODE */}
        {activeView === 'flashcards' && currentFlashcard && (
          <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between items-center space-y-6">
            
            <div className="w-full flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 font-bold">
              <span>כרטיסיה {cardIndex + 1} מתוך {filteredTerms.length}</span>
              <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                {Object.keys(knownCards).length} מושגים נלמדו ✅
              </span>
            </div>

            {/* The Flashcard itself */}
            <div 
              onClick={handleFlip}
              className="w-full max-w-xl min-h-[260px] sm:min-h-[280px] bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/80 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 border-2 border-dashed border-indigo-300 dark:border-indigo-700/60 rounded-3xl p-6 sm:p-8 flex flex-col justify-between items-center text-center cursor-pointer shadow-lg hover:shadow-xl hover:border-indigo-500 transition-all group relative"
            >
              <div className="w-full flex items-center justify-between text-xs text-slate-400">
                <span className="bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold px-2.5 py-0.5 rounded-full">
                  {currentFlashcard.category}
                </span>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:scale-105 transition-transform">
                  <RotateCw className="w-3.5 h-3.5" />
                  לחצו להפיכת כרטיסיה
                </span>
              </div>

              {!isFlipped ? (
                <div className="my-auto space-y-3">
                  <span className="text-3xl">🎴</span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">
                    {currentFlashcard.term}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    האם אתם זוכרים את ההגדרה הרשמית של המושג?
                  </p>
                </div>
              ) : (
                <div className="my-auto space-y-4 animate-in fade-in duration-200">
                  <div className="text-sm sm:text-base text-slate-800 dark:text-zinc-200 leading-relaxed font-medium">
                    {currentFlashcard.definition}
                  </div>
                  {currentFlashcard.shiraTip && (
                    <div className="bg-amber-100/70 dark:bg-amber-950/50 p-2.5 rounded-xl text-xs text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800/40">
                      💡 <strong>טיפ שירה:</strong> {currentFlashcard.shiraTip}
                    </div>
                  )}
                </div>
              )}

              <div className="text-[11px] text-slate-400">
                {isFlipped ? 'לחצו שוב להסתרה' : 'לחצו לצפייה במחוון וההגדרה'}
              </div>
            </div>

            {/* Flashcard Action Controls */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handlePrevCard}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
                <span>הקודם</span>
              </button>

              <button
                onClick={() => handleMarkKnown(currentFlashcard.id)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>ידעתי בעל פה! (+10 XP)</span>
              </button>

              <button
                onClick={handleNextCard}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>הבא</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 flex justify-between items-center">
          <div className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
            תיכון מקיף ז׳ • המרחב של שירה
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs transition-colors"
          >
            סגור
          </button>
        </div>

      </div>
    </div>
  );
};
