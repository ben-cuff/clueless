import GoalProgress from "./goal-progress";
import UpdateGoal from "./update-goal";

export default function GoalViewPage({
  fetchGoal,
}: {
  fetchGoal: () => Promise<void>;
}) {
  return (
    <div className="flex flex-row gap-6 m-6">
      <GoalProgress />
      <UpdateGoal fetchGoal={fetchGoal} />
    </div>
  );
}
