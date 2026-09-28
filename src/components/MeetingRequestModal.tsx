import React, { useState } from 'react';
import { X, Calendar, Clock, Send, CheckCircle2, Mail, CalendarPlus, Sparkles } from 'lucide-react';
import { Lead } from '../types';

interface MeetingRequestModalProps {
  lead: Lead;
  senderName: string;
  onClose: () => void;
  onScheduleMeeting: (meeting: {
    leadId: string;
    leadName: string;
    company: string;
    title: string;
    date: string;
    time: string;
    location: string;
    type: 'Online' | 'Office Visit' | 'Phone Call' | 'Demo';
    notes?: string;
  }) => void;
  onSendEmail?: (subject: string, body: string) => void;
}

export const MeetingRequestModal: React.FC<MeetingRequestModalProps> = ({
  lead,
  senderName,
  onClose,
  onScheduleMeeting,
  onSendEmail,
}) => {
  // Step 1: Salesperson selects Date & Time
  // Step 2: Email generated & sent preview
  // Step 3: Customer clicks "Confirm Meeting" -> Added to calendar
  const [step, setStep] = useState<'request' | 'sent_email' | 'confirmed'>('request');

  const [date, setDate] = useState('2026-08-12');
  const [displayDate, setDisplayDate] = useState('Tuesday, 12 August');
  const [time, setTime] = useState('3:00 PM – 3:30 PM');
  const [meetingTitle, setMeetingTitle] = useState(`Post-ADIPEC Connection Meeting with ${lead.company}`);

  // Helper to format raw date input to friendly string
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    setDate(rawVal);
    if (rawVal) {
      const parsed = new Date(rawVal + 'T00:00:00');
      if (!isNaN(parsed.getTime())) {
        const formatted = parsed.toLocaleDateString('en-US', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        });
        setDisplayDate(formatted);
      }
    }
  };

  const handleSendRequest = () => {
    setStep('sent_email');
    if (onSendEmail) {
      const emailBody = `Thank you for meeting us at ADIPEC.\n\nAs discussed, we'd like to meet on:\n\n${displayDate}\n${time}\n\nBest regards,\n${senderName}`;
      onSendEmail(`Meeting Request: Post-ADIPEC Connection (${lead.company})`, emailBody);
    }
  };

  const handleCustomerConfirm = () => {
    // Schedule meeting in app calendar
    onScheduleMeeting({
      leadId: lead.id,
      leadName: lead.fullName,
      company: lead.company,
      title: meetingTitle,
      date: displayDate,
      time: time,
      location: 'Online Video Call / Calendar Invite',
      type: 'Online',
      notes: `Post-ADIPEC follow-up meeting requested by ${senderName} and confirmed by customer.`,
    });
    setStep('confirmed');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Schedule Post-ADIPEC Meeting</h3>
              <p className="text-slate-500 text-xs">Direct meeting invite for {lead.fullName} ({lead.company})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Salesperson Question & Date/Time Selection */}
        {step === 'request' && (
          <div className="p-6 space-y-5">
            {/* Conversation Question Prompt */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-2">
              <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Sales Conversation Prompt
              </span>
              <p className="text-sm font-semibold text-slate-900 italic leading-snug">
                "When would be a good time for us to connect after ADIPEC?"
              </p>
            </div>

            {/* Form controls */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Meeting Title</label>
                <input
                  type="text"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" /> Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={handleDateChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-600"
                  />
                  <span className="text-[10px] text-blue-600 font-bold block mt-1">
                    Selected: {displayDate}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-600" /> Time
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-600"
                  >
                    <option value="9:00 AM – 9:30 AM">9:00 AM – 9:30 AM</option>
                    <option value="10:00 AM – 10:30 AM">10:00 AM – 10:30 AM</option>
                    <option value="11:30 AM – 12:00 PM">11:30 AM – 12:00 PM</option>
                    <option value="2:00 PM – 2:30 PM">2:00 PM – 2:30 PM</option>
                    <option value="3:00 PM – 3:30 PM">3:00 PM – 3:30 PM</option>
                    <option value="4:30 PM – 5:00 PM">4:30 PM – 5:00 PM</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-500">
                Cancel
              </button>
              <button
                onClick={handleSendRequest}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 transform active:scale-95 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Send Meeting Request</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Customer Email Received & Interactive Confirmation */}
        {step === 'sent_email' && (
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Email request sent to customer ({lead.email})</span>
            </div>

            {/* Email Body Simulation */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 text-slate-800">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 text-xs text-slate-500">
                <div className="flex items-center gap-1.5 font-medium">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>To: <strong>{lead.fullName}</strong> &lt;{lead.email}&gt;</span>
                </div>
                <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">Customer Email View</span>
              </div>

              <div className="text-xs space-y-3 font-sans leading-relaxed">
                <p className="font-semibold text-slate-900">Thank you for meeting us at ADIPEC.</p>
                <p className="text-slate-600">As discussed, we'd like to meet on:</p>

                {/* Highlight Box */}
                <div className="bg-white border-2 border-blue-600/30 rounded-2xl p-4 my-3 text-center space-y-1 shadow-xs">
                  <p className="text-base font-extrabold text-blue-900">{displayDate}</p>
                  <p className="text-sm font-bold text-blue-700">{time}</p>
                </div>

                {/* Interactive Confirm Meeting Button */}
                <div className="pt-2 text-center">
                  <button
                    onClick={handleCustomerConfirm}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-2 transform active:scale-95 transition-all"
                  >
                    <CalendarPlus className="w-4 h-4" />
                    <span>Confirm Meeting</span>
                  </button>
                  <p className="text-[10px] text-slate-400 mt-2">
                    Clicking "Confirm Meeting" will add this event to the customer's calendar after they accept.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation Success */}
        {step === 'confirmed' && (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-base font-extrabold text-slate-900">Meeting Confirmed!</h4>
              <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed">
                The event has been accepted and added to the calendar for <strong>{displayDate}</strong> at <strong>{time}</strong>.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-1 text-slate-700">
              <p><strong>Title:</strong> {meetingTitle}</p>
              <p><strong>Attendee:</strong> {lead.fullName} ({lead.company})</p>
              <p><strong>Status:</strong> <span className="text-emerald-600 font-bold">Confirmed & Added to Calendar</span></p>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
