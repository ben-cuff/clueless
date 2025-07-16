'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

export default function LandingCard() {
  const router = useRouter();
  return (
    <Card className="w-full max-w-md mt-4">
      <CardContent className="py-6">
        <p className="text-center text-muted-foreground mb-6">
          An AI integrated interview platform. Get started below.
        </p>
        <div className="flex flex-col space-y-3">
          <Button
            onClick={() => {
              router.push('/login');
            }}
          >
            Login
          </Button>
          <Button
            onClick={() => {
              router.push('/register');
            }}
          >
            Sign Up
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
