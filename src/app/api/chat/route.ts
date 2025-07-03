import { prismaLib } from "@/lib/prisma";
import { Question_Extended } from "@/types/question";
import { get400Response, UnknownServerError } from "@/utils/api-responses";
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
            candidateChunk.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
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
  const { messages, questionNumber, interviewId } = await req
    .json()
    .catch(() => {
      return get400Response("Invalid JSON body");
    });

  if (questionNumber && interviewId) {
    return get400Response(
      "Please provide either questionNumber or interviewId, not both."
    );
  }

  if (questionNumber || interviewId) {
    try {
      let prompt;
      if (questionNumber) {
        prompt = await getPromptFromQuestionNumber(questionNumber);
      } else {
        prompt = await getPromptFromInterviewId(interviewId);
      }

      messages.splice(1, 0, { role: "user", parts: [{ text: prompt }] });
    } catch (error) {
      return get400Response(
        error instanceof Error ? error.message : "Could not retrieve prompt"
      );
    }
  }

  if (!messages || !Array.isArray(messages)) {
    return get400Response("Invalid or missing messages array");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

  let response;
  try {
    response = await ai.models.generateContentStream({
      model: "gemini-2.0-flash",
      contents: messages,
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      error.status === 429 // Rate limit exceeded
    ) {
      return get400Response("Rate limit exceeded. Please try again later.");
    }
    return get400Response("Error generating content from AI model.");
  }

  try {
    const stream = await GoogleGenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Error processing AI response stream:", error);
    return UnknownServerError;
  }
}

async function getPromptFromQuestionNumber(id: number) {
  const question = await prismaLib.question.findFirst({
    where: { id },
    select: { prompt: true, title: true, solutions: true },
  });

  if (!question) {
    throw new Error("Question not found");
  }

  return getMessageFromQuestion(question as Question_Extended);
}

async function getPromptFromInterviewId(interviewId: string) {
  const interview = await prismaLib.interview.findUnique({
    where: { id: interviewId },
    include: {
      question: {
        select: {
          prompt: true,
          title: true,
          solutions: true,
        },
      },
    },
  });

  if (!interview || !interview.question) {
    throw new Error("Interview not found");
  }

  return getMessageFromQuestion(interview.question as Question_Extended);
}

function getMessageFromQuestion(question: Question_Extended) {
  let message = "";
  if (question.title) {
    message += `Title: ${question.title}`;
  }

  if (question.prompt) {
    message += `\n\nPrompt: ${question.prompt}`;
  }

  if (
    question.solutions &&
    typeof question.solutions === "object" &&
    "python" in question.solutions
  ) {
    // Hardcoded to Python solution as other language should be similar enough
    // to not require a different message format.
    const pythonSolution = (question.solutions as { python: string }).python;
    message += `\n\nSolutions:\n${pythonSolution}`;
  }
  return message;
}
