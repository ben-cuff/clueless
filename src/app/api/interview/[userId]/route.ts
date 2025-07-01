import { prismaLib } from "@/lib/prisma";
import {
  ForbiddenError,
  get200Response,
  get201Response,
  get400Response,
  UnknownServerError,
} from "@/utils/api-responses";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const userId = Number(segments[segments.length - 1]);

    if (isNaN(userId)) {
      return get400Response("Invalid user ID");
    }

    const session = await getServerSession(authOptions);

    if (session?.user.id !== userId) {
      return ForbiddenError;
    }

    let id, messages, questionNumber, code, codeLanguage;
    try {
      ({ id, messages, questionNumber, code, codeLanguage } = await req.json());
    } catch {
      return get400Response("Invalid JSON body");
    }

    if (!id || !messages || !questionNumber || !code || !codeLanguage) {
      return get400Response(
        "Missing required fields: id, messages, questionNumber, code, codeLanguage"
      );
    }

    const interview = await prismaLib.interview.findUnique({
      where: { id },
    });

    if (interview) {
      const updatedInterview = await prismaLib.interview.update({
        where: { id },
        data: {
          messages,
          questionNumber,
          code,
          codeLanguage,
        },
      });
      return get200Response(updatedInterview);
    }

    const newInterview = await prismaLib.interview.create({
      data: {
        id,
        userId,
        messages,
        questionNumber,
        code,
        codeLanguage,
      },
    });

    return get201Response(newInterview);
  } catch (error) {
    console.error("Error during interview creation: ", error);
    return UnknownServerError;
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const userId = Number(segments[segments.length - 1]);

    if (isNaN(userId)) {
      return get400Response("Invalid user ID");
    }

    const session = await getServerSession(authOptions);

    if (session?.user.id !== userId) {
      return ForbiddenError;
    }

    const interviews = await prismaLib.interview.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: {
        question: {
          select: { title: true, difficulty: true },
        },
      },
    });

    return get200Response(interviews);
  } catch (error) {
    console.error("Error fetching interviews: ", error);
    return UnknownServerError;
  }
}
