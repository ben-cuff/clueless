import TabsCalendarContainer from "./tabs-calendar-container";

export default function UpdateGoal({
  fetchGoal,
}: {
  fetchGoal: () => Promise<void>;
}) {
  return <TabsCalendarContainer fetchGoal={fetchGoal} type="update" />;
}
