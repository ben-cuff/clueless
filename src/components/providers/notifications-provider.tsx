import {
  NotificationData,
  NotificationItem,
  NotificationType,
} from "@/types/notifications";
import { NotificationsAPI } from "@/utils/notifications-api";
import { millisecondsInHour, millisecondsInSecond } from "date-fns/constants";
import { useSession } from "next-auth/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import { toast } from "sonner";

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const POLL_INTERVAL = millisecondsInHour * 2; // notifies every 2 hours if notification is available
  const { data: session } = useSession();
  const router = useRouter();

  const fetchAndNotify = useCallback(async () => {
    if (Notification.permission === "granted" && session?.user.id) {
      const data: NotificationData = await NotificationsAPI.getNotification(
        session?.user.id
      );

      if (data?.notify && Array.isArray(data.notifications)) {
        showNotifications(data.notifications, router);
      }
    }
  }, [router, session?.user.id]);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    fetchAndNotify();
    const intervalId = setInterval(fetchAndNotify, POLL_INTERVAL);
    return () => clearInterval(intervalId);
  }, [POLL_INTERVAL, fetchAndNotify, router, session?.user.id]);

  return <>{children}</>;
};

function showNotifications(
  notifications: NotificationItem[],
  router: AppRouterInstance
) {
  notifications.forEach((notification, idx) => {
    setTimeout(() => {
      getToast(notification.text, notification.type, router);
    }, idx * millisecondsInSecond * 2); // puts a 2 second gap between each notification
  });
}

function getToast(
  text: string,
  type: NotificationType,
  router: AppRouterInstance
) {
  if (type === "GOAL_PROGRESS") {
    toast.success("🔔 Notification", {
      description: text,
      position: "top-right",
      action: {
        label: "View Goals",
        onClick: () => {
          router.push("/goals");
        },
      },
    });
  } else {
    toast.success("🔔 Notification", {
      description: text,
      position: "top-right",
    });
  }
}
