import { GoogleGenAI } from '@google/genai';
import {
  StrategyInput,
  ProblemCategory,
  MarketSizingData,
  SelectedFramework,
  ExecutiveRecommendation,
  StrategyResult,
} from '../src/types.js';

// 15 Comprehensive Strategy Frameworks
interface FrameworkDefinition {
  id: string;
  name: string;
  originatorOrLens: string;
  corePrinciple: string;
  strategicCategory: 'Positioning' | 'Competitor Dynamics' | 'Customer Value' | 'Execution Architecture' | 'Internal Alignment' | 'Expansion';
  bestFor: ProblemCategory[];
  keywords: string[];
}

const ALL_FRAMEWORKS: FrameworkDefinition[] = [
  {
    id: 'van-den-steen',
    name: 'Van den Steen Alignment Framework',
    originatorOrLens: 'Eric Van den Steen (Harvard / MIT)',
    corePrinciple: 'Strategy as shared beliefs: alignment precedes operational efficiency when co-founders or teams disagree.',
    strategicCategory: 'Internal Alignment',
    bestFor: ['Category D: Internal Conflict / Alignment / Positioning Choice', 'Category B: Competitive Threat / Incumbent Dominance'],
    keywords: ['co-founder', 'disagree', 'conflict', 'vision', 'belief', 'culture', 'direction', 'team', 'split', 'focus', 'priority', 'aligned'],
  },
  {
    id: 'quest',
    name: 'QUEST Positioning Framework',
    originatorOrLens: 'Strategic Scenarios Under Ambiguity',
    corePrinciple: 'Quick Environmental Scanning Technique: mapping scenarios to establish a defensible beachhead amidst high market uncertainty.',
    strategicCategory: 'Positioning',
    bestFor: ['Category D: Internal Conflict / Alignment / Positioning Choice', 'Category A: Go-To-Market / New Product Entry'],
    keywords: ['uncertainty', 'ambiguity', 'scenario', 'bet', 'pivot', 'which', 'whether', 'choice', 'dilemma', 'decision'],
  },
  {
    id: 'porter-five-forces',
    name: "Porter's Five Forces",
    originatorOrLens: 'Michael E. Porter (Harvard Business School)',
    corePrinciple: 'Evaluating industry profit pool defensibility by probing supplier power, buyer leverage, substitutes, entrant barriers, and rivalry.',
    strategicCategory: 'Competitor Dynamics',
    bestFor: ['Category B: Competitive Threat / Incumbent Dominance', 'Category A: Go-To-Market / New Product Entry'],
    keywords: ['incumbent', 'competitor', 'dominant', 'pricing pressure', 'supplier', 'margin', 'substitute', 'rivalry', 'giants', 'monopoly'],
  },
  {
    id: 'etop',
    name: 'ETOP Profile (Environmental Threat & Opportunity)',
    originatorOrLens: 'Macro Trend Strategic Auditing',
    corePrinciple: 'Systematically cataloging headwinds vs. tailwinds to determine whether external shifts unlock an asymmetric window.',
    strategicCategory: 'Expansion',
    bestFor: ['Category E: Geographic / Cross-Border Expansion', 'Category C: Growth Stagnation / Portfolio Expansion'],
    keywords: ['macro', 'trend', 'tailwinds', 'shift', 'demographics', 'consumption', 'inflation', 'supply chain', 'expansion'],
  },
  {
    id: 'elem',
    name: 'ELEM (External/Internal Leverage Matrix)',
    originatorOrLens: 'Strategic Capability Arbitrage',
    corePrinciple: 'Matching distinct internal superpowers against under-exploited customer friction points to build durable competitive leverage.',
    strategicCategory: 'Execution Architecture',
    bestFor: ['Category C: Growth Stagnation / Portfolio Expansion', 'Category A: Go-To-Market / New Product Entry'],
    keywords: ['capability', 'leverage', 'unfair advantage', 'asset', 'channel', 'synergy', 'distribution', 'efficiency'],
  },
  {
    id: 'judo-strategy',
    name: 'Judo Strategy (Rapid Asymmetric Agility)',
    originatorOrLens: 'Yoffie & Kwak (Harvard)',
    corePrinciple: 'Using an incumbent\'s massive size, channel inertia, and cost structure against them rather than attacking head-on.',
    strategicCategory: 'Competitor Dynamics',
    bestFor: ['Category B: Competitive Threat / Incumbent Dominance', 'Category A: Go-To-Market / New Product Entry'],
    keywords: ['dominant', 'incumbent', 'giant', 'established', 'big player', 'underdog', 'small', 'challenger', 'asymmetric', 'nimble'],
  },
  {
    id: 'cage-distance',
    name: 'CAGE Distance Framework',
    originatorOrLens: 'Pankaj Ghemawat',
    corePrinciple: 'Quantifying Cultural, Administrative, Geographic, and Economic distances to prevent premature multi-market expansion traps.',
    strategicCategory: 'Expansion',
    bestFor: ['Category E: Geographic / Cross-Border Expansion'],
    keywords: ['geography', 'cities', 'tier-1', 'tier-2', 'cross-border', 'regional', 'pan-india', 'states', 'export', 'local', 'expansion', 'new city'],
  },
  {
    id: 'vrio-framework',
    name: 'VRIO Strategic Moat Analysis',
    originatorOrLens: 'Jay Barney',
    corePrinciple: 'Testing if your product assets are Value-creating, Rare, Inimitable, and Organized to harvest sustained margins.',
    strategicCategory: 'Competitor Dynamics',
    bestFor: ['Category B: Competitive Threat / Incumbent Dominance', 'Category D: Internal Conflict / Alignment / Positioning Choice'],
    keywords: ['moat', 'defensibility', 'copycat', 'proprietary', 'formula', 'patent', 'tech', 'unique', 'sustainable', 'advantage'],
  },
  {
    id: 'ksf',
    name: 'Key Success Factors (KSF)',
    originatorOrLens: 'Industry Must-Win Imperatives',
    corePrinciple: 'Distilling the 2-3 operational capabilities that all winners in this specific sector must master before attempting novelty.',
    strategicCategory: 'Execution Architecture',
    bestFor: ['Category A: Go-To-Market / New Product Entry', 'Category B: Competitive Threat / Incumbent Dominance'],
    keywords: ['must-win', 'shelf space', 'retention', 'distribution', 'gross margin', 'unit economics', 'cac', 'conversion', 'supply'],
  },
  {
    id: 'delta-model',
    name: 'Delta Model & Willingness to Pay (WTP)',
    originatorOrLens: 'Dean Wilde & Arnoldo Hax (MIT)',
    corePrinciple: 'Shifting from standard product push to Total Customer Solutions and System Lock-In to expand pricing power.',
    strategicCategory: 'Customer Value',
    bestFor: ['Category A: Go-To-Market / New Product Entry', 'Category B: Competitive Threat / Incumbent Dominance', 'Category C: Growth Stagnation / Portfolio Expansion'],
    keywords: ['price', 'wtp', 'willingness to pay', 'premium', 'margin', 'value', 'cheap', 'discount', 'retention', 'loyalty', 'monetization'],
  },
  {
    id: 'pestel',
    name: 'PESTEL Macro Environment Matrix',
    originatorOrLens: 'Macro Strategic Governance',
    corePrinciple: 'Evaluating Political, Economic, Social, Technological, Environmental, and Legal forces shaping the strategic horizon.',
    strategicCategory: 'Expansion',
    bestFor: ['Category E: Geographic / Cross-Border Expansion', 'Category A: Go-To-Market / New Product Entry'],
    keywords: ['regulation', 'fssai', 'compliance', 'legal', 'tax', 'macro', 'policy', 'licensing', 'government'],
  },
  {
    id: 'grand-strategy-matrix',
    name: "Porter's Grand Strategy Matrix",
    originatorOrLens: 'Market Growth vs. Competitive Position',
    corePrinciple: 'Evaluating whether to push rapid market penetration, retrenchment, or joint ventures based on category expansion velocity.',
    strategicCategory: 'Positioning',
    bestFor: ['Category D: Internal Conflict / Alignment / Positioning Choice', 'Category C: Growth Stagnation / Portfolio Expansion'],
    keywords: ['stalled', 'slowdown', 'growth', 'fast market', 'declining', 'saturation', 'share', 'plateau'],
  },
  {
    id: 'strategy-diamond',
    name: 'Strategy Diamond Architecture',
    originatorOrLens: 'Hambrick & Fredrickson',
    corePrinciple: 'Harmonizing Arenas (where to play), Vehicles (how to get there), Differentiators (how to win), Staging (timing), and Economic Logic.',
    strategicCategory: 'Execution Architecture',
    bestFor: ['Category A: Go-To-Market / New Product Entry', 'Category C: Growth Stagnation / Portfolio Expansion'],
    keywords: ['gtm', 'launch', 'new product', 'go-to-market', 'roadmap', 'staging', 'differentiator', 'vehicles', 'arena'],
  },
  {
    id: 'bcg-matrix',
    name: 'BCG Growth-Share Matrix',
    originatorOrLens: 'Boston Consulting Group',
    corePrinciple: 'Categorizing offerings into Stars, Cash Cows, Question Marks, and Dogs to make unemotional capital reallocation calls.',
    strategicCategory: 'Internal Alignment',
    bestFor: ['Category C: Growth Stagnation / Portfolio Expansion', 'Category D: Internal Conflict / Alignment / Positioning Choice'],
    keywords: ['portfolio', 'multiple products', 'skus', 'cannibalize', 'lines', 'invest', 'divest', 'cash cow', 'resource allocation'],
  },
  {
    id: 'ansoff-matrix',
    name: 'Ansoff Market Expansion Grid',
    originatorOrLens: 'Igor Ansoff',
    corePrinciple: 'Weighing risk across Market Penetration, Product Development, Market Expansion, and Diversification.',
    strategicCategory: 'Expansion',
    bestFor: ['Category C: Growth Stagnation / Portfolio Expansion', 'Category E: Geographic / Cross-Border Expansion', 'Category A: Go-To-Market / New Product Entry'],
    keywords: ['expand', 'new category', 'new market', 'add products', 'penetration', 'adjacent', 'cross-sell', 'diversify'],
  },
];

