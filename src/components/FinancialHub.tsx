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
  Shuffle
} from 'lucide-react';
import { EXTERNAL_TOOLS } from '../data/externalTools';
import { ALL_QUESTIONS } from '../data/allQuestions';
import { FULL_FINANCE_BANK } from '../data/questionBank';
import { Question } from '../types';
import { fireSmallSuccessConfetti } from '../utils/confetti';
import { sound } from '../utils/soundEngine';

interface FinancialHubProps {
  onAddXP: (amount: number) => void;
}

export const FinancialHub: React.FC<FinancialHubProps> = ({ onAddXP }) => {
  const [activeTab, setActiveTab] = useState<'rights' | 'tools' | 'calculator' | 'quiz'>('rights');

  // Quick salary estimator state
  const [ageGroup, setAgeGroup] = useState<'under16' | '16to17' | '17to18'>('16to17');
  const [hoursWorked, setHoursWorked] = useState<number>(25);
  const [travelCost, setTravelCost] = useState<number>(100);

  // Simple compound interest state
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(200);
  const [years, setYears] = useState<number>(10);
  const annualRate = 0.07; // 7% standard market index average

  // Quiz state with 1,320+ questions
  const allFinancePool = [
    ...ALL_QUESTIONS.filter(q => q.subject === 'finance'),
    ...FULL_FINANCE_BANK
  ];
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [activeQIndex, setActiveQIndex] = useState(0);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);
  const [isAnsDone, setIsAnsDone] = useState(false);

  const financialQuestions = allFinancePool.filter(q => {
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
    if (isAnsDone) return;
    setSelectedAns(idx);
    setIsAnsDone(true);
    if (currentQ && idx === currentQ.correctIndex) {
      fireSmallSuccessConfetti();
      sound.playCorrect();
      onAddXP(15);
    } else {
      sound.playWrong();
    }
  };

  const nextQuizQ = () => {
    setSelectedAns(null);
    setIsAnsDone(false);
    setActiveQIndex((prev) => (prev + 1) % financialQuestions.length);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-emerald-200">
            <Coins className="w-3.5 h-3.5" />
            <span>אוריינות פיננסית מעשית לחיים</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">מרחב חינוך פיננסי וזכויות נוער עובד</h1>
          <p className="text-emerald-100 text-sm leading-relaxed">
            כל מה שחשוב לדעת כשיוצאים לעבוד: שכר מינימום עדכני, הגנה מפני קנסות וניצול, בנקאות דיגיטלית, וכלים רשמיים לתכנון פיננסי נבון.
          </p>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => setActiveTab('rights')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'rights'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>זכויות נוער עובד</span>
        </button>

        <button
          onClick={() => setActiveTab('tools')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'tools'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>מחשבונים וכלים רשמיים</span>
        </button>

        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'calculator'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>סימולטור שכר וריבית</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'quiz'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>תרגול שאלות פיננסיות</span>
        </button>
      </div>

      {/* TAB 1: YOUTH LABOR RIGHTS */}
      {activeTab === 'rights' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Minimum Wage Rates Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">שכר מינימום לשעה לנוער בישראל (מעודכן)</h3>
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

      {/* TAB 3: ZERO-MAINTENANCE QUICK CALCULATORS */}
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
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 ml-1">רמת קושי:</span>
              {['all', 'בינוני', 'מתקדם', 'בגרות', 'אתגר עליון'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => { setSelectedDifficulty(diff); setActiveQIndex(0); setIsAnsDone(false); setSelectedAns(null); }}
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
                const rand = Math.floor(Math.random() * financialQuestions.length);
                setActiveQIndex(rand);
                setIsAnsDone(false);
                setSelectedAns(null);
              }}
              className="text-xs font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>שאלה אקראית מתוך {financialQuestions.length} 🎲</span>
            </button>
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

              <div className="space-y-2.5 pt-1">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedAns === idx;
                  const isCorrect = idx === currentQ.correctIndex;
                  let style = "border-slate-200 hover:border-emerald-500 hover:bg-slate-50 text-slate-800";
                  if (isAnsDone) {
                    if (isCorrect) style = "bg-emerald-500 text-white font-bold border-emerald-500";
                    else if (isSelected) style = "bg-rose-500 text-white border-rose-500";
                    else style = "opacity-50 border-slate-200";
                  }
                  return (
                    <button
                      key={idx}
                      disabled={isAnsDone}
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
                    {selectedAns === currentQ.correctIndex ? 'תשובה נכונה! (+15 XP) 💰' : 'לא מדויק, כדאי לזכור לחיים!'}
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
              לא נמצאו שאלות בסינון זה. נסו לבחור רמת קושי אחרת.
            </div>
          )}

        </div>
      )}

    </div>
  );
};
