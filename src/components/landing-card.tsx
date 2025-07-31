'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

export default function LandingCard() {
  const router = useRouter();
  return (
    <Card className="w-full max-w-2xl mt-10 shadow-xl border-0 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-150 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950">
      <CardContent className="py-12 px-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center mb-4 text-blue-900 dark:text-blue-200">
          Ace Your Next Interview with AI
        </h1>
        <p className="text-lg text-center text-muted-foreground mb-8 max-w-xl dark:text-gray-300">
          Practice, get feedback, and improve your interview skills with our
          AI-powered platform. Start your journey to landing your dream job
          today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Button
            size="lg"
            className="px-8 py-4 text-lg"
            onClick={() => router.push('/register')}
          >
            Get Started
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-4 text-lg"
            onClick={() => router.push('/login')}
          >
            Sign In
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
