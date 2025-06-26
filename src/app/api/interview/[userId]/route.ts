import { prismaLib } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const userId = Number(segments[segments.length - 1]);

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

    const { id, messages, questionNumber, code, codeLanguage } =
      await req.json();

    if (!id || !messages || !questionNumber || !code || !codeLanguage) {
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
      return new Response(JSON.stringify(updatedInterview), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
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

    return new Response(JSON.stringify(newInterview), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error during interview creation: ", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const userId = Number(segments[segments.length - 1]);

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

    const interviews = await prismaLib.interview.findMany({
      where: { userId },
    });

    return new Response(JSON.stringify(interviews), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching interviews: ", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}