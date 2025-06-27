"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function AvatarDropdown() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Avatar className="rounded-4xl">
        <AvatarFallback>...</AvatarFallback>
      </Avatar>
    );
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn()}
        className="rounded-4xl hover:cursor-pointer"
      >
        <Avatar>
          <AvatarFallback>?</AvatarFallback>
        </Avatar>
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-4xl hover:cursor-pointer">
          <Avatar>
            <AvatarImage src={"https://github.com/shadcn.png"} />
            <AvatarFallback>{"U"}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()}>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
