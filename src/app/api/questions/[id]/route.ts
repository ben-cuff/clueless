import { prismaLib } from "@/lib/prisma";
import {
  get200Response,
  get400Response,
  get404Response,
  UnknownServerError,
} from "@/utils/api-responses";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numId = Number(id);

    console.log(numId);
    if (isNaN(numId)) {
      return get400Response("Invalid question number");
    }

    const question = await prismaLib.question.findUnique({
      where: { id: numId },
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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numId = Number(id);

    if (isNaN(numId)) {
      return get400Response("Invalid question ID");
    }
    try {
      const question = await prismaLib.question.delete({
        where: { id: numId },
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
