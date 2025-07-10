import { cluelessInteractionsLib } from "@/lib/interactions";
import { get200Response, get400Response } from "@/utils/api-responses";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  const userId = session?.user.id;

  const { pathname, eventName } = await req.json().catch(() => {
    return get400Response("Invalid JSON body");
  });

  const interaction = await cluelessInteractionsLib.addEvent(eventName, {
    userId,
    pathname,
  });

  return get200Response(interaction);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = Number(url.searchParams.get("userId"));

  const filters: {
    event?: string;
    contextField?: string;
    contextValue?: unknown;
  } = {};

  if (userId) {
    filters.contextField = "userId";
    filters.contextValue = userId;
  }

  const interactions = await cluelessInteractionsLib.queryEvents(filters);

  return get200Response(interactions);
}
