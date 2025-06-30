import { Button } from "@/components/ui/button";

export default function ToggleRecommendedButton({
  isHidden,
  toggleIsHidden,
}: {
  isHidden: boolean;
  toggleIsHidden: () => void;
}) {
  return (
    <Button
      onClick={toggleIsHidden}
      variant={!isHidden ? "outline" : "default"}
      className="absolute mt-20 top-0 right-0 hover:cursor-pointer"
    >
      {isHidden ? "Show Recommended" : "Hide Recommended"}
    </Button>
  );
}
