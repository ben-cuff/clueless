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
        {[20, 50, 100].map((size) => (
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
