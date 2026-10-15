import React, { useState } from 'react';
import { 
  Scroll, 
  Plus, 
  Search, 
  Tag, 
  FileText, 
  BookMarked, 
  ShieldCheck, 
  Trash2, 
  Check, 
  X,
  UploadCloud,
  FileCode
} from 'lucide-react';
import { LoreWorld, LoreDocument } from '../types/lore';

interface SourceDrawerProps {
  world: LoreWorld;
  onAddDocument: (doc: LoreDocument) => void;
  onDeleteDocument: (id: string) => void;
}

export const SourceDrawer: React.FC<SourceDrawerProps> = ({
  world,
  onAddDocument,
  onDeleteDocument
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(world.documents[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Document Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<LoreDocument['category']>('Magic Laws');
  const [newCanonStatus, setNewCanonStatus] = useState<LoreDocument['canonStatus']>('immutable_canon');
  const [newTags, setNewTags] = useState('canon, world_rules');
  const [newContent, setNewContent] = useState('');

  const categories = ['All', 'Magic Laws', 'Character Dossiers', 'Historical Chronicles', 'Geography & Kingdoms', 'Artifacts'];

  const filteredDocs = world.documents.filter(doc => {
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const selectedDoc = world.documents.find(d => d.id === selectedDocId) || filteredDocs[0];

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newDoc: LoreDocument = {
      id: `doc-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      canonStatus: newCanonStatus,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      content: newContent,
      wordCount: newContent.split(/\s+/).filter(Boolean).length,
      dateModified: 'Just now'
    };

    onAddDocument(newDoc);
    setSelectedDocId(newDoc.id);
    setShowAddModal(false);
    // Reset form
    setNewTitle('');
    setNewContent('');
  };

  const getCanonStatusBadge = (status: LoreDocument['canonStatus']) => {
    switch (status) {
      case 'immutable_canon':
        return <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">Immutable Canon</span>;
      case 'working_draft':
        return <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">Working Draft</span>;
      case 'unreliable_apocrypha':
        return <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">Apocrypha / Myth</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Scroll className="w-3.5 h-3.5" />
                CORPUS & DOCUMENT INGESTION
              </span>
              <h2 className="text-xl font-bold text-slate-100 font-display-lore">
                Canon Archives & Ingestion Manager
              </h2>
            </div>
            <p className="text-sm text-slate-300 max-w-3xl">
              Organize your world's source corpus into strict ontologies: Magic Systems, Character Dossiers, Chronologies, and Geography. Tag documents with canon status to inform RAG grounding and consistency checking.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all self-start lg:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Ingest New Canon Document</span>
          </button>
        </div>
      </div>

      {/* Main Corpus Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Document Navigation & Filter (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl space-y-4">
            
            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search canon documents, tags, rules..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[11px] px-2.5 py-1 rounded-md whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Document List */}
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {filteredDocs.map(doc => {
                const isSelected = selectedDoc?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-800/90 border-amber-500/70 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                        {doc.category}
                      </span>
                      {getCanonStatusBadge(doc.canonStatus)}
                    </div>
                    <div className="font-semibold text-slate-200 text-xs mb-1">
                      {doc.title}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-2 mb-2 font-serif-lore">
                      {doc.content}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>{doc.wordCount || 100} words</span>
                      <span>{doc.tags.slice(0, 2).map(t => `#${t}`).join(' ')}</span>
                    </div>
                  </div>
                );
              })}

              {filteredDocs.length === 0 && (
                <div className="text-center py-10 text-slate-500 text-xs">
                  No documents found matching "{searchQuery}"
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right Column: Full Document Reader & Inspector (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl min-h-[540px] flex flex-col justify-between">
            {selectedDoc ? (
              <div className="space-y-5">
                {/* Header */}
                <div className="pb-4 border-b border-slate-800 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider">
                        {selectedDoc.category}
                      </span>
                      {getCanonStatusBadge(selectedDoc.canonStatus)}
                    </div>
                    <h3 className="text-lg font-bold text-slate-100 font-display-lore">
                      {selectedDoc.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => onDeleteDocument(selectedDoc.id)}
                    className="p-1.5 rounded hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Delete document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Content Reader */}
                <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 font-serif-lore text-sm text-slate-200 leading-relaxed whitespace-pre-line max-h-[400px] overflow-y-auto">
                  {selectedDoc.content}
                </div>

                {/* Tags & Metadata */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    {selectedDoc.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        #{t}
                      </span>
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Modified: {selectedDoc.dateModified || 'Canon Era'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-24 text-slate-500 text-xs">
                Select a document from the left to view its canon text.
              </div>
            )}

            {/* Bottom Meta */}
            <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Ontological Ingestion Layer</span>
              <span className="font-mono">Export: World Anvil / Obsidian MD compatible</span>
            </div>
          </div>
        </div>

      </div>

      {/* Ingest Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Scroll className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-bold text-slate-100">Ingest New Canon Document</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Document Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., The Third Covenant of Iron"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Magic Laws">Magic Laws</option>
                    <option value="Character Dossiers">Character Dossiers</option>
                    <option value="Historical Chronicles">Historical Chronicles</option>
                    <option value="Geography & Kingdoms">Geography & Kingdoms</option>
                    <option value="Artifacts">Artifacts</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Canon Weight</label>
                  <select
                    value={newCanonStatus}
                    onChange={(e) => setNewCanonStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="immutable_canon">Immutable Canon (Hard Rules)</option>
                    <option value="working_draft">Working Draft</option>
                    <option value="unreliable_apocrypha">Unreliable Apocrypha</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="magic_system, bloodline, battle"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Document Text / World Building Content</label>
                <textarea
                  required
                  rows={6}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Paste rules, laws, physiology, timelines, or secrets..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 font-serif-lore focus:border-amber-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors"
                >
                  Save into Canon Corpus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
