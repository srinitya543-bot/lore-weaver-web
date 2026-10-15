import React, { useState } from 'react';
import { 
  Cpu, 
  GitBranch, 
  GitFork, 
  AlertOctagon, 
  Sparkles, 
  RefreshCw, 
  Flame, 
  ChevronRight, 
  Compass, 
  Dice5,
  Lightbulb,
  ShieldCheck,
  Check
} from 'lucide-react';
import { LoreWorld, WhatIfSimulation } from '../types/lore';
import { simulateWhatIfScenario } from '../services/loreApi';

interface WhatIfSimulatorProps {
  world: LoreWorld;
}

const PRESET_HYPOTHESES = [
  {
    title: 'The Stolen Sight of Varik',
    divergence: 'Siege of Mor-Dun',
    hypothesis: 'What if Lord Varik secretly restored his eyesight using an illegal celestial moonstone shard instead of remaining blind?'
  },
  {
    title: 'The Surviving Commander',
    divergence: 'Night of Red Banners',
    hypothesis: 'What if Commander Brandon Vane was never killed at Mor-Dun, but was instead captured alive by the Silver Inquisition and turned into an inquisitorial thrall?'
  },
  {
    title: 'The Shattered Sunken Spire',
    divergence: 'Treaty of Salt Breakdown',
    hypothesis: 'What if the Sunken Spire broke the treaty and ignited Silverflame during a total solar eclipse, destroying the Greybridge checkpoint?'
  }
];

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({ world }) => {
  const [hypothesis, setHypothesis] = useState(PRESET_HYPOTHESES[0].hypothesis);
  const [divergencePoint, setDivergencePoint] = useState(PRESET_HYPOTHESES[0].divergence);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulation, setSimulation] = useState<WhatIfSimulation | null>(null);

  const handleSelectPreset = (p: typeof PRESET_HYPOTHESES[0]) => {
    setHypothesis(p.hypothesis);
    setDivergencePoint(p.divergence);
  };

  const handleSimulate = async () => {
    setIsSimulating(true);
    const worldContext = world.documents.map(d => `[${d.title}]\n${d.content}`).join('\n\n');

    try {
      const result = await simulateWhatIfScenario({
        hypothesis,
        worldContext,
        divergencePoint,
        primaryEntities: world.entities
      });
      setSimulation(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  const getParadoxColor = (rating: string) => {
    switch (rating) {
      case 'Low': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'High': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'Catastrophic': return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Feature Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5" />
                FEATURE D
              </span>
              <h2 className="text-xl font-bold text-slate-100 font-display-lore">
                "What-If" Narrative Branch Simulator
              </h2>
            </div>
            <p className="text-sm text-slate-300 max-w-3xl">
              Simulate counter-factual branches against your world's established rules and character psychologies. Compute multi-order ripple effects: immediate tactical fallout, secondary geopolitical realignment, and tertiary long-term macro shifts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Causality Mode:</span>
            <span className="px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-semibold">
              Deterministic World Physics
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Input & Presets Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <GitFork className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-200">Branch Divergence Setup</h3>
            </div>

            {/* Presets */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">
                Load Speculative Preset:
              </label>
              <div className="space-y-1.5">
                {PRESET_HYPOTHESES.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectPreset(p)}
                    className="w-full text-left p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 hover:border-cyan-500/40 text-xs transition-all group"
                  >
                    <div className="font-semibold text-slate-300 group-hover:text-cyan-300">
                      {p.title}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Pivot: {p.divergence}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Divergence Pivot point input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Divergence Anchor Point:
              </label>
              <input
                type="text"
                value={divergencePoint}
                onChange={(e) => setDivergencePoint(e.target.value)}
                placeholder="e.g. Chapter 4, Siege of Mor-Dun..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* Speculative Hypothesis */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Counter-Factual Hypothesis:
              </label>
              <textarea
                value={hypothesis}
                onChange={(e) => setHypothesis(e.target.value)}
                rows={4}
                placeholder="State the change in action, choice, or metaphysical anomaly..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none resize-none"
              />
            </div>

            {/* Simulate Button */}
            <button
              onClick={handleSimulate}
              disabled={isSimulating || !hypothesis.trim()}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Computing Causal Cascades...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Simulate Narrative Cascade</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output & Ripple Tree (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl min-h-[500px] flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400">
                    Temporal Divergence Matrix
                  </span>
                  <h3 className="text-base font-bold text-slate-100 font-display-lore">
                    {simulation ? `Simulation: ${divergencePoint}` : 'Hypothetical Cascade Tree'}
                  </h3>
                </div>
                {simulation && (
                  <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${getParadoxColor(simulation.paradoxRiskRating)}`}>
                    <AlertOctagon className="w-3.5 h-3.5" />
                    <span>Paradox Risk: {simulation.paradoxRiskRating}</span>
                  </div>
                )}
              </div>

              {/* Empty state */}
              {!simulation && !isSimulating && (
                <div className="text-center py-20 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-cyan-400">
                    <GitFork className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-300">Causal Engine Idle</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Formulate a narrative hypothesis on the left and simulate to view the structured 1st, 2nd, and 3rd order systemic consequences on world history, factions, and individual character psychologies.
                  </p>
                </div>
              )}

              {/* Loading */}
              {isSimulating && (
                <div className="text-center py-20 space-y-4">
                  <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin mx-auto" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-200">Simulating Causal Waves across {world.name}...</p>
                    <p className="text-xs text-slate-400">Validating against magic laws, travel distances, and psychological anchors.</p>
                  </div>
                </div>
              )}

              {/* Simulation Result */}
              {simulation && (
                <div className="space-y-6">
                  
                  {/* Hypothesis Card */}
                  <div className="p-3.5 rounded-lg bg-cyan-950/20 border border-cyan-800/40 text-xs">
                    <div className="font-semibold text-cyan-300 mb-0.5">Divergence Pivot:</div>
                    <div className="text-slate-300 font-serif-lore italic">"{simulation.hypothesis}"</div>
                  </div>

                  {/* Multi-Order Cascade Tree */}
                  <div className="space-y-3">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                      Multi-Order Causal Cascades:
                    </div>

                    {/* 1st Order: Immediate */}
                    <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                          1st-Order Tactical Ripples (Immediate / 0-7 Days)
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">Micro Level</span>
                      </div>
                      <div className="space-y-1.5">
                        {simulation.ripples.firstOrderImmediate.map((item, i) => (
                          <div key={i} className="text-xs text-slate-300 pl-3 border-l-2 border-amber-500/40 flex items-center justify-between gap-2">
                            <span>{item.event}</span>
                            <span className="text-[10px] text-slate-500 font-mono shrink-0">{item.timeframe}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 2nd Order: Factions */}
                    <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-purple-400" />
                          2nd-Order Faction & Geopolitical Realignment (Weeks / Months)
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">Meso Level</span>
                      </div>
                      <div className="space-y-2">
                        {simulation.ripples.secondOrderFactionShift.map((item, i) => (
                          <div key={i} className="p-2 rounded bg-slate-900/60 border border-slate-800 text-xs space-y-0.5">
                            <div className="flex items-center justify-between text-slate-200 font-semibold">
                              <span>{item.faction}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                {item.newStatus}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400">{item.strategicReaction}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 3rd Order: Long Term */}
                    <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-cyan-400" />
                          3rd-Order Macro Shift (Decades Later / 50-Year World State)
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">Macro Level</span>
                      </div>
                      <div className="space-y-1.5">
                        {simulation.ripples.thirdOrderLongTerm.map((item, i) => (
                          <div key={i} className="text-xs text-slate-300 pl-3 border-l-2 border-cyan-500/40 space-y-1">
                            <div className="font-semibold text-slate-200">{item.macroShift}</div>
                            <div className="text-[11px] text-slate-400 font-serif-lore italic">{item.worldState50YearsLater}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Character Arc Transformations */}
                  {simulation.characterFates.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                        Psychological & Arc Divergences:
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {simulation.characterFates.map((fate, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                            <span className="font-bold text-amber-300">{fate.character}</span>
                            <div className="text-slate-300 leading-snug">{fate.alteredFate}</div>
                            <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                              <strong>Psychological Shift:</strong> {fate.psychologicalShift}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Generated Plot & Quest Hooks */}
                  {simulation.narrativePlotHooks.length > 0 && (
                    <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                        <Dice5 className="w-4 h-4 text-emerald-400" />
                        <span>Generated Plot Hooks & TTRPG Campaign Encounters</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {simulation.narrativePlotHooks.map((hook, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <ChevronRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{hook}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>
              )}
            </div>

            {/* Bottom Meta */}
            <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Counter-Factual Branch Simulator</span>
              <span className="font-mono">Anti-NotebookLM Edge: Non-Linear Temporal Exploration</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
