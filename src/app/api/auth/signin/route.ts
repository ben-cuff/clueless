import { prismaLib } from "@/lib/prisma";
import argon2 from "argon2";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const user = await prismaLib.account.findUnique({
      where: { username },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Username or password incorrect" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const isValid = await argon2.verify(user.hashed_password, password);

    if (isValid) {
      return new Response(
        JSON.stringify({ message: "Login successful", user }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      return new Response(
        JSON.stringify({ error: "Username or password incorrect" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error during login:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
