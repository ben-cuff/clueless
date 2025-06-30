import { prismaLib } from "@/lib/prisma";
import {
  get200Response,
  get400Response,
  get404Response,
  UnknownServerError,
} from "@/utils/api-responses";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const questionNumber = Number(segments[segments.length - 1]);

    if (isNaN(questionNumber)) {
      return get400Response("Invalid question number");
    }

    const question = await prismaLib.question.findUnique({
      where: { questionNumber },
    });

    if (!question) {
      return get404Response("Question not found");
    }

    return get200Response(question);
  } catch (error) {
    console.error("Error during question retrieval:", error);
    return UnknownServerError;
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const questionNumber = Number(segments[segments.length - 1]);

    if (isNaN(questionNumber)) {
      return get400Response("Invalid question number");
    }
    try {
      const question = await prismaLib.question.delete({
        where: { questionNumber },
      });
      return get200Response(question);
    } catch (error) {
      console.error("Error deleting question:", error);
      return get404Response("Question not found");
    }
  } catch (error) {
    console.error("Error during question deletion:", error);
    return UnknownServerError;
  }
}
