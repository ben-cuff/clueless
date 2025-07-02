import { prismaLib } from "@/lib/prisma";
import {
  get201Response,
  get400Response,
  get409Response,
  UnknownServerError,
} from "@/utils/api-responses";
import argon2 from "argon2";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return get400Response("Username and password are required");
    }

    const hashedPassword = await argon2.hash(password);

    try {
      const user = await prismaLib.account.create({
        data: { hashedPassword, username: username },
      });
      return get201Response({ success: true, user });
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2002"
      ) {
        return get409Response(
          "Username already exists. Please choose a different username."
        );
      } else {
        return UnknownServerError;
      }
    }
  } catch (error) {
    console.error("Error in registration:", error);
    return UnknownServerError;
  }
}
