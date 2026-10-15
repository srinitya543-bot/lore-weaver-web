import React, { useState } from 'react';
import { 
  BookOpen, 
  Send, 
  Sparkles, 
  RefreshCw, 
  Quote, 
  ShieldCheck, 
  CheckCircle2, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { LoreWorld } from '../types/lore';
import { queryLoreOracle } from '../services/loreApi';

interface LoreOracleProps {
  world: LoreWorld;
}

const SAMPLE_QUESTIONS = [
  'Can a Silverflame sorcerer cast magic during daytime using a mirror?',
  'Why did Lord Varik lose his eyesight and how does he navigate now?',
  'Is Commander Brandon Vane alive in Year 242 AF?',
  'How long does it take an armored messenger to travel from Sunken Spire to the Cathedral?'
];

export const LoreOracle: React.FC<LoreOracleProps> = ({ world }) => {
  const [question, setQuestion] = useState(SAMPLE_QUESTIONS[0]);
  const [strictCanonOnly, setStrictCanonOnly] = useState(true);
  const [isQuerying, setIsQuerying] = useState(false);
  const [answerData, setAnswerData] = useState<{
    answer: string;
    confidenceScore: number;
    citations: Array<{ source: string; excerpt: string; relevance: string }>;
    unresolvedQuestions: string[];
    thematicCoherenceNote: string;
  } | null>(null);

  const handleQuery = async () => {
    setIsQuerying(true);
    const worldContext = world.documents.map(d => `[DOCUMENT: ${d.title} (${d.category})]\n${d.content}`).join('\n\n---\n\n');

    try {
      const res = await queryLoreOracle({
        question,
        worldContext,
        strictCanonOnly
      });
      setAnswerData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                CANON RAG ASSISTANT
              </span>
              <h2 className="text-xl font-bold text-slate-100 font-display-lore">
                Grounded Lore Oracle
              </h2>
            </div>
            <p className="text-sm text-slate-300 max-w-3xl">
              Query your custom lore corpus with absolute grounding. Every statement is verified against your uploaded documents, showing exact excerpt citations, confidence scores, and explicitly distinguishing between canon truth and canon silence.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400">Strict Canon Mode:</span>
            <button
              onClick={() => setStrictCanonOnly(!strictCanonOnly)}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                strictCanonOnly 
                  ? 'bg-emerald-500 text-slate-950 shadow' 
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {strictCanonOnly ? 'Strict (No Hallucination)' : 'Permissive (Lore-Grounded Inferences)'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Q&A Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Input & Presets (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                Ask Canon Query
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {world.documents.length} sources indexed
              </span>
            </div>

            {/* Presets */}
            <div className="space-y-1.5">
              <span className="text-xs text-slate-400 font-medium">Quick Prompts:</span>
              <div className="space-y-1">
                {SAMPLE_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuestion(q)}
                    className="w-full text-left p-2 rounded-lg text-xs bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 text-slate-300 transition-colors"
                  >
                    "{q}"
                  </button>
                ))}
              </div>
            </div>

            {/* Input textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Custom Question:
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={3}
                placeholder="Ask about magic laws, character relationships, battle dates..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none resize-none"
              />
            </div>

            <button
              onClick={handleQuery}
              disabled={isQuerying || !question.trim()}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isQuerying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Searching Canon Sources...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Consult Canon Oracle</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Answer & Citations (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl min-h-[460px] flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <span className="text-xs font-bold text-slate-200">Synthesized Canon Response</span>
                {answerData && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                    Grounding Confidence: {Math.round(answerData.confidenceScore * 100)}%
                  </span>
                )}
              </div>

              {!answerData && !isQuerying && (
                <div className="text-center py-20 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-emerald-400">
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-300">Awaiting Canon Inquiry</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Type a query or select a preset on the left to verify facts against your world's source documents.
                  </p>
                </div>
              )}

              {isQuerying && (
                <div className="text-center py-20 space-y-4">
                  <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-200">Parsing Corpus & Extracting Citations...</p>
                    <p className="text-xs text-slate-400">Filtering through {world.documents.length} canon documents.</p>
                  </div>
                </div>
              )}

              {answerData && (
                <div className="space-y-5">
                  {/* The Answer */}
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-sm leading-relaxed text-slate-200 font-serif-lore whitespace-pre-line">
                    {answerData.answer}
                  </div>

                  {/* Grounded Citations */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Quote className="w-3.5 h-3.5 text-emerald-400" />
                      Document Grounding Citations:
                    </div>
                    <div className="space-y-2">
                      {answerData.citations.map((cite, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs space-y-1">
                          <div className="flex items-center justify-between text-emerald-300 font-semibold">
                            <span>{cite.source}</span>
                            <span className="text-[10px] text-slate-500 font-mono">Excerpt Citation</span>
                          </div>
                          <div className="font-serif-lore italic text-slate-300 pl-2 border-l-2 border-emerald-500/40">
                            "{cite.excerpt}"
                          </div>
                          <div className="text-[10px] text-slate-400 pt-0.5">
                            <strong>Relevance:</strong> {cite.relevance}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Canon Silence / Unresolved questions */}
                  {answerData.unresolvedQuestions && answerData.unresolvedQuestions.length > 0 && (
                    <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-800/40 text-xs space-y-1">
                      <div className="font-semibold text-amber-300 flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5" /> Canon Silence Detected:
                      </div>
                      <p className="text-[11px] text-slate-300">
                        The current canon documents are silent on the following details:
                      </p>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-400">
                        {answerData.unresolvedQuestions.map((q, i) => (
                          <li key={i}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Meta */}
            <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Retrieval-Augmented Canon Synthesis</span>
              <span className="font-mono">Zero Outside Trope Contamination</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
