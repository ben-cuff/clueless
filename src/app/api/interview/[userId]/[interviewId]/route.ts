import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prismaLib } from "@/lib/prisma";
import {
  ForbiddenError,
  get200Response,
  get400Response,
  get404Response,
  UnknownServerError,
} from "@/utils/api-responses";
import { getServerSession } from "next-auth";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const userId = Number(segments[segments.length - 2]);
    const interviewId = segments[segments.length - 1];

    if (isNaN(userId)) {
      return get400Response("Invalid user ID");
    }
    if (!interviewId) {
      return get400Response("Invalid interview ID");
    }

    const session = await getServerSession(authOptions);
    if (session?.user.id !== userId) {
      return ForbiddenError;
    }

    const interview = await prismaLib.interview.findUnique({
      where: { id: interviewId, userId },
    });

    if (!interview) {
      return get404Response("Interview not found");
    }

    return get200Response(interview);
  } catch (error) {
    console.error("Error in getting a specific interview request:", error);
    return UnknownServerError;
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const userId = Number(segments[segments.length - 2]);
    const interviewId = segments[segments.length - 1];

    if (isNaN(userId)) {
      return get400Response("Invalid user ID");
    }

    if (!interviewId) {
      return get400Response("Invalid interview ID");
    }

    const session = await getServerSession(authOptions);
    if (session?.user.id !== userId) {
      return ForbiddenError;
    }

    try {
      const deletedInterview = await prismaLib.interview.delete({
        where: { id: interviewId, userId },
      });
      return get200Response(deletedInterview);
    } catch {
      return get404Response("Interview not found");
    }
  } catch (error) {
    console.error("Error deleting interview:", error);
    return UnknownServerError;
  }
}
