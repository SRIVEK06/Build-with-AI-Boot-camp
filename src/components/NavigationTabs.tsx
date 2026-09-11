import React from 'react';
import { ActiveTab } from '../types';
import { BarChart3, Clock, Zap, BookOpen, Settings } from 'lucide-react';

interface NavigationTabsProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  darkMode: boolean;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
  darkMode,
}) => {
  const tabs = [
    {
      id: 'analytics' as ActiveTab,
      label: 'Performance',
      icon: BarChart3,
      iconColor: 'text-indigo-400',
    },
    {
      id: 'attendance' as ActiveTab,
      label: 'Attendance & Bunk Lab',
      icon: Clock,
      iconColor: 'text-emerald-400',
    },
    {
      id: 'opportunities' as ActiveTab,
      label: 'Opportunities',
      icon: Zap,
      iconColor: 'text-amber-400',
    },
    {
      id: 'resources' as ActiveTab,
      label: 'Resources',
      icon: BookOpen,
      iconColor: 'text-sky-400',
    },
    {
      id: 'settings' as ActiveTab,
      label: 'Settings',
      icon: Settings,
      iconColor: 'text-purple-400',
    },
  ];

  return (
    <nav
      aria-label="Academic workspace modules"
      className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-1 mb-4"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            role="tab"
            aria-selected={isActive}
            className={`px-3.5 py-1.5 text-xs rounded-xl whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 shrink-0 ${
              isActive
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                : darkMode
                ? 'glass-pill text-slate-300 hover:text-white font-semibold'
                : 'bg-white border border-slate-200 text-slate-700 hover:text-slate-900 font-semibold shadow-2xs'
            }`}
          >
            <Icon
              className={`w-3.5 h-3.5 ${isActive ? 'text-white' : tab.iconColor}`}
              aria-hidden="true"
            />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
