import { CLUELESS_API_ROUTES } from '@/constants/api-urls';
import { CompanyInfo } from '@/constants/companies';
import { AccountAPIError, AuthError } from '@/errors/api-errors';
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
      if (response.status === 401 || response.status === 403) {
        throw new AuthError('Unauthorized to delete account');
      }
      throw new AccountAPIError(errorData.error || 'Failed to delete account');
    }

    return response.json();
  },
  getCompanies: async (userId: number) => {
    const response = await fetch(
      CLUELESS_API_ROUTES.accountWithUserIdWithCompany(userId)
    );

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 401 || response.status === 403) {
        throw new AuthError('Unauthorized to delete account');
      }
      throw new AccountAPIError(errorData.error || 'Failed to delete account');
    }

    return response.json();
  },
  updateCompanies: async (userId: number, companies: CompanyInfo[]) => {
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
      const errorData = await response.json();
      if (response.status === 401 || response.status === 403) {
        throw new AuthError('Unauthorized to delete account');
      }
      throw new AccountAPIError(errorData.error || 'Failed to delete account');
    }

    return response.json();
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
      if (response.status === 401 || response.status === 403) {
        throw new AuthError('Unauthorized to delete account');
      }
      throw new AccountAPIError(errorData.error || 'Failed to delete account');
    }

    return response.json();
  },
};

function handleAccountAPIError(error: unknown) {
  if (error instanceof AuthError) {
    alert(error.message);
  } else if (error instanceof AccountAPIError) {
    alert(error.message);
  } else {
    alert('An unexpected error occurred, please retry later');
    errorLog('Account API error: ' + error);
  }
}

export { handleAccountAPIError };
