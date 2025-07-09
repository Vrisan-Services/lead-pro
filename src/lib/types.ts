export type LeadStage = 'New' | 'In Progress' | 'Qualified' | 'Closed';

export interface Lead {
  id: string;
  leadName: string;
  contactDetails: string;
  dealValue: number;
  stage: LeadStage;
  lastInteraction: string;
  additionalDetails?: string;
}
