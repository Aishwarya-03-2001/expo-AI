import React, { useState } from 'react';
import { X, Mail, Calendar, Mic, Camera, Sparkles, Phone, Globe, MapPin, Building, Flame, Clock, Award, CheckCircle, MessageSquare, Plus, ExternalLink, Edit3, Trash2 } from 'lucide-react';
import { Lead, VoiceNote, TimelineEvent } from '../types';
import { LinkedInEnrichmentCard } from './LinkedInEnrichmentCard';

interface LeadDetailDrawerProps {
  lead: Lead;
  onClose: () => void;
  onOpenEmailModal: (lead: Lead) => void;
  onOpenMeetingModal: (lead: Lead) => void;
  onOpenMeetingRequestModal?: (lead: Lead) => void;
  onOpenVoiceNotesModal: (lead: Lead) => void;
  onOpenPhotoModal: (lead: Lead) => void;
  onAddComment: (leadId: string, text: string) => void;
  onUpdateLeadStatus?: (leadId: string, potential: Lead['potential']) => void;
  onDeleteLead?: (leadId: string) => void;
}

export const LeadDetailDrawer: React.FC<LeadDetailDrawerProps> = ({
  lead,
  onClose,
  onOpenEmailModal,
  onOpenMeetingModal,
  onOpenMeetingRequestModal,
  onOpenVoiceNotesModal,
  onOpenPhotoModal,
  onAddComment,
  onUpdateLeadStatus,
  onDeleteLead,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'voicenotes' | 'enrichment' | 'comments'>('overview');
  const [newCommentText, setNewCommentText] = useState('');

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCommentText.trim()) {
      onAddComment(lead.id, newCommentText.trim());
      setNewCommentText('');
    }
  };

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'business_card_scanned': return '💳';
      case 'photo_captured': return '📷';
      case 'voice_note_added': return '🎙️';
      case 'ai_summary_generated': return '✨';
      case 'meeting_scheduled': return '📅';
      case 'email_sent': return '✉️';
      case 'deal_won': return '🏆';
      case 'deal_lost': return '❌';
      default: return '📝';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-end">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200 overflow-hidden">
        {/* Cover Header */}
        <div className="relative h-44 bg-slate-900 flex flex-col justify-between p-4 text-white overflow-hidden">
          {lead.coverImage ? (
            <img src={lead.coverImage} alt={lead.fullName} className="absolute inset-0 w-full h-full object-cover opacity-40" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950" />
          )}

          <div className="relative z-10 flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${
              lead.potential === 'Hot' ? 'bg-rose-500 text-white' :
              lead.potential === 'Warm' ? 'bg-amber-500 text-white' : 'bg-sky-500 text-white'
            }`}>
              🔥 {lead.potential} Prospect
            </span>

            <div className="flex items-center gap-1">
              {onDeleteLead && (
                <button
                  onClick={() => { onDeleteLead(lead.id); onClose(); }}
                  className="p-2 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white transition-colors"
                  title="Delete Lead"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button onClick={onClose} className="p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="relative z-10">
            <h2 className="text-xl font-extrabold text-white leading-tight">{lead.fullName}</h2>
            <p className="text-xs text-blue-200 font-medium">{lead.jobTitle} • {lead.company}</p>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="p-3 bg-slate-900 text-white border-b border-slate-800 grid grid-cols-5 gap-1.5">
          <button
            onClick={() => onOpenEmailModal(lead)}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors text-white text-[10px] font-semibold"
          >
            <Mail className="w-4 h-4 mb-1" />
            <span>AI Email</span>
          </button>

          {onOpenMeetingRequestModal && (
            <button
              onClick={() => onOpenMeetingRequestModal(lead)}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition-colors text-white text-[10px] font-semibold col-span-1"
            >
              <Calendar className="w-4 h-4 mb-1 text-indigo-200" />
              <span>Post-ADIPEC</span>
            </button>
          )}

          <button
            onClick={() => onOpenMeetingModal(lead)}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors text-white text-[10px] font-semibold"
          >
            <Calendar className="w-4 h-4 mb-1 text-amber-400" />
            <span>Schedule</span>
          </button>

          <button
            onClick={() => onOpenVoiceNotesModal(lead)}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors text-white text-[10px] font-semibold"
          >
            <Mic className="w-4 h-4 mb-1 text-rose-400" />
            <span>Voice Note</span>
          </button>

          <button
            onClick={() => onOpenPhotoModal(lead)}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors text-white text-[10px] font-semibold"
          >
            <Camera className="w-4 h-4 mb-1 text-sky-400" />
            <span>Photo</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 overflow-x-auto text-xs font-bold text-slate-600 dark:text-slate-400">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'overview' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1 ${
              activeTab === 'timeline' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent hover:text-slate-900'
            }`}
          >
            Timeline ({lead.timeline.length})
          </button>
          <button
            onClick={() => setActiveTab('voicenotes')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1 ${
              activeTab === 'voicenotes' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent hover:text-slate-900'
            }`}
          >
            Voice Notes ({lead.voiceNotes.length})
          </button>
          <button
            onClick={() => setActiveTab('enrichment')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'enrichment' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent hover:text-slate-900'
            }`}
          >
            LinkedIn Intel
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1 ${
              activeTab === 'comments' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent hover:text-slate-900'
            }`}
          >
            Team Notes ({lead.comments.length})
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Qualification Banner */}
              <div className="bg-blue-600 text-white rounded-2xl p-4 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-blue-200">Exhibition Qualification</span>
                  <div className="text-lg font-bold">{lead.potential} Prospect</div>
                  <p className="text-xs text-blue-100 font-medium">{lead.scoreCategory}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-lg">
                  {lead.potential === 'Hot' ? '⚡' : '🤝'}
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/60 space-y-3 text-xs">
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Contact Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Mail className="w-4 h-4 text-blue-500" />
                    <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email}</a>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Phone className="w-4 h-4 text-emerald-500" />
                    <span>{lead.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Globe className="w-4 h-4 text-sky-500" />
                    <span>{lead.website}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    <span>{lead.country}</span>
                  </div>
                </div>
              </div>

              {/* Qualification Attributes */}
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/60 space-y-3 text-xs">
                <h4 className="font-bold text-slate-900 dark:text-white">Qualification Matrix</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 font-medium block">Industry</span>
                    <span className="font-bold text-slate-900 dark:text-white">{lead.industry}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 font-medium block">Decision Maker</span>
                    <span className="font-bold text-slate-900 dark:text-white">{lead.decisionMaker ? 'Yes (Executive)' : 'No'}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 font-medium block">Buying Timeline</span>
                    <span className="font-bold text-slate-900 dark:text-white">{lead.buyingTimeline}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 font-medium block">Estimated Deal Value</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{lead.dealValue}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-medium block mb-1">Interested Solutions</span>
                  <div className="flex flex-wrap gap-1.5">
                    {lead.interests.map((int, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-[11px] font-semibold">
                        {int}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Photos Gallery */}
              {lead.photos && lead.photos.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-2">Booth & Customer Photos</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {lead.photos.map((p, i) => (
                      <img key={i} src={p} alt="Lead photo" className="w-full h-24 object-cover rounded-xl border border-slate-200 dark:border-slate-700" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">Activity Timeline</h4>
              <div className="relative border-l-2 border-blue-500/30 pl-4 space-y-4">
                {lead.timeline.map((evt) => (
                  <div key={evt.id} className="relative">
                    <div className="absolute -left-[23px] top-0.5 w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shadow-md">
                      {getEventIcon(evt.type)}
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                      <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white mb-0.5">
                        <span>{evt.title}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{evt.timestamp}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">{evt.description}</p>
                      <span className="text-[10px] text-blue-500 font-semibold block mt-1">By {evt.actor}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'voicenotes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">Voice Debriefs & AI Summaries</h4>
                <button
                  onClick={() => onOpenVoiceNotesModal(lead)}
                  className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Record Note
                </button>
              </div>

              {lead.voiceNotes.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No voice notes recorded yet. Tap "Record Note" above.
                </div>
              ) : (
                lead.voiceNotes.map((vn) => (
                  <div key={vn.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                    <div className="flex items-center justify-between font-bold text-blue-600 dark:text-blue-400">
                      <span>🎙️ Recorded Voice Note</span>
                      <span className="text-[10px] text-slate-400">{vn.timestamp}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 italic bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                      "{vn.transcript}"
                    </p>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">Summary:</span> {vn.summary}
                    </div>
                    {vn.actionItems && vn.actionItems.length > 0 && (
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">Action Items:</span>
                        <ul className="list-disc list-inside text-slate-600 dark:text-slate-400">
                          {vn.actionItems.map((a, idx) => (
                            <li key={idx}>{a}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'enrichment' && (
            <LinkedInEnrichmentCard company={lead.company} email={lead.email} existingData={lead.linkedInEnrichment} />
          )}

          {activeTab === 'comments' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">Team Comments & Internal Notes</h4>
              <div className="space-y-3">
                {lead.comments.map((c) => (
                  <div key={c.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white mb-1">
                      <span>{c.author}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{c.timestamp}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">{c.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleCommentSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Add internal note for sales team..."
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">
                  Post
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