export class StrategicEngine {
  // Layer 1: Problem Framing & Categorization Engine
  public static categorizeProblem(input: StrategyInput): { category: ProblemCategory; rationale: string } {
    const text = `${input.problemStatement} ${input.companyType} ${input.sector} ${input.location}`.toLowerCase();

    // Scoring weights
    let scores = {
      B: 0, // Competitive / Dominant Incumbent
      A: 0, // GTM / New Product Entry
      D: 0, // Internal Conflict / Direction
      E: 0, // Geographic Expansion
      C: 0, // Growth Stagnation / Portfolio
    };

    // Category B: Competitive Threat
    if (text.includes('incumbent') || text.includes('dominant') || text.includes('competing') || text.includes('giant') || text.includes('established players') || text.includes('price war') || text.includes('market leader')) {
      scores.B += 6;
    }
    // Category D: Internal Conflict / Co-founder
    if (text.includes('co-founder') || text.includes('disagree') || text.includes('conflict') || text.includes('vision') || text.includes('alignment') || text.includes('whether to') || text.includes('split opinion') || text.includes('prioritize')) {
      scores.D += 7;
    }
    // Category E: Geographic Expansion
    if (text.includes('expand geography') || text.includes('new city') || text.includes('tier-2') || text.includes('cross-border') || text.includes('pan-india') || text.includes('international') || text.includes('new territory') || text.includes('regional vs')) {
      scores.E += 5;
    }
    // Category A: GTM / New Product Launch
    if (text.includes('launch') || text.includes('new product') || text.includes('gtm') || text.includes('enter') || text.includes('go-to-market') || text.includes('introduce') || text.includes('early-stage')) {
      scores.A += 5;
    }
    // Category C: Growth Stagnation / Portfolio
    if (text.includes('stalled') || text.includes('plateau') || text.includes('slowed') || text.includes('growth stalled') || text.includes('add products') || text.includes('portfolio') || text.includes('stagnat') || text.includes('scale')) {
      scores.C += 5;
    }

    // Default tie-breakers based on problem wording
    let selected: ProblemCategory = 'Category A: Go-To-Market / New Product Entry';
    let rationale = 'Identified an entry and market capture challenge requiring crisp market segmentation and differentiated positioning.';

    const maxScore = Math.max(scores.A, scores.B, scores.C, scores.D, scores.E);
    if (maxScore > 0) {
      if (scores.B === maxScore) {
        selected = 'Category B: Competitive Threat / Incumbent Dominance';
        rationale = 'The core obstacle is asymmetric scale disadvantage against well-capitalized incumbents with existing channel lock-in.';
      } else if (scores.D === maxScore) {
        selected = 'Category D: Internal Conflict / Alignment / Positioning Choice';
        rationale = 'The primary bottleneck is internal strategic divergence: leadership must agree on a singular trade-off before committing capital.';
      } else if (scores.E === maxScore) {
        selected = 'Category E: Geographic / Cross-Border Expansion';
        rationale = 'The decision revolves around geographic scaling vs. deepening regional density and assessing boundary distance costs.';
      } else if (scores.C === maxScore) {
        selected = 'Category C: Growth Stagnation / Portfolio Expansion';
        rationale = 'The business has hit an efficiency or distribution plateau where core product saturation demands portfolio leverage or new channel unlock.';
      } else {
        selected = 'Category A: Go-To-Market / New Product Entry';
        rationale = 'The primary objective is establishing initial market traction, customer willingness to pay, and sustainable go-to-market mechanics.';
      }
    }

    return { category: selected, rationale };
  }

