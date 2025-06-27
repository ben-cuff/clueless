import { prismaLib } from "@/lib/prisma";
import argon2 from "argon2";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return new Response(
        JSON.stringify({ error: "Username and password are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const hashedPassword = await argon2.hash(password);

    if (!username || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing username or password",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    let user;
    try {
      user = await prismaLib.account.create({
        data: {
          username: username,
          hashedPassword,
        },
      });
      return new Response(JSON.stringify({ success: true, user }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2002"
      ) {
        return new Response(JSON.stringify({ error: "User already exists" }), {
          status: 409,
          headers: { "Content-Type": "application/json" },
        });
      } else {
        return new Response(
          JSON.stringify({ error: "Internal server error" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }
  } catch (error) {
    console.error("Error in registration:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
