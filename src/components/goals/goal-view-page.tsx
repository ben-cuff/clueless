import GoalAddCompany from './goal-add-company';
import GoalProgress from './goal-progress';
import UpdateGoal from './update-goal';

export default function GoalViewPage({
  fetchGoal,
}: {
  fetchGoal: () => Promise<void>;
}) {
  return (
    <div className="flex flex-row gap-6 m-6">
      <div className="flex flex-col w-full">
        <GoalProgress />
        <GoalAddCompany fetchGoal={fetchGoal} />
      </div>
      <UpdateGoal fetchGoal={fetchGoal} />
    </div>
  );
}
