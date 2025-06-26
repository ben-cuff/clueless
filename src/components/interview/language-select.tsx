import { LanguageOption, languageOptions } from "@/constants/language-options";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function LanguagesSelect({
  handleLanguageChange,
}: {
  handleLanguageChange: (language: LanguageOption) => void;
}) {
  return (
    <Select
      defaultValue="71" // python
      onValueChange={(value) => {
        handleLanguageChange(
          languageOptions.find((lang) => lang.id.toString() === value)!
        );
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Choose a language" />
      </SelectTrigger>
      <SelectContent>
        {languageOptions.map((language) => (
          <SelectItem key={language.id} value={language.id.toString()}>
            {language.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
