import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prismaLib } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const userId = Number(segments[segments.length - 2]);

    if (isNaN(userId)) {
      return new Response(JSON.stringify({ error: "Invalid user ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const session = await getServerSession(authOptions);

    if (session?.user.id !== userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { id, code } = await req.json();

    if (!id || !code) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const interview = await prismaLib.interview.findUnique({
      where: { id },
    });

    if (!interview) {
      return new Response(JSON.stringify({ error: "Interview not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updatedInterview = await prismaLib.interview.update({
      where: { id },
      data: {
        code,
      },
    });

    return new Response(JSON.stringify(updatedInterview), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating code for interview: ", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
