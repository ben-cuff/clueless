import DifficultyBadge from "@/components/difficulty-badge";
import { READABLE_DIFFICULTIES } from "@/constants/difficulties";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

describe("DifficultyBadge", () => {
  test("renders easy difficulty correctly", () => {
    render(<DifficultyBadge difficulty={1} />);
    const badge = screen.getByText(READABLE_DIFFICULTIES[1]);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-green-300");
    expect(badge).toHaveClass("text-green-800");
  });

  test("renders medium difficulty correctly", () => {
    render(<DifficultyBadge difficulty={2} />);
    const badge = screen.getByText(READABLE_DIFFICULTIES[2]);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-yellow-300");
    expect(badge).toHaveClass("text-yellow-800");
  });

  test("renders hard difficulty correctly", () => {
    render(<DifficultyBadge difficulty={3} />);
    const badge = screen.getByText(READABLE_DIFFICULTIES[3]);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-red-300");
    expect(badge).toHaveClass("text-red-800");
  });
});
