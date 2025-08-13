
'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import Image from 'next/image';
import {
  Bot,
  User,
  SendHorizontal,
  Upload,
  Film,
  FileText,
  MessageSquare,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { analyzeVideoAction, chatWithVideoAction } from '@/lib/actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';


interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function VisionChat() {
  const { toast } = useToast();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoDataUri, setVideoDataUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [summary, setSummary] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userQuestion, setUserQuestion] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      const chatViewport = chatContainerRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if(chatViewport) {
        chatViewport.scrollTop = chatViewport.scrollHeight;
      }
    }
  }, [chatHistory, isChatting]);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Removed the size limit as the backend will handle the video now.
    // The API has a higher limit.

    const videoUrl = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoUrl(videoUrl);

    // Reset previous results
    setSummary('');
    setChatHistory([]);
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleProcessVideo = async () => {
    if (!videoFile) {
      toast({
        variant: 'destructive',
        title: 'No video selected',
        description: 'Please upload a video file first.',
      });
      return;
    }

    setIsProcessing(true);
    setProcessingStatus('Uploading and analyzing video... This may take a moment.');
    
    try {
      const dataUri = await readFileAsDataURL(videoFile);
      setVideoDataUri(dataUri);

      const result = await analyzeVideoAction({ videoDataUri: dataUri });
      
      setSummary(result.summary);

      setProcessingStatus('Analysis complete!');
      setTimeout(() => setIsProcessing(false), 1500);

    } catch (error) {
      const e = error as Error;
      toast({
        variant: 'destructive',
        title: 'Processing failed',
        description: e.message || 'An unknown error occurred.',
      });
      setIsProcessing(false);
    }
  };

  const handleChatSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim() || !summary || !videoDataUri) return;

    const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', content: userQuestion }];
    setChatHistory(newHistory);
    setUserQuestion('');
    setIsChatting(true);

    try {
      const formattedHistory = newHistory
        .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');
      
      const answer = await chatWithVideoAction({
        videoDataUri,
        question: userQuestion,
        videoSummary: summary,
        chatHistory: formattedHistory,
      });

      setChatHistory([...newHistory, { role: 'assistant', content: answer }]);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Chat error',
        description: 'Could not get a response from the assistant.',
      });
    } finally {
      setIsChatting(false);
    }
  };

  return (
    <main className="container mx-auto p-4 md:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary font-headline flex items-center justify-center gap-3">
          <Film className="w-10 h-10" />
          VisionChat
        </h1>
        <p className="text-muted-foreground mt-2">
          Upload a video to get an AI-powered analysis and chat about its contents.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="text-primary" /> 1. Upload & Process
            </CardTitle>
            <CardDescription>
              Select a video file (.mp4, .mov). The backend now handles long videos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <label
                htmlFor="video-upload"
                className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors"
              >
                {videoUrl ? (
                  <video ref={videoRef} src={videoUrl} controls className="w-full h-full object-contain rounded-lg" muted playsInline/>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                    <Film className="w-10 h-10 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">MP4 or MOV</p>
                  </div>
                )}
                <Input
                  id="video-upload"
                  type="file"
                  className="sr-only"
                  accept="video/mp4,video/mov"
                  onChange={handleVideoUpload}
                  disabled={isProcessing}
                />
              </label>
              <Button onClick={handleProcessVideo} disabled={!videoFile || isProcessing} className="w-full">
                {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                {isProcessing ? 'Processing...' : 'Process Video'}
              </Button>
            </div>
            {isProcessing && (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-muted-foreground text-center">{processingStatus}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="analysis" disabled={!summary}>
              <FileText className="mr-2 h-4 w-4" /> Analysis
            </TabsTrigger>
            <TabsTrigger value="chat" disabled={!summary}>
              <MessageSquare className="mr-2 h-4 w-4" /> Chat
            </TabsTrigger>
          </TabsList>
          <TabsContent value="analysis">
            <div className="space-y-6">
               <Card>
                <CardHeader>
                  <CardTitle>Video Summary</CardTitle>
                </CardHeader>
                <CardContent>
                   {isProcessing && !summary ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5" />
                    </div>
                  ) : summary ? (
                    <p className="text-sm text-foreground">{summary}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-10">
                      Process a video to see the summary here.
                    </p>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Key Frames & Captions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center py-10">
                    Frame-by-frame analysis is disabled for the final evaluation to support long-form video. The AI now analyzes the entire video for chat.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="chat">
            <Card>
              <CardHeader>
                <CardTitle>Chat with VisionBot</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex flex-col">
                  <ScrollArea className="flex-grow h-0" ref={chatContainerRef}>
                    <div className="space-y-4 p-4">
                      {chatHistory.length > 0 ? (
                        chatHistory.map((message, index) => (
                          <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                            {message.role === 'assistant' && (
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="h-5 w-5"/></AvatarFallback>
                              </Avatar>
                            )}
                            <div
                              className={`rounded-lg p-3 max-w-sm ${
                                message.role === 'user'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                            </div>
                             {message.role === 'user' && (
                              <Avatar className="h-8 w-8">
                                <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted-foreground py-10">
                          <MessageSquare className="mx-auto h-8 w-8 mb-2" />
                          <p>Ask a question about the video.</p>
                        </div>
                      )}
                      {isChatting && (
                         <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="h-5 w-5"/></AvatarFallback>
                            </Avatar>
                            <div className="rounded-lg p-3 max-w-sm bg-muted flex items-center">
                              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground"/>
                            </div>
                         </div>
                      )}
                    </div>
                  </ScrollArea>
                  <form onSubmit={handleChatSubmit} className="flex items-center gap-2 border-t p-4">
                    <Input
                      value={userQuestion}
                      onChange={(e) => setUserQuestion(e.target.value)}
                      placeholder="Ask about the video..."
                      disabled={isChatting}
                    />
                    <Button type="submit" size="icon" disabled={isChatting || !userQuestion.trim()}>
                      <SendHorizontal className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
