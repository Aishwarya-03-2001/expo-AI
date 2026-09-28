import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Users, CheckCircle, Flame, Calendar, Mail, Clock, TrendingUp, Award, Layers } from 'lucide-react';
import { Lead, Meeting } from '../types';

interface DashboardViewProps {
  leads: Lead[];
  meetings: Meeting[];
  onSelectLead?: (leadId: string) => void;
}

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export const DashboardView: React.FC<DashboardViewProps> = ({ leads, meetings, onSelectLead }) => {
  const totalVisitors = leads.length + 18; // Includes general booth scan count
  const qualifiedLeads = leads.filter(l => l.potential !== 'Not Interested').length;
  const hotLeads = leads.filter(l => l.potential === 'Hot').length;
  const scheduledMeetings = meetings.length;
  const emailsSent = leads.reduce((acc, l) => acc + l.timeline.filter(e => e.type === 'email_sent').length, 0);
  const pendingFollowups = leads.filter(l => l.potential === 'Hot' && !l.timeline.some(e => e.type === 'email_sent')).length;
  const conversionRate = Math.round((qualifiedLeads / Math.max(1, totalVisitors)) * 100);

  // Industry distribution
  const industryMap: Record<string, number> = {};
  leads.forEach(l => {
    industryMap[l.industry] = (industryMap[l.industry] || 0) + 1;
  });
  const industryData = Object.entries(industryMap).map(([name, value]) => ({ name, value }));

  // Interested solutions breakdown
  const solutionMap: Record<string, number> = {};
  leads.forEach(l => {
    l.interests.forEach(int => {
      solutionMap[int] = (solutionMap[int] || 0) + 1;
    });
  });
  const solutionData = Object.entries(solutionMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Potential Breakdown
  const potentialData = [
    { name: 'Hot', value: leads.filter(l => l.potential === 'Hot').length, color: '#EF4444' },
    { name: 'Warm', value: leads.filter(l => l.potential === 'Warm').length, color: '#F59E0B' },
    { name: 'Cold', value: leads.filter(l => l.potential === 'Cold').length, color: '#3B82F6' },
  ];

  return (
    <div className="space-y-5 pb-20 font-sans">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <span>Sales Analytics</span>
        </h2>
        <p className="text-xs text-slate-500">Booth visitor intelligence & conversion metrics</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Today's Visitors</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalVisitors}</div>
          <span className="text-[10px] text-emerald-600 font-bold">↑ +24% vs yesterday</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Qualified Leads</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{qualifiedLeads}</div>
          <span className="text-[10px] text-emerald-600 font-bold">{conversionRate}% Conversion Rate</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Hot Prospects</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600">{hotLeads}</div>
          <span className="text-[10px] text-rose-500 font-semibold">High priority</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Demos & Meetings</span>
            <Calendar className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{scheduledMeetings}</div>
          <span className="text-[10px] text-amber-600 font-semibold">Scheduled for ADIPEC</span>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-slate-800">Emails Sent to Prospects</span>
          </div>
          <span className="font-extrabold text-blue-600 text-sm">{emailsSent}</span>
        </div>

        <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="font-semibold text-slate-800">Pending Hot Follow-ups</span>
          </div>
          <span className="font-extrabold text-amber-600 text-sm">{pendingFollowups}</span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Top Solutions Requested */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-xs text-slate-900 mb-3 uppercase tracking-wider">Top Solutions Requested</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={solutionData} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#64748B' }} width={110} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563EB" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Potential Breakdown */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-xs text-slate-900 mb-3 uppercase tracking-wider">Lead Potential Distribution</h3>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={potentialData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {potentialData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
