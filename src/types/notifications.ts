export const NotificationType = {
  GOAL_PROGRESS: 'GOAL_PROGRESS',
  GENERAL: 'GENERAL',
  STREAK: 'STREAK',
  GLOBAL: 'GLOBAL',
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

type NotificationItem = {
  text: string;
  type: NotificationType;
};

type NotificationData = {
  notify: boolean;
  notifications?: NotificationItem[];
};

export type { NotificationData, NotificationItem };
