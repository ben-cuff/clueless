"use client";

import useActiveTime from "@/hooks/use-active-time";

export default function ActiveTimeTracker({
  children,
  maxLastActive,
  updatePeriod,
  userId,
}: {
  children: React.ReactNode;
  maxLastActive?: number;
  updatePeriod?: number;
  userId?: number;
}) {
  useActiveTime(maxLastActive, updatePeriod, userId);

  return <>{children}</>;
}
