import { READABLE_COMPANIES } from "@/constants/companies";
import { Question } from "@/types/question";

export default function CompaniesList({
  companies,
}: {
  companies: Question["companies"];
}) {
  return (
    <div className="ml-5 font-bold">
      {companies
        .map((company: string) => READABLE_COMPANIES[company])
        .join(", ")}
    </div>
  );
}
