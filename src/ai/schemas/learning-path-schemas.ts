/**
 * @fileOverview Defines Zod schemas and TypeScript types for learning path generation.
 * This file does not use 'use server' and can be imported by both server and client components for type information.
 */

import { z } from 'zod';

export const GenerateLearningPathInputSchema = z.object({
  interests: z.string().describe('The user\'s interests, e.g., web development, machine learning.'),
  currentKnowledge: z.string().describe('The user\'s current knowledge level in their areas of interest.'),
  careerGoals: z.string().describe('The user\'s career goals.'),
});
export type GenerateLearningPathInput = z.infer<typeof GenerateLearningPathInputSchema>;

export const LearningStepSchema = z.object({
  title: z.string().describe('A concise title for this learning step.'),
  description: z.string().describe('A brief explanation of what this step entails and its importance.'),
  keyTopics: z.array(z.string()).describe('A list of key topics or skills to learn in this step.'),
});
export type LearningStep = z.infer<typeof LearningStepSchema>;

export const LearningResourceSchema = z.object({
  title: z.string().describe('The title of the recommended resource.'),
  url: z.string().describe('The URL to access the resource.'),
  type: z.enum(['article', 'video', 'course', 'documentation', 'interactive_tutorial', 'book', 'tool']).describe('The type of the resource.'),
  briefExplanation: z.string().describe('A short explanation of why this resource is recommended and what it covers.'),
});
export type LearningResource = z.infer<typeof LearningResourceSchema>;

export const GenerateLearningPathOutputSchema = z.object({
  learningPath: z.array(LearningStepSchema).describe('A structured, step-by-step learning path with 3-5 main steps.'),
  recommendedResources: z.array(LearningResourceSchema).describe('A list of 3-5 beginner-friendly online learning resources relevant to the path.'),
});
export type GenerateLearningPathOutput = z.infer<typeof GenerateLearningPathOutputSchema>;
