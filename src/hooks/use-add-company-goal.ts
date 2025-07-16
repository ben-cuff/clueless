import { GoalsAPI } from "@/utils/goals-api";
import { useSession } from "next-auth/react";
import { useCallback } from "react";
import useCompanies from "./use-companies";

export default function useAddCompanyGoal(fetchGoal: () => Promise<void>) {
  const { companies, handleCompaniesChange } = useCompanies();
  const { data: session } = useSession();

  const handleSubmitCompanies = useCallback(async () => {
    if (session?.user.id) {
      await GoalsAPI.UpdateGoalCompanies(session.user.id, companies ?? []);
      fetchGoal();
    }
  }, [companies, fetchGoal, session?.user.id]);

  return {
    companies,
    handleCompaniesChange,
    handleSubmitCompanies,
  };
}
