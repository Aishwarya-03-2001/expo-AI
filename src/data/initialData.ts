import { Lead, Meeting, User, AppNotification, EmailTemplate } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Tariq Al-Mansoor',
    email: 'tariq.m@expoconnect.ai',
    role: 'Sales Executive',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    boothId: 'ADIPEC Hall 8 - Stand 8340'
  },
  {
    id: 'user-2',
    name: 'Sarah Jenkins',
    email: 'sarah.j@expoconnect.ai',
    role: 'Sales Manager',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    boothId: 'ADIPEC Hall 8 - Stand 8340'
  },
  {
    id: 'user-3',
    name: 'Ahmed Hassan',
    email: 'ahmed.h@expoconnect.ai',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    boothId: 'ADIPEC Hall 8 - Stand 8340'
  },
  {
    id: 'user-4',
    name: 'Elena Rostova',
    email: 'elena.r@expoconnect.ai',
    role: 'Sales Executive',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    boothId: 'ADIPEC Hall 8 - Stand 8340'
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-101',
    fullName: 'Dr. John Al-Maktoum',
    company: 'ADNOC Offshore',
    jobTitle: 'VP of Digital Operations & Asset Integrity',
    email: 'j.almaktoum@adnoc.ae',
    phone: '+971 50 892 4110',
    website: 'www.adnoc.ae',
    country: 'United Arab Emirates',
    address: 'Corniche Road, Abu Dhabi, UAE',
    industry: 'Oil & Gas',
    interests: ['Predictive Maintenance', 'AI Solutions', 'Digital Twin', 'Industrial IoT'],
    potential: 'Hot',
    decisionMaker: true,
    buyingTimeline: 'Immediate',
    dealValue: 'Enterprise',
    priority: 'High',
    leadScore: 94,
    scoreCategory: 'High Potential',
    scoreReasoning: 'Decision Maker at major national oil company (ADNOC). Immediate buying timeline for predictive maintenance AI for offshore assets.',
    coverImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800',
    photos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800'
    ],
    voiceNotes: [
      {
        id: 'vn-1',
        transcript: 'Dr. John mentioned ADNOC is expanding offshore digital twin capabilities across 14 platforms. They currently use SAP and Honeywell Forge but need an integrated predictive analytics overlay. Wants a full live demo next Tuesday at ADIPEC VIP Lounge.',
        summary: 'ADNOC Offshore seeking predictive analytics overlay for 14 offshore platforms.',
        actionItems: [
          'Prepare custom offshore digital twin demo dataset',
          'Send calendar invite for Tuesday 11:00 AM at VIP Lounge',
          'Share enterprise security compliance whitepaper'
        ],
        nextSteps: ['Follow up with customized pitch deck', 'Schedule technical architecture review'],
        highlights: ['Decision Maker', '14 Offshore Platforms', 'SAP Integration Required', 'Target Budget: $750k+'],
        potentialScore: 94,
        timestamp: '2026-07-30 09:45 AM'
      }
    ],
    notes: 'Very interested in reducing unscheduled downtime on compressor stations. Mentioned $2.4M lost per hour of outage.',
    assignedTo: 'Tariq Al-Mansoor',
    assignedRole: 'Sales Executive',
    createdAt: '2026-07-30 09:30 AM',
    updatedAt: '2026-07-30 10:15 AM',
    linkedInEnrichment: {
      url: 'https://linkedin.com/in/john-al-maktoum-adnoc',
      companyUrl: 'https://linkedin.com/company/adnoc-group',
      companyWebsite: 'https://www.adnoc.ae',
      companySize: '10,000+ employees',
      industry: 'Oil & Energy',
      headquarters: 'Abu Dhabi, United Arab Emirates',
      overview: 'Abu Dhabi National Oil Company (ADNOC) is one of the world’s leading energy producers and a primary catalyst for Abu Dhabi’s growth.'
    },
    timeline: [
      {
        id: 'evt-1',
        type: 'business_card_scanned',
        title: 'Business Card Scanned',
        description: 'Captured card at ADIPEC Stand 8340 via OCR scanner.',
        timestamp: '2026-07-30 09:30 AM',
        actor: 'Tariq Al-Mansoor'
      },
      {
        id: 'evt-2',
        type: 'photo_captured',
        title: 'Customer Selfie Taken',
        description: 'Photo linked to lead profile with ADIPEC booth backdrop.',
        timestamp: '2026-07-30 09:35 AM',
        actor: 'Tariq Al-Mansoor'
      },
      {
        id: 'evt-3',
        type: 'voice_note_added',
        title: 'Voice Note & AI Summary Generated',
        description: 'Recorded 45s booth debrief. AI scored lead at 94/100.',
        timestamp: '2026-07-30 09:45 AM',
        actor: 'AI Assistant'
      },
      {
        id: 'evt-4',
        type: 'meeting_scheduled',
        title: 'Meeting Scheduled: Offshore Demo',
        description: 'Set for Aug 4, 2026 at 11:00 AM (ADIPEC VIP Lounge).',
        timestamp: '2026-07-30 10:00 AM',
        actor: 'Tariq Al-Mansoor'
      },
      {
        id: 'evt-5',
        type: 'email_sent',
        title: 'Follow-up Email Sent',
        description: 'Custom ADIPEC thank-you & meeting confirmation sent.',
        timestamp: '2026-07-30 10:15 AM',
        actor: 'Tariq Al-Mansoor'
      }
    ],
    comments: [
      {
        id: 'c-1',
        author: 'Sarah Jenkins',
        text: 'Great lead Tariq! ADNOC Offshore is our #1 target account this year. I will join the Tuesday meeting.',
        timestamp: '2026-07-30 10:20 AM'
      }
    ]
  },
  {
    id: 'lead-102',
    fullName: 'Marcus Vance',
    company: 'Saudi Aramco Technology Development',
    jobTitle: 'Lead Reliability Engineer',
    email: 'marcus.vance@aramco.com',
    phone: '+966 54 321 0099',
    website: 'www.aramco.com',
    country: 'Saudi Arabia',
    address: 'Dhahran 31311, Kingdom of Saudi Arabia',
    industry: 'Energy',
    interests: ['Predictive Maintenance', 'Asset Management', 'Analytics'],
    potential: 'Hot',
    decisionMaker: false,
    buyingTimeline: '3 Months',
    dealValue: 'Large',
    priority: 'High',
    leadScore: 88,
    scoreCategory: 'High Potential',
    scoreReasoning: 'Key technical influencer at Aramco with immediate pipeline needs in refinery equipment reliability.',
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800'
    ],
    voiceNotes: [
      {
        id: 'vn-2',
        transcript: 'Marcus evaluates IoT hardware and software for Aramco refineries in Ras Tanura. Needs anomaly detection models for high-temperature pumps.',
        summary: 'Aramco evaluating pump predictive maintenance solution for Ras Tanura refinery.',
        actionItems: ['Send technical case study on pump failure detection', 'Connect with VP Engineering'],
        nextSteps: ['Provide pilot trial sandbox environment'],
        highlights: ['Aramco Ras Tanura', 'Pump Anomaly AI', '3 Month Timeline'],
        potentialScore: 88,
        timestamp: '2026-07-30 11:15 AM'
      }
    ],
    notes: 'Needs local hosting capability or private cloud options due to Saudi data residency regulations.',
    assignedTo: 'Sarah Jenkins',
    assignedRole: 'Sales Manager',
    createdAt: '2026-07-30 11:00 AM',
    updatedAt: '2026-07-30 11:20 AM',
    linkedInEnrichment: {
      url: 'https://linkedin.com/in/marcus-vance-reliability',
      companyUrl: 'https://linkedin.com/company/aramco',
      companyWebsite: 'https://www.aramco.com',
      companySize: '70,000+ employees',
      industry: 'Energy & Petrochemicals',
      headquarters: 'Dhahran, Saudi Arabia',
      overview: 'Saudi Aramco is a global integrated energy and chemicals enterprise driving transformation.'
    },
    timeline: [
      {
        id: 'evt-201',
        type: 'business_card_scanned',
        title: 'Business Card Scanned',
        description: 'Scanned Aramco card.',
        timestamp: '2026-07-30 11:00 AM',
        actor: 'Sarah Jenkins'
      },
      {
        id: 'evt-202',
        type: 'voice_note_added',
        title: 'Voice Note Added',
        description: 'Captured technical requirements regarding data residency.',
        timestamp: '2026-07-30 11:15 AM',
        actor: 'Sarah Jenkins'
      }
    ],
    comments: []
  },
  {
    id: 'lead-103',
    fullName: 'Amira Khaled',
    company: 'Siemens Energy Middle East',
    jobTitle: 'Regional Director of Sustainability & AI',
    email: 'amira.khaled@siemens-energy.com',
    phone: '+971 4 366 5000',
    website: 'www.siemens-energy.com',
    country: 'United Arab Emirates',
    address: 'Masdar City, Abu Dhabi, UAE',
    industry: 'Utilities',
    interests: ['Sustainability', 'AI Solutions', 'Digital Twin'],
    potential: 'Warm',
    decisionMaker: true,
    buyingTimeline: '6 Months',
    dealValue: 'Medium',
    priority: 'Medium',
    leadScore: 72,
    scoreCategory: 'Medium Potential',
    scoreReasoning: 'Executive decision maker exploring joint co-selling opportunities for green grid monitoring.',
    coverImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
    photos: [],
    voiceNotes: [],
    notes: 'Exploring partnership for ADIPEC 2027 joint showcase. Interested in API integration.',
    assignedTo: 'Elena Rostova',
    assignedRole: 'Sales Executive',
    createdAt: '2026-07-30 01:20 PM',
    updatedAt: '2026-07-30 01:20 PM',
    linkedInEnrichment: {
      url: 'https://linkedin.com/in/amira-khaled-siemens',
      companyUrl: 'https://linkedin.com/company/siemens-energy',
      companyWebsite: 'https://www.siemens-energy.com',
      companySize: '90,000+ employees',
      industry: 'Industrial Automation & Energy',
      headquarters: 'Munich, Germany',
      overview: 'Siemens Energy is one of the world’s leading energy technology companies.'
    },
    timeline: [
      {
        id: 'evt-301',
        type: 'business_card_scanned',
        title: 'Contact Created',
        description: 'Scanned card at Siemens Energy booth.',
        timestamp: '2026-07-30 01:20 PM',
        actor: 'Elena Rostova'
      }
    ],
    comments: []
  },
  {
    id: 'lead-104',
    fullName: 'Robert Chen',
    company: 'Baker Hughes Digital',
    jobTitle: 'Senior Vice President - Enterprise Software',
    email: 'robert.chen@bakerhughes.com',
    phone: '+1 713 439 8600',
    website: 'www.bakerhughes.com',
    country: 'United States',
    address: 'Houston, Texas, USA',
    industry: 'Manufacturing',
    interests: ['AI Solutions', 'ERP', 'Analytics'],
    potential: 'Cold',
    decisionMaker: false,
    buyingTimeline: 'Next Year',
    dealValue: 'Small',
    priority: 'Low',
    leadScore: 42,
    scoreCategory: 'Low Potential',
    scoreReasoning: 'Long term horizon, currently evaluating internal software development.',
    coverImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800',
    photos: [],
    voiceNotes: [],
    notes: 'Exchanged cards at the energy transition panel.',
    assignedTo: 'Ahmed Hassan',
    assignedRole: 'Admin',
    createdAt: '2026-07-30 02:00 PM',
    updatedAt: '2026-07-30 02:00 PM',
    timeline: [],
    comments: []
  }
];

