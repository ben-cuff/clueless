import { READABLE_COMPANIES } from '@/constants/companies';
import { Question } from '@prisma/client';

export default function CompaniesList({
  companies,
  text,
  className,
}: {
  companies: Question['companies'];
  text?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {text}
      {companies
        .map(
          (company) =>
            READABLE_COMPANIES[company as keyof typeof READABLE_COMPANIES]
        )
        .join(', ')}
    </div>
  );
}
