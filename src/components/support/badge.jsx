import { Badge as ShadcnBadge } from '../ui/badge.jsx';

const Badge = ({ status, color = 'secondary' }) => {
  // Map custom color variants to shadcn variants
  const variantMap = {
    success: 'default',
    sage: 'secondary',
    gray: 'secondary',
    info: 'default',
    warning: 'outline',
    purple: 'secondary',
    danger: 'destructive',
    default: 'secondary',
    dark: 'secondary',
    slate: 'secondary',
    black: 'secondary',
  };

  const mappedVariant = variantMap[color] || 'secondary';

  return (
    <ShadcnBadge variant={mappedVariant}>
      {status}
    </ShadcnBadge>
  );
};

export default Badge;