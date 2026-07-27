import React from 'react';
import { ActiveTab } from '../types';
import { Home, FileText, Pill, FolderHeart, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  unresolvedReportsCount?: number;
  medsToTakeCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  unresolvedReportsCount = 0,
  medsToTakeCount = 0,
}) => {
  const tabs = [
    {
      id: 'home' as ActiveTab,
      label: 'Home',
      icon: Home,
      badge: 0,
    },
    {
      id: 'reports' as ActiveTab,
      label: 'Reports',
      icon: FileText,
      badge: unresolvedReportsCount,
    },
    {
      id: 'medications' as ActiveTab,
      label: 'Meds',
      icon: Pill,
      badge: medsToTakeCount,
    },
    {
      id: 'history' as ActiveTab,
      label: 'EMR',
      icon: FolderHeart,
      badge: 0,
    },
    {
      id: 'profile' as ActiveTab,
      label: 'Profile',
      icon: User,
      badge: 0,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg">
      <div className="max-w-md sm:max-w-xl mx-auto flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center py-1 px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-blue-600 font-bold bg-blue-50/80'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-blue-600' : 'text-slate-400'
                  }`}
                />
                {tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
