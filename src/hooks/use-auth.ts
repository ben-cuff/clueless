import { AccountAPI } from "@/utils/account-api";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export default function useAuth(mode: "login" | "register") {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (mode === "register") {
        if (password.length < 8) {
          alert("Password must be at least 8 characters long");
          return;
        }

        if (password !== confirmPassword) {
          alert("Make sure the passwords are the same");
          return;
        }

        await AccountAPI.createAccount(username, password);
      }

      const result = await signIn("credentials", {
        username: username,
        password: password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/");
        return;
      }

      alert(
        "Login failed. Make sure you entered the correct username, and password"
      );
    },
    [mode, username, password, confirmPassword, router]
  );

  return {
    handleSubmit,
    username,
    setUsername,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
  };
}
