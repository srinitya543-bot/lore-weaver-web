import React from 'react';
import { 
  Scroll, 
  Sparkles, 
  Layers, 
  BookOpen, 
  Compass, 
  Cpu, 
  SlidersHorizontal,
  ChevronDown,
  Terminal,
  ShieldCheck,
  Download
} from 'lucide-react';
import { LoreWorld } from '../types/lore';

interface HeaderProps {
  currentWorld: LoreWorld;
  allWorlds: LoreWorld[];
  onSelectWorld: (world: LoreWorld) => void;
  activeView: 'studio' | 'blueprint';
  onChangeView: (view: 'studio' | 'blueprint') => void;
  activeStudioTab: 'guard' | 'briefing' | 'matrix' | 'whatif' | 'oracle' | 'sources';
  onChangeStudioTab: (tab: 'guard' | 'briefing' | 'matrix' | 'whatif' | 'oracle' | 'sources') => void;
  serverOnline: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentWorld,
  allWorlds,
  onSelectWorld,
  activeView,
  onChangeView,
  activeStudioTab,
  onChangeStudioTab,
  serverOnline
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Brand Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-400/30">
              <Scroll className="w-5 h-5 text-amber-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display-lore text-xl font-bold tracking-wider text-amber-100">
                  LOREWEAVER
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Living Narrative Graph
                </span>
              </div>
              <p className="text-xs text-slate-400">
                AI World-Building Companion & Lore-Grounding Workbench
              </p>
            </div>
          </div>

          {/* World Selector & Engine Status */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* World Dropdown */}
            <div className="relative group">
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 hover:border-amber-500/50 transition-colors cursor-pointer">
                <Compass className="w-4 h-4 text-amber-400" />
                <div className="text-left">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Active World</div>
                  <div className="text-xs font-semibold text-slate-200 truncate max-w-[180px]">{currentWorld.name}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="absolute right-0 mt-1 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1 hidden group-hover:block z-50">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 border-b border-slate-800">
                  Switch Active Lore World
                </div>
                {allWorlds.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => onSelectWorld(w)}
                    className={`w-full text-left px-3 py-2 text-xs flex flex-col gap-0.5 hover:bg-slate-800 transition-colors ${
                      w.id === currentWorld.id ? 'bg-amber-500/10 text-amber-300 font-semibold' : 'text-slate-300'
                    }`}
                  >
                    <span>{w.name}</span>
                    <span className="text-[10px] text-slate-500">{w.genre}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* View Mode Toggle: Interactive Studio vs Full Architectural Blueprint */}
            <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => onChangeView('studio')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeView === 'studio'
                    ? 'bg-amber-500 text-slate-950 shadow font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive Studio</span>
              </button>
              <button
                onClick={() => onChangeView('blueprint')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeView === 'blueprint'
                    ? 'bg-amber-500 text-slate-950 shadow font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>System Blueprint & Specs</span>
              </button>
            </div>

            {/* Server Status Pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono bg-slate-900 border border-slate-800 text-slate-400">
              <span className={`w-2 h-2 rounded-full ${serverOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-500'}`} />
              <span>{serverOnline ? 'Gemini 3.8 Flash' : 'Deterministic Mode'}</span>
            </div>

            {/* Direct Download ZIP for VS Code Button */}
            <a
              href="/loreweaver-project.zip"
              download="loreweaver-project.zip"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all hover:scale-105"
              title="Download entire codebase as a .zip file to open in VS Code"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download ZIP (VS Code)</span>
            </a>
          </div>
        </div>

        {/* Feature Navigation Tabs when in Studio view */}
        {activeView === 'studio' && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between overflow-x-auto">
            <div className="flex items-center gap-1">
              <button
                onClick={() => onChangeStudioTab('guard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  activeStudioTab === 'guard'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Lore Consistency Guard</span>
                <span className="text-[10px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">Plot-Holes</span>
              </button>

              <button
                onClick={() => onChangeStudioTab('briefing')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  activeStudioTab === 'briefing'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span>In-Character Audio Briefings</span>
                <span className="text-[10px] px-1 py-0.2 rounded bg-orange-500/20 text-orange-300 font-mono">Audio POV</span>
              </button>

              <button
                onClick={() => onChangeStudioTab('matrix')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  activeStudioTab === 'matrix'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>Dynamic Relationship Matrix</span>
                <span className="text-[10px] px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono">Graph</span>
              </button>

              <button
                onClick={() => onChangeStudioTab('whatif')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  activeStudioTab === 'whatif'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>"What-If" Scenario Simulator</span>
                <span className="text-[10px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">Branches</span>
              </button>

              <button
                onClick={() => onChangeStudioTab('oracle')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  activeStudioTab === 'oracle'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>Grounded Lore Oracle</span>
              </button>

              <button
                onClick={() => onChangeStudioTab('sources')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  activeStudioTab === 'sources'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Scroll className="w-3.5 h-3.5 text-amber-400" />
                <span>Sources & Canon Documents ({currentWorld.documents.length})</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
