type NotificationType = "GOAL_PROGRESS" | "GENERAL";

type NotificationItem = {
  text: string;
  type: NotificationType;
};

type NotificationData = {
  notify: boolean;
  notifications?: NotificationItem[];
};

export type { NotificationType, NotificationItem, NotificationData };
