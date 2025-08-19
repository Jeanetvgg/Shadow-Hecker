import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { TrainingArena } from './components/TrainingArena';
import { ThreatIntel } from './components/ThreatIntel';
import { Tutorial } from './components/Tutorial';
import { View } from './types';
import { TUTORIAL_STEPS } from './constants';

function App(): React.ReactNode {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isTutorialActive, setTutorialActive] = useState(false);
  const [tutorialStepIndex, setTutorialStepIndex] = useState(0);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('shadowHackerTutorialSeen');
    if (!hasSeenTutorial) {
      setTutorialActive(true);
    }
  }, []);

  const startTutorial = () => {
    setTutorialStepIndex(0);
    setTutorialActive(true);
  };

  const handleTutorialNext = () => {
    if (tutorialStepIndex < TUTORIAL_STEPS.length - 1) {
      setTutorialStepIndex(prev => prev + 1);
    } else {
      endTutorial();
    }
  };

  const handleTutorialPrev = () => {
    if (tutorialStepIndex > 0) {
      setTutorialStepIndex(prev => prev - 1);
    }
  };

  const endTutorial = () => {
    setTutorialActive(false);
    localStorage.setItem('shadowHackerTutorialSeen', 'true');
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-gray-200 antialiased relative">
      <div className="scan-line-overlay"></div>
       {isTutorialActive && (
        <Tutorial
          step={TUTORIAL_STEPS[tutorialStepIndex]}
          onNext={handleTutorialNext}
          onPrev={handleTutorialPrev}
          onSkip={endTutorial}
          isFirst={tutorialStepIndex === 0}
          isLast={tutorialStepIndex === TUTORIAL_STEPS.length - 1}
        />
      )}
      <div className="relative z-10">
        <Header onStartTutorial={startTutorial} />
        <main className="p-4 sm:p-6 lg:p-8">
          <nav className="mb-6 flex justify-center flex-wrap gap-4">
            <button
              id="dashboard-btn"
              onClick={() => setCurrentView(View.DASHBOARD)}
              className={`font-share-tech-mono text-lg px-6 py-2 border-2 transition-all duration-300 ${
                currentView === View.DASHBOARD
                  ? 'bg-[#00FF88] text-[#0B0B0B] border-[#00FF88] shadow-[0_0_15px_rgba(0,255,136,0.8)]'
                  : 'border-[#00FF88] text-[#00FF88] hover:bg-[#00FF88]/10'
              }`}
            >
              HACKER_DASHBOARD
            </button>
            <button
              id="training-arena-btn"
              onClick={() => setCurrentView(View.TRAINING)}
              className={`font-share-tech-mono text-lg px-6 py-2 border-2 transition-all duration-300 ${
                currentView === View.TRAINING
                  ? 'bg-[#8F00FF] text-white border-[#8F00FF] shadow-[0_0_15px_rgba(143,0,255,0.8)]'
                  : 'border-[#8F00FF] text-[#8F00FF] hover:bg-[#8F00FF]/10'
              }`}
            >
              TRAINING_ARENA
            </button>
             <button
              id="threat-intel-btn"
              onClick={() => setCurrentView(View.THREAT_INTEL)}
              className={`font-share-tech-mono text-lg px-6 py-2 border-2 transition-all duration-300 ${
                currentView === View.THREAT_INTEL
                  ? 'bg-[#8F00FF] text-white border-[#8F00FF] shadow-[0_0_15px_rgba(143,0,255,0.8)]'
                  : 'border-[#8F00FF] text-[#8F00FF] hover:bg-[#8F00FF]/10'
              }`}
            >
              THREAT_INTEL
            </button>
          </nav>

          {currentView === View.DASHBOARD && <Dashboard />}
          {currentView === View.TRAINING && <TrainingArena />}
          {currentView === View.THREAT_INTEL && <ThreatIntel />}
        </main>
      </div>
    </div>
  );
}

export default App;