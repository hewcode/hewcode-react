import { Label } from '../ui/label.jsx';

export default function Textarea({
  name,
  label,
  value,
  onChange,
  error,
  required = false,
  placeholder = '',
  rows = null,
  maxLength = null,
  ...props
}) {
  return (
    <div className="space-y-2">
      {/* Label */}
      {label && <Label required={required}>{label}</Label>}
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        rows={rows || 4}
        maxLength={maxLength}
        disabled={false}
        className={`border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-red-500' : ''} `}
        {...(props || {})}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
