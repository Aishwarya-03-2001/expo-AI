import React, { useState } from 'react';
import { Bot, Bell, Shield, Wifi, WifiOff, Smartphone, Monitor, ChevronDown, Sparkles } from 'lucide-react';
import { User, AppNotification } from '../types';

interface NavbarProps {
  currentUser: User;
  users: User[];
  onSelectUser: (user: User) => void;
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  isOnline: boolean;
  pendingSyncCount: number;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  users,
  onSelectUser,
  notifications,
  onOpenNotifications,
  isOnline,
  pendingSyncCount,
  isMobileFrame,
  onToggleMobileFrame,
  onOpenAdmin,
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 text-slate-900 px-3 sm:px-6 py-2.5 shrink-0 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-base shadow-xs">
            E
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-slate-900">
                ExpoConnect <span className="text-blue-600 font-extrabold">AI</span>
              </h1>
              <span className="hidden sm:inline-block px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full border border-blue-100">
                ADIPEC 2026
              </span>
            </div>
            <p className="text-[10px] text-slate-500 truncate max-w-[140px] sm:max-w-none">
              {currentUser.boothId}
            </p>
          </div>
        </div>

        {/* Center / Status */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-600 font-medium bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          <span>{isOnline ? 'Cloud Sync Active' : `Offline (${pendingSyncCount} pending)`}</span>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2">
          {/* Frame Toggle */}
          <button
            onClick={onToggleMobileFrame}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isMobileFrame
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
            title="Toggle Desktop Frame Layout"
          >
            {isMobileFrame ? <Smartphone className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isMobileFrame ? 'Frame View' : 'Full Screen'}</span>
          </button>

          {/* Admin Switch */}
          <button
            onClick={onOpenAdmin}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Admin Portal"
          >
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden md:inline">Admin</span>
          </button>

          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-left transition-all"
            >
              <img src={currentUser.avatar} alt={currentUser.name} className="w-7 h-7 rounded-lg object-cover border border-slate-200" />
              <div className="hidden sm:block">
                <span className="text-xs font-bold text-slate-900 block leading-none">{currentUser.name}</span>
                <span className="text-[10px] text-blue-600 font-semibold leading-none">{currentUser.role}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 text-xs">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100 mb-1">
                  Switch Sales Rep Profile
                </div>
                {users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => { onSelectUser(u); setShowRoleDropdown(false); }}
                    className={`w-full text-left p-2 rounded-xl flex items-center gap-2.5 hover:bg-slate-50 transition-colors ${
                      currentUser.id === u.id ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700'
                    }`}
                  >
                    <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-md object-cover" />
                    <div>
                      <span className="block text-xs font-semibold">{u.name}</span>
                      <span className="text-[10px] text-slate-500">{u.role}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
