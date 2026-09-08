import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Circle, Sparkles, Layers, Search, BarChart3, FileText, ArrowRight } from 'lucide-react';
import { StrategyInput } from '../types.js';

interface AgentExecutionViewProps {
  input: StrategyInput;
  onComplete: () => void;
  isBackendReady: boolean;
}

interface StepItem {
  id: number;
  label: string;
  detail: string;
  subOutput: string;
  icon: React.ElementType;
}

const CHECKLIST_STEPS: StepItem[] = [
  {
    id: 1,
    label: 'Deconstructing problem context & internal objective',
    detail: 'Isolating the core business dilemma, company archetype, and target customer boundary...',
    subOutput: 'Problem deconstructed into structural trade-offs and capital constraints.',
    icon: Search,
  },
  {
    id: 2,
    label: 'Estimating location-specific TAM, SAM, SOM & WTP (Willingness to Pay)',
    detail: 'Running geographic market models and customer willingness-to-pay elasticity...',
    subOutput: 'Macro TAM mapped with location-specific SAM and achievable 12-18m SOM.',
    icon: BarChart3,
  },
  {
    id: 3,
    label: 'Scanning strategy framework library (15 lenses)',
    detail: 'Evaluating Van den Steen, Judo Strategy, Porter 5 Forces, CAGE, Strategy Diamond, VRIO...',
    subOutput: 'Scanned 15 strategic lenses across positioning, competitor dynamics, and execution.',
    icon: Layers,
  },
  {
    id: 4,
    label: 'Selecting top 4–5 most relevant strategic frameworks',
    detail: 'Scoring framework affinity against asymmetric competition and alignment dynamics...',
    subOutput: 'Ranked and filtered the 5 highest-affinity strategic lenses for this exact challenge.',
    icon: Sparkles,
  },
  {
    id: 5,
    label: 'Synthesizing plain-English recommendation',
    detail: 'Formulating the 3-step action plan, non-goals, and execution risk mitigations...',
    subOutput: 'Executive brief completed: zero jargon, clear directional verdict ready.',
    icon: FileText,
  },
];

export const AgentExecutionView: React.FC<AgentExecutionViewProps> = ({
  input,
  onComplete,
  isBackendReady,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    // Step-by-step progress cadence giving the user a realistic, confidence-building view of the agent's work
    const stepDuration = 800; // ms per step
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < CHECKLIST_STEPS.length - 1) {
          setCompletedSteps((done) => (done.includes(prev) ? done : [...done, prev]));
          return prev + 1;
        } else {
          // Last step
          setCompletedSteps([0, 1, 2, 3, 4]);
          clearInterval(timer);
          return prev;
        }
      });
    }, stepDuration);

    return () => clearInterval(timer);
  }, []);

  // When all 5 steps are completed AND backend response is ready, transition to Screen 3
  useEffect(() => {
    if (completedSteps.length === 5 && isBackendReady) {
      const delay = setTimeout(() => {
        onComplete();
      }, 700);
      return () => clearTimeout(delay);
    }
  }, [completedSteps, isBackendReady, onComplete]);

  const progressPercent = Math.min(100, Math.round(((completedSteps.length + 0.5) / CHECKLIST_STEPS.length) * 100));

  return (
    <div className="w-full max-w-3xl mx-auto py-10 px-4 sm:px-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-3 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Screen 2: Live Agent Execution View</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
          Deconstructing Your Strategic Problem
        </h2>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Scanning 15 strategic lenses and synthesizing an executive direction for{' '}
          <span className="font-semibold text-slate-800">{input.sector}</span> in{' '}
          <span className="font-semibold text-slate-800">{input.location}</span>.
        </p>
      </div>

      {/* Progress Bar Container */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs mb-6">
        <div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-2.5">
          <span>Agent Pipeline Progress</span>
          <span className="font-semibold text-slate-900">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-6">
          <div
            className="bg-slate-900 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step-by-Step Checklist */}
        <div className="space-y-4">
          {CHECKLIST_STEPS.map((step, index) => {
            const isDone = completedSteps.includes(index);
            const isActive = currentStepIndex === index && !isDone;
            const isPending = !isDone && !isActive;
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                id={`execution-step-${step.id}`}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  isDone
                    ? 'bg-slate-50/70 border-slate-200'
                    : isActive
                    ? 'bg-white border-slate-900 ring-1 ring-slate-900 shadow-xs'
                    : 'bg-white border-slate-100 opacity-40'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5 shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : isActive ? (
                      <Loader2 className="w-5 h-5 text-slate-900 animate-spin" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-sm font-semibold tracking-tight ${
                          isDone ? 'text-slate-900' : isActive ? 'text-slate-900 font-bold' : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </h4>
                      {isDone && (
                        <span className="text-2xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          Complete
                        </span>
                      )}
                      {isActive && (
                        <span className="text-2xs font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md animate-pulse">
                          Processing
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {isDone ? step.subOutput : step.detail}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live context snippet card */}
      <div className="bg-slate-100/60 border border-slate-200/80 rounded-xl p-4 text-xs text-slate-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">Target Problem:</span>
          <span className="line-clamp-1 italic text-slate-600">"{input.problemStatement}"</span>
        </div>
        <span className="shrink-0 text-slate-400 font-mono text-2xs uppercase tracking-wider hidden sm:inline">
          Antigravity Engine
        </span>
      </div>

      {completedSteps.length === 5 && !isBackendReady && (
        <div className="mt-4 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-700" />
          <span>Finalizing executive synthesis...</span>
        </div>
      )}
    </div>
  );
};
