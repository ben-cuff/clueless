import { prismaLib } from "@/lib/prisma";
import {
  get200Response,
  get400Response,
  UnknownServerError,
} from "@/utils/api-responses";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  const interviewId = segments[segments.length - 1];

  if (!interviewId) {
    return get400Response("Invalid interview ID");
  }

  try {
    const feedback = await prismaLib.feedback.findUnique({
      where: { interviewId },
    });

    if (!feedback) {
      return get400Response("Feedback not found");
    }
    return get200Response(feedback);
  } catch {
    return UnknownServerError;
  }
}
