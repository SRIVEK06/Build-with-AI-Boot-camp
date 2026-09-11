import React, { useState } from 'react';
import { SubjectItem, RadarDataPoint, ProgressionDataPoint } from '../types';
import { Calculator, Target, Sparkles, TrendingUp, HelpCircle } from 'lucide-react';

interface AnalyticsViewProps {
  subjects: SubjectItem[];
  radarData: RadarDataPoint[];
  progressionData: ProgressionDataPoint[];
  currentCgpa: number;
  initialTargetCgpa: number;
  darkMode: boolean;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  subjects,
  radarData,
  progressionData,
  currentCgpa,
  initialTargetCgpa,
  darkMode,
}) => {
  const [targetCgpa, setTargetCgpa] = useState<number>(initialTargetCgpa);
  const [hoveredRadarIndex, setHoveredRadarIndex] = useState<number | null>(null);
  const [hoveredProgressionIndex, setHoveredProgressionIndex] = useState<number | null>(null);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // Target CGPA calculation:
  // Assuming 5 completed semesters (each weighted 1) and Sem 6 is currently in progress
  // Current CGPA = 8.74 (across 5 sems), target over 6 sems:
  // Required SGPA = (target * 6) - (8.74 * 5)
  const previous5SemCgpa = 8.74;
  const requiredSgpa = targetCgpa * 6 - previous5SemCgpa * 5;

  let adviceMessage = '';
  let sgpaTextColor = 'text-emerald-400';

  if (requiredSgpa > 10.0) {
    sgpaTextColor = 'text-rose-400';
    const maxPossible = (previous5SemCgpa * 5 + 10.0) / 6;
    adviceMessage = `⚠️ Mathematically unreachable in one semester. The maximum achievable CGPA this semester with a 10.0 SGPA is ${maxPossible.toFixed(
      2
    )}.`;
  } else if (requiredSgpa <= 7.0) {
    sgpaTextColor = 'text-emerald-400';
    adviceMessage = `✅ You have built a solid foundation! Maintaining a standard SGPA will easily secure your target ${targetCgpa.toFixed(
      2
    )} CGPA.`;
  } else if (requiredSgpa >= 9.5) {
    sgpaTextColor = 'text-indigo-400';
    adviceMessage = `🎯 You need at least 3 A+ grades and 2 'O' (Outstanding) marks in upcoming end-term exams to graduate with ${targetCgpa.toFixed(
      2
    )}+ CGPA.`;
  } else {
    sgpaTextColor = 'text-emerald-400';
    adviceMessage = `🎯 Secure an average of A grades across all 5 theory and laboratory subjects to attain ${targetCgpa.toFixed(
      2
    )} CGPA.`;
  }

  // Radar chart SVG math (5 axes)
  const radarCenter = { x: 140, y: 125 };
  const radarRadius = 85;
  const totalAxes = radarData.length;

  const getCoordinates = (index: number, value: number, maxVal = 100) => {
    // Angle: starts at top (-PI / 2) and rotates clockwise
    const angle = (Math.PI * 2 * index) / totalAxes - Math.PI / 2;
    const distance = (value / maxVal) * radarRadius;
    const x = radarCenter.x + distance * Math.cos(angle);
    const y = radarCenter.y + distance * Math.sin(angle);
    return { x, y, angle };
  };

  // Student polygon points
  const studentPoints = radarData
    .map((item, idx) => {
      const coords = getCoordinates(idx, item.studentScore);
      return `${coords.x},${coords.y}`;
    })
    .join(' ');

  // Batch polygon points
  const batchPoints = radarData
    .map((item, idx) => {
      const coords = getCoordinates(idx, item.batchAvg);
      return `${coords.x},${coords.y}`;
    })
    .join(' ');

  // Progression Line chart math
  const progMinY = 7.5;
  const progMaxY = 10.0;
  const progWidth = 320;
  const progHeight = 120;
  const paddingLeft = 32;
  const paddingRight = 16;
  const paddingTop = 15;
  const paddingBottom = 25;

  const availableWidth = progWidth - paddingLeft - paddingRight;
  const availableHeight = progHeight - paddingTop - paddingBottom;

  const getProgX = (index: number) => {
    return paddingLeft + (index / (progDataPointsCount() - 1)) * availableWidth;
  };

  function progDataPointsCount() {
    return progressionData.length;
  }

  const getProgY = (val: number) => {
    const ratio = (val - progMinY) / (progMaxY - progMinY);
    return paddingTop + availableHeight * (1 - ratio);
  };

  // SVG path for SGPA line
  const sgpaPathD = progressionData.reduce((acc, curr, idx) => {
    const x = getProgX(idx);
    const y = getProgY(curr.sgpa);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // SVG path for CGPA line
  const cgpaPathD = progressionData.reduce((acc, curr, idx) => {
    const x = getProgX(idx);
    const y = getProgY(curr.cgpa);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // SVG area fill under SGPA
  const firstX = getProgX(0);
  const lastX = getProgX(progressionData.length - 1);
  const bottomY = paddingTop + availableHeight;
  const sgpaAreaD = `${sgpaPathD} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;

  return (
    <div className="space-y-4" id="view-analytics">
      {/* CHART 1: Subject Competency Radar */}
      <div
        className={`rounded-2xl p-4 transition-all duration-200 ${
          darkMode ? 'glass-card' : 'bg-white border border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              Subject Competency Radar
            </h3>
            <p className="text-[11px] text-slate-400">Student proficiency vs. Class cohort mean</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
            Sem VI
          </span>
        </div>

        {/* Interactive Radar SVG */}
        <div className="relative w-full flex flex-col items-center justify-center">
          <svg
            viewBox="0 0 280 250"
            className="w-full max-w-[320px] h-[225px] overflow-visible"
            role="img"
            aria-label="Radar chart showing student proficiency compared to batch average"
          >
            {/* Background circular web rings */}
            {[0.25, 0.5, 0.75, 1].map((scale) => {
              const ringPoints = radarData
                .map((_, i) => {
                  const coords = getCoordinates(i, 100 * scale);
                  return `${coords.x},${coords.y}`;
                })
                .join(' ');
              return (
                <polygon
                  key={scale}
                  points={ringPoints}
                  fill="none"
                  stroke={darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}
                  strokeWidth="1"
                />
              );
            })}

            {/* Axis lines */}
            {radarData.map((_, idx) => {
              const outer = getCoordinates(idx, 100);
              return (
                <line
                  key={idx}
                  x1={radarCenter.x}
                  y1={radarCenter.y}
                  x2={outer.x}
                  y2={outer.y}
                  stroke={darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}
                  strokeWidth="1"
                />
              );
            })}

            {/* Batch Average Polygon (Dashed gray) */}
            <polygon
              points={batchPoints}
              fill="rgba(148, 163, 184, 0.08)"
              stroke="#64748B"
              strokeWidth="1.5"
              strokeDasharray="4,4"
            />

            {/* Student Polygon (Glowing indigo) */}
            <polygon
              points={studentPoints}
              fill="rgba(99, 102, 241, 0.28)"
              stroke="#6366F1"
              strokeWidth="2.5"
            />

            {/* Student interactive points */}
            {radarData.map((item, idx) => {
              const coords = getCoordinates(idx, item.studentScore);
              const isHovered = hoveredRadarIndex === idx;
              return (
                <g key={idx} className="cursor-pointer">
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={isHovered ? 6 : 4}
                    fill="#818CF8"
                    stroke="#ffffff"
                    strokeWidth="2"
                    onMouseEnter={() => setHoveredRadarIndex(idx)}
                    onMouseLeave={() => setHoveredRadarIndex(null)}
                  />
                </g>
              );
            })}

            {/* Axis Labels */}
            {radarData.map((item, idx) => {
              const coords = getCoordinates(idx, 118);
              // Text anchor based on x position
              let textAnchor = 'middle';
              if (coords.x < radarCenter.x - 20) textAnchor = 'end';
              if (coords.x > radarCenter.x + 20) textAnchor = 'start';

              const isHovered = hoveredRadarIndex === idx;

              return (
                <text
                  key={idx}
                  x={coords.x}
                  y={coords.y + 4}
                  textAnchor={textAnchor}
                  fill={isHovered ? '#818CF8' : darkMode ? '#94A3B8' : '#64748B'}
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="'Plus Jakarta Sans', sans-serif"
                >
                  {item.subject}
                </text>
              );
            })}
          </svg>

          {/* Hover readout info box */}
          {hoveredRadarIndex !== null && (
            <div className="absolute top-1 right-2 bg-slate-900/90 border border-indigo-500/30 backdrop-blur-md px-2.5 py-1.5 rounded-lg text-[11px] shadow-lg">
              <span className="font-bold text-white">
                {radarData[hoveredRadarIndex].subject}:
              </span>{' '}
              <span className="text-indigo-400 font-mono font-bold">
                {radarData[hoveredRadarIndex].studentScore}
              </span>{' '}
              <span className="text-slate-400 text-[10px]">
                (Batch: {radarData[hoveredRadarIndex].batchAvg})
              </span>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-5 mt-1 text-[11px] font-medium">
          <div className="flex items-center gap-1.5 text-indigo-400">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-xs shadow-indigo-500" />
            Aarav (You)
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
            Batch Average
          </div>
        </div>
      </div>

      {/* CHART 2: SGPA & CGPA Progression Trajectory */}
      <div
        className={`rounded-2xl p-4 transition-all duration-200 ${
          darkMode ? 'glass-card' : 'bg-white border border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-violet-400" />
              GPA Progression Trajectory
            </h3>
            <p className="text-[11px] text-slate-400">Semester SGPA vs Cumulative CGPA</p>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
            +0.64 Overall
          </div>
        </div>

        {/* Chart SVG */}
        <div className="relative w-full">
          {/* Custom Legend */}
          <div className="flex items-center justify-center gap-4 text-[10px] font-semibold text-slate-400 mb-2">
            <div className="flex items-center gap-1 text-sky-400">
              <span className="w-2.5 h-1 bg-sky-400 rounded-sm" />
              Semester SGPA
            </div>
            <div className="flex items-center gap-1 text-purple-400">
              <span className="w-2.5 h-0.5 border-t border-dashed border-purple-400" />
              Overall CGPA
            </div>
          </div>

          <svg
            viewBox={`0 0 ${progWidth} ${progHeight}`}
            className="w-full h-[170px] overflow-visible"
            role="img"
            aria-label="Line graph showing semester SGPA and cumulative CGPA progression over 6 semesters"
          >
            {/* Gradient definition for fill */}
            <defs>
              <linearGradient id="sgpaAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Y Axis Grid lines */}
            {[7.5, 8.0, 8.5, 9.0, 9.5, 10.0].map((val) => {
              const y = getProgY(val);
              return (
                <g key={val}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={progWidth - paddingRight}
                    y2={y}
                    stroke={darkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)'}
                    strokeWidth="1"
                  />
                  <text
                    x={paddingLeft - 6}
                    y={y + 3}
                    textAnchor="end"
                    fill="#64748B"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {val.toFixed(1)}
                  </text>
                </g>
              );
            })}

            {/* SGPA Area Fill */}
            <path d={sgpaAreaD} fill="url(#sgpaAreaGrad)" />

            {/* Cumulative CGPA Dashed Line */}
            <path
              d={cgpaPathD}
              fill="none"
              stroke="#A855F7"
              strokeWidth="2"
              strokeDasharray="4,3"
            />

            {/* Semester SGPA Solid Line */}
            <path d={sgpaPathD} fill="none" stroke="#38BDF8" strokeWidth="2.5" />

            {/* SGPA Points & X labels */}
            {progressionData.map((item, idx) => {
              const x = getProgX(idx);
              const ySgpa = getProgY(item.sgpa);
              const yCgpa = getProgY(item.cgpa);
              const isHovered = hoveredProgressionIndex === idx;

              return (
                <g key={idx} className="cursor-pointer">
                  {/* CGPA point */}
                  <circle cx={x} cy={yCgpa} r={2} fill="#A855F7" />

                  {/* SGPA interactive point */}
                  <circle
                    cx={x}
                    cy={ySgpa}
                    r={isHovered ? 5 : 3.5}
                    fill="#38BDF8"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    onMouseEnter={() => setHoveredProgressionIndex(idx)}
                    onMouseLeave={() => setHoveredProgressionIndex(null)}
                  />

                  {/* X axis semester label */}
                  <text
                    x={x}
                    y={progHeight - 5}
                    textAnchor="middle"
                    fill={isHovered ? '#38BDF8' : '#64748B'}
                    fontSize="9"
                    fontWeight="600"
                  >
                    {item.semester}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Hover info tooltip */}
          {hoveredProgressionIndex !== null && (
            <div className="absolute top-0 right-2 bg-slate-900/90 border border-sky-500/30 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] shadow-lg font-mono">
              <span className="text-sky-400 font-bold">
                SGPA: {progressionData[hoveredProgressionIndex].sgpa.toFixed(2)}
              </span>{' '}
              |{' '}
              <span className="text-purple-400 font-bold">
                CGPA: {progressionData[hoveredProgressionIndex].cgpa.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* CHART 3: Mark Distribution Breakdown (Stacked Bars) */}
      <div
        className={`rounded-2xl p-4 transition-all duration-200 ${
          darkMode ? 'glass-card' : 'bg-white border border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              Mark Distribution Breakdown
            </h3>
            <p className="text-[11px] text-slate-400">Internals, Mid-term, Projects & End-sem</p>
          </div>
        </div>

        {/* Stacked Bars SVG */}
        <div className="relative w-full">
          <svg
            viewBox="0 0 320 180"
            className="w-full h-[180px] overflow-visible"
            role="img"
            aria-label="Stacked bar chart showing mark distribution across internals, assignments, mid-term, and end-term project"
          >
            {/* Horizontal Grid lines (0 to 100) */}
            {[0, 20, 40, 60, 80, 100].map((tick) => {
              const y = 145 - (tick / 100) * 125;
              return (
                <g key={tick}>
                  <line
                    x1="28"
                    y1={y}
                    x2="310"
                    y2={y}
                    stroke={darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}
                    strokeWidth="1"
                  />
                  <text
                    x="24"
                    y={y + 3}
                    textAnchor="end"
                    fill="#64748B"
                    fontSize="8"
                    fontFamily="monospace"
                  >
                    {tick}
                  </text>
                </g>
              );
            })}

            {/* Stacked Bars */}
            {subjects.map((sub, idx) => {
              const x = 45 + idx * 54;
              const barWidth = 28;
              const scale = 125 / 100; // 125px height = 100 marks total

              const hInternals = sub.internals * scale;
              const hAssign = sub.assignments * scale;
              const hMid = sub.midTerm * scale;
              const hEnd = sub.endTermProj * scale;

              const yInternals = 145 - hInternals;
              const yAssign = yInternals - hAssign;
              const yMid = yAssign - hMid;
              const yEnd = yMid - hEnd;

              const isHovered = hoveredBarIndex === idx;

              return (
                <g
                  key={sub.id}
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredBarIndex(idx)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                >
                  {/* End-term Project (Top - Emerald) */}
                  <rect
                    x={x}
                    y={yEnd}
                    width={barWidth}
                    height={hEnd}
                    rx="3"
                    fill="#10B981"
                    className="transition-opacity group-hover:opacity-90"
                  />
                  {/* Mid-term (Sky) */}
                  <rect
                    x={x}
                    y={yMid}
                    width={barWidth}
                    height={hMid}
                    fill="#38BDF8"
                    className="transition-opacity group-hover:opacity-90"
                  />
                  {/* Assignments (Purple) */}
                  <rect
                    x={x}
                    y={yAssign}
                    width={barWidth}
                    height={hAssign}
                    fill="#8B5CF6"
                    className="transition-opacity group-hover:opacity-90"
                  />
                  {/* Internals (Bottom - Indigo) */}
                  <rect
                    x={x}
                    y={yInternals}
                    width={barWidth}
                    height={hInternals}
                    rx="2"
                    fill="#6366F1"
                    className="transition-opacity group-hover:opacity-90"
                  />

                  {/* Subject Name label below */}
                  <text
                    x={x + barWidth / 2}
                    y="160"
                    textAnchor="middle"
                    fill={isHovered ? '#6366F1' : darkMode ? '#94A3B8' : '#64748B'}
                    fontSize="9"
                    fontWeight={isHovered ? 'bold' : '600'}
                  >
                    {idx === 0
                      ? 'DSA'
                      : idx === 1
                      ? 'OS'
                      : idx === 2
                      ? 'DBMS'
                      : idx === 3
                      ? 'Web Eng'
                      : 'Networks'}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Hover info for hovered subject */}
          {hoveredBarIndex !== null && (
            <div className="p-2 rounded-xl bg-slate-900/90 border border-white/10 text-[10px] grid grid-cols-4 gap-2 text-center mt-1">
              <div>
                <span className="text-indigo-400 block font-bold">Internals</span>
                <span className="text-white font-mono">
                  {subjects[hoveredBarIndex].internals}/20
                </span>
              </div>
              <div>
                <span className="text-purple-400 block font-bold">Assign</span>
                <span className="text-white font-mono">
                  {subjects[hoveredBarIndex].assignments}/20
                </span>
              </div>
              <div>
                <span className="text-sky-400 block font-bold">Mid-Term</span>
                <span className="text-white font-mono">
                  {subjects[hoveredBarIndex].midTerm}/30
                </span>
              </div>
              <div>
                <span className="text-emerald-400 block font-bold">End-Term</span>
                <span className="text-white font-mono">
                  {subjects[hoveredBarIndex].endTermProj}/30
                </span>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-2 text-[10px] font-semibold text-slate-400">
            <div className="flex items-center gap-1 text-indigo-400">
              <span className="w-2 h-2 rounded bg-indigo-500" />
              Internals (20)
            </div>
            <div className="flex items-center gap-1 text-purple-400">
              <span className="w-2 h-2 rounded bg-purple-500" />
              Assignments (20)
            </div>
            <div className="flex items-center gap-1 text-sky-400">
              <span className="w-2 h-2 rounded bg-sky-400" />
              Mid-Term (30)
            </div>
            <div className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded bg-emerald-500" />
              End-Term Proj (30)
            </div>
          </div>
        </div>
      </div>

      {/* TOOL 4: Target CGPA Predictor (Interactive Range Slider) */}
      <div
        className={`rounded-2xl p-4 border transition-all duration-200 ${
          darkMode
            ? 'glass-card border-indigo-500/30'
            : 'bg-white border-indigo-200 shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Target CGPA Predictor</h3>
              <p className="text-[11px] text-slate-400">Calculate required SGPA for upcoming exams</p>
            </div>
          </div>
        </div>

        <div
          className={`space-y-3 p-3 rounded-xl border ${
            darkMode ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <label htmlFor="target-cgpa-slider" className="text-xs font-medium text-slate-300">
              Desired Target CGPA
            </label>
            <span className="font-mono text-sm font-bold text-indigo-400" id="target-cgpa-val">
              {targetCgpa.toFixed(2)}
            </span>
          </div>

          <input
            id="target-cgpa-slider"
            type="range"
            min="8.50"
            max="9.80"
            step="0.05"
            value={targetCgpa}
            onChange={(e) => setTargetCgpa(parseFloat(e.target.value))}
            aria-label="Desired Target CGPA slider"
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />

          <div
            className={`p-2.5 rounded-lg border flex items-center justify-between text-xs ${
              darkMode
                ? 'bg-indigo-950/50 border-indigo-500/20'
                : 'bg-indigo-50 border-indigo-200'
            }`}
          >
            <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>
              Required Sem VI SGPA:
            </span>
            <span
              className={`font-mono font-bold text-sm ${sgpaTextColor}`}
              id="required-sgpa-text"
              aria-live="polite"
            >
              {requiredSgpa > 10.0
                ? 'Impossible (>10.0)'
                : `${requiredSgpa.toFixed(2)} / 10.0`}
            </span>
          </div>

          <p
            className="text-[11px] text-slate-400 leading-relaxed"
            id="target-cgpa-advice"
            aria-live="polite"
          >
            {adviceMessage}
          </p>
        </div>
      </div>
    </div>
  );
};
