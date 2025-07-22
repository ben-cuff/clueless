import PROMPT_MESSAGES from '@/constants/prompt-messages';
import { NotFoundError } from '@/errors/not-found';
import { prismaLib } from '@/lib/prisma';
import { MessageRoleType } from '@/types/message';
import { get400Response, UnknownServerError } from '@/utils/api-responses';
import { errorLog } from '@/utils/logger';
import { GoogleGenAI } from '@google/genai';
import { Question } from '@prisma/client';

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
            candidateChunk.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
          if (text) {
            controller.enqueue(text);
          }
        }
      } catch (error) {
        errorLog('Error processing stream: ' + error);
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
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  }
}

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch {
    return get400Response('Invalid JSON body');
  }

  const { messages, questionNumber, interviewId } = body;

  if (questionNumber && interviewId) {
    return get400Response(
      'Please provide either questionNumber or interviewId, not both.'
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

      messages.splice(1, 0, {
        role: MessageRoleType.USER,
        parts: [{ text: prompt }],
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        return get400Response(error.message);
      } else {
        errorLog('Error fetching prompt: ' + error);
        return UnknownServerError;
      }
    }
  }

  if (!messages || !Array.isArray(messages)) {
    return get400Response('Invalid or missing messages array');
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

  let response;
  try {
    response = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: messages,
    });
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      error.status === 429 // Rate limit exceeded
    ) {
      errorLog(
        'Rate limit exceeded for Google GenAI: ' + JSON.stringify(error)
      );
      return get400Response('Rate limit exceeded. Please try again later.');
    }
    errorLog('Error generating content from AI model: ' + error);
    return get400Response('Error generating content from AI model.');
  }

  try {
    const stream = await GoogleGenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    errorLog('Error processing AI response stream: ' + error);
    return UnknownServerError;
  }
}

async function getPromptFromQuestionNumber(id: number) {
  const question = await prismaLib.question.findFirst({
    where: { id },
    select: { prompt: true, title: true, solutions: true },
  });

  if (!question) {
    throw new NotFoundError(`Question with ID ${id} not found.`);
  }

  return getMessageFromQuestion(question);
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
    throw new NotFoundError(
      `Interview with ID ${interviewId} not found or has no associated question.`
    );
  }

  return getMessageFromQuestion(interview.question);
}

function getMessageFromQuestion(question: Partial<Question>) {
  let message = '';
  if (question.title) {
    message += `Title: ${question.title}`;
  }

  if (question.prompt) {
    message += `\n\nPrompt: ${question.prompt}`;
  }

  if (
    question.solutions &&
    typeof question.solutions === 'object' &&
    'python' in question.solutions
  ) {
    // Hardcoded to Python solution as other language should be similar enough
    // to not require a different message format.
    const pythonSolution = question.solutions.python;
    message +=
      `\n\n${PROMPT_MESSAGES.SOLUTION_INCLUSION_MESSAGE}\n` +
      `Solutions:\n${pythonSolution}`;
  }
  return message;
}
