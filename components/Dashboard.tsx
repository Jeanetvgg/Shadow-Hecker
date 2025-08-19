import React, { useState, useCallback } from 'react';
import { CasePanel } from './CasePanel';
import { IntrusionView } from './IntrusionView';
import { StatusPanel } from './StatusPanel';
import type { Case, SimulationResult } from '../types';
import { Difficulty } from '../types';
import { simulateHack } from '../services/geminiService';
import { CASES } from '../constants';

export const Dashboard = (): React.ReactNode => {
  const [selectedCase, setSelectedCase] = useState<Case | null>(CASES[0]);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.ROOKIE);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartSimulation = useCallback(async () => {
    if (!selectedCase) {
      setError("No case file selected. Operation aborted.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setSimulationResult(null);
    try {
      const result = await simulateHack(selectedCase, difficulty);
      setSimulationResult(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during the simulation.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedCase, difficulty]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-3" id="case-panel">
        <CasePanel selectedCase={selectedCase} onSelectCase={setSelectedCase} />
      </div>
      <div className="lg:col-span-6" id="intrusion-panel">
        <IntrusionView
          selectedCase={selectedCase}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          onStartSimulation={handleStartSimulation}
          isLoading={isLoading}
          error={error}
          result={simulationResult}
        />
      </div>
      <div className="lg:col-span-3" id="status-panel">
        <StatusPanel />
      </div>
    </div>
  );
};
