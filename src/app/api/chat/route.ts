import { GoogleGenAI } from "@google/genai";

type GenAIChunk = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
};

async function GoogleGenAIStream(
  response: AsyncIterable<GenAIChunk>
): Promise<ReadableStream<string>> {
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of response) {
          const candidateChunk = chunk as GenAIChunk;
          const text =
            candidateChunk.candidates?.[0]?.content?.parts?.[0]?.text || "";
          if (text) {
            controller.enqueue(text);
          }
        }
      } catch (error) {
        console.error("Error processing stream:", error);
        controller.error(error);
      } finally {
        controller.close();
      }
    },
  });

  return stream;
}

class StreamingTextResponse extends Response {
  constructor(stream: ReadableStream) {
    super(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({
          error: "Invalid or missing 'messages' field",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

    const response = await ai.models.generateContentStream({
      model: "gemini-2.0-flash",
      contents: messages,
    });

    const stream = await GoogleGenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        message:
          "Failed to generate response, it is likely that messages were not formatted correctly or the API key is invalid/out of credits.",
      }),
      { status: 500 }
    );
  }
}
