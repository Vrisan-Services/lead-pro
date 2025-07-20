'use server';

/**
 * @fileOverview AI-powered lead insights flow to suggest next best actions for channel partners.
 *
 * - leadInsights - A function that takes lead data and returns AI-driven suggestions for next steps.
 * - LeadInsightsInput - The input type for the leadInsights function.
 * - LeadInsightsOutput - The return type for the leadInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LeadInsightsInputSchema = z.object({
  leadName: z.string().describe('The name of the lead.'),
  contactDetails: z.string().describe('Contact information for the lead, such as phone number and email address.'),
  dealValue: z.number().describe('The potential value of the deal with this lead.'),
  stage: z
    .enum(['New', 'In Progress', 'Qualified', 'Closed', 'Converted'])
    .describe('The current stage of the lead in the sales process.'),
  lastInteraction: z.string().describe('A summary of the last interaction with the lead.'),
  additionalDetails: z
    .string()
    .optional()
    .describe('Any additional information about the lead that might be relevant.'),
});
export type LeadInsightsInput = z.infer<typeof LeadInsightsInputSchema>;

const LeadInsightsOutputSchema = z.object({
  nextBestAction: z
    .string()
    .describe('The AI-suggested next best action to take for this lead.'),
  reasoning: z.string().describe('The AI reasoning behind the suggested action.'),
});
export type LeadInsightsOutput = z.infer<typeof LeadInsightsOutputSchema>;

export async function leadInsights(input: LeadInsightsInput): Promise<LeadInsightsOutput> {
  return leadInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'leadInsightsPrompt',
  input: {schema: LeadInsightsInputSchema},
  output: {schema: LeadInsightsOutputSchema},
  prompt: `You are an AI assistant helping channel partners to identify the next best action for their leads.

  Based on the following lead data, provide a concise next best action and the reasoning behind it.

  Lead Name: {{{leadName}}}
  Contact Details: {{{contactDetails}}}
  Deal Value: {{{dealValue}}}
  Stage: {{{stage}}}
  Last Interaction: {{{lastInteraction}}}
  Additional Details: {{{additionalDetails}}}

  Next Best Action:`,
});

const leadInsightsFlow = ai.defineFlow(
  {
    name: 'leadInsightsFlow',
    inputSchema: LeadInsightsInputSchema,
    outputSchema: LeadInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
