
/**
 * @fileOverview Defines Zod schemas and TypeScript types for quiz generation.
 */

import { z } from 'zod';
import { LearningStepSchema } from './learning-path-schemas';

export const QuizQuestionSchema = z.object({
  questionText: z.string().describe('The text of the quiz question.'),
  options: z.array(z.string()).length(4).describe('An array of 4 possible answers for the question.'),
  correctAnswer: z.string().describe('The correct answer from the options array.'),
  explanation: z.string().describe('A brief explanation of why the answer is correct.'),
});
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

export const GenerateQuizInputSchema = z.object({
  learningPath: z.array(LearningStepSchema).describe('The learning path to base the quiz on.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;


export const GenerateQuizOutputSchema = z.object({
  questions: z.array(QuizQuestionSchema).describe('An array of quiz questions.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;
