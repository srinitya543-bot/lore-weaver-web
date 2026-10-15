export type EntityType = 'character' | 'faction' | 'location' | 'magic_system' | 'artifact' | 'event';

export type RelationshipType = 
  | 'allied' 
  | 'hostile' 
  | 'vassal' 
  | 'secret_pawn' 
  | 'blood_feud' 
  | 'commercial_treaty' 
  | 'worships' 
  | 'wields';

export interface LoreEntity {
  id: string;
  name: string;
  type: EntityType;
  faction?: string;
  summary: string;
  traits: string[];
  status: 'alive' | 'deceased' | 'lost' | 'dormant' | 'active';
  rulesAndVulnerabilities?: string[];
  firstAppearanceEra?: string;
}

export interface LoreRelationship {
  id: string;
  sourceId: string;
  targetId: string;
  relation: RelationshipType;
  description: string;
  sentiment: number; // -100 to 100
  era?: string;
}

export interface LoreDocument {
  id: string;
  title: string;
  category: 'Magic Laws' | 'Character Dossiers' | 'Historical Chronicles' | 'Geography & Kingdoms' | 'Artifacts';
  tags: string[];
  content: string;
  canonStatus: 'immutable_canon' | 'working_draft' | 'unreliable_apocrypha';
  dateModified?: string;
  wordCount?: number;
}

export interface ConsistencyIssue {
  id: string;
  severity: 'critical' | 'warning' | 'note';
  flaggedExcerpt: string;
  contradictedRule: string;
  sourceCitation: string;
  explanation: string;
  suggestedFix: string;
}

export interface ConsistencyReport {
  passed: boolean;
  overallVerdict: string;
  issues: ConsistencyIssue[];
  lorePraise: string[];
}

export interface InCharacterBriefing {
  id: string;
  title: string;
  speakerName: string;
  speakerRole: string;
  faction: string;
  format: 'Tavern Rumor' | 'Imperial Decree' | 'Intercepted Courier Dispatch' | 'Private Confession' | 'High Council Debrief';
  monologue: string;
  hiddenSubtext: string;
  keyFactionsImplicated: string[];
  estimatedSpeakingTimeSeconds: number;
}

export interface WhatIfSimulation {
  id: string;
  hypothesis: string;
  divergenceSummary: string;
  divergencePoint: string;
  paradoxRiskRating: 'Low' | 'Medium' | 'High' | 'Catastrophic';
  ripples: {
    firstOrderImmediate: Array<{
      event: string;
      timeframe: string;
      impactLevel: 'High' | 'Medium' | 'Low';
    }>;
    secondOrderFactionShift: Array<{
      faction: string;
      newStatus: string;
      strategicReaction: string;
    }>;
    thirdOrderLongTerm: Array<{
      macroShift: string;
      worldState50YearsLater: string;
    }>;
  };
  characterFates: Array<{
    character: string;
    alteredFate: string;
    psychologicalShift: string;
  }>;
  narrativePlotHooks: string[];
}

export interface LoreWorld {
  id: string;
  name: string;
  genre: string;
  tagline: string;
  description: string;
  eras: string[];
  documents: LoreDocument[];
  entities: LoreEntity[];
  relationships: LoreRelationship[];
  sampleDrafts: Array<{
    id: string;
    title: string;
    sceneDescription: string;
    hasErrors: boolean;
    text: string;
  }>;
}
