import { Badge as ShadcnBadge } from '../ui/badge.jsx';
import { getTailwindBadgeClasses, isHexColor, getContrastColor } from '../../lib/colors.js';
import { cn } from '../../lib/utils.js';

export default function Fragment({ value }) {
  if (!(value instanceof Object) || !('__hcf' in value)) {
    return value;
  }

  if (value._badge) {
    const icon = value._badge.icon;
    const color = value._badge.color;
    const badgeProps = {
      variant: value._badge.variant || 'default',
    };

    // Apply color classes or inline styles based on color type
    const colorClasses = color && !isHexColor(color) ? getTailwindBadgeClasses(color) : '';
    const hexColor = color && isHexColor(color) ? color : null;
    const badgeStyle = hexColor ? {
      backgroundColor: hexColor,
      color: getContrastColor(hexColor),
      borderColor: hexColor,
    } : {};

    const iconElement = icon ? (
      <svg
        width={icon.size}
        height={icon.size}
        className="inline-block !size-auto flex-shrink-0"
        style={{ width: icon.size, height: icon.size }}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <use href={`#${icon.name}`} />
      </svg>
    ) : null;

    return (
      <ShadcnBadge
        {...badgeProps}
        className={cn(colorClasses)}
        style={badgeStyle}
      >
        {icon?.position === 'before' && iconElement}
        <Fragment value={value._badge.label} />
        {icon?.position === 'after' && iconElement}
      </ShadcnBadge>
    );
  }

  return <span className="hewcode-fragment">{value._text}</span>;
}
