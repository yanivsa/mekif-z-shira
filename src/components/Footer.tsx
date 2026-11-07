import React from 'react';
import { Heart, BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenGlossary: () => void;
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenGlossary, onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: About the site */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white font-black text-xl">
                ז׳
              </div>
              <div>
                <span className="font-extrabold text-lg text-white">המרחב של שירה</span>
                <span className="block text-xs text-brand-300">תיכון מקיף ז׳ • אזרחות וחינוך פיננסי</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              פלטפורמת תרגול, הכנה לבגרות והקניית ידע מעשי בחינוך פיננסי עבור תלמידי ותלמידות תיכון מקיף ז׳. מבוסס על תוכניות הלימודים של משרד החינוך, מחווני מפמ״ר אזרחות ומשימות ראמ״ה.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2.5">
            <span className="font-bold text-white text-sm block">ניווט מהיר</span>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                  דף הבית של שירה
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('civics')} className="hover:text-white transition-colors">
                  מרחב אזרחות (חט״ב וחט״ע)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tsehes')} className="hover:text-amber-300 transition-colors">
                  מאמן צה״ס לבגרות (שאלון 034281)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('finance')} className="hover:text-emerald-300 transition-colors">
                  חינוך פיננסי וזכויות נוער
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('exam')} className="hover:text-white transition-colors">
                  סימולציית מבחן כיתתי
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Ministry Resources */}
          <div className="space-y-2.5">
            <span className="font-bold text-white text-sm block">מקורות רשמיים</span>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <a
                  href="https://pop.education.gov.il/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>פורטל עובדי הוראה - משרד החינוך</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.rama.education.gov.il/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>ראמ״ה (הרשות למדידה והערכה)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.kolzchut.org.il/he/%D7%A2%D7%91%D7%95%D7%93%D7%AA_%D7%A0%D7%95%D7%A2%D7%A8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>כל זכות - זכויות נוער עובד</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.boi.org.il/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>בנק ישראל - אוריינות פיננסית</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <span>נבנה באהבה עבור תלמידי תיכון מקיף ז׳ והמורה שירה</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
          <div>
            <span>© {new Date().getFullYear()} כל הזכויות שמורות למטרות חינוכיות בלבד</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
