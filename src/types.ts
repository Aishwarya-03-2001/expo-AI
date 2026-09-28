export type Potential = 'Hot' | 'Warm' | 'Cold' | 'Not Interested';
export type Industry = 'Oil & Gas' | 'Energy' | 'Manufacturing' | 'Utilities' | 'AI' | 'Government' | 'Construction' | 'Other';
export type InterestOption = 'Predictive Maintenance' | 'AI Solutions' | 'Asset Management' | 'ERP' | 'Digital Twin' | 'Analytics' | 'Industrial IoT' | 'Sustainability';
export type BuyingTimeline = 'Immediate' | '1 Month' | '3 Months' | '6 Months' | 'Next Year';
export type DealValue = 'Small' | 'Medium' | 'Large' | 'Enterprise';
export type Priority = 'High' | 'Medium' | 'Low';
export type MeetingType = 'Online' | 'Office Visit' | 'Phone Call' | 'Demo';
export type UserRole = 'Sales Executive' | 'Sales Manager' | 'Admin';

export interface LinkedInEnrichment {
  url: string;
  companyUrl: string;
  companyWebsite: string;
  companySize: string;
  industry: string;
  headquarters: string;
  overview: string;
}

export interface TimelineEvent {
  id: string;
  type: 
    | 'business_card_scanned' 
    | 'photo_captured' 
    | 'voice_note_added' 
    | 'ai_summary_generated' 
    | 'meeting_scheduled' 
    | 'email_sent' 
    | 'reminder_created' 
    | 'meeting_completed' 
    | 'proposal_shared' 
    | 'deal_won' 
    | 'deal_lost' 
    | 'note_added';
  title: string;
  description: string;
  timestamp: string;
  actor: string;
}

export interface VoiceNote {
  id: string;
  transcript: string;
  summary: string;
  actionItems: string[];
  nextSteps: string[];
  highlights: string[];
  potentialScore: number;
  timestamp: string;
}

export interface Lead {
  id: string;
  fullName: string;
  company: string;
  jobTitle: string;
  email: string;
  phone: string;
  website: string;
  country: string;
  address: string;
  industry: Industry;
  interests: InterestOption[];
  potential: Potential;
  decisionMaker: boolean;
  buyingTimeline: BuyingTimeline;
  dealValue: DealValue;
  priority: Priority;
  leadScore: number;
  scoreCategory: 'High Potential' | 'Medium Potential' | 'Low Potential';
  scoreReasoning?: string;
  coverImage?: string;
  photos: string[];
  voiceNotes: VoiceNote[];
  notes: string;
  assignedTo: string;
  assignedRole?: string;
  createdAt: string;
  updatedAt: string;
  linkedInEnrichment?: LinkedInEnrichment;
  timeline: TimelineEvent[];
  comments: {
    id: string;
    author: string;
    text: string;
    timestamp: string;
  }[];
}

export interface Meeting {
  id: string;
  leadId: string;
  leadName: string;
  company: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: MeetingType;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  boothId: string;
}

export interface AppNotification {
  id: string;
  type: 'meeting' | 'followup' | 'email' | 'priority_lead' | 'missed';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  leadId?: string;
}

export interface FilterState {
  potential: string;
  industry: string;
  country: string;
  assignedTo: string;
  searchQuery: string;
  meetingStatus: string;
  dateRange: string;
}
