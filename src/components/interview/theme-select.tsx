import { monacoThemes } from '@/lib/define-theme';
import { Theme } from '@/types/theme';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export default function ThemeSelect({
  handleThemeChange,
  theme,
}: {
  handleThemeChange: (theme: Theme) => void;
  theme: string;
}) {
  return (
    <Select value={theme} onValueChange={handleThemeChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select Theme" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(monacoThemes).map(([themeId, themeName]) => (
          <SelectItem key={themeId} value={themeId}>
            {themeName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
