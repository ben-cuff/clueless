import { GoalTabsType } from '@/types/goal-tab-type';
import TabsCalendarContainer from './tabs-calendar-container';

export default function UpdateGoal({
  fetchGoal,
}: {
  fetchGoal: () => Promise<void>;
}) {
  return (
    <TabsCalendarContainer fetchGoal={fetchGoal} type={GoalTabsType.UPDATE} />
  );
}
