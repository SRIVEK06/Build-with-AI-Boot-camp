import React, { useState } from 'react';
import { Opportunity, OpportunityCategory } from '../types';
import {
  Bookmark,
  Clock,
  ArrowRight,
  Sparkles,
  MapPin,
  Trophy,
  Users,
  CheckCircle2,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface OpportunitiesViewProps {
  opportunities: Opportunity[];
  onToggleSave: (id: string) => void;
  darkMode: boolean;
}

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({
  opportunities,
  onToggleSave,
  darkMode,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [savedOnly, setSavedOnly] = useState<boolean>(false);
  const [selectedOppForApply, setSelectedOppForApply] = useState<Opportunity | null>(null);
  const [applicantNote, setApplicantNote] = useState<string>('');
  const [appliedOppIds, setAppliedOppIds] = useState<string[]>([]);

  const savedCount = opportunities.filter((o) => o.saved).length;

  const categories: { id: string; label: string }[] = [
    { id: 'ALL', label: 'All' },
    { id: 'HACKATHON', label: 'Hackathons' },
    { id: 'INTERNSHIP', label: 'Internships' },
    { id: 'COMPETITION', label: 'Contests' },
    { id: 'WORKSHOP', label: 'Workshops' },
  ];

  let filtered = opportunities;
  if (savedOnly) {
    filtered = filtered.filter((o) => o.saved);
  }
  if (selectedCategory !== 'ALL') {
    filtered = filtered.filter((o) => o.category === selectedCategory);
  }

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOppForApply) return;

    setAppliedOppIds((prev) => [...prev, selectedOppForApply.id]);
    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.65 },
    });

    setTimeout(() => {
      setSelectedOppForApply(null);
      setApplicantNote('');
    }, 1200);
  };

  return (
    <div className="space-y-4" id="view-opportunities">
      {/* Filter Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold">Opportunities & Career Hub</h3>
          <p className="text-[11px] text-slate-400">Hackathons, Internships & Competitions</p>
        </div>

        <button
          id="saved-filter-btn"
          onClick={() => setSavedOnly(!savedOnly)}
          className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 border transition-all ${
            savedOnly
              ? 'bg-amber-500 text-slate-950 font-bold border-amber-500 shadow-xs'
              : darkMode
              ? 'glass-pill text-slate-300 hover:text-white border-white/10'
              : 'bg-white text-slate-700 hover:text-slate-900 border-slate-200 shadow-2xs'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>Saved ({savedCount})</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-0.5">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 text-xs rounded-lg whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : darkMode
                  ? 'glass-pill text-slate-300 hover:text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 font-semibold'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Opportunities List */}
      <div className="space-y-3" id="opportunities-list">
        {filtered.length === 0 ? (
          <div
            className={`p-8 text-center text-xs rounded-2xl border ${
              darkMode ? 'glass-card text-slate-400' : 'bg-white border-slate-200 text-slate-500'
            }`}
          >
            No opportunities found in this view. Try adjusting your filters.
          </div>
        ) : (
          filtered.map((opp) => {
            const hasApplied = appliedOppIds.includes(opp.id);

            return (
              <div
                key={opp.id}
                className={`rounded-2xl p-3.5 border transition-all duration-200 ${
                  darkMode
                    ? 'glass-card border-white/10 hover:border-white/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 uppercase tracking-wider">
                        {opp.category}
                      </span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                          opp.isInternal
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : darkMode
                            ? 'bg-slate-800 text-slate-400'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {opp.isInternal ? 'CAMPUS' : 'GLOBAL'}
                      </span>
                      <span className="text-[10px] text-amber-400 font-medium flex items-center gap-1">
                        <Trophy className="w-3 h-3" /> {opp.stipendOrPrize}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold">{opp.title}</h4>
                    <p className="text-[11px] text-slate-400">
                      {opp.organizer} • {opp.location}
                    </p>
                  </div>

                  <button
                    onClick={() => onToggleSave(opp.id)}
                    aria-label={opp.saved ? 'Remove from saved' : 'Save opportunity'}
                    className={`p-1.5 rounded-lg transition-colors ${
                      darkMode ? 'glass-pill hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        opp.saved ? 'text-amber-400 fill-amber-400' : 'text-slate-400'
                      }`}
                    />
                  </button>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 mb-2 leading-relaxed">
                  {opp.description}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {opp.skills.map((skill) => (
                    <span
                      key={skill}
                      className={`text-[10px] px-2 py-0.5 rounded-md font-mono border ${
                        darkMode
                          ? 'bg-slate-900/90 text-slate-300 border-white/5'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Footer: Days left & Apply */}
                <div
                  className={`flex items-center justify-between pt-2 border-t ${
                    darkMode ? 'border-white/5' : 'border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                    <Clock className="w-3.5 h-3.5 animate-pulse" />
                    <span>{opp.daysLeft} days left</span>
                    <span className="text-slate-500 font-normal">({opp.deadlineDate})</span>
                  </div>

                  {hasApplied ? (
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Registered
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedOppForApply(opp)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1 transition-all"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Application / Registration Modal */}
      {selectedOppForApply && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="apply-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            className={`max-w-md w-full rounded-3xl p-5 border shadow-2xl relative ${
              darkMode ? 'bg-slate-900 border-white/10 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <button
              onClick={() => setSelectedOppForApply(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-800/20 text-slate-400 hover:text-white"
              aria-label="Close application modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-bold uppercase">
                {selectedOppForApply.category}
              </span>
              <h3 id="apply-modal-title" className="text-base font-bold mt-1">
                {selectedOppForApply.title}
              </h3>
              <p className="text-xs text-slate-400">{selectedOppForApply.organizer}</p>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-3 text-xs">
              <div
                className={`p-3 rounded-xl border ${
                  darkMode ? 'bg-slate-950/60 border-white/5' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <p className="text-slate-400 mb-1">Applying as Verified Candidate:</p>
                <p className="font-bold text-sm">Aarav Sharma • CS2022-048</p>
                <p className="text-slate-400">Department of Computer Science & Engineering</p>
                <p className="text-emerald-400 font-medium mt-1">
                  CGPA: 8.84 • Rank #14 • Endorsed by Dr. Rajiv Menon
                </p>
              </div>

              <div>
                <label className="block font-medium text-slate-400 mb-1">
                  Cover Note / Portfolio / GitHub Link:
                </label>
                <textarea
                  value={applicantNote}
                  onChange={(e) => setApplicantNote(e.target.value)}
                  placeholder="e.g. github.com/aarav-cs, building Web3 and distributed systems projects..."
                  rows={3}
                  className={`w-full rounded-xl p-2.5 border focus:outline-hidden focus:border-indigo-500 transition-colors ${
                    darkMode
                      ? 'bg-slate-950 border-white/10 text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOppForApply(null)}
                  className={`px-3 py-2 rounded-xl font-semibold ${
                    darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
