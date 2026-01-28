import { Button } from '../ui/button.jsx';

const CompactButton = ({ children, variant = 'ghost', icon: Icon, disabled = false, onClick, className = '', ...props }) => {
  // Map custom variants to shadcn variants
  const variantMap = {
    primary: 'default',
    sage: 'secondary',
    success: 'default',
    danger: 'destructive',
    warning: 'secondary',
    info: 'secondary',
    neutral: 'ghost',
    dark: 'secondary',
  };

  const mappedVariant = variantMap[variant] || 'ghost';

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant={mappedVariant}
      size="sm"
      className={className}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4 mr-1" />}
      {children}
    </Button>
  );
};

export default CompactButton;