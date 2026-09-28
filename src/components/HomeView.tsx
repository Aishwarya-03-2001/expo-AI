import React from 'react';
import { Camera, CreditCard, Mic, Sparkles, Plus, Flame, ArrowRight, Clock, Users, Calendar, CheckCircle } from 'lucide-react';
import { Lead, Meeting } from '../types';

interface HomeViewProps {
  leads: Lead[];
  meetings: Meeting[];
  onOpenCardScanner: () => void;
  onOpenCustomerPhoto: () => void;
  onOpenVoiceNotes: () => void;
  onOpenNewLead: () => void;
  onSelectLead: (leadId: string) => void;
  onNavigateTab: (tab: 'leads' | 'calendar' | 'assistant') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  leads,
  meetings,
  onOpenCardScanner,
  onOpenCustomerPhoto,
  onOpenVoiceNotes,
  onOpenNewLead,
  onSelectLead,
  onNavigateTab,
}) => {
  const hotLeads = leads.filter(l => l.potential === 'Hot').slice(0, 3);
  const recentLeads = leads.slice(0, 4);
  const todayMeetings = meetings.slice(0, 2);

  return (
    <div className="space-y-5 pb-20 font-sans">
      {/* High Density AI Assistant Hero Banner */}
      <div className="bg-blue-600 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] uppercase font-bold tracking-wider">
              Scanned & Synchronized
            </span>
            <span className="text-[11px] opacity-80 font-medium">ADIPEC Stand 8340</span>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-bold leading-tight">Robert Cheng</h2>
            <p className="text-xs sm:text-sm text-blue-100 font-medium">Operations Director, Aramco</p>
          </div>

          {/* Quick Action Trigger Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <button
              onClick={onOpenCardScanner}
              className="py-2 px-3 bg-white text-blue-600 hover:bg-blue-50 rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transform active:scale-95 transition-all uppercase tracking-wider"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Scan Card</span>
            </button>

            <button
              onClick={onOpenVoiceNotes}
              className="py-2 px-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <Mic className="w-3.5 h-3.5 text-rose-300" />
              <span>Voice Debrief</span>
            </button>

            <button
              onClick={onOpenCustomerPhoto}
              className="py-2 px-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <Camera className="w-3.5 h-3.5 text-sky-300" />
              <span>Take Photo</span>
            </button>

            <button
              onClick={onOpenNewLead}
              className="py-2 px-3 bg-slate-900/40 hover:bg-slate-900/60 text-white border border-white/20 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-300" />
              <span>Manual Lead</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Summary Highlight */}
      <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-100">
        <div className="flex items-center gap-1.5 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <p className="text-[10px] font-bold text-blue-800 uppercase tracking-widest">Latest Lead Summary</p>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed font-sans">
          "Looking for end-to-end AI monitoring for offshore platforms. Needs demo scheduled during ADIPEC exhibition week."
        </p>
      </div>

      {/* Hot Prospects Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Hot ADIPEC Prospects</h3>
          </div>
          <button
            onClick={() => onNavigateTab('leads')}
            className="text-[11px] font-bold text-blue-600 flex items-center gap-1 hover:underline"
          >
            <span>View Directory ({leads.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {hotLeads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => onSelectLead(lead.id)}
              className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-blue-500 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                  🔥 Hot Lead
                </span>
                <span className="text-[10px] text-slate-400 font-medium">{lead.country}</span>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs group-hover:text-blue-600 transition-colors">
                  {lead.fullName}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">{lead.company}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span>{lead.industry}</span>
                <span className="text-emerald-600 font-bold">{lead.dealValue}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Meetings & Recent Visitors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Meetings Widget */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" /> Demos & Meetings Today
            </h4>
            <button onClick={() => onNavigateTab('calendar')} className="text-[10px] text-blue-600 font-bold hover:underline">
              Schedule
            </button>
          </div>

          <div className="space-y-2">
            {todayMeetings.map((m) => (
              <div
                key={m.id}
                onClick={() => onNavigateTab('calendar')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-100 text-xs space-y-0.5"
              >
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>{m.title}</span>
                  <span className="text-blue-600 font-bold">{m.time}</span>
                </div>
                <p className="text-[11px] text-slate-500">{m.leadName} • {m.company}</p>
                <p className="text-[10px] text-slate-400 italic">📍 {m.location}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Visitors */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-600" /> Booth Visitors Activity
            </h4>
            <button onClick={() => onNavigateTab('leads')} className="text-[10px] text-blue-600 font-bold hover:underline">
              All Leads
            </button>
          </div>

          <div className="space-y-2">
            {recentLeads.map((l) => (
              <div
                key={l.id}
                onClick={() => onSelectLead(l.id)}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer text-xs flex items-center justify-between"
              >
                <div>
                  <h5 className="font-bold text-slate-900">{l.fullName}</h5>
                  <p className="text-[11px] text-slate-500">{l.company} • {l.industry}</p>
                </div>
                <span className="text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded-md font-bold">
                  {l.potential}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
