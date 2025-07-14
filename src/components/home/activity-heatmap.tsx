"use client";

import useActivityHeatmap from "@/hooks/use-activity-heatmap";
import { ErrorBoundary } from "react-error-boundary";
import CalendarHeatmap from "../calendar/calendar-heatmap";
import ErrorFallback from "../error-fallback";
import LoadingSpinner from "../loading-spinner";

export default function ActivityHeatmap() {
  const { isLoading, activity } = useActivityHeatmap();

  if (isLoading || !activity) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary
      fallback={<ErrorFallback text="Unable to show activity heatmap" />}
    >
      <CalendarHeatmap
        title="Your Activity from the Last Year"
        dateValues={activity}
      />
    </ErrorBoundary>
  );
}
