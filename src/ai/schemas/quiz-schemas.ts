/**
 * @fileOverview Defines Zod schemas and TypeScript types for quiz generation.
 */

import { z } from 'zod';
import { GenerateLearningPathOutputSchema } from './learning-path-schemas';

export const QuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question text.'),
  options: z.array(z.string()).length(4).describe('An array of exactly 4 possible answers.'),
  correctAnswer: z.string().describe('The correct answer, which must match one of the options.'),
  explanation: z.string().describe('A brief explanation of why the answer is correct.'),
});
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

export const GenerateQuizInputSchema = z.object({
  learningPath: GenerateLearningPathOutputSchema.describe("The user's current learning path, used as context for the quiz."),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

export const GenerateQuizOutputSchema = z.object({
  quiz: z.array(QuizQuestionSchema).describe('A list of generated quiz questions.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;
