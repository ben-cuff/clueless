"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Custom signin page for next-auth
export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      alert("Make sure the passwords are the same");
      return;
    }

    const response = await fetch(`/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(`Error: ${errorData.error}`);
      return;
    }

    await response.json();

    await signIn("credentials", {
      username: username,
      password: password,
      redirect: false,
    });

    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="mb-4">
              <Label htmlFor="username" className="mb-1">
                Username:
              </Label>
              <Input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <Label htmlFor="password" className="mb-1">
                Password:
              </Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <Label htmlFor="password" className="mb-1">
                Confirm Password:
              </Label>
              <Input
                type="password"
                id="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full hover:cursor-pointer">
              Register
            </Button>
          </CardFooter>
        </form>
      </Card>
      <Link
        href="/login"
        className="mt-4 inline-block text-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-gray-200 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Sign In
      </Link>
    </div>
  );
}
