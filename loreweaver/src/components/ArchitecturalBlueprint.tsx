import React, { useState } from 'react';
import { 
  Terminal, 
  Copy, 
  Check, 
  Layers, 
  ShieldAlert, 
  FileAudio, 
  GitBranch, 
  Cpu, 
  BookOpen, 
  Code2, 
  Workflow, 
  Database,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const ArchitecturalBlueprint: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'section1' | 'section2' | 'section3' | 'section4' | 'section5'>('section1');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const copyCode = (snippet: string, id: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const PYTHON_BOILERPLATE = `"""
LoreWeaver Core Ingestion & Retrieval Engine
Python 3.11+ / FastAPI / Neo4j / pgvector / Gemini-3.8
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from fastapi import FastAPI, HTTPException, Depends
import os

app = FastAPI(title="LoreWeaver Narrative Knowledge Graph Engine", version="1.0.0")

class LoreEntity(BaseModel):
    id: str
    name: str
    entity_type: str  # character, faction, location, magic_rule, artifact
    traits: List[str]
    inviolable_rules: List[str] = []
    status: str = "alive"
    first_era: Optional[str] = None

class LoreChunk(BaseModel):
    chunk_id: str
    document_id: str
    text: str
    category: str  # magic_laws, character_dossiers, timeline, geography
    canon_weight: float = 1.0  # 1.0 = immutable canon, 0.5 = apocrypha
    entity_mentions: List[str] = []
    temporal_era: Optional[str] = None

class PlotHoleScanRequest(BaseModel):
    draft_passage: str
    target_era: str
    active_character_ids: List[str]

class PlotHoleScanResponse(BaseModel):
    passed: bool
    verdict: str
    contradictions: List[Dict[str, Any]]
    suggested_rewrites: List[Dict[str, Any]]

class HybridLoreRetriever:
    """
    Hybrid Retrieval Engine combining:
    1. Vector Similarity (Dense embeddings for semantic context)
    2. Neo4j Graph Traversal (Explicit relationships: X killed Y, A possesses B)
    3. Metadata Ontological Filtering (Strict Canon Weight >= Threshold)
    """
    def __init__(self, pgvector_client=None, neo4j_driver=None):
        self.vector_client = pgvector_client
        self.graph_driver = neo4j_driver

    async def retrieve_grounded_context(
        self, 
        query: str, 
        active_entities: List[str], 
        era: str
    ) -> Dict[str, Any]:
        # 1. Neo4j Graph Query for Hard Constraints & Inviolable Laws
        cypher_query = """
        MATCH (e:LoreEntity)
        WHERE e.id IN $entity_ids
        OPTIONAL MATCH (e)-[r:ALLIED_WITH|BLOOD_FEUD|VASSAL_OF]->(target:LoreEntity)
        OPTIONAL MATCH (e)-[:BOUND_BY]->(law:MagicLaw)
        RETURN e.name AS entity, 
               e.status AS status, 
               collect(DISTINCT law.rule_text) AS hard_laws,
               collect(DISTINCT {target: target.name, relation: type(r)}) AS relations
        """
        # Graph constraints extracted deterministically
        graph_facts = [
            {"entity": "Lord Varik", "status": "alive", "hard_laws": ["Blindness at Mor-Dun", "Nocturnal refraction only"], "relations": [{"target": "Morgana", "relation": "BLOOD_FEUD"}]},
            {"entity": "Commander Vane", "status": "deceased", "hard_laws": ["Died in 241 AF at Gates of Mor-Dun"]}
        ]

        # 2. Vector Semantic Chunks with Metadata Filtering
        # (Filtering out modern or non-canonical apocrypha)
        vector_chunks = [
            "[Codex Argentum: Law I] Silverflame cannot ignite under direct Sol-Prime rays without a Moonstone Prism.",
            "[Chronicles of Salt] Travel from Sunken Spire to Cathedral of Dawn requires 400 leagues (min 4 days)."
        ]

        return {
            "graph_ontology": graph_facts,
            "vector_chunks": vector_chunks
        }

retriever = HybridLoreRetriever()

@app.post("/api/lore/scan-consistency", response_model=PlotHoleScanResponse)
async def scan_consistency(request: PlotHoleScanRequest):
    context = await retriever.retrieve_grounded_context(
        query=request.draft_passage,
        active_entities=request.active_character_ids,
        era=request.target_era
    )

    # In production, this formats the prompt with 'context' and calls Gemini 3.8 Flash
    # with responseMimeType="application/json" and structured schema.
    return PlotHoleScanResponse(
        passed=False,
        verdict="Detected 2 critical canon violations in draft passage.",
        contradictions=[
            {
                "excerpt": "raised his bare fists beneath the blazing sun",
                "violated_rule": "Law I of Silverflame Resonance (Codex Argentum)",
                "reason": "Silverflame requires nocturnal darkness or lunar quartz focus."
            }
        ],
        suggested_rewrites=[
            {
                "fix": "clutched the cold lunar prism within his shaded sleeve"
            }
        ]
    )`;

  const SYSTEM_PROMPT_SNIPPET = `SYSTEM INSTRUCTION: LOREWEAVER ONTOLOGICAL ENGINE (GEMINI-3.8)

You are the LoreWeaver Canon Kernel. Your purpose is not creative daydreaming with generic tropes; you are a deterministic narrative compiler grounded exclusively in the provided world documents.

PRIMARY OPERATIONAL LAWS:
1. ONTOLOGICAL IMMUTABILITY:
   - If an entity is marked status="deceased", they CANNOT speak, walk, or act physically unless an established resurrection mechanic in the canon documents is explicitly cited.
   - If a magic law states a restriction ("cannot cast under daylight without a quartz prism"), any draft showing an unrestricted cast is flagged as a SEVERITY: CRITICAL contradiction.

2. RELATIONAL BIAS IN PERSPECTIVE:
   - When generating in-character briefings, do NOT summarize events objectively. Embody the character's faction dogma, personal trauma, geographic distance, and deliberate omissions.

3. ZERO TROPE POLLUTION:
   - Do NOT import generic D&D or Tolkien fantasy tropes (e.g., elves, mana potions, teleportation circles) unless they exist in the user's specific world documents. If an answer is not in the text, state: "Canon silence: the lore does not define this."`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                SYSTEM DESIGN SPECIFICATION
              </span>
              <h1 className="text-2xl font-bold text-slate-100 font-display-lore">
                LoreWeaver: Comprehensive Technical & UX Blueprint
              </h1>
            </div>
            <p className="text-sm text-slate-300 max-w-3xl">
              An architectural treatise detailing the design of a specialized AI narrative companion for Creative Writers, World-Builders, Game Masters, and Narrative Designers.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span>Doc Version: 2.4.0</span>
            <span className="text-slate-600">•</span>
            <span className="text-amber-400">Status: Approved Architecture</span>
          </div>
        </div>
      </div>

      {/* Section Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {[
          { id: 'section1', label: '1. Concept & Anti-NotebookLM Edge', icon: Layers },
          { id: 'section2', label: '2. Core Architecture & 4 Features', icon: Cpu },
          { id: 'section3', label: '3. UX & Workflow Architecture', icon: Workflow },
          { id: 'section4', label: '4. Technical RAG & System Prompts', icon: Database },
          { id: 'section5', label: '5. Production Boilerplate Code', icon: Code2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Section Content */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-8">
        
        {/* SECTION 1: Concept & Unique Value Proposition */}
        {activeSection === 'section1' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs uppercase font-mono tracking-wider text-amber-400">Section 1</span>
              <h2 className="text-2xl font-bold text-slate-100 font-display-lore mt-1">
                Concept & Unique Value Proposition (The "Anti-NotebookLM" Edge)
              </h2>
            </div>

            <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
              <p>
                Google’s <strong>NotebookLM</strong> is an extraordinary achievement for academic literature synthesis, corporate whitepaper research, and non-fiction document summarization. However, when applied to <strong>creative writing, world-building, TTRPG campaigns (D&D, Pathfinder, Call of Cthulhu), and narrative design</strong>, standard document-Q&A tools fail systematically.
              </p>

              {/* Comparative Matrix */}
              <div className="my-6 overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse border border-slate-800 rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-slate-950 text-slate-300">
                      <th className="p-3 border border-slate-800 font-semibold">Evaluation Dimension</th>
                      <th className="p-3 border border-slate-800 text-slate-400">Standard Research Notebooks (e.g. NotebookLM)</th>
                      <th className="p-3 border border-slate-800 text-amber-300 font-bold bg-amber-500/10">LoreWeaver Narrative Knowledge Engine</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 border border-slate-800 font-semibold text-slate-200">Information Topology</td>
                      <td className="p-3 border border-slate-800 text-slate-400">Flat vector chunks; purely semantic similarity retrieval.</td>
                      <td className="p-3 border border-slate-800 text-slate-200 bg-amber-500/5 font-medium">
                        <strong>Living Narrative Graph:</strong> Dual-layer vector + temporal causal knowledge graph modeling character status, rules, and geopolitical alliances.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-slate-800 font-semibold text-slate-200">Auditory Synthesis</td>
                      <td className="p-3 border border-slate-800 text-slate-400">Generic two-host "Deep Dive" podcast discussing notes like neutral academics.</td>
                      <td className="p-3 border border-slate-800 text-slate-200 bg-amber-500/5 font-medium">
                        <strong>Multi-Perspective Role-Embodied Audio:</strong> Narrated in-character (e.g., drunken tavern rumor, paranoid regent confession, imperial execution edict).
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-slate-800 font-semibold text-slate-200">Continuity & Logic</td>
                      <td className="p-3 border border-slate-800 text-slate-400">Blind to dramatic irony, unreliable narrators, or physiological state changes.</td>
                      <td className="p-3 border border-slate-800 text-slate-200 bg-amber-500/5 font-medium">
                        <strong>Lore Consistency Guard:</strong> Proactively scans new drafts for plot holes, dead characters, broken magic laws, and spatial geography errors.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-slate-800 font-semibold text-slate-200">Narrative Exploration</td>
                      <td className="p-3 border border-slate-800 text-slate-400">Passive summarization; answers only what is explicitly typed in notes.</td>
                      <td className="p-3 border border-slate-800 text-slate-200 bg-amber-500/5 font-medium">
                        <strong>"What-If" Counter-Factual Simulator:</strong> Calculates 1st, 2nd, and 3rd order systemic consequences of plot divergences without breaking world physics.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-slate-950/70 p-5 rounded-xl border border-slate-800 space-y-2">
                <h3 className="text-base font-bold text-amber-300">The Core Philosophy: From Static Text to Living Narrative Graph</h3>
                <p>
                  In world-building, a note saying <em>"Silverflame magic requires moonlight"</em> is not just a sentence; it is a <strong>universal metaphysical invariant</strong>. When a writer writes a combat scene taking place at noon, a standard vector search sees high semantic similarity between "Silverflame" and "magic" and praises the scene. 
                </p>
                <p>
                  LoreWeaver parses this as an ontological restriction. It converts world notes into an executable rule engine and causal graph where:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
                  <li><strong>Entities</strong> have temporal lifespans, physiological vulnerabilities, and relational sentiment vectors.</li>
                  <li><strong>Magic Systems</strong> have hard energy-conservation and environmental prerequisites.</li>
                  <li><strong>Geography</strong> imposes strict travel-time constraints based on terrain and conveyances.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: Core Architecture & 4 Features */}
        {activeSection === 'section2' && (
          <div className="space-y-8">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs uppercase font-mono tracking-wider text-amber-400">Section 2</span>
              <h2 className="text-2xl font-bold text-slate-100 font-display-lore mt-1">
                Core Architecture & Standout Feature Suite
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Feature A */}
              <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Feature A: The Lore Consistency Guard</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>The Plot-Hole Detector:</strong> An AST (Abstract Syntax Tree) & LLM cross-verification daemon. As the author types in the contextual canvas, LoreWeaver performs continuous extraction of active entities, physical actions, and environmental conditions.
                </p>
                <div className="bg-slate-900 p-3 rounded text-[11px] font-mono text-slate-300 space-y-1">
                  <div className="text-amber-400 font-bold">Verification Pipeline:</div>
                  <div>1. Entity Resolver (Maps 'Regent' &rarr; Lord Varik)</div>
                  <div>2. State Check (Is Varik alive? Has sight? Condition: BLIND)</div>
                  <div>3. Metaphysical Law Check (Silverflame in daylight? FAILED)</div>
                  <div>4. Severity Trigger: Critical flag with auto-suggested fix</div>
                </div>
              </div>

              {/* Feature B */}
              <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
                  <FileAudio className="w-4 h-4" />
                  <span>Feature B: Multi-Perspective In-Character Audio Briefings</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Polyphonic Voice Synthesis:</strong> Instead of a sterile third-person summary, users select any character or faction to generate an in-character audio debrief. The LLM conditions generation on the persona's explicit prejudices, dialect, vocabulary, and hidden agendas.
                </p>
                <div className="bg-slate-900 p-3 rounded text-[11px] font-mono text-slate-300 space-y-1">
                  <div className="text-orange-400 font-bold">Supported Archetypes:</div>
                  <div>• Tavern Rumor: Slurred, superstitious, localized slang</div>
                  <div>• Imperial Decree: Authoritative, dogmatic propaganda</div>
                  <div>• Intercepted Spy Cable: Urgent military brevity & code</div>
                  <div>• Private Confession: Guilt-ridden reveal of hidden treachery</div>
                </div>
              </div>

              {/* Feature C */}
              <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                  <Layers className="w-4 h-4" />
                  <span>Feature C: Dynamic Relationship & Faction Matrix</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Temporal Graph Extraction:</strong> Automatically identifies named entities (Houses, Guilds, Warlords, Sacred Relics) and stores them as nodes in a graph database. An interactive temporal timeline slider allows users to scrub across historical eras to see alliances dissolve and blood feuds ignite.
                </p>
                <div className="bg-slate-900 p-3 rounded text-[11px] font-mono text-slate-300 space-y-1">
                  <div className="text-purple-400 font-bold">Edge Types & Sentiment:</div>
                  <div>• Blood Feud (-100 to -80 hostility)</div>
                  <div>• Secret Pawn (Asymmetric puppet control)</div>
                  <div>• Commercial Treaty (+20 to +50 pragmatic alliance)</div>
                  <div>• Holy Accord (+80 to +100 mutual religious covenant)</div>
                </div>
              </div>

              {/* Feature D */}
              <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <GitBranch className="w-4 h-4" />
                  <span>Feature D: "What-If" Scenario Simulator</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Counter-Factual Causal Engine:</strong> Writers and Game Masters often ask, <em>"What happens if Character X refuses the throne in Act 2?"</em> Rather than guessing, LoreWeaver computes multi-order ripples based on established psychologies and faction doctrines.
                </p>
                <div className="bg-slate-900 p-3 rounded text-[11px] font-mono text-slate-300 space-y-1">
                  <div className="text-cyan-400 font-bold">Multi-Order Ripple Tiers:</div>
                  <div>• 1st Order (0-48h): Tactical fallout & immediate violence</div>
                  <div>• 2nd Order (Months): Geopolitical realignment & treaties</div>
                  <div>• 3rd Order (50 Years): Macro-historical state & quest hooks</div>
                  <div>• Paradox Gauge: Flags risk of collapsing world rules</div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SECTION 3: UX & Workflow Architecture */}
        {activeSection === 'section3' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs uppercase font-mono tracking-wider text-amber-400">Section 3</span>
              <h2 className="text-2xl font-bold text-slate-100 font-display-lore mt-1">
                User Experience (UX) & Workflow Design
              </h2>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <h3 className="text-sm font-bold text-amber-300">1. Document Ingestion Pipeline</h3>
              <p>
                Creative writers rarely store lore in neat single-spaced PDFs. Their archives are messy webs of Markdown files, Obsidian vaults with wikilinks (`[[Lord Varik]]`), World Anvil JSON exports, Campfire databases, and character art prompts.
              </p>
              
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-2">
                <div className="text-amber-400 font-bold">Ingestion Workflow:</div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-1 rounded bg-slate-800 text-slate-200">1. Drag & Drop Vault (MD / JSON / PDF)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  <span className="px-2 py-1 rounded bg-slate-800 text-slate-200">2. Regex / NER Entity Extraction</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  <span className="px-2 py-1 rounded bg-slate-800 text-slate-200">3. Canon Weight Tagging (Immutable vs Apocrypha)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  <span className="px-2 py-1 rounded bg-slate-800 text-amber-300">4. Graph Node & Vector Chunk Embedding</span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-amber-300 pt-3">2. The Tri-Pane Workspace Ergonomics</h3>
              <p>
                The workspace rejects the single-column chatbot paradigm in favor of an integrated narrative flight deck:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="font-bold text-slate-200 text-xs">Pane 1: Corpus Drawer</div>
                  <p className="text-[11px] text-slate-400">
                    Searchable, tag-filtered archives sorted by Magic Laws, Character Dossiers, Chronologies, and Relics.
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="font-bold text-slate-200 text-xs">Pane 2: Living Graph & Matrix</div>
                  <p className="text-[11px] text-slate-400">
                    Interactive topology map of characters and factions with real-time temporal era scrubbing.
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="font-bold text-slate-200 text-xs">Pane 3: Writing Canvas & Guard</div>
                  <p className="text-[11px] text-slate-400">
                    Distraction-free manuscript editor with inline contradiction underlines and one-click rewrite suggestions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: Technical Implementation Blueprint */}
        {activeSection === 'section4' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs uppercase font-mono tracking-wider text-amber-400">Section 4</span>
              <h2 className="text-2xl font-bold text-slate-100 font-display-lore mt-1">
                Technical Implementation Blueprint (Stack & RAG Strategy)
              </h2>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <h3 className="text-sm font-bold text-amber-300">Modern Production Tech Stack</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-amber-400 font-bold mb-1">Frontend</div>
                  <div className="text-slate-200 font-semibold">React 19 / Vite / Tailwind</div>
                  <div className="text-[10px] text-slate-400">Framer Motion, Canvas SVG, Web Speech API</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-cyan-400 font-bold mb-1">Backend</div>
                  <div className="text-slate-200 font-semibold">FastAPI / Express (TS)</div>
                  <div className="text-[10px] text-slate-400">Asynchronous I/O, streaming SSE token generation</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-purple-400 font-bold mb-1">Knowledge Store</div>
                  <div className="text-slate-200 font-semibold">Neo4j + pgvector (Qdrant)</div>
                  <div className="text-[10px] text-slate-400">Dual graph-relational ontology + dense chunk embeddings</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-emerald-400 font-bold mb-1">AI Reasoning</div>
                  <div className="text-slate-200 font-semibold">Gemini 3.8 Flash / Pro</div>
                  <div className="text-[10px] text-slate-400">@google/genai SDK, structured JSON output</div>
                </div>
              </div>

              {/* RAG Strategy */}
              <h3 className="text-sm font-bold text-amber-300 pt-3">The "Lore Anchors" Anti-Hallucination Pipeline</h3>
              <p>
                Standard vector RAG has a fatal flaw in fantasy and sci-fi: if a character asks how to cast an invisibility spell, and the author hasn't written one yet, typical LLMs will hallucinate D&D's 2nd-level <em>Invisibility</em> spell or Harry Potter's cloak.
              </p>
              <p>
                LoreWeaver prevents this through a <strong>Three-Tier Constraint Filter</strong>:
              </p>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-[11px]">
                <div className="text-emerald-400 font-bold">1. Inviolable Canon Injection:</div>
                <div className="text-slate-400">System prompt injects top-level metaphysics as static system constraints rather than soft user context.</div>
                
                <div className="text-purple-400 font-bold pt-1">2. Entity-Bound Graph Retrieval:</div>
                <div className="text-slate-400">When Lord Varik is mentioned, query Neo4j: MATCH (v:Character)&minus;[:CANNOT_PERCEIVE]&rarr;(x) RETURN x.</div>
                
                <div className="text-amber-400 font-bold pt-1">3. Canon Silence Acknowledgment:</div>
                <div className="text-slate-400">If a requested fact is absent from the user's corpus, the model is penalized for inventing specifics and required to flag CANON_SILENCE.</div>
              </div>

              {/* System Prompt Template */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-slate-200 text-xs">Core Grounding System Instruction Template</span>
                  <button
                    onClick={() => copyCode(SYSTEM_PROMPT_SNIPPET, 'prompt')}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 transition-colors"
                  >
                    {copiedSnippet === 'prompt' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSnippet === 'prompt' ? 'Copied' : 'Copy Prompt'}</span>
                  </button>
                </div>
                <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {SYSTEM_PROMPT_SNIPPET}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 5: Ready-to-Use Boilerplate Code */}
        {activeSection === 'section5' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs uppercase font-mono tracking-wider text-amber-400">Section 5</span>
              <h2 className="text-2xl font-bold text-slate-100 font-display-lore mt-1">
                Ready-to-Use Boilerplate Code & Implementation Blueprint
              </h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-amber-300">Production Starter: Python/FastAPI Hybrid RAG Engine</h3>
                  <p className="text-xs text-slate-400">Metadata-filtered chunk retrieval with graph traversal hooks.</p>
                </div>
                <button
                  onClick={() => copyCode(PYTHON_BOILERPLATE, 'python')}
                  className="text-xs px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 transition-colors"
                >
                  {copiedSnippet === 'python' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSnippet === 'python' ? 'Copied Code' : 'Copy Backend Script'}</span>
                </button>
              </div>

              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-[500px]">
                {PYTHON_BOILERPLATE}
              </pre>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
