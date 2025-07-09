import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import FormField from "../ui/form-field";

export default function GoalCreateCard({
  title,
  description,
  goalValue,
  fieldId,
  fieldLabel,
  onValueChange,
  onSubmit,
  isDisabled,
}: {
  title: string;
  description: string;
  goalValue: number;
  fieldId: string;
  fieldLabel: string;
  onValueChange: (value: number) => void;
  onSubmit: () => void;
  isDisabled: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          id={fieldId}
          label={fieldLabel}
          type="number"
          value={goalValue}
          onChange={(e) => onValueChange(parseInt(e.target.value))}
          isDisabled={isDisabled}
          required
        />
      </CardContent>
      <CardFooter>
        <Button onClick={onSubmit}>Create Goal</Button>
      </CardFooter>
    </Card>
  );
}
