import { Input } from './input';
import { Label } from './label';

export default function FormField({
  id,
  label,
  type,
  value,
  onChange,
  required = true,
  isDisabled = false,
}: {
  id: string;
  label: string;
  type: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  isDisabled?: boolean;
}) {
  return (
    <div className="mb-4">
      <Label htmlFor={id} className="mb-1">
        {label}
      </Label>
      <Input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        disabled={isDisabled}
      />
    </div>
  );
}
