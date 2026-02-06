import { useState } from 'react';
import useTranslator from '../../hooks/useTranslator.js';
import { Icon } from '../icon-registry';
import useWidgetPolling from './useWidgetPolling';

export default function ListWidget({ name, path, seal, label, items = [], emptyState, hasAction = false, refreshInterval, className = '' }) {
  const { __ } = useTranslator();
  // Use state to hold widget data that can be updated via polling
  const [widgetData, setWidgetData] = useState({
    label,
    items,
  });

  // Set up polling if refreshInterval is provided
  useWidgetPolling({
    name,
    path,
    refreshInterval,
    seal,
    onUpdate: (data) => {
      setWidgetData({
        label: data.label ?? widgetData.label,
        items: data.items ?? widgetData.items,
      });
    },
  });
  if (!widgetData.items || widgetData.items.length === 0) {
    return (
      <div className={`bg-box border-box-border rounded-lg border shadow-sm ${className}`}>
        {widgetData.label && (
          <div className="border-box-border border-b px-6 py-4">
            <h3 className="text-foreground text-lg font-semibold">{widgetData.label}</h3>
          </div>
        )}
        <div className="text-muted-foreground p-6 text-center">{emptyState || __('hewcode.common.no_items')}</div>
      </div>
    );
  }

  return (
    <div className={`bg-box border-box-border rounded-lg border shadow-sm ${className}`}>
      {widgetData.label && (
        <div className="border-box-border border-b px-6 py-4">
          <h3 className="text-foreground text-lg font-semibold">{widgetData.label}</h3>
        </div>
      )}
      <ul className="divide-border divide-y">
        {widgetData.items.map((item, index) => (
          <ListItem key={index} item={item} hasAction={hasAction} />
        ))}
      </ul>
    </div>
  );
}

function ListItem({ item, hasAction }) {
  const colorClasses = {
    primary: 'text-blue-600 dark:text-blue-400',
    secondary: 'text-gray-600 dark:text-gray-400',
    success: 'text-green-600 dark:text-green-400',
    danger: 'text-red-600 dark:text-red-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    info: 'text-cyan-600 dark:text-cyan-400',
  };

  const iconColorClass = item.color ? colorClasses[item.color] : 'text-muted-foreground';

  return (
    <li className={`px-6 py-4 ${hasAction ? 'hover:bg-muted/50 cursor-pointer' : ''}`}>
      <div className="flex items-start gap-3">
        {item.icon && (
          <div className="mt-0.5 flex-shrink-0">
            <Icon icon={item.icon} className={`h-5 w-5 ${iconColorClass}`} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          {item.description && <p className="text-foreground text-sm font-medium">{item.description}</p>}
          {item.time && <p className="text-muted-foreground mt-1 text-xs">{item.time}</p>}
        </div>
      </div>
    </li>
  );
}
