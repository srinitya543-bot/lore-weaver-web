import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Info, 
  Sparkles, 
  Wand2, 
  BookMarked, 
  CheckCircle2, 
  RefreshCw, 
  ArrowRight,
  FileText,
  Copy,
  Check
} from 'lucide-react';
import { LoreWorld, ConsistencyReport, ConsistencyIssue } from '../types/lore';
import { checkLoreConsistency } from '../services/loreApi';

interface ConsistencyGuardProps {
  world: LoreWorld;
}

export const ConsistencyGuard: React.FC<ConsistencyGuardProps> = ({ world }) => {
  const [selectedDraftId, setSelectedDraftId] = useState<string>(world.sampleDrafts[0]?.id || '');
  const [draftText, setDraftText] = useState<string>(world.sampleDrafts[0]?.text || '');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [report, setReport] = useState<ConsistencyReport | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedIssue, setSelectedIssue] = useState<ConsistencyIssue | null>(null);

  // Switch preset draft
  const handleSelectPreset = (draftId: string) => {
    const found = world.sampleDrafts.find(d => d.id === draftId);
    if (found) {
      setSelectedDraftId(draftId);
      setDraftText(found.text);
      setReport(null);
      setSelectedIssue(null);
    }
  };

  // Run the consistency scan
  const handleScan = async () => {
    setIsScanning(true);
    setSelectedIssue(null);
    
    // Compile canon world context
    const worldContext = world.documents
      .map(d => `[DOCUMENT: ${d.title} (${d.category})]\n${d.content}`)
      .join('\n\n---\n\n');

    try {
      const result = await checkLoreConsistency({
        draftText,
        worldContext,
        canonRules: world.documents.filter(d => d.category === 'Magic Laws'),
        activeEntities: world.entities,
      });
      setReport(result);
      if (result.issues.length > 0) {
        setSelectedIssue(result.issues[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsScanning(false);
    }
  };

  // Apply suggested fix directly into text
  const applyFix = (issue: ConsistencyIssue) => {
    if (issue.flaggedExcerpt && draftText.includes(issue.flaggedExcerpt)) {
      const updated = draftText.replace(issue.flaggedExcerpt, issue.suggestedFix);
      setDraftText(updated);
      // Remove this issue from current report
      if (report) {
        const remainingIssues = report.issues.filter(i => i.id !== issue.id);
        setReport({
          ...report,
          issues: remainingIssues,
          passed: remainingIssues.length === 0,
          overallVerdict: remainingIssues.length === 0 
            ? 'All flagged contradictions have been resolved! Passage is now lore-compliant.'
            : `${remainingIssues.length} issue(s) remaining.`
        });
        setSelectedIssue(remainingIssues[0] || null);
      }
    } else {
      // Append or replace
      setDraftText(prev => prev + `\n\n/* Revised resolution: */\n${issue.suggestedFix}`);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(draftText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Feature Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                FEATURE A
              </span>
              <h2 className="text-xl font-bold text-slate-100 font-display-lore">
                The Lore Consistency Guard (Plot-Hole Detector)
              </h2>
            </div>
            <p className="text-sm text-slate-300 max-w-3xl">
              Unlike generic spell-checkers, the Consistency Guard cross-examines new narrative drafts against your immutable canon documents—flagging broken magic laws, timeline paradoxes, physiological impossibilities, and dead characters appearing in present scenes.
            </p>
          </div>

          {/* Quick preset selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-medium">Load Preset:</span>
            {world.sampleDrafts.map(draft => (
              <button
                key={draft.id}
                onClick={() => handleSelectPreset(draft.id)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                  selectedDraftId === draft.id
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-200 font-medium'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {draft.hasErrors ? '⚠️ Draft With Plot Holes' : '✓ Canon-Compliant Draft'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Workspace: Tri-Pane or Dual Column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left/Center Column: Writing Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-xl">
            {/* Canvas Toolbar */}
            <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-slate-200">Narrative Draft Canvas</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {draftText.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyToClipboard}
                  className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 transition-colors"
                  title="Copy draft"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleScan}
                  disabled={isScanning || !draftText.trim()}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Cross-Examining Canon...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Scan Lore Consistency</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Editable Text Area */}
            <div className="p-4 relative">
              <textarea
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                placeholder="Write or paste your novel scene, TTRPG encounter, or narrative dispatch here to check for lore continuity..."
                rows={14}
                className="w-full bg-slate-950/70 text-slate-200 font-serif-lore text-base leading-relaxed p-4 rounded-lg border border-slate-800/80 focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/30 resize-y"
              />
            </div>

            {/* Canon Rules Quick Reference Footer */}
            <div className="px-4 py-2.5 bg-slate-950/40 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between flex-wrap gap-2">
              <span className="flex items-center gap-1.5">
                <BookMarked className="w-3.5 h-3.5 text-amber-400" />
                Active Canon Constraints: <strong className="text-slate-300">Silverflame Sunlight Ban</strong>, <strong className="text-slate-300">Varik's Blindness</strong>, <strong className="text-slate-300">Brandon Vane Deceased (241 AF)</strong>
              </span>
              <span className="text-slate-500 font-mono">Grounding Level: Strict Canon</span>
            </div>
          </div>
        </div>

        {/* Right Column: Consistency Audit Report (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl min-h-[460px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-slate-200">Canon Audit Report</h3>
                </div>
                {report && (
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 ${
                    report.passed 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}>
                    {report.passed ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Canon Verified</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>{report.issues.length} Contradiction{report.issues.length > 1 ? 's' : ''} Found</span>
                      </>
                    )}
                  </span>
                )}
              </div>

              {/* Not scanned yet placeholder */}
              {!report && !isScanning && (
                <div className="text-center py-12 px-4 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-amber-400">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-300">No Scan Active</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Click "Scan Lore Consistency" above to test the draft passage against the codified laws and character dossiers of <span className="text-amber-300">{world.name}</span>.
                  </p>
                  <button
                    onClick={handleScan}
                    className="mt-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium border border-slate-700 transition-colors inline-flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run Scan Now</span>
                  </button>
                </div>
              )}

              {/* Scanning loader */}
              {isScanning && (
                <div className="text-center py-16 space-y-4">
                  <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-200">Cross-Referencing Canon Ontologies...</p>
                    <p className="text-[11px] text-slate-400">Verifying timeline anchors, biological status, and metaphysical laws.</p>
                  </div>
                </div>
              )}

              {/* Report Body */}
              {report && (
                <div className="space-y-4">
                  {/* Executive Summary */}
                  <div className={`p-3.5 rounded-lg border text-xs leading-relaxed ${
                    report.passed 
                      ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200' 
                      : 'bg-rose-950/30 border-rose-800/60 text-rose-200'
                  }`}>
                    <strong>Verdict:</strong> {report.overallVerdict}
                  </div>

                  {/* Issues List */}
                  {report.issues.length > 0 && (
                    <div className="space-y-3">
                      <div className="text-[11px] uppercase tracking-wider font-mono text-slate-400">
                        Detected Contradictions:
                      </div>
                      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                        {report.issues.map((issue) => (
                          <div
                            key={issue.id}
                            onClick={() => setSelectedIssue(issue)}
                            className={`p-3.5 rounded-lg border text-xs cursor-pointer transition-all ${
                              selectedIssue?.id === issue.id
                                ? 'bg-slate-800/90 border-amber-500/70 shadow-md'
                                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                issue.severity === 'critical'
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              }`}>
                                {issue.severity} Contradiction
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono truncate max-w-[160px]">
                                {issue.sourceCitation}
                              </span>
                            </div>

                            <div className="text-slate-300 font-medium mb-1">
                              "{issue.flaggedExcerpt}"
                            </div>

                            <p className="text-[11px] text-slate-400 mb-2 leading-normal">
                              {issue.explanation}
                            </p>

                            <div className="bg-slate-900/90 p-2.5 rounded border border-slate-800 text-[11px] text-slate-300 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-amber-400 flex items-center gap-1">
                                  <Wand2 className="w-3 h-3" /> Lore-Compliant Rewrite:
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    applyFix(issue);
                                  }}
                                  className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center gap-1 transition-colors"
                                >
                                  <span>Apply Rewrite</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              </div>
                              <p className="font-serif-lore italic text-slate-200">
                                "{issue.suggestedFix}"
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Lore Praise (What was done right) */}
                  {report.lorePraise && report.lorePraise.length > 0 && (
                    <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/80 text-xs space-y-1.5">
                      <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> Lore Continuity Praises:
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-300">
                        {report.lorePraise.map((p, idx) => (
                          <li key={idx}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Status Tip */}
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Guard Mode: Autonomous Cross-Verification</span>
              <span className="font-mono">AST-Rule Validator v2</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
