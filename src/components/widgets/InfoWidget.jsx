import React from 'react';
import AppLogoIcon from '../layouts/app-logo-icon';
import { Icon } from '../icon-registry';

export default function InfoWidget({
  heading,
  description,
  icon,
  className = '',
}) {
  return (
    <div className={`bg-box border-box-border rounded-lg border shadow-sm p-6 ${className}`}>
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          {icon ? (
            <Icon icon={icon} className="h-12 w-12 text-foreground" />
          ) : (
            <AppLogoIcon className="h-12 w-12 text-foreground" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          {heading && (
            <h3 className="text-lg font-semibold text-foreground">{heading}</h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
