import React, { Suspense, lazy } from 'react';
import StatsWidget from './StatsWidget';
import ListWidget from './ListWidget';
import ListingWidget from './ListingWidget';
import CardWidget from './CardWidget';
import ChartWidget from './ChartWidget';
import InfoWidget from './InfoWidget';

const widgetComponentMap = {
  'stats': StatsWidget,
  'list': ListWidget,
  'listing': ListingWidget,
  'card': CardWidget,
  'chart': ChartWidget,
  'info': InfoWidget,
};

// Dynamically load custom widgets from resources/js/hewcode/widgets/
const customWidgets = import.meta.glob('/resources/js/hewcode/widgets/*.{jsx,tsx}');

function LoadingFallback() {
  return (
    <div className="bg-box border-box-border rounded-lg border shadow-sm p-6">
      <div className="flex items-center justify-center h-32">
        <div className="text-muted-foreground">Loading widget...</div>
      </div>
    </div>
  );
}

export default function Widget({ type, seal, ...props }) {
  // Check if it's a built-in widget
  let WidgetComponent = widgetComponentMap[type];

  // If not built-in, try to load custom widget
  if (!WidgetComponent) {
    const customWidgetPath = `/resources/js/hewcode/widgets/${type}.jsx`;
    const customWidgetTsxPath = `/resources/js/hewcode/widgets/${type}.tsx`;

    const widgetLoader = customWidgets[customWidgetPath] || customWidgets[customWidgetTsxPath];

    if (widgetLoader) {
      // Lazy load the custom widget
      WidgetComponent = lazy(widgetLoader);
    } else {
      console.warn(`Unknown widget type: ${type}. Expected file at ${customWidgetPath} or ${customWidgetTsxPath}`);
      return null;
    }
  }

  // Wrap custom widgets in Suspense
  if (!widgetComponentMap[type]) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <WidgetComponent seal={seal} {...props} />
      </Suspense>
    );
  }

  return <WidgetComponent seal={seal} {...props} />;
}
