
'use server';
/**
 * @fileOverview Generates a quiz based on a given learning path.
 *
 * - generateQuiz - A function that handles the quiz generation process.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import { ai } from '@/ai/genkit';
import {
  GenerateQuizInputSchema,
  GenerateQuizOutputSchema,
} from '../schemas/quiz-schemas';
import type { GenerateQuizInput, GenerateQuizOutput } from '../schemas/quiz-schemas';

// Re-export types for client consumption
export type { QuizQuestion } from '../schemas/quiz-schemas';
export type { GenerateQuizInput, GenerateQuizOutput };


export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: { schema: GenerateQuizInputSchema },
  output: { schema: GenerateQuizOutputSchema },
  prompt: `You are an expert educator and quiz creator. Based on the provided learning path, create a short, multiple-choice quiz to test the user's knowledge on the key topics.

Learning Path Context:
{{#each learningPath.learningPath}}
Step: {{this.title}}
Description: {{this.description}}
Key Topics: {{#if this.keyTopics}}{{#each this.keyTopics}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}N/A{{/if}}
---
{{/each}}

Instructions:
1.  Generate exactly 5 multiple-choice questions.
2.  The questions should be directly relevant to the "Key Topics" listed in the learning path.
3.  Each question must have exactly 4 options.
4.  For each question, clearly specify the 'correctAnswer' which MUST be one of the provided options.
5.  For each question, provide a brief 'explanation' for why the correct answer is right. This helps the user learn.
6.  The quiz should cover a mix of topics from the different steps of the learning path.
7.  The output MUST strictly follow the provided JSON schema.
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

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output || !output.quiz || output.quiz.length === 0) {
      throw new Error('Failed to generate quiz. The AI model did not return valid questions.');
    }
    return output;
  }
);
