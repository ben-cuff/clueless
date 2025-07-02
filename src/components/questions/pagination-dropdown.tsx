import { TAKE_SIZES } from "@/constants/take-sizes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function PaginationDropdown({
  takeSize,
  handleTakeSizeChange,
}: {
  takeSize: number;
  handleTakeSizeChange: (size: number) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{takeSize} per page</DropdownMenuTrigger>
      <DropdownMenuContent>
        {TAKE_SIZES.map((size) => (
          <DropdownMenuItem
            key={size}
            onSelect={() => handleTakeSizeChange(size)}
            className={takeSize === size ? "font-bold" : ""}
          >
            {size}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
