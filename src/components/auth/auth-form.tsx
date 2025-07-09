"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import useAuth from "@/hooks/use-auth";
import FormField from "../ui/form-field";
import AuthSwitcher from "./auth-switcher";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const {
    handleSubmit,
    username,
    setUsername,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
  } = useAuth(mode);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSubmit}>
          <CardContent>
            <FormField
              id="username"
              label="Username:"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <FormField
              id="password"
              label="Password:"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {mode === "register" && (
              <FormField
                id="confirmPassword"
                label="Confirm Password:"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              {mode === "login" ? "Sign In" : "Register"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <AuthSwitcher mode={mode} />
    </div>
  );
}
