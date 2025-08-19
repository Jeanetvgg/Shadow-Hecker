import React, { useState, useEffect, useCallback } from 'react';
import { generatePhishingEmails } from '../services/geminiService';
import type { PhishingEmail } from '../types';
import { Spinner } from './common/Spinner';
import { SpeakerIcon } from './common/SpeakerIcon';

const EmailCard = ({ email, onSelect, isSelected, showResult, isCorrect }: { email: PhishingEmail, onSelect: () => void, isSelected: boolean, showResult: boolean, isCorrect: boolean }): React.ReactNode => {
    
    const getBorderColor = (): string => {
        if (!showResult) {
            return isSelected ? 'border-[#8F00FF]' : 'border-gray-700 hover:border-[#00FF88]';
        }
        if (isCorrect) {
            return 'border-green-500';
        }
        return 'border-red-500';
    };
    
    const fullEmailText = `From: ${email.from}. Subject: ${email.subject}. Body: ${email.body}`;

    return (
        <div className={`p-4 border-2 bg-[#1A1A1A] transition-colors ${getBorderColor()}`}>
             <div className="flex justify-between items-baseline mb-1">
                <p className="font-mono text-gray-300"><strong>From:</strong> {email.from}</p>
                <div className="flex items-center gap-4">
                    {showResult && (
                        <span className={`font-share-tech-mono text-lg ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                            {isCorrect ? (email.isPhishing ? 'PHISHING (Correct)' : 'LEGITIMATE (Correct)') : (email.isPhishing ? 'PHISHING (Incorrect)' : 'LEGITIMATE (Incorrect)')}
                        </span>
                    )}
                    <SpeakerIcon textToSpeak={fullEmailText} />
                </div>
            </div>
            <p className="font-mono text-gray-400"><strong>Subject:</strong> {email.subject}</p>
            <hr className="border-gray-600 my-2"/>
            <p className="whitespace-pre-wrap font-sans text-gray-400 cursor-pointer" onClick={onSelect}>{email.body}</p>
        </div>
    );
};


export const TrainingArena = (): React.ReactNode => {
  const [emails, setEmails] = useState<PhishingEmail[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmailIndex, setSelectedEmailIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);

  const fetchEmails = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setShowResult(false);
    setSelectedEmailIndex(null);
    try {
      const newEmails = await generatePhishingEmails();
      setEmails(newEmails);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckAnswer = (): void => {
      if (selectedEmailIndex === null) return;
      setShowResult(true);
  }

  return (
    <div className="max-w-4xl mx-auto bg-[#1A1A1A] p-6 border-2 border-[#8F00FF]/30">
      <h2 className="font-share-tech-mono text-3xl mb-2 text-glow-violet">TRAINING: SPOT THE PHISHING</h2>
      <p className="text-gray-400 mb-6 font-mono">Shadow Hacker has intercepted three emails. One is a malicious phishing attempt. Identify it.</p>
      
      {isLoading && (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
              <Spinner />
              <p className="mt-4 font-mono text-lg text-[#00FF88]">Generating puzzle...</p>
          </div>
      )}

      {error && <p className="text-red-400 text-center font-mono">{error}</p>}
      
      {!isLoading && !error && (
        <div className="space-y-4">
            {emails.map((email, index) => (
                <EmailCard 
                    key={index} 
                    email={email}
                    onSelect={() => !showResult && setSelectedEmailIndex(index)}
                    isSelected={selectedEmailIndex === index}
                    showResult={showResult}
                    isCorrect={showResult && selectedEmailIndex !== null && emails[selectedEmailIndex].isPhishing}
                />
            ))}
        </div>
      )}

      <div className="mt-6 flex gap-4">
        <button 
            onClick={handleCheckAnswer}
            disabled={selectedEmailIndex === null || showResult || isLoading}
            className="flex-1 bg-[#8F00FF] text-white font-share-tech-mono text-xl p-3 hover:bg-[#a02cff] transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
            CHECK ANSWER
        </button>
        <button 
            onClick={fetchEmails}
            disabled={isLoading}
            className="flex-1 bg-[#00FF88] text-[#0B0B0B] font-share-tech-mono text-xl p-3 hover:bg-white transition-colors disabled:bg-gray-600">
            {isLoading ? 'GENERATING...' : 'NEW PUZZLE'}
        </button>
      </div>

      {showResult && selectedEmailIndex !== null && (
          <div className={`mt-4 p-4 text-center font-share-tech-mono text-2xl ${emails[selectedEmailIndex].isPhishing ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
              {emails[selectedEmailIndex].isPhishing ? 'CORRECT! Malicious Email Identified.' : 'INCORRECT. That was a legitimate email.'}
          </div>
      )}

    </div>
  );
};