export const INITIAL_MEETINGS: Meeting[] = [
  {
    id: 'meet-1',
    leadId: 'lead-101',
    leadName: 'Dr. John Al-Maktoum',
    company: 'ADNOC Offshore',
    title: 'Offshore Digital Twin & Predictive AI Demo',
    date: '2026-08-04',
    time: '11:00 AM',
    location: 'ADIPEC VIP Lounge - Hall 8',
    type: 'Demo',
    status: 'Scheduled',
    notes: 'Bring iPad with live oil rig 3D model simulation.'
  },
  {
    id: 'meet-2',
    leadId: 'lead-102',
    leadName: 'Marcus Vance',
    company: 'Saudi Aramco',
    title: 'Technical Deep Dive: Ras Tanura Anomaly AI',
    date: '2026-08-05',
    time: '02:30 PM',
    location: 'Aramco Hospitality Pavilion',
    type: 'Office Visit',
    status: 'Scheduled',
    notes: 'Focus on zero-trust data residency architecture.'
  },
  {
    id: 'meet-3',
    leadId: 'lead-103',
    leadName: 'Amira Khaled',
    company: 'Siemens Energy',
    title: 'Sustainability Co-Selling Discussion',
    date: '2026-08-06',
    time: '04:00 PM',
    location: 'Online Teams Call',
    type: 'Online',
    status: 'Scheduled',
    notes: 'Review joint partnership framework draft.'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'priority_lead',
    title: 'High Potential Lead Captured!',
    message: 'Dr. John Al-Maktoum (ADNOC Offshore) scored 94/100.',
    timestamp: '10 mins ago',
    read: false,
    leadId: 'lead-101'
  },
  {
    id: 'notif-2',
    type: 'meeting',
    title: 'Upcoming Demo Reminder',
    message: 'ADNOC Offshore meeting in 45 mins at VIP Lounge.',
    timestamp: '30 mins ago',
    read: false,
    leadId: 'lead-101'
  },
  {
    id: 'notif-3',
    type: 'followup',
    title: 'Follow-up Email Sent',
    message: 'Personalized email sent to Marcus Vance (Saudi Aramco).',
    timestamp: '2 hours ago',
    read: true,
    leadId: 'lead-102'
  }
];

