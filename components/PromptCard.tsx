import React from 'react';
import { Copy, Video, Camera, Zap } from 'lucide-react';
import { PromptScene } from '../types';

interface PromptCardProps {
  scene: PromptScene;
  index: number;
}

const PromptCard: React.FC<PromptCardProps> = ({ scene, index }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(scene.description);
  };

  return (
    <div className="group relative bg-slate-900/40 border border-slate-700/50 hover:border-cyan-500/40 rounded-lg p-5 transition-all duration-300 hover:bg-slate-800/40">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-cyan-500 bg-cyan-950/30 px-2 py-1 rounded border border-cyan-500/20 uppercase">
            Phase 0{index + 1}: {scene.phase}
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            {scene.duration}
          </span>
        </div>
        <button 
          onClick={copyToClipboard}
          className="text-slate-500 hover:text-cyan-400 transition-colors"
          title="Copy Prompt"
        >
          <Copy size={14} />
        </button>
      </div>

      <h4 className="text-white text-sm font-medium mb-3 leading-relaxed font-mono border-l-2 border-cyan-500/50 pl-3">
        "{scene.description}"
      </h4>

      <div className="grid grid-cols-2 gap-2 mt-4">
        <div className="bg-slate-950/50 rounded p-2 border border-slate-800 flex items-center gap-2">
          <Camera size={12} className="text-cyan-600" />
          <span className="text-[10px] text-slate-400 font-mono truncate">{scene.cameraMovement}</span>
        </div>
        <div className="bg-slate-950/50 rounded p-2 border border-slate-800 flex items-center gap-2">
          <Zap size={12} className="text-yellow-600" />
          <span className="text-[10px] text-slate-400 font-mono truncate">{scene.lighting}</span>
        </div>
      </div>
    </div>
  );
};

export default PromptCard;
