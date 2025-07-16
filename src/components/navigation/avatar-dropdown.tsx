'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export default function AvatarDropdown() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <Avatar className="rounded-4xl">
        <AvatarFallback>...</AvatarFallback>
      </Avatar>
    );
  }

  if (!session) {
    return (
      <Button
        variant="ghost"
        onClick={() => signIn()}
        className="rounded-4xl cursor-pointer px-0 py-0"
      >
        <Avatar>
          <AvatarFallback>?</AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="rounded-4xl cursor-pointer px-0 py-0"
        >
          <Avatar>
            <AvatarImage src={'https://github.com/shadcn.png'} />
            <AvatarFallback>{'U'}</AvatarFallback>
          </Avatar>
        </Button>
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
