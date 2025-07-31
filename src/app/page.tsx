import AlertClient from '@/components/alert-client';
import ActivityHeatmap from '@/components/home/activity-heatmap';
import LandingCard from '@/components/landing-card';
import { NotificationProvider } from '@/components/providers/notifications-provider';
import { Button } from '@/components/ui/button';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { authOptions } from './api/auth/[...nextauth]/options';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const session = await getServerSession(authOptions);
  const { error } = await searchParams;

  if (!session?.user.id) {
    return (
      <div className="flex flex-col items-center justify-center h-[88vh]">
        <header className="w-full flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-5xl font-bold">Welcome to Clueless</h1>
        </header>
        <LandingCard />
        <AlertClient message={error} />
      </div>
    );
  }

  return (
    <NotificationProvider>
      <div className="flex flex-1 justify-center items-center text-center flex-col h-[88vh] p-6">
        <h1 className="text-4xl font-bold mb-4">Welcome to Clueless</h1>
        <div className="mb-4">
          <ActivityHeatmap />
        </div>
        <Link href="/interview">
          <Button>Get Started</Button>
        </Link>
        <AlertClient message={error} />
      </div>
    </NotificationProvider>
  );
}
