import TabsCalendarContainer from "./tabs-calendar-container";

export default function CreateGoalPage() {
  return (
    <div className="flex flex-row gap-8 p-4 w-full justify-center">
      <TabsCalendarContainer type="create" />
    </div>
  );
}
