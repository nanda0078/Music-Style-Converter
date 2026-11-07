
import React, { useState } from 'react';

interface ConverterFormProps {
  onConvert: (artist: string) => void;
  isLoading: boolean;
}

const ConverterForm: React.FC<ConverterFormProps> = ({ onConvert, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onConvert(input.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mt-8 mb-12">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex flex-col md:flex-row items-stretch md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter Artist Name (e.g. Freddie Mercury)"
            className="flex-grow bg-slate-900 border border-slate-700 text-white text-lg rounded-xl px-6 py-4 outline-none glow-focus transition-all placeholder:text-slate-500 font-mono"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 text-slate-900 font-bold px-8 py-4 rounded-xl transition-all flex items-center justify-center space-x-2 shrink-0 shadow-lg shadow-cyan-900/20"
          >
            {isLoading ? (
              <i className="fa-solid fa-circle-notch fa-spin"></i>
            ) : (
              <>
                <span>CONVERT</span>
                <i className="fa-solid fa-arrow-right"></i>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConverterForm;