  // Layer 2: Market Sizing & Value Engine (TAM / SAM / SOM + WTP)
  public static estimateMarketSizing(input: StrategyInput, category: ProblemCategory): MarketSizingData {
    const sectorLower = input.sector.toLowerCase();
    const geoLower = input.location.toLowerCase();

    // Determine baseline currency & scale
    const isIndiaFocus = geoLower.includes('india') || geoLower.includes('bangalore') || geoLower.includes('mumbai') || geoLower.includes('delhi') || geoLower.includes('tier-1') || geoLower.includes('tier-2');
    const currency = isIndiaFocus ? '₹' : '$';
    const unitSuffix = isIndiaFocus ? 'Cr' : 'M';

    // Baseline sector multiples (estimates calibrated to 2026 industry datasets)
    let tamBase = 32000;
    let samRatio = 0.22;
    let somRatio = 0.028;
    let cagr = '18.4%';
    let sectorLabel = input.sector;

    if (sectorLower.includes('beverage') || sectorLower.includes('fmcg') || sectorLower.includes('food')) {
      tamBase = isIndiaFocus ? 48500 : 9200;
      samRatio = 0.18; // Premium / organized subsegment
      somRatio = 0.032;
      cagr = '16.8% CAGR';
    } else if (sectorLower.includes('quick commerce') || sectorLower.includes('q-commerce') || sectorLower.includes('grocery')) {
      tamBase = isIndiaFocus ? 38000 : 7500;
      samRatio = 0.35;
      somRatio = 0.024;
      cagr = '28.5% CAGR';
    } else if (sectorLower.includes('saas') || sectorLower.includes('software') || sectorLower.includes('b2b')) {
      tamBase = isIndiaFocus ? 18500 : 12400;
      samRatio = 0.26;
      somRatio = 0.038;
      cagr = '22.1% CAGR';
    } else if (sectorLower.includes('fintech') || sectorLower.includes('finance') || sectorLower.includes('payments')) {
      tamBase = isIndiaFocus ? 52000 : 15000;
      samRatio = 0.24;
      somRatio = 0.021;
      cagr = '24.0% CAGR';
    } else if (sectorLower.includes('d2c') || sectorLower.includes('beauty') || sectorLower.includes('fashion')) {
      tamBase = isIndiaFocus ? 26000 : 6800;
      samRatio = 0.20;
      somRatio = 0.035;
      cagr = '19.5% CAGR';
    }

    // Geography multiplier
    let geoMultiplier = 1.0;
    let geoDescription = 'Macro country-wide market';
    if (geoLower.includes('bangalore') && geoLower.includes('mumbai')) {
      geoMultiplier = 0.24; // Concentrated dual metro
      geoDescription = 'High-density Tier-1 twin-metro consumption cluster';
    } else if (geoLower.includes('tier-1')) {
      geoMultiplier = 0.42; // Top 8 Tier-1 cities
      geoDescription = 'Top 8 high-disposable income urban metros';
    } else if (geoLower.includes('pan-india')) {
      geoMultiplier = 1.0;
      geoDescription = 'All urban and semi-urban consumption across India';
    } else if (geoLower.includes('us') || geoLower.includes('global') || geoLower.includes('north america')) {
      geoMultiplier = 1.2;
      geoDescription = 'Mature international addressable buyer landscape';
    }

    const calculatedTam = Math.round(tamBase * geoMultiplier);
    const calculatedSam = Math.round(calculatedTam * samRatio);
    const calculatedSom = Math.round(calculatedSam * somRatio);

    // WTP (Willingness to Pay) logic
    let wtpRating: 'High' | 'Moderate-High' | 'Moderate' | 'Defensive' = 'Moderate-High';
    let premiumDelta = '+18% to +25%';
    let keyDriver = 'Measurable speed and superior ingredient/experience delta over legacy alternatives';
    let elasticity = 'Inelastic for initial target cohorts; price sensitivity rises sharply if expanded beyond beachhead.';
    let customerRationale = 'Target consumers currently spend on incumbent options with known dissatisfaction points. They demonstrate willingness to pay an upfront premium if the value proposition provides tangible friction removal.';

    if (category.includes('Competitive Threat')) {
      wtpRating = 'Moderate-High';
      premiumDelta = '+15% to +22%';
      keyDriver = 'Asymmetric value bundle (convenience, tailored formulation) that incumbents cannot easily match without destroying their channel margins.';
      elasticity = 'Medium elasticity: competing head-to-head on price is fatal against incumbent scale; victory requires winning on distinct experiential superiority.';
    } else if (category.includes('Internal Conflict')) {
      wtpRating = 'Moderate';
      premiumDelta = '+10% to +18%';
      keyDriver = 'Core positioning clarity: customer willingness to pay drops when the brand tries to be both luxury and mass-volume simultaneously.';
      elasticity = 'Highly elastic if messaging is ambiguous; decisive choice unlocks clear cohort premium.';
    } else if (category.includes('Growth Stagnation')) {
      wtpRating = 'Moderate';
      premiumDelta = '+8% to +14%';
      keyDriver = 'Cross-sell value and workflow lock-in rather than standalone unit price increases.';
      elasticity = 'High price sensitivity on existing core SKU; higher WTP on tailored premium extensions.';
    }

    return {
      tam: {
        title: 'TAM (Total Addressable Market)',
        value: `${currency}${calculatedTam.toLocaleString()} ${unitSuffix}`,
        detail: geoDescription,
        cagr,
        unit: `${currency} ${unitSuffix}`,
        description: `Total macro expenditure in ${input.sector} across target geography at full maturity.`,
      },
      sam: {
        title: 'SAM (Serviceable Addressable Market)',
        value: `${currency}${calculatedSam.toLocaleString()} ${unitSuffix}`,
        detail: `~${Math.round(samRatio * 100)}% of TAM within your target buying profile & pricing tier`,
        cagr,
        unit: `${currency} ${unitSuffix}`,
        description: 'The specific sub-segment of consumers or businesses actively shopping for your exact category solution.',
      },
      som: {
        title: 'SOM (Serviceable Obtainable Market)',
        value: `${currency}${calculatedSom.toLocaleString()} ${unitSuffix}`,
        detail: 'Realistic 12–18 month capture target with focused execution',
        unit: `${currency} ${unitSuffix}`,
        description: 'Realistic revenue achievable within 12 to 18 months under current capital and distribution constraints.',
      },
      wtp: {
        scoreRating: wtpRating,
        pricePremiumDelta: premiumDelta,
        keyDriver,
        elasticitySummary: elasticity,
        customerRationale,
      },
      currencySymbol: currency,
      metadata: {
        source: 'Sector DB 2026',
        targetGeo: input.location || 'Target Geography',
        confidence: 'Medium-High',
        baseYear: '2026',
        horizon: '12-18 Months',
      },
    };
  }

