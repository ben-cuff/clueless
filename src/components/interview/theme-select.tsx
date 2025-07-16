import { monacoThemes } from '@/lib/define-theme';
import { Theme } from '@/types/theme';
import { useTheme } from 'next-themes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export default function ThemeSelect({
  handleThemeChange,
}: {
  handleThemeChange: (theme: Theme) => void;
}) {
  const { theme: systemTheme } = useTheme();
  return (
    <Select
      defaultValue={systemTheme === 'dark' ? 'vs-dark' : 'light'}
      onValueChange={handleThemeChange}
    >
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
