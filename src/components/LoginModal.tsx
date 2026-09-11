import React, { useState } from 'react';
import { UserRole } from '../types';
import {
  X,
  Lock,
  Mail,
  Eye,
  EyeOff,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  User,
  ArrowRight,
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: UserRole, email: string) => void;
  darkMode: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  darkMode,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [emailOrRoll, setEmailOrRoll] = useState<string>('CS2022-048');
  const [password, setPassword] = useState<string>('••••••••');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrRoll.trim()) {
      setErrorMessage('Please enter your University Roll Number or Email.');
      return;
    }
    setErrorMessage('');
    onLoginSuccess(selectedRole, emailOrRoll);
    onClose();
  };

  const handleQuickDemo = (role: UserRole) => {
    if (role === 'student') {
      setEmailOrRoll('CS2022-048');
      onLoginSuccess('student', 'aarav.sharma22@university.edu');
    } else {
      setEmailOrRoll('FAC-MENON-01');
      onLoginSuccess('faculty', 'rajiv.menon@university.edu');
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`max-w-md w-full rounded-3xl p-6 border shadow-2xl relative overflow-hidden ${
          darkMode ? 'bg-slate-900 border-white/10 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-indigo-500/25 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-800/20 text-slate-400 hover:text-white"
          aria-label="Close login dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with App Logo */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-2">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h2 id="login-title" className="text-lg font-extrabold tracking-tight">
            PulseEdu Portal Sign In
          </h2>
          <p className="text-xs text-slate-400">
            Access your personalized academic trajectory and attendance hub
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div
          className={`grid grid-cols-2 gap-1.5 p-1 rounded-xl mb-4 border text-xs ${
            darkMode ? 'bg-slate-950/80 border-white/5' : 'bg-slate-100 border-slate-200'
          }`}
          role="group"
          aria-label="Select login role"
        >
          <button
            type="button"
            onClick={() => {
              setSelectedRole('student');
              setEmailOrRoll('CS2022-048');
            }}
            aria-pressed={selectedRole === 'student'}
            className={`py-2 rounded-lg font-bold transition-all ${
              selectedRole === 'student'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white font-semibold'
            }`}
          >
            Student Account
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedRole('faculty');
              setEmailOrRoll('rajiv.menon@university.edu');
            }}
            aria-pressed={selectedRole === 'faculty'}
            className={`py-2 rounded-lg font-bold transition-all ${
              selectedRole === 'faculty'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white font-semibold'
            }`}
          >
            Faculty & Admin
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 font-medium">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              {selectedRole === 'student' ? 'Student Roll Number or ID:' : 'Faculty University Email:'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={emailOrRoll}
                onChange={(e) => setEmailOrRoll(e.target.value)}
                placeholder={selectedRole === 'student' ? 'e.g. CS2022-048' : 'e.g. prof@university.edu'}
                required
                className={`w-full rounded-xl pl-9 pr-3 py-2.5 font-medium transition-colors focus:outline-hidden focus:border-indigo-500 ${
                  darkMode
                    ? 'bg-slate-950 border border-white/10 text-white'
                    : 'bg-slate-50 border border-slate-300 text-slate-900'
                }`}
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-300">Password:</label>
              <button
                type="button"
                onClick={() => alert('Password reset link sent to your registered university email.')}
                className="text-[11px] text-indigo-400 hover:underline"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your security credentials"
                required
                className={`w-full rounded-xl pl-9 pr-10 py-2.5 font-medium transition-colors focus:outline-hidden focus:border-indigo-500 ${
                  darkMode
                    ? 'bg-slate-950 border border-white/10 text-white'
                    : 'bg-slate-50 border border-slate-300 text-slate-900'
                }`}
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
              />
              <span className="text-slate-300 text-xs">Remember this device</span>
            </label>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> 256-bit Encrypted
            </span>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all mt-2"
          >
            <span>Sign In to Academic Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick Demo Login shortcuts */}
        <div className="mt-5 pt-4 border-t border-white/10">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2.5">
            Instant Demo Profiles
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('student')}
              className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                darkMode
                  ? 'bg-slate-950/60 border-white/5 hover:border-indigo-500/40'
                  : 'bg-slate-50 border-slate-200 hover:border-indigo-400'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                AS
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold truncate">Aarav (Student)</p>
                <p className="text-[9px] text-emerald-400">Rank #14 • 8.84</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('faculty')}
              className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                darkMode
                  ? 'bg-slate-950/60 border-white/5 hover:border-indigo-500/40'
                  : 'bg-slate-50 border-slate-200 hover:border-indigo-400'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold text-xs shrink-0">
                RM
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold truncate">Dr. Rajiv (HoD)</p>
                <p className="text-[9px] text-indigo-400">Dept of CSE</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
