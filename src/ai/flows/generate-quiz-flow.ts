
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

export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: { schema: GenerateQuizInputSchema },
  output: { schema: GenerateQuizOutputSchema },
  prompt: `You are AIPath, an expert curriculum designer. Your goal is to create a quiz to test a user's knowledge based on a provided learning path.

Learning Path:
{{#each learningPath}}
- **{{this.title}}**: {{this.description}} (Key Topics: {{#if this.keyTopics}}{{#each this.keyTopics}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}N/A{{/if}})
{{/each}}

Instructions:
1.  Generate 5 multiple-choice questions that cover a range of topics from the learning path provided.
2.  The questions should be clear, concise, and relevant to the learning material.
3.  Each question must have a 'questionText' field.
4.  Each question must have an 'options' array with 4 string options.
5.  One of these options must be the correct answer.
6.  Each question must have a 'correctAnswer' field containing the exact string of the correct option.
7.  Each question must have an 'explanation' field that briefly explains why the correct answer is right. This will be shown to the user after they answer.
8.  The output MUST strictly follow the provided JSON schema.
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
    if (!output || !output.questions || output.questions.length === 0) {
      throw new Error('Failed to generate quiz. The AI model did not return valid questions.');
    }
    return output;
  }
);
