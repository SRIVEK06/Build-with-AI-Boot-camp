import React from 'react';
import { ActiveTab } from '../types';
import { BarChart3, Clock, Zap, BookOpen, Settings } from 'lucide-react';

interface BottomNavBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  darkMode: boolean;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabChange,
  darkMode,
}) => {
  const items = [
    { id: 'analytics' as ActiveTab, label: 'Analytics', icon: BarChart3 },
    { id: 'attendance' as ActiveTab, label: 'Attendance', icon: Clock },
    { id: 'opportunities' as ActiveTab, label: 'Events', icon: Zap },
    { id: 'resources' as ActiveTab, label: 'Library', icon: BookOpen },
    { id: 'settings' as ActiveTab, label: 'Settings', icon: Settings },
  ];

  return (
    <nav
      id="bottom-app-nav"
      aria-label="Mobile application navigation"
      className={`fixed bottom-0 left-0 right-0 max-w-xl mx-auto backdrop-blur-xl border-t px-4 py-2 flex items-center justify-between z-40 transition-colors duration-200 ${
        darkMode
          ? 'bg-slate-950/90 border-white/10 text-slate-400'
          : 'bg-white/95 border-slate-200 text-slate-500 shadow-lg'
      }`}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            id={`bottom-nav-${item.id}`}
            onClick={() => onTabChange(item.id)}
            role="tab"
            aria-selected={isActive}
            className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all duration-150 ${
              isActive
                ? 'text-indigo-500 font-bold scale-105'
                : darkMode
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon className="w-5 h-5 transition-transform" />
            <span className="text-[10px] font-medium leading-none">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
