import { config } from 'dotenv';
config();

import '@/ai/flows/video-chatbot.ts';
// The following flows are no longer used by the main application logic,
// but are kept for reference or potential future use.
// import '@/ai/flows/frame-captioning.ts';
// import '@/ai/flows/video-summarization.ts';
