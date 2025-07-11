import { cluelessInteractionsLib } from "@/lib/interactions";
import { get200Response, get400Response } from "@/utils/api-responses";
import { debugLog } from "@/utils/logger";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  const userId = session?.user.id;

  const { pathname, eventName, value } = await req.json().catch(() => {
    return get400Response("Invalid JSON body");
  });

  debugLog(
    "POST /api/interactions " + pathname + " " + eventName + " " + value
  );

  const interaction = await cluelessInteractionsLib.addEvent(eventName, {
    userId,
    pathname,
    value,
  });

  return get200Response(interaction);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = Number(url.searchParams.get("userId"));

  const filters: {
    event?: string;
    context?: {
      contextField?: string;
      contextValue?: unknown;
    }[];
  } = {};

  if (userId) {
    filters.context = [
      {
        contextField: "userId",
        contextValue: userId,
      },
    ];
  }

  const interactions = await cluelessInteractionsLib.queryEvents(filters);

  return get200Response(interactions);
}
