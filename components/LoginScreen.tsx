import React, { useState } from 'react';
import { Lock, User, Camera, ShieldCheck, ChevronRight } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate network delay for effect
    setTimeout(() => {
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#020817] flex flex-col relative overflow-hidden font-sans text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-bg opacity-30"></div>
      <div className="absolute inset-0 bg-radial-gradient from-cyan-900/10 to-transparent pointer-events-none"></div>

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/10 bg-slate-900/50 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 text-cyan-500">
             <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/>
            </svg>
          </div>
          <span className="font-bold tracking-tight">TikTok Shop Prompt Generator</span>
        </div>
        <div className="flex items-center gap-6 text-[10px] font-mono tracking-widest text-slate-500">
          <span className="hidden md:inline hover:text-cyan-500 cursor-pointer transition-colors">NETWORK: [SECURE]</span>
          <span className="hidden md:inline hover:text-cyan-500 cursor-pointer transition-colors">SYSTEM PROTOCOLS</span>
          <button className="px-3 py-1 border border-cyan-500/30 text-cyan-400 rounded hover:bg-cyan-500/10 transition-colors uppercase">
            Initialize
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-[460px] relative">
            
            {/* Holographic Card */}
            <div className="glass-panel rounded-xl overflow-hidden relative shadow-[0_0_50px_rgba(6,182,212,0.15)]">
                
                {/* Scanner Line Animation */}
                <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden opacity-30">
                    <div className="w-full h-[2px] bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-scan"></div>
                </div>

                <div className="p-10 pb-6 flex flex-col items-center relative z-30">
                    
                    {/* Icon Container */}
                    <div className="relative w-32 h-32 mb-8 group">
                         <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-[spin_10s_linear_infinite]"></div>
                         <div className="absolute inset-2 rounded-full border border-dashed border-cyan-500/30 animate-[spin_15s_linear_infinite_reverse]"></div>
                         <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 bg-cyan-950/30 rounded-full flex items-center justify-center border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                                <Camera size={32} className="text-cyan-400" />
                            </div>
                         </div>
                    </div>

                    <h1 className="text-2xl font-bold tracking-[0.2em] text-center mb-2 font-mono uppercase neon-text">AI Portal Access</h1>
                    
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 mb-8">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase">Auth Server Ready</span>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-slate-500 tracking-[0.2em] uppercase ml-1">Terminal ID</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500/50 group-focus-within:text-cyan-400 transition-colors" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Enter System ID..." 
                                    className="w-full bg-slate-900/60 border border-slate-700 rounded-lg py-4 pl-12 pr-4 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/60 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-slate-500 tracking-[0.2em] uppercase ml-1">Access Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500/50 group-focus-within:text-cyan-400 transition-colors" size={18} />
                                <input 
                                    type="password" 
                                    placeholder="••••••••" 
                                    className="w-full bg-slate-900/60 border border-slate-700 rounded-lg py-4 pl-12 pr-4 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/60 transition-all"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold tracking-[0.2em] uppercase py-4 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <span className="animate-pulse">Authenticating...</span>
                            ) : (
                                <span>Access Terminal</span>
                            )}
                        </button>
                    </form>

                    <div className="flex justify-between w-full mt-6 text-[10px] font-mono text-slate-500 tracking-wider">
                        <button className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                            <ShieldCheck size={12} /> FORGOT ENCRYPTION
                        </button>
                        <button className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                            REQUEST UPLINK <ChevronRight size={12} />
                        </button>
                    </div>

                </div>
            </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 flex justify-between items-end opacity-40">
        <div className="font-mono text-[10px] text-cyan-500/70 space-y-1">
            <div className="flex gap-4">
                <span>NODE: 10.0.4.1</span>
                <span>LATENCY: 8MS</span>
            </div>
            <div>STATUS: ENCRYPTED // LAYER_7_ACTIVE</div>
        </div>
        <div className="w-12 h-12 border-b-2 border-r-2 border-cyan-500/20 rounded-br-xl"></div>
      </footer>
    </div>
  );
};

export default LoginScreen;
