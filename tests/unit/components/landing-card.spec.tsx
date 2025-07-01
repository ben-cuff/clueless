import LandingCard from "@/components/landing-card";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

const push = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
}));

describe("Landing Page Card", () => {
  test("renders landing card correctly", () => {
    render(<LandingCard />);
    expect(
      screen.getByText(
        "An AI integrated interview platform. Get started below."
      )
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument();
  });

  test("login button clicked", () => {
    render(<LandingCard />);
    screen.getByRole("button", { name: "Login" }).click();
    expect(push).toHaveBeenCalledWith("/login");
  });

  test("signup/register button clicked", () => {
    render(<LandingCard />);
    screen.getByRole("button", { name: "Sign Up" }).click();
    expect(push).toHaveBeenCalledWith("/register");
  });
});
