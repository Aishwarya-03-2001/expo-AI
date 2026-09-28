import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Video, PhoneCall, Building2, Plus, Check, ChevronLeft, ChevronRight, User, Mail } from 'lucide-react';
import { Meeting, Lead, MeetingType } from '../types';

interface CalendarViewProps {
  meetings: Meeting[];
  leads: Lead[];
  onAddMeeting: (meeting: Omit<Meeting, 'id'>) => void;
  onSelectLead?: (leadId: string) => void;
  onRequestMeeting?: (leadId?: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  meetings,
  leads,
  onAddMeeting,
  onSelectLead,
  onRequestMeeting,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterType, setFilterType] = useState<string>('All');

  // Form State
  const [selectedLeadId, setSelectedLeadId] = useState<string>(leads[0]?.id || '');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-08-04');
  const [time, setTime] = useState('11:00 AM');
  const [location, setLocation] = useState('ADIPEC VIP Lounge - Hall 8');
  const [meetingType, setMeetingType] = useState<MeetingType>('Demo');
  const [notes, setNotes] = useState('');

  const filteredMeetings = filterType === 'All' ? meetings : meetings.filter(m => m.type === filterType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lead = leads.find(l => l.id === selectedLeadId);
    if (!lead) return;

    onAddMeeting({
      leadId: lead.id,
      leadName: lead.fullName,
      company: lead.company,
      title: title || `${meetingType} with ${lead.fullName}`,
      date,
      time,
      location,
      type: meetingType,
      status: 'Scheduled',
      notes,
    });

    setShowAddModal(false);
    setTitle('');
  };

  const getTypeBadge = (type: MeetingType) => {
    switch (type) {
      case 'Demo': return <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px]">Demo</span>;
      case 'Online': return <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">Online</span>;
      case 'Office Visit': return <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px]">Office Visit</span>;
      default: return <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold text-[10px]">Phone Call</span>;
    }
  };

  return (
    <div className="space-y-5 pb-20 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            <span>ADIPEC Schedule</span>
          </h2>
          <p className="text-xs text-slate-500">Upcoming meetings, booth demos, and discussions</p>
        </div>

        <div className="flex items-center gap-2">
          {onRequestMeeting && (
            <button
              onClick={() => onRequestMeeting()}
              className="px-3.5 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Mail className="w-4 h-4 text-indigo-600" />
              <span>Request Post-ADIPEC Meeting</span>
            </button>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
        {['All', 'Demo', 'Online', 'Office Visit', 'Phone Call'].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-xl border transition-all whitespace-nowrap ${
              filterType === t
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Calendar Grid Simulation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-900 pb-2 border-b border-slate-100">
          <span>August 2026 (Exhibition Week)</span>
          <div className="flex gap-1">
            <button className="p-1 rounded bg-slate-100 text-slate-600"><ChevronLeft className="w-4 h-4" /></button>
            <button className="p-1 rounded bg-slate-100 text-slate-600"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Days Strip */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400">
          <span>MON 3</span>
          <span className="text-blue-600 font-bold">TUE 4 ★</span>
          <span>WED 5</span>
          <span>THU 6</span>
          <span>FRI 7</span>
          <span>SAT 8</span>
          <span>SUN 9</span>
        </div>
      </div>

      {/* Meetings List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Scheduled Meetings ({filteredMeetings.length})</h3>

        {filteredMeetings.map((meet) => (
          <div
            key={meet.id}
            onClick={() => onSelectLead && onSelectLead(meet.leadId)}
            className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs hover:border-blue-500 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {getTypeBadge(meet.type)}
                <h4 className="font-bold text-slate-900 text-sm">{meet.title}</h4>
              </div>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>{meet.leadName} ({meet.company})</span>
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>{meet.date} @ {meet.time}</span>
              </div>
              <div className="flex items-center gap-1 truncate">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span className="truncate max-w-[150px]">{meet.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Meeting Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-slate-900 text-base">Schedule ADIPEC Meeting</h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700">Select Lead *</label>
                <select
                  value={selectedLeadId}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium"
                >
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.fullName} ({l.company})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700">Meeting Title</label>
                <input
                  type="text"
                  placeholder="e.g. Predictive Maintenance AI Demo"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Time</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="11:00 AM"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Meeting Type</label>
                  <select
                    value={meetingType}
                    onChange={(e) => setMeetingType(e.target.value as MeetingType)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                  >
                    <option value="Demo">Demo</option>
                    <option value="Online">Online</option>
                    <option value="Office Visit">Office Visit</option>
                    <option value="Phone Call">Phone Call</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="ADIPEC Hall 8 VIP Lounge"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700">Preparation Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Bring offshore demo dataset..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 font-semibold text-slate-500">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs">
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
