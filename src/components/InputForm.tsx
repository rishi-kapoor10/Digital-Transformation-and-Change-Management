import React, { useState } from 'react';
import {
  Building2,
  Briefcase,
  MapPin,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  Users2,
  TrendingDown,
  Globe2,
} from 'lucide-react';
import { StrategyInput } from '../types.js';

interface InputFormProps {
  initialValues: StrategyInput;
  onSubmit: (input: StrategyInput) => void;
  isLoading: boolean;
}

const COMPANY_TYPES = [
  'Early-stage Startup',
  'Mid-sized D2C Brand',
  'Large Enterprise',
  'Bootstrapped SME',
  'Growth-stage VC Backed',
];

const SECTOR_SUGGESTIONS = [
  'FMCG Beverages',
  'Quick Commerce & Grocery',
  'B2B SaaS',
  'D2C Personal Care & Beauty',
  'Consumer FinTech',
  'HealthTech & Wellness',
];

const LOCATION_SUGGESTIONS = [
  'Bangalore & Mumbai',
  'Tier-1 Indian Cities',
  'Pan-India',
  'Delhi-NCR & Northern Metros',
  'Pan-India & Global Export',
  'US & North America',
];

const EXAMPLE_SCENARIOS = [
  {
    label: 'Incumbent Challenge',
    icon: Target,
    title: 'Launching against giant incumbents in beverages',
    companyType: 'Early-stage Startup',
    sector: 'FMCG Beverages',
    location: 'Bangalore & Mumbai',
    problem: 'Want to launch a premium functional beverage against dominant FMCG incumbents who own retail distribution and shelf space.',
  },
  {
    label: 'Co-founder Conflict',
    icon: Users2,
    title: 'Leadership split: new cities vs. new products',
    companyType: 'Mid-sized D2C Brand',
    sector: 'Quick Commerce & Grocery',
    location: 'Tier-1 Indian Cities',
    problem: 'Co-founders disagree on whether to expand geography into 5 new cities or double down on adding high-margin private label product lines.',
  },
  {
    label: 'Stalled Growth',
    icon: TrendingDown,
    title: 'Sales stalled despite category boom',
    companyType: 'Growth-stage VC Backed',
    sector: 'B2B SaaS',
    location: 'Pan-India',
    problem: 'Sales stalled over the last 3 quarters despite category growth. Customer acquisition costs are spiking and mid-market renewal rates are slipping.',
  },
  {
    label: 'Geographic Scale',
    icon: Globe2,
    title: 'South India leader evaluating Pan-India expansion',
    companyType: 'Mid-sized D2C Brand',
    sector: 'FMCG Beverages',
    location: 'Pan-India',
    problem: 'We dominate South India metros, but co-founders are debating whether to attempt Pan-India retail expansion where supply chain distance and local consumer tastes are vastly different.',
  },
];