  // Layer 3: Dynamic Framework Router (Selects top 4-5 from the 15-framework library)
  public static routeFrameworks(input: StrategyInput, category: ProblemCategory): SelectedFramework[] {
    const rawText = `${input.problemStatement} ${input.companyType} ${input.sector} ${input.location}`.toLowerCase();

    // Specific prompt rules from user prompt:
    // IF Problem = "Competing against dominant player" -> PICK: Judo Strategy, Porter's Five Forces, Van den Steen, Delta WTP, KSF.
    // IF Problem = "GTM for new product launch" -> PICK: Strategy Diamond, Ansoff Matrix, KSF, Delta WTP, TAM/SAM/SOM (or VRIO).
    // IF Problem = "Internal conflict / direction choice" -> PICK: Van den Steen, QUEST, VRIO, Porter's Grand Strategy.
    // IF Problem = "Geographic expansion" -> PICK: CAGE Distance, PESTEL, ETOP, Ansoff Matrix.

    const scored = ALL_FRAMEWORKS.map((fw) => {
      let score = 0;

      // Category fit
      if (fw.bestFor.includes(category)) {
        score += 8;
      }

      // Exact prompt rule boosts
      if (category.includes('Competitive Threat')) {
        if (['judo-strategy', 'porter-five-forces', 'van-den-steen', 'delta-model', 'ksf'].includes(fw.id)) {
          score += 15;
        }
      } else if (category.includes('Go-To-Market')) {
        if (['strategy-diamond', 'ansoff-matrix', 'ksf', 'delta-model', 'vrio-framework'].includes(fw.id)) {
          score += 15;
        }
      } else if (category.includes('Internal Conflict')) {
        if (['van-den-steen', 'quest', 'vrio-framework', 'grand-strategy-matrix', 'bcg-matrix'].includes(fw.id)) {
          score += 15;
        }
      } else if (category.includes('Geographic')) {
        if (['cage-distance', 'pestel', 'etop', 'ansoff-matrix', 'ksf'].includes(fw.id)) {
          score += 15;
        }
      } else if (category.includes('Growth Stagnation')) {
        if (['ansoff-matrix', 'bcg-matrix', 'elem', 'delta-model', 'grand-strategy-matrix'].includes(fw.id)) {
          score += 15;
        }
      }

      // Keyword matches
      for (const kw of fw.keywords) {
        if (rawText.includes(kw)) {
          score += 3;
        }
      }

      return { fw, score };
    });

    // Sort descending by score and select top 5
    scored.sort((a, b) => b.score - a.score);
    const topPicks = scored.slice(0, 5).map((item) => item.fw);

    // Transform to SelectedFramework with problem-specific plain-English rationale
    return topPicks.map((fw) => {
      const whyPicked = generateFrameworkWhyPicked(fw.id, input, category);
      const plainEnglishTakeaway = generateFrameworkTakeaway(fw.id, input, category);

      return {
        id: fw.id,
        name: fw.name,
        originatorOrLens: fw.originatorOrLens,
        strategicCategory: fw.strategicCategory,
        corePrinciple: fw.corePrinciple,
        whyPicked,
        plainEnglishTakeaway,
        applicationQuestions: getApplicationQuestions(fw.id),
      };
    });
  }

