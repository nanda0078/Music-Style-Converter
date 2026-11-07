import React, { useState, useEffect } from 'react';
import { getActiveApiKey, saveApiKey, clearApiKey } from '../services/geminiService';

interface ApiKeyInputProps {
  onKeyChange?: (key: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onKeyChange }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [hasStoredKey, setHasStoredKey] = useState(false);

  useEffect(() => {
    const key = getActiveApiKey();
    if (key && key !== 'PLACEHOLDER_API_KEY') {
      setApiKey(key);
      setHasStoredKey(true);
    }
  }, []);

  const handleSave = () => {
    const trimmed = apiKey.trim();
    if (!trimmed) return;
    saveApiKey(trimmed);
    setHasStoredKey(true);
    setIsSaved(true);
    onKeyChange?.(trimmed);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleClear = () => {
    clearApiKey();
    setApiKey('');
    setHasStoredKey(false);
    onKeyChange?.('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mb-6">
      <div className="bg-slate-900/70 border border-slate-700/60 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-md transition-all">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 shadow-sm">
              <i className="fa-solid fa-key text-sm"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-wide">Google Gemini API Key</span>
                {hasStoredKey ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Tersimpan
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    Belum Diatur
                  </span>
                )}
              </div>
            </div>
          </div>

          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 self-start sm:self-center font-medium"
          >
            <span>Dapatkan API Key Gratis</span>
            <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
          </a>
        </div>

        <p className="text-xs text-slate-400 mb-3.5 leading-relaxed">
          Kunci API disimpan di browser lokal (localStorage) dan digunakan langsung untuk menjalankan fitur Gemini 3 Flash / 3.5.
        </p>

        {/* Input and Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-grow">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Tempel Google Gemini API Key di sini (AIzaSy...)"
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono transition-all"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
              title={showKey ? 'Sembunyikan API Key' : 'Tampilkan API Key'}
            >
              <i className={`fa-solid ${showKey ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={!apiKey.trim()}
              className={`flex-grow sm:flex-initial px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-md ${
                isSaved
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white'
              }`}
            >
              {isSaved ? (
                <>
                  <i className="fa-solid fa-check"></i>
                  <span>Tersimpan!</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-floppy-disk"></i>
                  <span>Simpan Key</span>
                </>
              )}
            </button>

            {hasStoredKey && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 transition-colors text-xs font-semibold"
                title="Hapus API Key dari localStorage"
              >
                Hapus
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyInput;