export const InputForm: React.FC<InputFormProps> = ({ initialValues, onSubmit, isLoading }) => {
  const [companyType, setCompanyType] = useState(initialValues.companyType || 'Early-stage Startup');
  const [sector, setSector] = useState(initialValues.sector || 'FMCG Beverages');
  const [location, setLocation] = useState(initialValues.location || 'Bangalore & Mumbai');
  const [problemStatement, setProblemStatement] = useState(
    initialValues.problemStatement ||
      'Want to launch a premium functional beverage against dominant FMCG incumbents who own the distribution networks and shelf space.'
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sector.trim()) {
      setValidationError('Please specify your Sector / Category.');
      return;
    }
    if (!problemStatement.trim()) {
      setValidationError('Please describe your strategic problem or goal statement.');
      return;
    }
    setValidationError(null);
    onSubmit({
      companyType,
      sector,
      location,
      problemStatement,
    });
  };

  const applyScenario = (scenario: typeof EXAMPLE_SCENARIOS[0]) => {
    setCompanyType(scenario.companyType);
    setSector(scenario.sector);
    setLocation(scenario.location);
    setProblemStatement(scenario.problem);
    setValidationError(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Hero Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 mb-3">
          <Zap className="w-3.5 h-3.5 text-amber-600" />
          <span>Screen 1: Business Context Framing</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-2">
          Strategic Direction Agent
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
          Enter your company context to receive actionable strategic choices and market sizing.
        </p>
      </div>

      {/* Quick Example Scenarios Bar */}
      <div className="mb-8 bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Quick Test Scenarios (Click to Pre-fill)
          </span>
          <span className="text-xs text-slate-600 hidden sm:inline">Real-world business dilemmas</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {EXAMPLE_SCENARIOS.map((scenario, idx) => {
            const Icon = scenario.icon;
            return (
              <button
                key={idx}
                type="button"
                id={`preset-scenario-${idx}`}
                onClick={() => applyScenario(scenario)}
                className="text-left p-3 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all text-xs group cursor-pointer flex items-start gap-2.5"
              >
                <div className="p-1.5 rounded-md bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors shrink-0 mt-0.5">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <span>{scenario.title}</span>
                  </div>
                  <div className="text-slate-500 line-clamp-1 mt-0.5">{scenario.sector} • {scenario.location}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Input Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        {validationError && (
          <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium">
            {validationError}
          </div>
        )}

        {/* Input 1: Company Type */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-600" />
            <span>Company Type</span>
          </label>
          <div className="flex flex-wrap gap-2 mb-2.5">
            {COMPANY_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                id={`company-type-pill-${type.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => setCompanyType(type)}
                className={`text-xs font-medium px-3 py-1.5 rounded-md border whitespace-nowrap transition-colors cursor-pointer ${
                  companyType === type
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <input
            id="company-type-input"
            type="text"
            value={companyType}
            onChange={(e) => setCompanyType(e.target.value)}
            placeholder="Or type custom company stage (e.g. Series-A D2C, Bootstrapped Agency)"
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-slate-500 focus:bg-white transition-colors"
          />
        </div>

        {/* Input 2: Sector / Category */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-slate-600" />
            <span>Sector / Category</span>
          </label>
          <div className="flex flex-wrap gap-2 mb-2.5">
            {SECTOR_SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                id={`sector-pill-${s.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => setSector(s)}
                className={`text-xs font-medium px-3 py-1.5 rounded-md border whitespace-nowrap transition-colors cursor-pointer ${
                  sector === s
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <input
            id="sector-input"
            type="text"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            placeholder="e.g., FMCG Beverages, Quick Commerce, B2B SaaS, Luxury Fashion"
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-slate-500 focus:bg-white transition-colors"
          />
        </div>

        {/* Input 3: Location / Target Geography */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-600" />
            <span>Location / Target Geography</span>
          </label>
          <div className="flex flex-wrap gap-2 mb-2.5">
            {LOCATION_SUGGESTIONS.map((loc) => (
              <button
                key={loc}
                type="button"
                id={`location-pill-${loc.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => setLocation(loc)}
                className={`text-xs font-medium px-3 py-1.5 rounded-md border whitespace-nowrap transition-colors cursor-pointer ${
                  location === loc
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
          <input
            id="location-input"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Pan-India, Tier-1 Indian Cities, Bangalore & Mumbai, Global"
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-slate-500 focus:bg-white transition-colors"
          />
        </div>

        {/* Input 4: Problem / Goal Statement */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-slate-600" />
              <span>Problem / Goal Statement</span>
            </label>
            <span className="text-xs text-slate-600">Explain in plain terms — no jargon needed</span>
          </div>
          <textarea
            id="problem-statement-textarea"
            rows={4}
            value={problemStatement}
            onChange={(e) => setProblemStatement(e.target.value)}
            placeholder="e.g., Sales stalled despite category growth | Want to launch a premium product against dominant incumbents | Co-founders disagree on whether to expand geography or add products"
            className="w-full px-3.5 py-3 text-sm bg-slate-50/50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-slate-500 focus:bg-white transition-colors resize-y leading-relaxed"
          />
          <p className="text-xs text-slate-600 mt-1.5">
            The agent will analyze this problem against 15 strategic frameworks, compute location-specific TAM/SAM/SOM + WTP, and synthesize a 3-step action plan.
          </p>
        </div>

        {/* Submit Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            id="generate-strategy-btn"
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-medium text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <span>GENERATE STRATEGIC DIRECTION</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </form>
    </div>
  );
};
