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
    const { messages, questionNumber, interviewId } = await req.json();

    if (questionNumber) {
      try {
        const prompt = await getPromptFromQuestionNumber(questionNumber);
        messages.splice(1, 0, { role: "user", parts: [{ text: prompt }] });
      } catch {
        return get400Response(
          `Error fetching prompt for question number ${questionNumber}`
        );
      }
    }

    if (interviewId) {
      try {
        const prompt = await getPromptFromInterviewId(interviewId);
        messages.splice(1, 0, { role: "user", parts: [{ text: prompt }] });
      } catch {
        return get400Response(
          `Error fetching prompt for interview ID ${interviewId}`
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
        error.status === 429
      ) {
        return get400Response("Rate limit exceeded. Please try again later.");
      }
      return get400Response("Error generating content from AI model.");
    }

    const stream = await GoogleGenAIStream(response);

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return UnknownServerError;
  }
}

async function getPromptFromQuestionNumber(questionNumber: number) {
  const question = await prismaLib.question.findFirst({
    where: { questionNumber: questionNumber },
    select: { prompt: true, title: true, solutions: true },
  });

  if (!question) {
    throw new Error();
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
    throw new Error();
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
    const pythonSolution = (question.solutions as { python: string }).python;
    message += `\n\nSolutions:\n${pythonSolution}`;
  }
  return message;
}
