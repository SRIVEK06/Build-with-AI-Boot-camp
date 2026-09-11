import React, { useState, useRef, useEffect } from 'react';
import { UserRole, AppNotification } from '../types';
import {
  GraduationCap,
  Bell,
  Sun,
  Moon,
  CheckCheck,
  User,
  ShieldCheck,
  Sparkles,
  LogOut,
  AlertTriangle,
  Calendar,
  BookOpen,
} from 'lucide-react';

interface HeaderProps {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  notifications: AppNotification[];
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
  onOpenLoginModal: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  userName: string;
}

export const Header: React.FC<HeaderProps> = ({
  role,
  onRoleChange,
  darkMode,
  onToggleDarkMode,
  notifications,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onOpenLoginModal,
  isLoggedIn,
  onLogout,
  userName,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      id="app-header"
      className={`sticky top-0 z-40 px-4 py-2.5 border-b backdrop-blur-xl transition-colors duration-200 ${
        darkMode
          ? 'bg-slate-950/85 border-white/10 text-slate-100'
          : 'bg-white/90 border-slate-200/80 text-slate-800 shadow-xs'
      }`}
    >
      <div className="max-w-xl mx-auto flex items-center justify-between gap-2">
        {/* Logo and App Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-extrabold tracking-tight">PulseEdu</h1>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                v2.4
              </span>
            </div>
            <p className={`text-[11px] leading-none ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Student Analytics & Hub
            </p>
          </div>
        </div>

        {/* Right Controls: Role toggle, Theme, Notifications, User */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Role Toggle */}
          <div
            className={`p-0.5 rounded-lg flex items-center text-xs font-semibold ${
              darkMode ? 'bg-slate-900 border border-white/10' : 'bg-slate-100 border border-slate-200'
            }`}
            role="group"
            aria-label="User role switcher"
          >
            <button
              id="role-student-btn"
              onClick={() => onRoleChange('student')}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all duration-150 ${
                role === 'student'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : darkMode
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              aria-pressed={role === 'student'}
            >
              Student
            </button>
            <button
              id="role-faculty-btn"
              onClick={() => onRoleChange('faculty')}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all duration-150 ${
                role === 'faculty'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : darkMode
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              aria-pressed={role === 'faculty'}
            >
              Faculty
            </button>
          </div>

          {/* Theme Toggle Button */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleDarkMode}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              darkMode
                ? 'bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800'
                : 'bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Notification Bell with Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              id="notif-toggle-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-expanded={showNotifications}
              aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
              className={`w-8 h-8 rounded-lg flex items-center justify-center relative transition-colors ${
                darkMode
                  ? 'bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800'
                  : 'bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-slate-950 animate-pulse" />
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div
                className={`absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl p-3 border z-50 animate-in fade-in zoom-in-95 duration-150 ${
                  darkMode ? 'bg-slate-900 border-white/10 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                }`}
                role="region"
                aria-label="Notifications panel"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider">Alerts & Notices</h3>
                    {unreadCount > 0 && (
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.2 rounded font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={onMarkAllNotificationsRead}
                      className="text-[10px] text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <CheckCheck className="w-3 h-3" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1 hide-scrollbar">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No notifications right now.</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => onMarkNotificationRead(n.id)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          n.unread
                            ? darkMode
                              ? 'bg-indigo-950/30 border-indigo-500/30'
                              : 'bg-indigo-50/70 border-indigo-200'
                            : darkMode
                            ? 'bg-slate-900/40 border-white/5 opacity-75'
                            : 'bg-slate-50 border-slate-100 opacity-80'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5 shrink-0">
                            {n.type === 'attendance' ? (
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                            ) : n.type === 'event' ? (
                              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                            ) : (
                              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[11px] truncate">{n.title}</span>
                              <span className="text-[9px] text-slate-400 shrink-0 ml-1">{n.timestamp}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{n.message}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Login Button */}
          <div className="relative" ref={userRef}>
            <button
              id="user-menu-btn"
              onClick={() => (isLoggedIn ? setShowUserMenu(!showUserMenu) : onOpenLoginModal())}
              aria-label={isLoggedIn ? `Account menu for ${userName}` : 'Sign in'}
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-colors ${
                isLoggedIn
                  ? 'bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-xs'
                  : darkMode
                  ? 'bg-slate-900 border border-white/10 text-slate-300 hover:text-white'
                  : 'bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900'
              }`}
            >
              {isLoggedIn ? (
                userName.substring(0, 2).toUpperCase()
              ) : (
                <User className="w-4 h-4" />
              )}
            </button>

            {/* User Dropdown */}
            {isLoggedIn && showUserMenu && (
              <div
                className={`absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl p-2 border z-50 animate-in fade-in zoom-in-95 duration-150 ${
                  darkMode ? 'bg-slate-900 border-white/10 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                <div className="px-2.5 py-2 border-b border-white/10 mb-1">
                  <p className="text-xs font-bold truncate">{userName}</p>
                  <p className="text-[10px] text-indigo-400 font-medium capitalize">
                    {role} account • Verified
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenLoginModal();
                  }}
                  className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs flex items-center gap-2 transition-colors ${
                    darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  Switch Credentials / Login
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs flex items-center gap-2 text-rose-400 transition-colors ${
                    darkMode ? 'hover:bg-rose-950/30' : 'hover:bg-rose-50'
                  }`}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
