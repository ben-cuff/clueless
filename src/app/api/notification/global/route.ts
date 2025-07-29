import redisLib from '@/lib/redis';
import {
  get200Response,
  get400Response,
  UnknownServerError,
} from '@/utils/api/api-responses';
import { errorLog } from '@/utils/logger';

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch {
    return get400Response('Invalid JSON body');
  }

  const { text } = body;

  if (typeof text !== 'string' || text.trim() === '') {
    return get400Response('Text must be a non-empty string');
  }

  try {
    await redisLib.publish(
      'notifications',
      JSON.stringify({
        type: 'GLOBAL',
        text,
      })
    );
  } catch (error) {
    errorLog('Error publishing global notification: ' + error);
    return UnknownServerError;
  }

  return get200Response({
    notify: true,
    message: 'Notification sent successfully',
  });
}
