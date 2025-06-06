'use server';
/**
 * @fileOverview Generates a personalized learning path and resource recommendations.
 *
 * - generateLearningPath - A function that handles the learning path generation process.
 * - GenerateLearningPathInput - The input type for the generateLearningPath function.
 * - GenerateLearningPathOutput - The return type for the generateLearningPath function.
 * - LearningStep - Represents a single step in the learning path.
 * - LearningResource - Represents a recommended learning resource.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateLearningPathInputSchema = z.object({
  interests: z.string().describe('The user\'s interests, e.g., web development, machine learning.'),
  currentKnowledge: z.string().describe('The user\'s current knowledge level in their areas of interest.'),
  careerGoals: z.string().describe('The user\'s career goals.'),
});
export type GenerateLearningPathInput = z.infer<typeof GenerateLearningPathInputSchema>;

const LearningStepSchema = z.object({
  title: z.string().describe('A concise title for this learning step.'),
  description: z.string().describe('A brief explanation of what this step entails and its importance.'),
  keyTopics: z.array(z.string()).describe('A list of key topics or skills to learn in this step.'),
});
export type LearningStep = z.infer<typeof LearningStepSchema>;

const LearningResourceSchema = z.object({
  title: z.string().describe('The title of the recommended resource.'),
  url: z.string().describe('The URL to access the resource.'), // Removed .url()
  type: z.enum(['article', 'video', 'course', 'documentation', 'interactive_tutorial', 'book', 'tool']).describe('The type of the resource.'),
  briefExplanation: z.string().describe('A short explanation of why this resource is recommended and what it covers.'),
});
export type LearningResource = z.infer<typeof LearningResourceSchema>;

const GenerateLearningPathOutputSchema = z.object({
  learningPath: z.array(LearningStepSchema).describe('A structured, step-by-step learning path with 3-5 main steps.'),
  recommendedResources: z.array(LearningResourceSchema).describe('A list of 3-5 beginner-friendly online learning resources relevant to the path.'),
});
export type GenerateLearningPathOutput = z.infer<typeof GenerateLearningPathOutputSchema>;

export async function generateLearningPath(input: GenerateLearningPathInput): Promise<GenerateLearningPathOutput> {
  return generateLearningPathFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLearningPathPrompt',
  input: { schema: GenerateLearningPathInputSchema },
  output: { schema: GenerateLearningPathOutputSchema },
  prompt: `You are PathAI, an expert career counselor and curriculum designer. Your goal is to create a personalized, actionable, and encouraging learning path for users based on their inputs.

User Inputs:
- Interests: {{{interests}}}
- Current Knowledge: {{{currentKnowledge}}}
- Career Goals: {{{careerGoals}}}

Instructions:
1.  Generate a structured learning path consisting of 3 to 5 main steps. Each step should be a logical progression.
    *   For each step, provide a concise 'title', a 'description' (what the user will learn and why it's important), and a list of 'keyTopics' (specific skills or concepts).
2.  Recommend 3 to 5 beginner-friendly and highly-rated online resources (articles, videos, courses, documentation, interactive tutorials, books, or tools) that are directly relevant to the generated learning path.
    *   For each resource, provide its 'title', 'url', 'type', and a 'briefExplanation' of its relevance and content.
3.  Ensure the language is encouraging, clear, and motivating for someone looking to learn and grow.
4.  The output MUST strictly follow the provided JSON schema.
`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
       {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE',
      },
       {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_NONE',
      },
       {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_NONE',
      }
    ]
  }
});

const generateLearningPathFlow = ai.defineFlow(
  {
    name: 'generateLearningPathFlow',
    inputSchema: GenerateLearningPathInputSchema,
    outputSchema: GenerateLearningPathOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate learning path. The AI model did not return a valid response.');
    }
    // Basic validation to ensure the core structures are present
    if (!output.learningPath || output.learningPath.length === 0) {
      throw new Error('AI response is missing the learning path.');
    }
    if (!output.recommendedResources || output.recommendedResources.length === 0) {
      throw new Error('AI response is missing recommended resources.');
    }
    return output;
  }
);
