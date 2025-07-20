export type LeadStage = 'New' | 'In Progress' | 'Qualified' | 'Closed' | 'Converted';

export interface Lead {
  id: string;
  LeadName: string;
  ContactDetails: string;
  Phone: string;
  Email: string;
  PCode: string;
  Budget: number;
  Stage: LeadStage;
  LastInteraction: string;
  AdditionalDetails?: string;
}
