import { NotificationProvider } from '@/components/providers/notifications-provider';
import RouteProtector from '@/components/route-protector';
import React from 'react';

export default function GoalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationProvider>
      <RouteProtector>{children}</RouteProtector>
    </NotificationProvider>
  );
}