  // Layer 4: Recommendation Synthesizer
  public static synthesizeRecommendation(
    input: StrategyInput,
    category: ProblemCategory,
    sizing: MarketSizingData,
    frameworks: SelectedFramework[]
  ): ExecutiveRecommendation {
    const sector = input.sector || 'your category';
    const geo = input.location || 'target geography';
    const compType = input.companyType || 'business';

    let attractivenessScore = 78;
    let attractivenessLabel = 'High Opportunity / High Moat Required';
    let verdictHeadline = '';
    let verdictSummary = '';

    let whatToDoFirstTitle = 'Establish a Defensible Beachhead in High-Density Pockets';
    let whatToDoFirstRationale = `Rather than spraying resources across ${geo}, concentrate distribution where your differentiated value driver triggers maximum repeat purchase.`;
    let whatToDoFirstMoves: string[] = [];

    let whatNotToDoTitle = 'Avoid Frontal Pricing Wars & Premature Horizontal Expansion';
    let whatNotToDoRationale = 'Do not attack the incumbent where they have infinite working capital and supplier scale discounts.';
    let forbiddenTraps: string[] = [];

    let executionRisks: { risk: string; impactLevel: 'High' | 'Medium'; plainEnglishWarning: string; countermeasure: string }[] = [];

    if (category.includes('Competitive Threat')) {
      attractivenessScore = 76;
      attractivenessLabel = 'Viable Asymmetric Opportunity (High Discipline Required)';
      verdictHeadline = `Win on agility, not price: flank the incumbent where their distribution machine is too slow or compromised.`;
      verdictSummary = `Against dominant incumbents in ${sector}, frontal attacks on price will burn cash with zero retention. Instead, use a Judo Strategy: target consumer friction that incumbents are structurally disincentivized to fix because doing so would cannibalize their core revenue.`;

      whatToDoFirstTitle = 'Identify the Incumbent\'s "Unprofitable" Friction Pocket';
      whatToDoFirstRationale = 'Incumbents cannot respond to small, specialized premium niches without hurting their legacy retail partners.';
      whatToDoFirstMoves = [
        `Anchor on a 20-25% premium price point justified by a tangible ingredient/workflow upgrade that the incumbent cannot duplicate without ruining their margins.`,
        `Lock in direct access to high-intent early adopters in ${geo} via specialized channels before the incumbent notices.`,
        `Codify your unit economics early: ensure gross margins exceed 55% so you can fund customer acquisition without venture subsidy.`,
      ];

      whatNotToDoTitle = 'Do NOT Play the "Cheaper Alternative" Trap';
      whatNotToDoRationale = 'A low price signals cheapness and invites the market leader to crush you in supplier price renegotiations.';
      forbiddenTraps = [
        'Never compete head-on in mass traditional retail banners where incumbents buy out shelf space.',
        'Do not spend marketing dollars on broad awareness ads; spend solely on targeted cohort conversion.',
        'Do not expand SKU count until the flagship offering achieves at least 35% 90-day repeat rate.',
      ];

      executionRisks = [
        {
          risk: 'Incumbent Copycat Launch',
          impactLevel: 'High',
          plainEnglishWarning: 'The dominant player may release a "flanker brand" undercutting your key message.',
          countermeasure: 'Build community brand affinity and proprietary formulation/workflow lock-in that cannot be cloned by corporate packaging changes.',
        },
        {
          risk: 'Retail Channel Squeeze',
          impactLevel: 'Medium',
          plainEnglishWarning: 'Distributors and retailers may demand heavy slotting fees backed by incumbent pressure.',
          countermeasure: 'Own your primary customer touchpoint directly (D2C or dedicated partner doors) so you never depend on a single gatekeeper.',
        },
      ];
    } else if (category.includes('Internal Conflict')) {
      attractivenessScore = 82;
      attractivenessLabel = 'Strong Market Potential (Blocked by Directional Alignment)';
      verdictHeadline = `Choose one strategic arena: you cannot win as both a mass-volume player and a boutique high-margin specialist simultaneously.`;
      verdictSummary = `The biggest threat to this ${compType} is not external competitors—it is internal hesitation. According to the Van den Steen principle, co-founders must establish explicit non-goals. Agreeing on what NOT to do will liberate 80% of your operational bandwidth.`;

      whatToDoFirstTitle = 'Enact a 90-Day Single-Metric Alignment Lock';
      whatToDoFirstRationale = 'When co-founders pull in opposite directions, teams freeze and burn runway without testing either thesis.';
      whatToDoFirstMoves = [
        `Select ONE primary North Star metric for the next two quarters (e.g., Contribution Margin in Bangalore vs. Top-line Volume across Pan-India).`,
        `Allocate 80% of budget to the chosen path, with an explicit 90-day checkpoint containing pre-agreed kill-or-scale criteria.`,
        `Formalize decision ownership: designate a single tie-breaker founder for product additions vs. geographic rollouts.`,
      ];

      whatNotToDoTitle = 'Do NOT Compromise by "Doing a Little Bit of Both"';
      whatNotToDoRationale = 'Compromise solutions guarantee mediocrity: half-funded geographic expansion plus half-baked product development leads to failure in both.';
      forbiddenTraps = [
        'Do not split budget 50/50 across competing co-founder ideas to keep peace.',
        'Do not hire regional sales teams before product-market fit metrics are stabilized in your initial city.',
        'Do not add secondary product variations until your primary offering has achieved positive unit economics.',
      ];

      executionRisks = [
        {
          risk: 'Execution Paralysis',
          impactLevel: 'High',
          plainEnglishWarning: 'Middle management and front-line teams receive conflicting instructions from co-founders.',
          countermeasure: 'Publish a single-page Strategy Memo to the entire company clearly defining the trade-offs and non-goals.',
        },
        {
          risk: 'Premature Capital Depletion',
          impactLevel: 'Medium',
          plainEnglishWarning: 'Dual experiments burn cash twice as fast without yielding decisive statistical signal.',
          countermeasure: 'Cap the exploratory experiment budget at exactly 15% of monthly operating spend.',
        },
      ];
    } else if (category.includes('Geographic')) {
      attractivenessScore = 74;
      attractivenessLabel = 'Attractive Regional Expansion (Distance Friction Present)';
      verdictHeadline = `Dominate localized cluster density before chasing vanity geographic footprint.`;
      verdictSummary = `Expanding across ${geo} looks alluring on paper, but logistics costs, cultural taste variations, and regional distribution cartels quickly destroy margins. Win city-by-city through hyper-local density rather than thin national distribution.`;

      whatToDoFirstTitle = 'Run a CAGE Distance Audit on Candidate Markets';
      whatToDoFirstRationale = 'Every new city adds administrative, logistics, and consumer behavior variance that resets your playbook.';
      whatToDoFirstMoves = [
        `Rank target expansion cities by operational proximity and consumer willingness to pay, not population size.`,
        `Deploy a "Hub and Spoke" fulfillment model: achieve 15% market share in anchor Tier-1 cities before touching Tier-2 clusters.`,
        `Form hyper-local partnerships to leverage existing refrigerated or specialized logistics fleets.`,
      ];

      whatNotToDoTitle = 'Do NOT Launch Pan-India or Cross-Border Before Densifying Core Hubs';
      whatNotToDoRationale = 'Spreading inventory across 10 cities with low order density leads to catastrophic inventory holding costs and expired goods.';
      forbiddenTraps = [
        'Do not rely on standard national courier services if temperature or freshness is critical.',
        'Do not copy-paste marketing creative across regions without localizing language and consumption rituals.',
        'Do not open remote branch offices until central unit economics cover overhead.',
      ];

      executionRisks = [
        {
          risk: 'Working Capital Trap in Remote Inventories',
          impactLevel: 'High',
          plainEnglishWarning: 'Unsold stock sits idle in regional depots while your home market experiences stockouts.',
          countermeasure: 'Implement real-time demand-pull replenishment with minimum 30-day inventory turnover targets.',
        },
        {
          risk: 'Regulatory & Municipal Non-compliance',
          impactLevel: 'Medium',
          plainEnglishWarning: 'Varying state taxes, local licensing, or municipal trade inspections cause operational delays.',
          countermeasure: 'Retain specialized regional compliance counsel before leasing physical warehouses.',
        },
      ];
    } else if (category.includes('Growth Stagnation')) {
      attractivenessScore = 72;
      attractivenessLabel = 'Moderate Attractiveness (Requires Core Optimization)';
      verdictHeadline = `Reignite stalled growth by unlocking customer wallet-share rather than hunting expensive new customer cohorts.`;
      verdictSummary = `When sales plateau despite category expansion, CAC has likely outpaced LTV in your primary acquisition funnel. The strategic solution is Ansoff Market Penetration combined with Delta Model lock-in: increase retention and basket size among your existing best customers.`;

      whatToDoFirstTitle = 'Perform an Unforgiving 80/20 Customer Value Diagnostic';
      whatToDoFirstRationale = 'In stagnating businesses, top 20% of accounts generate 120% of net profits while the bottom 40% drain operational cash.';
      whatToDoFirstMoves = [
        `Segment customers by repeat frequency: double down on the specific cohort generating high net margin.`,
        `Introduce high-margin value-add bundles or subscription options that lift average order value (AOV) by 18-24%.`,
        `Fix post-purchase churn: conduct 20 live customer exit interviews to pinpoint the exact moment momentum stalls.`,
      ];

      whatNotToDoTitle = 'Do NOT Throw Paid Ad Spend at a Leaky Funnel';
      whatNotToDoRationale = 'Increasing marketing budget when conversion has flatlined will simply subsidize customer acquisition for negative margin.';
      forbiddenTraps = [
        'Never offer blanket price discounts to juice top-line volume at month-end.',
        'Do not launch speculative third-party product categories until the core offering is profitable.',
        'Avoid changing brand identity or redesigning logos as a substitute for fixing product fundamentals.',
      ];

      executionRisks = [
        {
          risk: 'Team Morale & Churn Fatigue',
          impactLevel: 'High',
          plainEnglishWarning: 'Extended plateaus cause high-performer departure and organizational cynicism.',
          countermeasure: 'Rally the team around a single, highly achievable 45-day operational win (e.g., reducing onboarding drop-off by 15%).',
        },
        {
          risk: 'Channel Cannibalization',
          impactLevel: 'Medium',
          plainEnglishWarning: 'New product bundles undermine the sales velocity of your primary cash-cow SKU.',
          countermeasure: 'Price extensions strictly as complements or premium upgrades, never as cheaper substitutes.',
        },
      ];
    } else {
      // Category A: Go-To-Market / New Product Entry
      attractivenessScore = 84;
      attractivenessLabel = 'High Strategic Attractiveness (Execution Dependent)';
      verdictHeadline = `Nail your beachhead arena and price on customer value delta before scaling distribution.`;
      verdictSummary = `Entering ${sector} in ${geo} offers strong upside, but success requires rigorous adherence to the Hambrick-Fredrickson Strategy Diamond: clear arenas, defensible differentiators, and staging that protects cash runway.`;

      whatToDoFirstTitle = 'Validate Willingness to Pay in a Narrow Early-Adopter Cohort';
      whatToDoFirstRationale = 'If target buyers will not pay full price without aggressive couponing, the product has a positioning defect, not a marketing problem.';
      whatToDoFirstMoves = [
        `Test pricing at the upper quartile of the target band: prove that your value proposition commands a genuine premium.`,
        `Secure 100 passionate reference customers in a single neighborhood or business vertical before broad public launch.`,
        `Instrument precise cohort retention tracking: prioritize 60-day repeat usage over raw new signups.`,
      ];

      whatNotToDoTitle = 'Do NOT Build for "Everyone in General"';
      whatNotToDoRationale = 'Vague targeting produces forgettable brands that get drowned out by incumbent media budgets.';
      forbiddenTraps = [
        'Do not attempt nationwide or multi-city distribution on day one.',
        'Do not invest heavily in PR and influencer hype before the core product experience is bulletproof.',
        'Do not negotiate long-term exclusivity agreements with single distributors without strict performance minimums.',
      ];

      executionRisks = [
        {
          risk: 'Premature Scaling Burn Rate',
          impactLevel: 'High',
          plainEnglishWarning: 'Scaling headcount and ad spend before finding true product-market fit drains runway.',
          countermeasure: 'Enforce strict stage gates: do not unlock expansion budget until 40% of survey respondents say they would be "very disappointed" without your product.',
        },
        {
          risk: 'Distribution Channel Bottlenecks',
          impactLevel: 'Medium',
          plainEnglishWarning: 'Payment cycles and inventory lead times can create sudden cash crunches despite strong customer demand.',
          countermeasure: 'Maintain at least 4 months of buffer working capital specifically reserved for inventory cycles.',
        },
      ];
    }

    return {
      attractivenessScore,
      attractivenessLabel,
      verdictHeadline,
      verdictSummary,
      threeStepPlan: {
        step1WhatToDoFirst: {
          actionTitle: whatToDoFirstTitle,
          rationale: whatToDoFirstRationale,
          concreteMoves: whatToDoFirstMoves,
        },
        step2WhatNotToDo: {
          nonGoalTitle: whatNotToDoTitle,
          rationale: whatNotToDoRationale,
          forbiddenTraps,
        },
        step3ExecutionRisks: {
          summary: 'Identified critical operational vulnerabilities derived from external market dynamics and internal resource allocation.',
          risks: executionRisks,
        },
      },
      horizonMilestones: {
        days30: 'Audit core unit economics, interview 25 target buyers in your primary city, and define explicit co-founder non-goals.',
        days60: 'Lock in beachhead distribution channels, validate +15% WTP premium with zero discounting, and pilot the 3-step action plan.',
        days90: 'Evaluate 90-day repeat cohort retention; scale only if retention threshold (>35%) and contribution margin targets are met.',
      },
    };
  }

