import { CLUELESS_API_ROUTES } from '@/constants/api-urls';
import { CompanyInfo } from '@/constants/companies';
import { errorLog } from './logger';

export const AccountAPI = {
  createAccount: async (username: string, password: string) => {
    const response = await fetch(CLUELESS_API_ROUTES.createAccount, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(`Error: ${errorData.error}`);
      return;
    }
  },
  getCompanies: async (userId: number) => {
    const response = await fetch(
      CLUELESS_API_ROUTES.accountWithUserIdWithCompany(userId)
    );

    if (!response.ok) {
      errorLog('Failed to fetch companies: ' + response.statusText);
      return null;
    }

    const data = await response.json();
    return data;
  },
  UpdateCompanies: async (userId: number, companies: CompanyInfo[]) => {
    const companyEnums = companies.map((company) => company.db);

    const response = await fetch(
      CLUELESS_API_ROUTES.accountWithUserIdWithCompany(userId),
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companies: companyEnums }),
      }
    );

    if (!response.ok) {
      errorLog('Failed to update account companies: ' + response.statusText);
      return null;
    }

    const data = await response.json();

    return data;
  },
  deleteAccount: async (userId: number) => {
    const response = await fetch(
      CLUELESS_API_ROUTES.accountWithUserId(userId),
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      alert(`Unable to delete account: ${errorData.error}`);
      return;
    }
  },
};
