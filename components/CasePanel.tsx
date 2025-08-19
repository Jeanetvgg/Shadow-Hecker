
import React from 'react';
import { CASES } from '../constants';
import type { Case } from '../types';

interface CasePanelProps {
  selectedCase: Case | null;
  onSelectCase: (caseFile: Case) => void;
}

const FolderIcon = (): React.ReactNode => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-[#00FF88]/70 group-hover:text-[#00FF88] transition-colors" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
  </svg>
);

export const CasePanel = ({ selectedCase, onSelectCase }: CasePanelProps): React.ReactNode => {
  return (
    <div className="bg-[#1A1A1A] p-4 border-2 border-[#00FF88]/30 h-full">
      <h2 className="font-share-tech-mono text-2xl mb-4 text-glow-green">CASE FILES</h2>
      <div className="space-y-2">
        {CASES.map((caseFile) => (
          <button
            key={caseFile.id}
            onClick={() => onSelectCase(caseFile)}
            className={`w-full text-left p-3 flex items-center group transition-all duration-200 ${
              selectedCase?.id === caseFile.id
                ? 'bg-[#00FF88]/20 text-white'
                : 'bg-transparent text-gray-400 hover:bg-[#00FF88]/10 hover:text-white'
            }`}
          >
            <FolderIcon />
            <span className="font-mono">{caseFile.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
