
import React, { useState } from 'react';
import { ConversionResult } from '../types';

interface ResultDisplayProps {
  result: ConversionResult;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.safeDescription);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 animate-[fadeIn_0.5s_ease-out]">
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Target Artist</span>
            <h3 className="text-xl font-mono text-cyan-400">{result.artistName}</h3>
          </div>
          <button
            onClick={copyToClipboard}
            className={`p-3 rounded-lg transition-all ${
              copied ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Copy to Clipboard"
          >
            {copied ? <i className="fa-solid fa-check"></i> : <i className="fa-solid fa-copy"></i>}
          </button>
        </div>

        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Safe AI Description</span>
          <p className="text-lg md:text-xl text-slate-200 leading-relaxed font-light italic">
            &ldquo;{result.safeDescription}&rdquo;
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex items-center space-x-2 text-xs text-slate-500">
          <i className="fa-solid fa-circle-info"></i>
          <span>Optimized for Suno/Udio - No Copyright Restrictions</span>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
