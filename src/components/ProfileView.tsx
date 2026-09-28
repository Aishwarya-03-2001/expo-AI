import React from 'react';
import { User, Shield, Wifi, RefreshCw, Smartphone, Award, Settings, Check, HardDrive } from 'lucide-react';
import { User as UserType } from '../types';

interface ProfileViewProps {
  user: UserType;
  isOnline: boolean;
  pendingSyncCount: number;
  onSyncNow: () => void;
  onOpenAdminPortal: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  isOnline,
  pendingSyncCount,
  onSyncNow,
  onOpenAdminPortal,
}) => {
  return (
    <div className="space-y-5 pb-20 font-sans">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
        <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-600 shadow-sm" />
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">{user.name}</h2>
          <p className="text-xs text-blue-600 font-bold">{user.role}</p>
          <p className="text-xs text-slate-500 mt-0.5">{user.email} • {user.boothId}</p>
        </div>
      </div>

      {/* Offline Sync Card */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi className={`w-5 h-5 ${isOnline ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span className="font-bold text-sm">Offline Storage & Local Sync</span>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
            isOnline ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
          }`}>
            {isOnline ? 'Online Ready' : 'Offline Mode Active'}
          </span>
        </div>

        <p className="text-xs text-slate-300">
          ExpoConnect AI automatically persists all captured cards, voice notes, photos, and qualifications to local device storage.
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Pending Unsynced Items: {pendingSyncCount}</span>
          <button
            onClick={onSyncNow}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Force Sync Now</span>
          </button>
        </div>
      </div>

      {/* Exhibition Settings & Admin */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Exhibition Controls</h3>

        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 text-xs shadow-xs">
          <div className="p-4 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block">ADIPEC Booth Location</span>
              <span className="text-slate-500">Hall 8 - Stand 8340 (Abu Dhabi Energy Zone)</span>
            </div>
            <span className="text-blue-600 font-bold">Configured</span>
          </div>

          <div
            onClick={onOpenAdminPortal}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <div>
              <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-blue-600" /> Admin Management Portal
              </span>
              <span className="text-slate-500">Global lead exports, AI prompt rules & user accounts</span>
            </div>
            <span className="text-blue-600 font-bold">Open Portal →</span>
          </div>
        </div>
      </div>
    </div>
  );
};
