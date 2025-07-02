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

  const { id, code } = await req.json().catch(() => {
    return get400Response("Invalid JSON body");
  });

  if (!id || !code) {
    return get400Response("Missing required fields: id, code");
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
      },
    });

    return get200Response(updatedInterview);
  } catch (error) {
    console.error("Error updating interview code:", error);
    return UnknownServerError;
  }
}
