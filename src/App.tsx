import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroWelcome } from './components/HeroWelcome';
import { CivicsHub } from './components/CivicsHub';
import { TsehesTrainer } from './components/TsehesTrainer';
import { FinancialHub } from './components/FinancialHub';
import { ExamSimulator } from './components/ExamSimulator';
import { QuestionBankExplorer } from './components/QuestionBankExplorer';
import { GlossaryModal } from './components/GlossaryModal';
import { UserProgressModal } from './components/UserProgressModal';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { SpeedDrillModal } from './components/SpeedDrillModal';
import { Footer } from './components/Footer';
import { getInitialStats, saveUserStats, unlockBadge } from './utils/storage';
import { UserStats } from './types';
import { ThemeProvider } from './utils/themeContext';

export function AppContent() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [userStats, setUserStats] = useState<UserStats>(getInitialStats);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [isProgressOpen, setIsProgressOpen] = useState<boolean>(false);
  const [isThemeOpen, setIsThemeOpen] = useState<boolean>(false);
  const [isSpeedDrillOpen, setIsSpeedDrillOpen] = useState<boolean>(false);

  // Sync to storage on userStats change
  useEffect(() => {
    saveUserStats(userStats);
  }, [userStats]);

  const handleAddXP = (amount: number) => {
    setUserStats((prev) => {
      const updated = { ...prev, xp: prev.xp + amount };
      if (updated.xp >= 300) {
        unlockBadge(updated, 'civics_pro');
      }
      return updated;
    });
  };

  const handleQuizCompleted = () => {
    setUserStats((prev) => {
      const updated = {
        ...prev,
        quizzesCompleted: prev.quizzesCompleted + 1
      };
      unlockBadge(updated, 'first_quiz');
      return updated;
    });
  };

  const handleTsehesCompleted = () => {
    setUserStats((prev) => {
      const updated = {
        ...prev,
        tsehesCompleted: prev.tsehesCompleted + 1
      };
      unlockBadge(updated, 'tsehes_master');
      return updated;
    });
  };

  const handleUpdateStudentName = (name: string) => {
    setUserStats((prev) => ({
      ...prev,
      studentName: name
    }));
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userStats={userStats}
        onOpenProgress={() => setIsProgressOpen(true)}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        onOpenThemeSelector={() => setIsThemeOpen(true)}
        onOpenSpeedDrill={() => setIsSpeedDrillOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {currentTab === 'home' && (
          <HeroWelcome
            onNavigate={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            userStats={userStats}
            onOpenGlossary={() => setIsGlossaryOpen(true)}
            onOpenThemeSelector={() => setIsThemeOpen(true)}
            onOpenSpeedDrill={() => setIsSpeedDrillOpen(true)}
            onAddXP={handleAddXP}
          />
        )}

        {currentTab === 'civics' && (
          <CivicsHub
            onAddXP={handleAddXP}
            onNavigateToTsehes={() => {
              setCurrentTab('tsehes');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'tsehes' && (
          <TsehesTrainer
            onAddXP={handleAddXP}
            onTsehesCompleted={handleTsehesCompleted}
          />
        )}

        {currentTab === 'finance' && (
          <FinancialHub onAddXP={handleAddXP} />
        )}

        {currentTab === 'bank' && (
          <QuestionBankExplorer 
            onAddXP={handleAddXP}
            onNavigateToSimulator={() => {
              setCurrentTab('exam');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'exam' && (
          <ExamSimulator
            onAddXP={handleAddXP}
            onQuizCompleted={handleQuizCompleted}
            studentName={userStats.studentName}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        onNavigate={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Modals */}
      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />

      <UserProgressModal
        isOpen={isProgressOpen}
        onClose={() => setIsProgressOpen(false)}
        userStats={userStats}
        onUpdateName={handleUpdateStudentName}
      />

      <ThemeSelectorModal
        isOpen={isThemeOpen}
        onClose={() => setIsThemeOpen(false)}
      />

      <SpeedDrillModal
        isOpen={isSpeedDrillOpen}
        onClose={() => setIsSpeedDrillOpen(false)}
        onAddXP={handleAddXP}
      />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
