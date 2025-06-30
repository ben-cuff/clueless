import { prismaLib } from "@/lib/prisma";
import {
  ForbiddenError,
  get201Response,
  get400Response,
  get409Response,
  UnknownServerError,
} from "@/utils/api-responses";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export default async function POST(req: Request) {
  const { userId, interviewId, feedback } = await req.json();

  if (!userId || !interviewId || !feedback) {
    return get400Response(
      "Missing required fields: userId, interviewId, feedback"
    );
  }

  const session = await getServerSession(authOptions);

  if (session?.user.id !== userId) {
    return ForbiddenError;
  }

  const interview = await prismaLib.interview.findUnique({
    where: { id: interviewId },
  });

  if (!interview) {
    return get400Response("Interview not found");
  }

  try {
    const feedbackEntry = await prismaLib.feedback.create({
      data: {
        userId,
        interviewId,
        feedback,
      },
    });

    return get201Response(feedbackEntry);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return get409Response("Feedback for this interview already exists.");
    } else {
      return UnknownServerError;
    }
  }
}
