
import React from 'react';

const ShieldIcon = (): React.ReactNode => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-[#8F00FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a11.955 11.955 0 019-2.606 11.955 11.955 0 019 2.606c.342-1.052.555-2.12.555-3.217a12.015 12.015 0 00-2.092-7.098z" />
  </svg>
);

const RankBar = ({ label, value, max }: {label: string, value: number, max: number}): React.ReactNode => {
    const percentage = (value / max) * 100;
    return (
        <div>
            <div className="flex justify-between items-center font-mono text-sm mb-1">
                <span>{label}</span>
                <span>{value} / {max}</span>
            </div>
            <div className="w-full bg-gray-700 h-4 border border-gray-600">
                <div className="bg-gradient-to-r from-[#8F00FF] to-[#00FF88] h-full" style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};


export const StatusPanel = (): React.ReactNode => {
  return (
    <div className="bg-[#1A1A1A] p-4 border-2 border-[#8F00FF]/30 h-full">
      <h2 className="font-share-tech-mono text-2xl mb-4 text-glow-violet">DEFENSE STATUS</h2>
      <div className="space-y-6">
        <div>
            <div className="flex items-center mb-2">
                <ShieldIcon />
                <h3 className="font-share-tech-mono text-xl text-gray-200">AGENT RANK</h3>
            </div>
            <p className="text-3xl font-mono text-center text-[#00FF88] py-2 border-y-2 border-[#00FF88]/30">
                Security Intern
            </p>
        </div>

        <div>
            <h3 className="font-share-tech-mono text-xl mb-3 text-gray-200">DEFENSE SCORE</h3>
            <div className="space-y-4">
                <RankBar label="Firewall Integrity" value={78} max={100} />
                <RankBar label="Auth Layer" value={65} max={100} />
                <RankBar label="Endpoint Security" value={85} max={100} />
            </div>
        </div>

        <div className="font-mono text-sm text-center text-gray-500 pt-4 border-t border-gray-700">
            Keep running simulations to improve your scores and rank up.
        </div>

      </div>
    </div>
  );
};