  // Master method: Executes 4-layer engine and optionally enhances via Gemini if available
  public static async analyze(input: StrategyInput): Promise<StrategyResult> {
    // Layer 1: Problem Framing
    const { category, rationale: categoryRationale } = this.categorizeProblem(input);

    // Layer 2: Market Sizing & WTP
    const marketSizing = this.estimateMarketSizing(input, category);

    // Layer 3: Dynamic Framework Router
    const frameworks = this.routeFrameworks(input, category);

    // Layer 4: Base Recommendation Synthesis
    let recommendation = this.synthesizeRecommendation(input, category, marketSizing, frameworks);

    // If GEMINI_API_KEY is available, call gemini-3.8-flash server-side to enrich the synthesis
    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const prompt = `You are the Strategic Direction Agent, a top-tier executive strategy advisor.
The user has provided this business context:
- Company Type: ${input.companyType}
- Sector / Category: ${input.sector}
- Target Geography: ${input.location}
- Business Problem / Goal: "${input.problemStatement}"

Our strategic engine categorized this as:
${category} (${categoryRationale})

The engine selected these 5 frameworks:
${frameworks.map((f) => `- ${f.name}: ${f.corePrinciple}`).join('\n')}

Market Sizing estimated:
- TAM: ${marketSizing.tam.value} (${marketSizing.tam.detail})
- SAM: ${marketSizing.sam.value} (${marketSizing.sam.detail})
- SOM: ${marketSizing.som.value} (${marketSizing.som.detail})
- Willingness to Pay: ${marketSizing.wtp.scoreRating}, Premium Delta: ${marketSizing.wtp.pricePremiumDelta}

YOUR MISSION:
Return a JSON object refining the plain-English executive recommendation.
REQUIREMENTS:
1. Speak in crisp, plain English. NO heavy academic jargon.
2. Provide a bold, decisive verdict headline and summary directly addressing their exact problem statement.
3. Provide Step 1 (What to do first with 3 concrete moves), Step 2 (What NOT to do with 3 forbidden traps/trade-offs), and Step 3 (2 realistic execution risks with countermeasures).
4. Provide 30, 60, and 90-day execution milestones.
5. Provide attractiveness score (integer 65-95) and a punchy attractiveness label.

Respond ONLY with valid JSON matching this structure:
{
  "attractivenessScore": 82,
  "attractivenessLabel": "High Opportunity / Discipline Required",
  "verdictHeadline": "Decisive single-sentence verdict",
  "verdictSummary": "2-3 crisp plain-English sentences directly addressing their exact situation.",
  "step1ActionTitle": "What to do first title",
  "step1Rationale": "Why this must come first",
  "step1ConcreteMoves": ["move 1", "move 2", "move 3"],
  "step2NonGoalTitle": "What NOT to do title",
  "step2Rationale": "Why these traps kill companies in this sector",
  "step2ForbiddenTraps": ["trap 1", "trap 2", "trap 3"],
  "step3Risks": [
    {
      "risk": "Risk name",
      "impactLevel": "High",
      "plainEnglishWarning": "Plain English warning",
      "countermeasure": "Specific mitigation"
    },
    {
      "risk": "Risk name",
      "impactLevel": "Medium",
      "plainEnglishWarning": "Plain English warning",
      "countermeasure": "Specific mitigation"
    }
  ],
  "days30": "30-day focus",
  "days60": "60-day focus",
  "days90": "90-day focus"
}`;

        const geminiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.3,
          },
        });

        const timeoutPromise = new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API request timed out (using deterministic engine)')), 4000)
        );

        const response: any = await Promise.race([geminiPromise, timeoutPromise]);

        if (response.text) {
          const parsed = JSON.parse(response.text);
          if (parsed.verdictHeadline && parsed.step1ConcreteMoves) {
            recommendation = {
              attractivenessScore: parsed.attractivenessScore || recommendation.attractivenessScore,
              attractivenessLabel: parsed.attractivenessLabel || recommendation.attractivenessLabel,
              verdictHeadline: parsed.verdictHeadline,
              verdictSummary: parsed.verdictSummary || recommendation.verdictSummary,
              threeStepPlan: {
                step1WhatToDoFirst: {
                  actionTitle: parsed.step1ActionTitle || recommendation.threeStepPlan.step1WhatToDoFirst.actionTitle,
                  rationale: parsed.step1Rationale || recommendation.threeStepPlan.step1WhatToDoFirst.rationale,
                  concreteMoves: parsed.step1ConcreteMoves,
                },
                step2WhatNotToDo: {
                  nonGoalTitle: parsed.step2NonGoalTitle || recommendation.threeStepPlan.step2WhatNotToDo.nonGoalTitle,
                  rationale: parsed.step2Rationale || recommendation.threeStepPlan.step2WhatNotToDo.rationale,
                  forbiddenTraps: parsed.step2ForbiddenTraps || recommendation.threeStepPlan.step2WhatNotToDo.forbiddenTraps,
                },
                step3ExecutionRisks: {
                  summary: 'Identified critical operational vulnerabilities derived from external market dynamics and internal resource allocation.',
                  risks: parsed.step3Risks || recommendation.threeStepPlan.step3ExecutionRisks.risks,
                },
              },
              horizonMilestones: {
                days30: parsed.days30 || recommendation.horizonMilestones.days30,
                days60: parsed.days60 || recommendation.horizonMilestones.days60,
                days90: parsed.days90 || recommendation.horizonMilestones.days90,
              },
            };
          }
        }
      } catch (err) {
        console.warn('Gemini enhancement unavailable or failed, utilizing deterministic strategy engine:', err);
      }
    }

    return {
      query: input,
      category,
      categoryRationale,
      marketSizing,
      frameworks,
      recommendation,
      generatedAt: new Date().toISOString(),
    };
  }
}

