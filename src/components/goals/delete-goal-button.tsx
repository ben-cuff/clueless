import { Button } from '../ui/button';

export default function DeleteGoalButton({
  handleDeleteGoal,
}: {
  handleDeleteGoal: () => Promise<void>;
}) {
  return (
    <Button
      variant="destructive"
      onClick={handleDeleteGoal}
      className="ml-auto mt-2"
    >
      Delete Goal
    </Button>
  );
}
