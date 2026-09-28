import React from 'react';
import { Home, Users, Calendar, Bot, User as UserIcon } from 'lucide-react';

interface BottomNavProps {
  currentTab: 'home' | 'leads' | 'calendar' | 'assistant' | 'profile';
  onChangeTab: (tab: 'home' | 'leads' | 'calendar' | 'assistant' | 'profile') => void;
  unreadLeadsCount?: number;
}

interface TabItem {
  id: 'home' | 'leads' | 'calendar' | 'assistant' | 'profile';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onChangeTab,
  unreadLeadsCount = 0,
}) => {
  const tabs: TabItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'leads', label: 'Leads', icon: Users, badge: unreadLeadsCount },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'assistant', label: 'AI Co-Pilot', icon: Bot },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 text-slate-800 px-2 py-1.5 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-blue-600 font-extrabold'
                  : 'text-slate-500 font-medium hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[9px] uppercase font-bold tracking-tight">{tab.label}</span>

              {tab.badge && tab.badge > 0 ? (
                <span className="absolute -top-1 right-1.5 w-3.5 h-3.5 bg-blue-600 text-white rounded-full text-[9px] font-black flex items-center justify-center">
                  {tab.badge}
                </span>
              ) : null}

              {isActive && (
                <span className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-blue-600" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
