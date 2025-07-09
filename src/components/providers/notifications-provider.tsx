import { MILLISECONDS_IN_SECOND, SECONDS_IN_HOUR } from "@/constants/time";
import { notificationsAPI } from "@/utils/notifications-api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

type NotificationData = {
  notify: boolean;
  message?: string;
};

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const POLL_INTERVAL = (SECONDS_IN_HOUR * MILLISECONDS_IN_SECOND) / 2; // notifies every half hour if there is a notification to show
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const fetchAndNotify = async () => {
      if (Notification.permission === "granted" && session?.user.id) {
        const data: NotificationData = await notificationsAPI.getNotification(
          session?.user.id
        );

        if (data?.notify) {
          toast.success("🔔 Notification", {
            description:
              data.message || "Check your dashboard for more details.",
            position: "top-right",
            action: {
              label: "View Goals",
              onClick: () => {
                router.push("/goals");
              },
            },
          });
        }
      }
    };
    fetchAndNotify();
    const intervalId = setInterval(fetchAndNotify, POLL_INTERVAL);
    return () => clearInterval(intervalId);
  }, [POLL_INTERVAL, router, session?.user.id]);

  return <>{children}</>;
};
