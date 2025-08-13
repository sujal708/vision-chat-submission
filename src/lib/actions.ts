
'use server';

// This file is being simplified. The UI will now use a single backend flow for analysis.
// The frame captioning and separate summarization flows are no longer needed for the UI.

import { 
  videoChatbot, 
  analyzeVideoForUI,
} from '@/ai/flows/video-chatbot';
import type { VideoChatbotInput, VideoAnalysisInput } from '@/ai/schemas/video-chatbot';

/**
 * This is the new primary action for the UI. It takes a video file,
 * sends it to the backend for analysis, and returns the summary.
 * All heavy lifting is done on the server.
 */
export async function analyzeVideoAction(
  input: VideoAnalysisInput
): Promise<{ summary: string }> {
  const result = await analyzeVideoForUI(input);
  // The UI expects frames, but our new flow doesn't generate them.
  // We can return an empty array for frames. The UI will handle this.
  // The most important part is the summary.
  return { summary: result.summary };
}


/**
 * This action is used by the frontend UI for the chat functionality.
 * It now correctly passes the full video data URI to the backend on every turn.
 */
export async function chatWithVideoAction(input: VideoChatbotInput): Promise<string> {
  const result = await videoChatbot(input);
  return result.answer;
}
