// src/ai/flows/project-search-and-discovery.ts
'use server';

/**
 * @fileOverview A project search and discovery AI agent.
 *
 * - projectSearchAndDiscovery - A function that handles the project search and discovery process.
 * - ProjectSearchAndDiscoveryInput - The input type for the projectSearchAndDiscovery function.
 * - ProjectSearchAndDiscoveryOutput - The return type for the projectSearchAndDiscovery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProjectSearchAndDiscoveryInputSchema = z.object({
  keywords: z.string().describe('Keywords to search for community projects.'),
});
export type ProjectSearchAndDiscoveryInput = z.infer<typeof ProjectSearchAndDiscoveryInputSchema>;

const ProjectSearchAndDiscoveryOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('Relevant project suggestions based on the keywords.'),
});
export type ProjectSearchAndDiscoveryOutput = z.infer<typeof ProjectSearchAndDiscoveryOutputSchema>;

export async function projectSearchAndDiscovery(
  input: ProjectSearchAndDiscoveryInput
): Promise<ProjectSearchAndDiscoveryOutput> {
  return projectSearchAndDiscoveryFlow(input);
}

const projectSearchAndDiscoveryPrompt = ai.definePrompt({
  name: 'projectSearchAndDiscoveryPrompt',
  input: {schema: ProjectSearchAndDiscoveryInputSchema},
  output: {schema: ProjectSearchAndDiscoveryOutputSchema},
  prompt: `You are a helpful assistant that suggests relevant community projects based on user-provided keywords.

  Based on the keywords: "{{keywords}}", suggest a list of community projects that align with these interests.
  Return the suggestions as a simple list of strings.
  `,
});

const projectSearchAndDiscoveryFlow = ai.defineFlow(
  {
    name: 'projectSearchAndDiscoveryFlow',
    inputSchema: ProjectSearchAndDiscoveryInputSchema,
    outputSchema: ProjectSearchAndDiscoveryOutputSchema,
  },
  async input => {
    const {output} = await projectSearchAndDiscoveryPrompt(input);
    return output!;
  }
);