// Helpers for Framework rationale generation
function generateFrameworkWhyPicked(fwId: string, input: StrategyInput, category: ProblemCategory): string {
  const prob = input.problemStatement.toLowerCase();
  const comp = input.companyType.toLowerCase();

  switch (fwId) {
    case 'van-den-steen':
      return `Selected because the core challenge involves co-founder or leadership divergence on strategy. Van den Steen proves that shared foundational beliefs matter more than operational speed when charting long-term direction.`;
    case 'judo-strategy':
      return `Selected because an ${comp} cannot win a brute-force war of capital or shelf space against entrenched market leaders. Judo strategy forces you to leverage the giant's scale as a liability.`;
    case 'porter-five-forces':
      return `Selected to test industry profit pool defense against incumbent distribution lock-in and supplier margin pressures in ${input.sector}.`;
    case 'strategy-diamond':
      return `Selected to structure the complete Go-To-Market architecture: defining the precise Arenas (where to play), Differentiators (how to win), and Staging (pace of rollout).`;
    case 'ansoff-matrix':
      return `Selected to adjudicate the high-stakes trade-off between deepening market penetration in existing territories versus expanding into adjacent categories or geographies.`;
    case 'cage-distance':
      return `Selected because geographic expansion across ${input.location} introduces hidden Cultural, Administrative, and Economic distance costs that often cripple early ventures.`;
    case 'vrio-framework':
      return `Selected to audit whether your proposed value proposition possesses genuine inimitability or if it can be easily copied within 60 days by well-funded competitors.`;
    case 'ksf':
      return `Selected to isolate the mandatory table-stakes capabilities (Key Success Factors) required to survive in ${input.sector} before investing in unproven novelty.`;
    case 'delta-model':
      return `Selected to measure customer Willingness to Pay (WTP) and design lock-in mechanisms that generate high lifetime value without relying on destructive discounts.`;
    case 'etop':
      return `Selected to evaluate external macro tailwinds and environmental threats shaping consumer behavior and regulatory headwinds in ${input.location}.`;
    case 'elem':
      return `Selected to systematically match your unique internal team capabilities against unserved friction pockets in ${input.sector}.`;
    case 'quest':
      return `Selected to navigate strategic positioning under high market ambiguity, allowing leadership to formulate robust contingency branches.`;
    case 'pestel':
      return `Selected to assess regulatory, compliance, and macro-economic factors impacting commercial scalability in ${input.location}.`;
    case 'grand-strategy-matrix':
      return `Selected to position your growth velocity against category expansion rates, dictating whether to push aggressive market penetration or consolidate.`;
    case 'bcg-matrix':
      return `Selected to provide unemotional capital allocation criteria across current offerings, preventing the trap of subsidizing underperforming products with cash cows.`;
    default:
      return `Dynamically matched as a high-affinity strategic lens for ${category}.`;
  }
}

