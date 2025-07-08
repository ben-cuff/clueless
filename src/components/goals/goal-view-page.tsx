import { Card, CardContent } from "@/components/ui/card";
import { Goal } from "@prisma/client";
import GoalProgress from "./goal-progress";
import UpdateGoal from "./update-goal";

export default function GoalViewPage({
  goal,
  userId,
}: {
  goal: Goal;
  userId: number;
}) {
  return (
    <>
      <Card className="max-w-md mx-auto mt-8">
        <CardContent>
          <div className="text-sm text-gray-600">
            {goal.seconds !== null && goal.seconds !== undefined && (
              <div>Seconds: {goal.seconds}</div>
            )}
            {goal.questions !== null && goal.questions !== undefined && (
              <div>Questions: {goal.questions}</div>
            )}
            <div>
              Begin At:{" "}
              {goal.beginAt ? new Date(goal.beginAt).toLocaleString() : "N/A"}
            </div>
            <div>
              End Date:{" "}
              {goal.endDate ? new Date(goal.endDate).toLocaleString() : "N/A"}
            </div>
          </div>
        </CardContent>
      </Card>
      <GoalProgress userId={userId} />
      <UpdateGoal />
    </>
  );
}
