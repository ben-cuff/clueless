import { cluelessInteractionsLib } from '@/lib/interactions';
import {
  get200Response,
  get400Response,
  get500Response,
  UnknownServerError,
} from '@/utils/api/api-responses';
import { errorLog } from '@/utils/logger';
import type { Prisma as CluelessPrisma } from 'clueless-interactions/dist/generated/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';

export async function POST(req: Request) {
  let session;
  try {
    session = await getServerSession(authOptions);
  } catch {
    return UnknownServerError;
  }
  
  const userId = session?.user.id;

  let body;
  try {
    body = await req.json();
  } catch {
    return get400Response('Invalid JSON body');
  }

  const { pathname, eventName, value } = body;

  if (!eventName) {
    return get400Response('Missing eventName in request body');
  }

  try {
    const interaction = await cluelessInteractionsLib.addEvent(eventName, {
      userId,
      pathname,
      value,
    });

    return get200Response(interaction);
  } catch (error) {
    errorLog('Error while adding interaction event: ' + error);
    return get500Response('Server error while adding interaction event');
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const filters: InteractionFilters = {};

  // example: ?event=textarea_change+code_editor_change
  const eventParam = url.searchParams.get('event');
  if (eventParam) {
    filters.event = eventParam.split(' ').map((e) => e.trim());
  }

  // example: ?userId=1
  const userId = Number(url.searchParams.get('userId'));
  if (userId) {
    filters.context = [
      {
        contextField: 'userId',
        contextValue: userId,
      },
    ];
  }

  // example: ?contextField=pathname&contextValue=/interview/new&operation=string_starts_with
  const contextField = url.searchParams.getAll('contextField');
  const contextValue = url.searchParams.getAll('contextValue');
  const operation = url.searchParams.getAll('operation');

  if (contextField.length > 0 && contextValue.length > 0) {
    if (contextField.length !== contextValue.length) {
      return get400Response(
        'contextField and contextValue must have the same length'
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

  try {
    const interactions = await cluelessInteractionsLib.queryEvents(filters);

    return get200Response(interactions);
  } catch (error) {
    errorLog('Error while querying interactions: ' + error);
    return get500Response('Server error while querying interactions');
  }
}
type ContextFilters = {
  contextField?: string;
  contextValue?: unknown;
  operation?: CluelessPrisma.JsonFilter;
};

type InteractionFilters = {
  event?: string | string[];
  context?: ContextFilters[];
};
