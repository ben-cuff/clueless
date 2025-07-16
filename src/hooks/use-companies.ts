import { COMPANY_LIST, CompanyInfo } from '@/constants/companies';
import { useCallback, useState } from 'react';

export default function useCompanies() {
  const [companies, setCompanies] = useState<CompanyInfo[]>();

  const handleCompaniesChange = useCallback((selected: string[]) => {
    const selectedCompanies = COMPANY_LIST.filter((company) =>
      selected.includes(company.readable)
    );
    setCompanies(selectedCompanies);
  }, []);

  return {
    companies,
    handleCompaniesChange,
  };
}
