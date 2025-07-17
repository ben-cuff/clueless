import GoalAddCompany from './add-company';
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
        <GoalAddCompany />
      </div>
      <UpdateGoal fetchGoal={fetchGoal} />
    </div>
  );
}
