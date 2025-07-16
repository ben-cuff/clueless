import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import UserIdProvider from './providers/user-id-provider';

export default async function RouteProtector({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user.id) {
    redirect('/?error=unauthenticated');
  }

  return <UserIdProvider value={session.user.id}>{children}</UserIdProvider>;
}
