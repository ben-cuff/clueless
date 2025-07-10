import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prismaLib } from "@/lib/prisma";
import { ActivityAPI } from "@/utils/activity-api";
import {
  ForbiddenError,
  get200Response,
  get400Response,
  get404Response,
  UnknownServerError,
} from "@/utils/api-responses";
import { errorLog } from "@/utils/logger";
import { Language } from "@prisma/client";
import { getServerSession } from "next-auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolvedParams = await params;
  const userId = Number(resolvedParams.userId);

  if (isNaN(userId)) {
    return get400Response("Invalid user ID");
  }

  const session = await getServerSession(authOptions);

  if (session?.user.id !== userId) {
    return ForbiddenError;
  }

  const { id, code, language } = await req.json().catch(() => {
    return get400Response("Invalid JSON body");
  });

  if (!id || !code || !language) {
    return get400Response("Missing required fields: id, code, language");
  }

  try {
    const interview = await prismaLib.interview.findUnique({
      where: { id },
    });

    if (!interview) {
      return get404Response("Interview not found");
    }

    const updatedInterview = await prismaLib.interview.update({
      where: { id },
      data: {
        code,
        codeLanguage: language.toUpperCase() as Language,
      },
    });

    // update the activity for the user if the code has changed
    if (interview.code !== code) {
      ActivityAPI.updateActivity(
        userId,
        "seconds",
        updatedInterview.updatedAt.getTime() - interview.createdAt.getTime()
      );
    }
    return get200Response(updatedInterview);
  } catch (error) {
    errorLog("Error updating interview code: " + error);
    return UnknownServerError;
  }
}
