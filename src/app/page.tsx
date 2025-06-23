"use client";

import ThemeToggle from "@/components/theme/theme-toggle";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data, status } = useSession();

  if (status === "loading") {
    return <p>Loading</p>;
  }

  return (
    <>
      <Link href="/signin">Sign In</Link>
      <Link href="/signin">Register</Link>
      <button type="button" onClick={() => signOut()}>
        Sign Out
      </button>
      <ThemeToggle />
      <p>{data?.user?.username || "Not signed in"}</p>
      <p>{data?.user?.id || "Not signed in"}</p>
    </>
  );
}
