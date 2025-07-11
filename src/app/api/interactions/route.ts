import { cluelessInteractionsLib } from "@/lib/interactions";
import { get200Response, get400Response } from "@/utils/api-responses";
import { debugLog } from "@/utils/logger";
import { Prisma } from "@prisma/client";
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
  const filters: InteractionFilters = {};

  // example: ?event=textarea_change+code_editor_change
  const eventParam = url.searchParams.get("event");
  if (eventParam) {
    filters.event = eventParam.split(" ").map((e) => e.trim());
  }

  // example: ?userId=1
  const userId = Number(url.searchParams.get("userId"));
  if (userId) {
    filters.context = [
      {
        contextField: "userId",
        contextValue: userId,
      },
    ];
  }

  // example: ?contextField=pathname&contextValue=/interview/new&operation=string_starts_with
  const contextField = url.searchParams.getAll("contextField");
  const contextValue = url.searchParams.getAll("contextValue");
  const operation = url.searchParams.getAll("operation");

  if (contextField.length > 0 && contextValue.length > 0) {
    if (contextField.length !== contextValue.length) {
      return get400Response(
        "contextField and contextValue must have the same length"
      );
    }

    filters.context = [
      ...(filters.context || []),
      ...contextField.map((field, index) => ({
        contextField: field,
        contextValue: contextValue[index],
        operation: operation[index]
          ? { [operation[index]]: contextValue[index] }
          : undefined,
      })),
    ];
  }

  const interactions = await cluelessInteractionsLib.queryEvents(filters);

  return get200Response(interactions);
}

type ContextFilters = {
  contextField?: string;
  contextValue?: unknown;
  operation?: Prisma.JsonFilter;
};

type InteractionFilters = {
  event?: string | string[];
  context?: ContextFilters[];
};
