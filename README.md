# VisionChat

## Project Overview

VisionChat is an AI-powered chat assistant that analyzes video content and allows users to have conversations about what's happening in the video. This project is designed to be a high-performance, scalable solution, optimized for low latency and handling long-form video content, addressing the challenges of Round 2. Users can upload a short video (up to 2 minutes), and the application will automatically extract key frames, generate descriptive captions, create a summary, and enable a conversational chat experience to ask detailed questions about the video's contents.Now its ready for round 2 requirements too but need to purchase Gemini API key.

## Tech Stack Justification

*   **Next.js**: Chosen for its robust, production-ready framework for React. Its features like API Routes, Server Components, Server Actions, and an intuitive App Router allow for building a fast, modern, and scalable application. This is ideal for our interactive and media-heavy application, enabling both a rich client-side experience and a powerful backend API.
*   **Genkit**: This open-source AI framework simplifies the development of AI-powered features. It provides a structured way to define AI flows, manage prompts, and integrate with models like Gemini, which was critical for building our video analysis and chatbot capabilities efficiently and in a scalable manner.
*   **Gemini Models (Google AI)**: We leverage the Gemini family of models for their powerful multimodal capabilities. The model's ability to reason over both text (summary, chat history) and video data simultaneously allows for highly accurate and context-aware responses to user queries, which is essential for meeting the low-latency query requirements.
*   **TypeScript**: Used throughout the project to ensure type safety, which helps in catching errors early, improving code quality, and making the codebase easier to maintain and refactor.
*   **ShadCN UI & Tailwind CSS**: This combination was selected for its modern, component-based approach to UI development. It allows for rapid creation of a beautiful, responsive, and accessible user interface while maintaining a high degree of customization.

## Setup and Installation Instructions

To run this application on your local machine, follow these steps:

### 1. Clone the Repository

First, clone the project from GitHub to your local machine:
```bash
git clone <your-repository-url>
cd <repository-directory>
```

### 2. Set Up Environment Variables

You'll need a Google AI API key to use the AI features.

1.  Create a file named `.env` in the root of the project.
2.  Add your API key to the `.env` file like this:

    ```
    GEMINI_API_KEY=your_google_ai_api_key
    ```
    Replace `your_google_ai_api_key` with your actual key from Google AI Studio.

### 3. Install Dependencies

Open your terminal, navigate to the project's root directory, and run the following command to install the necessary packages:

```bash
npm install
```

### 4. Run the Development Server

In your terminal, run the following command to start both the Next.js frontend and the Genkit AI backend concurrently:

```bash
npm run dev:concurrent
```

This will start the frontend on `http://localhost:9002` and the Genkit AI service. The API endpoint for evaluation will be available at `http://localhost:9002/api/infer`.

## Usage Instructions

### Using the Web Interface
1.  **Upload a Video**: Click the "Click to upload" area or drag and drop a video file (.mp4 or .mov) into the designated box. The video should be no longer than 2 minutes for the web UI.
2.  **Process the Video**: Once the video is uploaded, click the "Process Video" button. The application will:
    *   Extract key frames from the video.
    *   Generate a caption for each frame.
    *   Create a high-level summary of the entire video.
    *   You can track the progress with the status bar.
3.  **View Analysis**: After processing, the "Analysis" tab will be populated. You can browse through the extracted frames and their captions in a carousel and read the overall summary below it.
4.  **Chat with the AI**:
    *   Navigate to the "Chat" tab.
    *   Type a question about the video into the input box at the bottom.
    *   Press Enter or click the send button.
    *   The VisionBot will answer your question based on the video's content, summary, and your conversation history.

### Using the API Endpoint
The `/api/infer` endpoint is designed for the hackathon's evaluation system.

**Endpoint**: `POST /api/infer`
**Content-Type**: `multipart/form-data`
**Fields**:
*   `video`: The video file to be analyzed.
*   `prompt`: The question about the video.

**Example cURL Request**:
```bash
curl -X POST "http://<your-api-url>/api/infer" \
  -H "Content-Type: multipart/form-data" \
  -F "video=@/path/to/your/video.mp4" \
  -F "prompt=What is the main subject of the video?"
```

## Performance Benchmarks
*(This section should be filled out based on testing with the provided GPU infrastructure)*

**Latency:**
*   **Initial Measurement:** [e.g., ~1500ms from query to response on local machine]
*   **Optimized (GPU):** [Target: <1000ms]

**Throughput:**
*   **Video Processing:** [e.g., Time taken to process a 5-minute, 90fps video]
*   **Query Processing:** [e.g., Concurrent queries handled per second]

*   **Challenge 1: Scaling Video Processing:** Initial client-side processing was not viable for long-form, high-resolution video as required in Round 2. The solution was to move all heavy lifting to the backend, using server-side processing with Genkit to handle the video data directly.
*   **Challenge 2: Meeting Low-Latency Requirements:** Achieving sub-1000ms latency requires optimizing the entire inference pipeline. This involves choosing the right model (e.g., Gemini 2.0 Flash for speed) and ensuring the AI flow is streamlined. The Gemini model's ability to directly reason over video is key to avoiding slow, multi-step processing (e.g. frame extraction -> captioning -> summary -> chat).
*   **Learning 1: Backend vs. Frontend Processing:** A key takeaway was the importance of correctly architecting where data processing occurs. For scalable, high-performance applications, sensitive and intensive tasks must be handled on a powerful backend.
*   **Learning 2: Power of Multimodal Models:** Leveraging a true multimodal model like Gemini, which can understand video, images, and text in a single prompt, is significantly more efficient than stitching together multiple specialized models.

## Demo Video

[https://drive.google.com/file/d/1DWWP1gDkl6ZB2MYPM57_-U3Ho1pmm-AL/view?usp=sharing]

Note that Funding is required for proper configuration and setup as we need to purchase or take subscription of Gemini API KEY..
