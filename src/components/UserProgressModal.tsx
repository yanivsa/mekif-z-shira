import React, { useState } from 'react';
import { X, Award, Flame, CheckCircle, Trophy, Edit2, Check } from 'lucide-react';
import { UserStats } from '../types';

interface UserProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  userStats: UserStats;
  onUpdateName: (name: string) => void;
}

export const UserProgressModal: React.FC<UserProgressModalProps> = ({
  isOpen,
  onClose,
  userStats,
  onUpdateName
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(userStats.studentName);

  if (!isOpen) return null;

  const handleSaveName = () => {
    if (nameInput.trim()) {
      onUpdateName(nameInput.trim());
      setIsEditing(false);
    }
  };

  const unlockedCount = userStats.badges.filter(b => b.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-brand-600 to-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
              🎓
            </div>
            <div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="bg-white text-slate-900 px-2 py-0.5 rounded text-sm font-bold w-36 outline-none"
                    />
                    <button onClick={handleSaveName} className="p-1 hover:bg-white/20 rounded">
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-lg font-black">{userStats.studentName}</h2>
                    <button 
                      onClick={() => setIsEditing(true)} 
                      className="text-white/70 hover:text-white p-0.5"
                      title="ערוך שם"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs text-brand-100 font-medium">תלמיד/ה בתיכון מקיף ז׳</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500 mx-auto mb-1" />
              <div className="text-xl font-black text-amber-900">{userStats.streakDays}</div>
              <div className="text-[11px] text-amber-700 font-bold">רצף ימים</div>
            </div>

            <div className="p-3 bg-brand-50 rounded-2xl border border-brand-200">
              <Award className="w-5 h-5 text-brand-600 mx-auto mb-1" />
              <div className="text-xl font-black text-brand-900">{userStats.xp}</div>
              <div className="text-[11px] text-brand-700 font-bold">נקודות XP</div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
              <Trophy className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <div className="text-xl font-black text-emerald-900">{unlockedCount} / {userStats.badges.length}</div>
              <div className="text-[11px] text-emerald-700 font-bold">תגים שנפתחו</div>
            </div>
          </div>

          {/* Badges Collection */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-900">תגי ההישגים שלי:</h3>
            <div className="space-y-2.5 max-h-56 overflow-y-auto">
              {userStats.badges.map((b) => (
                <div
                  key={b.id}
                  className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                    b.unlocked
                      ? 'bg-amber-50/70 border-amber-300'
                      : 'bg-slate-50 border-slate-200 opacity-50 grayscale'
                  }`}
                >
                  <span className="text-2xl shrink-0">{b.icon}</span>
                  <div className="flex-1">
                    <div className="font-extrabold text-xs sm:text-sm text-slate-900">
                      {b.title}
                    </div>
                    <div className="text-[11px] text-slate-600">
                      {b.description}
                    </div>
                  </div>
                  {b.unlocked && (
                    <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full shrink-0">
                      נפתח! ✓
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-center text-xs text-slate-400">
            ההתקדמות שלך נשמרת אוטומטית בדפדפן זה 💾
          </div>
        </div>

      </div>
    </div>
  );
};
