'use client';

import { Button } from '@/components/ui/button';
import { AccountAPIError, AuthError } from '@/errors/api-errors';
import { AccountAPI } from '@/utils/api/account-api';
import { errorLog } from '@/utils/logger';
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
      try {
        await AccountAPI.deleteAccount(session.user.id);
      } catch (error) {
        if (error instanceof AuthError) {
          alert(error.message);
        } else if (error instanceof AccountAPIError) {
          alert(error.message);
        } else {
          errorLog('Delete account error: ' + error);
        }
        return;
      }
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
