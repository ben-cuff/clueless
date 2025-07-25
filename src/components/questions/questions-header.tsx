import { COMPANY_LIST, CompanyInfo } from '@/constants/companies';
import { TOPIC_LIST, TopicInfo } from '@/constants/topics';
import { Optional } from '@/types/util';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { MultiSelect } from '../ui/multi-select';
import DifficultySelect from './difficulty-select';

export default function QuestionsHeader({
  handleSearchInputChange,
  handleDifficultySelectChange,
  companies,
  handleCompaniesChange,
  topics,
  handleTopicsChange,
}: {
  handleSearchInputChange: (searchInput: string) => void;
  handleDifficultySelectChange: (difficulty: string) => void;
  companies: Optional<CompanyInfo[]>;
  handleCompaniesChange: (selected: string[]) => void;
  topics: Optional<TopicInfo[]>;
  handleTopicsChange: (selected: string[]) => void;
}) {
  return (
    <>
      <h1 className="w-full text-2xl font-bold mb-6">Questions</h1>
      <div className="flex flex-row text-2xl mb-2 space-x-2">
        <Label className="mr-4">Search:</Label>
        <Input
          placeholder="Search for questions..."
          onChange={(e) => handleSearchInputChange(e.target.value)}
        />
        <DifficultySelect
          handleDifficultySelectChange={handleDifficultySelectChange}
        />
      </div>
      <div className="flex flex-row space-x-2">
        <MultiSelect
          options={COMPANY_LIST.map((company) => company.readable)}
          selected={(companies ?? []).map((company) => company.readable)}
          onChange={handleCompaniesChange}
          placeholder="Select companies"
        />
        <MultiSelect
          options={TOPIC_LIST.map((topic) => topic.readable)}
          selected={(topics ?? []).map((topic) => topic.readable)}
          onChange={handleTopicsChange}
          placeholder="Select topics..."
        />
      </div>
    </>
  );
}
