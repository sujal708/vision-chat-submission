/**
 * @fileOverview Schemas for the video chatbot flow.
 */
import { z } from 'genkit';

// Input for the initial analysis (summary)
export const VideoAnalysisInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type VideoAnalysisInput = z.infer<typeof VideoAnalysisInputSchema>;

// Output of the initial analysis
export const VideoAnalysisOutputSchema = z.object({
  summary: z.string().describe('A concise and readable summary of the video content.'),
});
export type VideoAnalysisOutput = z.infer<typeof VideoAnalysisOutputSchema>;


// Input for the chat functionality
export const VideoChatbotInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  question: z.string().describe('The question about the video.'),
  videoSummary: z.string().optional().describe('The summary of the video. The model can use this for context but should rely on the video as the source of truth.'),
  chatHistory: z.string().optional().describe('The chat history.'),
});
export type VideoChatbotInput = z.infer<typeof VideoChatbotInputSchema>;

// Output for the chat functionality
export const VideoChatbotOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about the video.'),
});
export type VideoChatbotOutput = z.infer<typeof VideoChatbotOutputSchema>;
