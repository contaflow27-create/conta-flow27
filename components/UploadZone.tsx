import React, { useCallback, useRef } from 'react';
import { UploadCloud, FileVideo, X } from 'lucide-react';
import { MediaFile } from '../types';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  currentFile: MediaFile | null;
  onClear: () => void;
  disabled?: boolean;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, currentFile, onClear, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect, disabled]);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleManualSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  if (currentFile) {
    return (
      <div className="w-full h-full rounded-xl border border-cyan-500/30 bg-slate-900/50 overflow-hidden relative group">
        {currentFile.type === 'video' ? (
          <video src={currentFile.previewUrl} className="w-full h-full object-cover opacity-60" autoPlay muted loop />
        ) : (
          <img src={currentFile.previewUrl} alt="Preview" className="w-full h-full object-cover opacity-60" />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent pointer-events-none" />
        
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={onClear}
            disabled={disabled}
            className="p-2 bg-slate-950/80 text-red-400 rounded-full border border-red-500/30 hover:bg-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={16} />
          </button>
        </div>

        <div className="absolute bottom-6 left-6 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            MEDIA INGESTED
          </div>
          <p className="text-white font-mono text-sm max-w-[200px] truncate">{currentFile.file.name}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={`h-full w-full rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-8 gap-6
        ${disabled ? 'border-slate-700 bg-slate-900/30 opacity-50 cursor-not-allowed' : 'border-cyan-500/30 bg-cyan-950/10 hover:border-cyan-400/60 hover:bg-cyan-950/20 cursor-pointer'}
      `}
      onClick={() => !disabled && inputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={inputRef} 
        onChange={handleManualSelect} 
        className="hidden" 
        accept="image/*,video/*"
        disabled={disabled}
      />
      
      <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] transition-all">
        <UploadCloud className="text-cyan-400" size={32} />
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-cyan-100 font-bold tracking-wide">MEDIA INGEST</h3>
        <p className="text-xs text-cyan-500/60 font-mono uppercase tracking-widest max-w-[180px]">
          Drag and drop source media
          <br />or click to select
        </p>
      </div>

      <button 
        disabled={disabled}
        className="px-6 py-2 bg-cyan-500 text-slate-950 font-bold text-xs tracking-widest uppercase rounded hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Select Media
      </button>
    </div>
  );
};

export default UploadZone;
