import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import { Input } from '../ui/input.jsx';
import IconButton from './icon-button.jsx';
import Label from './label.jsx';

const TextInput = ({
  value,
  onChange,
  label,
  description,
  error,
  required = false,
  prefixIcon,
  suffixIcon,
  suffixText,
  placeholder,
  disabled = false,
  className,
  inputClassName,
  revealable = false,
  seal,
  inputType = 'text',
  ...props
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const hasError = error && error.length > 0;
  const hasSuffix = suffixIcon || suffixText || (revealable && type === 'password');

  const SuffixIcon = suffixIcon;
  const PrefixIcon = prefixIcon;

  inputType = revealable && inputType === 'password' ? (isRevealed ? 'text' : 'password') : inputType;

  const toggleReveal = () => {
    setIsRevealed(!isRevealed);
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Label */}
      {label && <Label required={required}>{label}</Label>}

      {/* Input Container */}
      <div className="relative">
        {/* Prefix Icon */}
        {prefixIcon && (
          <PrefixIcon className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
        )}

        {/* Input */}
        <Input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            {
              'pl-10': prefixIcon,
              'pr-10': hasSuffix,
              'border-destructive': hasError,
            },
            inputClassName,
          )}
          {...props}
        />

        {/* Suffix Icon, Text, or Reveal Button */}
        {hasSuffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 transform">
            {revealable && type === 'password' ? (
              <IconButton
                icon={isRevealed ? EyeOff : Eye}
                variant="ghost"
                size="sm"
                onClick={toggleReveal}
                title={isRevealed ? 'Hide password' : 'Show password'}
                disabled={disabled}
              />
            ) : suffixIcon ? (
              <SuffixIcon className="text-muted-foreground h-5 w-5" />
            ) : (
              <span className="text-muted-foreground text-sm">{suffixText}</span>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {hasError && <p className="text-destructive mt-1 text-sm">{error}</p>}

      {/* Description */}
      {description && !hasError && <p className="text-muted-foreground mt-2 text-sm">{description}</p>}
    </div>
  );
};

export default TextInput;
