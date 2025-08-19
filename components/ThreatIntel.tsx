import React, { useState, useCallback } from 'react';
import { analyzeInfrastructureDocument } from '../services/geminiService';
import type { Threat, ThreatAnalysisResult, ThreatSeverity } from '../types';
import { Spinner } from './common/Spinner';
import { readFileAsText } from '../utils/fileReader';

const UploadIcon = (): React.ReactNode => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const SeverityBadge = ({ severity }: { severity: ThreatSeverity }): React.ReactNode => {
    const severityStyles: Record<ThreatSeverity, string> = {
        'Critical': 'bg-red-900/50 text-red-300 border-red-500 text-glow-red',
        'High': 'bg-violet-900/50 text-violet-300 border-violet-500 text-glow-violet',
        'Medium': 'bg-yellow-900/50 text-yellow-300 border-yellow-500',
        'Low': 'bg-sky-900/50 text-sky-300 border-sky-500',
    };
    return (
        <span className={`px-3 py-1 font-share-tech-mono text-lg border ${severityStyles[severity] || 'bg-gray-700 text-gray-300 border-gray-500'}`}>
            {severity.toUpperCase()}
        </span>
    );
};

const ThreatCard = ({ threat }: { threat: Threat }): React.ReactNode => (
    <div className="bg-[#1A1A1A]/60 border border-[#8F00FF]/20 p-4 animate-[fadeIn_0.5s_ease-in-out]">
        <div className="flex justify-between items-start gap-4 mb-2">
            <h3 className="font-share-tech-mono text-2xl text-glow-green">{threat.title}</h3>
            <SeverityBadge severity={threat.severity} />
        </div>
        <div className="font-mono space-y-3 text-gray-300">
            <p><strong className="text-[#8F00FF]">Description:</strong> {threat.description}</p>
            <p><strong className="text-[#00FF88]">Recommendation:</strong> {threat.recommendation}</p>
        </div>
    </div>
);


export const ThreatIntel = (): React.ReactNode => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<ThreatAnalysisResult | null>(null);

    const handleFileChange = (selectedFile: File | null) => {
        if (!selectedFile) return;

        if (selectedFile.size > 1024 * 1024) { // 1MB limit
            setError("File is too large. Please upload a file smaller than 1MB.");
            return;
        }
        
        setFile(selectedFile);
        setError(null);
        setAnalysisResult(null);
        handleAnalysis(selectedFile);
    };
    
    const handleAnalysis = useCallback(async (fileToAnalyze: File) => {
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const fileContent = await readFileAsText(fileToAnalyze);
            if (!fileContent.trim()) {
                setError("File is empty or contains no readable text.");
                setIsLoading(false);
                return;
            }
            const result = await analyzeInfrastructureDocument(fileContent);
            setAnalysisResult(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred during analysis.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleReset = () => {
        setFile(null);
        setAnalysisResult(null);
        setError(null);
    };

    return (
        <div className="max-w-5xl mx-auto bg-[#1A1A1A] p-6 border-2 border-[#8F00FF]/30">
            <h2 className="font-share-tech-mono text-3xl mb-2 text-glow-violet">THREAT INTEL ANALYSIS</h2>
            <p className="text-gray-400 mb-6 font-mono">Upload your IT infrastructure or security policy documents (.txt, .md, .json) to identify potential threats.</p>

            {analysisResult ? (
                <div>
                    <div className="flex justify-between items-center bg-black/30 p-3 mb-4">
                       <h3 className="font-mono text-lg text-gray-300">Analysis for: <span className="text-[#00FF88]">{file?.name}</span></h3>
                       <button onClick={handleReset} className="font-share-tech-mono text-lg px-4 py-1 border border-[#00FF88] text-[#00FF88] hover:bg-[#00FF88]/10 transition-colors">ANALYZE NEW FILE</button>
                    </div>
                     {analysisResult.length > 0 ? (
                        <div className="space-y-4">
                            {analysisResult.map((threat, index) => <ThreatCard key={index} threat={threat} />)}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <h3 className="font-share-tech-mono text-2xl text-gray-300">No Threats Detected</h3>
                            <p className="text-gray-400 mt-2 font-mono">Shadow Hacker found no immediate vulnerabilities based on the provided document. The system appears secure.</p>
                        </div>
                    )}
                </div>
            ) : isLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[300px]">
                    <Spinner />
                    <p className="mt-4 font-mono text-lg text-[#00FF88] animate-pulse">Analyzing document for threats...</p>
                </div>
            ) : (
                 <div>
                    <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-[#8F00FF]/50 border-dashed cursor-pointer bg-black/20 hover:bg-[#8F00FF]/10 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadIcon />
                            <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500">TXT, MD, or JSON (MAX. 1MB)</p>
                        </div>
                        <input id="file-upload" type="file" className="hidden" accept=".txt,.md,.json" onChange={(e) => handleFileChange(e.target.files?.[0] || null)} />
                    </label>
                     {error && <p className="text-red-400 text-center font-mono mt-4">{error}</p>}
                </div>
            )}
        </div>
    );
};