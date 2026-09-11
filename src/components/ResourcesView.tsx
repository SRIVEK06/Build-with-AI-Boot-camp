import React, { useState } from 'react';
import { AcademicResource, ResourceType } from '../types';
import {
  Search,
  BookOpen,
  ThumbsUp,
  Star,
  Download,
  CheckCircle2,
  FileText,
  Video,
  Layers,
  Sparkles,
  ExternalLink,
  X,
} from 'lucide-react';

interface ResourcesViewProps {
  resources: AcademicResource[];
  onToggleComplete: (id: string) => void;
  onUpvote: (id: string) => void;
  darkMode: boolean;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({
  resources,
  onToggleComplete,
  onUpvote,
  darkMode,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [previewResource, setPreviewResource] = useState<AcademicResource | null>(null);

  const types: { id: string; label: string }[] = [
    { id: 'ALL', label: 'All Items' },
    { id: 'NOTES', label: 'Lecture Notes' },
    { id: 'PYQ', label: 'PYQs (Solved)' },
    { id: 'CHEATSHEET', label: 'Cheatsheets' },
    { id: 'PLAYLIST', label: 'YouTube Playlists' },
  ];

  const filtered = resources.filter((res) => {
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'ALL' || res.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-4" id="view-resources">
      {/* Search and Category Filter Card */}
      <div
        className={`rounded-2xl p-4 transition-all duration-200 ${
          darkMode ? 'glass-card' : 'bg-white border border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-sm font-bold">Smart Resource Repository</h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold shrink-0">
            Verified Faculty Notes
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative mb-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes, PYQs, algorithms, playlists..."
            className={`w-full rounded-xl pl-9 pr-3 py-2 text-xs transition-colors focus:outline-hidden focus:border-sky-500 ${
              darkMode
                ? 'bg-slate-900/90 border border-white/10 text-white placeholder-slate-500'
                : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Type pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
          {types.map((t) => {
            const isActive = selectedType === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`px-2.5 py-1 text-[11px] rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white font-bold shadow-xs'
                    : darkMode
                    ? 'glass-pill text-slate-300 font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 font-semibold'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Resources List */}
      <div className="space-y-3" id="resources-list">
        {filtered.length === 0 ? (
          <div
            className={`p-8 text-center text-xs rounded-2xl border ${
              darkMode ? 'glass-card text-slate-400' : 'bg-white border-slate-200 text-slate-500'
            }`}
          >
            No study materials match your search query.
          </div>
        ) : (
          filtered.map((res) => {
            let typeBadgeClass = 'bg-sky-500/15 text-sky-400';
            if (res.type === 'PYQ') typeBadgeClass = 'bg-purple-500/15 text-purple-300';
            if (res.type === 'CHEATSHEET') typeBadgeClass = 'bg-amber-500/15 text-amber-300';
            if (res.type === 'PLAYLIST') typeBadgeClass = 'bg-rose-500/15 text-rose-300';

            return (
              <div
                key={res.id}
                className={`rounded-2xl p-3.5 border transition-all duration-200 ${
                  res.completed
                    ? darkMode
                      ? 'border-emerald-500/20 bg-slate-900/40 opacity-90'
                      : 'border-emerald-200 bg-emerald-50/40'
                    : darkMode
                    ? 'glass-card border-white/10 hover:border-white/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${typeBadgeClass}`}
                      >
                        {res.type}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{res.size}</span>
                      {res.completed && (
                        <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold leading-snug">{res.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                      {res.subject} • {res.author}
                    </p>
                  </div>

                  <button
                    onClick={() => onToggleComplete(res.id)}
                    title={res.completed ? 'Mark as unstudied' : 'Mark as studied'}
                    aria-label={res.completed ? 'Mark as unstudied' : 'Mark as studied'}
                    className={`shrink-0 p-1.5 rounded-lg transition-colors ${
                      res.completed
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : darkMode
                        ? 'glass-pill text-slate-500 hover:text-slate-300'
                        : 'bg-slate-100 text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 ${res.completed ? 'fill-emerald-500 text-slate-950' : ''}`}
                    />
                  </button>
                </div>

                {/* Card Footer: Upvote, Rating, Open */}
                <div
                  className={`flex items-center justify-between pt-2 border-t text-xs ${
                    darkMode ? 'border-white/5' : 'border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onUpvote(res.id)}
                      title="Helpful resource"
                      className={`flex items-center gap-1 text-[11px] transition-colors ${
                        res.userUpvoted
                          ? 'text-indigo-400 font-bold'
                          : 'text-slate-400 hover:text-indigo-400'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${res.userUpvoted ? 'fill-indigo-400' : ''}`} />
                      <span className="font-mono">{res.upvotes}</span>
                    </button>

                    <div className="flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span className="font-mono text-slate-300">{res.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setPreviewResource(res)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${
                      darkMode
                        ? 'glass-pill hover:bg-white/10 text-sky-400'
                        : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
                    }`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Open Resource</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Resource Preview / Download Modal */}
      {previewResource && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="resource-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            className={`max-w-md w-full rounded-3xl p-5 border shadow-2xl relative ${
              darkMode ? 'bg-slate-900 border-white/10 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <button
              onClick={() => setPreviewResource(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-800/20 text-slate-400 hover:text-white"
              aria-label="Close resource modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-3">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 font-bold uppercase">
                {previewResource.type}
              </span>
              <h3 id="resource-modal-title" className="text-sm font-bold mt-1">
                {previewResource.title}
              </h3>
              <p className="text-xs text-slate-400">
                {previewResource.subject} • by {previewResource.author}
              </p>
            </div>

            <div
              className={`p-4 rounded-xl border text-xs space-y-2 mb-4 ${
                darkMode ? 'bg-slate-950/60 border-white/5' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex justify-between">
                <span className="text-slate-400">File Type:</span>
                <span className="font-mono">{previewResource.type === 'PLAYLIST' ? 'Video Stream' : 'PDF Document'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Size / Length:</span>
                <span className="font-mono">{previewResource.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Community Score:</span>
                <span className="font-bold text-amber-400">★ {previewResource.rating} ({previewResource.upvotes} student endorsements)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Academic Verification:</span>
                <span className="text-emerald-400 font-medium">Department Verified</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setPreviewResource(null)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold ${
                  darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Accessing "${previewResource.title}". Material opened in student offline cache.`);
                  setPreviewResource(null);
                }}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-600/30 flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Download / View Material
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
