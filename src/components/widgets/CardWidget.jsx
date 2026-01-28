import { useState } from 'react';
import Actions from '../actions/Actions';
import { Icon } from '../icon-registry';
import useWidgetPolling from './useWidgetPolling';

export default function CardWidget({
  name,
  path,
  seal,
  heading,
  description,
  content,
  icon,
  color = 'primary',
  actions = {},
  refreshInterval,
  className = '',
}) {
  // Use state to hold widget data that can be updated via polling
  const [widgetData, setWidgetData] = useState({
    heading,
    description,
    content,
  });

  // Set up polling if refreshInterval is provided
  useWidgetPolling({
    name,
    path,
    refreshInterval,
    seal,
    onUpdate: (data) => {
      setWidgetData({
        heading: data.heading ?? widgetData.heading,
        description: data.description ?? widgetData.description,
        content: data.content ?? widgetData.content,
      });
    },
  });
  const iconColorClasses = {
    primary: 'text-blue-600 dark:text-blue-400',
    secondary: 'text-gray-600 dark:text-gray-400',
    success: 'text-green-600 dark:text-green-400',
    danger: 'text-red-600 dark:text-red-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    info: 'text-cyan-600 dark:text-cyan-400',
  };

  const iconColorClass = color ? iconColorClasses[color] : 'text-gray-600 dark:text-gray-400';

  return (
    <div className={`bg-box border-box-border rounded-lg border shadow-sm ${className}`}>
      {(widgetData.heading || icon) && (
        <div className="border-box-border border-b px-6 py-4">
          <div className="flex items-center gap-3">
            {icon && <Icon icon={icon} className={`h-5 w-5 ${iconColorClass}`} />}
            {widgetData.heading && <h3 className="text-foreground text-lg font-semibold">{widgetData.heading}</h3>}
          </div>
        </div>
      )}

      <div className="p-6">
        {widgetData.description && <p className="text-muted-foreground mb-4">{widgetData.description}</p>}

        {widgetData.content && (
          <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: widgetData.content }} />
        )}

        {actions && Object.keys(actions).length > 0 && (
          <div className="border-border mt-4 border-t pt-4">
            <Actions seal={seal} actions={actions} spacing="space-x-3" />
          </div>
        )}
      </div>
    </div>
  );
}
