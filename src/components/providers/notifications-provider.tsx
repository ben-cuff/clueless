'use client';

import { toastConfigs } from '@/constants/toast-config';
import {
  NotificationData,
  NotificationItem,
  NotificationType,
} from '@/types/notifications';
import { NotificationsAPI } from '@/utils/notifications-api';
import { millisecondsInMinute, millisecondsInSecond } from 'date-fns/constants';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect } from 'react';

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const POLL_INTERVAL = millisecondsInMinute; // checks for new notification once a minute
  const { data: session } = useSession();

  const fetchAndNotify = useCallback(async () => {
    if (Notification.permission === 'granted' && session?.user.id) {
      const data: NotificationData = await NotificationsAPI.getNotification(
        session?.user.id
      );

      if (data?.notify && Array.isArray(data.notifications)) {
        showNotifications(data.notifications);
      }
    }
  }, [session?.user.id]);

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (session?.user.id !== undefined) {
        await NotificationsAPI.postNotification(session.user.id);
      }
      await fetchAndNotify();
    })();
    const intervalId = setInterval(fetchAndNotify, POLL_INTERVAL);
    return () => clearInterval(intervalId);
  }, [POLL_INTERVAL, fetchAndNotify, session?.user.id]);

  return <>{children}</>;
};

function showNotifications(notifications: NotificationItem[]) {
  notifications.forEach((notification, idx) => {
    setTimeout(() => {
      getToast(notification.text, notification.type);
    }, idx * millisecondsInSecond * 2); // puts a 2 second gap between each notification
  });
}

function getToast(text: string, type: NotificationType): void {
  const config = toastConfigs[type];
  config.fn(config.title, { description: text, ...config.options });
}
