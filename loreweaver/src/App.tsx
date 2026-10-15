import React, { useState, useEffect } from 'react';
import { SAMPLE_WORLDS } from './data/sampleWorlds';
import { LoreWorld, LoreDocument } from './types/lore';
import { Header } from './components/Header';
import { ConsistencyGuard } from './components/ConsistencyGuard';
import { PerspectiveBriefing } from './components/PerspectiveBriefing';
import { FactionMatrix } from './components/FactionMatrix';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { LoreOracle } from './components/LoreOracle';
import { SourceDrawer } from './components/SourceDrawer';
import { ArchitecturalBlueprint } from './components/ArchitecturalBlueprint';

export default function App() {
  const [worlds, setWorlds] = useState<LoreWorld[]>(SAMPLE_WORLDS);
  const [activeWorldId, setActiveWorldId] = useState<string>(SAMPLE_WORLDS[0].id);
  const [activeView, setActiveView] = useState<'studio' | 'blueprint'>('studio');
  const [activeStudioTab, setActiveStudioTab] = useState<'guard' | 'briefing' | 'matrix' | 'whatif' | 'oracle' | 'sources'>('guard');
  const [serverOnline, setServerOnline] = useState<boolean>(true);

  const currentWorld = worlds.find(w => w.id === activeWorldId) || worlds[0];

  useEffect(() => {
    // Check server health gracefully
    fetch('/api/health')
      .then(res => {
        if (!res.ok) throw new Error('Static host or server unavailable');
        return res.json();
      })
      .then(data => {
        setServerOnline(!!data?.hasApiKey);
      })
      .catch(() => {
        setServerOnline(false);
      });
  }, []);

  // Ingest new document into active world
  const handleAddDocument = (newDoc: LoreDocument) => {
    setWorlds(prevWorlds => 
      prevWorlds.map(w => {
        if (w.id === currentWorld.id) {
          return {
            ...w,
            documents: [newDoc, ...w.documents]
          };
        }
        return w;
      })
    );
  };

  // Delete document from active world
  const handleDeleteDocument = (docId: string) => {
    setWorlds(prevWorlds => 
      prevWorlds.map(w => {
        if (w.id === currentWorld.id) {
          return {
            ...w,
            documents: w.documents.filter(d => d.id !== docId)
          };
        }
        return w;
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Universal Header with Navigation, Mode Switcher, and World Selector */}
      <Header
        currentWorld={currentWorld}
        allWorlds={worlds}
        onSelectWorld={(w) => setActiveWorldId(w.id)}
        activeView={activeView}
        onChangeView={setActiveView}
        activeStudioTab={activeStudioTab}
        onChangeStudioTab={setActiveStudioTab}
        serverOnline={serverOnline}
      />

      {/* Main Body View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeView === 'blueprint' ? (
          /* Full Exhaustive 5-Section Lead Architect Specification Document */
          <ArchitecturalBlueprint />
        ) : (
          /* Live Functional Interactive Studio Suite */
          <div>
            {activeStudioTab === 'guard' && <ConsistencyGuard world={currentWorld} />}
            {activeStudioTab === 'briefing' && <PerspectiveBriefing world={currentWorld} />}
            {activeStudioTab === 'matrix' && <FactionMatrix world={currentWorld} />}
            {activeStudioTab === 'whatif' && <WhatIfSimulator world={currentWorld} />}
            {activeStudioTab === 'oracle' && <LoreOracle world={currentWorld} />}
            {activeStudioTab === 'sources' && (
              <SourceDrawer 
                world={currentWorld} 
                onAddDocument={handleAddDocument}
                onDeleteDocument={handleDeleteDocument}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-display-lore font-bold text-amber-400">LoreWeaver</span>
            <span>• Next-Gen Knowledge Synthesis & Causal Narrative Companion</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
            <span>Powered by Gemini 3.8 Flash</span>
            <span>•</span>
            <span>Ontological Guard Engine</span>
            <span>•</span>
            <span>Vector + Graph Hybrid</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
