import React from 'react';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';

interface SpeakerIconProps {
  textToSpeak: string;
}

export const SpeakerIcon = ({ textToSpeak }: SpeakerIconProps): React.ReactNode => {
  const { speak, cancel, isSpeaking, supported } = useSpeechSynthesis();

  if (!supported) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card clicks etc.
    if (isSpeaking) {
      cancel();
    } else {
      speak(textToSpeak);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`transition-colors ${isSpeaking ? 'text-[#00FF88]' : 'text-gray-500 hover:text-white'}`}
      aria-label={isSpeaking ? 'Stop reading text' : 'Read text aloud'}
    >
        {isSpeaking ? (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
        )}
    </button>
  );
};