import React from 'react';
import { AppSettings, UserRole } from '../types';
import {
  Moon,
  Sun,
  Eye,
  Sliders,
  Bell,
  UserCheck,
  Shield,
  Smartphone,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenLoginModal: () => void;
  onResetDefaults: () => void;
  darkMode: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  role,
  onRoleChange,
  onOpenLoginModal,
  onResetDefaults,
  darkMode,
}) => {
  return (
    <div className="space-y-4" id="view-settings">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold">Preferences & Settings</h3>
          <p className="text-[11px] text-slate-400">Accessibility, theme & academic parameters</p>
        </div>
        <button
          onClick={onResetDefaults}
          className={`text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1 border transition-all ${
            darkMode ? 'glass-pill text-slate-300 hover:text-white' : 'bg-slate-100 text-slate-700 hover:text-slate-900'
          }`}
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* THEME & APPEARANCE */}
      <div
        className={`rounded-2xl p-4 border transition-all duration-200 ${
          darkMode ? 'glass-card border-white/10' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3 flex items-center gap-1.5">
          <Moon className="w-3.5 h-3.5" /> Appearance & Theme
        </h4>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold">Dark Mode</p>
              <p className="text-[11px] text-slate-400">Sleek dark canvas with glowing indigo accents</p>
            </div>
            <button
              id="settings-dark-mode-toggle"
              onClick={() => onUpdateSettings({ darkMode: !settings.darkMode })}
              role="switch"
              aria-checked={settings.darkMode}
              aria-label="Toggle dark mode"
              className={`w-11 h-6 rounded-full p-1 transition-colors relative ${
                settings.darkMode ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.darkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* ACCESSIBILITY STANDARDS */}
      <div
        className={`rounded-2xl p-4 border transition-all duration-200 ${
          darkMode ? 'glass-card border-white/10' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5" /> Essential Accessibility Controls
        </h4>

        <div className="space-y-3.5">
          {/* High Contrast Mode */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold">High Contrast Ratio (WCAG AAA)</p>
              <p className="text-[11px] text-slate-400">Enhance borders & text contrasts for maximum clarity</p>
            </div>
            <button
              id="high-contrast-toggle"
              onClick={() => onUpdateSettings({ highContrast: !settings.highContrast })}
              role="switch"
              aria-checked={settings.highContrast}
              aria-label="Toggle high contrast"
              className={`w-11 h-6 rounded-full p-1 transition-colors relative ${
                settings.highContrast ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.highContrast ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Reduce Motion */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold">Reduce Motion</p>
              <p className="text-[11px] text-slate-400">Minimize background pulses and interface transitions</p>
            </div>
            <button
              id="reduce-motion-toggle"
              onClick={() => onUpdateSettings({ reduceMotion: !settings.reduceMotion })}
              role="switch"
              aria-checked={settings.reduceMotion}
              aria-label="Toggle reduce motion"
              className={`w-11 h-6 rounded-full p-1 transition-colors relative ${
                settings.reduceMotion ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.reduceMotion ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Font Size Scaling */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs font-semibold">Font Size Scaling</p>
              <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase">
                {settings.fontSize}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['sm', 'base', 'lg'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => onUpdateSettings({ fontSize: size })}
                  className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                    settings.fontSize === size
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : darkMode
                      ? 'glass-pill text-slate-400 hover:text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {size === 'sm' ? 'Compact' : size === 'base' ? 'Standard' : 'Spacious'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ACADEMIC THRESHOLDS */}
      <div
        className={`rounded-2xl p-4 border transition-all duration-200 ${
          darkMode ? 'glass-card border-white/10' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5" /> University Regulations
        </h4>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold">Minimum Attendance Rule</span>
              <span className="font-mono font-bold text-amber-400">
                {settings.attendanceThreshold}% Minimum
              </span>
            </div>
            <input
              type="range"
              min="65"
              max="85"
              step="5"
              value={settings.attendanceThreshold}
              onChange={(e) =>
                onUpdateSettings({ attendanceThreshold: parseInt(e.target.value, 10) })
              }
              aria-label="Minimum attendance threshold"
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>65% (Relaxed)</span>
              <span>75% (Standard)</span>
              <span>85% (Honors)</span>
            </div>
          </div>
        </div>
      </div>

      {/* NOTIFICATION PREFERENCES */}
      <div
        className={`rounded-2xl p-4 border transition-all duration-200 ${
          darkMode ? 'glass-card border-white/10' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-3 flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5" /> Instant Push Alerts
        </h4>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold">Attendance Margin & Event Reminders</p>
            <p className="text-[11px] text-slate-400">Receive notifications when approaching 75% boundary</p>
          </div>
          <button
            id="notifs-master-toggle"
            onClick={() =>
              onUpdateSettings({ notificationsEnabled: !settings.notificationsEnabled })
            }
            role="switch"
            aria-checked={settings.notificationsEnabled}
            aria-label="Toggle notifications"
            className={`w-11 h-6 rounded-full p-1 transition-colors relative ${
              settings.notificationsEnabled ? 'bg-sky-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                settings.notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* ACCOUNT SWITCHER / LOGIN BUTTON */}
      <div
        className={`rounded-2xl p-4 border transition-all duration-200 ${
          darkMode ? 'glass-card border-white/10' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" /> Authentication & Role Access
        </h4>
        <p className="text-xs text-slate-400 mb-3">
          Currently operating as <strong className="text-white capitalize">{role}</strong>.
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onRoleChange(role === 'student' ? 'faculty' : 'student')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
              darkMode ? 'glass-pill text-indigo-400 border-indigo-500/30' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
            }`}
          >
            Switch to {role === 'student' ? 'Faculty Portal' : 'Student Portal'}
          </button>
          <button
            onClick={onOpenLoginModal}
            className="flex-1 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all"
          >
            Login Form / Auth
          </button>
        </div>
      </div>
    </div>
  );
};
