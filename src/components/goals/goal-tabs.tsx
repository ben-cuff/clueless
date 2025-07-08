import { Dispatch, SetStateAction } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import GoalCreateCard from "./goal-create-card";

export default function GoalsTabs({
  goalValue,
  setGoalValue,
  setGoalType,
  handleSubmitGoal,
  isDisabled,
}: {
  goalValue: number;
  setGoalValue: Dispatch<SetStateAction<number>>;
  handleSubmitGoal: () => Promise<void>;
  setGoalType: Dispatch<SetStateAction<"hours" | "questions">>;
  isDisabled: boolean;
}) {
  return (
    <Tabs
      defaultValue="hours"
      onValueChange={(value) => setGoalType(value as "hours" | "questions")}
      className="w-full"
    >
      <TabsList className="w-full">
        <TabsTrigger value="hours" className="flex-1" disabled={isDisabled}>
          Hours Goal
        </TabsTrigger>
        <TabsTrigger value="questions" className="flex-1" disabled={isDisabled}>
          Questions Goal
        </TabsTrigger>
      </TabsList>
      <TabsContent value="hours">
        <GoalCreateCard
          title="Hours Goal"
          description="Set a goal based on the number of hours you want to study."
          goalValue={goalValue}
          fieldId="hours-goal"
          fieldLabel="Total hours spent studying"
          onValueChange={setGoalValue}
          onSubmit={handleSubmitGoal}
          isDisabled={isDisabled}
        />
      </TabsContent>
      <TabsContent value="questions">
        <GoalCreateCard
          title="Questions Goal"
          description="Set a goal based on the number of questions you want to complete."
          goalValue={goalValue}
          fieldId="questions-amount"
          fieldLabel="Total questions to complete"
          onValueChange={setGoalValue}
          onSubmit={handleSubmitGoal}
          isDisabled={isDisabled}
        />
      </TabsContent>
    </Tabs>
  );
}
