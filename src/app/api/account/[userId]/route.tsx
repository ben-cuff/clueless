import { prismaLib } from "@/lib/prisma";
import {
  ForbiddenError,
  get200Response,
  get400Response,
  UnknownServerError,
} from "@/utils/api-responses";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(req: Request) {
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

  try {
    const deletedAccount = await prismaLib.account.delete({
      where: { id: userId },
    });

    return get200Response(deletedAccount);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return get400Response("User with that userId not found");
    }
    return UnknownServerError;
  }
}
