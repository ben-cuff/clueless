'use client';

import { COMPANY_LIST } from '@/constants/companies';
import useAddCompanyGoal from '@/hooks/use-add-company-goal';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';
import { MultiSelect } from '../ui/multi-select';

export default function GoalAddCompany({
  fetchGoal,
}: {
  fetchGoal: () => Promise<void>;
}) {
  const { companies, handleCompaniesChange, handleSubmitCompanies } =
    useAddCompanyGoal(fetchGoal);

  return (
    <Card className="mt-2">
      <CardHeader>Add Companies you want to target</CardHeader>
      <CardContent className="flex flex-col gap-4">
        <MultiSelect
          options={COMPANY_LIST.map((company) => company.readable)}
          selected={(companies ?? []).map((company) => company.readable)}
          onChange={handleCompaniesChange}
          placeholder="Select companies"
        />
        <Button className="self-end" onClick={handleSubmitCompanies}>
          Submit Companies
        </Button>
      </CardContent>
    </Card>
  );
}
