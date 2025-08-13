
import { NextRequest, NextResponse } from 'next/server';
import { videoChatbot } from '@/ai/flows/video-chatbot';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const videoFile = formData.get('video') as File | null;
    const prompt = formData.get('prompt') as string | null;

    if (!videoFile || !prompt) {
      return new NextResponse('Missing video or prompt', { status: 400 });
    }

    const videoBuffer = await videoFile.arrayBuffer();
    // Force the MIME type to video/mp4 to fix the upload issue.
    const videoDataUri = `data:video/mp4;base64,${Buffer.from(videoBuffer).toString('base64')}`;

    const result = await videoChatbot({
      videoDataUri: videoDataUri,
      question: prompt,
      // The video chatbot will need to handle summarization internally now
      // For the purpose of the endpoint, we pass an empty string for summary and history
      videoSummary: '', 
      chatHistory: '',
    });

    return new NextResponse(result.answer, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Error in /api/infer:', error);
    const e = error as Error;
    return new NextResponse(`An error occurred: ${e.message}`, { status: 500 });
  }
}
