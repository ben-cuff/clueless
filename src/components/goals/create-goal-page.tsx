import TabsCalendarContainer from "./tabs-calendar-container";

export default function CreateGoalPage() {
  return (
    <div className="flex justify-center w-full py-8">
      <div className="flex flex-col w-full max-w-2xl">
        <TabsCalendarContainer type="create" />
      </div>
    </div>
  );
}
