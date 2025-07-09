export default function GoalCalendarHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full items-center">
      <h1 className="text-xl font-bold mb-4">Select Date Range</h1>
      {children}
    </div>
  );
}
