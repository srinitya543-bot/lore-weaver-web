import React, { useState } from 'react';
import { 
  Layers, 
  GitCommit, 
  Clock, 
  ShieldAlert, 
  Swords, 
  Handshake, 
  Crown, 
  Sparkles, 
  Info,
  Sliders,
  ChevronRight,
  Filter
} from 'lucide-react';
import { LoreWorld, LoreEntity, LoreRelationship, EntityType } from '../types/lore';

interface FactionMatrixProps {
  world: LoreWorld;
}

export const FactionMatrix: React.FC<FactionMatrixProps> = ({ world }) => {
  const [selectedEraIndex, setSelectedEraIndex] = useState<number>(world.eras.length - 1);
  const [selectedEntity, setSelectedEntity] = useState<LoreEntity | null>(world.entities[0] || null);
  const [filterType, setFilterType] = useState<EntityType | 'all'>('all');
  const [viewMode, setViewMode] = useState<'network' | 'matrix'>('network');

  const currentEra = world.eras[selectedEraIndex];

  // Filter entities
  const visibleEntities = world.entities.filter(e => {
    if (filterType === 'all') return true;
    return e.type === filterType;
  });

  // Calculate dynamic relations for this era
  // We can vary the sentiment slightly or filter based on era
  const getEntityRelationships = (entityId: string) => {
    return world.relationships.filter(
      r => r.sourceId === entityId || r.targetId === entityId
    );
  };

  const getEntityName = (id: string) => {
    return world.entities.find(e => e.id === id)?.name || id;
  };

  // Color by entity type
  const getTypeColor = (type: EntityType) => {
    switch (type) {
      case 'character': return 'from-emerald-500 to-teal-700 text-emerald-300 border-emerald-500/40 bg-emerald-950/40';
      case 'faction': return 'from-purple-500 to-indigo-700 text-purple-300 border-purple-500/40 bg-purple-950/40';
      case 'artifact': return 'from-amber-500 to-yellow-700 text-amber-300 border-amber-500/40 bg-amber-950/40';
      case 'location': return 'from-sky-500 to-blue-700 text-sky-300 border-sky-500/40 bg-sky-950/40';
      case 'magic_system': return 'from-rose-500 to-pink-700 text-rose-300 border-rose-500/40 bg-rose-950/40';
      default: return 'from-slate-500 to-slate-700 text-slate-300 border-slate-500/40 bg-slate-950/40';
    }
  };

  const getRelationBadge = (relation: string) => {
    switch (relation) {
      case 'blood_feud':
        return { label: 'Blood Feud', icon: Swords, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
      case 'hostile':
        return { label: 'Hostile', icon: ShieldAlert, color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' };
      case 'allied':
        return { label: 'Allied', icon: Handshake, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
      case 'vassal':
        return { label: 'Vassal', icon: Crown, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' };
      case 'secret_pawn':
        return { label: 'Secret Pawn', icon: Sparkles, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' };
      case 'commercial_treaty':
        return { label: 'Trade Treaty', icon: Handshake, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' };
      default:
        return { label: relation, icon: GitCommit, color: 'text-slate-400 bg-slate-500/10 border-slate-500/30' };
    }
  };

  // Node coordinates on interactive SVG graph
  const nodePositions: Record<string, { x: number; y: number }> = {
    'ent-varik': { x: 180, y: 130 },
    'ent-morgana': { x: 520, y: 130 },
    'ent-sunken-spire': { x: 160, y: 290 },
    'ent-silver-inquisition': { x: 540, y: 290 },
    'ent-vael': { x: 350, y: 90 },
    'ent-guild-whispers': { x: 350, y: 230 },
    'ent-vane': { x: 260, y: 360 },
    'ent-obsidian-heart': { x: 350, y: 350 },
    // Sol-nexus nodes fallback
    'ent-kaelen': { x: 240, y: 200 },
    'ent-siobhan': { x: 460, y: 200 },
  };

  const factions = world.entities.filter(e => e.type === 'faction');

  return (
    <div className="space-y-6">
      {/* Feature Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                FEATURE C
              </span>
              <h2 className="text-xl font-bold text-slate-100 font-display-lore">
                Dynamic Relationship & Faction Matrix
              </h2>
            </div>
            <p className="text-sm text-slate-300 max-w-3xl">
              Knowledge is not flat text; it is an evolving causal graph. LoreWeaver continuously extracts entities (rulers, cabals, relics, cities) and models how their mutual sentiment, covenants, and hostilities transform across chronological eras.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode('network')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'network' ? 'bg-purple-600 text-white shadow font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Network Topology
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'matrix' ? 'bg-purple-600 text-white shadow font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tension Matrix Grid
            </button>
          </div>
        </div>
      </div>

      {/* Temporal Timeline Scrub Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Temporal Eras / Narrative Epoch:
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/40">
              {currentEra}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Scrub timeline to inspect alliance mutations and treaty shifts
          </span>
        </div>

        {/* Timeline Slider */}
        <div className="pt-2 px-2">
          <input
            type="range"
            min={0}
            max={world.eras.length - 1}
            value={selectedEraIndex}
            onChange={(e) => setSelectedEraIndex(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex justify-between text-[11px] text-slate-400 mt-2">
            {world.eras.map((era, i) => (
              <button
                key={i}
                onClick={() => setSelectedEraIndex(i)}
                className={`text-left transition-colors ${
                  i === selectedEraIndex ? 'text-purple-300 font-bold' : 'hover:text-slate-200'
                }`}
              >
                {era}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Graph & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left/Center Canvas (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col">
            
            {/* Graph Header & Filter Toolbar */}
            <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-400 font-medium">Filter Nodes:</span>
                {(['all', 'character', 'faction', 'artifact'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilterType(f)}
                    className={`text-[11px] px-2 py-0.5 rounded capitalize transition-colors ${
                      filterType === f
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="text-[11px] text-slate-500 font-mono">
                {visibleEntities.length} entities • {world.relationships.length} active covenants
              </div>
            </div>

            {/* Network Graph View */}
            {viewMode === 'network' ? (
              <div className="p-4 bg-slate-950/80 relative min-h-[440px] flex items-center justify-center overflow-hidden">
                <svg className="w-full h-[420px]" viewBox="0 0 700 420">
                  <defs>
                    <linearGradient id="hostileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f43f5e" />
                      <stop offset="100%" stopColor="#e11d48" />
                    </linearGradient>
                    <linearGradient id="alliedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>

                  {/* Draw Relationship Lines */}
                  {world.relationships.map((rel) => {
                    const src = nodePositions[rel.sourceId] || { x: 200, y: 200 };
                    const tgt = nodePositions[rel.targetId] || { x: 500, y: 200 };
                    const isBloodFeud = rel.relation === 'blood_feud' || rel.relation === 'hostile';
                    const isSelected = selectedEntity && (selectedEntity.id === rel.sourceId || selectedEntity.id === rel.targetId);

                    return (
                      <g key={rel.id}>
                        <line
                          x1={src.x}
                          y1={src.y}
                          x2={tgt.x}
                          y2={tgt.y}
                          stroke={isBloodFeud ? '#f43f5e' : '#8b5cf6'}
                          strokeWidth={isSelected ? 3 : 1.5}
                          strokeDasharray={rel.relation === 'secret_pawn' ? '4 4' : isBloodFeud ? '6 3' : 'none'}
                          opacity={isSelected ? 0.9 : 0.4}
                          className="transition-all duration-300"
                        />
                        {/* Midpoint relation badge */}
                        <circle
                          cx={(src.x + tgt.x) / 2}
                          cy={(src.y + tgt.y) / 2}
                          r={isSelected ? 5 : 3.5}
                          fill={isBloodFeud ? '#e11d48' : '#8b5cf6'}
                        />
                      </g>
                    );
                  })}

                  {/* Draw Entity Nodes */}
                  {visibleEntities.map((ent, idx) => {
                    const pos = nodePositions[ent.id] || { 
                      x: 100 + (idx % 3) * 220, 
                      y: 80 + Math.floor(idx / 3) * 140 
                    };
                    const isSelected = selectedEntity?.id === ent.id;

                    return (
                      <g
                        key={ent.id}
                        transform={`translate(${pos.x}, ${pos.y})`}
                        onClick={() => setSelectedEntity(ent)}
                        className="cursor-pointer group"
                      >
                        {/* Glow ring when selected */}
                        {isSelected && (
                          <circle
                            r="28"
                            fill="none"
                            stroke="#c084fc"
                            strokeWidth="2"
                            strokeDasharray="4 2"
                            className="animate-spin"
                            style={{ animationDuration: '10s' }}
                          />
                        )}

                        {/* Node circle */}
                        <circle
                          r="20"
                          fill="#0f172a"
                          stroke={
                            ent.type === 'faction' 
                              ? '#a855f7' 
                              : ent.type === 'character' 
                              ? '#10b981' 
                              : '#f59e0b'
                          }
                          strokeWidth={isSelected ? 3 : 2}
                          className="transition-all group-hover:scale-110"
                        />

                        {/* Node Icon letter */}
                        <text
                          textAnchor="middle"
                          dy=".3em"
                          fill="#f8fafc"
                          fontSize="10"
                          fontWeight="bold"
                          className="select-none pointer-events-none uppercase font-mono"
                        >
                          {ent.type[0]}
                        </text>

                        {/* Entity label pill */}
                        <rect
                          x="-55"
                          y="24"
                          width="110"
                          height="18"
                          rx="4"
                          fill="#090d16"
                          stroke={isSelected ? '#c084fc' : '#1e293b'}
                          strokeWidth="1"
                        />
                        <text
                          textAnchor="middle"
                          y="36"
                          fill={isSelected ? '#e9d5ff' : '#cbd5e1'}
                          fontSize="9"
                          fontWeight={isSelected ? 'bold' : 'normal'}
                          className="select-none pointer-events-none truncate"
                        >
                          {ent.name.length > 15 ? ent.name.slice(0, 14) + '...' : ent.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Graph Legend Overlay */}
                <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-lg p-2.5 text-[10px] space-y-1 text-slate-300">
                  <div className="font-semibold text-slate-400 uppercase tracking-wider font-mono">Legend:</div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400" /> <span>Faction</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 ml-2" /> <span>Character</span>
                    <span className="w-2 h-2 rounded-full bg-amber-400 ml-2" /> <span>Relic/Artifact</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
                    <span className="w-4 h-0.5 bg-rose-500" /> <span>Hostility/Feud</span>
                    <span className="w-4 h-0.5 bg-purple-500 ml-2" /> <span>Alliance/Treaty</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Heatmap Matrix Grid View */
              <div className="p-5 bg-slate-950/80 min-h-[440px] overflow-x-auto">
                <div className="text-xs font-semibold text-slate-300 mb-3">
                  Faction-to-Faction Tension Heatmap Matrix (-100 to +100 Sentiment)
                </div>
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 border border-slate-800 text-slate-400 bg-slate-900">Faction / Org</th>
                      {factions.map(f => (
                        <th key={f.id} className="p-2 border border-slate-800 text-slate-300 bg-slate-900 text-center font-semibold">
                          {f.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {factions.map(rowFaction => (
                      <tr key={rowFaction.id}>
                        <td className="p-2 border border-slate-800 font-semibold text-slate-200 bg-slate-900/60">
                          {rowFaction.name}
                        </td>
                        {factions.map(colFaction => {
                          if (rowFaction.id === colFaction.id) {
                            return (
                              <td key={colFaction.id} className="p-2 border border-slate-800 text-center bg-slate-900/30 text-slate-600">
                                —
                              </td>
                            );
                          }
                          const rel = world.relationships.find(
                            r => (r.sourceId === rowFaction.id && r.targetId === colFaction.id) ||
                                 (r.sourceId === colFaction.id && r.targetId === rowFaction.id)
                          );
                          const sentiment = rel ? rel.sentiment : 0;
                          const isHostile = sentiment < -20;
                          const isFriendly = sentiment > 20;

                          return (
                            <td
                              key={colFaction.id}
                              className={`p-2 border border-slate-800 text-center font-mono text-xs ${
                                isHostile 
                                  ? 'bg-rose-950/40 text-rose-300 font-bold' 
                                  : isFriendly 
                                  ? 'bg-emerald-950/40 text-emerald-300 font-bold' 
                                  : 'bg-slate-900/20 text-slate-400'
                              }`}
                            >
                              {sentiment > 0 ? `+${sentiment}` : sentiment}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </div>

        {/* Right Dossier Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl min-h-[440px] flex flex-col justify-between">
            {selectedEntity ? (
              <div className="space-y-4">
                {/* Dossier Header */}
                <div className="pb-3 border-b border-slate-800">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getTypeColor(selectedEntity.type)}`}>
                      {selectedEntity.type}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded capitalize ${
                      selectedEntity.status === 'alive' || selectedEntity.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}>
                      Status: {selectedEntity.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100 font-display-lore">
                    {selectedEntity.name}
                  </h3>
                  {selectedEntity.faction && (
                    <div className="text-xs text-slate-400 mt-0.5">
                      Affiliation: <span className="text-purple-300 font-semibold">{selectedEntity.faction}</span>
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div className="text-xs text-slate-300 leading-relaxed">
                  {selectedEntity.summary}
                </div>

                {/* Traits & Properties */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
                    Key Canonical Traits:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedEntity.traits.map((t, idx) => (
                      <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Inviolable Rules & Vulnerabilities */}
                {selectedEntity.rulesAndVulnerabilities && selectedEntity.rulesAndVulnerabilities.length > 0 && (
                  <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/40 text-xs space-y-1">
                    <div className="font-semibold text-amber-300 flex items-center gap-1 text-[11px]">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Canon Boundaries & Vulnerabilities:
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-300">
                      {selectedEntity.rulesAndVulnerabilities.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Connected Relationships in Graph */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
                    Direct Alliances & Feuds:
                  </div>
                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                    {getEntityRelationships(selectedEntity.id).map(r => {
                      const otherId = r.sourceId === selectedEntity.id ? r.targetId : r.sourceId;
                      const badge = getRelationBadge(r.relation);
                      const Icon = badge.icon;

                      return (
                        <div key={r.id} className="p-2 rounded bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between gap-2">
                          <div className="truncate">
                            <span className="font-medium text-slate-200">{getEntityName(otherId)}</span>
                            <div className="text-[10px] text-slate-400 truncate">{r.description}</div>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 border shrink-0 ${badge.color}`}>
                            <Icon className="w-3 h-3" />
                            {badge.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500 text-xs">
                Select any node on the graph to inspect its canonical dossier.
              </div>
            )}

            {/* Bottom Meta */}
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Ontological Graph Extractor</span>
              <span className="font-mono">Neo4j/GraphRAG Ready</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
