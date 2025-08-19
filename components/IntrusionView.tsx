import React from 'react';
import type { Case, SimulationResult, Difficulty } from '../types';
import { DIFFICULTIES } from '../constants';
import { Spinner } from './common/Spinner';
import { SpeakerIcon } from './common/SpeakerIcon';

interface IntrusionViewProps {
  selectedCase: Case | null;
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onStartSimulation: () => void;
  isLoading: boolean;
  error: string | null;
  result: SimulationResult | null;
}

const Panel = ({ title, children, textToSpeak }: { title: string, children: React.ReactNode, textToSpeak?: string }): React.ReactNode => (
    <div className="bg-[#1A1A1A]/50 border border-[#8F00FF]/30 p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
            <h3 className="font-share-tech-mono text-xl text-glow-violet">{title}</h3>
            {textToSpeak && <SpeakerIcon textToSpeak={textToSpeak} />}
        </div>
        {children}
    </div>
);


export const IntrusionView = ({
  selectedCase,
  difficulty,
  onDifficultyChange,
  onStartSimulation,
  isLoading,
  error,
  result,
}: IntrusionViewProps): React.ReactNode => {
  return (
    <div className="bg-[#1A1A1A] p-4 border-2 border-[#8F00FF]/30 min-h-[600px] flex flex-col">
      <h2 className="font-share-tech-mono text-2xl mb-4 text-glow-violet">INTRUSION ANALYSIS</h2>
      
      {!result && !isLoading && (
        <div className="flex-grow flex flex-col justify-center items-center text-center p-4">
            <h3 className="font-share-tech-mono text-3xl text-gray-300">Awaiting Target Selection...</h3>
            <p className="text-gray-400 mt-2 font-mono">Select a case file and difficulty, then initiate the simulation.</p>
        </div>
      )}
      
      {selectedCase && !isLoading && !result &&(
         <div className="bg-black/20 p-6 border border-gray-700">
            <div className="flex justify-between items-start">
              <h3 className="font-share-tech-mono text-2xl text-[#00FF88]">{selectedCase.title}</h3>
              <SpeakerIcon textToSpeak={`${selectedCase.title}. ${selectedCase.description}`} />
            </div>
            <p className="text-gray-400 mt-2 mb-6">{selectedCase.description}</p>

            <div className="mb-6" id="difficulty-selector">
                <label className="block font-share-tech-mono text-lg text-gray-300 mb-2">DIFFICULTY LEVEL</label>
                <div className="flex gap-2">
                    {DIFFICULTIES.map(d => (
                        <button key={d} onClick={() => onDifficultyChange(d)} className={`flex-1 font-mono p-2 border transition-colors ${difficulty === d ? 'bg-[#8F00FF] text-white border-[#8F00FF]' : 'border-gray-600 hover:bg-white/5'}`}>{d}</button>
                    ))}
                </div>
            </div>

            <button id="initiate-simulation-btn" onClick={onStartSimulation} disabled={isLoading} className="w-full bg-[#00FF88] text-[#0B0B0B] font-share-tech-mono text-xl p-3 hover:bg-white transition-colors disabled:bg-gray-500 shadow-[0_0_15px_rgba(0,255,136,0.5)]">
                {isLoading ? 'SIMULATING...' : 'INITIATE SIMULATION'}
            </button>
        </div>
      )}

      {isLoading && (
        <div className="flex-grow flex flex-col items-center justify-center">
          <Spinner />
          <p className="mt-4 font-mono text-lg text-[#00FF88] animate-pulse">Reconstructing crime scene...</p>
        </div>
      )}
      
      {error && (
        <div className="flex-grow flex flex-col items-center justify-center bg-red-900/20 border border-red-500 p-4">
          <h3 className="font-share-tech-mono text-2xl text-red-400">SIMULATION FAILED</h3>
          <p className="font-mono text-red-300 mt-2">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-4 animate-[fadeIn_1s_ease-in-out]">
          <Panel title="INCOMING TRANSMISSION" textToSpeak={`Subject: ${result.subject}. ${result.narrative}`}>
            <p className="font-mono text-lg mb-2">Subject: {result.subject}</p>
            <p className="font-vt323 text-2xl leading-relaxed text-green-300 whitespace-pre-wrap">{result.narrative}</p>
          </Panel>
          <Panel title="FORENSICS LAB">
             <div className="space-y-3 font-mono text-gray-300">
                <p><strong className="text-[#8F00FF]">Entry Point:</strong> {result.forensicsReport.entryPoint}</p>
                <p><strong className="text-[#8F00FF]">Data Targeted:</strong> {result.forensicsReport.dataTargeted}</p>
                <p><strong className="text-[#8F00FF]">How it was Stopped:</strong> {result.forensicsReport.howItWasStopped}</p>
                <div>
                  <strong className="text-[#00FF88]">Attack Timeline:</strong>
                  <ul className="list-disc list-inside pl-4 text-green-400">
                      {result.forensicsReport.attackTimeline.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <strong className="text-[#00FF88]">Suggested Fixes:</strong>
                  <ul className="list-disc list-inside pl-4 text-green-400">
                      {result.forensicsReport.suggestedFixes.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
             </div>
          </Panel>
        </div>
      )}
    </div>
  );
};
