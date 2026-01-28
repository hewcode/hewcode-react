import { Button } from '../ui/button.jsx';

const IconButton = ({
  icon: Icon,
  variant = 'ghost',
  size = 'icon',
  outline = false,
  compact = false,
  disabled = false,
  onClick,
  className = '',
  title,
  ...props
}) => {
  // Map custom variants to shadcn variants
  const variantMap = {
    primary: outline ? 'outline' : 'default',
    success: outline ? 'outline' : 'default',
    danger: outline ? 'outline' : 'destructive',
    warning: outline ? 'outline' : 'secondary',
    info: outline ? 'outline' : 'secondary',
    neutral: outline ? 'outline' : 'ghost',
    dark: outline ? 'outline' : 'secondary',
  };

  const mappedVariant = variantMap[variant] || 'ghost';
  const mappedSize = compact ? 'sm' : size;

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant={mappedVariant}
      size={mappedSize}
      title={title}
      className={className}
      {...props}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
};

export default IconButton;