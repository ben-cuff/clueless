import PROMPT_MESSAGES from '@/constants/prompt-messages';
import { prismaLib } from '@/lib/prisma';
import { MessageRoleType } from '@/types/message';
import { QuestionPartial } from '@/types/question';
import getMessageObject from '@/utils/ai-message';
import {
  ForbiddenError,
  get200Response,
  get400Response,
  UnknownServerError,
} from '@/utils/api/api-responses';
import { debugLog, errorLog } from '@/utils/logger';
import { GoogleGenAI } from '@google/genai';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch {
    return get400Response('Invalid JSON body');
  }

  const session = await getServerSession(authOptions);

  if (!session?.user.id) {
    return ForbiddenError;
  }

  const { query } = body;

  if (!query || typeof query !== 'string') {
    return get400Response('Invalid query parameter');
  }

  const NUM_RANDOM_QUESTIONS = 100;

  let questions: QuestionPartial[] = [];
  try {
    // prisma does not support random ordering directly, so we use a raw query
    questions = await prismaLib.$queryRawUnsafe(
      `SELECT
          "id",
          "title",
          "difficulty",
          "topics",
          "prompt"
         FROM "Question" ORDER BY RANDOM() LIMIT ${NUM_RANDOM_QUESTIONS};`
    );
  } catch (error) {
    debugLog('Error fetching questions: ' + error);
    return UnknownServerError;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

  let response;
  try {
    response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-lite',
      contents: [
        getMessageObject(MessageRoleType.MODEL, JSON.stringify(questions)),
        getMessageObject(MessageRoleType.USER, query),
      ],
      config: {
        systemInstruction: PROMPT_MESSAGES.SYSTEM_MESSAGE_RECOMMENDED_QUESTIONS,
      },
    });
  } catch (error) {
    errorLog('Error generating content from AI model: ' + error);
    return get400Response('Error generating content from AI model.');
  }

  if (
    !response?.candidates ||
    !Array.isArray(response.candidates) ||
    !response.candidates[0]?.content?.parts ||
    !Array.isArray(response.candidates[0].content.parts) ||
    !response.candidates[0].content.parts[0]?.text
  ) {
    errorLog('No candidates returned from AI model');
    return get400Response('No relevant questions found.');
  }

  let questionIdList: { ids: number[] };
  try {
    // remove any code block formatting from the AI response
    const aiText = response.candidates[0].content?.parts[0].text.trim();
    console.log('AI Response:', aiText);
    const cleanedText = aiText.replace(/^```json|^```|```$/g, '').trim();
    questionIdList = JSON.parse(cleanedText);
  } catch (error) {
    errorLog('Error parsing AI response: ' + error);
    return get400Response('Error parsing AI response.');
  }

  if (!questionIdList || !Array.isArray(questionIdList.ids)) {
    errorLog('Invalid question ID list format from AI');
    return get400Response('Invalid question ID list format from AI.');
  }

  const aiQuestions: QuestionPartial[] = await prismaLib.question.findMany({
    where: {
      id: {
        in: questionIdList.ids,
      },
    },
    select: {
      id: true,
      title: true,
      accuracy: true,
      topics: true,
      prompt: true,
      companies: true,
      difficulty: true,
      createdAt: true,
      updatedAt: true,
      titleSlug: true,
    },
  });

  if (!aiQuestions || !Array.isArray(aiQuestions) || aiQuestions.length === 0) {
    return get400Response('No questions found for the given IDs');
  }

  return get200Response({
    questions: aiQuestions.splice(0, 10), // limit to 10 questions
  });
}
