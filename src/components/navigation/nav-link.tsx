"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLink({
  href,
  children,
  className = '',
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`${className} ${
        isActive
          ? 'text-primary font-semibold border-b-2 border-primary'
          : 'text-muted-foreground'
      }`}
    >
      {children}
    </Link>
  );
}
