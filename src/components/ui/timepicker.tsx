import { Clock8Icon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type TimePickerProps = {
  id?: string;
  label?: string;
  value: string; // "HH:mm" or ""
  onChange: (value: string) => void;
  disabled?: boolean;
};

const TimePicker = ({
  id,
  label,
  value,
  onChange,
  disabled,
}: TimePickerProps) => {
  // Ensure a string value for the native input (never undefined/null)
  const safeValue = value ?? "";

  return (
    <div className="w-full max-w-xs">
      {label ? <Label htmlFor={id}>{label}</Label> : null}
      <div className="relative">
        <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
          <Clock8Icon className="size-4" />
          <span className="sr-only">Time</span>
        </div>
        <Input
          type="time"
          id={id}
          step={60}
          value={safeValue}
          onChange={(e) => onChange(e.target.value)}
          className="peer bg-background appearance-none ps-9 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default TimePicker;
