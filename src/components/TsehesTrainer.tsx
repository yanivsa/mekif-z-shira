import React, { useState } from 'react';
import { 
  PenTool, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  HelpCircle, 
  ArrowLeft, 
  Sparkles, 
  FileText, 
  Award,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react';
import { TSEHES_QUESTIONS } from '../data/tsehesQuestions';
import { TsehesQuestion } from '../types';
import { fireSchoolPrideConfetti, fireSmallSuccessConfetti } from '../utils/confetti';

interface TsehesTrainerProps {
  onAddXP: (amount: number) => void;
  onTsehesCompleted: () => void;
}

export const TsehesTrainer: React.FC<TsehesTrainerProps> = ({ onAddXP, onTsehesCompleted }) => {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [activeMode, setActiveMode] = useState<'interactive' | 'freestyle'>('interactive');

  // Interactive 3-stage progress
  const [step1Selected, setStep1Selected] = useState<number | null>(null);
  const [step2Selected, setStep2Selected] = useState<number | null>(null);
  const [step3Selected, setStep3Selected] = useState<number | null>(null);

  // Freestyle text state
  const [freeTextAnswer, setFreeTextAnswer] = useState('');
  const [showRubricModel, setShowRubricModel] = useState(false);

  // Guide accordion
  const [showGuide, setShowGuide] = useState(false);

  const currentQ: TsehesQuestion = TSEHES_QUESTIONS[activeQuestionIndex];

  // Calculate score in interactive mode
  let totalScore = 0;
  if (step1Selected === currentQ.step1_tzayen.correctIndex) totalScore += currentQ.step1_tzayen.points;
  if (step2Selected === currentQ.step2_hatzeg.correctIndex) totalScore += currentQ.step2_hatzeg.points;
  if (step3Selected === currentQ.step3_hasber.correctIndex) totalScore += currentQ.step3_hasber.points;

  const isFinishedInteractive = step1Selected !== null && step2Selected !== null && step3Selected !== null;

  const handleStep1 = (idx: number) => {
    if (step1Selected !== null) return;
    setStep1Selected(idx);
    if (idx === currentQ.step1_tzayen.correctIndex) {
      fireSmallSuccessConfetti();
      onAddXP(10);
    }
  };

  const handleStep2 = (idx: number) => {
    if (step2Selected !== null) return;
    setStep2Selected(idx);
    if (idx === currentQ.step2_hatzeg.correctIndex) {
      fireSmallSuccessConfetti();
      onAddXP(15);
    }
  };

  const handleStep3 = (idx: number) => {
    if (step3Selected !== null) return;
    setStep3Selected(idx);
    if (idx === currentQ.step3_hasber.correctIndex) {
      fireSmallSuccessConfetti();
      onAddXP(25);
    }

    // Trigger full completion if all correct
    if (
      step1Selected === currentQ.step1_tzayen.correctIndex &&
      step2Selected === currentQ.step2_hatzeg.correctIndex &&
      idx === currentQ.step3_hasber.correctIndex
    ) {
      fireSchoolPrideConfetti();
      onTsehesCompleted();
    }
  };

  const resetInteractive = () => {
    setStep1Selected(null);
    setStep2Selected(null);
    setStep3Selected(null);
  };

  const nextQuestion = () => {
    resetInteractive();
    setFreeTextAnswer('');
    setShowRubricModel(false);
    setActiveQuestionIndex((prev) => (prev + 1) % TSEHES_QUESTIONS.length);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full text-xs font-bold text-amber-200">
            <PenTool className="w-3.5 h-3.5" />
            <span>סוד ההצלחה בבגרות באזרחות (שאלון 034281)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">מאמן צה״ס לבגרות: ציין ➔ הצג ➔ הסבר</h1>
          <p className="text-amber-100 text-sm leading-relaxed">
            תרגול שאלות אירוע רשמיות מבגרויות עבר עם בדיקה אוטומטית מלאה בכל שלב, או כתיבה חופשית מול מחוון המפמ״ר הרשמי!
          </p>
        </div>

        <button
          onClick={() => setShowGuide(!showGuide)}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-4 py-2.5 rounded-xl backdrop-blur-sm transition-all text-xs sm:text-sm flex items-center gap-1.5 self-stretch md:self-auto justify-center"
        >
          <HelpCircle className="w-4 h-4 text-amber-300" />
          <span>איך בוחני בגרות בודקים צה״ס?</span>
          {showGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Guide Accordion */}
      {showGuide && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 text-slate-800 space-y-4 animate-fadeIn shadow-sm">
          <div className="flex items-center gap-2 font-extrabold text-amber-950 text-base sm:text-lg">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span>מדריך המפמ״ר המזורז למענה מושלם על שאלת אירוע</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs space-y-2">
              <div className="font-black text-amber-900 flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-xs">1</span>
                <span>ציין (זיהוי המושג)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                משפט קצר שבו נוקבים בשם המושג המדויק מתוך השאלה. אין צורך בהסברים! (למשל: "הזכות שנפגעה היא חופש הביטוי").
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs space-y-2">
              <div className="font-black text-amber-900 flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-xs">2</span>
                <span>הצג (הגדרה מתוך המונחון)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                הגדרה תיאורטית מקיפה מתוך מונחון האזרחות הרשמי. <strong>אסור להזכיר את הדמויות או את המקרה בקטע!</strong>
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs space-y-2">
              <div className="font-black text-amber-900 flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-xs">3</span>
                <span>הסבר (ציטוט + קישור)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                חצי מהניקוד! ציטוט מדויק מתוך הטקסט ("בקטע נכתב...") + הסבר כיצד המקרה מהאירוע תואם להגדרה התיאורטית שהצגתם.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mode Switcher & Question Navigator */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Mode selector */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveMode('interactive')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'interactive'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            אימון מודרך (בדיקה אוטומטית)
          </button>
          <button
            onClick={() => setActiveMode('freestyle')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'freestyle'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            כתיבה חופשית ומחוון
          </button>
        </div>

        {/* Question Selector */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-slate-500 font-bold">
            אירוע {activeQuestionIndex + 1} מתוך {TSEHES_QUESTIONS.length}
          </span>
          <div className="flex items-center gap-1">
            {TSEHES_QUESTIONS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveQuestionIndex(idx);
                  resetInteractive();
                  setFreeTextAnswer('');
                  setShowRubricModel(false);
                }}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                  activeQuestionIndex === idx
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Scenario Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        
        {/* Meta Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-900 font-extrabold text-xs px-3 py-1 rounded-full">
              {currentQ.year}
            </span>
            <span className="bg-slate-100 text-slate-700 font-semibold text-xs px-3 py-1 rounded-full">
              {currentQ.topic}
            </span>
          </div>
          <span className="text-xs text-slate-400 font-bold">שאלה שוות ערך ל-10 נקודות בבגרות</span>
        </div>

        {/* Case Study Card */}
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-5 sm:p-6 space-y-3">
          <div className="text-xs font-black uppercase text-amber-800 tracking-wider">
            {currentQ.title}
          </div>
          <p className="text-slate-800 text-base sm:text-lg leading-relaxed font-serif">
            "{currentQ.scenario}"
          </p>
        </div>

        {/* Prompt */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3">
          <FileText className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
            השאלה בבגרות: {currentQ.question}
          </div>
        </div>

        {/* MODE 1: Interactive 3-Stage Training */}
        {activeMode === 'interactive' && (
          <div className="space-y-6 pt-2">
            
            {/* Step 1: TZAYEN */}
            <div className={`p-5 rounded-2xl border transition-all ${
              step1Selected !== null
                ? step1Selected === currentQ.step1_tzayen.correctIndex
                  ? 'bg-emerald-50/50 border-emerald-300'
                  : 'bg-rose-50/50 border-rose-300'
                : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black px-2.5 py-1 rounded-md bg-amber-100 text-amber-900">
                  שלב 1 מתוך 3: ציין (2 נקודות)
                </span>
                {step1Selected !== null && (
                  <span className={`text-xs font-bold ${
                    step1Selected === currentQ.step1_tzayen.correctIndex ? 'text-emerald-700' : 'text-rose-700'
                  }`}>
                    {step1Selected === currentQ.step1_tzayen.correctIndex ? '+2 נקודות' : '0 נקודות'}
                  </span>
                )}
              </div>

              <div className="font-bold text-slate-900 text-sm sm:text-base mb-3">
                {currentQ.step1_tzayen.prompt}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentQ.step1_tzayen.options.map((opt, idx) => {
                  const isSelected = step1Selected === idx;
                  const isCorrect = idx === currentQ.step1_tzayen.correctIndex;
                  let style = "border-slate-200 hover:bg-slate-50 text-slate-800";
                  if (step1Selected !== null) {
                    if (isCorrect) style = "bg-emerald-500 text-white font-bold border-emerald-500";
                    else if (isSelected) style = "bg-rose-500 text-white border-rose-500";
                    else style = "opacity-50 border-slate-200";
                  }
                  return (
                    <button
                      key={idx}
                      disabled={step1Selected !== null}
                      onClick={() => handleStep1(idx)}
                      className={`p-3 rounded-xl border text-right text-xs sm:text-sm transition-all ${style}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {step1Selected !== null && (
                <p className="mt-3 text-xs text-slate-700 bg-white/70 p-2.5 rounded-lg border border-slate-200/60">
                  💡 {currentQ.step1_tzayen.feedback}
                </p>
              )}
            </div>

            {/* Step 2: HATZEG */}
            {step1Selected !== null && (
              <div className={`p-5 rounded-2xl border transition-all animate-fadeIn ${
                step2Selected !== null
                  ? step2Selected === currentQ.step2_hatzeg.correctIndex
                    ? 'bg-emerald-50/50 border-emerald-300'
                    : 'bg-rose-50/50 border-rose-300'
                  : 'bg-white border-slate-200 shadow-xs'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black px-2.5 py-1 rounded-md bg-amber-100 text-amber-900">
                    שלב 2 מתוך 3: הצג (3 נקודות)
                  </span>
                  {step2Selected !== null && (
                    <span className={`text-xs font-bold ${
                      step2Selected === currentQ.step2_hatzeg.correctIndex ? 'text-emerald-700' : 'text-rose-700'
                    }`}>
                      {step2Selected === currentQ.step2_hatzeg.correctIndex ? '+3 נקודות' : '0 נקודות'}
                    </span>
                  )}
                </div>

                <div className="font-bold text-slate-900 text-sm sm:text-base mb-3">
                  {currentQ.step2_hatzeg.prompt}
                </div>

                <div className="space-y-2.5">
                  {currentQ.step2_hatzeg.options.map((opt, idx) => {
                    const isSelected = step2Selected === idx;
                    const isCorrect = idx === currentQ.step2_hatzeg.correctIndex;
                    let style = "border-slate-200 hover:bg-slate-50 text-slate-800";
                    if (step2Selected !== null) {
                      if (isCorrect) style = "bg-emerald-500 text-white font-bold border-emerald-500";
                      else if (isSelected) style = "bg-rose-500 text-white border-rose-500";
                      else style = "opacity-50 border-slate-200";
                    }
                    return (
                      <button
                        key={idx}
                        disabled={step2Selected !== null}
                        onClick={() => handleStep2(idx)}
                        className={`w-full p-3.5 rounded-xl border text-right text-xs sm:text-sm leading-relaxed transition-all ${style}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {step2Selected !== null && (
                  <p className="mt-3 text-xs text-slate-700 bg-white/70 p-2.5 rounded-lg border border-slate-200/60">
                    💡 {currentQ.step2_hatzeg.feedback}
                  </p>
                )}
              </div>
            )}

            {/* Step 3: HASBER */}
            {step2Selected !== null && (
              <div className={`p-5 rounded-2xl border transition-all animate-fadeIn ${
                step3Selected !== null
                  ? step3Selected === currentQ.step3_hasber.correctIndex
                    ? 'bg-emerald-50/50 border-emerald-300'
                    : 'bg-rose-50/50 border-rose-300'
                  : 'bg-white border-slate-200 shadow-xs'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black px-2.5 py-1 rounded-md bg-amber-100 text-amber-900">
                    שלב 3 מתוך 3: הסבר (5 נקודות – ציטוט וקישור)
                  </span>
                  {step3Selected !== null && (
                    <span className={`text-xs font-bold ${
                      step3Selected === currentQ.step3_hasber.correctIndex ? 'text-emerald-700' : 'text-rose-700'
                    }`}>
                      {step3Selected === currentQ.step3_hasber.correctIndex ? '+5 נקודות' : '0 נקודות'}
                    </span>
                  )}
                </div>

                <div className="font-bold text-slate-900 text-sm sm:text-base mb-3">
                  {currentQ.step3_hasber.prompt}
                </div>

                <div className="space-y-2.5">
                  {currentQ.step3_hasber.options.map((opt, idx) => {
                    const isSelected = step3Selected === idx;
                    const isCorrect = idx === currentQ.step3_hasber.correctIndex;
                    let style = "border-slate-200 hover:bg-slate-50 text-slate-800";
                    if (step3Selected !== null) {
                      if (isCorrect) style = "bg-emerald-500 text-white font-bold border-emerald-500";
                      else if (isSelected) style = "bg-rose-500 text-white border-rose-500";
                      else style = "opacity-50 border-slate-200";
                    }
                    return (
                      <button
                        key={idx}
                        disabled={step3Selected !== null}
                        onClick={() => handleStep3(idx)}
                        className={`w-full p-3.5 rounded-xl border text-right text-xs sm:text-sm leading-relaxed transition-all ${style}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {step3Selected !== null && (
                  <p className="mt-3 text-xs text-slate-700 bg-white/70 p-2.5 rounded-lg border border-slate-200/60">
                    💡 {currentQ.step3_hasber.feedback}
                  </p>
                )}
              </div>
            )}

            {/* Results Banner in Interactive Mode */}
            {isFinishedInteractive && (
              <div className="p-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
                <div className="space-y-1 text-center sm:text-right">
                  <div className="text-xl sm:text-2xl font-black text-amber-300 flex items-center justify-center sm:justify-start gap-2">
                    <Award className="w-6 h-6 text-amber-400" />
                    <span>ציון סופי באירוע זה: {totalScore} מתוך 10 נקודות!</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {totalScore === 10
                      ? 'ציון מושלם לפי מחוון משרד החינוך! אתם בדרך הבטוחה ל-100 בבגרות.'
                      : 'כל הכבוד על התרגול! שימו לב לשלבים שבהם ירדו נקודות ותקנו באירוע הבא.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={resetInteractive}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors text-xs flex items-center gap-1 font-bold"
                    title="אפס וענה מחדש"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>נסה שוב</span>
                  </button>
                  <button
                    onClick={nextQuestion}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition-colors text-xs flex items-center gap-1.5"
                  >
                    <span>לאירוע הבא</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* MODE 2: Freestyle Text Writing & Official Rubric Key */}
        {activeMode === 'freestyle' && (
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-800">
                כתבו את תשובתכם המלאה (הקפידו על שלושת השלבים: ציין, הצג, הסבר):
              </label>
              <textarea
                rows={6}
                value={freeTextAnswer}
                onChange={(e) => setFreeTextAnswer(e.target.value)}
                placeholder="ציין: הזכות / העיקרון המופיעים בקטע הם...
הצג: ההגדרה המלאה מתוך המונחון היא...
הסבר: בקטע נכתב: '...' וזה מדגים את המושג בכך ש..."
                className="w-full p-4 rounded-2xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-sm text-slate-900 leading-relaxed font-sans"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                טיפ משירה: השתמשו בציטוט מדויק במרכאות מתוך הקטע!
              </span>
              <button
                onClick={() => {
                  setShowRubricModel(true);
                  onAddXP(20);
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-sm transition-all text-xs sm:text-sm flex items-center gap-2"
              >
                <span>הצג מחוון בדיקה רשמי של משרד החינוך</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>

            {/* Official Rubric Revealed */}
            {showRubricModel && (
              <div className="mt-6 p-6 bg-slate-50 border-2 border-amber-300 rounded-3xl space-y-5 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="font-black text-amber-950 text-base flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-700" />
                    <span>מחוון רשמי ודגם תשובה של המפמ״ר</span>
                  </div>
                  <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-full">
                    סך הכל: {currentQ.moeRubric.totalPoints} נקודות
                  </span>
                </div>

                {/* Rubric Breakdown Checklist */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    הקריטריונים לחלוקת הניקוד:
                  </span>
                  {currentQ.moeRubric.breakdown.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-200 text-xs sm:text-sm">
                      <input type="checkbox" className="w-4 h-4 rounded text-amber-600 mt-0.5" />
                      <div className="flex-1">
                        <span className="font-extrabold text-slate-900 ml-1.5">{item.component} ({item.points} נק׳):</span>
                        <span className="text-slate-700">{item.requirement}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Official Model Answer */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    דגם תשובה מלאה (תשובת 100):
                  </span>
                  <div className="bg-white p-4 rounded-2xl border border-amber-200 text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed font-serif">
                    {currentQ.moeRubric.officialAnswerModel}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={nextQuestion}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-xs flex items-center gap-1.5"
                  >
                    <span>המשך לאירוע הבא</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
