
/**
 * @fileOverview Defines Zod schemas and TypeScript types for chat functionality.
 */

import { z } from 'zod';

export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']).describe("The role of the message sender, either 'user' or 'model' (the AI)."),
  content: z.string().describe("The text content of the message."),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;
