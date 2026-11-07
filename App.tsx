
import React from 'react';
import Header from './components/Header';
import ApiKeyInput from './components/ApiKeyInput';
import ConverterForm from './components/ConverterForm';
import ResultDisplay from './components/ResultDisplay';
import HistoryList from './components/HistoryList';
import { useMusicConverter } from './hooks/useMusicConverter';

const App: React.FC = () => {
  const { 
    history, 
    isLoading, 
    error, 
    currentResult, 
    convert, 
    selectHistoryItem, 
    clearHistory,
    cloudSyncActive,
    refreshConnection,
    isRetrying
  } = useMusicConverter();

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1e293b_0%,_#0f172a_100%)] -z-10"></div>
      
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-0 w-full h-96 bg-cyan-500/5 blur-[120px] -z-10 pointer-events-none"></div>

      <Header cloudSyncActive={cloudSyncActive} />

      <main className="flex-grow container mx-auto max-w-4xl pt-4">
        <ApiKeyInput />

        <ConverterForm onConvert={convert} isLoading={isLoading} />

        {error && (
          <div className="max-w-2xl mx-auto px-4 mb-8">
            <div className={`p-4 rounded-xl flex flex-col space-y-3 border ${
              !cloudSyncActive
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400" 
                : "bg-red-500/10 border-red-500/50 text-red-400"
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <i className={`fa-solid ${!cloudSyncActive ? "fa-cloud-slash" : "fa-triangle-exclamation"}`}></i>
                  <span className="text-sm font-bold uppercase tracking-tight">
                    {!cloudSyncActive ? "Offline Mode (Local Only)" : "System Error"}
                  </span>
                </div>
                {!cloudSyncActive && (
                  <button 
                    onClick={refreshConnection}
                    disabled={isRetrying}
                    className="text-[10px] bg-amber-500/20 hover:bg-amber-500/40 border border-amber-500/50 px-3 py-1 rounded-md transition-all flex items-center space-x-1"
                  >
                    <i className={`fa-solid fa-sync ${isRetrying ? 'fa-spin' : ''}`}></i>
                    <span>RECONNECT</span>
                  </button>
                )}
              </div>
              
              <div className="text-xs opacity-90 leading-relaxed">
                <p>{error}</p>
                {error.includes("Firestore API") && (
                  <div className="mt-3 p-3 bg-black/30 rounded-lg border border-white/10">
                    <p className="font-bold mb-1 text-white">Langkah untuk Sinkronisasi:</p>
                    <ol className="list-decimal ml-4 space-y-1">
                      <li>Buka <a href="https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=vocal-morph" target="_blank" className="underline text-cyan-400">Google Cloud Console</a>.</li>
                      <li>Klik tombol <b>"ENABLE"</b>.</li>
                      <li>Kembali ke sini dan klik tombol <b>RECONNECT</b> di atas.</li>
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {isLoading && !currentResult && (
          <div className="max-w-2xl mx-auto px-4">
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center space-y-4 animate-pulse">
              <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
              <p className="text-slate-400 font-mono text-sm">Analyzing vocal layers...</p>
            </div>
          </div>
        )}

        {currentResult && <ResultDisplay result={currentResult} />}

        <HistoryList 
          history={history} 
          onSelect={selectHistoryItem} 
          onClear={clearHistory} 
        />
      </main>

      <footer className="py-8 px-4 text-center border-t border-slate-800 bg-slate-900/30 backdrop-blur-sm">
        <p className="text-slate-600 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold">
          &copy; {new Date().getFullYear()} Vocal Morph AI &bull; Created for Suno & Udio Enthusiasts
        </p>
      </footer>
    </div>
  );
};

export default App;
