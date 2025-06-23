import { prismaLib } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const questionNumber = Number(segments[segments.length - 1]);

    if (isNaN(questionNumber)) {
      return new Response(
        JSON.stringify({ error: "Invalid question number" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const question = await prismaLib.question.findUnique({
      where: { questionNumber },
    });

    if (!question) {
      return new Response(JSON.stringify({ error: "Question not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(question), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error during question retrieval:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const questionNumber = Number(segments[segments.length - 1]);

    if (isNaN(questionNumber)) {
      return new Response(
        JSON.stringify({ error: "Invalid question number" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    try {
      await prismaLib.question.delete({ where: { questionNumber } });
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error deleting question:", error);
      return new Response(JSON.stringify({ error: "Question not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error during question deletion:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