export const INITIAL_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'tpl-1',
    name: 'ADIPEC Executive Thank You',
    category: 'Post-Exhibition',
    subject: 'Great meeting you at ADIPEC 2026 - {{company}} & ExpoConnect AI',
    body: `Hi {{fullName}},

It was a pleasure meeting you during ADIPEC 2026 at Abu Dhabi.

Thank you for discussing {{company}}'s digital transformation initiatives with us.

Based on our conversation regarding {{interests}}, I believe our AI-powered predictive platform can significantly improve operational efficiency and reduce unplanned downtime for your team.

As discussed, I would be delighted to schedule a detailed demonstration on {{meetingDate}}.

Looking forward to speaking with you.

Best regards,
{{senderName}}
ExpoConnect AI Team
ADIPEC Hall 8 - Stand 8340`
  },
  {
    id: 'tpl-2',
    name: 'Technical Demo Invitation',
    category: 'Product Demo',
    subject: 'Follow-up: Custom AI Demo for {{company}}',
    body: `Hi {{fullName}},

Following up on our discussion at ADIPEC today!

I have summarized our notes regarding {{company}}'s requirements for {{interests}}. Our engineering team has assembled a custom demo environment tailored to your use cases.

When would be a convenient time for a 20-minute walkthrough next week?

Best regards,
{{senderName}}`
  }
];
