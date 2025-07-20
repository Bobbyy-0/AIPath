
'use server';
/**
 * @fileOverview Generates a random, interesting learning topic suggestion.
 *
 * - generateSuggestion - A function that suggests a topic.
 * - GenerateSuggestionOutput - The return type for the generateSuggestion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateSuggestionOutputSchema = z.object({
  suggestion: z.string().describe('The suggested learning topic.'),
});
export type GenerateSuggestionOutput = z.infer<typeof GenerateSuggestionOutputSchema>;

export async function generateSuggestion(): Promise<GenerateSuggestionOutput> {
  return generateSuggestionFlow();
}

const prompt = ai.definePrompt({
  name: 'generateSuggestionPrompt',
  output: { schema: GenerateSuggestionOutputSchema },
  prompt: `You are an AI that loves to spark curiosity.
Your goal is to suggest a single, interesting, and slightly niche topic for someone to learn about.
The topic should be something a motivated person could learn the basics of in a few weeks.
Do not provide any explanation, just the topic itself.

Examples:
- "The History of Cryptography"
- "Mycology and Fungi Identification"
- "Introduction to Quantum Computing"
- "The Art of Bonsai"
- "Principles of Game Theory"

Now, generate a new one.`,
    config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' }
    ]
  }
});


const generateSuggestionFlow = ai.defineFlow(
  {
    name: 'generateSuggestionFlow',
    outputSchema: GenerateSuggestionOutputSchema,
  },
  async () => {
    const { output } = await prompt({});
     if (!output) {
      throw new Error('Failed to generate a suggestion.');
    }
    return output;
  }
);
