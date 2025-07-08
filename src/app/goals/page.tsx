import GoalCalendar from "@/components/goals/goal-calendar";

export default function GoalPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Select Date Range</h1>
      <GoalCalendar />
    </div>
  );
}
