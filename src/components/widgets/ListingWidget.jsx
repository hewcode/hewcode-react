import { useState } from 'react';
import Listing from '../data-table/Listing';
import useWidgetPolling from './useWidgetPolling';

export default function ListingWidget({ name, path, seal, label, listing, compact = false, refreshInterval, className = '' }) {
  // Use state to hold widget data that can be updated via polling
  const [widgetData, setWidgetData] = useState({
    label,
  });

  // Set up polling if refreshInterval is provided
  // Note: Listing data itself is not updated via polling as Listing has its own refresh mechanisms
  useWidgetPolling({
    name,
    path,
    refreshInterval,
    seal,
    onUpdate: (data) => {
      setWidgetData({
        label: data.label ?? widgetData.label,
      });
    },
  });
  if (!listing) {
    return null;
  }

  return (
    <div className={`bg-box border-box-border rounded-lg border shadow-sm ${className}`}>
      {widgetData.label && (
        <div className="border-box-border border-b px-6 py-4">
          <h3 className="text-foreground text-lg font-semibold">{widgetData.label}</h3>
        </div>
      )}
      <div className={compact ? 'compact-listing' : ''}>
        <Listing {...listing} borderless={true} />
      </div>
    </div>
  );
}
