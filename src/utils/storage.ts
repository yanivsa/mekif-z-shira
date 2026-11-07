import { UserStats, Badge } from '../types';

const STORAGE_KEY = 'mekif_z_shira_user_stats';

const DEFAULT_BADGES: Badge[] = [
  {
    id: 'first_quiz',
    title: 'צעד ראשון במקיף ז׳',
    description: 'סיימת בהצלחה את המבחן הראשון באתר!',
    icon: '🌟',
    unlocked: false
  },
  {
    id: 'tsehes_master',
    title: 'מאסטר צה״ס לבגרות',
    description: 'סיימת שאלת אירוע בבגרות עם מודל ציין-הצג-הסבר מלא!',
    icon: '🏆',
    unlocked: false
  },
  {
    id: 'labor_rights',
    title: 'מומחה שכר וזכויות נוער',
    description: 'הפגנת ידע מושלם בזכויות נוער עובד ושכר מינימום!',
    icon: '💼',
    unlocked: false
  },
  {
    id: 'streak_3',
    title: 'רצף של אלופים',
    description: 'התמדת 3 ימים ברצף של תרגול ולמידה!',
    icon: '🔥',
    unlocked: false
  },
  {
    id: 'civics_pro',
    title: 'אלוף הדמוקרטיה',
    description: 'צברת מעל 300 נקודות XP באזרחות!',
    icon: '⚖️',
    unlocked: false
  }
];

export function getInitialStats(): UserStats {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed: UserStats = JSON.parse(data);
      // Check streak
      const today = new Date().toISOString().slice(0, 10);
      if (parsed.lastActiveDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        if (parsed.lastActiveDate === yesterday) {
          // Keep streak
        } else if (parsed.lastActiveDate < yesterday) {
          // Streak broken
          parsed.streakDays = 1;
        }
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed reading user stats:', e);
  }

  return {
    studentName: 'תלמיד/ה יקר/ה',
    xp: 50,
    streakDays: 1,
    lastActiveDate: new Date().toISOString().slice(0, 10),
    quizzesCompleted: 0,
    tsehesCompleted: 0,
    correctAnswersCount: 0,
    totalAnswersCount: 0,
    badges: DEFAULT_BADGES
  };
}

export function saveUserStats(stats: UserStats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed saving user stats:', e);
  }
}

export function addXP(amount: number): UserStats {
  const stats = getInitialStats();
  stats.xp += amount;
  
  // Check badges
  if (stats.xp >= 300) {
    unlockBadge(stats, 'civics_pro');
  }

  saveUserStats(stats);
  return stats;
}

export function unlockBadge(stats: UserStats, badgeId: string): boolean {
  const badge = stats.badges.find(b => b.id === badgeId);
  if (badge && !badge.unlocked) {
    badge.unlocked = true;
    badge.unlockedAt = new Date().toLocaleDateString('he-IL');
    saveUserStats(stats);
    return true;
  }
  return false;
}
