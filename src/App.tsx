import React, { useState } from 'react';
import { StrategyInput, StrategyResult } from './types.js';
import { Navbar } from './components/Navbar.js';
import { InputForm } from './components/InputForm.js';
import { AgentExecutionView } from './components/AgentExecutionView.js';
import { ExecutiveDashboard } from './components/ExecutiveDashboard.js';
import { AlertCircle } from 'lucide-react';

const DEFAULT_INPUT: StrategyInput = {
  companyType: 'Early-stage Startup',
  sector: 'FMCG Beverages',
  location: 'Bangalore & Mumbai',
  problemStatement:
    'Want to launch a premium functional beverage against dominant FMCG incumbents who own retail distribution and shelf space.',
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<1 | 2 | 3>(1);
  const [inputValues, setInputValues] = useState<StrategyInput>(DEFAULT_INPUT);
  const [result, setResult] = useState<StrategyResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isBackendReady, setIsBackendReady] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStartAnalysis = async (input: StrategyInput) => {
    setInputValues(input);
    setErrorMessage(null);
    setIsLoading(true);
    setIsBackendReady(false);
    setCurrentScreen(2); // Jump to Screen 2: Live Agent Execution View

    try {
      const response = await fetch('/api/strategy/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to process strategic analysis');
      }

      const data: StrategyResult = await response.json();
      setResult(data);
      setIsBackendReady(true);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred while analyzing the strategy.');
      setIsBackendReady(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecutionViewComplete = () => {
    if (result) {
      setCurrentScreen(3); // Transition to Screen 3: Executive Strategy Dashboard
    } else if (errorMessage) {
      setCurrentScreen(1); // Return to Screen 1 if failed
    }
  };

  const handleModifyInputs = () => {
    setCurrentScreen(1);
  };

  const handleNewAnalysis = () => {
    setInputValues({
      companyType: 'Early-stage Startup',
      sector: '',
      location: 'Tier-1 Indian Cities',
      problemStatement: '',
    });
    setResult(null);
    setErrorMessage(null);
    setCurrentScreen(1);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* Universal Top Navigation */}
      <Navbar
        currentScreen={currentScreen}
        onReset={handleNewAnalysis}
        hasResult={result !== null}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {errorMessage && currentScreen === 1 && (
          <div className="max-w-4xl mx-auto px-4 mt-6 w-full">
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-sm">Strategic Engine Notice</div>
                <p className="text-xs text-rose-700 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {currentScreen === 1 && (
          <InputForm
            initialValues={inputValues}
            onSubmit={handleStartAnalysis}
            isLoading={isLoading}
          />
        )}

        {currentScreen === 2 && (
          <AgentExecutionView
            input={inputValues}
            onComplete={handleExecutionViewComplete}
            isBackendReady={isBackendReady}
          />
        )}

        {currentScreen === 3 && result && (
          <ExecutiveDashboard
            result={result}
            onModifyInputs={handleModifyInputs}
            onNewAnalysis={handleNewAnalysis}
          />
        )}
      </main>

      {/* Subtle Minimal Footer */}
      <footer className="w-full border-t border-slate-200/80 bg-white/70 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-700">Strategic Direction Agent</span>
            <span>•</span>
            <span>15 Dynamic Lenses (Van den Steen, Judo Strategy, Porter 5 Forces, CAGE & more)</span>
          </div>
          <div className="text-slate-500">
            Plain-English Strategic Framework Router
          </div>
        </div>
      </footer>
    </div>
  );
}
