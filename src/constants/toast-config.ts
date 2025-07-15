import { NotificationType } from "@/types/notifications";
import { toast } from "sonner";

type Position =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "bottom-center";

interface ToastConfigEntry {
  fn: (title: string, options: { description: string } & ToastOptions) => void;
  title: string;
  options: {
    position: Position;
  };
}

const toastConfigs: Record<NotificationType, ToastConfigEntry> = {
  [NotificationType.GOAL_PROGRESS]: {
    fn: toast.success,
    title: "🔔 Goal Update",
    options: { position: "top-right" },
  },
  [NotificationType.STREAK]: {
    fn: toast.success,
    title: "🔥 Streak Alert!",
    options: { position: "top-center" },
  },
  [NotificationType.GLOBAL]: {
    fn: toast.info,
    title: "🌍 Global Notification",
    options: { position: "top-center" },
  },
  [NotificationType.GENERAL]: {
    fn: toast.success,
    title: "🔔 Notification",
    options: { position: "top-right" },
  },
};

export { toastConfigs };
