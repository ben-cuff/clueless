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

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const userId = Number(segments[segments.length - 2]);

    if (isNaN(userId)) {
      return get400Response("Invalid user ID");
    }

    const session = await getServerSession(authOptions);

    if (session?.user.id !== userId) {
      return ForbiddenError;
    }

    const { id, code } = await req.json();

    if (!id || !code) {
      return get400Response("Missing required fields: id, code");
    }

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
    console.error("Error updating code for interview: ", error);
    return UnknownServerError;
  }
}