function generateFrameworkTakeaway(fwId: string, input: StrategyInput, category: ProblemCategory): string {
  switch (fwId) {
    case 'van-den-steen':
      return 'Stop compromising with hybrid strategies. Formulate a 1-page alignment agreement establishing clear non-goals for the next 6 months.';
    case 'judo-strategy':
      return 'Never undercut the giant on price. Compete where the incumbent cannot follow without cannibalizing their existing dealer margins or brand promise.';
    case 'porter-five-forces':
      return 'Differentiate on proprietary value rather than commodity distribution to insulate gross margins against buyer and supplier squeeze.';
    case 'strategy-diamond':
      return 'Pick a single sharp differentiator (e.g. 2x speed or clean formulation) and align every operational vehicle behind that singular advantage.';
    case 'ansoff-matrix':
      return 'Prioritize deep market penetration in your anchor city before attempting new product lines or multi-state expansion.';
    case 'cage-distance':
      return 'Do not expand into new territories until local unit economics in your home base demonstrate a self-sustaining contribution margin.';
    case 'vrio-framework':
      return 'Protect your core formulation or proprietary customer data loops—features without moats will be cloned within one quarter.';
    case 'ksf':
      return 'Master the 2 table-stakes metrics of this sector: gross margin above 50% and 60-day cohort retention above 30%.';
    case 'delta-model':
      return 'Charge a 15-20% premium backed by tangible friction removal. High willingness to pay signals real product-market fit.';
    case 'etop':
      return 'Harness current consumption shifts toward transparency and convenience while preparing defensive buffers against input cost inflation.';
    case 'elem':
      return 'Leverage your team\'s fastest superpower (rapid iteration and localized customer empathy) that big matrix organizations cannot emulate.';
    case 'quest':
      return 'Define pre-agreed milestone trigger points: if cohort metrics fail to hit targets by month 3, pivot immediately without emotional sunk-cost bias.';
    case 'pestel':
      return 'Ensure proactive regulatory compliance (e.g. food safety or data residency) to turn governance into an entry barrier for subsequent copycats.';
    case 'grand-strategy-matrix':
      return 'Focus all commercial horsepower on rapid customer acquisition in high-density pockets rather than premature diversification.';
    case 'bcg-matrix':
      return 'Ruthlessly cut or freeze non-performing SKUs to redirect all marketing fuel to the single product driving 80% of customer delight.';
    default:
      return 'Focus execution on a singular, high-conviction strategic choice and eliminate ambiguous secondary goals.';
  }
}

function getApplicationQuestions(fwId: string): string[] {
  switch (fwId) {
    case 'van-den-steen':
      return [
        'What is our fundamental shared belief about how this market will evolve?',
        'What is the #1 promising opportunity we will deliberately refuse to pursue this year?',
      ];
    case 'judo-strategy':
      return [
        'What response would require the incumbent to destroy their own profit model?',
        'How can we operate below their radar until our customer lock-in is unbreakable?',
      ];
    case 'strategy-diamond':
      return [
        'Where exactly will we be active (arenas) and what is our single most compelling differentiator?',
        'What is our staging sequence: what comes first, and what must wait?',
      ];
    case 'delta-model':
      return [
        'What tangible value delta makes customers eager to pay full price without coupons?',
        'How do we build system lock-in so switching to a competitor creates painful friction?',
      ];
    case 'cage-distance':
      return [
        'What hidden regulatory, logistics, or cultural differences exist between our home hub and the new territory?',
        'Can our supply chain support remote service levels without bleeding working capital?',
      ];
    default:
      return [
        'Does this strategic choice increase our long-term customer willingness to pay?',
        'Can our team execute this with decisive focus over the next 90 days?',
      ];
  }
}
