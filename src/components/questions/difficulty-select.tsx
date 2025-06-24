import { DIFFICULTY_LIST } from "@/constants/difficulties";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function DifficultySelect({
  handleDifficultySelectChange,
}: {
  handleDifficultySelectChange: (difficulty: string) => void;
}) {
  return (
    <Select defaultValue="" onValueChange={handleDifficultySelectChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select Difficulty" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={"none"}>All</SelectItem>
        {DIFFICULTY_LIST.map((difficulty) => (
          <SelectItem key={difficulty.id} value={difficulty.id}>
            {difficulty.readable}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
