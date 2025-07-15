
'use server';
/**
 * @fileOverview Provides a conversational AI mentor for a given learning path.
 *
 * - chatWithMentor - A function that handles the conversational chat process.
 * - ChatWithMentorInput - The input type for the chatWithMentor function.
 * - ChatWithMentorOutput - The return type for the chatWithMentor function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { GenerateLearningPathOutputSchema } from '../schemas/learning-path-schemas';
import { ChatMessageSchema } from '../schemas/chat-schemas';

const ChatWithMentorInputSchema = z.object({
  learningPath: GenerateLearningPathOutputSchema.describe("The user's current learning path, to provide context for the conversation."),
  chatHistory: z.array(ChatMessageSchema).describe("The history of the conversation so far."),
});
export type ChatWithMentorInput = z.infer<typeof ChatWithMentorInputSchema>;


const ChatWithMentorOutputSchema = z.object({
  response: z.string().describe("The AI mentor's response to the user's message."),
});
export type ChatWithMentorOutput = z.infer<typeof ChatWithMentorOutputSchema>;


export async function chatWithMentor(input: ChatWithMentorInput): Promise<ChatWithMentorOutput> {
  return chatWithMentorFlow(input);
}

const mentorPrompt = ai.definePrompt({
  name: 'mentorPrompt',
  input: { schema: ChatWithMentorInputSchema },
  output: { schema: z.string().nullable() }, // The prompt can now return a string or null
  prompt: `You are an expert, friendly, and encouraging AI Mentor. Your purpose is to help a user with their personalized learning path.
Your responses should be concise, helpful, and directly related to the user's questions about their learning path.
Do not go off-topic. The user's learning path is provided below for your context.

Current Learning Path Context:
- Path Steps:
{{#each learningPath.learningPath}}
  - {{this.title}}: {{this.description}}
{{/each}}
- Recommended Resources:
{{#each learningPath.recommendedResources}}
  - {{this.title}} ({{this.type}}): {{this.briefExplanation}}
{{/each}}

Chat History:
{{#each chatHistory}}
  - {{this.role}}: {{this.content}}
{{/each}}

Based on the final user message in the chat history, provide a helpful response.
`,
});


const chatWithMentorFlow = ai.defineFlow(
  {
    name: 'chatWithMentorFlow',
    inputSchema: ChatWithMentorInputSchema,
    outputSchema: ChatWithMentorOutputSchema,
  },
  async (input) => {
    const { output } = await mentorPrompt(input);
    const response = output ?? "I'm sorry, I couldn't think of a response.";
    return { response };
  }
);
