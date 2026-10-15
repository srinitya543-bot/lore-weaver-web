import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  Eye, 
  ShieldAlert, 
  User, 
  Compass, 
  RefreshCw,
  Copy,
  Check,
  Radio,
  FileAudio
} from 'lucide-react';
import { LoreWorld, InCharacterBriefing } from '../types/lore';
import { generateInCharacterBriefing } from '../services/loreApi';

interface PerspectiveBriefingProps {
  world: LoreWorld;
}

const TONE_FORMATS = [
  { id: 'Tavern Rumor', label: 'Tavern Rumors & Whispers', desc: 'Slurred gossip, exaggerated threats, commoner slang' },
  { id: 'Imperial Decree', label: 'Imperial / Cathedral Decree', desc: 'Authoritative, dogmatic state propaganda, lawful intimidation' },
  { id: 'Intercepted Courier Dispatch', label: 'Intercepted Spy Cable', desc: 'Coded, urgent military notations, frantic brevity' },
  { id: 'Private Confession', label: 'Dying / Private Confession', desc: 'Vulnerable, guilt-ridden, exposing secret treason' },
  { id: 'High Council Debrief', label: 'War Room Council Debrief', desc: 'Cold, calculating geopolitical triage' }
] as const;

export const PerspectiveBriefing: React.FC<PerspectiveBriefingProps> = ({ world }) => {
  // Available speakers based on entities in the active world
  const characters = world.entities.filter(e => e.type === 'character');
  
  const [selectedSpeaker, setSelectedSpeaker] = useState(characters[0]?.name || 'Lord Regent Varik');
  const [selectedFormat, setSelectedFormat] = useState<'Tavern Rumor' | 'Imperial Decree' | 'Intercepted Courier Dispatch' | 'Private Confession' | 'High Council Debrief'>('Tavern Rumor');
  const [targetEvent, setTargetEvent] = useState('The forbidden daylight casting at Greybridge and the missing Obsidian Heart');
  const [isGenerating, setIsGenerating] = useState(false);
  const [briefing, setBriefing] = useState<InCharacterBriefing | null>(null);
  const [copied, setCopied] = useState(false);

  // Audio Playback State (Web Speech API)
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [voicePitch, setVoicePitch] = useState(0.9);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSupported(true);
    }
  }, []);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);

    const charObj = world.entities.find(e => e.name === selectedSpeaker);
    const worldContext = world.documents.map(d => `${d.title}:\n${d.content}`).join('\n\n');

    try {
      const result = await generateInCharacterBriefing({
        speakerName: selectedSpeaker,
        speakerRole: charObj?.traits.join(', ') || 'Narrative Figure',
        faction: charObj?.faction || 'Independent',
        toneFormat: selectedFormat,
        targetEvent,
        worldContext
      });
      setBriefing(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlayAudio = () => {
    if (!speechSupported || !briefing) return;

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      return;
    }

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(briefing.monologue);
    utterance.rate = speechRate;
    utterance.pitch = voicePitch;

    // Pick a voice that fits the format if available
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      // Find english voice
      const enVoices = voices.filter(v => v.lang.startsWith('en'));
      if (enVoices.length > 0) {
        utterance.voice = enVoices[0];
      }
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleStopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const copyTranscript = () => {
    if (!briefing) return;
    navigator.clipboard.writeText(`[${briefing.title}]\nNarrated by: ${briefing.speakerName} (${briefing.format})\n\n${briefing.monologue}\n\nSubtext: ${briefing.hiddenSubtext}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/30 flex items-center gap-1.5">
                <FileAudio className="w-3.5 h-3.5" />
                FEATURE B
              </span>
              <h2 className="text-xl font-bold text-slate-100 font-display-lore">
                Multi-Perspective "In-Character" Audio/Text Briefings
              </h2>
            </div>
            <p className="text-sm text-slate-300 max-w-3xl">
              Replace sterile third-person summaries with raw narrative embodiment. Hear how the events of your world sound when told through the lips of a paranoid blind regent, a fanatical inquisitor, or a tavern drunkard harboring dangerous secrets.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Format Paradigm:</span>
            <span className="px-3 py-1 rounded-lg bg-orange-500/10 text-orange-300 border border-orange-500/30 text-xs font-semibold">
              Subjective & Unreliable POV
            </span>
          </div>
        </div>
      </div>

      {/* Configuration & Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Settings Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Radio className="w-4 h-4 text-orange-400" />
              <h3 className="text-sm font-bold text-slate-200">Perspective Parameters</h3>
            </div>

            {/* Select Speaker */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-orange-400" /> Choose Speaker / Entity:
              </label>
              <select
                value={selectedSpeaker}
                onChange={(e) => setSelectedSpeaker(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-orange-500 focus:outline-none"
              >
                {characters.map(c => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.faction || 'Independent'})
                  </option>
                ))}
              </select>
            </div>

            {/* Select Format / Voice Tone */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-orange-400" /> Narrative Tone & Format:
              </label>
              <div className="space-y-1.5">
                {TONE_FORMATS.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFormat(f.id as any)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all ${
                      selectedFormat === f.id
                        ? 'bg-orange-500/15 border-orange-500/60 text-orange-200 font-medium'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-slate-200">{f.label}</div>
                    <div className="text-[10px] text-slate-400">{f.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Event / Topic prompt */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Target World Event / Topic:
              </label>
              <textarea
                value={targetEvent}
                onChange={(e) => setTargetEvent(e.target.value)}
                rows={3}
                placeholder="Describe what event, treaty, murder, or legend the speaker is reacting to..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:border-orange-500 focus:outline-none resize-none"
              />
            </div>

            {/* Generate Action Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !targetEvent.trim()}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Weaving Character Voice...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Synthesize In-Character Audio Briefing</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output & Audio Player Panel (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl min-h-[500px] flex flex-col justify-between">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-orange-400">
                    {briefing ? briefing.format : 'Awaiting Generation'}
                  </span>
                  <h3 className="text-base font-bold text-slate-100 font-display-lore">
                    {briefing ? briefing.title : 'Generated Voice Monologue'}
                  </h3>
                </div>
                {briefing && (
                  <button
                    onClick={copyTranscript}
                    className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Dispatch'}</span>
                  </button>
                )}
              </div>

              {/* Empty placeholder */}
              {!briefing && !isGenerating && (
                <div className="text-center py-20 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-orange-400">
                    <FileAudio className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-300">Ready to Broadcast</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Select a character and format on the left, then click Synthesize to generate an in-character audio debrief or tavern dispatch grounded in your world's lore.
                  </p>
                </div>
              )}

              {/* Generating state */}
              {isGenerating && (
                <div className="text-center py-20 space-y-4">
                  <RefreshCw className="w-10 h-10 text-orange-400 animate-spin mx-auto" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-200">Channeling {selectedSpeaker}'s Voice...</p>
                    <p className="text-xs text-slate-400">Applying character grudges, vocabulary cadence, and hidden subtext.</p>
                  </div>
                </div>
              )}

              {/* Active Briefing Display */}
              {briefing && (
                <div className="space-y-6">
                  {/* Audio Synthesizer & Visualizer Player Card */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-inner">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handlePlayAudio}
                        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
                          isPlaying 
                            ? 'bg-orange-500 text-slate-950 ring-4 ring-orange-500/20' 
                            : 'bg-slate-800 hover:bg-slate-700 text-orange-400 border border-slate-700'
                        }`}
                        title={isPlaying ? 'Pause narration' : 'Play audio narration'}
                      >
                        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current translate-x-0.5" />}
                      </button>

                      {/* Animated Audio Visualizer Waveform */}
                      <div className="flex items-center gap-1 h-8 px-2">
                        {[18, 36, 12, 45, 28, 60, 32, 50, 20, 68, 40, 25, 55, 30, 48, 15].map((h, i) => (
                          <div
                            key={i}
                            className={`w-1 rounded-full transition-all duration-150 ${
                              isPlaying ? 'bg-orange-400 animate-pulse' : 'bg-slate-700'
                            }`}
                            style={{
                              height: isPlaying ? `${Math.max(6, (h * (0.5 + Math.random() * 0.7)))}px` : '6px',
                              animationDelay: `${i * 0.08}s`
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Speed & Pitch Controls */}
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono uppercase">Speed:</span>
                        <select
                          value={speechRate}
                          onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                          className="bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-slate-200"
                        >
                          <option value="0.8">0.8x (Deliberate)</option>
                          <option value="1.0">1.0x (Normal)</option>
                          <option value="1.2">1.2x (Urgent)</option>
                        </select>
                      </div>

                      <button
                        onClick={handleStopAudio}
                        className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                        title="Reset narration"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* The Spoken Monologue */}
                  <div className="bg-slate-950/70 p-5 rounded-xl border border-slate-800 space-y-3">
                    <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                      <span>VOICE RECORDING TRANSCRIPTION</span>
                      <span>Est. Duration: ~{briefing.estimatedSpeakingTimeSeconds}s</span>
                    </div>
                    <div className="font-serif-lore text-slate-200 text-base leading-relaxed whitespace-pre-line border-l-2 border-orange-500/60 pl-4 py-1 italic">
                      "{briefing.monologue}"
                    </div>
                  </div>

                  {/* Hidden Subtext & Propaganda Angle */}
                  <div className="p-4 rounded-xl bg-orange-950/20 border border-orange-800/40 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-orange-300">
                      <Eye className="w-4 h-4 text-orange-400" />
                      <span>Hidden Subtext, Motives & Omissions (DM / Writer Lore Insight)</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {briefing.hiddenSubtext}
                    </p>
                    <div className="pt-2 flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono uppercase text-slate-400">Implicated Factions:</span>
                      {briefing.keyFactionsImplicated.map((f, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-orange-500/10 text-orange-300 border border-orange-500/30">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Meta */}
            <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Persona-Conditioned Latent Synthesis</span>
              <span className="font-mono">Anti-NotebookLM Edge: Polyphonic Lore Extraction</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
