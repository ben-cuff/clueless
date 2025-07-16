import TabsCalendarContainer from './tabs-calendar-container';

export default function CreateGoalPage({
  fetchGoal,
}: {
  fetchGoal: () => Promise<void>;
}) {
  return (
    <div className="flex justify-center w-full py-8">
      <div className="flex flex-col w-full max-w-2xl">
        <TabsCalendarContainer fetchGoal={fetchGoal} type="create" />
      </div>
    </div>
  );
}
