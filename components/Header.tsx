import React from 'react';

const TerminalIcon = (): React.ReactNode => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#00FF88]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
  </svg>
);

interface HeaderProps {
    onStartTutorial: () => void;
}

export const Header = ({ onStartTutorial }: HeaderProps): React.ReactNode => {
  return (
    <header className="p-4 border-b-2 border-[#8F00FF]/50 flex items-center justify-between bg-[#0B0B0B]/80 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <TerminalIcon />
        <div>
          <h1 className="text-3xl font-share-tech-mono text-glow-green">SHADOW HACKER</h1>
          <p className="text-sm text-[#00FF88]/80 font-mono">"The only hacker you want breaking in"</p>
        </div>
      </div>
      <button 
        onClick={onStartTutorial}
        className="font-share-tech-mono text-lg px-4 py-1 border border-[#00FF88] text-[#00FF88] hover:bg-[#00FF88]/10 transition-colors"
        aria-label="Start Tutorial"
      >
        HELP
      </button>
    </header>
  );
};
