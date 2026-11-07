
import React from 'react';

interface HeaderProps {
  cloudSyncActive: boolean;
}

const Header: React.FC<HeaderProps> = ({ cloudSyncActive }) => {
  return (
    <header className="py-8 px-4 text-center relative">
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="flex items-center space-x-3 mb-1">
          <i className="fa-solid fa-wave-square text-cyan-400 text-3xl"></i>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white uppercase italic">
            Vocal <span className="text-cyan-400">Morph</span>
          </h1>
        </div>
        
        {/* Sync Status Badge */}
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all duration-500 ${
          cloudSyncActive 
            ? "bg-green-500/10 border-green-500/30 text-green-400" 
            : "bg-amber-500/10 border-amber-500/30 text-amber-400"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            cloudSyncActive ? "bg-green-400 animate-pulse" : "bg-amber-400"
          }`}></span>
          <span>{cloudSyncActive ? "Cloud Sync Active" : "Local Mode Active"}</span>
        </div>
      </div>
      
      <p className="text-slate-400 text-sm md:text-base font-medium mt-4">
        Technical Vocal Abstraction for AI Music Prompting
      </p>
    </header>
  );
};

export default Header;
