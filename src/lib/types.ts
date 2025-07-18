export type LeadStage = 'New' | 'In Progress' | 'Qualified' | 'Closed';

export interface Lead {
  id: string;
  LeadName: string;
  ContactDetails: string;
  Budget: number;
  Stage: LeadStage;
  LastInteraction: string;
  AdditionalDetails?: string;
}
