import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { StrategicEngine } from './server/strategyEngine.js';
import { StrategyInput } from './src/types.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Preset business scenarios matching the prompt's examples for instant one-click testing
const PRESETS: { title: string; subtitle: string; categoryTag: string; input: StrategyInput }[] = [
  {
    title: 'D2C Beverage vs. Legacy Incumbents',
    subtitle: 'Launching a premium clean functional soda against established beverage conglomerates',
    categoryTag: 'Incumbent Threat / Judo Strategy',
    input: {
      companyType: 'Early-stage Startup',
      sector: 'FMCG Beverages',
      location: 'Bangalore & Mumbai',
      problemStatement: 'Want to launch a premium functional beverage against dominant FMCG incumbents who own the distribution networks and shelf space.',
    },
  },
  {
    title: 'Co-founder Directional Conflict',
    subtitle: 'Leadership split between scaling geographic footprint vs. launching new SKU lines',
    categoryTag: 'Internal Alignment / Trade-offs',
    input: {
      companyType: 'Mid-sized D2C',
      sector: 'Quick Commerce & Grocery',
      location: 'Tier-1 Indian Cities',
      problemStatement: 'Co-founders disagree on whether to expand geography to 5 new cities or double down on adding new high-margin private label product categories.',
    },
  },
  {
    title: 'Growth Stagnation in Enterprise SaaS',
    subtitle: 'Sales flatlined despite double-digit overall industry category growth',
    categoryTag: 'Growth Stagnation / Core Renewal',
    input: {
      companyType: 'Growth-stage VC Backed',
      sector: 'B2B SaaS',
      location: 'Pan-India & Global Enterprise',
      problemStatement: 'Sales stalled over the past 3 quarters despite category growth. Customer acquisition costs are rising, and win-rates against mid-market alternatives are dropping.',
    },
  },
  {
    title: 'Regional Brand Geographic Expansion',
    subtitle: 'Deep regional leader deciding on Pan-India rollout vs. deepening cluster dominance',
    categoryTag: 'Geographic / CAGE Distance',
    input: {
      companyType: 'Mid-sized Enterprise',
      sector: 'D2C Packaged Foods',
      location: 'Pan-India (from South India base)',
      problemStatement: 'Dominant in South India metros, now evaluating aggressive Pan-India retail expansion into North & West India where logistics and local taste habits differ greatly.',
    },
  },
];

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/strategy/presets', (req, res) => {
  res.json({ presets: PRESETS });
});

app.post('/api/strategy/analyze', async (req, res) => {
  try {
    const { companyType, sector, location, problemStatement } = req.body;

    if (!problemStatement || !sector) {
      return res.status(400).json({ error: 'Sector and Problem statement are required fields.' });
    }

    const input: StrategyInput = {
      companyType: companyType || 'Early-stage Startup',
      sector: sector || 'FMCG',
      location: location || 'Tier-1 Indian Cities',
      problemStatement: problemStatement || 'Entering new category against established alternatives.',
    };

    const result = await StrategicEngine.analyze(input);
    return res.json(result);
  } catch (error: any) {
    console.error('Error analyzing strategy query:', error);
    return res.status(500).json({
      error: 'Failed to complete strategy analysis.',
      details: error?.message || 'Internal error',
    });
  }
});

// Vite middleware / static files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Strategic Direction Agent backend running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
