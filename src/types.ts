export interface StrategyInput {
  companyType: string;
  sector: string;
  location: string;
  problemStatement: string;
}

export type ProblemCategory =
  | 'Category A: Go-To-Market / New Product Entry'
  | 'Category B: Competitive Threat / Incumbent Dominance'
  | 'Category C: Growth Stagnation / Portfolio Expansion'
  | 'Category D: Internal Conflict / Alignment / Positioning Choice'
  | 'Category E: Geographic / Cross-Border Expansion';

export interface MarketMetric {
  title: string;
  value: string;
  detail: string;
  cagr?: string;
  unit: string;
  description: string;
}

export interface WtpAssessment {
  scoreRating: 'High' | 'Moderate-High' | 'Moderate' | 'Defensive';
  pricePremiumDelta: string;
  keyDriver: string;
  elasticitySummary: string;
  customerRationale: string;
}

export interface MarketSizingData {
  tam: MarketMetric;
  sam: MarketMetric;
  som: MarketMetric;
  wtp: WtpAssessment;
  currencySymbol: string;
  metadata: {
    source: string;
    targetGeo: string;
    confidence: 'High' | 'Medium-High' | 'Medium';
    baseYear: string;
    horizon: string;
  };
}

export interface SelectedFramework {
  id: string;
  name: string;
  originatorOrLens: string;
  whyPicked: string;
  plainEnglishTakeaway: string;
  corePrinciple: string;
  applicationQuestions: string[];
  strategicCategory: 'Positioning' | 'Competitor Dynamics' | 'Customer Value' | 'Execution Architecture' | 'Internal Alignment' | 'Expansion';
}

export interface ExecutionRisk {
  risk: string;
  impactLevel: 'High' | 'Medium';
  plainEnglishWarning: string;
  countermeasure: string;
}

export interface ExecutiveRecommendation {
  attractivenessScore: number;
  attractivenessLabel: string;
  verdictHeadline: string;
  verdictSummary: string;
  threeStepPlan: {
    step1WhatToDoFirst: {
      actionTitle: string;
      rationale: string;
      concreteMoves: string[];
    };
    step2WhatNotToDo: {
      nonGoalTitle: string;
      rationale: string;
      forbiddenTraps: string[];
    };
    step3ExecutionRisks: {
      summary: string;
      risks: ExecutionRisk[];
    };
  };
  horizonMilestones: {
    days30: string;
    days60: string;
    days90: string;
  };
}

export interface StrategyResult {
  query: StrategyInput;
  category: ProblemCategory;
  categoryRationale: string;
  marketSizing: MarketSizingData;
  frameworks: SelectedFramework[];
  recommendation: ExecutiveRecommendation;
  generatedAt: string;
}

export interface ExecutionStep {
  id: number;
  label: string;
  detail: string;
  status: 'pending' | 'in_progress' | 'completed';
}
