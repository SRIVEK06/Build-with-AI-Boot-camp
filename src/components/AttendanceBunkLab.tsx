import React, { useState } from 'react';
import { SubjectItem } from '../types';
import {
  Zap,
  AlertTriangle,
  ShieldCheck,
  XCircle,
  HelpCircle,
  CheckCircle2,
  CalendarDays,
  Plus,
} from 'lucide-react';

interface AttendanceBunkLabProps {
  subjects: SubjectItem[];
  onUpdateSubjectAttendance: (subjectId: string, attendedDelta: number, conductedDelta: number) => void;
  darkMode: boolean;
}

export const AttendanceBunkLab: React.FC<AttendanceBunkLabProps> = ({
  subjects,
  onUpdateSubjectAttendance,
  darkMode,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [simMode, setSimMode] = useState<'miss' | 'attend'>('miss');
  const [sliderValue, setSliderValue] = useState<number>(3);
  const [justCheckedInSubject, setJustCheckedInSubject] = useState<string | null>(null);

  // Calculate totals
  const totalAttended = subjects.reduce((sum, s) => sum + s.attended, 0);
  const totalConducted = subjects.reduce((sum, s) => sum + s.conducted, 0);

  // Selected subject stats
  let baseAttended = totalAttended;
  let baseConducted = totalConducted;
  let selectedSubjectName = 'Overall Aggregate (All Subjects)';

  if (selectedSubjectId !== 'all') {
    const sub = subjects.find((s) => s.id === selectedSubjectId);
    if (sub) {
      baseAttended = sub.attended;
      baseConducted = sub.conducted;
      selectedSubjectName = sub.name;
    }
  }

  // Simulation calculation
  let newAttended = baseAttended;
  const newConducted = baseConducted + sliderValue;

  if (simMode === 'attend') {
    newAttended += sliderValue;
  }

  const projectedPct = ((newAttended / newConducted) * 100).toFixed(1);
  const projectedNumber = parseFloat(projectedPct);

  // Status & Guidance logic
  let statusType: 'safe' | 'warning' | 'critical' = 'safe';
  let message = '';

  if (projectedNumber >= 75) {
    statusType = 'safe';
    const safeBunks = Math.floor((newAttended - 0.75 * newConducted) / 0.75);
    message = `🛡️ Safe Zone Maintained! For ${selectedSubjectName}, projected attendance is ${projectedPct}%. You stay safely above university regulations with ${safeBunks} buffer sessions safe to miss.`;
  } else if (projectedNumber >= 70) {
    statusType = 'warning';
    const reqConsecutive = Math.ceil((0.75 * newConducted - newAttended) / 0.25);
    message = `⚠️ Warning Zone: Attendance dips to ${projectedPct}%. You will need to attend the next ${reqConsecutive} consecutive lectures without missing any to restore eligibility.`;
  } else {
    statusType = 'critical';
    const reqConsecutive = Math.ceil((0.75 * newConducted - newAttended) / 0.25);
    message = `🚨 Critical Debarment Alert! Attendance plunges to ${projectedPct}% for ${selectedSubjectName}. University policy flags you for exam debarment. You must attend ${reqConsecutive} consecutive classes to re-qualify.`;
  }

  const handleQuickCheckIn = (subId: string) => {
    onUpdateSubjectAttendance(subId, 1, 1);
    setJustCheckedInSubject(subId);
    setTimeout(() => setJustCheckedInSubject(null), 2000);
  };

  return (
    <div className="space-y-4" id="view-attendance">
      {/* SIMULATOR CARD */}
      <div
        className={`rounded-2xl p-4 border relative overflow-hidden transition-all duration-200 ${
          darkMode
            ? 'glass-card border-emerald-500/30'
            : 'bg-white border-emerald-200 shadow-xs'
        }`}
      >
        <div className="absolute -right-8 -top-8 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 uppercase tracking-wider mb-1">
              Live What-If Engine
            </div>
            <h3 className="text-base font-bold">Bunk / Safety Simulator</h3>
            <p className="text-[11px] text-slate-400">
              Test lecture attendance vs. 75% university margin
            </p>
          </div>
          <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Zap className="w-4 h-4" />
          </span>
        </div>

        {/* Subject Selector */}
        <div className="mb-3">
          <label
            htmlFor="sim-subject-select"
            className="text-[11px] text-slate-400 font-medium block mb-1"
          >
            Select Subject to Simulate:
          </label>
          <select
            id="sim-subject-select"
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className={`w-full border rounded-xl px-3 py-2 text-xs font-semibold focus:outline-hidden focus:border-indigo-500 transition-colors ${
              darkMode
                ? 'bg-slate-900 border-white/10 text-white'
                : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          >
            <option value="all">Overall Aggregate (All Subjects)</option>
            {subjects.map((s) => {
              const pct = ((s.attended / s.conducted) * 100).toFixed(1);
              return (
                <option key={s.id} value={s.id}>
                  {s.name} ({pct}% - {parseFloat(pct) >= 75 ? 'Safe' : 'Warning'})
                </option>
              );
            })}
          </select>
        </div>

        {/* Scenario Mode Toggle */}
        <div
          className={`grid grid-cols-2 gap-2 p-1 rounded-xl mb-3 border text-xs ${
            darkMode ? 'bg-slate-900/80 border-white/5' : 'bg-slate-100 border-slate-200'
          }`}
          role="group"
          aria-label="Simulation mode selector"
        >
          <button
            id="sim-mode-miss"
            onClick={() => setSimMode('miss')}
            aria-pressed={simMode === 'miss'}
            className={`py-1.5 rounded-lg font-bold transition-all ${
              simMode === 'miss'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white font-semibold'
            }`}
          >
            &quot;If I Miss Classes&quot;
          </button>
          <button
            id="sim-mode-attend"
            onClick={() => setSimMode('attend')}
            aria-pressed={simMode === 'attend'}
            className={`py-1.5 rounded-lg transition-all ${
              simMode === 'attend'
                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                : 'text-slate-400 hover:text-white font-semibold'
            }`}
          >
            &quot;Need 75% Goal&quot;
          </button>
        </div>

        {/* Interactive Slider */}
        <div
          className={`space-y-2 p-3 rounded-xl border ${
            darkMode ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs">
            <span className={darkMode ? 'text-slate-300' : 'text-slate-700'} id="sim-slider-label">
              {simMode === 'miss' ? 'Upcoming Lectures to Skip:' : 'Consecutive Lectures to Attend:'}
            </span>
            <span className="font-mono text-sm font-bold text-amber-400" id="sim-slider-val">
              {sliderValue} classes
            </span>
          </div>

          <input
            id="sim-slider"
            type="range"
            min="0"
            max="15"
            step="1"
            value={sliderValue}
            onChange={(e) => setSliderValue(parseInt(e.target.value, 10))}
            aria-label={
              simMode === 'miss' ? 'Upcoming Lectures to Skip' : 'Consecutive Lectures to Attend'
            }
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />

          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0</span>
            <span>5 classes</span>
            <span>10 classes</span>
            <span>15</span>
          </div>
        </div>

        {/* Instant Readout Card */}
        <div
          id="sim-readout-card"
          className={`mt-3 p-3 rounded-xl border transition-all ${
            statusType === 'safe'
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : statusType === 'warning'
              ? 'bg-amber-500/10 border-amber-500/30'
              : 'bg-rose-500/10 border-rose-500/30'
          }`}
          aria-live="polite"
        >
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-300 font-medium">Projected Attendance:</div>
            <div
              id="sim-projected-pct"
              className={`font-mono text-base font-extrabold ${
                statusType === 'safe'
                  ? 'text-emerald-400'
                  : statusType === 'warning'
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {projectedPct}%
            </div>
          </div>

          <div className="mt-1 flex items-start gap-2">
            {statusType === 'safe' ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : statusType === 'warning' ? (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <p
              id="sim-readout-msg"
              className={`text-xs leading-snug ${
                statusType === 'safe'
                  ? 'text-emerald-200'
                  : statusType === 'warning'
                  ? 'text-amber-200'
                  : 'text-rose-200'
              }`}
            >
              {message}
            </p>
          </div>
        </div>
      </div>

      {/* SUBJECT-WISE RADIAL GAUGES */}
      <div
        className={`rounded-2xl p-4 transition-all duration-200 ${
          darkMode ? 'glass-card' : 'bg-white border border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold">Subject Attendance Thresholds</h3>
            <p className="text-[11px] text-slate-400">Green ≥75% | Amber 70-74% | Red &lt;70%</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold shrink-0">
            Min 75% Regs
          </span>
        </div>

        <div className="space-y-3" id="subject-gauges-container">
          {subjects.map((sub) => {
            const pct = ((sub.attended / sub.conducted) * 100).toFixed(1);
            const numPct = parseFloat(pct);

            let colorClass = 'text-emerald-400';
            let strokeColor = '#10B981';
            let statusBadge = '';
            let advice = '';

            if (numPct >= 75) {
              const safeBunk = Math.floor((sub.attended - 0.75 * sub.conducted) / 0.75);
              colorClass = 'text-emerald-400';
              strokeColor = '#10B981';
              statusBadge = (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  SAFE ({safeBunk} bunkable)
                </span>
              );
              advice = `You can safely miss ${safeBunk} lectures and remain ≥75%.`;
            } else if (numPct >= 70) {
              const req = Math.ceil((0.75 * sub.conducted - sub.attended) / 0.25);
              colorClass = 'text-amber-400';
              strokeColor = '#F59E0B';
              statusBadge = (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  WARNING
                </span>
              );
              advice = `Attend next ${req} consecutive lectures to hit 75%.`;
            } else {
              const req = Math.ceil((0.75 * sub.conducted - sub.attended) / 0.25);
              colorClass = 'text-rose-400';
              strokeColor = '#EF4444';
              statusBadge = (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">
                  CRITICAL
                </span>
              );
              advice = `Debarred risk! Need ${req} consecutive classes attended!`;
            }

            const radius = 20;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (numPct / 100) * circumference;

            return (
              <div
                key={sub.id}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                  darkMode
                    ? 'bg-slate-900/60 border-white/5 hover:border-white/10'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Radial Gauge SVG */}
                  <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
                    <svg className="w-12 h-12 transform -rotate-90">
                      <circle
                        cx="24"
                        cy="24"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="4"
                        className={darkMode ? 'text-slate-800' : 'text-slate-200'}
                        fill="transparent"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r={radius}
                        stroke={strokeColor}
                        strokeWidth="4"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-500"
                      />
                    </svg>
                    <span className={`absolute text-[10px] font-mono font-bold ${colorClass}`}>
                      {Math.round(numPct)}%
                    </span>
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-xs font-bold truncate">{sub.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {sub.attended} attended / {sub.conducted} held • {sub.code}
                    </p>
                    <p className={`text-[10px] ${colorClass} mt-0.5 font-medium truncate`}>
                      {advice}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  {statusBadge}
                  <button
                    onClick={() => handleQuickCheckIn(sub.id)}
                    title="Simulate attending today's lecture (+1 hour)"
                    className={`px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all ${
                      justCheckedInSubject === sub.id
                        ? 'bg-emerald-600 text-white'
                        : darkMode
                        ? 'bg-slate-800 hover:bg-slate-700 text-indigo-300'
                        : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
                    }`}
                  >
                    {justCheckedInSubject === sub.id ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" /> Logged!
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" /> Check In
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
