// src/types/themes.ts

export type ThemeId = 
  | 'classic'
  | 'gaming'
  | 'social'
  | 'soccer'
  | 'basketball'
  | 'scifi'
  | 'swimming'
  | 'gymnastics';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  tagline: string;
  icon: string;
  category: 'sports' | 'digital' | 'lifestyle' | 'classic';
  previewBg: string;
  previewAccent: string;
  bodyBg: string;
  bannerGradient: string;
  cardBg: string;
  cardBorder: string;
  accentBtn: string;
  accentText: string;
  shiraTitle: string;
  shiraVibe: string;
  shiraAvatar: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  classic: {
    id: 'classic',
    name: 'המרחב הקלאסי',
    tagline: 'גאוות מקיף ז׳ • רגוע וממוקד',
    icon: '🎓',
    category: 'classic',
    previewBg: 'bg-slate-900',
    previewAccent: 'bg-sky-500',
    bodyBg: 'bg-slate-50',
    bannerGradient: 'from-brand-900 via-indigo-950 to-slate-900',
    cardBg: 'bg-white',
    cardBorder: 'border-slate-200',
    accentBtn: 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white',
    accentText: 'text-brand-600',
    shiraTitle: 'רכזת אזרחות וחינוך פיננסי',
    shiraVibe: 'היי תלמידים יקרים! ברוכים הבאים למרחב הלימודי של תיכון מקיף ז׳.',
    shiraAvatar: '👩‍🏫'
  },

  gaming: {
    id: 'gaming',
    name: 'סייבר גיימינג',
    tagline: 'RGB Dark Mode • גילדת הבגרות',
    icon: '🎮',
    category: 'digital',
    previewBg: 'bg-zinc-950',
    previewAccent: 'bg-purple-500',
    bodyBg: 'bg-zinc-950 text-zinc-100',
    bannerGradient: 'from-purple-950 via-zinc-900 to-cyan-950',
    cardBg: 'bg-zinc-900/90 text-zinc-100',
    cardBorder: 'border-purple-500/40 shadow-lg shadow-purple-500/10',
    accentBtn: 'bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white shadow-md shadow-purple-500/30',
    accentText: 'text-cyan-400',
    shiraTitle: 'מאסטרית הגילדה • Level 99',
    shiraVibe: 'ברוכים הבאים לרייד של שאלון 034281! כאן מפרקים שאלות אירוע וצוברים XP מטורף!',
    shiraAvatar: '🥷'
  },

  social: {
    id: 'social',
    name: 'סושיאל פופ',
    tagline: 'טיקטוק ואינסטה • וייב סאנסט זוהר',
    icon: '📱',
    category: 'lifestyle',
    previewBg: 'bg-gradient-to-r from-pink-500 to-amber-500',
    previewAccent: 'bg-yellow-400',
    bodyBg: 'bg-rose-50/50',
    bannerGradient: 'from-rose-600 via-fuchsia-600 to-amber-500',
    cardBg: 'bg-white/90 backdrop-blur-md',
    cardBorder: 'border-pink-200 shadow-lg shadow-pink-500/10',
    accentBtn: 'bg-gradient-to-r from-pink-500 to-amber-500 text-white shadow-md shadow-pink-500/25',
    accentText: 'text-pink-600',
    shiraTitle: 'יוצרת תוכן • 100K עוקבים בבגרות',
    shiraVibe: 'מה קורה כולם! היום עושים סטורי מנצח על דיני עבודה ושורפים את הבגרות באזרחות!',
    shiraAvatar: '💅'
  },

  soccer: {
    id: 'soccer',
    name: 'ליגת האלופות',
    tagline: 'אצטדיון כדורגל • מניפים גביע בבגרות',
    icon: '⚽️',
    category: 'sports',
    previewBg: 'bg-emerald-950',
    previewAccent: 'bg-emerald-500',
    bodyBg: 'bg-emerald-50/40',
    bannerGradient: 'from-emerald-950 via-teal-900 to-green-900',
    cardBg: 'bg-white',
    cardBorder: 'border-emerald-300 shadow-md shadow-emerald-500/10',
    accentBtn: 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/25',
    accentText: 'text-emerald-700',
    shiraTitle: 'מאמנת ראשית • מועדון מקיף ז׳',
    shiraVibe: 'עולים למגרש בשיא הרעב! המטרה שלנו: דאבל באזרחות ובפיננסים בלי לספוג שום שגיאה!',
    shiraAvatar: '🏆'
  },

  basketball: {
    id: 'basketball',
    name: 'סטריטבול והופס',
    tagline: 'כדורסל רחוב • סל ניצחון בשנייה האחרונה',
    icon: '🏀',
    category: 'sports',
    previewBg: 'bg-stone-900',
    previewAccent: 'bg-orange-500',
    bodyBg: 'bg-stone-50',
    bannerGradient: 'from-stone-950 via-orange-950 to-neutral-900',
    cardBg: 'bg-white',
    cardBorder: 'border-orange-300 shadow-md shadow-orange-500/10',
    accentBtn: 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-600/25',
    accentText: 'text-orange-600',
    shiraTitle: 'הקפטנית • MVP בגרות',
    shiraVibe: 'לוקחים את הכדור לסל! דילמות שלטון החוק קטנות עלינו – שמים שלשה בכל מבחן!',
    shiraAvatar: '⚡️'
  },

  scifi: {
    id: 'scifi',
    name: 'עתידני וחלל',
    tagline: 'סיי-פיי הולוגרפי • הדמוקרטיה של שנת 2099',
    icon: '🚀',
    category: 'digital',
    previewBg: 'bg-slate-950',
    previewAccent: 'bg-cyan-400',
    bodyBg: 'bg-slate-950 text-slate-100',
    bannerGradient: 'from-blue-950 via-indigo-950 to-cyan-950',
    cardBg: 'bg-slate-900/90 text-slate-100',
    cardBorder: 'border-cyan-500/40 shadow-lg shadow-cyan-500/10',
    accentBtn: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30',
    accentText: 'text-cyan-400',
    shiraTitle: 'מפקדת תחנת המחקר האזרחית',
    shiraVibe: 'מערכות הניווט החוקתיות פועלות בעוצמה מלאה. מוכנים לשיגור לעבר ציון 100!',
    shiraAvatar: '🤖'
  },

  swimming: {
    id: 'swimming',
    name: 'שחייה ואוקיינוס',
    tagline: 'טורקיז אולימפי • צוללים לעומק המושגים',
    icon: '🏊',
    category: 'sports',
    previewBg: 'bg-cyan-950',
    previewAccent: 'bg-cyan-400',
    bodyBg: 'bg-sky-50/50',
    bannerGradient: 'from-cyan-900 via-sky-900 to-blue-950',
    cardBg: 'bg-white',
    cardBorder: 'border-cyan-200 shadow-md shadow-cyan-500/10',
    accentBtn: 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/25',
    accentText: 'text-cyan-700',
    shiraTitle: 'מאמנת הנבחרת האולימפית',
    shiraVibe: 'צוללים לתוך מחווני הבגרות בקור רוח! שוחים ישר לעבר מדליית זהב כיתתית!',
    shiraAvatar: '🌊'
  },

  gymnastics: {
    id: 'gymnastics',
    name: 'התעמלות ואתלטיקה',
    tagline: 'אלגנטיות וגמישות • דיוק מושלם של 10.0',
    icon: '🤸',
    category: 'sports',
    previewBg: 'bg-purple-950',
    previewAccent: 'bg-fuchsia-400',
    bodyBg: 'bg-purple-50/40',
    bannerGradient: 'from-purple-950 via-fuchsia-950 to-indigo-950',
    cardBg: 'bg-white',
    cardBorder: 'border-fuchsia-200 shadow-md shadow-fuchsia-500/10',
    accentBtn: 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-md shadow-fuchsia-500/25',
    accentText: 'text-fuchsia-700',
    shiraTitle: 'שופטת בינלאומית • ציון 10.0',
    shiraVibe: 'בדיוק כמו בתרגיל קרקע מושלם – תשובת צה״ס מנצחת דורשת דיוק, גמישות מחשבתית ונחיתה יציבה!',
    shiraAvatar: '✨'
  }
};
