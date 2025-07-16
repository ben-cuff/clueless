'use client';

import { Button } from '@/components/ui/button';
import { AccountAPI } from '@/utils/account-api';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export default function SettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleDeleteUserAccount = useCallback(async () => {
    const confirmed = confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (!confirmed) return;
    if (session && session.user && session.user.id) {
      await AccountAPI.deleteAccount(session.user.id);
      await signOut({ redirect: false });
      router.push('/');
    }
  }, [session, router]);

  return (
    <div>
      <Button variant="destructive" onClick={() => handleDeleteUserAccount()}>
        Delete Account
      </Button>
    </div>
  );
}
