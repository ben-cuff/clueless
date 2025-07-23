'use client';

import { cn } from '@/lib/utils';
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
  const isActive = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        className,
        isActive
          ? 'text-primary font-semibold border-b-2 border-primary'
          : 'text-muted-foreground'
      )}
    >
      {children}
    </Link>
  );
}
