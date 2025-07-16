'use client';

import CreateGoalPage from '@/components/goals/create-goal-page';
import GoalViewPage from '@/components/goals/goal-view-page';
import InterviewLoading from '@/components/interview/interview-loading';
import useGoalPage from '@/hooks/use-goal-page';

export default function GoalPage() {
  const { isLoading, goal, fetchGoal } = useGoalPage();

  if (isLoading) {
    return <InterviewLoading />;
  }

  if (goal) {
    return <GoalViewPage fetchGoal={fetchGoal} />;
  }

  return <CreateGoalPage fetchGoal={fetchGoal} />;
}
