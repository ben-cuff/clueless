import { AccountAPI, handleAccountAPIError } from '@/utils/account-api';
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
      try {
        const { companies: updatedCompanies } =
          await AccountAPI.updateCompanies(session.user.id, companies ?? []);

        if (updatedCompanies) {
          setCurrentCompanies(updatedCompanies);
        }
        setIsLoading(false);
      } catch (error) {
        handleAccountAPIError(error);
      }
    }
  }, [companies, session?.user.id]);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      if (session?.user.id) {
        try {
          const updatedCompanies = await AccountAPI.getCompanies(
            session.user.id
          );

          setCurrentCompanies(updatedCompanies ?? []);
        } catch (error) {
          handleAccountAPIError(error);
          setCurrentCompanies([]);
          return;
        }
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
