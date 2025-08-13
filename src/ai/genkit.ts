
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {config} from 'dotenv';

config();

export const ai = genkit({
  plugins: [googleAI({
    apiKey: process.env.GEMINI_API_KEY
  })],
  // Switching to the latest stable and powerful model to ensure availability.
  model: 'googleai/gemini-1.5-pro-latest',
});

    