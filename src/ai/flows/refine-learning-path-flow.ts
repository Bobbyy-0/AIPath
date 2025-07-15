
'use server';
/**
 * @fileOverview Refines an existing learning path based on user feedback.
 *
 * - refineLearningPath - A function that handles the learning path refinement process.
 * - RefineLearningPathInput - The input type for the refineLearningPath function.
 * - (Output is GenerateLearningPathOutput from generate-learning-path-flow)
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { GenerateLearningPathOutputSchema } from '../schemas/learning-path-schemas';
import type { GenerateLearningPathOutput } from '../schemas/learning-path-schemas';

// Re-export GenerateLearningPathOutput type if needed by client from this module,
// though it's typically imported from generate-learning-path-flow.ts or directly from schemas.ts
export type { GenerateLearningPathOutput } from '../schemas/learning-path-schemas';


const RefineLearningPathInputSchema = z.object({
  originalPath: GenerateLearningPathOutputSchema.describe("The existing learning path and resources to be refined."),
  refinementRequest: z.string().min(1).describe("The user's specific request for how to change the path, e.g., 'make it shorter', 'add more Python resources'."),
});
export type RefineLearningPathInput = z.infer<typeof RefineLearningPathInputSchema>;


export async function refineLearningPath(input: RefineLearningPathInput): Promise<GenerateLearningPathOutput> {
  return refineLearningPathFlow(input);
}

const prompt = ai.definePrompt({
  name: 'refineLearningPathPrompt',
  input: { schema: RefineLearningPathInputSchema },
  output: { schema: GenerateLearningPathOutputSchema }, // Reusing the same output structure
  prompt: `You are AIPath, an expert career counselor and curriculum designer.
You have previously generated the following learning path and resource recommendations for a user.

Current Learning Path:
{{#each originalPath.learningPath}}
Step Title: {{this.title}}
Description: {{this.description}}
Key Topics: {{#if this.keyTopics}}{{#each this.keyTopics}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}N/A{{/if}}
---
{{/each}}

Current Recommended Resources:
{{#each originalPath.recommendedResources}}
Resource Title: {{this.title}}
Type: {{this.type}}
URL: {{this.url}}
Explanation: {{this.briefExplanation}}
---
{{/each}}

The user now wants to refine this path with the following specific request:
"{{{refinementRequest}}}"

Instructions:
1.  Carefully analyze the user's refinement request.
2.  Modify the learning path (aim for 3-5 main steps) AND/OR the recommended resources (aim for 3-5 relevant resources) based on this request.
    *   For each learning step in the refined path, you MUST provide a 'title', a 'description' (what the user will learn and why it's important), and a list of 'keyTopics' (specific skills or concepts).
    *   For each recommended resource in the refined list, you MUST provide its 'title', 'url', 'type', and a 'briefExplanation' of its relevance and content.
3.  Ensure the language remains encouraging, clear, and motivating.
4.  The output MUST strictly follow the provided JSON schema for learning paths and resources.
5.  If the refinement request is very vague, unclear, or completely unrelated to learning, try to provide a helpful adjustment if possible, or gently state that the request is difficult to apply and return the original path, perhaps with a minor sensible tweak if one is obvious.
`,
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' }
    ]
  }
});

const refineLearningPathFlow = ai.defineFlow(
  {
    name: 'refineLearningPathFlow',
    inputSchema: RefineLearningPathInputSchema,
    outputSchema: GenerateLearningPathOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to refine learning path. The AI model did not return a valid response.');
    }
    if (!output.learningPath || output.learningPath.length === 0) {
      throw new Error('AI response for refinement is missing the learning path.');
    }
    if (!output.recommendedResources || output.recommendedResources.length === 0) {
      throw new Error('AI response for refinement is missing recommended resources.');
    }
    return output;
  }
);
