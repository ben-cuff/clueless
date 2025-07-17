import { AccountAPI } from '@/utils/account-api';
import { Company } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import useCompanies from './use-companies';

export default function useAddCompany() {
  const { companies, handleCompaniesChange } = useCompanies();
  const [currentCompanies, setCurrentCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  const handleSubmitCompanies = useCallback(async () => {
    if (session?.user.id) {
      setIsLoading(true);
      const { companies: updatedCompanies } = await AccountAPI.UpdateCompanies(
        session.user.id,
        companies ?? []
      );

      if (updatedCompanies) {
        setCurrentCompanies(updatedCompanies);
      }
      setIsLoading(false);
    }
  }, [companies, session?.user.id]);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      if (session?.user.id) {
        const updatedCompanies = await AccountAPI.getCompanies(session.user.id);

        setCurrentCompanies(updatedCompanies ?? []);
      }
      setIsLoading(false);
    })();
  }, [session?.user.id]);

  return {
    companies,
    handleCompaniesChange,
    handleSubmitCompanies,
    currentCompanies,
    isLoading,
  };
}
