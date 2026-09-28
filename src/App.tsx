import React, { useState } from 'react';
import { useLeadsStore } from './hooks/useLeadsStore';
import { Lead, Meeting } from './types';

// UI Components
import { OfflineBanner } from './components/OfflineBanner';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { LeadsView } from './components/LeadsView';
import { CalendarView } from './components/CalendarView';
import { AIAssistantView } from './components/AIAssistantView';
import { ProfileView } from './components/ProfileView';
import { DashboardView } from './components/DashboardView';
import { AdminPortalView } from './components/AdminPortalView';

// Modals & Drawers
import { BusinessCardScannerModal } from './components/BusinessCardScannerModal';
import { CustomerPhotoModal } from './components/CustomerPhotoModal';
import { LeadQualificationModal } from './components/LeadQualificationModal';
import { VoiceNotesModal } from './components/VoiceNotesModal';
import { EmailGeneratorModal } from './components/EmailGeneratorModal';
import { MeetingRequestModal } from './components/MeetingRequestModal';
import { LeadDetailDrawer } from './components/LeadDetailDrawer';
import { NotificationsModal } from './components/NotificationsModal';

export const App: React.FC = () => {
  const {
    leads,
    meetings,
    users,
    currentUser,
    notifications,
    emailTemplates,
    isOnline,
    pendingSyncCount,
    setCurrentUser,
    addLead,
    updateLead,
    deleteLead,
    addMeeting,
    addVoiceNote,
    addPhotoToLead,
    addCommentToLead,
    markAllNotificationsAsRead,
    forceSync,
    saveEmailTemplates,
  } = useLeadsStore();

  // Navigation State
  const [currentTab, setCurrentTab] = useState<'home' | 'leads' | 'calendar' | 'assistant' | 'profile' | 'dashboard' | 'admin'>('home');
  const [isMobileFrame, setIsMobileFrame] = useState(true);

  // Modals & Active Drawer States
  const [showCardScanner, setShowCardScanner] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showQualificationModal, setShowQualificationModal] = useState(false);
  const [showVoiceNotesModal, setShowVoiceNotesModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showMeetingRequestModal, setShowMeetingRequestModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);
  const [editingLeadData, setEditingLeadData] = useState<Partial<Lead> | null>(null);

  const activeLead = leads.find((l) => l.id === activeLeadId) || null;

  // Handlers
  const handleSaveCardScanResult = (cardData: Partial<Lead>) => {
    // Open qualification modal with pre-filled card data for speed (< 2 min workflow)
    setEditingLeadData(cardData);
    setShowCardScanner(false);
    setShowQualificationModal(true);
  };

  const handleSaveQualification = (leadData: Partial<Lead>) => {
    if (editingLeadData && editingLeadData.id) {
      updateLead(editingLeadData.id, leadData);
    } else {
      addLead(leadData);
    }
    setShowQualificationModal(false);
    setEditingLeadData(null);
  };

  const handleSendEmail = (subject: string, body: string) => {
    if (activeLead) {
      const updatedTimeline = [
        ...activeLead.timeline,
        {
          id: `tl-${Date.now()}`,
          type: 'email_sent' as const,
          title: 'AI Follow-up Email Sent',
          description: `Subject: "${subject}"`,
          timestamp: 'Just now',
          actor: currentUser.name,
        },
      ];
      updateLead(activeLead.id, { timeline: updatedTimeline });
    }
  };

  const renderCurrentView = () => {
    switch (currentTab) {
      case 'home':
        return (
          <HomeView
            leads={leads}
            meetings={meetings}
            onOpenCardScanner={() => setShowCardScanner(true)}
            onOpenCustomerPhoto={() => setShowPhotoModal(true)}
            onOpenVoiceNotes={() => setShowVoiceNotesModal(true)}
            onOpenNewLead={() => {
              setEditingLeadData({});
              setShowQualificationModal(true);
            }}
            onSelectLead={(id) => setActiveLeadId(id)}
            onNavigateTab={(tab) => setCurrentTab(tab as any)}
          />
        );
      case 'leads':
        return (
          <LeadsView
            leads={leads}
            onSelectLead={(id) => setActiveLeadId(id)}
            onOpenNewLeadModal={() => {
              setEditingLeadData({});
              setShowQualificationModal(true);
            }}
            onOpenEmailModal={(lead) => {
              setActiveLeadId(lead.id);
              setShowEmailModal(true);
            }}
          />
        );
      case 'calendar':
        return (
          <CalendarView
            meetings={meetings}
            leads={leads}
            onAddMeeting={(m) => addMeeting(m)}
            onSelectLead={(id) => setActiveLeadId(id)}
            onRequestMeeting={(leadId) => {
              if (leadId) setActiveLeadId(leadId);
              else if (!activeLeadId && leads[0]) setActiveLeadId(leads[0].id);
              setShowMeetingRequestModal(true);
            }}
          />
        );
      case 'assistant':
        return (
          <AIAssistantView
            leads={leads}
            onSelectLead={(id) => setActiveLeadId(id)}
            onRequestMeeting={() => {
              if (!activeLeadId && leads[0]) setActiveLeadId(leads[0].id);
              setShowMeetingRequestModal(true);
            }}
          />
        );
      case 'profile':
        return (
          <ProfileView
            user={currentUser}
            isOnline={isOnline}
            pendingSyncCount={pendingSyncCount}
            onSyncNow={forceSync}
            onOpenAdminPortal={() => setCurrentTab('admin')}
          />
        );
      case 'dashboard':
        return (
          <DashboardView
            leads={leads}
            meetings={meetings}
            onSelectLead={(id) => setActiveLeadId(id)}
          />
        );
      case 'admin':
        return (
          <AdminPortalView
            users={users}
            leads={leads}
            emailTemplates={emailTemplates}
            onSaveTemplates={saveEmailTemplates}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Offline Status Top Banner */}
      <OfflineBanner isOnline={isOnline} pendingCount={pendingSyncCount} onSyncNow={forceSync} />

      {/* Main Top Header */}
      <Navbar
        currentUser={currentUser}
        users={users}
        onSelectUser={setCurrentUser}
        notifications={notifications}
        onOpenNotifications={() => setShowNotificationsModal(true)}
        isOnline={isOnline}
        pendingSyncCount={pendingSyncCount}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
        onOpenAdmin={() => setCurrentTab(currentTab === 'admin' ? 'home' : 'admin')}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 flex gap-6 items-start justify-center overflow-x-hidden">
        {/* Left High Density Sidebar (Desktop Only when Frame enabled) */}
        {isMobileFrame && (
          <aside className="hidden xl:flex flex-col gap-5 w-72 shrink-0">
            {/* Performance Today */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Performance Today</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-slate-900">{leads.length}</span>
                  <span className="text-[10px] text-slate-500">Leads Captured</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-blue-600">{leads.filter(l => l.potential === 'Hot').length}</span>
                  <span className="text-[10px] text-slate-500">Hot Prospects</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-slate-900">{meetings.length}</span>
                  <span className="text-[10px] text-slate-500">Meetings Set</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-slate-900">92%</span>
                  <span className="text-[10px] text-slate-500">Capture Rate</span>
                </div>
              </div>
            </div>

            {/* Recent Live Activity Stream */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex-1">
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Recent Activity Feed</h2>
              <div className="space-y-3.5">
                {leads.slice(0, 3).map((lead, idx) => (
                  <div
                    key={lead.id}
                    onClick={() => setActiveLeadId(lead.id)}
                    className={`flex gap-3 border-l-2 ${idx === 0 ? 'border-blue-600' : 'border-slate-200'} pl-3 cursor-pointer hover:opacity-100 transition-opacity`}
                  >
                    <div className="text-xs space-y-0.5">
                      <p className="font-bold text-slate-900">{lead.fullName}</p>
                      <p className="text-[11px] text-slate-500">{lead.jobTitle}, {lead.company}</p>
                      <p className="text-[10px] font-bold text-blue-600">
                        {lead.timeline[0]?.title || 'Card Scanned'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* Center Main Content Container (Fluid Mobile Responsive) */}
        <div
          className={`transition-all duration-300 w-full ${
            isMobileFrame
              ? 'lg:max-w-[440px] bg-white lg:rounded-[32px] lg:p-4 lg:shadow-xl lg:border lg:border-slate-200 relative'
              : 'max-w-5xl'
          }`}
        >
          <div className="w-full">
            {/* Active Screen View */}
            {renderCurrentView()}
          </div>
        </div>

        {/* Right Context Panel (Desktop Only when Frame enabled) */}
        {isMobileFrame && (
          <aside className="hidden lg:flex flex-col gap-5 w-80 shrink-0">
            {/* Next Best Action Card */}
            <div className="bg-blue-600 text-white rounded-2xl p-5 shadow-sm space-y-3">
              <h2 className="text-[10px] font-bold uppercase tracking-wider opacity-80">Next Best Action</h2>
              <p className="text-xs font-semibold leading-relaxed">
                {leads[0] ? `${leads[0].fullName} (${leads[0].company}) is a Hot Prospect. Send follow-up email now to increase conversion by 34%.` : 'Scan booth visitor card to initiate instant AI qualification.'}
              </p>
              <button
                onClick={() => {
                  if (leads[0]) {
                    setActiveLeadId(leads[0].id);
                    setShowEmailModal(true);
                  } else {
                    setShowCardScanner(true);
                  }
                }}
                className="w-full py-2 bg-white text-blue-600 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm hover:bg-blue-50 transition-colors"
              >
                {leads[0] ? 'Draft Email AI' : 'Scan Business Card'}
              </button>
            </div>

            {/* LinkedIn & Company Intel Widget */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Enterprise Intelligence</h2>
                <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full">ADIPEC Hub</span>
              </div>

              <div className="text-center py-2 space-y-1">
                <div className="w-12 h-12 bg-blue-50 rounded-xl mx-auto flex items-center justify-center font-black text-blue-600 text-base border border-blue-100">
                  IN
                </div>
                <h3 className="font-bold text-xs text-slate-900">ADNOC Distribution</h3>
                <p className="text-[10px] text-slate-500">10,000+ employees • Energy • Abu Dhabi, UAE</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center pt-1">
                <div className="p-2 bg-slate-50 rounded-xl">
                  <p className="text-base font-bold text-slate-900">12</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Active Deals</p>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <p className="text-base font-bold text-slate-900">4</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Booth Contacts</p>
                </div>
              </div>
            </div>
          </aside>
        )}
      </main>

      {/* Footer Status Bar (Light Theme) */}
      <footer className="h-10 bg-white border-t border-slate-200 text-slate-500 text-[10px] px-4 sm:px-6 flex items-center justify-between shrink-0 font-sans">
        <div className="flex items-center gap-4 truncate">
          <span>User: <strong className="text-slate-800">{currentUser.name}</strong></span>
          <span className="hidden sm:inline">Device: <strong className="text-slate-800">iPad Air (ADIPEC-04)</strong></span>
          <span className="hidden md:inline">Battery: <strong className="text-slate-800">88%</strong></span>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <span className="hidden sm:inline">Status: <strong className="text-emerald-600">All Systems Operational</strong></span>
          <span className="text-blue-600 font-bold">v2.4.0-light</span>
        </div>
      </footer>

      {/* Bottom Navigation */}
      <BottomNav
        currentTab={currentTab as any}
        onChangeTab={(tab) => setCurrentTab(tab)}
        unreadLeadsCount={leads.filter((l) => l.potential === 'Hot').length}
      />

      {/* Modals & Dialogs */}
      {showCardScanner && (
        <BusinessCardScannerModal
          onClose={() => setShowCardScanner(false)}
          onSaveScannedData={handleSaveCardScanResult}
        />
      )}

      {showQualificationModal && (
        <LeadQualificationModal
          initialData={editingLeadData || {}}
          onClose={() => {
            setShowQualificationModal(false);
            setEditingLeadData(null);
          }}
          onSaveLead={handleSaveQualification}
        />
      )}

      {showVoiceNotesModal && (
        <VoiceNotesModal
          leads={leads}
          initialLeadId={activeLeadId || undefined}
          onClose={() => setShowVoiceNotesModal(false)}
          onSaveVoiceNote={(leadId, vn) => addVoiceNote(leadId, vn)}
        />
      )}

      {showPhotoModal && (
        <CustomerPhotoModal
          leads={leads}
          onClose={() => setShowPhotoModal(false)}
          onAttachPhoto={(leadId, url, cover) => addPhotoToLead(leadId, url, cover)}
        />
      )}

      {showEmailModal && activeLead && (
        <EmailGeneratorModal
          lead={activeLead}
          senderName={currentUser.name}
          onClose={() => setShowEmailModal(false)}
          onSendEmail={handleSendEmail}
          onOpenMeetingRequestModal={() => {
            setShowEmailModal(false);
            setShowMeetingRequestModal(true);
          }}
        />
      )}

      {showMeetingRequestModal && (activeLead || leads[0]) && (
        <MeetingRequestModal
          lead={activeLead || leads[0]}
          senderName={currentUser.name}
          onClose={() => setShowMeetingRequestModal(false)}
          onSendEmail={handleSendEmail}
          onScheduleMeeting={(m) => {
            addMeeting(m);
            // Record timeline event in lead
            const targetLead = activeLead || leads[0];
            if (targetLead) {
              const updatedTimeline = [
                ...targetLead.timeline,
                {
                  id: `tl-${Date.now()}`,
                  type: 'meeting_scheduled' as const,
                  title: 'Post-ADIPEC Meeting Confirmed',
                  description: `${m.title} on ${m.date} at ${m.time}`,
                  timestamp: 'Just now',
                  actor: currentUser.name,
                },
              ];
              updateLead(targetLead.id, { timeline: updatedTimeline });
            }
          }}
        />
      )}

      {showNotificationsModal && (
        <NotificationsModal
          notifications={notifications}
          onClose={() => setShowNotificationsModal(false)}
          onMarkAllAsRead={markAllNotificationsAsRead}
        />
      )}

      {/* Lead Detail Drawer */}
      {activeLead && (
        <LeadDetailDrawer
          lead={activeLead}
          onClose={() => setActiveLeadId(null)}
          onOpenEmailModal={(l) => {
            setActiveLeadId(l.id);
            setShowEmailModal(true);
          }}
          onOpenMeetingModal={() => {
            setCurrentTab('calendar');
            setActiveLeadId(null);
          }}
          onOpenMeetingRequestModal={(l) => {
            setActiveLeadId(l.id);
            setShowMeetingRequestModal(true);
          }}
          onOpenVoiceNotesModal={() => setShowVoiceNotesModal(true)}
          onOpenPhotoModal={() => setShowPhotoModal(true)}
          onAddComment={(leadId, text) => addCommentToLead(leadId, text, currentUser.name)}
          onDeleteLead={(id) => deleteLead(id)}
        />
      )}
    </div>
  );
};

export default App;
