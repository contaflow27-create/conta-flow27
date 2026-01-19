import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import UploadZone from './UploadZone';
import PromptCard from './PromptCard';
import { MediaFile, AnalysisState, GeneratedPrompts } from '../types';
import { analyzeMediaWithGemini, fileToBase64 } from '../services/geminiService';
import { Terminal, RefreshCw, CheckCircle2, AlertCircle, Copy } from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [currentFile, setCurrentFile] = useState<MediaFile | null>(null);
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    status: 'idle',
    progress: 0,
    message: 'SYSTEM READY',
  });
  const [results, setResults] = useState<GeneratedPrompts | null>(null);
  
  // Use environment variable for API Key
  const API_KEY = process.env.API_KEY || '';

  const handleFileSelect = (file: File) => {
    const url = URL.createObjectURL(file);
    const type = file.type.startsWith('video') ? 'video' : 'image';
    
    setCurrentFile({ file, previewUrl: url, type });
    setResults(null); // Clear previous results
    
    // Auto start analysis
    startAnalysis(file, type);
  };

  const startAnalysis = async (file: File, type: 'image' | 'video') => {
    setAnalysisState({ status: 'uploading', progress: 10, message: 'VECTORIZING INPUT DATA...' });

    try {
      // Step 1: Convert to Base64
      const base64 = await fileToBase64(file);
      setAnalysisState({ status: 'analyzing', progress: 40, message: 'SENDING TO GEMINI CORE...' });

      // Step 2: Call Gemini
      setAnalysisState({ status: 'analyzing', progress: 60, message: 'SYNTHESIZING PROMPTS...' });
      
      const generatedData = await analyzeMediaWithGemini(base64, file.type, API_KEY);
      
      setAnalysisState({ status: 'complete', progress: 100, message: 'ANALYSIS COMPLETE' });
      setResults(generatedData);

    } catch (error) {
      console.error(error);
      setAnalysisState({ 
        status: 'error', 
        progress: 0, 
        message: 'ANALYSIS FAILED', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  };

  const clearMedia = () => {
    if (currentFile) {
      URL.revokeObjectURL(currentFile.previewUrl);
    }
    setCurrentFile(null);
    setResults(null);
    setAnalysisState({ status: 'idle', progress: 0, message: 'SYSTEM READY' });
  };

  const copyAllPrompts = () => {
      if (!results) return;
      const allText = results.scenes.map(s => `${s.phase}: ${s.description}`).join('\n\n');
      navigator.clipboard.writeText(allText);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-40"></div>
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-xl border-b border-cyan-500/10 flex items-center justify-between px-6 z-30">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 text-cyan-400">
                 <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/>
                </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">AI LAB <span className="text-cyan-500 text-sm font-mono ml-2">V2.0</span></h1>
        </div>
        <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]"></div>
                <span className="text-[10px] font-mono text-cyan-300 tracking-wider">DIAGNOSTICS: SYSTEM NOMINAL</span>
            </div>
            <div className="px-3 py-1 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400">
                LAB_SRV_04
            </div>
        </div>
      </header>

      <Sidebar onLogout={onLogout} />

      <main className="pt-20 pb-10 px-6 md:ml-64 relative z-10 max-w-[1600px]">
        <div className="flex flex-col xl:flex-row gap-6 h-[calc(100vh-120px)]">
            
            {/* Left Column: Input */}
            <div className="w-full xl:w-1/3 flex flex-col gap-6">
                <div className="flex-1 glass-panel rounded-2xl p-1 relative shadow-2xl shadow-cyan-900/20">
                    <div className="absolute -inset-[1px] bg-gradient-to-b from-cyan-500/20 to-transparent rounded-2xl pointer-events-none"></div>
                    <div className="h-full bg-slate-900/80 rounded-xl p-6 flex flex-col relative overflow-hidden">
                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-cyan-500/50 rounded-tl-lg"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-cyan-500/50 rounded-br-lg"></div>

                        <UploadZone 
                            onFileSelect={handleFileSelect} 
                            currentFile={currentFile} 
                            onClear={clearMedia}
                            disabled={analysisState.status === 'uploading' || analysisState.status === 'analyzing'}
                        />
                    </div>
                </div>

                {/* Analysis Status Terminal */}
                <div className="h-48 glass-panel rounded-xl p-4 flex flex-col relative overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-cyan-500 uppercase flex items-center gap-2">
                            <Terminal size={12} /> Neural Analysis
                        </span>
                        <span className="text-xs font-mono text-cyan-400">{analysisState.progress}%</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-slate-800 rounded-full mb-4 overflow-hidden">
                        <div 
                            className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4] transition-all duration-500" 
                            style={{ width: `${analysisState.progress}%` }}
                        ></div>
                    </div>

                    <div className="flex-1 bg-slate-950/50 rounded border border-slate-800 p-3 font-mono text-[10px] space-y-1 overflow-y-auto custom-scrollbar">
                        <div className="text-slate-500">{'>'} INITIALIZING SEQUENCE...</div>
                        {currentFile && <div className="text-slate-400">{'>'} MEDIA DETECTED: {currentFile.type.toUpperCase()}</div>}
                        {analysisState.status !== 'idle' && (
                            <div className={`${analysisState.status === 'error' ? 'text-red-400' : 'text-cyan-400'} animate-pulse`}>
                                {'>'} {analysisState.message}
                            </div>
                        )}
                        {analysisState.error && (
                            <div className="text-red-500">{'>'} ERROR: {analysisState.error}</div>
                        )}
                         {analysisState.status === 'complete' && (
                            <div className="text-green-400">{'>'} OUTPUT GENERATED SUCCESSFULLY.</div>
                        )}
                    </div>

                    <div className="mt-3 flex justify-between text-[10px] font-mono text-slate-600">
                        <span>SYS_STABLE</span>
                        <span>1.2 TB AVAIL</span>
                    </div>
                </div>
            </div>

            {/* Right Column: Output */}
            <div className="w-full xl:w-2/3 glass-panel rounded-2xl p-1 relative">
                 <div className="absolute -inset-[1px] bg-gradient-to-b from-cyan-500/20 to-transparent rounded-2xl pointer-events-none"></div>
                 <div className="h-full bg-slate-900/80 rounded-xl p-6 flex flex-col overflow-hidden relative">
                    
                    {/* Header */}
                    <div className="flex justify-between items-end border-b border-slate-800 pb-4 mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight mb-1">SYNTHESIZED PROMPTS</h2>
                            <p className="text-xs font-mono text-cyan-500 tracking-widest uppercase">Precision Marketing Engine Output</p>
                        </div>
                        <div className="flex gap-2">
                             <div className="px-2 py-1 rounded border border-cyan-500/20 bg-cyan-950/30 text-[10px] text-cyan-400 font-mono">4K_RES</div>
                             <div className="px-2 py-1 rounded border border-cyan-500/20 bg-cyan-950/30 text-[10px] text-cyan-400 font-mono">ULTRA_REAL</div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {!results ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4 opacity-50">
                                <div className="w-16 h-16 rounded-full border border-slate-700 flex items-center justify-center animate-[spin_10s_linear_infinite]">
                                    <div className="w-12 h-12 rounded-full border border-dashed border-slate-600"></div>
                                </div>
                                <p className="font-mono text-sm tracking-widest">AWAITING INPUT DATA</p>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                
                                {/* Product & Angle Summary */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-slate-800/30 p-4 rounded border-l-2 border-purple-500">
                                        <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Target Product</label>
                                        <div className="text-white font-medium">{results.productName}</div>
                                    </div>
                                    <div className="bg-slate-800/30 p-4 rounded border-l-2 border-blue-500">
                                        <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Marketing Angle</label>
                                        <div className="text-white font-medium">{results.marketingAngle}</div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="h-px bg-slate-800 flex-1"></div>
                                        <span className="text-[10px] font-mono text-slate-500">GENERATED SEQUENCE</span>
                                        <div className="h-px bg-slate-800 flex-1"></div>
                                    </div>

                                    {results.scenes.map((scene, idx) => (
                                        <PromptCard key={idx} index={idx} scene={scene} />
                                    ))}
                                </div>

                                <div className="h-4"></div>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="border-t border-slate-800 pt-6 mt-2 flex justify-end gap-3">
                         <button 
                            onClick={copyAllPrompts}
                            disabled={!results}
                            className="px-4 py-3 rounded border border-slate-700 hover:bg-slate-800 text-slate-300 font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50"
                        >
                            <Copy size={14} /> Copy All Data
                        </button>
                        <button 
                            onClick={() => currentFile && startAnalysis(currentFile.file, currentFile.type)}
                            disabled={!results || analysisState.status === 'analyzing'}
                            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold text-xs uppercase tracking-wider rounded shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <RefreshCw size={14} className={analysisState.status === 'analyzing' ? 'animate-spin' : ''} />
                            Regenerate Analysis
                        </button>
                    </div>

                 </div>
            </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
