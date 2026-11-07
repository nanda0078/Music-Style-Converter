
import React from 'react';
import { ConversionResult } from '../types';

interface HistoryListProps {
  history: ConversionResult[];
  onSelect: (item: ConversionResult) => void;
  onClear: () => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect, onClear }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mt-16 mb-24">
      <div className="flex justify-between items-center mb-6 px-2">
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-2">
          <i className="fa-solid fa-clock-rotate-left"></i>
          <span>Recent Sessions</span>
        </h4>
        <button 
          onClick={onClear}
          className="text-xs text-slate-500 hover:text-red-400 transition-colors uppercase font-bold"
        >
          Clear All
        </button>
      </div>
      
      <div className="grid gap-3">
        {history.map((item) => (
          <button
            key={item.timestamp + (item.id || '')}
            onClick={() => onSelect(item)}
            className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-900/30 border border-slate-800/50 hover:border-slate-700 rounded-xl transition-all group text-left relative overflow-hidden"
          >
            <div className="flex items-center space-x-3 z-10">
              <span className="text-slate-300 font-mono text-sm group-hover:text-cyan-400 transition-colors">
                {item.artistName}
              </span>
              {item.id ? (
                <i className="fa-solid fa-cloud text-[10px] text-green-500/50" title="Synced to Cloud"></i>
              ) : (
                <i className="fa-solid fa-bolt text-[10px] text-amber-500/50" title="Local Only"></i>
              )}
            </div>
            <span className="text-slate-500 text-[10px] md:text-xs truncate max-w-xs md:ml-4 italic z-10">
              {item.safeDescription.substring(0, 60)}...
            </span>
            <div className="absolute inset-y-0 left-0 w-1 bg-cyan-500 transform -translate-x-full group-hover:translate-x-0 transition-transform"></div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;
