import { prismaLib } from "@/lib/prisma";
import {
  get200Response,
  get400Response,
  get401Response,
  UnknownServerError,
} from "@/utils/api-responses";
import argon2 from "argon2";

export async function POST(req: Request) {
  const { username, password } = await req.json().catch(() => {
    return get400Response("Invalid JSON body");
  });

  if (!username || !password) {
    return get400Response("Username and password are required");
  }

  try {
    const user = await prismaLib.account.findUnique({
      where: { username },
    });

    if (!user) {
      return get401Response("Username or password incorrect");
    }

    const isValid = await argon2.verify(user.hashedPassword, password);

    if (isValid) {
      return get200Response({
        message: "Login successful",
        user,
      });
    } else {
      return get401Response("Username or password incorrect");
    }
  } catch (error) {
    console.error("Error during user login:", error);
    return UnknownServerError;
  }
}
