import { useState, useEffect } from 'react';
import { Lead, Meeting, User, AppNotification, EmailTemplate, VoiceNote } from '../types';
import { INITIAL_LEADS, INITIAL_MEETINGS, INITIAL_NOTIFICATIONS, INITIAL_USERS, INITIAL_EMAIL_TEMPLATES } from '../data/initialData';

export function useLeadsStore() {
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('expoconnect_leads');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_LEADS;
  });

  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    const saved = localStorage.getItem('expoconnect_meetings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_MEETINGS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('expoconnect_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(() => {
    const saved = localStorage.getItem('expoconnect_email_templates');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_EMAIL_TEMPLATES;
  });

  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('expoconnect_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('expoconnect_meetings', JSON.stringify(meetings));
  }, [meetings]);

  useEffect(() => {
    localStorage.setItem('expoconnect_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('expoconnect_email_templates', JSON.stringify(emailTemplates));
  }, [emailTemplates]);

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (pendingSyncCount > 0) {
        setTimeout(() => setPendingSyncCount(0), 1500);
      }
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [pendingSyncCount]);

  // Lead CRUD
  const addLead = (newLead: Partial<Lead>) => {
    const id = `lead-${Date.now()}`;
    const timestamp = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    const fullLead: Lead = {
      fullName: newLead.fullName || 'Exhibition Visitor',
      company: newLead.company || 'Enterprise Visitor',
      jobTitle: newLead.jobTitle || 'Executive',
      email: newLead.email || 'visitor@exhibition.com',
      phone: newLead.phone || '+971 50 000 0000',
      website: newLead.website || 'https://example.com',
      address: newLead.address || 'Abu Dhabi, UAE',
      country: newLead.country || 'United Arab Emirates',
      industry: newLead.industry || 'Oil & Gas',
      interests: newLead.interests || ['Predictive Maintenance'],
      potential: newLead.potential || 'Hot',
      decisionMaker: newLead.decisionMaker ?? true,
      buyingTimeline: newLead.buyingTimeline || 'Immediate',
      dealValue: newLead.dealValue || 'Large',
      priority: newLead.priority || 'High',
      leadScore: newLead.leadScore ?? 85,
      scoreCategory: newLead.scoreCategory || 'High Potential',
      notes: newLead.notes || '',
      assignedTo: newLead.assignedTo || currentUser.name,
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
      photos: newLead.photos || [],
      voiceNotes: newLead.voiceNotes || [],
      timeline: [
        {
          id: `evt-${Date.now()}`,
          type: 'business_card_scanned',
          title: 'Lead Profile Created',
          description: `Created by ${currentUser.name} at ADIPEC Booth.`,
          timestamp,
          actor: currentUser.name,
        }
      ],
      comments: []
    };

    setLeads(prev => [fullLead, ...prev]);

    if (!isOnline) {
      setPendingSyncCount(p => p + 1);
    }

    addNotification({
      type: 'priority_lead',
      title: 'New Lead Captured',
      message: `${fullLead.fullName} (${fullLead.company}) added.`,
      leadId: fullLead.id
    });

    return fullLead;
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    const timestamp = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    setLeads(prev => prev.map(l => {
      if (l.id === id) {
        return {
          ...l,
          ...updates,
          updatedAt: timestamp
        };
      }
      return l;
    }));

    if (!isOnline) setPendingSyncCount(p => p + 1);
  };

  const addTimelineEvent = (leadId: string, title: string, description: string, type: Lead['timeline'][0]['type']) => {
    const timestamp = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const newEvt = {
          id: `evt-${Date.now()}`,
          type,
          title,
          description,
          timestamp,
          actor: currentUser.name
        };
        return {
          ...l,
          updatedAt: timestamp,
          timeline: [newEvt, ...l.timeline]
        };
      }
      return l;
    }));
  };

  const addVoiceNote = (leadId: string, voiceNote: VoiceNote) => {
    const timestamp = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          voiceNotes: [voiceNote, ...l.voiceNotes],
          updatedAt: timestamp,
          timeline: [
            {
              id: `evt-${Date.now()}`,
              type: 'voice_note_added' as const,
              title: 'Voice Note Debrief Added',
              description: voiceNote.summary,
              timestamp,
              actor: currentUser.name,
            },
            ...l.timeline
          ]
        };
      }
      return l;
    }));
  };

  const addPhotoToLead = (leadId: string, photoUrl: string, setAsCover = true) => {
    const timestamp = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          coverImage: setAsCover ? photoUrl : l.coverImage,
          photos: [photoUrl, ...(l.photos || [])],
          updatedAt: timestamp,
          timeline: [
            {
              id: `evt-${Date.now()}`,
              type: 'photo_captured' as const,
              title: 'Customer Photo Attached',
              description: 'Booth photo captured and attached to profile.',
              timestamp,
              actor: currentUser.name,
            },
            ...l.timeline
          ]
        };
      }
      return l;
    }));
  };

  const addCommentToLead = (leadId: string, text: string, authorName?: string) => {
    const timestamp = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const newComm = {
          id: `c-${Date.now()}`,
          author: authorName || currentUser.name,
          text,
          timestamp
        };
        return {
          ...l,
          comments: [...l.comments, newComm]
        };
      }
      return l;
    }));
  };

  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  // Meetings CRUD
  const addMeeting = (newMeeting: Omit<Meeting, 'id'>) => {
    const id = `meet-${Date.now()}`;
    const meeting: Meeting = { ...newMeeting, id };
    setMeetings(prev => [meeting, ...prev]);

    addTimelineEvent(
      meeting.leadId,
      `Meeting Scheduled: ${meeting.type}`,
      `${meeting.title} on ${meeting.date} at ${meeting.time} (${meeting.location})`,
      'meeting_scheduled'
    );

    addNotification({
      type: 'meeting',
      title: 'Meeting Scheduled',
      message: `${meeting.title} with ${meeting.leadName} (${meeting.company})`,
      leadId: meeting.leadId
    });

    return meeting;
  };

  // Notifications
  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const forceSync = () => {
    setIsOnline(true);
    setPendingSyncCount(0);
  };

  const saveEmailTemplates = (templates: EmailTemplate[]) => {
    setEmailTemplates(templates);
  };

  return {
    leads,
    meetings,
    notifications,
    emailTemplates,
    currentUser,
    setCurrentUser,
    users: INITIAL_USERS,
    isOnline,
    pendingSyncCount,
    addLead,
    updateLead,
    deleteLead,
    addTimelineEvent,
    addVoiceNote,
    addPhotoToLead,
    addCommentToLead,
    addMeeting,
    addNotification,
    markNotificationRead,
    markAllNotificationsAsRead,
    forceSync,
    saveEmailTemplates,
    setEmailTemplates
  };
}
