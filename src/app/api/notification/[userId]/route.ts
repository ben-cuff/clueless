import redisLib from "@/lib/redis";
import {
  ForbiddenError,
  get200Response,
  get400Response,
  UnknownServerError,
} from "@/utils/api-responses";
import { checkIfGoalProgressNotification } from "@/utils/goal-progress";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolvedParams = await params;
  const userId = Number(resolvedParams.userId);

  if (isNaN(userId)) {
    return get400Response("Invalid user ID");
  }

  const session = await getServerSession(authOptions);

  if (session?.user.id !== userId) {
    return ForbiddenError;
  }

  const cacheKey = `notifications:${userId}`;
  const notifications = await redisLib.lRange(cacheKey, 0, -1);

  if (notifications.length > 0) {
    redisLib.del(cacheKey);
    return get200Response({
      notify: true,
      notifications: notifications.map((n) => JSON.parse(n)),
    });
  }

  return get200Response({ notify: false });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const MAX_GOAL_PROGRESS_NOTIFICATIONS_IN_PERIOD = 3;
  let notificationsAdded = 0;

  const resolvedParams = await params;
  const userId = Number(resolvedParams.userId);

  if (isNaN(userId)) {
    return get400Response("Invalid user ID");
  }

  const session = await getServerSession(authOptions);

  if (session?.user.id !== userId) {
    return ForbiddenError;
  }

  const cacheKey = `notification_progress_${userId}`;

  const cachedNotificationCount = await redisLib.get(cacheKey);
  if (
    !cachedNotificationCount ||
    !(
      parseInt(cachedNotificationCount) >=
      MAX_GOAL_PROGRESS_NOTIFICATIONS_IN_PERIOD
    )
  ) {
    const notificationResult = await checkIfGoalProgressNotification(
      userId,
      cacheKey,
      cachedNotificationCount
    ).catch(() => {
      return UnknownServerError;
    });

    if (typeof notificationResult === "number") {
      notificationsAdded += notificationResult;
    }
  }

  return get200Response({
    notify: notificationsAdded > 0,
    notificationsAdded,
  });
}
