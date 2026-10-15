import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));

// Shared Gemini AI instance
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!ai,
    engine: 'LoreWeaver System Engine v1.0',
    model: 'gemini-3.8-flash',
  });
});

// Direct zip download endpoint for VS Code export
app.get(['/loreweaver-project.zip', '/download-zip'], (req, res) => {
  const filePath = path.resolve(__dirname, 'loreweaver-project.zip');
  res.download(filePath, 'loreweaver-project.zip');
});

// API: Lore Consistency Guard (Plot-Hole Detector)
app.post('/api/lore/guard', async (req, res) => {
  try {
    const { draftText, worldContext, canonRules, activeEntities } = req.body;

    if (!draftText) {
      return res.status(400).json({ error: 'draftText is required' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key not configured on server',
        fallbackAvailable: true,
      });
    }

    const systemInstruction = `You are LoreWeaver's Lore Consistency Guard (Plot-Hole & World-Rule Detector).
Your job is to rigorously cross-examine the writer's new draft passage against the established world canon, magic laws, character sheets, and timelines.
DO NOT judge prose style or grammar; focus strictly on:
1. Hard Canon Violations (e.g. character using magic forbidden in their class, character being alive when deceased in canon, broken geography/travel times).
2. Soft Continuity Inconsistencies (e.g. character attitude contradicting past betrayal, wrong relic bearer, broken timeline sequencing).
3. Tone / Metaphysical Drift (e.g. introducing modern technology or out-of-system magic).

Output your evaluation strictly in valid JSON matching this schema:
{
  "passed": boolean,
  "overallVerdict": string, // 1-2 sentence executive summary
  "issues": [
    {
      "id": string,
      "severity": "critical" | "warning" | "note",
      "flaggedExcerpt": string, // exact substring from draft
      "contradictedRule": string, // canon principle or fact violated
      "sourceCitation": string, // which lore document or entry was violated
      "explanation": string, // why this breaks internal world logic
      "suggestedFix": string // specific lore-compliant narrative rewrite
    }
  ],
  "lorePraise": [
    string // 1-2 positive observations where the draft adhered faithfully to subtle lore mechanics
  ]
}`;

    const prompt = `ESTABLISHED LORE DOCUMENTS & CANON:
${worldContext || 'Standard fantasy realm laws apply.'}

CANON LAWS & BOUNDARIES:
${canonRules ? JSON.stringify(canonRules, null, 2) : 'No explicit rules passed'}

ACTIVE ENTITIES IN SCENE:
${activeEntities ? JSON.stringify(activeEntities, null, 2) : 'All entities'}

NEW DRAFT PASSAGE TO SCAN:
"""
${draftText}
"""

Scan the draft passage against canon. Return JSON only.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Lore Guard Error:', error);
    res.status(500).json({ error: error.message || 'Failed to scan lore consistency' });
  }
});

// API: In-Character Multi-Perspective Briefing
app.post('/api/lore/briefing', async (req, res) => {
  try {
    const { speakerName, speakerRole, faction, toneFormat, targetEvent, worldContext } = req.body;

    if (!speakerName || !targetEvent) {
      return res.status(400).json({ error: 'speakerName and targetEvent are required' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key not configured on server',
        fallbackAvailable: true,
      });
    }

    const systemInstruction = `You are LoreWeaver's In-Character Perspective Synthesizer.
Instead of a generic documentary or sterile summary, you write directly FROM THE VOICE, BIASES, SECRETS, AND VOCABULARY of the specified character/faction.
The character has limited knowledge, personal grudges, selective memory, and distinctive colloquialisms.
Formats include:
- 'Tavern Rumor': Slurred gossip, whispered warnings, exaggerated claims, local slang.
- 'Imperial Decree': Authoritative, legalistic, ominous, state-approved propaganda.
- 'Intercepted Courier Dispatch': Coded, frantic, cyphered notations, military brevity.
- 'Private Confession': Vulnerable, guilty, revealing hidden motives or betrayal.
- 'High Council Debrief': Calculating, pragmatic, prioritizing kingdom stakes over individual lives.

Return valid JSON with:
{
  "title": string,
  "speakerPersona": string,
  "format": string,
  "monologue": string, // The in-character spoken/written text (2-3 immersive paragraphs)
  "hiddenSubtext": string, // What the speaker is deliberately hiding or spinning
  "keyFactionsImplicated": string[],
  "estimatedSpeakingTimeSeconds": number
}`;

    const prompt = `WORLD CANON & BACKGROUND:
${worldContext}

SPEAKER DETAILS:
- Name: ${speakerName}
- Role/Title: ${speakerRole || 'Notable Figure'}
- Affiliation/Faction: ${faction || 'Independent'}
- Requested Format/Tone: ${toneFormat || 'Tavern Rumor'}

EVENT OR SUBJECT BEING DISCUSSED:
"""
${targetEvent}
"""

Deliver the immersive monologue in valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Briefing Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate briefing' });
  }
});

