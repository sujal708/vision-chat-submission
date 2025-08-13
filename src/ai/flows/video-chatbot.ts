
'use server';
/**
 * @fileOverview A video chatbot AI agent that now handles full video processing and summarization.
 *
 * - videoChatbot - A function that handles the video chatbot process.
 * - analyzeVideoForUI - A function that generates a summary for the UI.
 */

import {ai} from '@/ai/genkit';
import {
    VideoAnalysisInput,
    VideoAnalysisInputSchema,
    VideoAnalysisOutput,
    VideoAnalysisOutputSchema,
    VideoChatbotInput,
    VideoChatbotInputSchema,
    VideoChatbotOutput,
    VideoChatbotOutputSchema
} from "@/ai/schemas/video-chatbot";

/**
 * This is the primary flow for the /api/infer endpoint.
 * It takes a video and a question and returns an answer.
 * It does NOT generate a summary first. It reasons over the video directly.
 */
export async function videoChatbot(input: VideoChatbotInput): Promise<VideoChatbotOutput> {
  return videoChatbotFlow(input);
}


const videoChatbotPrompt = ai.definePrompt({
  name: 'videoChatbotPrompt',
  input: {schema: VideoChatbotInputSchema},
  output: {schema: VideoChatbotOutputSchema},
  prompt: `You are a highly intelligent and meticulous video analysis assistant. Your task is to answer questions about a video with extreme accuracy and attention to detail.

When answering, pay close attention to the specifics of the user's question. If they ask you to count objects, count them carefully. If they ask for colors, identify them precisely. Do not make assumptions.

The video is the absolute source of truth. Use the summary and chat history for context only.

Video: {{media url=videoDataUri}}
{{#if videoSummary}}
Video Summary: {{{videoSummary}}}
{{/if}}
{{#if chatHistory}}
Chat History:
{{{chatHistory}}}
{{/if}}

Question: {{{question}}}

Provide a precise and detailed answer based on the video content.`,
});


const videoChatbotFlow = ai.defineFlow(
  {
    name: 'videoChatbotFlow',
    inputSchema: VideoChatbotInputSchema,
    outputSchema: VideoChatbotOutputSchema,
  },
  async (input) => {
    // This flow is now aligned with the Round 2 requirements:
    // it takes the video and question and gets an answer directly.
    const {output} = await videoChatbotPrompt(input);
    return output!;
  }
);

/**
 * This flow is for the UI. It takes a video and generates a summary.
 * It does not extract frames anymore, it asks the model to summarize the video.
 */
export async function analyzeVideoForUI(input: VideoAnalysisInput): Promise<VideoAnalysisOutput> {
    return videoAnalysisFlow(input);
}

const videoAnalysisPrompt = ai.definePrompt({
    name: 'videoAnalysisPrompt',
    input: { schema: VideoAnalysisInputSchema },
    output: { schema: VideoAnalysisOutputSchema },
    prompt: `You are an expert video summarizer. Watch the following video and create a concise, engaging, and readable summary of its content. Focus on creating a narrative flow.

Video: {{media url=videoDataUri}}
`,
});

const videoAnalysisFlow = ai.defineFlow(
    {
        name: 'videoAnalysisFlow',
        inputSchema: VideoAnalysisInputSchema,
        outputSchema: VideoAnalysisOutputSchema,
    },
    async (input) => {
        const { output } = await videoAnalysisPrompt(input);
        return output!;
    }
);
