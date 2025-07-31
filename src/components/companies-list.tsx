import { READABLE_COMPANIES } from '@/constants/companies';
import { cn } from '@/lib/utils';
import { Company, Question } from '@prisma/client';

export default function CompaniesList({
  companies,
  text,
  className,
}: {
  companies: Question['companies'];
  text?: string;
  className?: string;
}) {
  if (companies.length > 0) {
    return (
      <div className={cn(className, 'flex min-w-20')}>
        <p className="text-sm">
          {text}
          {companies
            .map((company) => READABLE_COMPANIES[company as Company])
            .join(', ')}
        </p>
      </div>
    );
  }
}
