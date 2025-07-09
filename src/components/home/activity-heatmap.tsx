"use client";

import useActivityHeatmap from "@/hooks/use-activity-heatmap";
import CalendarHeatmap from "../calendar-heatmap";
import LoadingSpinner from "../loading-spinner";

export default function ActivityHeatmap() {
  const { isLoading, activity } = useActivityHeatmap();

  if (isLoading || !activity) {
    return <LoadingSpinner />;
  }

  return (
    <CalendarHeatmap
      title="Your Activity from the Last Year"
      dateValues={activity}
    />
  );
}
