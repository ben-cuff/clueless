import useAuth from "@/hooks/use-auth";
import { AccountAPI } from "@/utils/account-api";
import { act, renderHook } from "@testing-library/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

jest.mock("@/utils/account-api", () => ({
  AccountAPI: {
    createAccount: jest.fn(),
  },
}));

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("useAuth hook", () => {
  const mockRouter = { push: jest.fn() };
  const mockPreventDefault = jest.fn();
  const mockEvent = { preventDefault: mockPreventDefault };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    window.alert = jest.fn();
    console.error = jest.fn();
  });

  describe("login mode", () => {
    it("should call signIn with correct credentials and redirect on success", async () => {
      (signIn as jest.Mock).mockResolvedValue({ ok: true });

      const { result } = renderHook(() => useAuth("login"));

      act(() => {
        result.current.setUsername("testuser");
        result.current.setPassword("password123");
      });

      await act(async () => {
        await result.current.handleSubmit(mockEvent as any);
      });

      expect(mockPreventDefault).toHaveBeenCalled();
      expect(AccountAPI.createAccount).not.toHaveBeenCalled();
      expect(signIn).toHaveBeenCalledWith("credentials", {
        username: "testuser",
        password: "password123",
        redirect: false,
      });
      expect(mockRouter.push).toHaveBeenCalledWith("/");
    });

    it("should show alert when login fails", async () => {
      (signIn as jest.Mock).mockResolvedValue({ ok: false });

      const { result } = renderHook(() => useAuth("login"));

      act(() => {
        result.current.setUsername("testuser");
        result.current.setPassword("password123");
      });

      await act(async () => {
        await result.current.handleSubmit(mockEvent as any);
      });

      expect(console.error).toHaveBeenCalledWith("Login failed.");
      expect(window.alert).toHaveBeenCalledWith(
        "Login failed. Make sure you entered the correct username, and password"
      );
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  describe("register mode", () => {
    it("should create account and sign in on successful registration", async () => {
      (AccountAPI.createAccount as jest.Mock).mockResolvedValue({});
      (signIn as jest.Mock).mockResolvedValue({ ok: true });

      const { result } = renderHook(() => useAuth("register"));

      act(() => {
        result.current.setUsername("newuser");
        result.current.setPassword("password123");
        result.current.setConfirmPassword("password123");
      });

      await act(async () => {
        await result.current.handleSubmit(mockEvent as any);
      });

      expect(AccountAPI.createAccount).toHaveBeenCalledWith(
        "newuser",
        "password123"
      );
      expect(signIn).toHaveBeenCalledWith("credentials", {
        username: "newuser",
        password: "password123",
        redirect: false,
      });
      expect(mockRouter.push).toHaveBeenCalledWith("/");
    });

    it("should alert when password is too short", async () => {
      const { result } = renderHook(() => useAuth("register"));

      act(() => {
        result.current.setUsername("newuser");
        result.current.setPassword("short");
        result.current.setConfirmPassword("short");
      });

      await act(async () => {
        await result.current.handleSubmit(mockEvent as any);
      });

      expect(window.alert).toHaveBeenCalledWith(
        "Password must be at least 8 characters long"
      );
      expect(AccountAPI.createAccount).not.toHaveBeenCalled();
      expect(signIn).not.toHaveBeenCalled();
    });

    it("should alert when passwords do not match", async () => {
      const { result } = renderHook(() => useAuth("register"));

      act(() => {
        result.current.setUsername("newuser");
        result.current.setPassword("password123");
        result.current.setConfirmPassword("differentpassword");
      });

      await act(async () => {
        await result.current.handleSubmit(mockEvent as any);
      });

      expect(window.alert).toHaveBeenCalledWith(
        "Make sure the passwords are the same"
      );
      expect(AccountAPI.createAccount).not.toHaveBeenCalled();
      expect(signIn).not.toHaveBeenCalled();
    });
  });

  it("should expose state and setter functions", () => {
    const { result } = renderHook(() => useAuth("login"));

    expect(result.current.username).toBe("");
    expect(result.current.password).toBe("");
    expect(result.current.confirmPassword).toBe("");
    expect(typeof result.current.setUsername).toBe("function");
    expect(typeof result.current.setPassword).toBe("function");
    expect(typeof result.current.setConfirmPassword).toBe("function");
    expect(typeof result.current.handleSubmit).toBe("function");
  });
});
