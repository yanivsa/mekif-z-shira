import React, { useState } from 'react';
import { 
  Coins, 
  ExternalLink, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Calculator, 
  ArrowLeft,
  Briefcase,
  TrendingUp,
  CreditCard,
  Building2,
  Lightbulb,
  Shuffle,
  BookOpen,
  Download,
  Copy,
  Check,
  Search,
  FileText,
  Sparkles,
  Clock,
  X,
  ChevronLeft,
  Compass
} from 'lucide-react';
import { EXTERNAL_TOOLS } from '../data/externalTools';
import { ALL_QUESTIONS } from '../data/allQuestions';
import { FULL_FINANCE_BANK } from '../data/questionBank';
import { FINANCIAL_LIBRARY, FinancialGuide } from '../data/financialLibrary';
import { Question } from '../types';
import { fireSmallSuccessConfetti } from '../utils/confetti';
import { sound } from '../utils/soundEngine';

interface FinancialHubProps {
  onAddXP: (amount: number) => void;
  initialTab?: 'library' | 'rights' | 'tools' | 'calculator' | 'quiz';
}

export const FinancialHub: React.FC<FinancialHubProps> = ({ onAddXP, initialTab = 'library' }) => {
  const [activeTab, setActiveTab] = useState<'library' | 'rights' | 'tools' | 'calculator' | 'quiz'>(initialTab);

  // Library state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLibraryCategory, setSelectedLibraryCategory] = useState<string>('all');
  const [selectedLibraryGrade, setSelectedLibraryGrade] = useState<string>('all');
  const [activeGuideModal, setActiveGuideModal] = useState<FinancialGuide | null>(null);
  const [copiedGuideId, setCopiedGuideId] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Quick salary estimator state
  const [ageGroup, setAgeGroup] = useState<'under16' | '16to17' | '17to18'>('16to17');
  const [hoursWorked, setHoursWorked] = useState<number>(25);
  const [travelCost, setTravelCost] = useState<number>(100);

  // Simple compound interest state
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(200);
  const [years, setYears] = useState<number>(10);
  const annualRate = 0.07; // 7% standard market index average

  // Quiz state with 2,700+ questions
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [activeQIndex, setActiveQIndex] = useState(0);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);
  const [isAnsDone, setIsAnsDone] = useState(false);
  const [attemptsCount, setAttemptsCount] = useState<number>(0);
  const [wrongAttempts, setWrongAttempts] = useState<number[]>([]);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Filtered library guides
  const filteredGuides = FINANCIAL_LIBRARY.filter(guide => {
    if (selectedLibraryCategory !== 'all' && guide.category !== selectedLibraryCategory) return false;
    if (selectedLibraryGrade !== 'all') {
      if (selectedLibraryGrade === 'junior' && guide.gradeLevel === 'senior') return false;
      if (selectedLibraryGrade === 'senior' && guide.gradeLevel === 'junior') return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = guide.title.toLowerCase().includes(q);
      const matchSub = guide.subtitle.toLowerCase().includes(q);
      const matchSummary = guide.summary.toLowerCase().includes(q);
      const matchTopic = guide.relatedTopic.toLowerCase().includes(q);
      const matchTakeaways = guide.keyTakeaways.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchSub && !matchSummary && !matchTopic && !matchTakeaways) return false;
    }
    return true;
  });

  const financialQuestions = FULL_FINANCE_BANK.filter(q => {
    if (selectedGrade !== 'all') {
      if (selectedGrade === 'junior' && q.gradeLevel !== 'junior') return false;
      if (selectedGrade === 'senior' && q.gradeLevel !== 'senior') return false;
      if (!['junior', 'senior'].includes(selectedGrade) && !q.gradeText.includes(selectedGrade)) return false;
    }
    if (selectedTopic !== 'all' && q.topic !== selectedTopic) return false;
    if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const currentQ: Question | undefined = financialQuestions[activeQIndex];

  // Hourly rates (2025/2026 update)
  const rates = {
    under16: 25.28,
    '16to17': 27.09,
    '17to18': 29.97
  };

  const calculatedBaseSalary = Math.round(hoursWorked * rates[ageGroup]);
  const totalEstimatedWage = calculatedBaseSalary + Number(travelCost);

  // Compound interest calculation
  const months = years * 12;
  const monthlyRate = annualRate / 12;
  const totalDeposited = monthlyDeposit * months;
  const futureValue = Math.round(
    monthlyDeposit * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
  );
  const totalProfit = futureValue - totalDeposited;

  const handleSelectQuiz = (idx: number) => {
    if (isAnsDone || wrongAttempts.includes(idx)) return;

    if (currentQ && idx === currentQ.correctIndex) {
      setSelectedAns(idx);
      setIsAnsDone(true);
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
        setSelectedAns(idx);
        setIsAnsDone(true);
        setShowHint(false);
        sound.playWrong();
      }
    }
  };

  const nextQuizQ = () => {
    setSelectedAns(null);
    setIsAnsDone(false);
    setAttemptsCount(0);
    setWrongAttempts([]);
    setShowHint(false);
    setActiveQIndex((prev) => (prev + 1) % financialQuestions.length);
  };

  const handleCopyGuide = (guide: FinancialGuide) => {
    const textToCopy = `${guide.title}\n${guide.subtitle}\n\nתקציר:\n${guide.summary}\n\nנקודות מפתח:\n${guide.keyTakeaways.map(t => '• ' + t).join('\n')}\n\nהטיפ של שירה:\n${guide.shiraTip}\n\nמקור: ${guide.sourceName} (${guide.sourceUrl})\nהמרחב של שירה • תיכון מקיף ז׳`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedGuideId(guide.id);
    sound.playClick();
    setTimeout(() => setCopiedGuideId(null), 2500);
  };

  const handleDownloadGuide = (guide: FinancialGuide) => {
    const markdownContent = `# ${guide.title}\n${guide.subtitle}\n\n## תקציר ומבוא\n${guide.summary}\n\n## נקודות מפתח לשינון\n${guide.keyTakeaways.map(t => '- ' + t).join('\n')}\n\n## הטיפ הפדגוגי של שירה\n> ${guide.shiraTip}\n\n` +
      guide.sections.map(s => `### ${s.title}\n${s.paragraphs.join('\n\n')}`).join('\n\n') +
      (guide.checklist ? `\n\n## צ'ק-ליסט מעשי לבדיקה עצמית\n${guide.checklist.map(c => `- [ ] ${c}`).join('\n')}` : '') +
      `\n\n---\n**מקור רשמי:** ${guide.sourceName} (${guide.sourceUrl})\n**המרחב של שירה • תיכון מקיף ז׳**`;

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${guide.id}.md`;
    link.click();
    URL.revokeObjectURL(url);
    sound.playCorrect();
  };

  const handlePracticeTopic = (topicName: string) => {
    sound.playClick();
    setSelectedTopic(topicName);
    setActiveTab('quiz');
    setActiveQIndex(0);
    setIsAnsDone(false);
    setSelectedAns(null);
    setAttemptsCount(0);
    setWrongAttempts([]);
    setShowHint(false);
    setActiveGuideModal(null);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const toggleChecklistItem = (key: string) => {
    sound.playClick();
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-3 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-200 border border-white/10">
            <Coins className="w-3.5 h-3.5 text-emerald-300" />
            <span>אוריינות פיננסית מעשית לחיים • תיכון מקיף ז׳</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            מרחב חינוך פיננסי, זכויות נוער וספריית חומרים
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
            כל מה שחשוב לדעת כשיוצאים לעבוד ולחיים הבוגרים: שכר מינימום עדכני 2025–2026, פענוח תלוש שכר, בנקאות דיגיטלית, הגנה מהונאות רשת, ריבית דריבית ו-8 מדריכים מקיפים לשיעורים ולחיים.
          </p>
          
          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="bg-emerald-600/60 text-white px-2.5 py-1 rounded-xl font-bold flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> 8 מדריכים בספרייה
            </span>
            <span className="bg-white/15 text-emerald-100 px-2.5 py-1 rounded-xl font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 2,700+ שאלות תרגול
            </span>
            <span className="bg-white/15 text-emerald-100 px-2.5 py-1 rounded-xl font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> שכר 2025–2026 מעודכן
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto relative z-10">
          <button
            onClick={() => { sound.playClick(); setActiveTab('library'); }}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
              activeTab === 'library'
                ? 'bg-white text-emerald-950 font-black scale-102'
                : 'bg-emerald-600/80 hover:bg-emerald-600 text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>פתח ספריית חומרים 📚</span>
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveTab('quiz'); }}
            className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>תרגול שאלות פיננסיות 🎯</span>
          </button>
        </div>
      </div>

      {/* Official Ministry Financial Education Portal Ribbon */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="p-2.5 bg-emerald-600 text-white rounded-2xl shadow-xs shrink-0 mt-0.5">
              <Compass className="w-5 h-5" />
            </span>
            <div>
              <div className="text-sm sm:text-base font-black text-slate-900 flex flex-wrap items-center gap-2">
                <span>פורטל משרד החינוך – חינוך פיננסי לחטיבת הביניים (4 הצירים)</span>
                <span className="text-[11px] bg-emerald-100 text-emerald-900 font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  תוכנית רשמית ספירלית
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                חומרי הלמידה והשאלות מבוססים על 4 הצירים הספירליים של משרד החינוך: צרכנות מודעת ("אושר על המדף"), עולם הכסף והבנקאות, שוק העבודה וזכויות עובדים, ותכנון תקציב וחיסכון לעתיד.
              </p>
            </div>
          </div>

          <a
            href="https://pop.education.gov.il/tchumey_daat/financial-education/junior-high/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-2xs transition-all shrink-0 w-full lg:w-auto justify-center"
          >
            <span>פתח פורטל חינוך פיננסי במשרד החינוך</span>
            <ExternalLink className="w-3.5 h-3.5 text-white" />
          </a>
        </div>

        {/* 4 Spiral Axes interactive badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold text-slate-700 scrollbar-none pt-1 border-t border-emerald-100">
          <span className="shrink-0 text-emerald-800 font-black flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 4 צירי הליבה:
          </span>
          {[
            { name: "ציר 1: צרכנות מודעת וביקורתית", desc: "אושר על המדף, מניפולציות שיווקיות וביטול עסקה", topic: "צרכנות נבונה וביקורתית" },
            { name: "ציר 2: עולם הכסף והבנקאות", desc: "מוסכמה חברתית, אמצעי תשלום, דביט ואינפלציה", topic: "עולם הכסף והבנקאות" },
            { name: "ציר 3: שוק העבודה וזכויות עובדים", desc: "זכויות נוער 2025–2026, שכר מינימום ופענוח תלוש", topic: "שוק העבודה וזכויות עובדים" },
            { name: "ציר 4: תקציב, חיסכון והשקעות", desc: "מודל SMART, ריבית דריבית, חיסכון לכל ילד ו-S&P500", topic: "חיסכון והשקעות" }
          ].map((axis, aIdx) => (
            <button
              key={aIdx}
              onClick={() => {
                sound.playClick();
                setSelectedTopic(axis.topic);
                setActiveTab('quiz');
              }}
              title={axis.desc}
              className="shrink-0 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 px-2.5 py-1 rounded-lg text-slate-800 text-[11px] font-semibold whitespace-nowrap shadow-2xs transition-all flex items-center gap-1"
            >
              <span>{axis.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => { sound.playClick(); setActiveTab('library'); }}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'library'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>ספריית מדריכים וחומרים 📚</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
            activeTab === 'library' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
          }`}>
            8
          </span>
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveTab('rights'); }}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'rights'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>זכויות נוער עובד 🛡️</span>
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveTab('quiz'); }}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'quiz'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>תרגול שאלות (2,700+) ✅</span>
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveTab('calculator'); }}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'calculator'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>סימולטור שכר וריבית 🧮</span>
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveTab('tools'); }}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'tools'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>מחשבונים וכלים רשמיים 🏛️</span>
        </button>
      </div>

      {/* TAB 0: FINANCIAL EDUCATION LIBRARY (NEW!) */}
      {activeTab === 'library' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Library Subheader and Search Controls */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">📚</span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    ספריית הידע והחומרים בחינוך פיננסי • תיכון מקיף ז׳
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  מאגר המדריכים והחומרים המקיף שנכתב על ידי שירה עבור תלמידי מקיף ז׳. סיכומים מובנים, צ'ק-ליסטים מעשיים, טיפים לחיים ואפשרות להורדה והעתקה לשיעור.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                <input
                  id="financial-library-search"
                  name="financialLibrarySearch"
                  aria-label="חיפוש נושא, מושג או מילת מפתח בספריה הפיננסית"
                  type="text"
                  placeholder="חיפוש נושא, מושג או מילת מפתח..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute left-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-slate-500 ml-1">נושא:</span>
                {[
                  { id: 'all', label: 'הכל (8)' },
                  { id: 'rights', label: 'זכויות עבודה ושכר' },
                  { id: 'banking', label: 'בנקאות ודיגיטל' },
                  { id: 'investing', label: 'חיסכון והשקעות' },
                  { id: 'consumerism', label: 'תקציב וצרכנות' },
                  { id: 'security', label: 'הגנת סייבר' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { sound.playClick(); setSelectedLibraryCategory(cat.id); }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      selectedLibraryCategory === cat.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-500 ml-1">שכבה:</span>
                {[
                  { id: 'all', label: 'כל השכבות' },
                  { id: 'junior', label: 'חט״ב (ז׳–ט׳)' },
                  { id: 'senior', label: 'חט״ע (י׳–י״ב)' }
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => { sound.playClick(); setSelectedLibraryGrade(g.id); }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      selectedLibraryGrade === g.id
                        ? 'bg-slate-800 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Guides Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGuides.map((guide) => {
              const isCopied = copiedGuideId === guide.id;
              return (
                <div
                  key={guide.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-400 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Header Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {guide.categoryLabel}
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {guide.gradeText}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" />
                        <span>{guide.readTimeMinutes} דק׳ קריאה</span>
                      </span>
                    </div>

                    {/* Titles */}
                    <div>
                      <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {guide.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {guide.subtitle}
                      </p>
                    </div>

                    {/* Summary */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {guide.summary}
                    </p>

                    {/* Key takeaways bullet points */}
                    <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-700 block">נקודות מפתח לשינון:</span>
                      {guide.keyTakeaways.slice(0, 3).map((takeaway, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{takeaway}</span>
                        </div>
                      ))}
                    </div>

                    {/* Shira's Tip Box */}
                    <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3 text-xs text-amber-950 flex items-start gap-2">
                      <span className="text-base shrink-0">👩‍🏫</span>
                      <p className="leading-relaxed font-medium">
                        <strong className="text-amber-900">הטיפ של שירה: </strong>
                        {guide.shiraTip}
                      </p>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopyGuide(guide)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1 transition-all ${
                            isCopied
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                          title="העתק סיכום מרוכז לשיעור / וואטסאפ"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{isCopied ? 'הועתק!' : 'העתק סיכום'}</span>
                        </button>

                        <button
                          onClick={() => handleDownloadGuide(guide)}
                          className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1 transition-all"
                          title="הורד כמסמך Markdown/Text למחשב"
                        >
                          <Download className="w-3.5 h-3.5 text-slate-500" />
                          <span>הורד קובץ</span>
                        </button>
                      </div>

                      <button
                        onClick={() => { sound.playClick(); setActiveGuideModal(guide); }}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                      >
                        <span>קרא מדריך מלא</span>
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => handlePracticeTopic(guide.relatedTopic)}
                      className="w-full py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-emerald-200"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>תרגל שאלות בנושא "{guide.relatedTopic}" ➔</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredGuides.length === 0 && (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2">
              <span className="text-3xl block">🔍</span>
              <h4 className="font-bold text-slate-700">לא נמצאו מדריכים התואמים את החיפוש</h4>
              <p className="text-xs text-slate-500">נסו לשנות את מילת החיפוש או לבחור קטגוריה אחרת.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedLibraryCategory('all'); setSelectedLibraryGrade('all'); }}
                className="text-xs text-emerald-700 font-bold underline mt-2"
              >
                איפוס כל הסינונים
              </button>
            </div>
          )}

        </div>
      )}

      {/* TAB 1: YOUTH LABOR RIGHTS */}
      {activeTab === 'rights' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Minimum Wage Rates Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">שכר מינימום לשעה לנוער בישראל (מעודכן 2025–2026)</h3>
                <p className="text-xs text-slate-500">חובה חוקית – אסור למעסיק לשלם פחות מכך בשום מקרה!</p>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-2.5 py-1 rounded-full">
                חוק מגן
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-1">
                <span className="text-xs font-bold text-slate-500 block">עד גיל 16 (70%)</span>
                <span className="text-2xl font-black text-emerald-700">25.28 ₪</span>
                <span className="text-[11px] text-slate-400 block">לשעת עבודה</span>
              </div>

              <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200 text-center space-y-1">
                <span className="text-xs font-bold text-emerald-800 block">גילאי 16–17 (75%)</span>
                <span className="text-2xl font-black text-emerald-700">27.09 ₪</span>
                <span className="text-[11px] text-slate-500 block">לשעת עבודה</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-1">
                <span className="text-xs font-bold text-slate-500 block">גילאי 17–18 (83%)</span>
                <span className="text-2xl font-black text-emerald-700">29.97 ₪</span>
                <span className="text-[11px] text-slate-400 block">לשעת עבודה</span>
              </div>
            </div>
          </div>

          {/* Golden Rules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2 font-black text-slate-900 text-base">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">1</span>
                <span>התלמדות וניסיון – שכר מלא מהדקה הראשונה!</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                אין דבר כזה 'משמרת התלמדות ללא שכר' או 'בדיקת התאמה חינם'. כל דקה שבה אתם נוכחים בעסק (כולל פתיחה וסגירה) מחייבת תשלום שכר מלא.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2 font-black text-slate-900 text-base">
                <span className="w-7 h-7 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center text-xs">2</span>
                <span>איסור מוחלט על קנסות וניכויים!</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                נשברה כוס או צלחת? לקוח ברח בלי לשלם? חסר כסף בקופה בסוף המשמרת? החוק אוסר על המעסיק לנכות שקל משכרכם! זהו סיכון של בעל העסק.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2 font-black text-slate-900 text-base">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">3</span>
                <span>נסיעות והסעות בלילה</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                המעסיק חייב לשלם החזר נסיעות. אם משמרת מסתיימת בלילה (אחרי 23:00) כשאין תחבורה ציבורית – המעסיק מחויב לספק הסעה עד דלת הבית!
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2 font-black text-slate-900 text-base">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">4</span>
                <span>שעות נוספות ושבתות</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                שעתיים ראשונות מעבר ליום עבודה: 125% שכר. החל מהשעה השלישית: 150%. עבודה ביום שבת: 150% מהשעה הראשונה!
              </p>
            </div>

          </div>

          <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">רוצים לצלול לעומק החומרים?</h4>
              <p className="text-xs text-slate-600 mt-0.5">מדריכי פענוח תלוש שכר, בנקאות דיגיטלית ודירוג אשראי מחכים לכם בספרייה.</p>
            </div>
            <button
              onClick={() => { sound.playClick(); setActiveTab('library'); }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs shrink-0"
            >
              <BookOpen className="w-4 h-4" />
              <span>עבור לספריית המדריכים ➔</span>
            </button>
          </div>

        </div>
      )}

      {/* TAB 2: OFFICIAL EXTERNAL TOOLS */}
      {activeTab === 'tools' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-xl font-black text-slate-900">כלים ומחשבונים רשמיים של מדינת ישראל</h3>
              <p className="text-sm text-slate-500">
                קישורים ישירים לאתרים הממשלתיים והארגוניים המוסמכים ביותר – תמיד מעודכנים, אמינים וללא צורך בתחזוקה.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {EXTERNAL_TOOLS.map((tool) => (
                <div 
                  key={tool.id} 
                  className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 bg-white hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {tool.category}
                      </span>
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                    </div>
                    <h4 className="font-extrabold text-base text-slate-900">{tool.name}</h4>
                    <span className="text-xs text-emerald-700 font-semibold block">{tool.organization}</span>
                    <p className="text-xs text-slate-600 leading-relaxed pt-1">
                      {tool.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100">
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900"
                    >
                      <span>פתח באתר הרשמי</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: QUICK CALCULATORS */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
          
          {/* Quick Salary Estimator */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-slate-900 text-lg">אומדן שכר מהיר לנוער</h3>
              </div>
              <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                חישוב מקורב
              </span>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">קבוצת גיל:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setAgeGroup('under16')}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      ageGroup === 'under16' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    עד גיל 16
                  </button>
                  <button
                    onClick={() => setAgeGroup('16to17')}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      ageGroup === '16to17' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    16–17
                  </button>
                  <button
                    onClick={() => setAgeGroup('17to18')}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      ageGroup === '17to18' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    17–18
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>שעות עבודה בחודש:</span>
                  <span className="text-emerald-700 font-extrabold">{hoursWorked} שעות</span>
                </div>
                <input
                  id="wage-calc-hours"
                  name="wageCalcHours"
                  aria-label="שעות עבודה בחודש"
                  type="range"
                  min="5"
                  max="120"
                  value={hoursWorked}
                  onChange={(e) => setHoursWorked(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>החזר נסיעות חודשי:</span>
                  <span className="text-emerald-700 font-extrabold">{travelCost} ₪</span>
                </div>
                <input
                  id="wage-calc-travel"
                  name="wageCalcTravel"
                  aria-label="החזר נסיעות חודשי"
                  type="range"
                  min="0"
                  max="350"
                  step="10"
                  value={travelCost}
                  onChange={(e) => setTravelCost(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Result Box */}
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-center space-y-1">
                <span className="text-xs text-emerald-800 font-bold block">שכר מינימום משוער ברוטו לתשלום:</span>
                <span className="text-3xl font-black text-emerald-900">{totalEstimatedWage} ₪</span>
                <span className="text-[11px] text-emerald-700 block">
                  (לפי תעריף שעה של {rates[ageGroup]} ₪ + {travelCost} ₪ נסיעות)
                </span>
              </div>
            </div>
          </div>

          {/* Compound Interest Visualizer */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-slate-900 text-lg">כוחה של ריבית דריבית</h3>
              </div>
              <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                תשואה ממוצעת 7%
              </span>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>חיסכון חודשי:</span>
                  <span className="text-emerald-700 font-extrabold">{monthlyDeposit} ₪ בחודש</span>
                </div>
                <input
                  id="interest-calc-deposit"
                  name="interestCalcDeposit"
                  aria-label="חיסכון חודשי"
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={monthlyDeposit}
                  onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>משך זמן החיסכון:</span>
                  <span className="text-emerald-700 font-extrabold">{years} שנים</span>
                </div>
                <input
                  id="interest-calc-years"
                  name="interestCalcYears"
                  aria-label="משך זמן החיסכון בשנים"
                  type="range"
                  min="3"
                  max="30"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 block">כסף שהפקדתם מהכיס:</span>
                  <span className="text-lg font-bold text-slate-800">{totalDeposited} ₪</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                  <span className="text-[11px] text-emerald-800 block">רווח מריבית דריבית:</span>
                  <span className="text-lg font-black text-emerald-700">+{totalProfit} ₪</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 rounded-2xl text-center space-y-0.5 shadow-xs">
                <span className="text-xs text-emerald-100 block">סך הסכום שיצטבר לכם:</span>
                <span className="text-3xl font-black">{futureValue.toLocaleString()} ₪ 🎉</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: PRACTICE QUIZ */}
      {activeTab === 'quiz' && (
        <div className="space-y-4 animate-fadeIn">
          
          {/* Quick Quiz Filters */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-500">שכבת לימוד / כיתה:</span>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                {financialQuestions.length} שאלות פיננסיות זמינות
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
                { id: 'י״ב', label: 'כיתה י״ב' }
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedGrade(g.id);
                    setActiveQIndex(0);
                    setIsAnsDone(false);
                    setSelectedAns(null);
                    setAttemptsCount(0);
                    setWrongAttempts([]);
                    setShowHint(false);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    selectedGrade === g.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>

            {/* Topic Filter Row */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500 ml-1">נושא ממוקד:</span>
              {[
                { id: 'all', label: 'הכל' },
                { id: 'צרכנות נבונה וביקורתית', label: 'צרכנות נבונה (ציר 1)' },
                { id: 'עולם הכסף והבנקאות', label: 'כסף ובנקאות (ציר 2)' },
                { id: 'שוק העבודה וזכויות עובדים', label: 'זכויות עבודה (ציר 3)' },
                { id: 'חיסכון והשקעות', label: 'חיסכון והשקעות (ציר 4)' },
                { id: 'זכויות נוער עובד', label: 'זכויות נוער עובד' },
                { id: 'פענוח תלוש שכר ומיסוי', label: 'תלוש שכר ומיסוי' },
                { id: 'שוק ההון וחיסכון ארוך טווח', label: 'שוק ההון ו-S&P 500' },
                { id: 'אבטחת מידע וסייבר פיננסי', label: 'הגנת סייבר ופישינג' }
              ].map((top) => (
                <button
                  key={top.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedTopic(top.id);
                    setActiveQIndex(0);
                    setIsAnsDone(false);
                    setSelectedAns(null);
                    setAttemptsCount(0);
                    setWrongAttempts([]);
                    setShowHint(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedTopic === top.id
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {top.label}
                </button>
              ))}
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-slate-500 ml-1">רמת קושי:</span>
                {['all', 'בינוני', 'מתקדם', 'בגרות', 'אתגר עליון'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => { 
                      sound.playClick(); 
                      setSelectedDifficulty(diff); 
                      setActiveQIndex(0); 
                      setIsAnsDone(false); 
                      setSelectedAns(null);
                      setAttemptsCount(0);
                      setWrongAttempts([]);
                      setShowHint(false);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedDifficulty === diff
                        ? diff === 'אתגר עליון'
                          ? 'bg-rose-600 text-white'
                          : 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {diff === 'all' ? 'הכל' : diff}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  const rand = Math.floor(Math.random() * financialQuestions.length);
                  setActiveQIndex(rand);
                  setIsAnsDone(false);
                  setSelectedAns(null);
                  setAttemptsCount(0);
                  setWrongAttempts([]);
                  setShowHint(false);
                }}
                className="text-xs font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-all shadow-2xs"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>שאלה אקראית 🎲</span>
              </button>
            </div>
          </div>

          {currentQ ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-emerald-100 text-emerald-900 font-bold text-xs px-2.5 py-1 rounded-full">
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
                    <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <span>📖 {currentQ.source}</span>
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-500 font-bold bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                  שאלה {activeQIndex + 1} מתוך {financialQuestions.length}
                </span>
              </div>

              {/* Scenario */}
              {currentQ.scenario && (
                <div className="bg-emerald-50/60 border-r-4 border-emerald-500 p-4 rounded-xl text-slate-800 text-xs sm:text-sm leading-relaxed">
                  <p className="font-bold text-xs text-emerald-800 mb-1">מקרה מעשי לניתוח:</p>
                  <p>{currentQ.scenario}</p>
                </div>
              )}

              <div className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                {currentQ.question}
              </div>

              {/* Shira's Hint on First Mistake */}
              {showHint && !isAnsDone && (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 text-amber-950 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300 shadow-md">
                  <div className="flex items-center gap-2 font-black text-sm text-amber-800">
                    <span className="text-lg">💡</span>
                    <span>לא נורא! הנה רמז משירה – קיראו ונסו שוב:</span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium leading-relaxed bg-white/80 p-3 rounded-xl border border-amber-200">
                    {currentQ.shiraTip || 'שימו לב לחוקי העבודה העדכניים ולזכויות המפורטות בטבלת השכר.'}
                  </p>
                  <div className="text-xs font-bold text-amber-700">
                    🎯 התשובה שבחרתם אינה נכונה. ביחרו תשובה אחרת מבין האפשרויות הנותרות!
                  </div>
                </div>
              )}

              <div className="space-y-2.5 pt-1">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedAns === idx;
                  const isCorrect = idx === currentQ.correctIndex;
                  const isWrongAttempt = wrongAttempts.includes(idx);

                  let style = "border-slate-200 hover:border-emerald-500 hover:bg-slate-50 text-slate-800";
                  if (isWrongAttempt && !isAnsDone) {
                    style = "border-rose-300 bg-rose-50/70 text-rose-800 line-through opacity-60 cursor-not-allowed";
                  } else if (isAnsDone) {
                    if (isCorrect) style = "bg-emerald-500 text-white font-bold border-emerald-500";
                    else if (isSelected) style = "bg-rose-500 text-white border-rose-500";
                    else style = "opacity-50 border-slate-200";
                  }
                  return (
                    <button
                      key={idx}
                      disabled={isAnsDone || isWrongAttempt}
                      onClick={() => handleSelectQuiz(idx)}
                      className={`w-full p-4 rounded-2xl border text-right text-xs sm:text-sm leading-relaxed transition-all ${style}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {isAnsDone && (
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-fadeIn">
                  <div className="font-extrabold text-slate-900 text-sm">
                    {selectedAns === currentQ.correctIndex 
                      ? (attemptsCount === 0 ? 'בול! תשובה נכונה בניסיון ראשון! (+15 XP) 🎉' : 'כל הכבוד! הצלחתם בניסיון השני! (+8 XP) 👏')
                      : 'לא נורא, זו הזדמנות מעולה ללמוד לחיים!'}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {currentQ.explanation}
                  </p>
                  {currentQ.shiraTip && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs sm:text-sm text-amber-950 flex items-start gap-2">
                      <span className="text-base shrink-0">👩‍🏫</span>
                      <div>
                        <span className="font-bold text-amber-900 block mb-0.5">הטיפ של שירה:</span>
                        <p className="text-amber-900/90 leading-relaxed">{currentQ.shiraTip}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={nextQuizQ}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all text-xs flex items-center gap-1.5 shadow-xs"
                    >
                      <span>לשאלה הפיננסית הבאה</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
              לא נמצאו שאלות בסינון זה. נסו לבחור נושא או שכבת גיל אחרת.
            </div>
          )}

        </div>
      )}

      {/* FULL GUIDE READER MODAL */}
      {activeGuideModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-emerald-50 via-teal-50 to-white flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white">
                    {activeGuideModal.categoryLabel}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {activeGuideModal.gradeText}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{activeGuideModal.readTimeMinutes} דק׳ קריאה</span>
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {activeGuideModal.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  {activeGuideModal.subtitle}
                </p>
              </div>

              <button
                onClick={() => setActiveGuideModal(null)}
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-6 text-slate-800 leading-relaxed text-sm">
              
              {/* Summary Card */}
              <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200/80 space-y-1">
                <span className="text-xs font-bold text-emerald-800 block">תקציר ומבוא:</span>
                <p className="text-xs sm:text-sm text-slate-700">{activeGuideModal.summary}</p>
              </div>

              {/* Shira's Tip */}
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 text-amber-950 flex items-start gap-3 shadow-xs">
                <span className="text-2xl shrink-0">👩‍🏫</span>
                <div className="space-y-0.5">
                  <span className="font-extrabold text-xs text-amber-900 block">הטיפ הפדגוגי של שירה למבחן ולחיים:</span>
                  <p className="text-xs sm:text-sm font-medium leading-relaxed">{activeGuideModal.shiraTip}</p>
                </div>
              </div>

              {/* Guide Content Sections */}
              <div className="space-y-6">
                {activeGuideModal.sections.map((sec, idx) => (
                  <div key={idx} className="space-y-2 border-b border-slate-100 pb-5 last:border-b-0">
                    <h4 className="font-black text-base text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      <span>{sec.title}</span>
                    </h4>
                    {sec.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>
                ))}
              </div>

              {/* Key takeaways bullet list */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2.5">
                <h5 className="font-black text-xs sm:text-sm text-slate-900">🎯 סיכום נקודות מפתח לשינון:</h5>
                <ul className="space-y-1.5">
                  {activeGuideModal.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Practical Checklist */}
              {activeGuideModal.checklist && activeGuideModal.checklist.length > 0 && (
                <div className="bg-teal-50/60 rounded-2xl p-5 border border-teal-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-black text-xs sm:text-sm text-teal-950 flex items-center gap-1.5">
                      <span>📋 צ'ק-ליסט מעשי לבדיקה עצמית (סמנו מה שבדקתם):</span>
                    </h5>
                    <span className="text-[11px] text-teal-700 font-bold">
                      {Object.keys(checkedItems).filter(k => k.startsWith(activeGuideModal.id) && checkedItems[k]).length} מתוך {activeGuideModal.checklist.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {activeGuideModal.checklist.map((item, idx) => {
                      const itemKey = `${activeGuideModal.id}-${idx}`;
                      const isChecked = !!checkedItems[itemKey];
                      return (
                        <div
                          key={idx}
                          onClick={() => toggleChecklistItem(itemKey)}
                          className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-teal-100/70 border-teal-300 text-teal-900 font-bold line-through'
                              : 'bg-white border-teal-200 text-slate-700 hover:bg-teal-50/50'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                            isChecked ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isChecked && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <span className="text-xs sm:text-sm leading-snug">{item}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Source Reference Link */}
              <div className="pt-2 text-xs text-slate-400 flex items-center justify-between">
                <span>מקור רשמי מוסמך: {activeGuideModal.sourceName}</span>
                <a
                  href={activeGuideModal.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1"
                >
                  <span>פתח אתר רשמי</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyGuide(activeGuideModal)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  {copiedGuideId === activeGuideModal.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copiedGuideId === activeGuideModal.id ? 'הועתק!' : 'העתק סיכום מלא'}</span>
                </button>

                <button
                  onClick={() => handleDownloadGuide(activeGuideModal)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>הורד כקובץ סיכום</span>
                </button>
              </div>

              <button
                onClick={() => handlePracticeTopic(activeGuideModal.relatedTopic)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 transition-all shadow-md"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>תרגל שאלות בנושא זה עכשיו ➔</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