// API: What-If Narrative Branch Simulator
app.post('/api/lore/whatif', async (req, res) => {
  try {
    const { hypothesis, worldContext, primaryEntities, divergencePoint } = req.body;

    if (!hypothesis) {
      return res.status(400).json({ error: 'hypothesis is required' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key not configured on server',
        fallbackAvailable: true,
      });
    }

    const systemInstruction = `You are LoreWeaver's "What-If" Narrative Branch Simulator.
You take a hypothetical divergence from established lore and compute systemic multi-order ripple effects.
Ground your simulation strictly in the established world laws, character psychologies, faction doctrines, and magical consequences.
Never fall back to generic cliches; adhere to internal causal mechanics.

Return valid JSON:
{
  "hypothesis": string,
  "divergenceSummary": string,
  "paradoxRiskRating": "Low" | "Medium" | "High" | "Catastrophic",
  "ripples": {
    "firstOrderImmediate": [
      { "event": string, "timeframe": string, "impactLevel": "High" | "Medium" | "Low" }
    ],
    "secondOrderFactionShift": [
      { "faction": string, "newStatus": string, "strategicReaction": string }
    ],
    "thirdOrderLongTerm": [
      { "macroShift": string, "worldState50YearsLater": string }
    ]
  },
  "characterFates": [
    { "character": string, "alteredFate": string, "psychologicalShift": string }
  ],
  "narrativePlotHooks": [
    string // 3 intriguing story hooks or quest prompts emerging from this timeline
  ]
}`;

    const prompt = `ESTABLISHED WORLD CANON:
${worldContext}

DIVERGENCE POINT:
${divergencePoint || 'Canon Chapter Pivot'}

SPECULATIVE HYPOTHESIS:
"""
${hypothesis}
"""

PRIMARY ENTITIES INVOLVED:
${primaryEntities ? JSON.stringify(primaryEntities) : 'All primary entities'}

Calculate the full causal cascade in valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('What-If Simulator Error:', error);
    res.status(500).json({ error: error.message || 'Failed to simulate scenario' });
  }
});

// API: Lore Oracle (Grounded RAG Query)
app.post('/api/lore/query', async (req, res) => {
  try {
    const { question, worldContext, strictCanonOnly } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'question is required' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key not configured on server',
        fallbackAvailable: true,
      });
    }

    const systemInstruction = `You are LoreWeaver's Lore Oracle.
You answer user questions strictly grounded in the provided world lore documents.
Rules:
1. If the information is explicitly in the lore, answer thoroughly and cite the document/rule.
2. If the lore is silent or ambiguous on a point, explicitly state: "Canon silence: the lore does not define this." Then offer 2 lore-coherent hypotheses that fit the world's thematic rules.
3. NEVER invent facts that contradict established rules.
4. Output JSON:
{
  "answer": string,
  "confidenceScore": number, // 0.0 to 1.0
  "citations": [
    { "source": string, "excerpt": string, "relevance": string }
  ],
  "unresolvedQuestions": [string],
  "thematicCoherenceNote": string
}`;

    const prompt = `CANON SOURCES & DOCUMENTS:
${worldContext}

STRICT CANON ONLY: ${strictCanonOnly ? 'YES - Do not extrapolate beyond provided text' : 'NO - Lore-grounded extrapolation permitted'}

USER QUERY:
"""
${question}
"""

Respond in JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Lore Query Error:', error);
    res.status(500).json({ error: error.message || 'Failed to query lore' });
  }
});

// Vite Middleware mounting
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Fallback for HTML5 SPA routing in dev
    app.use('*', async (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        if (vite) vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LoreWeaver full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
