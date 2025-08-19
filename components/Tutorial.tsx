import React, { useState, useLayoutEffect, useRef } from 'react';
import type { TutorialStep } from '../types';

interface TutorialProps {
  step: TutorialStep;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const HIGHLIGHT_PADDING = 10;
const SCREEN_EDGE_PADDING = 15; // Padding from the edge of the screen

export const Tutorial = ({ step, onNext, onPrev, onSkip, isFirst, isLast }: TutorialProps): React.ReactNode => {
  const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({});
  const [modalStyle, setModalStyle] = useState<React.CSSProperties>({});
  const modalRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const modalElement = modalRef.current;
    
    // Handle the centered case for 'body' or explicit 'center' position
    if (step.elementSelector === 'body' || step.position === 'center' || !modalElement) {
        setHighlightStyle({ display: 'none' });
        setModalStyle({
            opacity: 1,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
        });
        return;
    }

    const element = document.querySelector<HTMLElement>(step.elementSelector);
    if (element) {
      const targetRect = element.getBoundingClientRect();
      const modalRect = modalElement.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      const newHighlightStyle = {
        width: `${targetRect.width + HIGHLIGHT_PADDING * 2}px`,
        height: `${targetRect.height + HIGHLIGHT_PADDING * 2}px`,
        top: `${targetRect.top - HIGHLIGHT_PADDING}px`,
        left: `${targetRect.left - HIGHLIGHT_PADDING}px`,
      };
      setHighlightStyle(newHighlightStyle);

      let top = 0, left = 0;

      // Calculate initial desired position based on step config
      switch(step.position) {
          case 'right':
              top = targetRect.top;
              left = targetRect.right + HIGHLIGHT_PADDING + 10;
              break;
          case 'left':
              top = targetRect.top;
              left = targetRect.left - modalRect.width - HIGHLIGHT_PADDING - 10;
              break;
          case 'bottom':
              top = targetRect.bottom + HIGHLIGHT_PADDING + 10;
              left = targetRect.left;
              break;
          case 'top':
              top = targetRect.top - modalRect.height - HIGHLIGHT_PADDING - 10;
              left = targetRect.left;
              break;
          default:
              top = targetRect.bottom + HIGHLIGHT_PADDING + 10;
              left = targetRect.left;
              break;
      }

      // Clamp values to stay within the viewport
      if (left < SCREEN_EDGE_PADDING) {
          left = SCREEN_EDGE_PADDING;
      }
      if (left + modalRect.width > viewportWidth - SCREEN_EDGE_PADDING) {
          left = viewportWidth - modalRect.width - SCREEN_EDGE_PADDING;
      }
      if (top < SCREEN_EDGE_PADDING) {
          top = SCREEN_EDGE_PADDING;
      }
      if (top + modalRect.height > viewportHeight - SCREEN_EDGE_PADDING) {
          top = viewportHeight - modalRect.height - SCREEN_EDGE_PADDING;
      }

      setModalStyle({
        opacity: 1,
        top: `${top}px`,
        left: `${left}px`,
        transform: 'none', // Remove any transform used for centering
      });
    }
  }, [step]);

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

      {/* Highlight */}
      <div
        className="absolute border-2 border-[#00FF88] shadow-[0_0_20px_rgba(0,255,136,0.8)] transition-all duration-500 ease-in-out"
        style={highlightStyle}
      ></div>

      {/* Modal */}
      <div 
        ref={modalRef} 
        className="absolute p-4 bg-[#1A1A1A] border-2 border-[#8F00FF] text-white animate-[fadeIn_0.5s_ease-in-out]" 
        style={{...modalStyle, maxWidth: '350px', opacity: modalStyle.opacity ?? 0}}
      >
        <h3 className="font-share-tech-mono text-2xl mb-2 text-glow-violet">{step.title}</h3>
        <p className="font-mono text-gray-300 mb-4">{step.content}</p>
        <div className="flex justify-between items-center">
            <button onClick={onSkip} className="font-mono text-gray-500 hover:text-red-400">SKIP</button>
            <div className="flex gap-2">
                {!isFirst && <button onClick={onPrev} className="font-share-tech-mono text-lg px-4 py-1 border border-[#8F00FF] hover:bg-[#8F00FF]/20">PREV</button>}
                <button onClick={onNext} className="font-share-tech-mono text-lg px-4 py-1 bg-[#00FF88] text-black border border-[#00FF88] hover:bg-white">{isLast ? 'FINISH' : 'NEXT'}</button>
            </div>
        </div>
      </div>
    </div>
  );
};
