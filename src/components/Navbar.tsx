import React from 'react';
import { Compass, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentScreen: 1 | 2 | 3;
  onReset: () => void;
  hasResult: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ currentScreen, onReset, hasResult }) => {
  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <Compass className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 tracking-tight text-base sm:text-lg">
                Strategic Direction Agent
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                15-Lens Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Translating complex business dilemmas into zero-jargon directional choices
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Plain-English Rule: Zero Jargon</span>
          </div>

          {hasResult && currentScreen === 3 && (
            <button
              id="nav-new-query-btn"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 px-3 py-1.5 rounded-md transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Analysis</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
