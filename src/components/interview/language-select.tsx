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
  initialLanguage,
}: {
  handleLanguageChange: (language: LanguageOption) => void;
  initialLanguage: LanguageOption;
}) {
  return (
    <Select
      defaultValue={initialLanguage.id.toString()}
      onValueChange={(value) => {
        handleLanguageChange(
          languageOptions.find((lang) => lang.id.toString() === value) ??
            languageOptions[4]
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
