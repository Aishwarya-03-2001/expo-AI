import React from 'react';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';

interface OfflineBannerProps {
  isOnline: boolean;
  pendingSyncCount: number;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOnline, pendingSyncCount }) => {
  if (isOnline && pendingSyncCount === 0) return null;

  return (
    <div className={`px-4 py-2 flex items-center justify-between text-xs font-medium transition-colors ${
      !isOnline ? 'bg-amber-500 text-slate-950' : 'bg-emerald-600 text-white'
    }`}>
      <div className="flex items-center gap-2">
        {!isOnline ? (
          <>
            <WifiOff className="w-4 h-4 animate-pulse" />
            <span><strong>Offline Mode Active</strong> — Scans, notes & leads saved locally ({pendingSyncCount} queued)</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-4 h-4" />
            <span>Back online! Syncing queued records...</span>
          </>
        )}
      </div>

      {!isOnline && (
        <span className="bg-amber-600/30 text-amber-950 px-2 py-0.5 rounded text-[10px] font-semibold border border-amber-600/40">
          Auto-Sync Enabled
        </span>
      )}
    </div>
  );
};
