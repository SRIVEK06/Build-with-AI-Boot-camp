import React, { useState } from 'react';
import { StudentProfile, FacultyProfile, UserRole } from '../types';
import {
  Sparkles,
  Award,
  Zap,
  CheckCircle2,
  QrCode,
  X,
  CreditCard,
  Building2,
  Mail,
  BookMarked,
  Shield,
} from 'lucide-react';

interface StudentProfileBannerProps {
  role: UserRole;
  student: StudentProfile;
  faculty: FacultyProfile;
  darkMode: boolean;
}

export const StudentProfileBanner: React.FC<StudentProfileBannerProps> = ({
  role,
  student,
  faculty,
  darkMode,
}) => {
  const [showIdCardModal, setShowIdCardModal] = useState(false);

  if (role === 'faculty') {
    return (
      <section
        aria-label="Faculty Profile Overview"
        className={`rounded-2xl p-4 mb-4 relative overflow-hidden transition-all duration-200 ${
          darkMode ? 'glass-card neon-border-indigo' : 'bg-white border border-indigo-200 shadow-md'
        }`}
      >
        <div className="absolute -right-12 -top-12 w-32 h-32 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center gap-3 mb-3.5">
          <div className="relative shrink-0">
            <img
              src={faculty.avatarUrl}
              alt={faculty.name}
              className="w-13 h-13 rounded-xl object-cover border-2 border-indigo-400/40 p-0.5 bg-slate-900 shadow-md"
            />
            <span
              className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900"
              title="Faculty On Campus"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h2 className="text-base font-bold truncate">{faculty.name}</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 font-bold shrink-0">
                HEAD OF DEPT
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono truncate">{faculty.title}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[11px] text-indigo-400 font-medium">
                <Building2 className="w-3 h-3" />
                {faculty.department}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-[11px] text-slate-300">
                {faculty.totalStudents} Students Mentored
              </span>
            </div>
          </div>
        </div>

        {/* Faculty Metrics Grid */}
        <div className={`grid grid-cols-3 gap-2.5 pt-2.5 border-t ${darkMode ? 'border-white/5' : 'border-slate-100'}`}>
          <div
            className={`rounded-xl p-2.5 text-center border ${
              darkMode ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Batches</div>
            <div className="text-lg font-extrabold mt-0.5">{faculty.assignedBatches.length}</div>
            <div className="text-[9px] text-indigo-400 font-medium">CS-2022 A & B</div>
          </div>
          <div
            className={`rounded-xl p-2.5 text-center border ${
              darkMode ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Courses Held</div>
            <div className="text-lg font-extrabold text-emerald-400 mt-0.5">3 Active</div>
            <div className="text-[9px] text-emerald-400 font-medium">14 hrs / week</div>
          </div>
          <div
            className={`rounded-xl p-2.5 text-center border ${
              darkMode ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Avg Cohort</div>
            <div className="text-lg font-extrabold text-indigo-300 mt-0.5">8.42</div>
            <div className="text-[9px] text-slate-400">Class CGPA</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        aria-label="Student Profile and Academic Key Metrics"
        className={`rounded-2xl p-4 mb-4 relative overflow-hidden transition-all duration-200 ${
          darkMode ? 'glass-card neon-border-indigo' : 'bg-white border border-indigo-200 shadow-md'
        }`}
      >
        <div className="absolute -right-12 -top-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3 mb-3.5">
          {/* Avatar with Semester Active Status */}
          <button
            onClick={() => setShowIdCardModal(true)}
            title="Click to view digital student ID card"
            className="relative shrink-0 group focus:outline-hidden focus:ring-2 focus:ring-indigo-500 rounded-xl"
            aria-label="Open Digital Student ID Card"
          >
            <img
              src={student.avatarUrl}
              alt={student.name}
              className="w-13 h-13 rounded-xl object-cover border-2 border-indigo-400/40 p-0.5 bg-slate-900 shadow-md group-hover:scale-105 transition-transform"
            />
            <span
              className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900"
              title="Active Semester VI"
            />
            <span className="absolute -bottom-1 -left-1 bg-indigo-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-[8px]">
              <QrCode className="w-2.5 h-2.5" />
            </span>
          </button>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h2
                onClick={() => setShowIdCardModal(true)}
                className="text-base font-bold truncate cursor-pointer hover:text-indigo-400 transition-colors"
                id="profile-name"
              >
                {student.name}
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-bold shrink-0">
                {student.percentileText}
              </span>
            </div>

            <p className="text-xs text-slate-400 font-mono truncate" id="profile-details">
              {student.rollNo} • {student.department} • {student.semester}
            </p>

            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[11px] text-indigo-400 font-medium">
                <Zap className="w-3 h-3 text-indigo-400" />
                Rank #{student.rank} of {student.totalStudents}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-[11px] text-slate-300">
                {student.creditsEarned} / {student.totalCredits} Credits
              </span>
            </div>
          </div>
        </div>

        {/* Quick Metrics Grid - Matches screenshot exactly */}
        <div className={`grid grid-cols-3 gap-2.5 pt-2.5 border-t ${darkMode ? 'border-white/5' : 'border-slate-100'}`}>
          {/* CGPA */}
          <div
            className={`rounded-xl p-2.5 text-center border transition-all ${
              darkMode ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">CGPA</div>
            <div className="text-lg font-extrabold mt-0.5 flex items-center justify-center gap-1">
              <span>{student.cgpa.toFixed(2)}</span>
              <span className="text-[10px] text-emerald-400 font-normal">
                ▲ {student.cgpaChange.toFixed(2)}
              </span>
            </div>
            <div className="text-[9px] text-slate-400">Target: {student.targetCgpa.toFixed(2)}</div>
          </div>

          {/* Attendance */}
          <div
            className={`rounded-xl p-2.5 text-center border transition-all ${
              darkMode ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Attendance</div>
            <div className="text-lg font-extrabold text-emerald-400 mt-0.5">
              {student.attendancePct.toFixed(1)}%
            </div>
            <div className="text-[9px] text-emerald-400 font-medium">
              +{student.attendanceSafeZonePct.toFixed(1)}% Safe Zone
            </div>
          </div>

          {/* Bunk Buffer */}
          <div
            className={`rounded-xl p-2.5 text-center border transition-all ${
              darkMode ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Bunk Buffer</div>
            <div className="text-lg font-extrabold text-indigo-400 mt-0.5 flex items-center justify-center gap-0.5">
              <span>{student.bunkBufferHours}</span>
              <span className="text-xs font-normal text-slate-400">hrs</span>
            </div>
            <div className="text-[9px] text-indigo-400 font-medium">Safe to miss</div>
          </div>
        </div>
      </section>

      {/* Digital Student ID Modal */}
      {showIdCardModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="id-card-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowIdCardModal(false)}
        >
          <div
            className={`max-w-sm w-full rounded-3xl p-5 border shadow-2xl relative ${
              darkMode ? 'bg-slate-900 border-white/10 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowIdCardModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-800/20 text-slate-400 hover:text-white"
              aria-label="Close Student ID card"
            >
              <X className="w-5 h-5" />
            </button>

            {/* University Badge */}
            <div className="text-center pb-3 border-b border-white/10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold mb-1">
                <Shield className="w-3.5 h-3.5" />
                University Verified Digital ID
              </div>
              <h3 id="id-card-title" className="text-base font-bold">
                Institute of Technology & Science
              </h3>
              <p className="text-[11px] text-slate-400">Academic Year {student.batchYear}</p>
            </div>

            {/* Student Photo & Core info */}
            <div className="flex flex-col items-center my-4">
              <img
                src={student.avatarUrl}
                alt={student.name}
                className="w-20 h-20 rounded-2xl object-cover border-4 border-indigo-500/30 shadow-lg mb-2"
              />
              <h4 className="text-lg font-extrabold">{student.name}</h4>
              <p className="text-xs font-mono text-indigo-400 font-semibold">{student.rollNo}</p>
              <p className="text-xs text-slate-400">
                {student.department} • {student.semester} ({student.section})
              </p>
            </div>

            {/* Secondary Academic Data */}
            <div className="space-y-2 text-xs bg-slate-950/40 p-3 rounded-xl border border-white/5 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="font-mono text-slate-200 truncate">{student.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Faculty Advisor:</span>
                <span className="text-slate-200 font-medium">{student.academicAdvisor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Current CGPA:</span>
                <span className="font-bold text-emerald-400">{student.cgpa} / 10.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Campus Status:</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Regular • Good Standing
                </span>
              </div>
            </div>

            {/* Barcode Mock */}
            <div className="text-center pt-2">
              <div className="h-10 w-full bg-slate-800 rounded flex items-center justify-center font-mono text-[11px] tracking-widest text-slate-400 border border-white/5">
                ||| | |||| || | ||||| | ||| |||| |
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                NFC / RFID PASS: 9482-1094-8201
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
