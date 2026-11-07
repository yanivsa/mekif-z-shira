// src/components/ThemeSelectorModal.tsx
import React from 'react';
import { X, Check, Sparkles, Volume2, Gamepad2, Trophy, Smartphone, Rocket } from 'lucide-react';
import { useTheme } from '../utils/themeContext';
import { THEMES, ThemeId } from '../types/themes';
import { sound } from '../utils/soundEngine';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({ isOpen, onClose }) => {
  const { currentThemeId, setTheme, theme: activeTheme } = useTheme();

  if (!isOpen) return null;

  const themesList = Object.values(THEMES);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 text-white flex items-center justify-center text-2xl shadow-md">
              🎨
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                בחר את הסטייל שלך באתר
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                עיצוב אישי, אווירה וצלילים המותאמים בדיוק למה שאתה אוהב!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Themes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {themesList.map((t) => {
            const isSelected = currentThemeId === t.id;

            return (
              <div
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  sound.playStreak();
                }}
                className={`group relative rounded-2xl p-4 border-2 transition-all cursor-pointer flex flex-col justify-between overflow-hidden ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50/40 ring-4 ring-brand-500/20 shadow-md scale-[1.02]'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-xs'
                }`}
              >
                {/* Active Selection Badge */}
                {isSelected && (
                  <div className="absolute top-3 left-3 bg-brand-600 text-white p-1 rounded-full shadow-xs">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-xs">
                      {t.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-base text-slate-900">{t.name}</span>
                        {isSelected && (
                          <span className="text-[10px] bg-brand-600 text-white font-extrabold px-2 py-0.5 rounded-full">
                            פעיל
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium">{t.tagline}</p>
                    </div>
                  </div>

                  {/* Shira's mood preview */}
                  <div className="bg-slate-100/80 rounded-xl p-2.5 text-[11px] text-slate-700 leading-snug flex items-start gap-2">
                    <span className="text-base">{t.shiraAvatar}</span>
                    <span className="italic">"{t.shiraVibe.slice(0, 75)}..."</span>
                  </div>
                </div>

                {/* Bottom preview bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-4 h-4 rounded-full ${t.previewBg} border border-slate-300`} />
                    <div className={`w-4 h-4 rounded-full ${t.previewAccent}`} />
                    <span className="text-[10px] text-slate-400 font-semibold mr-1">ערכת צבעים</span>
                  </div>

                  <span className={`text-xs font-black ${isSelected ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-700'}`}>
                    {isSelected ? 'נבחר ✓' : 'הפעל סטייל ➔'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="pt-2 text-center text-xs text-slate-400 font-medium">
          העיצוב הנבחר נשמר אוטומטית במכשיר שלך ומשנה את כל צבעי האתר, הכרטיסיות והצלילים!
        </div>

      </div>
    </div>
  );
};
