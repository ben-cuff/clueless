'use client';

import { COMPANY_LIST } from '@/constants/companies';
import useAddCompany from '@/hooks/use-add-company';
import { ErrorBoundary } from 'react-error-boundary';
import CompaniesList from '../companies-list';
import ErrorFallback from '../error-fallback';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';
import { MultiSelect } from '../ui/multi-select';

export default function AddCompany() {
  const {
    companies,
    handleCompaniesChange,
    handleSubmitCompanies,
    currentCompanies,
    isLoading,
  } = useAddCompany();

  return (
    <ErrorBoundary
      fallback={<ErrorFallback text="Failed to render companies" />}
    >
      <Card className="mt-2">
        <CardHeader>Add Companies you want to target</CardHeader>
        <CardContent className="flex flex-col gap-4">
          {currentCompanies && (
            <CompaniesList
              companies={currentCompanies}
              text="Targeted Companies: "
              className="font-bold"
            />
          )}
          <MultiSelect
            options={COMPANY_LIST.map((company) => company.readable)}
            selected={(companies ?? []).map((company) => company.readable)}
            onChange={handleCompaniesChange}
            placeholder="Select companies"
          />
          <Button
            className="self-end"
            onClick={handleSubmitCompanies}
            disabled={isLoading}
          >
            Submit Companies
          </Button>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
}
